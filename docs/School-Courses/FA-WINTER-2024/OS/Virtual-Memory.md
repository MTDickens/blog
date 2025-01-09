# Outline

- ﻿﻿Demanding paging
- ﻿﻿Copy-on-write  
- Page replacement algorithm
	- ﻿﻿FIFO, optimal, LRU, ...
- ﻿Allocation of frames  
- Thrashing
- ﻿﻿Examples

# Demand Paging

> [!info]+ 四个问题
> 
> - ﻿﻿Demand paging vs page fault
> 	- ﻿﻿What is the relationship?
> 		- Demand paging 在 "demand" 的时候，发生 page fault
> - ﻿﻿What causes page fault?
> 	- ﻿﻿User space program accesses an address
> - Which hardware issues page fault?
> 	- MMU
> 	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_9_9_42_20241115090942.png" width="20%"/>
> 		- 如图，一开始，都是 i (invalid)；之后一次次的 page fault，将 i 逐渐变成了 v (valid)
> - Who handles page fault?
> 	- Operating system
> 		- First check vma (virtual memory area)
> 			- if not in, well, (segmentation) error, abort
> 		- Next allocate a free physical frame to this page

tl;dr: 除非必须分配内存，否则就不分配。

简述一下 `malloc` 以及读写内存的流程：

1. Call `malloc`
2. `malloc` 会调用 syscall `brk`
	- 在 `task_struct` 的 `mm_struct` 的 heap 对应的 `vm_area_struct` 中，增长 heap 大小
3. 等到之后实际上去读写这块内存的时候，MMU 发现这个内存 invalid，因此 page fault。但是之后发现，的确在某个 `vm_area_struct` 中。因此，就去分配一块空闲的 frame 给这个 page。
	- 同时，这个 frame 必须 fill with zero，以保证安全性

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_9_6_33_20241115090632.png"/>

## Page Fault Handling

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_9_13_35_20241115091335.png"/>

如图：如果不是因为越界访问，也不是因为未分配，而是因为数据在硬盘上，那么就

1. 分配一个 free frame
2. 将数据从 disk 中加载到 free frame 中
3. 将 page table entry 的 i 改成 v，并且填入正确的 physical frame address
4. （由于是 interrupt，）重新执行造成这次 page fault 的那个 instruction

另外，为了加速，可以使用 page prefetching 的操作——一次 fetch 多个 page。这样做，某种意义上算是”空间换时间“。

## Paging Process

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_9_48_54_20241115094853.png"/>

如图：

1. 首先，触发 page fault
2. 然后，执行 read disk，把任务交给磁盘控制器去做，然后 context switch 到 process 1
3. Process 1 执行一段时间之后，因为 disk IO 结束，因此被 interrupt
4. disk IO 结束后，标记 P0 read from disk finished，然后返回 process 1
5. Timer interrupt，又轮到 P0 了
6. P0 发现 read from disk finished，于是
	- 更改 page table
	- 返回到 user space

## Quantized Analysis

- ﻿﻿Page fault rate: $0 \leq p \leq 1$
	- ﻿﻿if p = 0 no page faults
	- ﻿﻿if p = 1, every reference is a fault
- ﻿﻿Effective Access Time (EAT): $(1 - p) * \text{memory access} + p * ( \text{page fault overhead + swap page out + swap page in + instruction restart overhead})$

## Some Optimizations

1. 让 swap space 的 I/O 比 file space 的 I/O 更快。我们可以做到这一点，因为 swap space 不需要文件系统，而且可以使用更大的 page
2. Copy entire process image from disk to swap space at load time，从而如果 memory 满了，victim page 就可以被置换到 swap 上，而不是更慢的 disk 上
3. 对于 not dirty 且关联到某个硬盘文件的 page（反例：heap 和 stack 就没有关联到任何硬盘文件，所以如果被当成 victim，那就必须 write 出去），如果选择它来当 victim page，那么也无需 write to disk。只需要 discard 即可

# Page Replacment

有四个思想：

- FIFO
- Optimal
- LRU
- MRU

- FIFO 就是最简单的
	- 效果一般
- Optimal 就是 **replace page that will not be used for the longest time**
	- 需要能够预知未来
		- 如果需要访问的 page list 预先给到你了，那么效果是最好的
- LRU 就是把最久没用的踢出去
	- 最常用的，虽然操作系统用的都是它的 approximation
		- 可以是 single bit（load 进来的时候为 0，之后用到就设为 1，替换的时候先看 1 的）
		- 也可以是 multiple bits（load 进来的时候为 0000...001，过一段时候【比如 100 ms】就左移一位，使用一次就将最低位设为 1。这样就能记录各个时间段是否用过了）
	- 实际上，还可以用到将 LRU 换成最终的情况的
- MRU 就是把最近用到的踢出去
	- 效果是最差的

还有几个变种：

- second-chance replacement
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_3_58_15_20241120035814.png" width="80%"/>
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_4_2_16_20241120040216.png" width="80%"/>
	- 简单来说，就是如果是 1 的话，就把它放到队尾去（相当于给一个 second chance）
	- 经过实际测试，效果还是可以的
		- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_4_27_37_20241120042736.png"/>
- enhanced second-chance replacement
	- 考虑到如果 page 被 modify 了，我们需要花费双倍的时间，因此我们最好不要选被 modify 的当做 victim
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_4_30_54_20241120043054.png" width="80%"/>




> [!info]- Python code for cache simulation
> 
> 这是我提供的 cache simulation 结果和代码：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_2_7_20_20241120020719.png" width="50%"/>
> 
> - 如果不加参数，你可以复现代码
> - 你也可以在 GitHub 等网站上找一些 benchmark 来进行测试（格式是第一行为 capacity，之后的行都是 benchmark）
> 	- 比如 [Github](https://github.com/MohEsmail143/page-replacement-algorithms)
> 
> ```python
> import argparse as ap
> import os
> 
> class PageCache:
>     def __init__(self, capacity, benchmark):
>         self.capacity = capacity
>         self.benchmark = benchmark
>         self.cache = [None for i in range(capacity)]
>         self.free_cache_list = list(range(capacity))
>         self.page_faults = 0
> 
>     def run_simulation(self, algorithm, log=False):
>         """
>         Every step, the algorithm get the current page to read/write
>         If the cache is full, the algorithm must give the victim page number
>         """
>         for page in self.benchmark:
>             if log:
>                 print(page, self.cache)
>             if page in self.cache:
>                 algorithm.action(page, cache_full=(len(self.free_cache_list) == 0), page_miss=False, cache_list=self.cache)
>                 continue
>             else:
>                 self.page_faults += 1
>                 if len(self.free_cache_list) == 0:
>                     victim_cache_page_no = algorithm.action(page, cache_full=True, page_miss=True, cache_list=self.cache)
>                     if victim_cache_page_no is not None:
>                         try:
>                             index = self.cache.index(victim_cache_page_no)
>                             self.cache[index] = page
>                         except ValueError as e:
>                             print(e.args)
>                             exit(1)
>                     else:
>                         print(f"Cache {self.cache} is full, but the algorithm didn't choose a victim")
>                         exit(1)
>                 else:
>                     algorithm.action(page, cache_full=False, page_miss=True, cache_list=self.cache)
>                     self.cache[self.free_cache_list.pop()] = page
>         
>         return_val = (self.page_faults, self.get_page_fault_rate())
>         self.clear()
>         print(
> f"""
> {algorithm}
>     Page faults count: {return_val[0]}
>     Page fault rate: {return_val[1] * 100:.2f}%"""
>         )
>         return return_val[0], return_val[1]
> 
> 
>     def get_page_fault_rate(self):
>         return self.page_faults / len(self.benchmark)
> 
>     def clear(self):
>         self.cache = [None for i in range(self.capacity)]
>         self.free_cache_list = list(range(self.capacity))
>         self.page_faults = 0
>     
> class BaseAlgorithm:
>     def __str__(self):
>         raise NotImplementedError
> 
>     def action(self, page: int, cache_full: bool, page_miss: bool, cache_list: list):
>         """
>         page:       the page number to read/write in this round
>         cache_full: is the cache full?
>         page_miss:  is there a page miss (fault)?
>         cache_list: the current cache status
>         """
>         raise NotImplementedError
>     
> class FIFOAlgorithm(BaseAlgorithm):
>     def __init__(self):
>         super().__init__()
>         
>         import queue as Q
>         self.q = Q.Queue()
>     
>     def __str__(self):
>         return "FIFO Algorithm"
> 
>     def action(self, page, cache_full, page_miss, cache_list):
>         if not page_miss:
>             return
>         if cache_full:
>             last = self.q.get()
>             self.q.put(page)
>             return last
>         else:
>             self.q.put(page)
> 
> class FIFOSecondChanceAlgorithm(BaseAlgorithm):
>     def __init__(self, zero_on_load=False):
>         super().__init__()
>         
>         import queue as Q
>         self.q = Q.Queue()
>         self.lru_bits = {}
>         self.zero_on_load = zero_on_load # If the lru bit should be zero on load
>         self.lru_bit_on_load = 0 if zero_on_load else 1
>     
>     def __str__(self):
>         return f"FIFO Algorithm with Second Chance (lru_bit is {self.lru_bit_on_load} on load)"
> 
>     def action(self, page, cache_full, page_miss, cache_list):
>         if page_miss:
>             if cache_full:
>                 while True:
>                     last = self.q.get()
>                     if self.lru_bits[last] == 0:
>                         self.lru_bits[page] = self.lru_bit_on_load
>                         self.q.put(page)
> 
>                         self.lru_bits.pop(last)
>                         return last
>                     else:
>                         self.lru_bits[last] = 0
>                         self.q.put(last)
>             else:
>                 self.lru_bits[page] = self.lru_bit_on_load
>                 self.q.put(page)
>         else:
>             self.lru_bits[page] = 1
> 
> class LRUAlgorithm(BaseAlgorithm):
>     def __init__(self):
>         super().__init__()
>         self.lru = []
>     
>     def __str__(self):
>         return "LRU Algorithm"
> 
>     def action(self, page, cache_full, page_miss, cache_list):
>         if page_miss:
>             if cache_full:
>                 victim = self.lru[0]
>                 self.lru = self.lru[1:]
>                 self.lru.append(page)
>                 return victim
>             else:
>                 self.lru.append(page)
>         else:
>             self.lru.remove(page)
>             self.lru.append(page)
> 
> class SingleBitApproximateLRUAlgorithm(BaseAlgorithm):
>     def __init__(self):
>         super().__init__()
>         self.lru_bits = {}
>     
>     def __str__(self):
>         return "Single Bit Approximate LRU Algorithm"
> 
>     def action(self, page, cache_full, page_miss, cache_list):
>         if page_miss:
>             if cache_full:
>                 candidates_pages = [page_and_bit[0] for page_and_bit in self.lru_bits.items() if page_and_bit[1] == 1]
> 
>                 # Choose victim
>                 if len(candidates_pages) != 0:
>                     victim = candidates_pages[0] # Choose an arbitrary page whose bit is 1
>                 else:
>                     victim = list(self.lru_bits.keys())[0] # Choose an arbitrary page
>                 self.lru_bits.pop(victim) # Remove victim
>                 self.lru_bits[page] = 0 # Set page and bit
>                 return victim
>             else:
>                 self.lru_bits[page] = 0 # Set page and bit
>         else:
>             self.lru_bits[page] = 1 # Set bit to 1 (referenced)
> 
> class MRUAlgorithm(BaseAlgorithm):
>     def __init__(self):
>         super().__init__()
>         self.lru = []
>     
>     def __str__(self):
>         return "MRU Algorithm"
> 
>     def action(self, page, cache_full, page_miss, cache_list):
>         if page_miss:
>             if cache_full:
>                 victim = self.lru.pop()
>                 self.lru.append(page)
>                 return victim
>             else:
>                 self.lru.append(page)
>         else:
>             self.lru.remove(page)
>             self.lru.append(page)
> 
> 
> class OptimalAlgorithm(BaseAlgorithm):
>     def __init__(self, benchmark):
>         super().__init__()
>         self.benchmark = benchmark
>         self.step = 0
>     
>     def __str__(self):
>         return "Optimal Algorithm"
> 
>     def action(self, page, cache_full, page_miss, cache_list):
>         self.step += 1
>         if page_miss:
>             if cache_full:
>                 # Need to replace
>                 def safeIndex(li, v):
>                     try:
>                         return li.index(v)
>                     except:
>                         return len(li)
>                 remaining_benchmark = self.benchmark[self.step:]
>                 step_to_next = [safeIndex(remaining_benchmark, x) + 1 for x in cache_list] # The distance to the next 
>                 victim = cache_list[step_to_next.index(max(step_to_next))]
>                 return victim
>             else:
>                 # Just load in
>                 pass
>         else:
>             # Already in cache
>             pass  
> 
> def main(args):
> 
>     if args.benchmark_dir is not None:
>         benchmark = []
>         with open(args.benchmark_dir, "r") as f:
>             cache_size = int(f.readline())
>             for line in f:
>                 if args.is_address:
>                     benchmark.append(int(line) // 4096)
>                 else:
>                     benchmark.append(int(line))
>     else:
>         benchmark = [7,0,1,2,0,3,0,4,2,3,0,3,0,3,2,1,2,0,1,7,0,1]
>         # benchmark = [1,2,3,4,1,2,5,1,2,3,4,5]
>         cache_size = 3
> 
>     pc = PageCache(cache_size, benchmark)
> 
>     pc.run_simulation(FIFOAlgorithm())
>     pc.run_simulation(OptimalAlgorithm(benchmark))
>     pc.run_simulation(LRUAlgorithm())
>     pc.run_simulation(MRUAlgorithm())
>     pc.run_simulation(SingleBitApproximateLRUAlgorithm())
>     pc.run_simulation(FIFOSecondChanceAlgorithm(False))
>     pc.run_simulation(FIFOSecondChanceAlgorithm(True))
> 
> if __name__ == "__main__":
>     base_dir = None
>     args = ap.ArgumentParser()
>     args.add_argument("--benchmark_dir", "-B", type=str, help="The benchmark sequence")
>     args.add_argument("--is_address", "-A", action="store_true", help="The benchmark sequence is a list of addresses instead of page numbers")
>     args = args.parse_args()
>     if base_dir is not None:
>         args.benchmark_dir = os.path.join(base_dir, args.benchmark_dir)
>     main(args)
> ```

## Page Buffering

在真实的 OS 中，我们还有和 replacement 算法本身无关的改进：

- 我们会维护一个 free frame list，从而不需要有需求的时候才去找 free frame
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_5_26_16_20241120052616.png"/>
- 同时维护一个 modified page list
	- 从而在 disk idle 的时候，可以进行写回，充分利用资源
- 部分程序（比如数据库）会**自己维护 cache**，因此，如果操作系统也对同样的磁盘数据进行 cache，就会造成冗余
	- OS 有 raw disk mode，允许直接从磁盘上读取（i.e. OS 本身不会对这些数据进行 cache）

# Frame Allocation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_5_32_41_20241120053241.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_5_32_50_20241120053249.png"/>

# Page Reclaim

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_5_46_19_20241120054618.png"/>

我们要求进程获取的内存是直接在 free-frame list 上的，而不是从其它进程抢来的。

因此，在内存压力过大、 free-frame list 很少的时候，page claiming 就会将内存从进程手中进行回收，直到空闲内存高于阈值为止。此时，free-frame list 就很多，亟需内存的应用，就得以抢一大把过去。

这样，虽然进程之间没有明面上互相抢内存，但是实际效果是：一个进程可以把**其它进程在 page reclaiming 过程中被迫放弃的内存据为己有**。算是一种**实现 global replacement** 的方式。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_5_42_12_20241120054212.png"/>

如图：如果空闲内存过少，那么 OS 就开始从每一个进程回收内存，直到内存充分之后，再停止回收。

## How to Reclaim?

- ﻿﻿Reclaim pages aggressively
	- ﻿﻿Kill some processes
		- ﻿﻿According to OOM score: how likely it is to be terminated in case of low available memory

具体的 OOM 机制，详见 [CSDN](https://blog.csdn.net/top_explore/article/details/107733974)。
# Non-Uniform Memory Access

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_6_4_31_20241120060430.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_6_4_51_20241120060451.png"/>

如果有多个 CPU 和内存，那么内存访问时间就不统一，因此跑在不同 CPU 上的进程，最好用不同的 memory。

# Thrashing (抖动)

如果进程过多，导致内存占用过多**且由于不同进程的 locality 不一样，因此会造成页频繁的换进换出**，从而 CPU 随着进程数的增加，反而占用率降低，因为时间都用在 page fault 上了。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_6_50_33_20241120065033.png"/>

> [!info]- Locality
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_6_51_15_20241120065114.png"/>
> 
> 如图：a, b 两个进程的 locality 就如图中两个括号所示


为了避免抖动，第一种方案，就是使用 local page replacement——将 thrashing 限制在一个进程之内。

第二种方案，仍然使用 global page replacement，但是我们**对每个进程，随时跟踪一个工作集 (working set)**。这些工作集，就是每个进程需要频繁访问的页面。我们希望

1. 任何一个进程工作集内的页面不要被调出去
2. 如果所有进程工作集内页面加起来太多了，那么就“杀掉/暂停进程保平安”

## 工作集

> [!info]
> 
> 其实工作集就是 LRU 的变种——$\Delta$-recently used ($\Delta$-RU). 我们不希望 $\Delta$-RU 的页被 replace
> 
> 同理，和 LRU 一样，我们也有使用 bit 进行 approximate 的方法

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_7_1_50_20241120070149.png"/>

**定义（工作集）**：对于一个进程，给定 $\Delta$，时刻 $t$ 的工作集，就是 $(t - \Delta, t]$ 时间内，访问过的页面的集合。

**Approximation Using $b$ Memory Bits**:

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/20_7_9_21_20241120070921.png"/>
如图：

- 令 $\Delta = Tb$
- 任何时间，如果一个页被访问，那么就将它的 reference bit 变成 1
- 我们每隔时间 $T$ 检查一次
	- 先将所有在工作集中的页的 memory bits 左移一位
	- 然后，（假设当前时刻是 $t$，）**对于所有 reference bit 为 1 的页**，我们都将其 memory bits 的最低位变成 1
		- 如果在工作集中，就直接 0 -> 1
		- 如果不在，那么就将其加入到工作集中，且 memory bits 是 $\underbrace{00\dots 01}_{\text{共 } b \text{ 位}}$
	- 然后，将所有页的 reference bits 变成 0
	- 最后，将所有 **memory bits 全为 0**的页踢出工作集

这样，我们就能保证：

1. 所有在 $\Delta$ 时间内访问过的页，都在工作集中
2. 所有在工作集中的页，都在 $\Delta + T = (1 + \frac 1 b) \Delta$ 时间内访问过 

# Kernel Memory Allocation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_2_48_2_20241123024801.png"/>

# Other Considerations

## Prepaging

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_2_49_24_20241123024924.png"/>

Prepaging 就是一次取多页

- 可能先把所需要的页取过来
- 或者如果有并行机制的话，并行取多页也可以

这显然是一个 tradeoff。如果 prepaging 做的太多了，那么 $\alpha$ 就过于小，导致大量页面被浪费；如果太少了，那么就不能有效节省时间。同时，选取哪些页面来进行 prepaging，也是需要好好设计的。

## Page Size

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_2_58_53_20241123025852.png"/>

简单来说，page size 小一些，好处就是

- 减少 internal fragmentation
- 减小一个 page fault 的 I/O overhead

但是，总体上，现在的 page size 是越来越大，因为硬件便宜了（Internal fragmentation 不那么重要了）。

## TLB

增加 page size，就可以在 TLB 大小不变的情况下，让 TLB 的所有缓存页面对应的实际物理空间地址更大。因此增加 page size，可以有效减小 TLB miss 的发生频率。

## Program Structure

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_3_2_53_20241123030253.png"/>

Program 1 是按列访问的，因此 locality 很差。

## Example: Windows XP

- ﻿﻿Uses demand paging with clustering
	- ﻿﻿Clustering brings in **pages surrounding the faulting page**: locality
- ﻿﻿Processes are assigned **working set** minimum and set maximum
	- `﻿﻿wsmin`: minimum number of pages the process is guaranteed to have
	- ﻿﻿`wsmax`: a process may be assigned as many pages up to its `wsmax`
- ﻿﻿When the amount of free memory in the system falls below a threshold:
	- ﻿﻿Automatic ***working set trimming*** to restore the amount of free memory
	- ﻿﻿It removes pages from processes that have more pages than the `wsmin`

# Realworld Example: Linux Paging Management

```c
struct mm_struct {
	struct {
		struct vm_area_struct *mmap;		/* list of VMAs */
		struct rb_root mm_rb;
		u64 vmacache_seqnum;                   /* per-thread vmacache */
#ifdef CONFIG_MMU
		unsigned long (*get_unmapped_area) (struct file *filp,
				unsigned long addr, unsigned long len,
				unsigned long pgoff, unsigned long flags);
#endif
		unsigned long mmap_base;	/* base of mmap area */
		unsigned long mmap_legacy_base;	/* base of mmap area in bottom-up allocations */
#ifdef CONFIG_HAVE_ARCH_COMPAT_MMAP_BASES
		/* Base addresses for compatible mmap() */
		unsigned long mmap_compat_base;
		unsigned long mmap_compat_legacy_base;
#endif
		unsigned long task_size;	/* size of task vm space */
		unsigned long highest_vm_end;	/* highest vma end address */
		pgd_t * pgd;

		// ...
```

如上面的代码所示，`mm_struct` 就是一个 thread 的内存管理模块。

- `mmap` 就是下图中的蓝色列表
- `mm_rb` 用于快速查找、修改、删除蓝色列表中的一个项
- `pgd` 是一个指向该线程页表的虚拟地址（但是与物理地址差一个 constant，因此直接用一个宏就能转换）
	- 有一个函数可以将这个 `pgd` 转换成物理 page number，并 load 进 `satp` 里去

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_3_38_45_20241123033844.png"/>

## Page Fault Handling

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_4_1_58_20241123040157.png"/>

> [!info]
> 
> 下面的函数都是基于 Linux kernel v6.0 的

> [!info]- [`do_page_fault`](https://elixir.bootlin.com/linux/v6.0/source/arch/riscv/mm/fault.c#L206)
> 
> `do_page_fault` 函数将 `mm_struct` 类型 (这里实例是`mm`), address, `mm/vm_flags` 准备好，然后传入 `__do_page_fault`
> 
> ```c
> static int __kprobes do_page_fault(unsigned long far, unsigned long esr,
> 				   struct pt_regs *regs)
> {
> 	const struct fault_info *inf;
> 	struct mm_struct *mm = current->mm;
> 	vm_fault_t fault;
> 	unsigned long vm_flags;
> 	unsigned int mm_flags = FAULT_FLAG_DEFAULT;
> 	unsigned long addr = untagged_addr(far);
> 
> 	// ...
>   
> 	if (user_mode(regs))
> 		mm_flags |= FAULT_FLAG_USER;
> 
> 	/*
> 	 * vm_flags tells us what bits we must have in vma->vm_flags
> 	 * for the fault to be benign, __do_page_fault() would check
> 	 * vma->vm_flags & vm_flags and returns an error if the
> 	 * intersection is empty
> 	 */
> 	if (is_el0_instruction_abort(esr)) {
> 		/* It was exec fault */
> 		vm_flags = VM_EXEC;
> 		mm_flags |= FAULT_FLAG_INSTRUCTION;
> 	} else if (is_write_abort(esr)) {
> 		/* It was write fault */
> 		vm_flags = VM_WRITE;
> 		mm_flags |= FAULT_FLAG_WRITE;
> 	} else {
> 		/* It was read fault */
> 		vm_flags = VM_READ;
> 		/* Write implies read */
> 		vm_flags |= VM_WRITE;
> 		/* If EPAN is absent then exec implies read */
> 		if (!cpus_have_const_cap(ARM64_HAS_EPAN))
> 			vm_flags |= VM_EXEC;
> 	}
> 
> 	// ...
>   
> 	fault = __do_page_fault(mm, addr, mm_flags, vm_flags, regs);
> 
> 	// ...
> ```

> [!info]- [`__do_page_fault`](https://elixir.bootlin.com/linux/v6.0/source/arch/arm64/mm/fault.c#L476)
> 
> 1. 在 `__do_page_fault` 中，通过红黑树在 `mm` 中查找第一个 `end_address` 大于 `addr` 的 `vm_area_struct` 类型(这里实例是 `vma`)
> 2. 如果找到，就再检查是否 `start_address` 小于等于 `addr`
> 3. 如果都满足，那么最后检查是否够 `vma` 的权限
> 4. 如果够，就进入 `handle_mm_fault`
> 
> ```c
> static vm_fault_t __do_page_fault(struct mm_struct *mm, unsigned long addr,
> 				  unsigned int mm_flags, unsigned long vm_flags,
> 				  struct pt_regs *regs)
> {
> 	struct vm_area_struct *vma = find_vma(mm, addr);
> 
> 	if (unlikely(!vma))
> 		return VM_FAULT_BADMAP;
> 
> 	/*
> 	 * Ok, we have a good vm_area for this memory access, so we can handle
> 	 * it.
> 	 */
> 	if (unlikely(vma->vm_start > addr)) {
> 		if (!(vma->vm_flags & VM_GROWSDOWN))
> 			return VM_FAULT_BADMAP;
> 		if (expand_stack(vma, addr))
> 			return VM_FAULT_BADMAP;
> 	}
> 
> 	/*
> 	 * Check that the permissions on the VMA allow for the fault which
> 	 * occurred.
> 	 */
> 	if (!(vma->vm_flags & vm_flags))
> 		return VM_FAULT_BADACCESS;
> 	return handle_mm_fault(vma, addr, mm_flags, regs);
> }
> ```

> [!info]- [`handle_mm_fault`](https://elixir.bootlin.com/linux/v6.0/source/mm/memory.c#L5129)
> 
> 基本上直接进入 `__handle_mm_fault`
> 
> ```c
> vm_fault_t handle_mm_fault(struct vm_area_struct *vma, unsigned long address,
> 			   unsigned int flags, struct pt_regs *regs)
> {
> 	// ...
> 
> 	if (unlikely(is_vm_hugetlb_page(vma)))
> 		ret = hugetlb_fault(vma->vm_mm, vma, address, flags);
> 	else
> 		ret = __handle_mm_fault(vma, address, flags);
> 
> 	// ...
> }
> ```

> [!info]- [`__handle__mm_fault`](https://elixir.bootlin.com/linux/v6.0/source/mm/memory.c#L4967)
> 
> 简单来说，就是一级级进行页表查询，直到最后一级页表。
> 
> **注意**：`mm->p?d` 是 p?d 的表头地址的指针；但是 `p?d` 其实是这个表的表头+address 造成的偏移量，也就是 address 对应的 p?d 表中的 entry 的指针
> 
> **`p?d_alloc(mm, p?d, address)` 作用**：
> 
> - 传进去的 `p?d` 其实类型是 `typedef struct { p?dval_t p?d; } p?d_t` 的指针，而所有的 `p?dval_t` 其实都是 `u64`
> 	- `p?d` 的含义见上文的”注意“
> - `p?d_alloc` 其实就是根据这个 entry 来决定是否分配
> 	- 如果 `p?d->p?d == 0`，那么就说明这个 entry 没有下一级的 table，因此 `p?d_alloc` 会尝试给它分配一个下一级的 table
> 	- 如果 `p?d->p?d != 0` ，那么就说明已经分配了 entry，直接进去就是了
> - 然后，如果本来存在或者不存在但是分配成功，就返回非零值
> 	- 这个值不是下一级表的表头的指针，而是下一级表的表头+address 造成的偏移量，也就是 address 对应的 p(?+1)d 表中的 entry 的指针
> 
> ```c
> static vm_fault_t __handle_mm_fault(struct vm_area_struct *vma,
> 		unsigned long address, unsigned int flags)
> {
> 	struct vm_fault vmf = {
> 		.vma = vma,
> 		.address = address & PAGE_MASK,
> 		.real_address = address,
> 		.flags = flags,
> 		.pgoff = linear_page_index(vma, address),
> 		.gfp_mask = __get_fault_gfp_mask(vma),
> 	};
> 	struct mm_struct *mm = vma->vm_mm;
> 	unsigned long vm_flags = vma->vm_flags;
> 	pgd_t *pgd;
> 	p4d_t *p4d;
> 	vm_fault_t ret;
> 
> 	pgd = pgd_offset(mm, address);
> 	p4d = p4d_alloc(mm, pgd, address);
> 	if (!p4d)
> 		return VM_FAULT_OOM;
> 
> 	vmf.pud = pud_alloc(mm, p4d, address);
> 	if (!vmf.pud)
> 		return VM_FAULT_OOM;
> 
> 	// ...
> 
> 	vmf.pmd = pmd_alloc(mm, vmf.pud, address);
> 
> 	// ...
> 
> 	return handle_pte_fault(&vmf);
> }
> ```

> [!info]- [`handle_pte_fault`](https://elixir.bootlin.com/linux/v6.0/source/mm/memory.c#L4860)
> 
> 检查 `*vmf->pmd` 是不是空表。如果是的话，那么 `vmf->pte` 就设置成空串。
> 
> 然后就是第 19 行的判断：
> 
> - 如果 `vma_is_anomymous` （匿名 vma 就是**没有硬件映射的 vma**，也就是 minor fault），那么就 `do_anonymous_page`
> 	- 下文会简单分析
> - 反之，就是 major fault，直接 `do_fault`
> 	- 下文不分析
> 
> 后面还有 `do_swap_page` 和 `do_numa_page` (numa: non-uniform memory access)，这里就不做分析了。
> 
> ```c
> static vm_fault_t handle_pte_fault(struct vm_fault *vmf)
> {
> 	pte_t entry;
> 
> 	if (unlikely(pmd_none(*vmf->pmd))) {
> 		/*
> 		 * Leave __pte_alloc() until later: because vm_ops->fault may
> 		 * want to allocate huge page, and if we expose page table
> 		 * for an instant, it will be difficult to retract from
> 		 * concurrent faults and from rmap lookups.
> 		 */
> 		vmf->pte = NULL;
> 		vmf->flags &= ~FAULT_FLAG_ORIG_PTE_VALID;
> 	} else {
> 		// ...
> 	}
> 
> 	if (!vmf->pte) {
> 		if (vma_is_anonymous(vmf->vma))
> 			return do_anonymous_page(vmf);
> 		else
> 			return do_fault(vmf);
> 	}
> 
> 	if (!pte_present(vmf->orig_pte))
> 		return do_swap_page(vmf);
> 
> 	if (pte_protnone(vmf->orig_pte) && vma_is_accessible(vmf->vma))
> 		return do_numa_page(vmf);
> 
> 	// ...
> }
> ```

> [!info]- [`do_anonymous_page`](https://elixir.bootlin.com/linux/v6.0/source/mm/memory.c#L4031)
> 
> `do_anonymous_page` 的主要流程也很简单：
> 
> 1. 分配一个 zeroed, user, high and movable page（其实准确来说是 frame）
> 2. 然后刷新  TLB
> 3. 然后构建 entry，并把 entry 赋给 `vmf->pte`
> 
> ```c
> static vm_fault_t do_anonymous_page(struct vm_fault *vmf)
> {
> 	struct vm_area_struct *vma = vmf->vma;
> 	struct page *page;
> 	vm_fault_t ret = 0;
> 	pte_t entry;
> 
> 	// ...
> 
> 	page = alloc_zeroed_user_highpage_movable(vma, vmf->address);
> 
> 	// ...
> 
> 	/*
> 	 * The memory barrier inside __SetPageUptodate makes sure that
> 	 * preceding stores to the page contents become visible before
> 	 * the set_pte_at() write.
> 	 */
> 	__SetPageUptodate(page);
> 
> 	entry = mk_pte(page, vma->vm_page_prot);
> 	entry = pte_sw_mkyoung(entry);
> 	if (vma->vm_flags & VM_WRITE)
> 		entry = pte_mkwrite(pte_mkdirty(entry));
> 
> 	// ...
> 
> setpte:
> 	set_pte_at(vma->vm_mm, vmf->address, vmf->pte, entry);
> 
> 	// ...
> }
> ```

## Buddy System

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_6_29_49_20241123062948.png"/>

在现代 Linux 系统中，如果要分配 page，那么就一次性分配 $2^n$ 个连续的 pages（如上图所示）

- **好处**：可以 hierarchically 将 free 掉的内存再 merge 起来（另外可以保证在一次 `alloc_pages` 中，分配到的物理页面是连续的）
- **坏处**：Internal fragmentation 严重（比如只需要 21 MiB，但是必须一次请求 32 MiB）

## Slab System

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_6_29_42_20241123062941.png"/>

`thread_struct` 大小不是 4KiB 的整数倍，但是是由内核进行统一管理的（而分配给 user space process 的内存不是这样的，是每个 process 自己用自己的页面）。因此，我们可以利用**统一管理**这一点，来减少 internal fragmentation。

这时候，就依靠 slab allocator 来进行 non-page-aligned allocation（i.e. 我们不是直接从内存中 `malloc` 和 `free`，而是向 slab allocator 申请和返还 objects，如下图所示）

- 因为 `thread_struct` 的大小都是一样的，因此 non-page-aligned allocation 并不会造成过大的 overhead
- 比如说：如果 `thread_struct` 大小为 3KiB，那么如果存 4 个 structs，就只需要 3 页

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_6_40_48_20241123064048.png" width="70%"/>


# Appendix: What Does the Industry Say?

以下是工业界对 VM 的认识：

首先，flat memory（即不加任何保护，随便访问的 memory）很容易直接影响到内核，因此不能用。

如果在 flat memory 的基础上，划分出来不同的区域（i.e. memory mapping），那么虽然保护了 kernel，但是**造成了软件不可移植（甚至同一个机器上面都会出现问题，如果两次进程的地址不同）**。

因此，我们需要引入虚拟内存

- 在逻辑上，它是 flat memory，提供可移植性
- 在物理上，它又提供了内存保护等等机制

它的好处如下（简单来说就三个，可移植性、内存保护、内存共享）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_7_31_46_20241123073146.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_7_31_56_20241123073155.png"/>

---

从而，现在我们有了两套地址（空间）：物理地址和虚拟地址

粗略来说

- 前者用于硬件访问（except for CPU）
	- Peripherals 指边缘设备，比如说硬盘控制器等等
- 后者用于软件访问（via CPU）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/23_7_27_23_20241123072723.png"/>

# Realworld Scenario: Virtual Address Allocation for Linux

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/4_21_16_48_20241204211647.png"/>

对于 32 bit 而言，由于空间比较紧张，因此分配比较精细；对于 64 bit 而言，空间非常充足，因此分配是与架构本身相关的。

> [!info]- 以 ARM64 为例
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/4_21_20_40_20241204212039.png"/>
> 
> 实际上，ARM64 也不是一成不变。39 bit（三级页表）和 48 bit（四级页表）是可选的。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/4_21_21_2_20241204212102.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/4_21_24_14_20241204212414.png"/>

如上图：如果 RAM 空间小于 kernel address space 的话，那么就将所有的 RAM 都**线性映射**到 kernel logical addresses 的部分去。

- 剩下还有很多 kernel virtual address，这些地址可以做非线性映射，也就是**虚拟连续、物理不连续**的映射
- 一定注意，只有 kernel **logical** address 可以直接减去固定的 offset 得到对应的物理地址。Kernel **virtual** address 是不可以这样做的

线性映射

1. 首先可以保证 kernel 运行在高地址
2. 其次可以保证**当前页表下**，虚拟地址可以通过减去一个常数得到物理地址

如果 RAM 空间大于 kernel address space 怎么办？
## Large RAM

对于 32 bit 而言，如果采用 `CONFIG_VMSPLIT_1G`，那么最高位的虚拟空间只有 1G。

假设 RAM 很大，那么我们就要用这样的方式：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/4_21_36_50_20241204213650.png"/>

1. 首先保证部分 RAM 能够线性映射到 kernel 去（具体来说，就是映射到 kernel logical address 去）
2. 其次还要预留 128M 的空间，称为 kernel virtual address，这些空间可以与任意的 physical memory 进行映射（i.e. 虽然没法把整个 RAM 都映射到 kernel 中去，但是起码还有足够的空间，可以将任意 RAM 中的地址映射过去）

## Conclusion

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/4_21_44_39_20241204214438.png"/>

如图：

- kernel 有两种 address，logical 是线性的，virtual 是非线性的。线性地址可以和物理地址一一对应
- user 只有 virtual address，也就是只有非线性地址
- 线性地址的作用就是可以让内核知道这些地址对应的物理地址，从而便于设置页表

