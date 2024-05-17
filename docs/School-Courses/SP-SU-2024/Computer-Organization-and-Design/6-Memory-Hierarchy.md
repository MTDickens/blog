# Basics

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_6_30_54_202405160630235.png"/>

如上图，对于多周期 CPU，往往取 mem 的时候用多周期去取，而且会有一个 ready bit。

# Cache

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_6_32_15_202405160632429.png" style="zoom: 67%;" />

如上图，可以参考我在 csapp 中的笔记。

## Example: the intrinsity FastMATH Processor

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_3_10_47_202405180310352.png" style="zoom:80%;" />

如上图，这个 cache 的参数是：

- block size: 16 words = 64 bytes = $2^6$​ bytes
- corresponding memory: 16 KB = $2^{14}$​ bytes

从而，我们的

- block offset bits: 6
- index bits: 14 - 6 = 8
- tag bits: 32 - 10 - 6 = 16

---

具体的实现中，可以看到：

1. mux 的输出式 32 位的，且忽略地址的前两位（也就是默认地址必须是 4 的倍数，也就是取的值是 4 bytes = 1 word 的）
    - 说明这个 cache 是 word-addressable 的
2. Hit bit 跟两个有关：cache.valid_bit ?= 1，以及 cache.tag ?= input.tag。

### Test: SPEC2000

使用 SPEC2000 benchmark 进行测试，结果如下：

| Instruction miss rate | Data miss rate | Effective combined miss rate |
| --------------------- | -------------- | ---------------------------- |
| 0.4%                  | 11.4%          | 3.2%                         |

由于 instruction 一般而言是顺序执行的，因此 locality 一般比较好。

而 data 一般而言总是难以避免随机读取，而且可能就只读一个值，因此 data miss rate 一般而言比较差。

## Split Cache and Combined Cache

我们的流水线用的是 split cache，为的就是避免结构竞争。

## Cache Performance Analysis

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_4_37_27_202405180437843.png" style="zoom:67%;" />

如上图，如果要将 4 个 block 从内存传到 cache，那么就需要：

1. 1 cycle 将地址传给 memory
2. 15 cycles 等待取内存数据
3. 1 (bus) cycle 数据从总线上传回 CPU

由于数据从总线上传回 CPU 这一步的同时可以传第下一个 address，因此总共耗时：$(1 + 15) * 3 + (1 + 15 + 1) = 65$。

由于内存数据需要先写到 cache 里，然后再花费一个周期从 cache 读入寄存器，因此，一共需要 66 个 clock cycles。

### Observation

从而，在 **miss rate = 10%** 的情况下，使用 cache 和不用 cache 的性能是有显著差距的。

但是，我们也明显看到：使用 cache 需要 7.5 clks，其中 6.6 的 clk cycle 就是白白等待 cache。

这说明，我们的 cache 有待改进：**reduce miss rate**。

---

同时，我们也可以看到，如果我们将 block size 上调至 16 words（同时假设 miss rate 不变），使用 cache 甚至比不用 cache 更加耗时。这一切的原因，就是**无法并行读取** memory。

这说明，我们的 memory 也需要跟 cache 配套：**reduce miss penalty**。

### Reduce Miss Penalty

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_5_16_32_202405180516251.png" style="zoom: 80%;" />

如图，传统的 memory 就是第一种——每次只能传一个 byte。

一个显然的想法是，我们可以增加带宽，从而一次可以传多个 bytes。

- 这种方式是不常用的，一个原因是如果需要加宽总线的话，代价太高

因此，我们就想：传输并不是瓶颈，获取地址才是。因此，与其总线加宽（并行传输+并行读取），不如就仅仅并行读取。具体方法如下：

我们将一个 word 的 4 个不同的 bytes 放在 4 个不同的 memory banks 里，然后 memory bank 取数据是并行/分时启动的，但是传输数据是串行的。

- 由于取数据是瓶颈，因此这种方式也很好
- 这种方式是现在的主流

#### Wide Memory

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_5_19_38_202405180519359.png" style="zoom: 80%;" />

如图：如果传输的线宽为 2 words (8 bytes)，那么我们就可以只需要传输两次，而不是 16 次。

图示如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_5_34_56_202405180534786.png"/>

#### Interleaved Memory

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_5_25_22_202405180525299.png" style="zoom:80%;" />

如图：如果线宽就是 1 个 word，但是分为 4 个 banks，然后 bank 的之间的启动时间间隔为 1 cycle（从而取出数据的时间也是 1 cycle）

图示如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_5_35_3_202405180535625.png"/>

**如果采用的这样的 memory，那么平均访问时间就是 90% * 1 + 10% * (1 + 1 + 15 + 4 * 1) = 3 cycles**。

**如果 block size 是 16 words，那么也是 90% * 1 + 10% * (1 + 1 + 15 + 16 * 1) = 4.2 cycles。相比 4 block 的情况，没有太大的问题。**

### Reduce Miss Rate

可以采用 multi-way 的方式来 reduce cache miss。

### Cache Metric

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_6_12_39_202405180612854.png" style="zoom:67%;" />

忽略软件上的影响，我们只看硬件。

如果使用了 2-way，那么

- miss rate 显然可以减少
- 同时由于 2-way 的逻辑门增加了，因此时钟周期可能会更长一点

权衡利弊之后，如果只看 **Average Memory Access Time** 这个 metric，那么 2-way 总体上还是比 1-way 要略好一些。

但是，CPU 不仅有 memory access，还有每一条指令的执行。如果 clock cycle 减慢了，那么受影响的还有指令的执行。因此，加上这一点之后，1-way 还是比 2-way 更好一些。

---

因此，**我们一般用 CPU time 来作为 cache metric**。CPU time 的计算方法如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_6_26_31_202405180626248.png" style="zoom:67%;" />

比如说，上面的 CPU TIME 1-way：

- 2 * 1.0: CPU **execution clock cycles per instruction**
- 1.5: 100% (imem access per instruction) + 50% (dmem access per instruction)
- 1.5 * 0.014 * 75: **Memory-stall clock cycles per instruction**

另外，假如 block is dirty，那么我们还需要 write back to memory，这又是一次开销。在具体计算的时候，我们还需要加上。

## Factors of Cache Metric

Cache metric 有几个 factors：

- CPI: 比如使用多发射、超标量啥的技术，就可以将 CPI 降到 1，甚至比 1 还小
- Clock Cycle Time: 现代处理器的主频不断提升，因此 clock cycle 一直在减小

但是，由于 memory 技术没怎么进步，因此，

- 如果 CPI 下降了，Memory-stall clock cycle 并没有下降
- 如果 Clock Cycle Time，由于**内存访问时间不变**，因此 Memory-stall clock cycles **反而会提升**，从而**更加拖后腿**
    - 有可能 clock cycle time 降了一半，但是 CPU time 只是降到了原来的 0.81 倍，性能只提升到原来的 1.23 倍

## Associativity

如果是 fully associative，使用硬件实现，一般就用三态门。但是硬件实现代价太高，而且会导致 clock cycle 大大减慢，因此一般不会这样做。

从而，我们一般用的是 set-associative。具体使用多少 set，还是需要权衡利弊。因为，对于总量相同的，如果采用更多的 set

- 用于选择”具体取哪一个 set“的逻辑门电路增加，从而会导致 clock cycle 时间增加
- 同样的内存容量，set 数量越多，统计上来看，冲突的概率就越小，因此 miss rate 会降低

## Space Overhead of Cache

假设我们的 cache 是 1-way associative cache in 32-bit addressable space with 

- block size: 4 words = 16 bytes = $2^4$ bytes
- corresponding memory: 4 KB = $2^{14}$ bytes

从而，我们的

- block offset bits: 4
- index bits: 14 - 4 = 10
- tag bits: 32 - 10 - 4 = 18

从而，cache 实际上需要占用的空间大小是：
$$
2 ^ {10} * (16 + 18 / 8 + 1 / 8) \mathrm{~bytes} = 18.375 \mathrm{~KB}
$$
其中，

- 16 是 block size
- 18 和 1 分别是 tag bits and valid bit (i.e. 上图的 "V")
    - 后面除以 8 是为了将 bit 转换为 byte

# Write Strategies

可以参考 [csapp notes](/self-learning/CMU-CSAPP/12-Cache-Memories/#cache-write)。这里简单说一说：

Write back: **写操作**的时候，写到 cache；如果替换掉的 cache is valid and dirty，那么这时候才将原先的 cache 写到内存中

Write through: **写操作**的时候直接写回内存

Write allocate: **写操作**的时候，如果对应内存不在 cache 中，那么就将这一个内存取到 cache

No-write allocate: **写操作**的时候，如果对应内存不在 cache 中，那么也不取来



可以发现：write through 就是和 no-write allocate 搭配着用的（i.e. 直接写回内存，也无需加载到 cache）；write back 和 write allocate 也一样（i.e. 为了写到 cache，首先这个内存地址得在 cache 里面；而通过 write allocate 的方式，我们确实就将这个内存地址加载到了 cache 里面去）。

