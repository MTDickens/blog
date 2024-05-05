# Multi-cycle CPU

由于一些指令可能需要花费非常长的时间，因此我们可以通过多周期 CPU，来避免 CPU 的单个时钟周期太长。

具体地，我们将 CPU 的一个指令分解成若干个微指令，而一个微指令，就是 FSM 的一个状态——FSM 的一个状态，对应一组控制信号。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/5_22_39_48_202405052239026.png" style="zoom:67%;" />

- 输入：opcode（以及 funct3/7）
- 输出：各个控制信号

和 single cycle CPU 的区别就是：这个 CPU 有状态，不是纯粹的组合逻辑，而是时序逻辑。

---

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/5_23_57_4_202405052357199.png" style="zoom:67%;" />

---

不过，目前这种架构并不常用，因为每执行一个微指令，CPU 一般只会用到很少的单元——其他单元是空闲的，从而造成资源浪费。

# Pipeline CPU (Cont)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_4_34_55_202405060434966.jpeg" alt="img" style="zoom: 67%;" />

如图，上面的设计，就好似”流水线“一般：

1. 不同步骤之间尽量分开
    - 除了最后一步（write back）和第二部（instruction decoding）需要共用 imem 以外（不过也是一读一写），都是分开的
2. 步骤之间需要传递一些信息。而这些信息使用锁存器进行记录。
    - i.e. 每个步骤可以产生一些信息，也需要使用一些信息。后面步骤可能会依赖本步骤产生的信息和之前步骤产生的信息，此时，我们就要将这些信息传下去。
    - e.g. PC 需要一直传到 EX 步骤（因为 `jalr` 需要用到），而 PC+4 需要一直传到最后（因为 `jal`, `jalr` 可能用到）