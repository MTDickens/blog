# Lagrangian Interpolation

## Definition

**定义：**
$$
L_{n,i} (x) = \prod_{j=0, j \neq i}^n \frac {x-x_j} {x_i-x_j}
$$
也就是说：$L_{n,i}$ 就是一个 $n$ 阶多项式。它在 $x_0, x_1, \dots, x_{i-1}, x_{i+1}, \dots, x_n$ 处为 0，在 $x_i$ 处为 1。

---

**定义：**
$$
P_n(x) = \sum_{i=0}^n f(x_i) L_{n,i}(x)
$$
也就是说：$P_n$ 就是一个 $n$ 阶多项式。它在 $x_0, x_1, \dots x_{n-1}, x_n$ 处分别为 $f(x_0), f(x_1), \dots, f(x_{n-1}), f(x_n)$。

## Properties

1. 如果 n+1 个点的横坐标不相同，那么，有且只有一个 n 阶多项式，能够经过这 n+1 个点
    - 假如有两个 n 阶多项式都经过这 n+1 个点，那么，两式之差必然以这 n+1 个点为零点。因此，两式之差的 n+1 个点要么是 1，

## Remainder Analysis

**前提：** 

1. 我们只讨论 $[x_0, x_n]$ 里面的误差
2. $f(x)$ 足够光滑

---

**定义：**
$$
R_n(x) = f(x) - P_n(x)
$$

---

**分析：**

由于 $\forall i \in \set{0, \dots, n}: R_n(x_i) = 0$

从而：$R_n(x) = K(x) \prod_{i=0}^n (x - x_i)$ 

任取 $x' \in [x_0, x_n]$ 且 $\forall i \in \set{0, \dots, n}: x' \neq x_i$

令 $g_n(t) = R_n(t) - K(x') \prod_{i=0}^n (t-x_i) = (K(t) - K(x')) \prod_{i=0}^n (t-x_i)$

从而：$g_n(t)$ 至少有 $x_0, \dots, x_n, x'$ 共 n+2 个零点。

从而：$\exists \xi_x \in (x_0, x_n): g_n^{(n+1)}(\xi_x) = 0$

从而：
$$
\begin{aligned}
0 &= R_n^{(n+1)}(\xi_x) - (n+1)!K(x') \\
&= f^{(n+1)}(\xi_x) - P^{(n+1)}(\xi_x) - (n+1)!K(x') \\
&= f^{(n+1)}(\xi_x)  - (n+1)!K(x')
\end{aligned}
$$
从而：
$$
\begin{aligned}
R_n(x') &= K(x')\prod_{i=0}^n (x' - x_i) \\
&= \frac 1 {(n+1)!} f^{(n+1)}(\xi_x) \prod_{i=0}^n (x' - x_i) \\
\end{aligned}
$$

---

如果和泰勒展开的拉格朗日余项进行对比，会发现两者的形式其实很像，除了泰勒展开后面不是 $\prod_{i=0}^n (x' - x_i)$，而是 $(x'-a)^{n+1}$。

### Example: `sin`

![](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/10_15_9_10_202404101509979.png)

也就是说：如果采用均匀插值的方式，那么后面的多项式会随着插入点的增加，以 $\mathcal O(\frac 1 {n^n})$ 的速度收敛。我们只需要保证前面的 $f^{(n)}(x)$ 的导数不爆炸就行。

# Neville Interpolation

## Lift the Degree of a Polynomial

我们可以发现，令多项式 $p_{\text{some indices}}$ 经过的点的 index 即为其下标，且阶数为 $\#\text{ of indices} - 1$。那么，如果已知两个 $n$ 阶多项式 $p_{1,2,\dots,i-1,i+1,\dots,n}, p_{1,2,\dots,j-1,j+1,\dots,n}$，我们就可以凑出：
$$
p_{1, 2, \dots, n} = \frac {(x-x_i) p_{1,2,\dots,i-1,i+1,\dots,n} - (x-x_j) p_{1,2,\dots,j-1,j+1,\dots,n}} {x_j - x_i}
$$

## Interpolation

对于高阶的插值，我们可以用 neville 插值：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/10_16_13_55_202404101613481.png" alt="img" style="zoom:50%;" />

如图，上图中的 $p_{(m, n)} := p_{m, m+1, \dots, n-1, n}$。因此，我们有递推关系：
$$
p_{m, n} = \frac{(x-x_m) p_{m, n-1} - (x - x_n)p_{m+1,n}} {x_n - x_m}
$$
因此，一开始，我们只需要把最下面的 $p_{m}(x) := f(x_m)$ 算出来（这里没有显示），就可以层层递推上去了。

---

**如果 $p_{m,n}$ 是值**

计算复杂度是 $\mathcal O(\sum_{i=1}^n (n-i+1)) = O(N^2)$，和 na&iuml;ve Lagrangian interpolation 一样，其中 $N$ 是总共的点数。

好处是

1. 增加插值点（如上图蓝色部分所示）的时候，我们可以利用之前的结果，从而增加一个点的计算复杂度只有 $\mathcal O(\sum_{i=1}^n 1) = \mathcal O(N)$。
2. 可以递归地进行计算，代码简洁。

**如果 $p_{m,n}$ 是多项式**

计算复杂度是 $\mathcal O(\sum_{i=1}^n (n-i+1)i) = \mathcal O(N^3)$，比 na&iuml;ve Lagrangian interpolation 要大。增加插值点的时候，计算复杂度也是 $\mathcal O(\sum_{i=1}^n i) = \mathcal O(N^2)$，并不比 na&iuml;ve 的更好。

因此，如果我们不仅要多项式在某个点 $x^\ast$ 处的值，更需要多项式本身，那么，还需要下面的**牛顿插值法**。

# Newton Interpolation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/10_16_49_29_202404101649776.png" alt="image-20240410164922610" style="zoom:50%;" />

如图，给定 $n+1$ 个点和 $n+1$​ 个系数，我们就可以构建出 newton interpolation polynomial。

- 不过，在构造 polynomial 的时候，我们用不到第 $n+1$ 个点，i.e. $x_{n }$

然后，我们将这 $n+1$ 个点带入 polynomial，形成 $n+1$ 个值：$f_0, \dots, f_n$​。值和系数的关系如上图所示。

从而，我们只需要通过 $f_i := f(x_i)$ 反解出 $\vec \alpha$​ 即可。

## Properties

1. 由于 $\forall i \geq j: N^{(i)}(x_j) = 0$，因此矩阵是下三角矩阵 ，本质上是可以直接用来求解线性方程组的。
2. 由插值多项式的唯一性：Newton 插值、Lagrange 插值乃至所有的多项式插值，在最终结果上是**等价**的。

## Computation

我们通过差商来计算，差商的定义如下：

![](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/10_17_30_27_202404101730418.png)

牛顿多项式计算结果如下：
$$
N(x)=[y_{0}]+[y_{0},y_{1}](x-x_{0})+\cdots +[y_{0},\ldots ,y_{k}](x-x_{0})(x-x_{1})\cdots (x-x_{k-1})
$$

### Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/10_17_33_37_202404101733586.png" alt="image-20240410173335910" style="zoom:50%;" />

- e.g. $[x_{-1}, x_0, x_1, x_2] = ([x_{-1}, x_0, x_1] - [x_0, x_1, x_2]) / (-1 - 2) = (3 - 2.5) / -3 = - 1/6$

可以发现，

- 差商表的递推顺序，和 Neville 的递推顺序完全一样。差别就在于递推函数
- 由于**差商即系数**，因此建表只需要 $\mathcal O(N^2)$，增加一个点只需要 $\mathcal O(N)$。从而，Newton 多项式的复杂度，和 Neville 的值的复杂度一样。（具体对比见下）

# Comparison

**Newton vs Neville vs 待定系数: Matrix form**

- 待定系数法 vs Lagrangian interpolation vs Newton interpolation
    - 待定系数法的基底是 $\set{1, x, x^2, \dots, x^n}$，矩阵是稠密矩阵
    - Lagrangian basis 是 $\set{L_{n,0}, L_{n,1},\dots, L_{n,n}}$，矩阵是单位矩阵
    - Newton basis 是 $\set{N^{(0)},N^{(1)},\dots,N^{(n)}}$​，矩阵是下三角矩阵
- 我们可以认为：我们通过将基底变换成 Lagrangian 和 Newton，使得这个矩阵变成了更容易求解的形式

---

**差商表 vs Neville 表的递推复杂度**

- 差商表是 $[m\sim n] = \frac{[m+1 \sim n] - [m \sim n-1]}{n-m}$​
    - $[\dots]$ 是**系数（值）**，本质上也是多项式，但是多项式的各系数比例是**固定**的，因此可以用单一系数表示。
- Neville 是 $p_{m, n} = \frac{(x-x_m) p_{m, n-1} - (x - x_n)p_{m+1,n}} {x_n - x_m}$
    - $p_{\dots}$ 是**值**或者**多项式**。如果 $p_{\dots}$ 是多项式，由于多项式的各系数比例是**不固定**的，因此必须用数组表示。从而造成了 $\mathcal O(N^3)$ 的复杂度。