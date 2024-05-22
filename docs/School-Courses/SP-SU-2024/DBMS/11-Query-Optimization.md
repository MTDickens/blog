# Recap & Introduction

上一次，我们讲到了各种算子（i.e. `SELECT WHERE _ = _` 和 `NATURAL JOIN ON _ = _`）以及一些 subroutine（i.e. 排序）的算法，以及每个算法的代价。

为每一个算子选择最好的算法，属于**物理优化**；如何恰当地决定算子的计算顺序，属于**逻辑优化**。

比如，下图中，将左侧的计算顺序变成右侧的计算顺序，就是逻辑优化：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_13_1_45_202405191301053.png" style="zoom: 80%;" />

- 这里，我们采用的是**经验优化**：选择运算和投影运算尽量早做

**Conclusion:** DBMS 一般而言**并不会暴力枚举**所有可能的计算树，而是**采用启发式的算法**来构建计算树

---

下图中，我们构造出 evaluation plan，就是物理优化：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_13_9_51_202405191309963.png" style="zoom:80%;" />

- 这里，`teaches` 和 `course` 采用 hash join 来联合，可能是考虑到 course 的规模比较小，可以无需 recursive hashing 就完成
- 而之后的 merge join，也是在进行代价估算之后，认为 merge 比两重循环更好一些

**Conclusion:** DBMS 会采用**代价估算**来物理优化每一个算子。对于中间结果，DBMS 会采用所谓的 **cardinality estimation**，来估算中间结果的规模，然后再进行代价估算。

# SQL 语句：`explain`

MySQL 可以使用 `explain <clause>` 来展示其内部的真正执行流程。比如：

对于这一条指令：

```mysql
EXPLAIN 
SELECT * 
FROM 
	(SELECT * FROM innodb_index_stats WHERE table_name = 'works') AS temp 
	INNER JOIN 
	innodb_index_stats ON temp.stat_value = innodb_index_stats.stat_value 
WHERE temp.stat_description > 'book_id';
```

结果就是：

| id   | select_type | table              | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra                                      |
| ---- | ----------- | ------------------ | ---------- | ---- | ------------- | ---- | ------- | ---- | ---- | -------- | ------------------------------------------ |
| 1    | SIMPLE      | innodb_index_stats | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 40   | 3.33     | Using where                                |
| 1    | SIMPLE      | innodb_index_stats | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 40   | 10.00    | Using where; Using join buffer (hash join) |

- 由于这个表非常的小，因此采用的是 hash join。
- 由于没有可用的 index（虽然 table_name 是主键之一，但是必须要所有主键才能用 index）。因此 `possible_keys` 一栏就是 NULL
    - 同样的还有 key 和 key_len
- 由于 attribute 没有索引，也不唯一，因此 type 就是 ALL（如果 attribute 是唯一的，那么就是 `const`）
- `filtered` 就是 **cardinality estimation**，比如，3.33 的意思就是：该操作预计执行之后只剩下 3.33% 的行数。

---

还可以使用树形结构来显示：

```mysql
EXPLAIN FORMAT=tree
SELECT * 
FROM 
	(SELECT * FROM innodb_index_stats WHERE table_name = 'works') AS temp 
	INNER JOIN 
	innodb_index_stats ON temp.stat_value = innodb_index_stats.stat_value 
WHERE temp.stat_description > 'book_id';
```

结果：

```
| -> Inner hash join (innodb_index_stats.stat_value = innodb_index_stats.stat_value)  (cost=9.84 rows=5.33)
    -> Table scan on innodb_index_stats  (cost=0.492 rows=40)
    -> Hash
        -> Filter: ((innodb_index_stats.`table_name` = 'works') and (innodb_index_stats.stat_description > 'book_id'))  (cost=4.25 rows=1.33)
            -> Table scan on innodb_index_stats  (cost=4.25 rows=40)
```

可见，MySQL 决定将两个 `WHERE` 合并执行，并且可以将 row 的数量迅速减少至 1.33 行（40 * 3.33 % = 1.33）。

然后再 join，join 之后，行数也只有预估 1.33 * 40 * 10% = 5.33 行。

# 优化方法

## 逻辑优化：等价规则

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_14_44_39_202405191444729.png" style="zoom:80%;" />

第一个规则：从左到右可能是因为有一个 attribute 有索引；从右到左可能是因为两个 attributes 都没有索引（因此还不如一起进行），或者两个 attributes 合在一起才是索引。

第二个规则：尽量将 filter 小/有索引的选择操作先做了。

第三个规则：由于 $L_1 \subset L_2 \subset \dots \subset L_n$，因此 $\prod_{L_1} = \prod_{L_1} \circ \dots \circ \prod_{L_n}$

第四个规则：简单来说，就是在 join 的同时，就把 selection 也给做了。这样可以让 join 操作的输出项减少，从而也许可以减少磁盘 I/O。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_15_3_45_202405191503251.png" style="zoom:80%;" />

第五\~六个规则：join 的两个 operands 可以任意交换、结合。

这个规则在某种意义上是可怕的，

- 结合律：如果有 n 个 join 语句，那么就有 n+1 个叶子节点，执行这些 join 语句的二叉树就有 2n+1 个节点
- 交换律：由于 operands 之间的顺序随意，因此 n+1 个叶子节点可以随便交换，共有 $(n+1)!$ 中情形

当然，这里面会有很多重复的情形，但是对于只包含 10 个 select 语句的执行树，其总数可达到千亿级别。我们根本无法枚举。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_15_26_30_202405191526005.png" style="zoom: 50%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_15_36_51_202405191536239.png" style="zoom:50%;" />

这个两个规则也是显然的。

左图中，我们通过更早的投影，可以让 E1, E2 的大小减小。

右图中，需要特别注意的就是，对于 $\cap, -$ 运算，$\sigma_\theta(E_1) \mathop{op} E_2 = \sigma_\theta(E_1) \mathop{op} \sigma_\theta(E_2)$

- 因为运算结果必然是 $\sigma_\theta(E_1)$ 的子集，而 $\sigma_\theta(E_1)$ 已经保证了 $\theta$ 条件。

---

规则还有很多，此处就不赘述了。

## 物理优化：代价估算的统计信息

为了对中间结果进行代价估算，我们需要用到统计信息。一般而言，重要的统计信息有以下几个：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_15_59_30_202405191559575.png" style="zoom: 67%;" />

其中，

- $n_r$ 显然需要数据库进行动态管理
- 对于定长 tuple 而言，$l_r$ 是实现已知的
- 假如所有 block 都装满了，那么就有 $f_r = \lfloor \frac{\text{size of a block}}{l_r} \rfloor$。
    - 但是实际上，每一块不一定装满，因此 $f_r$ 是需要数据库去进行统计的。
- 假如 r 的 tuples 均是连续存储，那么 $b_r = \lceil \frac {n_r} {f_r}\rceil$
    - 当然，有时候 r 的 tuples 不是连续存储
- $V(A,r)$ 显然也是需要数据库进行动态管理的（除了 key 和 UNIQUE 之外）
    - 通过 $V(A, r)$，可以做出一些很有效的估计。
        比如对于“性别”一栏，$V(gender, r) = 2$，我们可以估计每一种都占 50%。
        然后，如果需要 $\sigma_{gender = \dots}$​，那么直接顺序搜索即可，用不着 B+ 树索引啥的（即使有索引）
    - 不过，有一些属性在不同的值上的分布未必均匀，因此如果可以把“每一个 distinct value 有多少个”也储存下来，可以更加准确

### `SELECT` Size Estimation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_16_25_42_202405191625441.png" style="zoom:67%;" />

如上图，对于只有单个变量的 size estimation，可以通过上面的 heuristic 得出来。

### Complex `SELECT` Size Estimation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_16_39_28_202405191639358.png" style="zoom:80%;" />

对于多变量的情况，**假设不同变量之间相互独立**，那么就可以通过上面的方法来进行估计。

- 其中，中选率就是 $\frac{s_i}{n_r}$。如果 $\theta_i$​ 本身是简单条件，那么就可以通过 [`SELECT` Size Estimation](#`SELECT` Size Estimation) 估计出来
    - **注意：**$\theta_i$ 本身也可能是复合条件。

但是变量之间往往是不独立的。因此 state-of-the-art cost est 其实是采用了大模型等方式进行估计。

### Estimate the Size of `JOIN`s

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_21_17_11_202405222117726.png"/>

如图：

- 如果没有公共属性，那么就是简单的笛卡尔积，大小就**正好**是 n<sub>r</sub> &times; ns</sub>
- 如果公共属性是某一个是某一个 table 的 primary key/unique key——不妨假设是 r，那么大小**最大**也就是另一个 table 的大小——也就是 n<sub>s</sub>
    - 这是因为，如果公共属性是 r 的 primary key，那么 s 的每一个 row 至多匹配上 r 的一个 row
- 如果公共属性是某一个 table 的 **foreign key** referencing 另一个 table——不妨假设是 s foreign key referencing r，那么大小就**正好**是 n<sub>s</sub>
    - 这是因为，如果是 s 的 foreign key，那么 s 的每一 row 就必须**恰好**对应 r 的一个 row
- 如果和 primary key/unique 无关的话，那么就只能使用更加粗糙的估计。如下图：假设 R 中每一个 row 都可以匹配上 S 的一个 row，那么我们就关心的是：R 上的 row 平均可以匹配 S 上几个 row？一个 feasible 的估计就是：n<sub>s</sub> 除以 V(A,s)，也就是 S 的 A 属性的每个不同值的平均行数；如果 S 中每一个 row 都可以匹配上 R 的一个 row，情况类似。
    <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_21_42_56_202405222142583.png" style="zoom: 67%;" />

### Estimate Distinct Values

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_22_20_42_202405222220058.png" style="zoom:80%;" />

如图：对于一般的情况，我们就令 $V(A, \sigma_\theta(r)) = \min(V(A, r), n_{\sigma_\theta(r)})$。也就是说，selection 之后的 distinct values，一定既不大于比 selection 之前的，也肯定不会大于 select 之后的总条目数。

---

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_22_25_25_202405222225540.png" style="zoom:80%;" />

对于 JOIN 的 estimation，分上面两种情况。

## 逻辑优化：语句优化

## `JOIN`

 <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_23_35_19_202405222335488.png" style="zoom: 80%;" />

算法就是不断递归：对于每一个待 JOIN 的集合，都将其分成两个子集，然后继续递归。

时间复杂度可以这么算：

1. 首先，所有的 S 的子集都会被算一遍，因此这就是 $2^n$ 了
2. 其次，对于每一个 findbestplan(S)，都会过一遍 each non-empty subset of S，这就是 $\mathcal O(2^\abs{S})$ 了
3. 因此，总共就是 $\mathcal O(2^n + \sum_{i=1}^n \binom{n}{i} 2^i) = \mathcal O(2^n + 3^i) = \mathcal O(3^n)$​

对于 n=10 的情况，只有“区区” 59000，而不是 1760 亿。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_23_28_20_202405222328946.png" alt="image-20240522232817587" style="zoom:67%;" />

如果额外再加条件——每一次 join 的时候都需要包含一个 original relation，i.e. 不能是两个 intermediate relation join，那么，时间复杂度可以这么算：

1. 首先，所有的 S 的子集都会被算一遍，因此这就是 $2^n$ 了
2. 其次，对于每一个 findbestplan(S)，对其每一个节点执行，这就是 $\mathcal O(\abs{S})$ 了
3. 因此，总共就是 $\mathcal O(2^n + \sum_{i=1}^n \binom{n}{i} i) = \mathcal O(2^n + n \sum_{i=1}^n \binom{n-1}{i-1}) = \mathcal O(2^n)$

对于 n=10 的情况，只有 1024，真的是很小了。

## 其它语句

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_0_4_36_202405230004458.png"/>

对于 select 以外的其它语句，我们一般就直接使用 heuristic 方法了。

- 尽早 select
- 尽早 project
- 如果有多个 select，先进行更加 "restrictive" 的，也就是 with smallest resulting size
- 使用 left-deep join order 就行了，不需要使用 $\mathcal O(3^n)$ 的算法