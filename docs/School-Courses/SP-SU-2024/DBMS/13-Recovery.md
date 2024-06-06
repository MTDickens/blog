# Failure Classification

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/6_19_34_6_202406061934180.png"/>

# 日志的宗旨

每一条日志，就对应着每一个 block 的 update, insert 等操作。

我们的宗旨如下：

- 如果 block 操作尚未写到硬盘中，那么日志**不一定**要写进 stable storage
- 如果 block 操作写进了硬盘中，那么日志**必须**已经写入了 stable storage
    - 不然可能会造成这样的情况：事务 4 在硬盘中已经 start、尚未 commit，但是日志的 stable storage 连事务 4 的 start 都没有记录。然后就会造成事物 4 在恢复过程中，根本没有被回滚，从而造成数据库的**不一致性**。

因此：

1. 每一次将脏页写入硬盘，就必须把日志**先**写入 stable storage
2. 对于日志而言，可能日志的 buffer 本身就比较小。如果日志堆满了，可以直接写入 stable storage，而无需管脏数据
3. 通常，我们也会**定时**将日志和脏页先后写入 stable storage & disk，然后再向 stable storage 写入一个 checkpoint，保证恢复的高效性（i.e. checkpoint 之前的数据就不在 undo list 里面了）

> [!warning] 注意
> 
> 所有的数据库恢复，一定是用**已经写入 stable storage** 的日志，然后在日志的 checkpoint 处来恢复的。
> 
> - 在内存（i.e. buffer）中、尚未写入 stable storage 的，统统不算数
> - 也就是说：**实际上，日志还在 buffer 的话，就不算 commit**。
> 


# Fuzzy Checkpoint

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/6_21_1_29_202406062101051.png"/>

如图：在 checkpoint 定时器到时的时候，与往常的将 log 写入 stable storage、将所有脏页写入磁盘不同，我们这里：

1. 先**标记**一个 checkpoint，但是**只将 log 写入**，磁盘数据先不动。此时，这个 checkpoint 是 invalid
2. 然后，**记录下当前磁盘的脏页**——这些脏页，就是 what makes the checkpoint invalid and what should all be flushed into disk in order to make the checkpoint valid
3. 然后，从现在开始，就允许事务正常进行。同时，开始将这些脏页 flush into 磁盘中。
    - 由于事务和 flush 脏页是**并行的**，因此 flush 脏页并不会对事务造成过大的影响
4. 等到所有脏页都被 flushed into 磁盘之后，我们就标记：这个 checkpoint 被执行完毕。具体方法是：**记录一个指向 checkpoint 标记的指针**

> [!question]+
> 
> Q1: 为什么需要 checkpoint 标记？我将脏页全部 flush into 了之后再写一个 checkpoint 不行吗？
> 
> A1: **由于我们这里设置 checkpoint，是和事务并行的（为了避免影响事务）。因此，在设置 checkpoint 的同时，脏页会源源不断地生成**。
> 
> 从而，所谓的将“脏页 flush into stable storage”，指的是将“checkpoint 时刻（而不是写完脏页的那一刻）的所有脏页 flush into stable storage”。
> 
> 因此，**我们需要记录下来 checkpoint 标记，是因为我们必须回溯到那个 checkpoint 时刻（而不是写完脏页的那一刻）**。


# Logical Undo

对于并行控制，除了两阶段协议以外，还可以使用**可以提前解锁**的 tree 协议。使用这种协议的时候，

但是如果可以提前解锁的话，就会造成以下后果：

```
...
<T1 start>
<T2 start>
<T3 start>
<T4 start>

<T1, B, 10, 11>
<T2, B, 11, 12>
<T3, B, 12, 13>
<T4, B, 13, 14>

<T2, A, 11, 10>
<T3, A, 10, 9>
<T4, A, 9, 8>

<T2 commit>
<T3 commit>
<T4 commit>
[system crashed, need recovert!]
```

如图：T1, T2, T3, T4 读取了 B 的数据，然后加上 1，并且采用了可以提前解锁的协议，那么如果只恢复 T1 的话，就会造成 inconsistency。

因此，应该使用逻辑日志：

```
...
<T1 start>
<T2 start>
<T3 start>
<T4 start>

<T1, O1, operation begin>          # Lock acquired
<T1, B, 10, 11>
<T1, O1, operation end, (B + 100)> # Lock released

<T2, O2, operation begin>          # Lock acquired
<T2, B, 11, 12>
<T2, O2, operation end, (B + 100)> # Lock released

...

<T2 commit>
<T3 commit>
<T4 commit>
[system crashed, need recovert!]
```

这样，恢复的时候，就是将 B **逻辑上**减去 1 即可。

---

不过，如果是下图的情况，那么就还是传统上的恢复：`<T2, B, 11>`

```
<T1 start>
<T2 start>
<T3 start>
<T4 start>

<T1, O1, operation begin>          # Lock acquired
<T1, B, 10, 11>
[system crashed, need recovert!]   # Lock haven't been released yet, so don't worry about rewrite
# Just use <T1, B, 10, 11> <T1 abort> to recover
``` 

> [!warning]+
> 
> 其实这个我也不是很清楚。感觉 logical undo，举的例子并不好。
> 
> [这里](https://help.aliyun.com/zh/polardb/polardb-for-mysql/innodb-physiological-logging)有另外一个解释


# ARIES 算法

详见 [coredump 博客](https://www.codedump.info/post/20220521-weekly-16/#fuzzy-checkpoint%E6%B5%81%E7%A8%8B)。