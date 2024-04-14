$$
\newcommand{K}[1]{K^{(#1)}}
$$



# Persistent Homology

## Filtration

Filtration 就是一个

- 单纯复形的递增序列 $K^{(n)}$: $K^{(0)} \subset K^{(1)} \subset K^{(2)} \subset \cdots$
- 并且每两个相邻复形之间只相差一个单形

Filter 就是一个 filtration 的差序列：
$$
\text{Filter of }K := \set{\sigma_0, \sigma_1, \cdots} = \set{\K{1} - \K{0}, \K{2} - \K{1}, \cdots}
$$
我们用 $C_k^{(n)}, \partial_k^{(n)}, Z_k^{(n)}, B_k^{(n)}, H_k^{(n)}$ 来表示第 $n$​ 项链复形的各项属性

### Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/11_0_17_26_202404110017442.png" alt="image-20240411001722284" style="zoom: 50%;" />

如上图，

- 标减号的，代表**至少有一个拓扑特征在这一步中消失**
    - 以 14 为例：这一步中，
        - 增加了 suw 这一个 2-复形特征，
        - 减少了 su, uw, ws 这三个 1-复形特征，以及 s, u, w 这三个 0-复形特征
        - 不过，由于 uw, s, u, w 之前已经被减少了，因此实际上只减少了 su, ws
- 标加好的，代表**没有任何拓扑特征消失**，只有拓扑特征的增加
    - 以 17 为例：这一步中，
        - 增加了 stw 这一个 2-复形特征，
        - 减少了 st, tw, ws 这三个 1-复形特征，以及 s, t, w 这三个 0-复形特征
        - 不过，由于 st, tw, ws, s, t, w 之前已经被减少了，因此实际什么也没有减少

## How to Construct a Complex With $\varepsilon$?

对于点云而言，可以使用：

- &Ccaron;ech 复形：最小包围球
- VR 复形：最远点对
- Alpha 复形：最小包围球 &cap; 相邻胞腔
- 另外，如果点云数量过于巨大，则可以使用 vineyard 复形来计算

## How to Construct a Filtration With a certain Complex?

### 一般构造

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/12_4_5_18_202404120405500.png" style="zoom: 80%;" />

### Lower-Star 构造

Lower-Star 构造不需要每一个单形都对应一个值，只需要顶点对应即可。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/12_4_34_6_202404120434531.png" alt="image-20240412043359020" style="zoom:50%;" />

我们这里只在顶点（i.e. 0-单形）上定义了函数，令 $St~u$ 为**所有顶点集中包含 u 的单形（也就是 u 的所有邻接单形）**。同时定义
$$
St_u = \set{\sigma \in St~u | x \in \sigma \implies f(x) \leq f(u)}
$$
如上图，我们将每一个顶点放在坐标系中，对于每一个单形，其所在的 $St~u$ 就是**其顶点集中函数值最大的顶点的 $$St$$​**。

---

我们不妨定义 $K_i := \bigcup_{i=1}St_{u_i}$，其中 $u_i$ 是函数值第 $i$​ 小的顶点。

那么，就有：
$$
\emptyset \subset K_1 \subset K_2 \subset \cdots \subset K_{n} = K
$$
虽然 $K_i, K_{i+1}$ 之间并不一定相差正好一个单纯复形，但是也算是一种包含关系。

---

实际计算的时候，我们把 $f$ 延拓到复形上即可。
$$
g(\sigma) = \max_{v \in \sigma} f(v)
$$

## 同调元的继承

## 诱导映射

如果存在单纯映射 $f: K \to L$（单纯映射就是 k-单形只会映射到 k-单形的映射），我们就可以诱导出任意 $p$ 阶同调群之间的同态：
$$
\begin{aligned}
f_\ast: H_p(K) &\to H_p(L) \newline

\end{aligned}
$$

- 基本原理：因为所有的 $K_p \to L_p$ 的映射都可以被自然地导出

## 嵌入映射

对于一个 filtration，若 $n < m$，则 $K^{(n)} \subset K^{(m)}$，从而有一个自然的嵌入映射：$i^{n, m}: K^{(n)} \to K^{(m)}$

从而就有 $i_\ast^{n,m}:H_\ast(K^{(n)}) \to H_\ast(K^{(m)})$

## 生成元的持续

![](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/14_1_22_1_202404140122400.png)

图例：

- 第 $j$ 个椭圆处的红色的部分是 $H_p^{i-1,j} := \frac{Z_p^{(i-1)}}{Z_p^{(i-1)} \cap B_p^{(j)}}$​
    - 直观上就是：第 $i-1$ 个闭链中，不是第 $j$ 个边界的集合
    - 因此，如果 $\gamma$ 被映射到了 $H_p^{i-1,j}$ 里，就代表它和之前的 $H_p^{(i-1)}$ 里的元素合并了，i.e. 与更老的同调元合并
        - 当然，也可以是和零元合并，i.e. 映射成零元，相当于 $\gamma$ 本身就是第 $j$ 个边界

直观理解：

- 同调群就是闭链除以边界的一个商群

### 生成元计数

定义：

1. $\mu^{i,j}_p$ 为所有在 i 时刻出生，在 j 时刻消亡的**线性无关同调生成元数目**
2. $\beta^{i,j}_p$ 为 i 时刻到 j 时刻都存在的线性无关同调生成元的数目。

从而，我们可以得到 $\beta$ 和 $\mu$ 的关系：

$$
\begin{aligned}
\mu_p^{i,j} &= \text{在 i 时刻存在，在 j 时刻消失} - \text{在 (i-1) 时刻存在，在 j 时刻消失} \newline
&= (\text{i 存在，j-1 存在} - \text{i 存在，j 存在}) - (\text{i-1 存在，j-1 存在} - \text{i-1 存在，j 存在}) \newline
&= (\beta^{i,j-1}_p - \beta^{i,j}_p) - (\beta^{i-1,j-1}_p - \beta^{i-1,j}_p)
\end{aligned}
$$

**持续同调基本定理：**

$$
\beta_p^{k,l} = \sum_{i \leq k} \sum_{j \geq l} \mu_p^{i,j}
$$

## 可视化

![](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/14_18_3_10_202404141803546.png)

如图，每一个点都对应着一个 $\mu_p^{i,j}$。向左上的阴影区域都对应着 $\beta_p^{i,j}$。

## 持续等价定理

**定理：** 如果

1. 下面的每一个 square 都是交换图
2. 所有 $U_i$, $V_i$ 之间的映射都是同构

那么，$U_i$ 和 $V_i$ 的 persistent diagram (持续图) 就是相同的。

<iframe class="quiver-embed" src="https://q.uiver.app/#q=WzAsMTAsWzAsMCwiVl8wIl0sWzEsMCwiVl8xIl0sWzIsMCwiXFxjZG90cyJdLFszLDAsIlZfe24tMX0iXSxbNCwwLCJWX24iXSxbMCwxLCJVXzAiXSxbMSwxLCJVXzEiXSxbMiwxLCJcXGNkb3RzIl0sWzMsMSwiVV97bi0xfSJdLFs0LDEsIlVfbiJdLFswLDFdLFs1LDBdLFs2LDFdLFsxLDJdLFs1LDZdLFs2LDddLFsyLDNdLFszLDRdLFs4LDldLFs3LDhdLFs4LDNdLFs5LDRdXQ==&embed" width="375" height="200" style="border-radius: 8px; border: none;"></iframe>

- 具体来说：我们可以认为，$V_i$ 和 $U_i$ 就是一组 filtration（之间由嵌入映射连接）。如果两者之间存在同构，那么在 PD 图层面就是等价的。

# Yet Another "Persistence": Level Set (水平集)

对于一个标量场，我们就不能简单使用复形了，而是要使用上下水平集。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/15_0_5_52_202404150005343.png" alt="image-20240414181837611" style="zoom: 33%;" />
$$
f(x)=1+0.0416667x-1.3125 x^{2}-0.0416667 x^{3}+0.3125 x^{4}
$$
如图，直观上看，从下往上，

- 首先，右边出现了一个线条
- 然后，左边出现了一个线条（目前有两条）
- 后来，两条线条合并，变成了一条线条。
    - 根据 FILO 原则：我们认为左边的线条在此处消亡。

如果用数学的语言描述：

- 遇到（右边的）极小值点：出现一个拓扑特征
- 遇到（左边的）极小值点：出现一个拓扑特征
- 遇到极大值点：**该极大值点两侧**的两个拓扑特征，根据 FILO 原则合并
