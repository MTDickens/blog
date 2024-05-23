[TOC]

# Basics

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_5_21_55_202405130521125.png"/>

如上图，一个查询需要大致经历以下步骤：

1. parse and translate to **relation algebra expression**
2. convert to execution plan **with the help of statistics about data**
3. send to evaluation engine, which outputs the result

如下，左图是 parser and translator，左侧的比右侧的好；右图是 optimizer，对于每一个算子，我们选用不同的执行策略。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_6_5_28_202405130605806.png" style="zoom:50%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_6_5_40_202405130605790.png" style="zoom:50%;" />

---

我们的目标就是：

1. 学习每一种算子对应的常见算法
2. 学会如何衡量（每一种算法的）查询代价

# Measures of Query Cost

Cost contains many factors:

1. disk access
2. CPU
3. even network communication

一般而言，disk access 是 predominant cost，而且也比较容易衡量

## Disk Access

Disk access 分为三部分

1. Number of seeks
2. Number of block read
3. Number of block written

不过，为简单起见，2、3 可以合并成 number of block transfer

Number of seeks 和 number of transfers 如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_6_16_7_202405130616193.png"/>

不难发现：

1. $t_S \gg t_T$
2. 不同的磁盘，$\frac {t_S} {t_T}$ 也有所不同
3. 我们忽略 CPU Cost，实际上只是为了近似，在真实场景中，还是需要考虑的
4. 我们有时候会忽略最后一次写入磁盘操作，因为执行往往是流水线式的——上一条指令的结果，会直接传给下一条指令，而不写回磁盘
5. 另外，我们的数据在执行树上面是流水线式地传递，因此下层的算子不必处理完所有数据，再一并上传，而是执行一个就上传一个
    - 这样是不是可以避免内存用光，从而数据在磁盘和内存中反复倒腾
    - 是不是有点像 Haskell 的 lazy evaluation（当然只是**有点**像而已）？

**优化：**可以通过将数据存到 buffer 中，来减少 disk I/O

- 不过可用的 buffer 并不是事先可知的，我们只能在运行时得知
    - 依赖于其它的进程
- 我们一般都是用 worst case estimates
    - 比如，可能数据已经存到了 buffer 中，但是 worse case 中并没有，因此也算一次 disk I/O

# Operations

## `SELECT` operation

我们这里所谓的 `SELECT` 指的是 `SELECT ... FROM <SOME TABLE> WHERE <SOME CONDS>` 这样的语法。考虑的具体内容是”如何处理 `<CONDS>`“。

### Linear Scan

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_6_45_32_202405130645872.png" style="zoom: 80%;" />

如图，如果没有 index 或者 optimizer 认为大部分 records 都会命中，那么就采用**线性寻找**：

1. 最差情况：$b_r * t_T + t_S$
    - 只需要一次寻道
    - 之后就线性地读下去就好
2. 如果查找任务是“某 primary key（或者其它的 `UNIQUE` 属性）上的**等值查找**”，那么只要找到了一个就可以了，因此，**平均**情况是：$b_r / 2 * t_T + t_S$

### Using *Primary* Index on *Key*

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_6_50_49_202405130650324.png" style="zoom: 80%;" />

如图：

1. 因为在查找到 leaf node 之后，我们得到的结果只是指向真实数据的指针，因此，还需要再 seek+transfer 一次，也就是 $h_i + 1$

### Using *Primary* Index on *Non-Key*

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_6_57_0_202405130657160.png" style="zoom:80%;" />

如图：

1. 由于是 non-key，因此可能会有多个符合条件的 records
2. 在找到第一个 record 之后，由于是 **primary key**，search key 在内存中是有序的，i.e. 相同的值会排在一起。因此我们只需要顺序查找就好
    - 具体的 $b$ 需要根据实际情况估计

### Using *Secondary* Index on *Key*

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_7_5_37_202405130705373.png" style="zoom:80%;" />

只要是 key（或者更宽泛的说，只要是 `UNIQUE`），查找起来就很快，因为是唯一的。

### Using *Secondary* Index on *Non-Key*

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_7_8_52_202405130708759.png" style="zoom:80%;" />

Warning :warning:: This is **damn** expensive. 可能 more expensive than linear scan.

因为**不唯一**而且 **records 的磁盘顺序和 index 的顺序不同**，因此必须要在 index 的 leaf node 中存指向 records 的指针的列表。

因此：

1. 对于列表中的每一项，我们都需要进行一次 seek+transfer
2. 甚至，列表本身可能也一个 block 装不下
3. 一般而言，在重复 records 很多的时候，$n$ 是 predominant 的

## Sorting

如果内存足够，直接读到内存再排就行了。

在内存不够的情况下，我们需要通过所谓**外部排序**的算法，来进行排序。



我们使用归并排序，将内存分为：

- 输入缓冲：$N$ 块
- 输出缓冲：$1$ 块

其中，缓冲的块，大小一般是硬盘块的 $b_b$​ 倍。

首先，我们将待排序数据以 $mem\_size$​ 为单位读入，在内存中以快排等**原地**算法排好序之后，在放入硬盘。

- 我们称其为 sorted block

然后，对于 input buffer block，我们对应一个 sorted block；每一个这样对应的 sorted block，我们将其分成以 $buffer\_block\_size$ 大小的块，然后逐词将每一块写入对应的 input buffer block，并进行归并

- 如果 output buffer 满了，就将 buffer 写入 output 的位置，并（逻辑上）清空 buffer【实际上是将指针重新指向 buffer 的开头】
- 如果某一个 input buffer（逻辑上）空了，就将对应 sorted block 的下一个 buffer\_block\_size 大小的数据写入该 input buffer

**注意：**如果增加 buffer block 的大小，那么就会减少归并的段数，从而可能需要增加归并的次数。

### Cost Analysis: Simple Version

我们假设

1. 可用的内存为 $M$ (blocks)
2. 待排序数据为 $b_r$ (blocks)
3. 单位为 disk block
4. buffer block size = disk block size。

---

那么，total number of runs: $\lceil b_r / M \rceil$。也就是生成的 sorted block 的个数。

然后，我们需要进行 $\lceil \log_{M-1} (b_r / M) \rceil$​ 次 merge procedure。

- 因为内存中有 $M$ 个 buffer block，而 1 个作为输出，$M-1$ 个作为输入

因此，对于 **block transfer**：

- Initial sort: $2b_r$
    - 对于每一个硬盘上的块，读取一次到内存，然后写入一次到硬盘
- Merge Procedure: $2 b_r \lceil \log_{M-1} (b_r / M) \rceil$
    - 对于每一次 merge procedure，都需要把所有的块读到内存里，然后排序好了再写回硬盘上
- 因此，in total，$2 b_r \lceil \log_{M-1} (b_r / M) \rceil + 2b_r$
    - 如果该 sort 位于流水线的话，那么最后一次写操作就不算，总计就是 $b_r (2\lceil \log_{M-1} (b_r / M) \rceil + 1)$

对于 **block seek**：

- Initial sort: $2\lceil b_r / M \rceil$
    - e.g. 第一次读取硬盘待排序数据到内存的时候，先 seek 到 $0$-th block，然后一直顺序读到 $M-1$-th block。然后，排好序之后，再 seek 到 $0$-th block，然后一直顺序写到 $M-1$-th block。而这行为需要重复 $2\lceil b_r / M \rceil$ 次
- Merge Procedure: $2b_r \lceil \log_{M-1} (b_r / M) \rceil$
    - 我们需要总共读入、写出 $b_r$ blocks。虽然写入的块是连续的，读取的块也是连续的，但是读取和写入的块并不在一起。因此最坏是可以有 $2b_r \lceil \log_{M-1} (b_r / M) \rceil$ 那么多次的 seek。
- 因此，in total，$2 b_r \lceil \log_{M-1} (b_r / M) \rceil + 2\lceil b_r / M \rceil$
    - 如果该 sort 位于流水线的话，那么最后一次**写操作时的 seek** 就不算，总计就是 $b_r (2\lceil \log_{M-1} (b_r / M) \rceil - 1) + 2\lceil b_r / M \rceil$

### Cost Analysis: Advanced Version

我们假设

1. 可用的内存为 $M$ (blocks)
2. 待排序数据为 $b_r$ (blocks)
3. 单位为 disk block
4. **buffer block size = $b_b$**
    - i.e. buffer block 可以任意大

---

那么，total number of runs: $\lceil b_r / M \rceil$。也就是生成的 sorted block 的个数。

然后，我们需要进行 $\lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil$​ 次 merge procedure。

- 因为内存中有 $M$ 个 buffer block，而 1 个作为输出，$M-1$ 个作为输入

因此，对于 **block transfer**：

- Initial sort: $2b_r$
    - 对于每一个硬盘上的块，读取一次到内存，然后写入一次到硬盘
- Merge Procedure: $2 b_r \lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil$ ***(increased compared to simple version)***
    - 对于每一次 merge procedure，都需要把所有的块读到内存里，然后排序好了再写回硬盘上
- 因此，in total，$2 b_r \lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil + 2b_r$
    - 如果该 sort 位于流水线的话，那么最后一次写操作就不算，总计就是 $b_r (2\lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil + 1)$​

> 不难发现：**block transfer** 的次数，随着 $b_b$ 的增加而增加，根本原因是因为需要更多轮才能完成了。

对于 **block seek**：

- Initial sort: $2\lceil b_r / M \rceil$
    - e.g. 第一次读取硬盘待排序数据到内存的时候，先 seek 到 $0$-th block，然后一直顺序读到 $M-1$-th block。然后，排好序之后，再 seek 到 $0$-th block，然后一直顺序写到 $M-1$-th block。而这行为需要重复 $2\lceil b_r / M \rceil$ 次
- Merge Procedure: $2 \lceil b_r / b_b \rceil \lceil \lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil$ ***(decreased compared to simple version)***
    - 我们需要总共读入、写出 $b_r$ buffer blocks (that is made up of **consecutive** disk blocks)。
    - 虽然写入的块是连续的，读取的块也是连续的，但是读取和写入的 buffer 块并不在一起。因此最坏是可以有 $2 \lceil b_r / b_b \rceil \lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil$ 那么多次的 seek
- 因此，in total，$2 \lceil b_r / b_b \rceil \lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil + 2\lceil b_r / M \rceil$
    - 如果该 sort 位于流水线的话，那么最后一次**写操作时的 seek** 就不算，总计就是 $2 \lceil b_r / b_b \rceil \lceil \log_{\lfloor M / b_b\rfloor -1} (b_r / M) \rceil + \lceil b_r / M \rceil$

> 不难发现：**block seek** 的次数，随着 $b_b$ 的增加而减少，根本原因是因为每一次是成批量地写入和读取连续的 disk block。

## `JOIN` operation

**注意：**由于在流水线上，我们并不需要将结果写回文件（硬盘），

### Nested-Loop Join

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_0_19_41_202405140019991.png" style="zoom: 80%;" />

如上图，使用双重循环来 join 两个 tables，分为 outer 和 inner。Inner 的每一块需要被**反复**访问，而 outer 的每一块只需要被访问一次。

因此，estimated worst cost 是（$n_r = \# \text{ of records in r}$）：

- block transfer: $n_r * b_s + b_r$
    - 对于每一个 record of r，都需要完整地访问所有 $b_s$ 的 block，因此是 $n_r * b_s$​
    - 而 $b_r$ 的每一个 block 只需要被访问一次，因此就是 $b_r$

- block seek: $n_r + b_r$​
    - 对于每一个 record of r，都需要完整地访问所有 $b_s$ 的 block。在访问之前需要 seek 一次，因此是 $n_r$
    - 而每一次内循环结束之后，此时磁盘读写头在 $s$ 的最后一块处。因此，如果下一个 record of r 不在内存中，则需要通过 seek 来移动到下一个 record of r 所在 block 开始处。
        - 总共 $b_r$​ 次

不难看出：**小**关系适合做外层循环。

#### Optimization: Per-Block Loop

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_0_37_8_202405140037602.png" style="zoom:80%;" />

我们这里使用了四重循环，其中，里面两重都是关于内存的循环，因此不用考虑。我们这里只考虑外面两重循环。

如图，我们可以直接写出 estimated worst cost：

- block transfer: $b_r * b_s + b_r$

- block seek: $2b_r$​

不难发现，就相当于把 nested-loop join estimation 中的所有 $n_r$ 替换成了 $b_r$。同时，仍然是**小**关系适合做外层循环。

#### Advanced Analysis: Sufficient Memory

当然，不管哪一种情形，best case scenario 下，当内存足够大，我们直接将所有都读进去即可。也就是：

- block transfer: $b_s + b_r$

- block seek: $2$

#### Advanced Analysis: Memory with the Size of $M$ (blocks)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_1_2_9_202405140102491.png"/>

如果内存中空闲的 memory 有 $M$ 个，那么我们就可以采用上图中的策略。

为什么 r 用了 M-2 个（i.e. 能用的都用了）呢？我们可以分析一波（假设 r 不是 M-2 且 s 不是 1，而是 $m_r, m_s$）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_1_46_35_202405140146937.png" style="zoom: 67%;" />

由此，$m_r$ 越大越好，由于需要留下一块做 output buffer，留一块做 s buffer，因此只有 $M-2$ 块给了 r。

假如 $b_r > M-2$，此时的 cost 就是：

- Transfer cost: $\lceil \frac {b_r} {M-2}\rceil b_s + b_r$
- Seek cost: $2 \lceil \frac {b_r} {M-2} \rceil$

如果 $b_r \leq M-2$，那么就等价于内存足够大时的情形：

- Transfer cost: $b_s + b_r$

- Seek cost: $2$

### Indexed Nested-Loop Join

要求：

1. join 是 natural join
2. inner loop 有 index

步骤很简单，就是对于每一个外层的 record，都通过（B+ 树）索引来搜索对应的内层 record，然后将结果合并并输出。

Cost:

- Transfer: $b_r + n_r * c_{transfer}$
    - where c is the transfer time of 
- Seek: $b_r + n_r * c_{seek}$

### Merge Join

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_5_30_30_202405140530788.png" style="zoom:80%;" />

步骤很简单，就是将**公共部分已经排好序**的两个 table，根据顺序来逐词比较+join

假设已经排好序（如果没有排号的话，可以先使用外部排序排一下），而且 **buffer** memory size 为 M pages，那么：

1. 总共需要 $b_r + b_s$ 次的 block transfer
    - 很简单，最差情况下需要读取两侧的所有数据
2. 需要 $\lceil \frac {b_r} {x_r} \rceil + \lceil \frac {b_s} {x_s} \rceil$​
    - 一共需要从 disk 中读取 $\lceil \frac {b_r} {x_r} \rceil + \lceil \frac {b_s} {x_s} \rceil$​ 次，而每一次读取 r/s 的时候，如果之前读取的是 s/r，那么就就要进行 seek。按照 worse case 估计的话，那就必须会进行一次 seek

又因为 $x_r + x_s = M$，我们不妨将 $\lceil\dots\rceil$ 去掉，那么就是：
$$
\mathop{\arg\min}_{x_r, x_s} \frac {b_r} {x_r} + \frac {b_s} {x_s}, \text{ s.t. } x_r + x_s = M
$$
由于 $\frac {b_r} {x_r} + \frac {b_s} {x_s} = \frac 1 M (\frac {b_r} {x_r} + \frac {b_s} {x_s})(x_r + x_s) = \frac 1 M (b_r + b_s + \frac {x_sb_r} {x_r} + \frac {x_rb_s} {x_s})$，因此：
$$
\frac {x_sb_r} {x_r} = \frac {x_rb_s} {x_s} \iff x_r : x_s = \sqrt{b_r : b_s}
$$
因此：
$$
x_r = \sqrt{b_r} * M / (\sqrt{b_r} + \sqrt{b_s}) \newline
x_s = \sqrt{b_s} * M / (\sqrt{b_r} + \sqrt{b_s}) \newline
$$
在这种情况下，worse case seek 就 $\approx \frac{(\sqrt{b_r} + \sqrt{b_s})^2} {M}$。

#### Hyper Merge Join

对于未排序的，就要采用这样的步骤。

1. Sort both relations on their join attribute (if not sorted)
2. Merge the sorted relations to join them

在这种情况下，还需要考虑外部排序的代价。

---

还有另外一种情况：

- 其中一个有序（假设为 r）
- 另一个无序（假设为 s），但是 r 和 s 的公共部分有索引
    - 自然是 secondary index

那么，我们可以就此进行 join：

1. 首先，将 r 和**两者公共部分的索引** join 起来
    - 由于**两者公共部分的索引**在 B+ 树的叶子上，因此可以直接得到，而无需通过指针
    - 同样地，由于在 B+ 树的叶子上，因此是有序的，可以直接使用 merge join
2. 然后，将**两者公共部分的索引**的指针**按照硬盘地址排个序**
    - 通过排序，我们可以以最少的 seek 次数，来得到最终结果
3. 最后，根据排序结果依次访问

这样做，就是一次 merge，附加一次外部排序，最后再进行一次简单的取址操作。

### Hash Join

> Hash Join 的目的就是，将 s 分成尽量少的块，但是要保证每一个块均可以放进内存。
>
> 然后，我们就可以 r 这个大块跟 s 的这一小块进行 "nested loop"。不同的是，此时的 loop 可以
>
> 1. 顺序读 r，不需要多次 seek
> 2. 不用读 s，因为已经在内存里了
>
> 这样做，就类似于 nested-loop 内存足够大的情形。
>
> ---
>
> 而时间的主要开销，则是 build 时期。我们希望块尽量少，这样 build 时期的每个块的大小就会更大，seek 和 transfer 的次数就会更少。

- Build：选择两个输入 relation 中 cardinality 较小的一个（一般称其为 build relation），使用一个或一簇 hash 函数将其中的每一条记录的主键 key 值计算为一个 hash 值，然后根据 hash 值将该记录插入到一张表中，这张表就叫做 hash 表；
- Probe：选择另一个 cardinality 较大的 relation （一般称为 probe relation），针对其中的每一条记录，使用和 build 中相同的 hash 函数，计算出相应的 hash 值，然后根据 hash 值在 hash 表中寻找到需要比较的记录，一一比较，得到最终结果。

具体实现：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_6_42_50_202405140642302.png" alt="image-20240514064247347" style="zoom:50%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_6_42_28_202405140642513.png" style="zoom:80%;" />

也就是说（假设 s 比 r 的 cardinality 要小）：

1. 通过一个粗糙的哈希函数，将 s 划分成 n 个 buckets
    - 因为划分的时候，我们采用的方式是：将 s 逐一 load 进 in_bucket 中，然后对于每一个 attribute，通过哈希函数将其映射到 $0 \sim n-1$，然后就放到第 n 个 bucket 中。当一个 block 满了/所有 attribute 都被划分之后，就将其装回硬盘。
        - 因此，如果划分成 $n$ 个 bucket，**由于一个 bucket 至少要 1 个 block 那么大**，因此 memory 就需要至少 $n+1$​ 个 block，1 个当作 in_bucket，n 个用于 index_buckets
2. 对于 r 进行同样的划分
3. 然后，对于第 i 个 r 和 s 的bucket
    1. 我们首先在 $s_i$ 上建立一个 **in-memory** hashing index
        - 所用哈希函数必须与之前的粗糙哈希函数不同
        - 由于是 in-memory 的，因此 $s_i$ 必须能够被完全装到 memory 中（而且还要留下一个 in_block 用于装 $r_i$）
            - 因此，必须有 $t_{s_i} \leq M - 1$。我们可以假定 $t_{s_i} \leq f * \lceil \frac {t_s} {n} \rceil$，$f$ 是因为哈希函数一般无法划分非常均匀
    2. 然后，从 disk 中，一条一条读取 $r_i$ 的 record，并通过 hashing index 查找 $s_i$ 中对应的 records。匹配并输出。

因此，cost 就是三大部分：

1. 划分 s 和 r 的 buckets
2. 建立 (in-memory) hash index
3. 从 disk 中读取 $r_i$
    - 查找索引和比较的过程被忽略，因为是 in-memory 的，耗时很少

---

不难发现，如果需要保证一次 hash 就足够，那么就需要：
$$
f * \lceil \frac {t_s} {n} \rceil \leq M - 1, n \leq M - 1
$$
也就是：$M \gtrapprox \sqrt{f * t_s}$。

比如说：如果我们有 12 MB 的内存，块大小是一如既往的 4 KB，那么我们就有 $M = 3 \text{ K}$，从而 $t_s \lessapprox \frac {M^2} {f} = 9 \text{ M} / 1.2 =7.5 \text{ G blocks} = 30 \text{ GB}$。我们可以使用 12 MB 的内存，在避免 recursive hash 的情况下，处理高达 30GB 的 table。

#### Recursive Hash Join

如果一次哈希无法完成 in-memory，那么就两次（第二次与第一次的 hash function 应该不同）；两次不行，就三次；……。

具体来说，就是通过多次的 hash，将大块分成 M-1 个小块（但是这小块仍然比内存更大），然后再将小块继续用不同的 hash 函数分下去，so on and so forth，直至小块足够小为止。

#### Cost

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_12_22_1_202405191222348.png"/>

**注意：**

1. 我们这里暂时不考虑 (in-memory) hash index，而采用原始的顺序搜索。
2. 对于 $r, s$ 而言，哈希划分之后的数据占用的 block，最多可能比 $b_r, b_s$ 多出 $n_h$ 个 blocks，因为每一个 hash index 的最后的一个 block 可能是不满的
    - 因此，r 哈希之后，最多可能有 $b_r + n_h$ 个 blocks；s 哈希之后，最多可能有 $b_s + n_h$ 个 blocks

如上图所示：

- 在划分 s 和 r 的阶段，需要
    - $(b_r + b_s) + ((b_r + n_h) + (b_s + n_h)) = 2(b_r + b_s) + 2n_h$ 次的 block transfer，目的是将 $r, s$ 的所有数据先加载进内存，然后再写到对应的 block[index]，如果 block[index] 满了，就写回硬盘
    - $2(\lceil b_r / b_b \rceil + \lceil b_s / b_b \rceil)$ 次的 seek，其中 $b_b$ 就是分配给每一个 in_bucket 以及 index_buckets 的 block 大小。
        - 这是因为，每一个 bucket 满了之后，就必须装回硬盘，这就是一次 seek；然后 in_bucket 空了之后，又要从硬盘中读取，这又是一次 seek。
- 将每一个 $s_i, r_i$ 读入内存
    - 需要 $((b_r + n_h) + (b_s + n_h)) = (b_r + b_s) + 2n_h$ 次 block transfer
    - $2 n_h$ 次 seek，先 seek $s_i$ 的开头，全部读入内存之后，就去 seek $r_i$ 的开头
        - 由于 $s_i, r_i$​ 均是 read sequentially，因此只需要各 seek 一次
    - **这个阶段和 nested-loop 内存足够大的情况是类似的**

一共需要

- Block transfer: $3(b_r + b_s) + 4n_h$
- Block seek: $2(\lceil b_r / b_b \rceil + \lceil b_s / b_b \rceil) + 2 n_h$

# Appendix

## Extendible Hashing

> 设计思想：
>
> - 我们难以实现预计需要多少个 hash block。如果采用静态的方法，就会导致
>     - 要么 hash block 太多，**空间大大的浪费**
>     - 要了 hash block 太少，导致一个 block 存不下，还要用链表（多个 block），**导致 transfer time 大大增加，查找效率低**
> - 我们动态调整 hash block，使得一个 block 只有在放满了，才会 split
>     - 从而使得空间尽量节省
>     - 同时每一个 hash index （*尽量*）只占用一个 block
>         - 我们之后会说到必须占用多个 blocks，使用链表的情况

### 在哪里用？

首先明确这是一种【存数据】的方法。比如有100个文件，有方法的找肯定比一个一个找要快。聪明的前辈们想出很多方法，有二分法，B-Tree，Hash等等。这些方法也被叫做“索引”（Index）。

## 重要概念

Extensible Hashing 有三个重要的变量：

1. 每一个 bucket 的最大容量
2. 全局深度
    - 索引用了多长的二进制串
3. 局部深度
    - 某一个 bucket 用了多长的二进制串

其中，前两个是**全局的**，第三个是每个 bucket 各自拥有的。

### 怎么用？

我们通过某个 hashing 函数（往往是 mod 2<sup>k</sup>），将数据变成 hash。

从一个栗子入手。作为学校IT部门的打工人，领导要求我把7个部门的信息存起来，也就是7条记录（record）。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_25_202405231528017.webp" alt="img" style="zoom:50%;" />



**第一步：得到哈希值（hash value）。**

如右栏所示。（什么是哈希不是这篇的重点，跳过）。通过哈希函数，我们会得到一个二进制数。之后我们会重点对这个二进制数进行操作。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_27_202405231528384.webp" alt="img" style="zoom:50%;" />



**第二步：先对可拓展哈希有个大概的概念。**

主要明确三个概念：全局深度（global depth），局部深度（local depth）以及桶（bucket）。全局深度和局部深度我们之后会提。桶就是存记录（records）的地方，我可以往桶里放一条，两条，三条。但要规定好最多能装几条。这个例子里我们规定最多能装2条。在图里你能看到bucket 1只有两行。下图这个就是可拓展哈希的初始状态。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_31_202405231528827.webp" alt="img" style="zoom:50%;" />



**第三步：插入数据。**

插入Comp.Sci和Finance这两条。现在还不涉及全局深度和局部深度的改变。两条新记录（record）就直接往里放就行。书上没有这个步骤的图，大家看下我临时编辑的图。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_33_202405231528233.webp" alt="img" style="zoom:50%;" />



插入Music。这时一个桶的条数大于它的上限（2条），所以要开始分裂。如何分裂是根据哈希值（hash value）决定的。取哈希值第一位。哈希值是二进制数，第一位只有两种可能，0和1。Comp.Sci是1，Finance是1，Music是0。很简单的把是1的放在一个桶（bucket）里，是0的放在另一个桶（bucket）里。由于我们用了哈希值的第一位，所以全局深度（global depth）变成1。这里做一下全局深度和局部深度的区分。两个都表示用了几位哈希值。全局深度是所有记录要用到几位哈希值，局部深度是该桶里的记录用到几位哈希值。产生这种区别的原因是，有的哈希值用不到全局深度那么多位。我们会在后面的例子看到，现在这么说还比较抽象。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_34_202405231528866.webp" alt="img" style="zoom:50%;" />



插入Physics。Physics的插入会让第二个桶产生溢出，所以要再次分裂。一位哈希值就不够用了，需取哈希值前两位，相应的全局深度变成2。第二个桶分裂成桶二和桶三。这时你会发现前两个指针（00和01）都指向了第一个桶。书上没具体说明原因。我给出的解释是：这样做节省内存。当一条新纪录（record）且哈希值开头为（0x，x可为0或者1），都可以被存入第一个桶而不导致溢出。所以桶一没有分裂的必要。只要我设置局部深度（local depth）为1，也就值只读哈希值第一位，就可以兼容所有第一位哈希值为0的记录，而不用考虑全局深度所说的前两位哈希值。个人认为这是可拓展哈希的精髓。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_36_202405231528484.webp" alt="img" style="zoom:50%;" />



**第四步：插入的数据无法用分裂解决。**

可拓展哈希允许插入哈希值相同的记录。所以当插入三条哈希值一样的记录，一个桶就一定放不下（假设桶的容纳上限是两条）。就像图中所示，这种情况被叫做overflow，而解决方法是用指针指向overflow bucket，也就是人为增加桶。这种方式看上去不美，也暴露了可拓展哈希的局限性，但一个方法在实际应用中确实无法确保永远的统一性，总是会需要“补丁”。实际应用中，可拓展哈希也不是最普遍的方法，更多则是B-Tree。



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_15_28_38_202405231528408.webp" alt="img" style="zoom:50%;" />
