# Lec 17: Virtual Memory

**VM visualized:**

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/250px-Virtual_memory.svg.png" alt="img" style="zoom: 80%;" />

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240202113013593.png" alt="image-20240202113013593" style="zoom:33%;" />

## Address Spaces

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240202114702249.png" alt="image-20240202114702249" style="zoom: 50%;" />

 如图，虚拟内存

- 保证每一个进程都有一样的 linear address space
- $m$ 远小于 $n$

#### How Virtual Addressing Works

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402022015698.png" alt="image-20240202201516586" style="zoom:50%;" />

如图，CPU 将虚拟地址发给 MMU，然后 MMU 翻译成物理地址，然后得到数据，返还给 CPU。

## VM as a Tool for (Disk) Caching

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240202174356924.png" alt="image-20240202174356924" style="zoom: 67%;" />

在任意时刻，虚拟页面的集合都分为三个不相交的子集：

- **未分配的 (Unallocated)：**VM 系统还未分配（或者创建）的页。未分配的块没有任何数据和它们相关联，因此也就不占用任何磁盘空间。
- **缓存的 (Cached)：**当前已缓存在物理内存中的已分配页。
- **未缓存的 (Uncached)：**未缓存在物理内存中的已分配页。

### Page Table

A **page table** is an array of page table entries (PTEs) that maps virtual pages to physical pages.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240202200049388.png" alt="image-20240202200049388" style="zoom: 67%;" />

如图，蓝色的是 cached，灰色的是 uncached，白色的是 unallocated。

- Cached address 储存在 DRAM 和 disk 上，可以从 DRAM 处获取
- Uncached address 只储存在 disk 上

---

具体地，虚拟地址空间中的每个页在页表中一个固定偏移量处都有一个 PTE。

为了我们的目的，我们将假设每个 PTE 是由一个有效位（valid bit）和一个 n 位地址字段组成的。有效位表明了该虚拟页当前是否被缓存在 DRAM 中。

- 如果设置了有效位，那么地址字段就表示 **DRAM 中相应的物理页的*起始位置***，这个物理页中缓存了该虚拟页。
- 如果没有设置有效位，那么
  - 一个空地址表示这个虚拟页还未被分配。
  - 否则，这个地址就**指向该虚拟页在磁盘上的*起始位置***。

---

对于磁盘上的 Virtual Memory，每一个 PTE 可以

- 指向一个 user-level file 的某个位置
- 全零，从而默认指向 swap file

### Page Hit

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240202201349971.png" alt="image-20240202201349971" style="zoom:50%;" />

如图，MMU 接收到虚拟地址请求后，就进行查表，然后发现对应的 PTE is valid。从而直接在 Physical Memory 中获取资源。

### Page Fault

如果 valid 位为 0，但是 disk address 不为空，那么，就进入 page fault 中断。Kernel 会”牺牲“ cache 中的一个 page，并替换成目标 page。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402022031722.png" alt="image-20240202203101059" style="zoom:50%;" />

如图，kernel 选择牺牲了 Virtual Page 4，并把 VP 3 对应的磁盘物理页加载到 DRAM 对应的物理地址，然后让 PTE 3 指向对应的 DRAM 物理地址，同时 valid 改为 1。

### Allocating Pages

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031348399.png" alt="image-20240203134851133" style="zoom:50%;" />

## VM as a Tool for Memory Management

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031349824.png" alt="image-20240203134935100" style="zoom:50%;" />

如图，我们可以建立起每个进程的**虚拟地址空间的每个 Virtual Page** 到**物理地址空间的 Physical Page** 的映射。

从而，我们为所有进程提供了相同的内存接口，但是实际上，它们物理内存*以页为单位*，分散在物理内存的各处。

- 并且，你可以看到，对于两个不同的进程，它们的 VP 2 都被映射到了 PP 6。这就是共享（只读）库的方法。

### Linking and Loading

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031436033.png" alt="image-20240203143632314" style="zoom:50%;" />

如图，我们可以保证

- 链接时，由于每个进程的 VAS 都类似，因此链接器只需要采用相同的分配策略即可
- 加载时，我们只是将页表中的对应 PTE 标记为 invalid，指向对应的 virtual memory 位置（也就是 **initialize uncached**）。
  - 从而，直到我们需要那一部分的代码，我们再从硬盘中取出（也就是 **copy on demand**）。保证了物理内存的充分利用。

## VM as a Tool for Memory Protection

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031456462.png" alt="image-20240203145641826" style="zoom: 50%;" />

如图，我们通过虚拟内存的 PTE，实现了访问、执行等控制。

## Address Translation

### Naive Address Translation

通过虚拟地址查表的步骤如下：

1. CPU 将虚拟地址发送到 MMU
2. MMU 将对应的 PTE Address 地址发送到 Cache/Memory 进行查表，并得到 PTE
3. MMU 检测对应 PTE 的 permission bits 等等。
4. 如果 valid，就直接发送 Physical Address 到 Cache/Memory，然后数据传回 CPU
   <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031619415.png" alt="image-20240203161918748" style="zoom: 33%;" />
5. 如果 invalid，就触发 page fault，并由 page fault handler 选择 victim page，并从 disk 替换成 new page。
   之后的步骤与 step 4 相同。
   <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031621380.png" alt="image-20240203162120857" style="zoom:33%;" />

---

内存和缓存的具体行为如下图所示
<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031613302.png" alt="image-20240203161333803" style="zoom: 50%;" />

### Efficient Address Translation

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031752790.png" alt="image-20240203163012977" style="zoom: 33%;" />

我们可以为虚拟内存单独设一个缓存。

如图，我们根据 Virtual Page（而不是 Physical Page！）Number 来进行缓存。

从而可以保证：只要你在 Virtual Memory 的 context 下实现了 locality，那么，TLB 缓存就会 work efficiently。

### Example

假设，我们有一台计算机

- 地址

  - 虚拟地址：14-bit
  - 物理地址：12-bit
  - page size: 64 bytes

  那么，就有
  <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031758086.png" alt="image-20240203175759968" style="zoom:33%;" />

- TLB 有 16 entries，4-way associative（i.e. set size = $4 = 2^2$, tag size = $2 ^{8-2} = 2^6$）

  那么，就有
  <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031756592.png" alt="image-20240203175607582" style="zoom:33%;" />

- Page table 不分层。因此自然就有 $2^{14-6} = 2^8 = 256$ 个 PTE。

  我们这里只显示前 16 项
  <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031759460.png" alt="image-20240203175954872" style="zoom:33%;" />

- Cache

  - 16 lines, 4-byte block size
  - 基于物理地址
  - directly-mapped (i.e. 1-way associative)

  <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402031801433.png" alt="image-20240203180151250" style="zoom:33%;" />

---

从而，我们的寻址过程如下（两个例子）：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402202337167.png" alt="image-20240203175512087" style="zoom: 25%;" /><img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402202337895.png" alt="image-20240203180537955" style="zoom: 25%;" />

如图，例一中

- 首先，由于 TLBI = 0b11，因此在 TLB 的第三个 set 查找。由于 TLBT = 0x03，因此在第二个 line 找到，从而 TLB-Hit
- 然后，由于 PPN = 0x0D，因此用 0x0D **替换**虚拟地址的 TLBT，得到物理地址
- 最后，查询物理地址，在第 0x5 个 set 查找，并且由于 tag 就是 "0x0D"，因此 Hit。最终返回 B0 的值：0x36

对于例二

- 首先，由于 TLBI = 0b00，因此 TLB 的第 0 个 set 查找。由于 TLBT = 0x00，因此 TLB miss（可以在第三个 line 中得知）。从而，需要在物理内存的 page table 中查找。
  - 由于 valid，因此 page hit，而且对应的物理内存是 0x28
- 然后，由于 PPN = 0x28，因此用 0x28 **替换**虚拟地址的 TLBT，得到物理地址
- 最后，查询物理地址，在第 0x8 个 set 查找，由于 tag 是 "0x24"，不等于 0x28，因此 cache miss。因此，需要在物理内存的 cache 进行查找。最终返回值位置，此处记为 Mem。

