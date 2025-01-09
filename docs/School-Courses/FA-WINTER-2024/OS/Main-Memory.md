## Outline

- Memory allocation evolution
	- How to move a process
	- Partition
- Memory partition - fixed and variable
	- first, best, worst fit
	- fragmentation: internal/external
- Segmentation
	- Logical address vs physical address
- MMU: address translation + protection

## Memory Allocation Evolution

### Drawbacks of Physical Addressing

如果采用物理寻址的话，那么，

1. 针对不同的内存区域，必须对应的更改进程的指针
	- 最大问题在于：更改指针是不太切合实际的，因为现代指令集很复杂
2. 如果还有共享内存的话，还需要同时修改其它进程的指针
3. 物理中进程应该是连续的。如果内存碎片化严重，虽然剩余内存充足，但是内存空间不连续的话，那么还更麻烦——要么就设法使用不连续的内存空间；要么就浪费碎片内存空间，造成 starvation

因此，我们需要引入地址的虚拟化。

### Simple Solution: Memory Partition

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_19_11_28_20241112191127.png"/>

如上图：

- 我们有 base、limit 寄存器
- 每次访问地址的时候，我们看看地址是否大于 limit
	- 如果大于，那么说明**访问越界**。由于 partition 又称为 segmentation，因此这就是 segmentation fault
	- 如果不大于，那么说明正常，CPU 实际会向 MMU 请求 addr + base 这个地址
	- 图解
		- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_19_21_40_20241112192140.png" width="80%"/>
- 至于 base 和 limit 什么时候改？根据 `task_struct` 的信息，在 context switch 的时候改就行。

**好处**：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_19_31_23_20241112193122.png"/>

**问题**：

1. 仍然无法使用不连续内存空间。因此，
	- 请求增加内存空间
	- 和使用碎片内存加载进程
	的操作，是无法完成的。从而，我们只能通过**物理上移动内存**的方式，来消除内存碎片，但是，在进程多、碎片多的情况下，这样做非常 expensive
2. 无法实现内存共享

## Memory Partition

### Partition Strategy: Fixed Partition

如果所有 partition 的长度都一样，那么就不会出现碎片内存。

问题也很显然：

1. 内存浪费
2. 内存不够

其中，1 是最大的问题，又称为 **internal fragmentation**（process 内部出现大量未使用的内存）。

### Partition Strategy: Variable-Length Partition

解决了 internal fragmentation，但是问题也很显然：**external fragmentation**（不同 processes 之间存在大量未使用的内存）。

当然，我们可以使用一些策略来稍微缓解 external fragmentation:

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_20_5_18_20241112200517.png"/>

## Segmentation

### Sections of a Program

在实际中，一个 program 中，为了模块化，会有多个 sections：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_20_37_30_20241112203729.png" width="50%"/>

不同的 sections，内存地址不一定连续，访问权限不一样相同，因此可能需要多个的 sections (partitions) 来管理。而之前的实现中，一个进程只能对应一个 section (partition)。因此，我们需要引入更加复杂的实现。

### Segments (Partitions) of a Process

Program 加载到内存中，变成 process 之后：

1. 原本 elf 中繁杂的 sections，因为权限一样，很多都合并成了一个 segment
2. 加入了运行时 segments——stack, heap 等等

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_20_40_13_20241112204013.png" width="100%"/>

为了在一个进程中管理多个 segment，我们可以引入这样的机制：

1. 现在的 logical address 格式为 `<segment-num, offset>`
2. 进程的第一页，专门用于储存
	1. 每一个 segment 的 segment-base 和 segment-limit
	2. 每一个 segment 的权限
3. CPU 执行内存相关指令的时候，就先在这个表中检查（见下图）
	1. segment-num 是否 valid
		- 如果 invalid，就会触发 page fault
	2. offset 是否越界
	3. 权限够不够
	如果都检查没问题的话，就去访问 segment-base + offset 这个地址

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_20_48_25_20241112204825.png"/>

### Still Problem

仍然，external segmentation 的问题没有解决。一个 segment 必须在物理中占用连续内存。

## MMU

> [!info] tl;dr
> 
> MMU 就是用来将 logical (i.e. virtual) address 翻译成 physical address 的 module
### Address Binding: Revisted

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_6_50_20241112210649.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_7_17_20241112210716.png"/>

### MMU for Address Translation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_8_19_20241112210818.png"/>

> [!info]+ MMU in different forms
> 
> 如下图，框中的就等价于（一个非常简单的）MMU
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_10_14_20241112211014.png"/>

## Paging

> [!info] Introduction
> 
> Variable-length partition，通过 segmentation 的方法，让自己变得 practical 了。所以，fixed partition “不服”，于是想出了一个绝妙的点子——paging。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_26_14_20241112212613.png"/>

**Note**: 物理地址称为“帧” (frame)，逻辑（虚拟）地址称为“页” (page)。

和之前的 vanilla fixed partition 不同，这里**不再是 one process, one partition**，而是 **one process, many partitions**。

- 因此，我们不再需要考虑 process 的大小如何
- 由于 process 一般都不会比一个 partition 还要小，因此 internal fragmentation 一般不会太严重

同样，由于 **one process, many partitions**，我们必须知道一个进程中，每一个 partition 的对应关系。

因此，每一个 partition 都有一个物理地址的 base (i.e. `phy_base`)，而且还需要一个虚拟地址的 base (i.e. `vir_base`，原因见下面的 **Note**）。这就是 partition 的虚拟地址到物理地址的映射。这个映射被称为**页表（page table）**。

我们通过 MMU 来储存这些映射，并且用这些映射来进行地址转换。

- **Note**: vanilla fixed partition 没有虚拟地址。因为 **one process, one partition**，所以虚拟地址默认就是 0x0。但是 paging 的 partition 就要记录虚拟地址

### Larger or Smaller Frame Size? A Trade-Off

Frame size 更大，那么：

- **好处**：MMU 需要进行的储存就更少
- **坏处**：Internal fragmentation 更严重

### Page Table and Frame Table

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_50_30_20241112215030.png"/>

一言以蔽之：

- Page table 储存虚拟地址到物理地址的映射
- Frame table 储存物理地址的分配情况

> [!example]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_56_51_20241112215650.png"/>

### MMU Architecture (Based on Paging)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_57_6_20241112215706.png"/>

### Translation Lookaside Table

- PTBR 存着（最低级）页表的**物理起始位置**
- 因此，（每个进程的）page table 本质上也是要在内存中进行寻址
	- 而且是直接找物理地址（***不能和 OS 一样用 VIPT cache***）
- 而且，即使 page table 和 load/store 两者采用一样的 cache 方法，***page table 的 cache 本身就占空间，我们一样要额外加 cache 空间***

因此，基于上面两点（斜粗体字）原因，我们专门给 page table 加一个 cache：TLB。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_5_12_26_20241115051225.png"/>

**Note**: 

1. 使用 option II 显然更好。第一大大减小 context switch 的 overhead；第二所有进程的 kernel TLB 都是一样的，所以 kernel TLB 实际上根本无需替换。
2. Cache miss 显然是让 MMU（i.e. 硬件）自行处理，但是 TLB miss 可能是让硬件处理，也可能是让软件处理

#### TLB implementation: Associative Memory

由于 TLB 是乱序存的，因此为了实现高速查找（毕竟在 ld/sd 虚拟内存地址的时候，即便这些虚拟内存是在 cache 里的，因为 cache 是 VIPT，所以我们还是需要 physical address，所以 TLB 访问这一步是必做的。而 virtual addr -> physical addr 这个 overhead 就非常关键），我们使用了 associative memory 进行并行查找。
#### Hierarchical TLB

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_5_21_1_20241115052100.png"/>

在 arm 架构中，就像 `imem_cache` 和 `dmem_cache` 一样，我们也有 `i_tlb` 和 `d_tlb`。

> [!info]+ w/ TLB and w/o TLB
>
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_7_41_5_20241115074105.png" width="78%"/> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_57_6_20241112215706.png" width="78%"/>
> 
> 
> 前面的就是 w/ TLB，后面的就是 w/o TLB。

#### Quantized Analysis

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_7_43_53_20241115074352.png"/>

如上图：读取 TLB 的时间可以忽略不计。那么，只要 miss，（假设没有 cache，）就是双倍时间。


### Memory Protection

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_8_20_57_20241115082056.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_8_22_15_20241115082214.png"/>

## Structure of Page Table

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_21_57_6_20241112215706.png" width="50%"/>

如果使用上图的 one-level page table，会有两个严重的问题：

1. 对于单层的 page table，如果地址是 32 位，page size 为 4 KiB，那么 page table 就会有 $2^{32} / 2^{2+10} = 2^{20} \approx 10^6$ entries。如果一个 entry 占 4 bytes，那么页表大小就要 4 MiB
	- 对于 48 位的虚拟地址，page size 为 4 KiB，那么 page table 就会有 $2^{48} / 2^{2+10} = 2^{36} \approx 7 * 10^{10}$ entries。如果一个 entry 占 6 bytes，那么页表大小就要 364 GiB。这是完全不现实的
2. 由于 page table 用于将虚拟地址翻译成物理地址，因此 **page table 本身的地址必须是物理地址**（否则就是鸡生蛋 dilemma）。从而，如果用 single-level page table，那么 page table 本身必须在物理空间中连续。但是连续的空间是非常 rare 的——即使是一个 4MB 大小的连续空间。

因此，我们需要用到 multi-level page table。从而导致内存分配是有问题的。

### Two-Level Page Table

一目了然，不言而喻

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_22_43_9_20241112224308.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_22_42_44_20241112224243.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_1_49_15_20241113014914.png"/>

### Multi-Level Page Table in Practice

对于 ARM64 而言，其虚拟地址可以为 39 bit 或者 48 bit；对于 AMD64 而言，必须是 48 bit。

假设我们使用 ARM64，虚拟地址为 39 位，那么可以采用这样的三级页表：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_1_59_0_20241113015900.png"/>

**注意**：

1. `PTBR` 就是 page table base register，指向最低级页表的 head
2. 图中的所有加法，就是 base address (left arrow) + offset (top arrow) = target address

### Hashed Page Table

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_2_37_2_20241113023702.png"/>

如图所示，显而易见。注意我们使用的是链表哈希。
### Inverted Page Table

1. 虚拟内存地址空间比物理空间要大很多。比如对于 ARM64，虚拟空间至少有 512 GiB（39 bits），但是物理空间可能只能 8~16GiB 等等。
2. 每一个 process 都要有自己的页表。那么多 processes，如果每一个 process 都要自己的页表，那还是有点费空间的。

因此，我们可以考虑**不用虚拟地址充当 offset，而是用物理地址充当 offset**。此时，页表的大小由物理地址决定，而且只有一个全局的页表。

**Note**: 

- 其实，inverted page table 带上了 pid 也是不得而为之。因为一个物理 frame 可能对应任何 pid 下的某个虚拟 page，因此 (inverted) page table 内的信息必须是 `pid p` 二元组
- 至于正常的 page table，每一个 pid 都有一个自己的 page table，自然只需要物理 frame 的信息

#### Vanilla IPT

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_2_22_56_20241113022255.png"/>

如图：

1. 根据 pid 以及该进程的 VPN (i.e. P)，我们在 page table **线性查找** `pid p` 是否存在
2. 如果存在，那么**该 `pid p` 所在位置**相对 base address 的偏移量，就是 PPN (i.e. i)

问题：

1. 线性查找太慢。特别是 TLB miss 的时候，需要将所有 page table 都过一遍
2. 没法共享物理内存

## Swap Memory

可以认为，swap memory 就是为了完成下面的任务：

- 设想一下，你目前有 4 GiB 的内存，目前已经运行了 3.5 GiB
- 然后，你希望再运行一个需要 1 GiB 的进程
- 将这 1 GiB 进程加载进来之后，我们就有 0.5 GiB 的“进程内存”是在 swap 文件中
- 如果需要执行/读/写某一个在 swap 中的地址，但是物理内存已经满了，那么就会触发 page fault，将该地址对应的 block 从 swap 文件中换到内存中，同时将物理内存中的一个 block 当做 victim block，放到 swap 文件中。这就是一个 swap 操作

## Realworld Examples

### IA32 

为了兼容 segmentation，ia32 架构只能在 paging unit 前面加一个 segmentation unit。换句话说，当我们不使用 segmentation 而是使用 paging 的时候，就有 logical address = linear address

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_4_9_41_20241113040940.png" width="80%"/>

至于 paging unit，如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_4_32_0_20241113043159.png"/>

如果不开启 PAE，那么 IA-32 的每个进程的页表是不支持 4GiB 以上的寻址的。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_4_32_25_20241113043224.png"/>

**注**：

- 由于 IA-32 PAE 需要支持 4GiB 以上寻址，因此 page table entry 的长度就是 8 bytes。由于 1 页是 4 KiB，因此一个 page table 可以有 512 个 entries，也就是可以占 9 位
- 9 + 9 + 12 = 30，还少了 2 位。无奈，只好搞一个 3 级页表
	- CR3 指向 page directory pointer table 的 head 处。CR3 储存的就是这一个 frame 的 base address，因此低 12 位需要为 0
		- 因此，理论上，可以拓展到 (32 - 12) (CR3) + 32 (Logical Address) = 52 位的地址空间
		- 但是我们这里就只拓展到 36 位 = 64 GiB
		- 因为 64 GiB 对于个人用户而言已经远远足够了，如果你真要用到 64 GiB 以上内存，you better use IA-64！
	- Page directory pointer table 只可能用到前 4 项，因为只有 logical address 剩下的只有 2 bits
		- 但是我们实际上为一个 table 分配了 1 个 frame 的空间，所以，what a waste and how ad-hoc!

### ARM 32

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_4_46_51_20241113044650.png"/>
### ARM 64

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/13_4_46_44_20241113044643.png"/>

