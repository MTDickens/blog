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