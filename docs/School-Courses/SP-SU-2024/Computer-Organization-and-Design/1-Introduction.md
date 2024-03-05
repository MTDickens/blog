# Lec 1：介绍

## 处理器发展趋势

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271221464.png" alt="image-20240227122132975" style="zoom: 50%;" />

## 主流 CPU 发展路径

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271223747.png" alt="image-20240227122323522" style="zoom: 50%;" />

## 处理器芯片的发展趋势

- 工艺、主频遇到瓶颈后，开始通过增加核数的方式来提升性能；

- 芯片的物理尺寸有限制，不能无限制的增加；

- ARM 的众核横向扩展空间优势明显。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271226219.png" alt="image-20240227122623415" style="zoom:33%;" />

如上图，单核处理器的功耗远高于相同总计算能力的多核、众核处理器。因为功耗 $P = CV^2f$，其中 $C$ 是常数，$V$ 是电压，$f$ 是频率。但是，提高频率的同时，必须提高电压，从而保证门延迟不变。因此，$P$ 在一定频率之上，就会和 $f$ 呈近似 $P = C'f^3$ 的关系，如下图：

![img](https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271232383.jpeg)

### ARM 处理器一览

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271236243.png" alt="image-20240227123610720" style="zoom: 50%;" />

## 一芯片多架构

在一个系统级芯片（SoC）上，有许多不同的指令集架构（ISA）。这些包括：

- 应用处理器（通常是ARM）
- 图形处理器
- 图像处理器
- 无线电数字信号处理器（DSP）
- 音频DSP
- 安全处理器
- 电源管理处理器

在一些SoC上，有超过十种不同的ISA，每种都有其独特的软件堆栈。

那么，为什么会有这么多不同的ISA呢？

- 应用处理器 (Application Processor) 的ISA对于加速器来说太大，不够灵活
  - 应用处理器可以包括一个 CPU+GPU+内存+……，所以太大了
- 从而，我们只能从不同的公司购买 IP。其中，每个公司都用不同的 ISA
  - 不同 IP，不同 ISA，之间如何交流？
- 工程师需要构建自己的ISA核心
  - 为了自行设计用于交流的核心，工程师就需要一个开源的ISA: RISC-V

## Great Ideas in Computer Architecture

### TOC: 8 Great Ideas

- Design for Moore'sLaw（设计紧跟摩尔定律）
- Use Abstraction to Simplify Design（采用抽象简化设计）
- Make the Common Case Fast（加速大概率事件）
- Performance via Parallelism（通过并行提高性能）
- Performance via Pipelining（通过流水线提高性能）
- Performance via Prediction（通过预测提高性能）
- Hierarchy of Memories（存储器层次结构）
- Dependability via Redundancy（通过冗余提高可靠性）

### 1. Design for Moore's Law

设计不是一蹴而就的。一个芯片的设计，需要耗费很长的时间。

假设设计需要 5 年，而 IC 中的晶体管数量，在两年左右的时间，就可以翻倍。通过计算，5 年时间，晶体管数量可以翻 5.7  倍左右。

假设某一时刻的晶体管数量为 10 万，那么，5 年之后，就是 57 万。

如果你在 5 年前按照 10 万的标准设计，5 年后就会浪费性能，其他芯片的性能很容易超越你；如果按照 100 万来设计，那么芯片就无法立即投产。因此，必须估计准确。

### 2. Use Abstraction to Simplify Design

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051340294.webp" alt="img"  />

如图，就像计算机网络一样，

- 我们设计的目的是 applications
- 对于其中每一层的设计，只需要
  - 使用下层的服务
  - 完成本层的功能
  - 为上层提供接口

### 3. Make the Common Case Fast

定量来说，我们有 Amdahl's Law
$$
\newcommand{\sp}{\mathrm{Speedup}}
\newcommand{\exec}{\mathrm{ExecTime}}
\newcommand{\fr}{\mathrm{Fraction}}
\begin{aligned}
\sp_{enhanced} &= \frac{\exec_{enhanced, old}} {\exec_{enhanced, new}}\\
\sp_{overall} &= \frac {\exec_{old}} {\exec_{new}} = \frac 1 {1-\fr_{enhanced} + \frac {\fr_{enhanced}} {\sp_{enhanced}}}
\end{aligned}
$$
因此，对于 common case，$\fr_{enhanced}$ 比较大，因此，只需要比较小的 $\sp_{enhanced}$ 就可以使得 $\sp_{overall}$ 较大。

设计时，一定要考虑哪一部分是 **common case**。

### 4. Performance via Parellel

采用并行的方式，我们可以将各个微处理器的芯片的性能进行**叠加**。

### 5. Performance via Pipeline

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051410079.webp" alt="img" style="zoom:50%;" /><img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051417059.webp" alt="img" style="zoom:50%;" />

左图是非流水线的方式，而右图是流水线的方式。

不难发现，当任务足够多时，两种方式的每个任务平均处理时间为：
$$
\begin{aligned}
\exec_{left} &= \sum_i \exec_{i}\\ 
\exec_{right} &= \max_i(\exec_i)
\end{aligned}
$$

### 6-8

容易理解

## Computer Organization

$$
\text{Computer System} = 
\begin{cases}
\text{software}
    \begin{cases}
    \text{Application software: word, ppt,} \dots
    \\ \text{System software}
        \begin{cases}
        \text{Operation system: Linux, MacOS,} \dots
        \\ \text{Compiler: gcc}
        \\ \text{Firmware(Driver software): 网卡驱动}
        \end{cases}
    \end{cases}
\\ \text{hardware}
\end{cases}
$$

注意：

1. 由于写编译器的人，必须懂硬件（比如针对流水线等特性进行优化），所以编译器常常算做系统软件。
2. Firmware (固件) 的制造方法，就是将数据烧到 ROM 里面，因此算作软件和硬件的结合。
   1. 设计多时钟周期 CPU 的时候，一条机器指令，是通过多个所谓 microinstruction (微指令) 共同完成的。我们会将 microinstruction 预先“烧”到  ROM 里去。
   2. 软件中，对于**非常看重性能的功能**，可以将微程序烧到 ROM 里去，以后需要调用这个功能的时候，就去 fetch 这个 ROM

### Program Execution

以下是各种语言的流程：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051536554.png" alt="image-20240305153601556" style="zoom:50%;" />

---

以下是 C/C++ 的流程：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051543702.png" alt="image-20240305154352259" style="zoom:67%;" />

## Computer Hardware System

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051548466.png" alt="在这里插入图片描述" style="zoom:50%;" />
$$
\text{Computer System} = 
\begin{cases}
    \text{software}
    \\ \text{hardware}
    \begin{cases}
        \text{CPU}
        \begin{cases}
            \text{Control unit}
            \\ \text{Datapath}
			\begin{cases}
				\text{Path: multiplexors}
				\\ \text{ALU: adder, multiplier}
				\\ \text{Registers}
				\\ \dots \dots
			\end{cases}
        \end{cases}
        \\ \text{Memory}
        \\ \text{I/O interface}
        \begin{cases}
            \text{Input: keyboard}
            \\ \text{Bidirectional: RS-232, USB}
            \\ \text{Output: VGA, LCD}
        \end{cases}
    \end{cases}
\end{cases}
$$
