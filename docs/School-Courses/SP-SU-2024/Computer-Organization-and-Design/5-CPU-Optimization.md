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

# 0 Pipeline CPU

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_4_34_55_202405060434966.jpeg" alt="img" style="zoom: 67%;" />

如图，上面的设计，就好似”流水线“一般：

1. 不同步骤之间尽量分开
    - 除了最后一步（write back）和第二部（instruction decoding）需要共用 imem 以外（不过也是一读一写），都是分开的
2. 步骤之间需要传递一些信息。而这些信息使用锁存器进行记录。
    - i.e. 每个步骤可以产生一些信息，也需要使用一些信息。后面步骤可能会依赖本步骤产生的信息和之前步骤产生的信息，此时，我们就要将这些信息传下去。
    - e.g. PC 需要一直传到 EX 步骤（因为 `jalr` 需要用到），而 PC+4 需要一直传到最后（因为 `jal`, `jalr` 可能用到）

> ~~**注意：**~~
>
> - ~~**假如某一层的一个电路元件是时序逻辑的话（比如 dmem/regfile 的 write_data），那么就让它直接连到上一层的输出**~~
>     - ~~因为如果连到本层和上层之间的寄存器，那么在上升沿瞬间，“上层输出 -> 两层之间寄存器”和“两层之间寄存器 -> 本层时序逻辑器件”两件事情是同时发生的，就会造成输入本层时序逻辑器件的东西**实际用到的是上一条指令的结果**~~
> - ~~**假如是组合逻辑的话（比如 dmem/imem/regfile 的 output，又比如 alu/comparator），那么就连到本层和上层之间的寄存器。**~~
>     - ~~如果连到本层和上层之间的寄存器，那么在上升沿之后很短的时间内，本层和上层之间的寄存器就更新到了当前指令的结果，因此很快输出就会恢复正常~~
>     - ~~因为如果连到上一层的输出，那么该组合器件的输出就与上一层的输出有关，而由于上一层在本时钟周期中会改变，因此该组合器件产生的输出**实际用到的是下一条指令的结果**~~

## 0.1 Implementation Details

我们的电路中，均是连到两层之间的临时寄存器。从而会导致必须要**在下一拍的上升沿处**，时序器件才能读取正确的值，然后过一段时间之后，和该时序器件配套的组合器件才能输出正确的值。

不过，对于一般情况而言，这并没有什么。比如先后 `sd x1, 0(x0)` 和 `ld x1, 0(x0)` 两条命令：

1. 在 0                     clk cycle 瞬间，`dmem[0] = EX/MEM(dmem_wen) ? EX/MEM(dmem_in) : self, EX/MEM(dmem_in) = x1`，显然，`dmem[0]` 是旧的
2. 在 0 \~ 0.01         clk cycle 期间，`EX/MEM` 的各寄存器才更新到最新值。不过，这已经和 `dmem_wen, dmem_in` 无关了
3. 在 1                     clk cycle 瞬间，`dmem[0]` 终于**开始**将自己更新到了 `sd x1, 0(x0)` 操作后的值。
4. 在 1 \~ 1.01         clk cycle 期间，`EX/MEM` 的各寄存器才更新到最新值。不过，这已经和 `dmem_wen, dmem_in` 无关了
5. 在 1 ~ 1.99         clk cycle 期间，`dmem[0]` **完成**将自己更新到 `sd x1, 0(x0)` 操作后的值
6. 在 1.99 \~ 1.995 clk cycle 期间，**组合电路**将 `dmem[0]`  完成将自己更新到 `sd x1, 0(x0)` 操作后的值
7. 在 2.000             clk cycle 瞬间，**组合电路**将 `dmem[0]` 的值写进了 `MEM/WB(rd_val)`
8. ***下面的情况详见 [Double Bump Details](#1.3.1.2 Implementation Details (Cont.))***

# 1 Hazards of Pipelining

有三种 hazards: structure hazard, data hazard and control hazard.

下面内容来自 [Lab5: 流水线 CPU 设计](https://yuque.zju.edu.cn/trsrpp/ozl96b/igc1df)

## 1.1 流水线并行

若把执行一条指令的过程比作洗衣服的过程，那么单周期 CPU （上图） 和流水线 CPU （下图）的差别如下所示。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_23_46_10_202405072346816.png" style="zoom: 50%;" />

可以看到虽然细一件衣服的时间没有变，但是同时最多可以洗四件衣服，所以效率得到了大大的提高。对于 CPU 来说，从 pc 中存储的指令地址，一直到取出地址，进行计算，将数据存回 regfile 或者数据内存，这一条路径的延时非常长，若将其分成不同阶段，流水线的执行，每条指令执行的时间不变（甚至会变长一点），但是 CPU 会同时执行多条指令，所以运行的效率会得到很大的提升。

经典的五级流水线 CPU，分为如下五级：

- 取指（IF）：根据 pc 取出指令
- 译码（ID）：根据取出的指令进行译码，生成控制信号，取出操作数等。
- 执行（EX）：执行计算或者做比较的过程。
- 访存（MEM）：访问数据内存
- 写回（WB）：将计算结果写回 regfile。

## 1.2 流水线竞争

竞争或冲突是因为指令的执行由顺序变为并行执行，由于指令之间的一些依赖关系导致了并行执行的指令存在冲突，通常有以下三种冲突。

- 结构竞争：并行的指令需要使用同一结构。
- 数据竞争：需要等待前序的指令完成数据的读写才能执行。
- 控制竞争：分支和跳转指令后续执行的指令需要该条指令执行完成后才能决定。

通常解决流水线竞争的方式就是停顿（stall），即将产生冲突的指令以及之后的指令的执行都停止，等待引发冲突的指令执行完成再继续执行。但也有一些方式可以解决冲突，减少 stall 的时钟周期数。

## 1.3 结构竞争的解决方式

经典五级流水线中，结构冲突有以下两种。

- IF 级和 MEM 级都要访问内存，产生结构冲突。
- ID 级要读取 regfile，WB 级要写入 regfile。

解决的方式其实很简单：

- 访问内存的冲突，其实将数据内存和指令内存分开已经完美地解决了这个结构竞争，所以咱们实验其实不存在这个冲突。
- 对于读写 regfile 的冲突，若 regfile 使用上升沿写入，则对 regfile 的写入会在下一个时钟周期上升沿才完成，则在下一个时钟周期才能看见修改，我们可以使用 double bump 技术，即 regfile 使用下降沿写入，将一个时钟周期一分为二，前半个周期完成数据的写入，后半个周期完成数据的读取。即可完美解决这个冲突。

### 1.3.1 Double bump

#### 1.3.1.1 原理解释

假设 ID 和 WB 发生在同一 clock cycle，且 regFile是**上升沿写入**，那么在时钟上升沿瞬间：

1. 从 MEM 中传过来的 rd 以及 data 和 regWrite 从 EX/MEM 传到 MEM/WB
    - 但是，由于写入寄存器需要时间，因此，在上升沿瞬间，MEM/WB 的寄存器还保持旧的数据
2. regFile 根据**旧的 MEM/WB 的 regWrite 和 rd, data**，决定是否写入、写到哪里、写入什么

因此，rd 的数据，直到**下一个周期才有效**

---

但是，如果 regFile 采用**下降沿写入**，那么在下降沿瞬间：

1. MEM/WB 的数据，早已经是新的数据了
2. regFile根据**新的 MEM/WB 的 regWrite 和 rd, data**，决定是否写入、写到哪里、写入什么

因此，rd 的数据，在**本周期的后半部分（i.e. 低电平部分）**就有效了。

由于 regFile 的读取数据是组合电路，因此，在本周期的后半部分，rs1 和 rs2 均有效。下一周期开始，ID/EX 的也是有效的。

#### 1.3.1.2 Implementation Details (Cont.)

前情请见 [Pipeline CPU](#0.1 Implementation Details)。

1. 在 2.00 \~ 2.01 clk cycle 期间，`MEM/WB` 才将自己更新到了最新值。其中我们关注的就是 `MEM/WB[rd_val]`
2. **假如*没*有 double bump**
    - 在 3.000 clk cycle 瞬间，`regfile` 才开始把正确的值 `MEM/WB[rd_val]` 读进去
        - 此时，如果在 2 \~ 3 clk cycle 内，有一个指令需要读取 `regfile[rs1/rs2]` 的值，且 `rs1/rs2 == rd`，那么为时已晚，写到 `ID/EX` 中的值可能是错的
3. **假如有 double bump**
    - 在 2.500 clk cycle 瞬间，**通过下降沿写入的方式**，`regfile` 就已经开始把正确的值 `MEM/WB[rd_val]` 读进去
    - 在 2.502 clk cycle 瞬间，write 完毕，同时组合电路中，`regfile[rd]` 已经更新为正确的值。
        - 此时，如果同一周期内有一个指令需要读取 `regfile[rs1/rs2]` 的值，且 `rs1/rs2 == rd`，那么就可以在 3.000 clk cycle 瞬间开始将 `regfile[rs1/rs2]` 正确的值写到 `ID/EX` 中

#### 1.3.1.3 一个例子

如下图所示：通过 stall 的方式，我成功避免了 ADD R1, R2, R3 和 SUB R4, R1, R5 产生冲突。

- 注意：由于采用了 double bump，我可以在一个周期内完成 write back 以及 instruction decode。因此，只需要隔两条指令即可。
    当然，如果没有 double bump，那么就必须隔三条指令。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_2_7_5_202405080207201.png" style="zoom:80%;" />

## 1.4 数据竞争的解决方式

数据竞争主要有以下三种类型：

- RAW：写后读
- WAR：读后写
- WAW：写后写

由于五级流水线也是顺序流水线，能保证在前序指令完成写入和读取后才进行写入，所以不存在后面两种数据竞争类型。（体系结构课程会学到的乱序流水线会存在这两种竞争，大家可以期待一下，确信）

CPU 中只有数据内存和 regfile 两个结构会涉及到写入操作，所以数据竞争主要发生在这两个结构中，又由于数据内存一次只能处理一条指令的操作，一条指令不可能同时读和写内存，且顺序流水线保证了执行的顺序，**所以对数据内存不会出现写后读的竞争。**

则写后读只会发生在寄存器的读写中，可以设想一下在 EX 级或者 MEM 级存在指令要修改某个寄存器，但它是 ID 级指令的一个源寄存器，此时若直接读取就只能读取到旧数据，而不是前序指令修改后写回的数据。

解决的方式主要为 forwarding，即前递。

### 1.4.1 forwarding

虽然前序指令在 EX 级或 MEM 级，还没将计算结果写回 regfile，但其实计算结果已经出现在了数据通路中，此时只要将其传到 ID 级，通过多路选择器选择正确的结果作为 ID 级从 regfile 中读取到的源数据即可。（当然这个多路选择逻辑也可以在 EX 中实现，具体的逻辑大家可以自行梳理。）

需要注意，若同时需要从 EX 级和 MEM 级前递结果，则需要判断前递最新的数据，即 EX 级的指令是后序指令，其才是最新的值。

如下图，我们通过 forward 

1. (1) 的 **EX/MEM 结果**到 (2) 的 **EX 的 ALU 输入**，由于 **ALU 是组合电路**，因此在上升沿很短时间之后，ALU 就可以读取正确的值，然后输出正确的值。
2. (1) 的 **MEM/WB 结果**（*其实就是 EX/MEM 的结果复制到了 MEM/WB*）到 (3) 的 **EX 的 ALU 输入**，由于 **ALU 是组合电路**，因此在上升沿很短时间之后，ALU 就可以读取正确的值，然后输出正确的值。
3. 由于 double bump，(1) 的 WB 可以和 (4) 的 ID 在同一拍（只要让 ID 在下降沿即可）
4. (5) 更没问题了

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/15_22_52_5_202405152252405.png" style="zoom:80%;" />

#### 1.4.1.1 datapath

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/15_23_4_11_202405152304284.png" style="zoom:80%;" />

如图，对于这里的 mux 的四根线，我们从下往上编号为 `00`, `01`, `10`, `11`：

1. `00` (黑线): 如果没有任何数据竞争
2. `01` (粉线): 如果**上上条指令的 rs1/rs2** 和本条指令有竞争，且上上条指令是从内存中 load 值到本指令的 rs1/rs2。
3. `10` (蓝线): 如果**上上条指令**和本条指令有竞争，且上上条指令是将 ALU 结果 load 到本指令的 rs1/rs2。
4. `11` (红线): 如果**上条指令**和本条指令有竞争，且上上条指令是将 ALU 结果 load 到本指令的 rs1/rs2。

#### 1.4.1.2 control

我们可以将各个层的信号接到 `forward` 控制信号发生器去，然后 `forward` 就可以产生这两个 mux 的控制信号。如下所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/15_23_47_14_202405152347853.png" style="zoom: 80%;" />

#### 1.4.1.3 Tips

假如指令如下：

```asm
add x5, _, _
add x5, x5, _
add x5, x5, _
```

那么，第三条指令的 RS1，既满足上上条指令有竞争，也满足上条指令有竞争，此时，当然是选择上条指令，而不是上上条。

#### 1.4.1.4 `dmem` forwarding

比如我们有如下的指令：

```asm
ld r15, 0(r4)
sd r15, 4(r2)
```

那么，我们显然可以直接将 dmem 中读出的值，直接转头就写到 dmem 中去。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_3_25_37_202405160325342.png" alt="image-20240516032533923" style="zoom:50%;" />

注意：

- 为了实现 `dmem` forwarding，我们还需要
    - 在 forwarding unit 中添加检测 `ld`, `sd` 的部分
    - 在 dmem_in_data 处添加一个 mux，用于选择到底写入的是 EX/MEM[dmem_in_data] 还是 MEM/WB[dmem_in_data]
- 如果没有 forwarding（但是有 double bump），那么就要插入两个 bubbles，性能很差，而且逻辑还更复杂了。

### 1.4.2 stall

#### 1.4.2.1 load 导致的 stall

若此时 ID 级需要 forwarding EX 级写回目的寄存器的结果，但是此时 EX 级是一条 Load 指令，则还没读取到需要的结果，则此时 IF 和 ID 两级需要因为这个冲突停顿一个时钟周期，当 load 指令流动到 MEM 级，将数据读取出来后前递到 ID 级。这个停顿是无法避免的。若产生了这个停顿，则只需停止 IF 和 ID 两级的指令流动（保持 IF/ID 寄存器的值不变），并将 EX 级的下一条指令设为 `nop` 即可。

如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/15_23_58_31_202405152358957.png" style="zoom:67%;" />

当然还有一种情况的 Load 产生的 stall 是可以通过 forwarding 来解决的，就是 load 指令后面是一条 store 指令，且 store 指令会将刚刚读取到的数据写回数据内存中，这个时候可以将 MEM 中读取到的数据前递到 MEM 级写端前的正确位置，从而减少掉这一 stall。

#### 1.4.2.2 我们什么时候应该 stall？

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_2_53_57_202405160253195.png"/>

由上图，我们通过 double bump 解决了第四个冲突，通过 forwarding 解决了第三个冲突。

只有第二个冲突需要 stall，但是我们通过 forwarding，将本来需要添加两个 bubbles 的，优化到只用添加一个 bubble。

#### 1.4.2.3 load stall 的细节

假如目前的指令处**在 ID 阶段**，并且发现：

1. 自己需要使用到 rs1/rs2
    - 具体如何判断，根据自己指令的 type 进行比对即可
    - 比如 `add x1, x2, x3`
2. 下一条指令的 mem_read 是 1，而且 rd 和自己的 rs1/rs2 一样，且 rd != x0
    - 比如 `ld x2, 4(x0)`

那么，就必须**添加一个 bubble（下 1）**，同时**让 IF, ID 停止“流动”（下 2, 3）**：

1. ID/EX 寄存器的信号均为 0，也就是 `nop` 的信号。从而逻辑上插入了一条 `nop` 指令
2. PC 的值不变，从而下一周期重新 instruction fetch 一次
3. ID/EX 的值不变，从而下一周期重新 instruction decode 一次

具体数据通路，如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_3_15_16_202405160315107.png" style="zoom: 67%;" />

- 简单来说，就是增加一个 hazard detection unit，负责
    - 控制 PC 的 wen
    - 控制 IF/ID 的 wen
    - 设置 ID/EX 的 WB, M, EX 用到的信号均为 0

## 1.5 控制竞争的解决方式

控制竞争的解决方式主要是预测，预测分支跳转指令到底是跳转还是不跳转，主要有以下两种：

- predict taken：预测这条指令会发生跳转（此处不讲）。
- predict not taken：预测这条指令不会发生跳转。

我们还会稍微说一下 stall 的方式，当然肯定不会用。

### 1.5.1 Predict Not Taken

predict not taken 的实现方式：IF 级中的 pc 正常 +4 即可，当 EX 级检测到这条指令需要跳转时，将原 IF 和 ID 级的指令设为无效指令，并将计算好的跳转目的地址在下一时钟周期写到 pc 中即可。

也就是

- 将 PC 设置成对应 PC+offset
- 将 IF/ID, ID/EX 都设置为 nop

这样，当 branch 指令送到了 MEM，下面的指令就同时进入了 IF 阶段。

- 两指令之间只有 2 个 bubbles

#### 1.5.1.1 Optimization: Move Branch Forward

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_4_56_0_202405160456610.png" style="zoom: 67%;" />

如图：我们可以将 branch/jal/jalr 的指令提前一拍送到。也就是：

- 这样，当 branch/jal/jalr 指令送到了 MEM，下面的指令就送进了 IF/ID，i.e. 进入了 ID 阶段。
    - 两指令之间只有 1 个 bubble

#### 1.5.1.2 Even More Optimization: Separate Calculation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_5_2_33_202405160502244.png" style="zoom:67%;" />

我们甚至可以采用更加激进的方式，从而可以让后面指令只慢一拍。也就是：

- 这样，当 branchjal/j 指令送到了 ID/EX，下面的指令就送进了 IF/ID，i.e. 进入了 ID 阶段。
    - 两指令之间没有任何 bubble

**可能的坏处：**可能会增加 IF 部分的瓶颈延迟，因为 regfile 的读取是下降沿触发的，因此半个周期的时间，就必须等于 comparator 的瓶颈延迟。

### 1.5.2 Predict Taken

predict taken 有一个致命缺陷：target is unknown。因此仍然需要 stall 直到 target 算出来。由于对于我们的这种架构，target 的计算和 comparator 计算 condition 是同时的，target 算出来的同时，是否需要跳转也算了出来。

- 从而，predict taken 的最优时间也就和 predict not taken 的最差时间一样。对于我们的这种架构（都是需要计算的相对地址，没有直接可用的绝对地址），完全没有好处。

### 1.5.3 Stall

至于 stall 的方式，就是检测到 branch/jump 之后，就插进去几个 bubbles。当然，因为这样的实现在循环或者多重 if-else 判断的时候，会非常低效，因此基本上不用。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_4_2_54_202405160402670.png" style="zoom:50%;" />

---

由于绝大多数流水线采用的都是 predict-if-not-taken，因此，我们会把大概率成立的事件，放在 not taken 处，小概率成立的事件，放在  taken 处。

比如，对于 `if cond then A else B`，我们会默认 A 是大概率事件，因此，实现一般是 `if (not cond) then continue to A else jump to B`

```asm
bxx _, _, B # if not cond
# A:
...
B:
...
```

## 1.6 Datapath

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_23_47_16_202405072347829.png" style="zoom: 80%;" />

如图，我们特别设置一个 forwarding unit，使得更加容易控制。

# 2 Conclusion

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_2_36_37_202405080236330.png"/>