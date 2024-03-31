[TOC]

# 代数拓扑简介

## 简介

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010139284.png" alt="image-20240401013904533" style="zoom:50%;" />

- 使用抽象代数的工具来研究拓扑空间：用代数结构具体地，定量地描述或提取拓扑空间的拓扑特征
- 与点集拓扑相比，代数拓扑具有可计算性，更易用于研究具体的拓扑空间，并能设计算法进行计算
- 代数拓扑是计算拓扑与拓扑数据分析的主要理论基础

## 主要分支

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010218812.png" alt="image-20240401021803426" style="zoom:67%;" />

## 基本群

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010241701.png" alt="image-20240401024154382" style="zoom:67%;" />

关键词：

- 闭道路：给定拓扑空间 $X$，连续映射 $f: \mathbb S^1 \to X$​ 就是闭道路
    - 高维闭道路：$f: \mathbb S^n \to X$
- 定端同伦：不仅同伦，而且 $f, g$ 的两个端点相同
    - 定端保证了基本群中的 $f \star g, g \star f$ 均良定义
- 带基点的拓扑空间
- 道路连接

我们首先构造出了两个简单的（定端）同伦等价类：右图中的小圈和大圈。

然后通过群运算，得到了（也许）无穷无尽的同伦等价类。

## 同伦群的问题

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010341383.png" alt="image-20240401034057443" style="zoom: 67%;" />

如图，同伦群

- 计算复杂，即使是最简单的 $n$ 维球面，也难以计算其高维同伦群
- 难以离散化，不利于计算机的实现
- 可能非交换，难以应用到实际的问题中

# 链复形与同调群

## 闭链

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010434203.png" alt="image-20240401043443027" style="zoom:50%;" />

## 同调

如果两个闭链是某个拓扑子空间的所有边界，那么称这两个闭链是同调的 (homologous)。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010440886.png" alt="image-20240401044053093" style="zoom:50%;" />

- 如上图，对于拓扑空间 $X$​，黄色部分就是一个拓扑子空间

## 链群

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010453459.png" alt="image-20240401045324557" style="zoom:67%;" />

- 注意：**不同维数的单形组成不同的链群**

## 边界算子: $\partial_k: C_k \to C_{k-1}$

边界算子把**不同维数**的链群关联在了一起。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010459258.png" alt="image-20240401045942180" style="zoom:50%;" />

## 链复形

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010515753.png" alt="image-20240401051550803" style="zoom: 50%;" />

注意：

- 普遍意义上的同调群，**不要求 $\partial_\ast$ 是边界算子，只要求满足相邻两个的复合是零映射即可**
    - 当然，边界算子满足“相邻两个的复合式零映射”，因此边界算子可以用来构建一种特殊的同调群——链复形
- 其中，$C_p$ 就是第 $p$ 个链群；$Z_p$ 就是 $\ker\partial_p$；$B_p$ 就是 $\operatorname*{im}\partial_{p+1}$​

### 几何意义

我们称：

- $Z_p$ 为闭链群，因为只有闭链，才能在映射只有变成 0（从而成为 $\ker$）
- $B_p$ 为边缘群，因为只有边缘，才能在对应一个更高维的拓扑结构（从而成为 $\operatorname*{im}$）

不难发现，边缘必然是闭链，但是闭链未必是边缘（如下图，左侧是一个一般的闭链，但是它不是边缘。右侧是边缘，同时也是闭链）。因此，几何意义和上面的链复形的 $B_p \trianglelefteq Z_p$就对应起来了。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010537496.png" alt="image-20240401053700092" style="zoom:33%;" />

## 同调群

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010552103.png" alt="image-20240401055208445" style="zoom:50%;" />

# 同调群计算

# 上同调与对偶

