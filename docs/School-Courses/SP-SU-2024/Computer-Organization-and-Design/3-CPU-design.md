# Overview

## Instruction Set

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_20_32_18_202404162032868.png"/>

- 算术
    1. add
    2. addi
    3. sub
    4. mul **(本实验不需要)**
    5. div **(本实验不需要)**
- 逻辑
    1. 与 (and)
    2. 或 (or)
    3. 异或 (xor)
    4. 与（立即数）(andi)
    5. 或（立即数）(ori)
    6. 异或（立即数）(xori)
- 移位
    1. 逻辑左移 (sll)
    2. 逻辑右移 (srl)
    3. 算数右移 (sra)
    4. 逻辑左移（立即数）(slli)
    5. 逻辑右移（立即数）(srli)
    6. 算术右移（立即数）(srai)
- 条件跳转（PC + offset）
    1. beq
    2. bne
    3. blt
    4. bge
    5. blt (unsigned)
    6. bge (unsigned)
- 条件赋值
    1. `slt x2, x3, x4 # x2=1 if x3 < x4`
    2. `slt x2, x3, x4 # x2=1 if (unsigned) x3 < (unsigned) x4`
    3. `slti x2, x3, 11 # x2=1 if x3 < 11`
    4. `sltiu x2, x3, 13 # x2=1 if (unsigned) x3 < (unsigned) 13`
- 无条件跳转
    1. jump and link (PC + offset)
    2. jump and link register (register + offset)
- 内存操作
    1. load word (register + offset)
    2. save word (register + offset)
- 其它
    1. lui rd, imm (将 `imm << 12` 存入 rd 中)
        - lui 指令的 imm 有 20 位长
        - 伪指令 `li rd, imm32`：`lui rd, imm` 配合 `addi rd, rs1, imm`（后者的 imm  是 12 位），可以有效地将任意的 32 位数存入寄存器中
    2. auipc rd, imm (将 `imm << 12 + PC` 存入 rd 中)
        - auipc 指令的 imm 有 20 位长
        - 伪指令 `call <func>`：`auipc rd, imm` 配合 `jalr rs1, rs2, imm`（后者的 imm  是 12 位），可以有效地跳转到任意地址

---

另附一个指令类型 cheatsheet，供参考：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_21_23_34_202404162123431.png" style="zoom: 33%;" />

## 区分指令

我们依靠

- opcode 区分指令的类型
    - 当然，一个 opcode 必然对应（上图中六种指令的其中）一种指令。但是一种指令可以对应多个 opcode。
- funct3 和 funct7 区分同一 opcode 的指令

由于有一些类型的指令拓展的可能性大，因此会有 funct7，便于之后拓展；有一些类型指令拓展的可能性没什么，因此只有 funct3 甚至什么也没有。对于后面的这种指令，有时候就只能靠增加 opcode 来拓展了。

# 指令执行过程

1. fetch：从 imem 中取回来
    - 注意：RISC-V 基于 harvard 架构，因此内存分为 Instruction Memory 和 Data Memory
2. Instruction decoding \& read operand
    - 前者就是将 0~6 (opcode), 12~14 (funct3), 25~31 (funct7) 取出来解码
    - 后者就是将 15~19 (rs1), 20~24 (rs2) 的内容读出来
        - 不管之后会不会用到，先读出来再说，反正是并行的
3. Executive Control
    - ALU 计算
4. Memory Access
    - 从内存中读/写数据
    - 只有 ld, sd 会这样
5. Writes Results to Register
    - If R-type, ALU write to rd
    - If I-type, memory data written to rd

# Datapath

下面是一个简化版的 datapath（注意：我们的实现中，immgen 的输出还是 32 位，不用 64 位）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_23_11_55_202404162311845.png" alt="image-20240416231154751" style="zoom: 50%;" />

## Example

### `jal rd, offset`

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_23_13_1_202404162313337.png" alt="image-20240416231257934" style="zoom:50%;" />

如图，

1. 我们首先取出立即数作为 offset，然后和 PC 进行相加，得到 PC + offset
2. 然后通过第二个 mux 选上自己，喂给 PC
3. 同时，将 PC + 4 的值储存到 rd 中

### `beq rs1, rs2, offset`

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_23_14_26_202404162314038.png" alt="image-20240416231422940" style="zoom:50%;" />

如图，

1. 我们首先取出 rs1, rs2 进行比较（具体比较内容由 controller 控制）
2. 同时，取出立即数作为 offset，然后和 PC 进行相加，得到 PC + offset
3. 根据比较结果，如果结果为 1，就通过第一个 mux 选上自己，从而把 PC + offset 喂给 mux；

# Controller

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_23_21_6_202404162321689.png" alt="image-20240416232102408" style="zoom: 33%;" />

如上图，我们只需要控制好 **7+4** 个信号即可。

- 7 指的是：Branch, jump, MemtoReg, MemWrite, MemRead, ALUSrc, RegWrite
- 4 指的是 ALU operation 有 4 条控制线

## ALU Control

| ALU Control Lines | Function         |
| ----------------- | ---------------- |
| 000               | And              |
| 001               | Or               |
| 010               | Add              |
| 110               | Sub              |
| 111               | Set on less than |
| 100               | nor              |
| 101               | srl              |
| 011               | xor              |

注意：

1. 上述只是一个例子，可以有多种 implementation
2. 上面只用到了 3 个 code，当然你可以后续增加指令

## Control

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_0_34_28_202404170034133.png" alt="image-20240417003422705" style="zoom: 80%;" />

如上图，control 接收 opcode，输出 "7" 个控制信号以及 ALU Op[1:0]。我们把 ALU Control 单独抽离出来，通过 ALU Op[1:0] 将 Control 的信息传到 ALU Control 去，然后在 ALU Control 处变成最终的位宽为 "4" 的 ALU 控制信号。

## Integration

如下图，ALU Control 根据 ALU Op[1:0] 以及 func7, func3 来决定最终的 function。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_0_40_8_202404170040215.png" alt="image-20240417004002646" style="zoom:50%;" />

### 为什么要用两级 decoder？

这是因为，

- 如果是 `ld` 或 `sd`，那么 ALU 就是 add
- 如果是 `bxx` (如 beq, blt 等等），那么 ALU 就是 sub
- 如果是 R\-type，ALU 才需要根据 func3 和 func7 来有所改变。

因此，我们只需要量 opcode 分为三类，然后将其中一类（R\-type）挑出来，做进一步的精细化处理。

## DataPath with Controls

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_0_38_53_202404170038897.png" alt="image-20240417003847882" style="zoom: 80%;" />

# Pipelining

假设

- memory access: 200ps
- register file access: 100ps
- ALU: 200ps

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_1_2_49_202404170102259.png" alt="image-20240417010246209" style="zoom:50%;" />

可以发现

1. 以上四个指令所需时间其实是不同的。
    - 但是，对于单周期 CPU 而言，我们只能应用按照最耗时的指令来设计我们的时钟频率。
2. 一个指令实际上可以分成多个更小的原子操作
3. 由于实际的代码中，ld/sd 指令并不多，主要还是计算/跳转的指令，但是时钟周期还是要收到 ld/sd 的制约。因此，单周期的设计，会大大降低 CPU 的性能。
    - 从而 **violates "make the common case fast" principle**

## Stages

Five stages, one step per stage

1. IF: Instruction fetch from memory
2. ID: Instruction decode & register read
3. EX: Execute operation or calculate address
4. MEM: Access memory operand
5. WB: Write result back to register

实际上，并非每一条指令都必须经历上面 5 步，但是为了使用标准化的流水线，我们“强行”让每一条指令都要执行上面的五步。

### Example: `ld`

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_1_22_6_202404170122637.png" alt="image-20240417012202976" style="zoom:67%;" />

## *Notes*

如上图所示，我们不难发现：

1. 最大延迟实际上是**不减少**的
    - 在本例中，由于 sub-instruction 是**非平衡**的，反而还增加，从 800 变成了 1000
2. 每一条指令的延迟都是最大延迟。因此，每一条指令的延迟也是不减少的。
3. 因此，加速不是通过减小延迟实现，而是通过增加 throughput（可以理解为“吞吐量”“并行量”）实现的
4. 假如 sub-insts 之间平衡，那么，理论上的加速率就是 stage 的数量

因此，我们最好做到：

1. sub-insts 之间的耗时尽量平衡
2. 尽量避免跳转

## Advantages of RISC-V

RISC-V 就是为 pipelining 而生的，这是因为

1. **RISC-V 的长度是固定的**：在一个 cycle 之内，就可以 fetch and decode
    - 相比之下，x86 的可变指令长度（1 byte 到 17 bytes），使得 decode 和 fetch 更加困难
2. **RISC-V 的指令少而规整**：我们可以在 decode 的同时，就 read register
3. **RISC-V 的访问内存方式，只有 ld 和 sd**：operand 和 memory 无关，因此只需要执行 read register + add 即可

# Hazards (冒险)

## Hazard of Pipelining

流水线的竞争，很简单，比如：

```asm
# Suppose a0 := 0 here
addi a0, a0, 1
addi a0, a0, 1
```

如果采用流水线的形式，那么，在第一个指令刚完成 EX stage 的时候，第二个指令就完成了 ID stage，也就是说，读取完了 a0 的值。

此时，a0 的值尚未被更新，还是 0。

因此，两条指令 ID stage 读取的都是 0，EX stage 得到的结果都是 1，在 WB stage 中，向寄存器写入的值也是 1，因此 a0 最终就是 1，而不是正确的 2。

## Other Hazards

**Definition:** Situations that prevent starting the next instruction in the next cycle.

- Structure Hazard

    - Required resource is busy
    - 假如不分 imem 和 dmem，那么 IF 和 WB 就都要du'qu mem，从而造成冲突

- Data Hazard

    - Need to wait for previous instruction to complete its data read/write
    - 就是 hazard of pipelining 里的例子：还没写，就读了

- Control Hazard

    - Deciding on control action depends on previous instruction

    - 就是在执行 `beq` 的时候，并不知道到底执行的是哪一条语句

    - 比如

        ```asm
        beq a0, zero, label
        li 	a1, 114514	# This?
        label: 
        li 	a2, 1919810	# Or this?
        ```

# Solution to the Hazards

## Structure Hazard

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_2_56_57_202404170256441.png" style="zoom:67%;" />

- 关键：区分 imem 和 dmem，使得每一个 stage 之间都是独立的

## Data Hazard

我们最初的想法是，加两个 bubbles。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_2_57_53_202404170257904.png" style="zoom:50%;" />

### Bypassing

但是，两个 bubble 未免太浪费性能的。于是，我们决定采用 **bypassing** 的方式：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_2_58_50_202404170258076.png" alt="image-20240417025846377" style="zoom:50%;" />

这样就可以避免 add 的 bubble。

---

当然，对于 ld 而言，我们不可避免地还是需要一个 bubble（当然，也比两个好）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_2_59_30_202404170259429.png" alt="image-20240417025927562" style="zoom:50%;" />

### Code Scheduling

除此之外，我们还可以通过 code scheduling，进一步减小 overhead：

以 `a = b + e; c = b + f;` 为例：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/17_3_1_25_202404170301021.png" alt="image-20240417030121791" style="zoom:50%;" />

当然，这要求编译器对底层的实现足够了解才行，于是从一方面展示了 Intel 自家的编译器比通用编程器（如 LLVM, gcc）更快的原因。

## Control Hazard

***TODO***