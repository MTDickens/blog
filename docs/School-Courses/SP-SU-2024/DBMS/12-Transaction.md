# Basics

事务需要保证 ACID 原则的实现：

- Atomic: 一个事务，要么完成了，要么没完成
- Consistent: 不管事务完成了还是没完成，数据库的状态都是合法的（i.e. 满足 trigger 等等的约束）
- Isolated: 一个事务的操作和数据在**未提交之前**，对其他事务是不可见的。
- Durability: 如果一个事务完成了，那么对数据库的改变是永久性的，即使发生了系统崩溃、断电等故障。

---

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_10_55_30_202405241055361.png" style="zoom:80%;" />

为了简化事务，我们只有 **read** 和 **write** 两种操作。

## ACID by Example: Money Transfer

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_11_3_57_202405241103474.png" style="zoom:80%;" />

如图：如果要把 50 元从 A 的账户转到 B 的账户，那么就需要经历 6 步操作，其中涉及四次读/写操作。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_11_9_21_202405241109852.png" style="zoom:80%;" />

Consistency 有两种约束：

1. 显式：就是内蕴于数据库的，一般而言是比较基础的约束，比如 primary key, foreign key, unique 等等。
2. 隐式：就是只能用过**与数据库交互的程序**来实现的，统称为 integrity constraints。

只有在 transaction execution 的过程中，数据库才可以短暂地 inconsistent。其余时候，必须 consistent。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_11_20_13_202405241120409.png" style="zoom: 67%;" />

Isolation 有一个很简单的办法，就是串行 (serial)。当然这个策略是低效的。

## TX State

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_11_22_30_202405241122587.png" style="zoom: 50%;" />

如图，对于一个交易而言，其状态就是一个有限状态机。

其中，

- active: 正在执行
- partially committed: 所有行执行完毕，待提交
- failed: 正在执行或者已执行完毕待提交的时候，发现无法继续执行/提交
- aborted: 回滚成功。
- committed: 所有行执行完毕，且已提交

# Concurrent Executions

并发执行有几点好处：

1. (if multicore) reduce overall execution time
    - 如果有多核 CPU，那么就可以在任务层面真·并行
2. increased processor and disk utilization
    - 即使只有单核，如果能够分时伪·并行，那么还是可以更加充分地利用资源（参考 CPU 流水线，比如 1 任务使用 CPU 的时候，2 任务正在写入/读取磁盘）
3. reduced average response time
    - 即使只有单核，如果将任务按照（预期）任务执行时间由小到大排一下，可以保证较短的任务不用等待前面的长任务

## Anomalies (异常情况)

主要有以下 4 个异常情况：

1. Lost Update
2. Dirty Read
3. Unrepeatable Read
4. Phantom Read

### Lost Update

如果一个事务在正常完成了写操作之后，却在 commit 之前，写入的值被篡改了，就称为 lost update。

| T1            | T2                                           |
| ------------- | -------------------------------------------- |
| Read A (100)  |                                              |
|               | Read A (100)                                 |
| A := A-1 (99) |                                              |
|               | A := A-1 (99)                                |
| Write A (99)  |                                              |
|               | <del>Write A (99)</del> (**This is wrong!**) |

### Dirty Read

一个事务读了另一个事务未提交的数据，就是 dirty read。

| T1            | T2                                           |
| ------------- | -------------------------------------------- |
| Read A (100)  |                                              |
| A := A-1 (99) |                                              |
| Write A (99)  |                                              |
|               | Read A (99)                                  |
|               | A := A-1 (98)                                |
| Rollback      |                                              |
|               | <del>Write A (98)</del> (**This is wrong!**) |
|               | Commit                                       |

### Unrepeatable Read

如果一个事务在不同时间读取同一个数据，读到的 value 可能不同，那么就称为 unrepeatable read。

| T1           | T2            |
| ------------ | ------------- |
| Read A (100) |               |
|              | Read A (100)  |
|              | A := A-1 (99) |
|              | Write A (98)  |
| Read A (99)  |               |

### Phantom Read (幻读)

如果一个事务在不同时间进行同样的查询，查询的行数不一样。

| T1                                                           | T2                                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| SELECT * FROM student WHERE id = 3220104982 (No Answer)      |                                                              |
|                                                              | INSERT INTO student (id, gender, age) VALUES (3220104982, M, 18) |
| <del>INSERT INTO student (id, gender, age) VALUES (3220104982, M, 20)</del> (**failed!**) |                                                              |

- 幻读，并不是说两次读取获取的结果集不同，幻读侧重的方面是**某一次的 select 操作得到的结果所表征的数据状态无法支撑后续的业务操作**。 更为具体一些：select 某记录是否存在，不存在，准备插入此记录，但执行 insert 时发现此记录已存在，无法插入，此时就发生了幻读。

## Scheduling (调度)

采用合适的调度，可以避免上面的部分或者所有的 anomalies。

### 串行调度

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_14_22_42_202405241422129.png" style="zoom: 80%;" />

串行的方法，必然可以保证上面的异常情况都不存在。

### 交替调度

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_14_30_56_202405241430134.png" style="zoom: 80%;" />

如果处理得当（i.e. 实际执行过程中是写后读），那么也可以交替执行也是可以的。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_14_34_51_202405241434651.png" style="zoom:80%;" />

由于处理不当，使得本来应该的写后读顺序变成了读后写，从而结果不对。

## Serializability (可串行化)

> 注：两个 instructions 之间冲突，意思就是两个 instructions 之间
>
> 1. 至少有一个是 WRITE
> 2. 作用于同一个对象

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_15_4_3_202405241504488.png" style="zoom:80%;" />

如果每一个 tx 都能 preserve db consistency，那么串行执行这些 txs 之后，consistency 也可以保持。

而我们的目标，就是找到这样的 schedule，使得它和 serial schedule 是 equivalent 的。

### Conflict Serializability

如果一个 schedule 可以通过 a series of swaps of non-conflicting instructions，那么就称 S and S' are conflict serializable.

- 至于 swaps of non-conflicting instructions，根本意思就是：**这个 swap，不能改变任何 conflict pairs 执行的先后顺序**

我们可以用一个 precedence graph 来判断几个关系之间是否是冲突的：

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240524172701545.png" alt="image-20240524172701545" style="zoom:50%;" />

如图：

1. 由于 T1 read(Y) < T2 write(Y)，因此 T1 &rarr; T2
2. 由于 T1 read(Z) < T3 write(Z)，因此 T1 &rarr; T3
3. 由于 T1 read(Y/Z) < T4 write(Y/Z)，因此 T1 &rarr; T4
4. 由于 T2 read/write(Y) < T4 read/write(Y)，因此 T2 &rarr; T4
5. 由于 T3 write(Z) < T4 write(Z)，因此 T3 &rarr; T4

不难发现，这张图就是一个 acylic directed graph。通过拓扑排序，我们可以得到这样的一个顺序（比如 T1, T2, T5, T3, T4），使得在不交换 conflict insts 的前提下（其它可以随意交换），使得该图变成 T1 T2 T5 T3 T4 串行执行的图。

### View Serializability

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_18_23_53_202405241823005.png" style="zoom:80%;" />

1. View 只需要：Read 的值是一样的；Write 的值也是一样的
    - 注意上文是非常粗略、不严格的大意。具体要求需要见下面的图片。
    - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_18_36_58_202405241836245.png" style="zoom: 80%;" />
        - 如果 T<sub>i</sub> 在 S 中，某语句读到了 Q 的初始值，那么 S' 的对应语句也必须**读到 Q 的初始值**
        - 如果 T<sub>i</sub> 在 S 中，某语句读到了某 T<sub>j</sub> 的某 Write，那么那么 S' 的对应语句也必须读到**对应 T<sub>j</sub> 的对应 Write**
        - 如果 T<sub>i</sub> 的 Write(Q) 是所有 Write(Q) 中最后一个，那么 S' 也必须**是所有 Write(Q) 中最后一个**
2. Conflict 的条件比 view 更加严格。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_18_27_33_202405241827379.png" style="zoom:67%;" />

如图，上图和 T27-T28-T29 串行执行是等价的，因为：

1. 全局唯一一个 Read（i.e. T27 的 Read(Q)）读到的值，就是初始值，这和 T27-T28-T29 中 T27 的 Read 读到的一样
2. 全局最后写的值，就是 T29 的值，这和 T27-T28-T29 中最后写的一样

因此，是等价的。

> 注意：如果没有 T29，那么就**不** view serializability。本质上还是因为 T29 **覆写**了 Q 的值。

### Other Notions of Serializability

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_18_44_7_202405241844085.png" style="zoom:80%;" />

如图，T1, T5 并不 conflict serializable，因为不论是 T1-T5 还是 T5-T1，都无法将交错在一起的 T5 和 T1 之间的块分开。

同样，也不 view serializable，因为 T1 read(B) 读到的是 T2 write(B)，T2 read(A) 读到的是 T1 write(A)。但是，串行化后，T1 read(B) 和 T2 read(A) 至少有一个必须读到 original value。因此也不行。

但是，实际上，当前的 schedule，执行结果就和串行后的执行结果一样（无论是 T1-T2 or T2-T1）。

**因此，上述的两个 serializability check，实际上是一个 must analysis。也就是，如果分析下来是 serializable 的，那么 must be serializable，但是分析下来不是的，不一定不是（比如说上图）。**

## Recoverable Schedule

> 在已有的 READ, WRITE 两个操作的基础上，再加一个 COMMIT

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_19_26_28_202405241926210.png"/>

如上图：如果 A 读取了 B 产生的数据，那么就必须保证 B 在 A 之前 commit。否则，如果 B 回滚，而 A 已经 commit 了，就可能造成数据不一致。

## Cascading rollback

> 在 recoverable schedule 的基础上（i.e. 如果 A 读取了 B 产生的数据，那么就必须保证 B 在 A 之前 commit），每一次 "rollback" 某个 TX 的时候，都可能需要同时 rollback 其它受到影响的 TXs。我们希望尽量减少其它受到影响的 TXs。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_19_31_50_202405241931111.png"/>

如图，如果 T10 rollback 了，那么 T11, T12 都需要 rollback。如果有更多的 TXs 需要级联回滚的话，这样会导致开销非常的大。

### Solution: Cascadeless Schedule

等待 T10 commit 之后，T11 再进行 read(A) 操作；等待 T11 回滚之后，T12 在进行 read(A) 操作。

- 当然，这样做也自然会导致并发度降低，since everything is tradeoff

### Which One to Choose?

部分情况下，默认一个操作回滚概率低，从而采用冒险激进的策略，实在要回滚了，反正也只有很少的次数，占用资源不多。

- 当然，有时候，回滚不一样是“推倒重来”，还可以用“补偿操作”。比如订票系统中，我们可以一次处理多张订票，之后一起 commit。如果有之前的订票取消了，我们无需将该次订票之后的订票回滚，而只需要

另外的情况下，默认一个操作有不小的可能会回滚，从而采用“解决方法”中的策略，虽然造成并发度降低，但是起码不会造成更多的回滚。

## Brief Summary

数据库系统希望这样的 schedule

- Serializable
    - either view or conflict serializable
- Recoverable
- (Better be) cascadeless

# Tradeoffs in Reality

实际中，如果我们强制要求 schedule 必须 serializable，那么就会导致性能很差。因此，我们实际上有不同的事务隔离级别。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_20_5_6_202405242005372.png" style="zoom: 80%;" />

- Repeatable Read: 我之前 read 过所有的数据，没有发现 xxx，但是在我准备插入 xxx 之前，xxx 已经被其它事务插入，因此插入失败。
    - 只能插入新的，不能修改旧的。
- Read committed: 其它事务可以把当前事务已经读过的条目重新修改，当然，必须保证其它事务必须在当前事务提交前提交。
- Read uncommitted: 就是没有规则，随便来。

# Concurrency Control

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_20_16_56_202405242016630.png"/>

前两种是悲观的（i.e. 默认有不小概率回滚），第三种是乐观的（i.e. 默认回滚概率极低）。

## Locks

锁分两个：shared lock and exclusive lock。

- 分别简称 lock-S, lock-X。

其中，shared lock 允许一个 TX 读，exclusive lock 允许表项被一个 TX 读写。

![image-20240524204714624](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_20_47_16_202405242047206.png)

如上图所示：

- 如果一个 shared lock 占据一个表项，那么其它 TXs 就无法获得 exclusive lock，但是可以获得 shared lock
    - 多个 TXs 可以同时读
- 如果一个 exclusive lock 占据一个表现，那么其它 TXs 就无法获得任意 lock
    - 只有一个 TX 可以写

### Two-Phase Protocal

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_20_49_47_202405242049766.png"/>

---

**证明：** Two-Phase Locking Protocol 可以保证 **conflict serializability**。

**（使用反证法）**

假如某几个 TXs 之间有 cycle。由于 T<sub>i</sub> 指向 T<sub>i+1</sub> 必须满足两者的操作其中至少有一是 WRITE，因此两锁之间必有至少一个是 lock-X，因此不能共存，也就是说：**必须等待 $T_i$ 解锁之后，才能让 $T_{i+1}$ 把锁锁上**。

因此，T<sub>1</sub> 解锁 lock-u<sub>1</sub> 先于 T<sub>2</sub> 加 lock-l<sub>2</sub>，**由 two-phase 可知**，T<sub>2</sub> 加 lock-l<sub>2</sub> 必然先于 T<sub>2</sub> 解 lock-u<sub>2</sub>，而 T<sub>2</sub> 解 lock-u<sub>2</sub> 又先于 T<sub>3</sub> 加 lock-l<sub>3</sub>，……

如此 induct，可以最终得到结论：T<sub>1</sub> 解 lock-u<sub>1</sub> 先于 T<sub>1</sub> 加 lock-l<sub>1</sub>。而这显然违反了 two-phase。因此，不可能存在 cycle。