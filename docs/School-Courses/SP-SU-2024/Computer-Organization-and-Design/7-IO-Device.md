# Basics of IO

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_15_10_47_202405281510009.png"/>

IO 也是 memory 组成的一部分。我们使用 mapped memory 方式来访问 IO。

# Characters of IO

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_15_17_55_202405281517841.png"/>

IO 有三种：

1. 只读：比如鼠标、键盘
2. 只写：比如显示器
3. 可读写：比如硬盘、网络接口

IO 的对象要么是人类（鼠标键盘显示器）、要么是机器（网络硬盘磁带）。

带宽是 IO 的重要指标。

# Performance Metrics of IO

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_15_20_46_202405281520830.png"/>

- 吞吐量（Throughput）：吞吐量也可以分为两种情况。前者就是 bit/byte per second，后者则是 IOPS (i/o operations per second)
    - 对于大容量存储（bulk storage）而言，带宽是瓶颈
    - 对于流媒体来说，有时处理能力是瓶颈，因为需要传输大量的小视频块
- 反应时间：跟人交互的 IO 设备，response time 非常重要

## Recap: Amdahl's Law

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_15_37_50_202405281537905.png"/>

如果硬盘等 IO 的性能不提高，那么就会严重拖后腿。

## Some Issues

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_16_0_58_202405281600245.png"/>

我们有多种方法可以提高速度、增加寿命：

- **软件优化**：虽然 average seek time 大可能会造成一定影响，但是，通过下面的方法，可以一定程度上使得 AST 不那么重要
    - locality：尽量连续读
    - OS scheduling：我们并不见到一块就去读一块，而是将需要读取的硬盘地址排序，使得 seek time 尽量低
- 使用更 smart 的磁盘控制器。
    - **预取**：可以使用更好的预取方式——预测接下来要用到的数据
    - 我们还可以设计更好的空间分配算法，让磁盘的每一块能够更加均衡地被访问
    - ……

> [!info]- 硬盘控制器还要做些什么？
> 
> 硬盘控制器还需要进行纠错编码（一般是 ECC）等等。
> 
> 事实上，磁盘控制器是非常复杂的东西，设计难度并不小于一个 CPU

# Categories of Storage Devices

对于磁盘，可以参考 DBMS: Storage。下面我们讲一讲 flash memory。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_15_46_36_202405281546787.png"/>

对于 NOR flash 而言，我们可以进行随机读写。缺点是储存密度不高，一般不超过 1MB。通常用于嵌入式设备的 IMem。

对于 NAND flash 而言，只能整块地读写，但是密度高，容量大，很容易达到 GB 级别，因此广泛用于 USB、移动硬盘等等。

> [!note]+ NOR vs NAND: more details
> 
> 对于 NOR 而言，写入的时候，如果是 1 改成 0，那么就可以直接改；如果是 0 改成 1，那么必须要**整块擦除**。
> 
> 对于 NAND 而言，不管写些什么，都需要**整块擦除**。
> 
> 而擦除会对其造成很大的破坏，一个 block 擦除 10000 次之后就不能用了。

# Availability

除了 performance 以外，我们还需要考虑其稳定性。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_16_23_30_202405281623530.png"/>

电脑上每一个模块都有一个**理想情况下的 behavior**，如果实际执行情况与理想情况不符，就是 service interruption/failure。

## Availability Metric

主要有三个概念：

1. MTTF: Mean Time To Failure
2. MTTR: Mean Time To Repair
3. MTBF: Mean Time Between Failures
    - MTBF = MTTR + MTTF

显而易见，availability = (time you can use) / (all time) = MTTF / MTBF = MTTF / (MTTF + MTTR)

> [!question]+ 如何提升 MTTF？
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_16_28_34_202405281628940.png"/>
> 
> 其中，fault tolerance 本质上就是通过冗余的方式来进行 fault avoidance。比如：
> - 使用 ECC 纠正单比特错误
> - 使用多 CPU 同时运行来纠正某一个 CPU 的错误（在太空中常用）
> 
> fault forecasting 有一个例子：如果服务器连续运行了一定的时间，就要进行重启，从而回收泄露的内存以及运行时 bug。


> [!question]- fault 都是谁引起的？
> 
> 据统计（如下图），最多的 fault 还是人为引起的。因此要尽量自动化，少使用人工操作。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_16_38_21_202405281638425.png"/>
> 

# Disk Array

通过小磁盘 + 磁盘并行访问，我们可以做到成倍地加快磁盘速度。

问题就在于：通过现有的策略（RAID0，我们之后会讲到），

1. 如果有一个磁盘坏了，那么所有硬盘上的数据都会损坏
2. 同时，一个硬盘坏了，整个阵列都会无法使用。而增加磁盘的数量，将会成倍地减小 MTTF。

因此，我们需要通过冗余来减小这样的情况发生。

# RAID: Redundant Array of Inexpensive Disks

为了均衡性能、储存效率和 MTTF，我们将 RAID 分成下面这么多的等级。

| Level                                                               | Description                                                                                                                                                                                                                               | Minimum numbers of drives | Space efficiency          | Fault tolerance        | Fault isolation                   | Read performance | Write performance  |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------- | ---------------------- | --------------------------------- | ---------------- | ------------------ |
| [RAID 0](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_0) | Block-level [striping](https://en.wikipedia.org/wiki/Data_striping "Data striping") without [parity](https://en.wikipedia.org/wiki/Parity_bit "Parity bit") or [mirroring](https://en.wikipedia.org/wiki/Disk_mirroring "Disk mirroring") | 2                         | 1                         | None                   | Drive Firmware Only               | n                | n                  |
| [RAID 1](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1) | Mirroring without parity or striping                                                                                                                                                                                                      | 2                         | 1/_n_                     | _n_ − 1 drive failures | Drive Firmware or voting if n > 2 | n                | 1                  |
| [RAID 2](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_2) | Bit-level striping with [Hamming code](https://en.wikipedia.org/wiki/Hamming_code "Hamming code") for error correction                                                                                                                    | 3                         | $1 - \frac1n \log_2(n+1)$ | One drive failure      | Drive Firmware and Parity         | Depends          | Depends            |
| [RAID 3](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_3) | Byte-level striping with dedicated parity                                                                                                                                                                                                 | 3                         | 1 − 1/_n_                 | One drive failure      | Drive Firmware and Parity         | _n_ − 1          | _n_ − 1            |
| [RAID 4](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_4) | Block-level striping with dedicated parity                                                                                                                                                                                                | 3                         | 1 − 1/_n_                 | One drive failure      | Drive Firmware and Parity         | _n_ − 1          | _n_ − 1            |
| [RAID 5](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_5) | Block-level striping with distributed parity                                                                                                                                                                                              | 3                         | 1 − 1/_n_                 | One drive failure      | Drive Firmware and Parity         | n                | single sector: 1/4 |
| [RAID 6](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_6) | Block-level striping with double distributed parity                                                                                                                                                                                       | 4                         | 1 − 2/_n_                 | Two drive failures     | Drive Firmware and Parity         | n                | single sector: 1/6 |

如图，在实际中：

- RAID 0 被广泛使用，通常用于对速度、存储要求高，但是不太在乎 MTTF 的情况
- RAID 1 被用于非常在意数据安全的情况
- RAID 4 在某些网络应用中被使用
    - 注意：RAID 3 本质上和 RAID 4 是一样的，只不过 RAID 4 更实际，以 block 为单元，而不是 byte
- RAID 5 被广泛使用，是比较均衡的选择

## RAID 的一些概念

首先，衡量一种 RAID 效率的指标有两个：储存效率和读写效率。

- 储存效率：就是 $\frac {\text{logical disk size}} {\text{physical disk size}}$
- 读/写效率：主要就是支持多少并发读写
    - Small Read/Write: 可以在满足约束条件的情况下，一次只读/写一行中某一个盘
    - Large Read/Write: 在满足约束条件的情况下，一次必须读/写一行所有盘
- bit/byte/block 条带化：就是将 bit/byte/block 1 放到 disk 1，bit/byte/block 2 放到 disk 2，……，bit/byte/block n 放到 disk $n \% \# \text{of disks}$
## RAID 3

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_17_30_37_202405281730871.png"/>

如图，如果

- 只有一个盘损坏
- **我们知道损坏的是哪一个盘**

那么就可以将这个盘进行恢复。

> [!note]+ Parity Code vs Hamming Code
> 
> 假如不知道损坏的是哪一个盘，还是老老实实用 hamming code 的 RAID 2 吧。

### RAID 3 的不足

只能够 large write。而不能 small write。

- 这是因为 RAID 3 是 **byte-条带化**的，从而逻辑中的一块是分布在物理上的所有块上的。
- 因此，如果你希望写**逻辑中的**一块进入磁盘，那么必须**在物理上**将数据同时写入所有磁盘。

## RAID 4

RAID 4 和 RAID 3 的差别是：

1. RAID 4 是 block 条带化的，而 RAID 3 是 byte 条带化的。
2. RAID 4 支持 small write。由于 $P_\text{old} = \text{other tables} \oplus \text{old data of this table}$，因此，$P_\text{new} = \text{other tables} \oplus \text{new data} = \text{other tables} \oplus \text{old data} \oplus \text{old data} \oplus \text{new data} = P_\text{old} \oplus \text{old data} \oplus \text{new data}$。我们只需要通过该块的旧数据、新数据和奇偶校验块本身，就可以计算得出。

> [!warning]+ RAID 4 相比 RAID 3 的缺点
> 
> 缺点很简单：假如说需要反复读某些块，而这些块在硬盘阵列上分布得不均匀。那么，就很容易导致硬盘之间的损耗不均匀（i.e. 某些硬盘比其他硬盘更早坏）。
### RAID 4 的不足

虽然可以 small write，但是 write 的时候，奇偶校验盘和数据盘都会受影响，因此无法并行写两个盘。

## RAID 5

RAID 5 就是在 RAID 4 的基础上，将奇偶校验盘均匀分布到了多个盘上。从而使得 small write 的并行性更好了（当然也无法保证一定可以并行）。

- 比如说：可以同时 small write D0, D0<sub>P</sub> 以及 D5, D5<sub>P</sub> 这四个磁盘，也就是逻辑上并行 small write D0, D5

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_18_44_15_202405281844839.png"/>

## RAID 6

RAID 6 就是采用两个奇偶校验盘，分别采用不同的奇偶校验算法，然后和 RAID 5 一样，也是均匀分布到多个盘上。这样就可以实现两个盘损坏也能恢复。

# Bus

> [!tldr] tl;dr
> 
> 不同的总线设计，万变不离其宗。我们只需要记住：**一条总线连到 CPU，其它所有设备挂在这个总线上。**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_19_2_18_202405281902245.png"/>

如上图，这就是最简单的总线示意。总线可以通过分时复用来同时进行多个传输，因此共用总线不是问题。

**最大的问题是**：由于设备直接连在了总线上，而总线也用作 processor 和 memory 的通信，因此时钟频率必须很高。而 I/O 设备本身根本不需要那么高的频率（频率太高不省电）。如果需要跨时钟域的话，就会设计上有冗余。

---

因此，我们自然会想到采用的以下的设计：将跨时钟域的部分，作为 **bus adapter**，直接修在电路上。然后，每一个 bus adapter 都可以对应一个速率转换，我们只需要设计对应速率的硬件即可。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_19_12_48_202405281912709.png"/>

- 如图，采用更多的 bus adapters，可以让硬件有更多的速率选择

## Handshake Protocol

对于跨时钟域传输，我们需要用到握手的协议。协议内容如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_19_28_57_202405281928671.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_19_29_44_202405281929564.png"/>

简单来说：

1. IO 设备给出 ReadReq 和内存地址。内存接收到了 ReadReq 之后，读取内存地址，然后返回 ack（表明我已经读完了，用不着了）
2. IO 设备接收到 ack，就停止 ReadReq 和内存地址
3. 内存发现 ReadReq 停止了，就知道 IO 设备已经接收到了 ack 信号，于是停止了 ack 信号

4 \~ 7 步同理。

