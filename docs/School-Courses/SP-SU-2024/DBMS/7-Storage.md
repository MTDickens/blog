# Storage Hierarchy

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_2_12_6_202404260212812.png" style="zoom: 80%;" />

硬盘和内存的访问速度相差 10 万倍——也就是内存一秒，硬盘一天。因此两者之间有着天然的鸿沟。

- 因此，从硬盘中取数据是一个**大忌**，必须不惜代价用算法进行优化

Cache 和 Memory 之间的差异为 100 倍左右（具体和 cache 的级别有关）。相比硬盘和内存，cache miss 的惩罚要小得多。

## Disk Speed

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_2_37_49_202404260237842.png"/>

如图：对于 4 KB (i.e. 1 block) 的数据，传输时间仅为 0.02 ms (以 200MB/s 计)。但是，寻道和旋转的时间，却有 4 \~ 11 ms。说明时间都浪费在后者上了。

# Performance Measure

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_2_48_56_202404260248673.png" style="zoom:67%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_2_50_53_202404260250617.png" style="zoom:67%;" />

- IOPS: I/O (block) per second
- MTTF: 多长时间才会发生故障
    - 一般而言，硬盘在 3\~5 年发生故障的可能性比较大。
    - 但是，如果有多个（比如 1000 个）磁盘，那么很可能在短时间内就会有一个发生故障
        - 可以用泊松过程来算
- 采用顺序访问的模式，可以极大增加 IOPS。

# Optimization

## Magnetic Disk

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_3_15_16_202404260315915.png" style="zoom: 80%;" />

如上图，对于机械硬盘而言，我们可以通过：

1. 内存为 disk cache
2. pre-fetch（因为局部性原则）
3. 如果我们提前知道需要读取的 block 的柱面，你就可以提前规划好最快的读取顺序

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_3_13_34_202404260313528.png" style="zoom:67%;" />

还可以通过磁盘碎片清理，来避免随机读取。

## Flash Memory

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_15_53_37_202404261553211.png" style="zoom: 67%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_15_53_8_202404261553258.png" style="zoom: 67%;" />

闪存的特征：

1. 随机读取相比连续读取，时间差不了多少
2. 必须擦除后才能重新写入，且擦除操作会造成损耗
    - 擦除非常耗时
    - 通过 remapping 来 avoid waiting for erase (as well as wear caused by erase)

闪存和磁盘的区别：

1. 闪存的随机读和顺序读几乎没有差别（实际上，remapping 之后，顺序读和随机读在物理上并没有多大的区别）
2. 闪存的读和写有很大差别。我们要尽量防止反复写入。

## Example: Ensuring Durability 

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_3_20_10_202404260320353.png" style="zoom:67%;" />

对于一些场景：执行完一个 SQL 事务之后，必须存到一个可靠的地方。但是假如这个事务过于巨大，而且需要随机存储，存到硬盘需要存一天，我们就可以选择

- 存到 non-volatile write buffer（比如 NVM）去
- 或者**连续**地存到日志里去

# Comparison of Different Storage Media

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_16_5_40_202404261605544.png"/>

可以看见：

1. NVM 和 DRAM 是在同一量级上的，之间的差距并不大
2. NVM 和 SSD 之间有天然的鸿沟，但是 SSD 的随机读写能力很强
3. HDD 的速度最慢，但是便宜+endurance+persistence
4. ……

