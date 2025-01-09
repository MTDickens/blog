# 竞争与冒险

一共三种 hazards：

- Structural Hazards: 不能共用一个部件（比如 reg file）
	- RISCV 通过将 data 和 instruction 分开，避免了这个 hazard
- Data Hazards: 数据读写顺序不能不同
- Control Hazards: 跳转指令的存在，使得指令不能顺序执行

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/2_21_42_22_202411022142824.png"/>

# Multi-Cycle Operation

对于

- 整数乘除法
- 浮点数四则运算
- ……

这样耗时长的 ops，我们就要通过多时钟周期来解决。

如何衡量添加这些指令之后的流水线的性能？常用的 metric 有两种：

- Latency: 假如下一条指令要用到该指令的输出数据，那么需要 stall 几个周期
	- 实际上，latency 有两种定义。一种如上文所言，另一种就是**该 op 需要在 EX 阶段停留多久**。不难发现，如果在 EX 阶段停留 $t$ 周期，那么下一条指令就要被 stall $t - 1$ 周期（假设 forwarding 技术被用上了），因此两者之间可以换算。
- Initiation Interval: （假设指令之间没有数据竞争，）两条同样的指令，之间需要间隔多少周期
	- 对于 fully pipelined，只需要 1
	- 对于 non-pipelined，就是 latency + 1

## Example: Pipeline doing issuing *in order* and completion *out of order*

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/2_23_44_37_20241102234436.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/2_23_56_13_20241102235613.png"/>

由于除法器难以流水线实现，因此我们只能 non-pipelined。

## Hazards

- 对于 non-pipelined module（比如除法器），就会造成 **structural hazard**。
- 由于不同的模块，执行时间不一样，因此
	- 同一时间，可能会有多个 register write 请求
		- 比如，如果 add 在 multiply 后面第 3 个出现，那么就会同时完成计算，因此同时写入（算是 **structural hazard**）
		- 而且，如果 add 在 multiply 后面第 2 个出现，那么 add 反而会比 multiply 更早完成，从而造成 **WAW (data) hazard**。
- 由于这些计算模块的 latency 很大，因此 **RAW hazard** 会更加频繁、造成更长的 stall
- 而且，会造成异常处理有问题
	- 比如，后一条指令本身与前一条没关系，因此后一条**貌似**比前一条先执行完没问题。但是，前一条指令却出了异常。按道理，前一条指令出了异常，后面的**根本就不应该 write back**，此处却已经 write back 了。

总之，会造成

- structural hazard
- data hazard: RAW, WAW
	- 其实还应该包括异常处理
	- 为什么不包含 WAR 呢？因为 WAR 要求前一个指令的读操作在后一个指令的写操作之前。如果是**顺序发射**的，那么一定不会出现这种情况；只有**乱序发射**，才会出现这种情况

## Example: Issuing *in order* and completion *out of order* instruction execution routine

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_3_0_34_20241103030033.png"/>

问题：

1. 红色：寄存器堆写口的结构竞争
2. 绿色：(potential) WAW hazard

## Solution

### 结构竞争：移位寄存器

我们引入一个移位寄存器（i.e. `write_reg`）。每当一个 ID 的指令准备发射到之后某个模块的时候，就会检查 `write_reg[latency_of_this_inst]` 是否为 1。如果是 0，那么就代表**如果自己在下一个 clk 上升沿就发射，那么到时候自己执行完毕了，寄存器写口不存在结构竞争**；如果是 1，那么就代表……，**存在结构竞争**，从而**本次需要 stall**。

- 当然，即使没有结构竞争，如果检测存在 WAW、RAW 这样的数据竞争的话，那么还是要 stall
- 其实也可以有多个写口，然后检测 `write_reg[latency_of_this_inst]` 是否达到了 `MAX_WRITE`。如果没有，那么就 +1；否则就 stall。
	- 同时需要保存之前的 `write_reg[latency_of_this_inst]`，到时候就写第 `write_reg[latency_of_this_inst]` 号写口。

> [!warning]+ 
> 
> 其实还有更好的方法，就是在模块计算结束处进行来选择写的顺序。这样可以增加计算模块的利用率。

### 数据竞争

对于 RAW、WAW、WAR，**真**竞争是 RAW，**假**竞争是 WAW、WAR。因为 RAW 中，read 是真要用到 write 的结果；但是，为了避免 WAW 和 WAR，我们只要避免后面的 write 影响到前面的 write/read 即可。如何避免影响？**寄存器重命名**（可以在编译器层面进行，也可以在硬件层面实现）以及**写覆盖**（仅限 WAW，后面的指令把前面的指令输出覆盖掉）。

否则，就是下面的方法解决：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_4_22_2_20241103042201.png"/>

# 软件优化

- **Basic Compiler Technique** for Exposing ILP
	- Loop unrolling
- ﻿**Static Branch Prediction**
	- 更可能 true 还是 false？我们要 make common case faster，因此在更可能的情况下，不应该跳转。
- ﻿**Static multiple Issue**: VLIW
- ﻿**Advanced Compiler** Support for Exposing and Exploiting ILP
	- Software pipelining
		- 本质上是让编译出来的 inst 在硬件上的并行性更好
	- Global Code scheduling
		- 相当于 global-scale software pipelining
- **Hardware Support** for Exposing More Parallelism at compile time
	- ﻿﻿Conditional or Predicated instructions
		- 避免跳转
	- ﻿﻿Compiler speculation with hardware support



<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_21_32_29_20241103213228.png" width="70%"/>

**Note**: 上图中，除了 VLIW 包含软件实现的部分以外，其它都是硬件实现。

## Loop Unrolling

给定这样一个代码：

```c
double _f2;
double * _r1;
double _farr[];

/*
* Some code that we don't care
*/

for (; _r1 != 0; --_r1) {
	*_r1 += _f2;
}
```

那么，编译出来可能就是这样的：

```asm
LOOP:
	LD F0, 0(R1)
	ADDD F4, F0, F2
	SD 0(R1), F4
	
	SUBI R1, R1, #8
	BNEZ R1, LOOP
```

显然，branch 过于频繁。

一个常用的做法就是进行指令展开：

```asm
LOOP:
	LD F0, 0(R1)
	ADDD F4, F0, F2
	SD 0(R1), F4
	
	LD F6, -8(R1)
	ADDD F8, F6, F2
	SD 0(R1), F8
	
	LD F10, -16(R1)
	ADDD F12, F10, F2
	SD 0(R1), F12
	
	SUBI R1, R1, #24
	BNEZ R1, LOOP
```

## Reorganizing

上文的 loop unrolling 的做法，虽然 branch 对性能的影响没那么大了，但是存在 RAW 冲突（第二、三行的 F0，第三、四行的 F4，等等）。

> [!info]+ 
> 
> 粗略分析一下（i.e. 先把边界条件去掉），我们可以对代码中的 SD 和 LD 调整一下顺序，将：
> 
> ```asm
> LOOP:
> 	LD F0, 0(R1)
> 	ADDD F4, F0, F2
> 	SD 0(R1), F4
> 	
> 	LD F6, -8(R1)
> 	ADDD F8, F6, F2
> 	SD 0(R1), F8
> 	
> 	LD F10, -16(R1)
> 	ADDD F12, F10, F2
> 	SD 0(R1), F12
> 	
> 	# ...
> ```
> 
> 改为：
> 
> ```asm
> LOOP:
> 	LD F0, 0(R1)
> 	ADDD F4, F0, F2
> 	LD F6, -8(R1)
> 	
> 	SD 0(R1), F4
> 	ADDD F8, F6, F2
> 	LD F10, -16(R1)
> 	
> 	SD 0(R1), F8
> 	ADDD F12, F10, F2
> 	LD F14, -24(R1)
> 	
> 	# ...
> ```
> 

因此，如果我们直接对原始 loop 进行 software pipelining，就是下面的情况：

```
LD F0, 0(R1)
ADDD F4, F0, F2
LD F0, -8(R1)

LOOP:
	SD 0(R1), F4
	ADDD F4, F0, F2
	LD F0, -16(R1)
	SUBI R1, R1, #8
	BNEZ R1, LOOP

SD -8(R1), F4
ADDD F4, F0, F2
SD -16(R1), F4
```

因为，这样 loop 一下，可以保证中间 loop 步骤的三个指令是并行的（i.e. 我们把两个 RAW 冲突变成了 WAR 冲突，Tomasulo 不用 stall）。之后，我们继续将上面这个 loop 进行 unrolling，从而在 software pipelining 的基础上进一步优化。

下面是 final version。可见，不仅 branch 相对少了，而且 stall 的时间也少了（i.e. 当前所有造成的 RAW 冲突的两指令，之间都隔着一个指令，而不是像最开始一样是相邻的）。

```asm
LD F0, 0(R1)
ADDD F4, F0, F2
LD F0, -8(R1)

LOOP:
	SD 0(R1), F4
	ADDD F4, F0, F2
	LD F0, -16(R1)
	
	SD 0(R1), F4
	ADDD F4, F0, F2
	LD F0, -24(R1)
	
	SD 0(R1), F4
	ADDD F4, F0, F2
	LD F0, -32(R1)
	
	SUBI R1, R1, #24
	BNEZ R1, LOOP

SD -24(R1), F4
ADDD F4, F0, F2
SD -32(R1), F4
```

## Trace Scheduling

对于循环结构，由于**内容是重复的**，因此可以通过展开来减少 branch；但是，对于同样非常常见的 `if-else` 结构，我们就不能用循环展开了。

此时，我们使用 trace scheduling 的技术：可以把 `if-else` 视作一个二叉树。从树根到树叶，往往有一条走的最多的路径，称为“主路径”。

我们可以这样调整汇编代码，使得程序在走主路径的时候，不会进行跳转。此时，搭配 branch not taken 预测，就可以在走主路径的时候，几乎没有 branch overhead。

> [!example]
> 
> 如图，假设主路径就是“两个 `if` 都是 `true`”，那么代码块就应该如下图设计
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/18_20_42_43_20241118204243.png" width="60%"/>


# 硬件优化：Dynamic Scheduling

假设我们的指令如下：

```asm
DIVD FO,F2,F4
ADDD F10,FO,F8
SUBD F12,F8,F14
```

因为第二行需要用到第一行的结果，因此产生的**数据竞争**，从而导致 `ADDD` 停顿。从而导致 `SUBD` 也被迫停顿。

或者又如：

```asm
DIVD F2,F2,F4
ADDD F10,F0,F8
ADDD F12,FO,F4
MULD F16,F14,F4
```

假设我们这个 fp adder 是 unpipelined，那么第二行和第三行就产生了**结构竞争**。从而导致第四行被迫停顿。

这两种情况，按理说都是可以避免的。我们采用**顺序发射、乱序执行、乱序完成**的方法（之前是顺序发射、**顺序**执行、乱序完成）。

> [!info] 为什么可以顺序发射但是乱序执行？
> 
> 我们把 ID 阶段分成两个子阶段。
> 
> - 阶段一：decode、structural hazard detection (uh oh, 结构竞争的 case 还是卡在阶段一了)
> - 阶段二：check register availability (i.e. data hazard detection)
> 
> 我们把完成阶段一称为**发射**，完成阶段二称为**执行**。

## Scoreboard Algorithm

算法和示例见 [知乎](https://zhuanlan.zhihu.com/p/496078836)。

Limitation：

- 遇到 structural hazard 的时候，就会卡住
- Instruction status 表的大小有 limit。如果前面的指令都卡住了，那么不在表中的指令，即使（假设表的大小无限大，理论上）可以执行，也因为不在表中，从而无法执行。
- 没有解决 WAW、WAR 这种 false hazard
	- 其实是因为 scoreboard algorithm 提出的时候，还没有提出 renaming trick
	- 我们可以额外加上 renaming 等模块进行解决
		- 实际上，在后面的 Tomasulo 算法中，我们只是使用了 renaming 的*思想*，而并没有真正进行 renaming（i.e. 没有整什么逻辑寄存器与物理寄存器分离等等）。

## Tomasulo 算法

在开始了解Tomasulo之前，首先观察一下这个结构：

- 首先是FP OP Queue，这里是浮点指令队列，指令在这里等待发射；
- **绿色模块是加法单元和乘法单元的保留站**（保留站是什么？保留站保留已经发射的指令的信息和缓冲下来的数据。关于保留站，后文会有更多介绍）；
- **蓝色的Address Unit是地址计算单元**，在这个算法中存储指令在执行前会先计算好存储地址；
- Memory Unit则是存储单元；
- **CDB是数据广播总线**（在[记分牌一文](https://zhuanlan.zhihu.com/p/496078836)提到过），它可以直达寄存器堆（用来更新通用寄存器）、加法乘法存储单元的保留站（输送保留站中指令需要的数据）
	- 在这里可见，CDB 通往四个地方：data (to be stored in mem), FP Adder, FP Multiplier, FP RegFile
	- 前三个地方都是 forwarding
		- 而且可以用于应对 “WAW 中的前一个 write”
			- 也就是说，前一个 write（i.e. 旧的结果）**不会被写入目标寄存器**，但是会被在 CDB 上广播，如果有哪些指令在这两条 write 指令之间，并且需要用到相关寄存器的值，那么可以接受这个广播

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_2_55_34_20241117025534.png" width="90%"/>

### 保留站

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_3_3_43_20241117030343.png"/>

**Note**:

- V 存储 src1 和 src2 的**数值**
	- 从而避免 WAR 问题（因为只要信息产生，那么必然会立即 read 到这个 V 之中，保证 read 一定在 write 之前）
- （如果当前无法，）Q 储存我将要在哪里读取
- A 储存 dst 的**位置**
- Busy 其实就是 valid bit

### Reg Result Status

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_4_11_27_20241117041127.png"/>

**Note**:

- Q 就是**这个寄存器将要被哪一条指令所写入**
	- 用于解决 WAW 问题。后面 write 会覆盖前面 write

### Instruction Status

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_4_14_11_20241117041410.png"/>

一目了然，不言而喻。

### Example

详见 [3.1、案例讲解](https://zhuanlan.zhihu.com/p/499978902)。

## Tomasulo with Reorder Buffer

Tomasulo 是顺序发射、乱序执行、乱序写回的。为了实现**精确中断**（同时还可以正确实现跳转指令），我们需要进行**顺序写回**。这就需要额外再加一个模块——reorder buffer（如下图红字）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_4_17_5_20241117041704.png"/>

### 实现

> [!info]+ 表的结构
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_4_47_51_20241117044751.png"/>

一个指令的执行，整体上可以分为 4 个阶段：

- **Issue**: get instruction from FP Op Queue
- **Execution**: operate on operands (EX)
- **Write result**: finish execution (WB)
- **Commit**: update register with reorder result

在 issue 时候，我们会检测一下，instruction queue 和 ROB 是否都没有满。如果都没有满，那么就可以 issue。

**注意**：

- 需要同时 issue 到 IQ 和 ROB 中
- 并且给这个指令打上标记——ROB 中的 entry 序号

在 write result 的时候，我们会将这个指令对应的 ROB 的 entry 的状态设置成 commit。如果恰好

- 这个 entry 就是 head
- （虽然本轮的 head entry 的状态没有变，但是目前的）head entry 目前是 commit 状态
	- e.g. head 目前在 \#3，\#4, \#5 先 commit，所以需要等 \#3。在 \#3 commit 那一刻，head 就会后移；在下一个 clk，**虽然本轮 head  entry (i.e. \#4) 的状态没变，但是是 commit 状态**，因此后移；在下下一个 clk，**虽然本轮 head  entry (i.e. \# 5) 的状态没变，但是是 commit 状态**，因此也后移

那么就把 head 后移，并且在 ROB 中设置自己为 not busy，同时也将 register result status 清零改为 not busy（如果 RRS 的 `reorder #` 是自己的话）。等等。

## Example

还是参考 [知乎](https://zhuanlan.zhihu.com/p/501631371)

