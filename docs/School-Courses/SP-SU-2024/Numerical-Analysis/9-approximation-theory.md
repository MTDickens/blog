$$
\newcommand{norm}[1]{\left|#1\right|}
$$

# Discrete Least Square Approximation

## Definition

给定多项式 $P_n(x) = a_0 + a_1 x + a_2 x^2 + \dots + a_n x^n$ 来 approximate a set, s.t. $E = \sum_{i=1}^m (y_i - P_n(x_i))^2$ is minimal.

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/25_17_1_51_202404251701369.png" style="zoom: 67%;" />

至于 $\vec x_i\vec x_i^T$，就是：
$$
\vec x_i\vec x_i^T=\begin{bmatrix}
1 & x_i & x_i^2 & \cdots & x_i^n \newline
x_i & x_i^2 & x_i^3 & \cdots & x_i^{n+1} \newline
\vdots & \vdots &  & \ddots & \vdots \newline
x_i^n & x_i^{n+1} & x_i^{n+2} & \cdots & x_i^{2n}
\end{bmatrix}
$$
**注：**

1. 必须要 $n \geq m-1$，否则无意义
2. 如果 $n = m-1$，那么拟合多项式等价于插值

## Problem

上面的矩阵是稠密的，从而解方程需要 $\mathcal O(n^3)$ 的时间，效率不高。

因此，我们需要选取一组合适的 basis，使得矩阵的形式更加好看。

## Integration Norm

一个自然的 norm 就是：
$$
\left< f, g \right> := \int_a^b f(x) g(x) \mathrm dx
$$
由于我们的点是离散的，因此我们用到的形式是：
$$
\left< f, g \right> := \sum_{i=1}^n f(x_i) g(x_i)
$$
从而，如果我们取 $\set{\varphi_i(x)}$ 为一组基（而不是 $1, x, x^2, \dots, x^n$），那么，$P_i(x) := a_0 \varphi_0(x_i) + a_1 \varphi_1(x_i) + \dots + a_n \varphi_n(x_i)$



矩阵的形式就变为：

$$
\vec \varphi_i\vec \varphi_i^T=\begin{bmatrix}
1 & \varphi_1(x_i) & \varphi_2(x_i)  & \cdots & \varphi_n(x_i) \newline
\varphi_1(x_i) & \varphi_1 (x_i)\varphi_1(x_i) & \varphi_2(x_i) \varphi_1(x_i) & \cdots & \varphi_n(x_i)\varphi_1(x_i) \newline
\vdots & \vdots &  & \ddots & \vdots \newline
\varphi_n(x_i) & \varphi_1(x_i)\varphi_n(x_i) & \varphi_2(x_i)\varphi_n(x_i) & \cdots & \varphi_n(x_i)^2
\end{bmatrix}
$$

假如我们有一组正交多项式的话，那么就可以保证除了对角线上的元素以外，$\sum_{i=1}^m \vec \varphi_i\vec \varphi_i^T$ 的其它元素均为 0。

采用 Gram-Schmidt 正交化方法，我们可以在 $\mathcal O(n^3)$ 的时间内算出。

相比矩阵计算而言，这种方法起码可以节省空间。

# General Least Squares Problem

目标：

$$
\mathop{\arg\min}_{p \in \mathbb P_n} \norm{f - p}_\infty
$$

**Chebyshev Theorem**: Let $f$ be a continuous function from $[a,b]$ to $\mathbb{R}$. Among all the polynomials of degree $\le n$, the polynomial $g$ minimizes the uniform norm of the difference $\| f - g \| _\infty$ if and only if there are $n+2$ points $a \le x_0 < x_1 < \cdots < x_{n+1} \le b$ such that $f(x_i) - g(x_i) = \sigma (-1)^i \| f - g \|_\infty$ where $\sigma$ is either -1 or +1.

- 也就是说：需要存在 $n+2$ 个交错的最大/小值，且最大/小值必须绝对值相同。

推论：由于有 $n+2$ 个交错的最大/小值，因此，方程 $(f-p)(x)=0$ 在 $[a,b]$ 上至少有 $n+1$ 个根。

---

因此，这 $n+1$ 个点，唯一决定了 $p$。从而，我们的目标转化为：

$$
\mathop{\arg\min}_{x_0, \dots, x_n \in [a,b]} \norm{(f - p_{x_0, \dots, x_n})(x)}_\infty = \norm{R_n(x)}_\infty = \norm{\frac 1 {(n+1)!} f^{(n+1)}(\xi_x) \prod_{i=0}^n (x - x_i)}_\infty
$$

- 也就是说：找到 $x_0, \dots, x_n$ 这 $n+1$ 个插值点，使得余项最小。

由于我们并不知道 $\xi_x$，因此就不考虑它了；由于 $\frac 1 {(n+1)!}$ 是常数，自然可以丢弃。

---

从而，问题**近似**转化为：$\mathop{\arg\min}_{x_0, \dots, x_n \in [a,b]} \norm{\prod_{i=0}^n (x - x_i)}_\infty$

我们可以进一步转化成 $\mathop{\arg\min}_{P_{n-1}} \norm{x^n - P_{n-1}(x)}_\infty$：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_19_21_49_202405081921179.png" style="zoom: 80%;" />

- 首先：$\min \norm{x^n - P_{n-1}(x)} \leq \min \norm{\prod_{i=0}^n (x - x_i)}$。这是显而易见的，因为 RHS 的最优解，一定是 LHS 的一个可行解。
- 其次，再次使用 Chebychev 定理：LHS 如果求到最优解，那么一定有 $n-1+2 = n+1$ 个 alternating minmax points。因此，LHS 的最优解，也是 RHS 的可行解。
- 从而，两者等价。
- 由于 $P_{n-1}$ 必须有 $n+1$ 个 alternating minmax points，因此我们的问题成功转化为：
    - 找出这样 $P_{n-1}$，使得 $x^n - P_{n-1}$ **长得和余弦函数差不多**


**注意：** $P_{n-1}$ 是任意的 $n-1$ 阶的多项式，i.e. 不要求 $x^{n-1}$ 系数为 1。

# Chebychev Polynomials

直观来想：一个最大偏差最小的函数，就应该是一个类似于 $\cos$ 这样的周期函数。

---

$f(\theta) = \cos(n\theta)$​ 是一个非常好的多根函数，可惜不是多项式。

但是，如果改成 $g(x) = f(\arccos x) = \cos(n \arccos x)$，那么就是多项式了。

设 $T_n(x) = \cos (n \arccos x)$，那么就有和差化积：$\cos(n+1)\theta+\cos(n−1)\theta=2\cos\theta \cos n\theta$

从而：$T_{n+1}(x) = 2x T_n(x) - T_{n-1}(x)$。

也就如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_21_54_19_202405082154707.png" style="zoom:80%;" />

---

不难证明：$T_{n}(x)$ (n &ne; 0) 的首项的系数为 $2^{n-1}$，因此：$x^n - P_{n-1} = T_n / 2^{n-1}$。

至于 $\cos(n \arccos x)$ 的第 $i$ 个 minmax，那就是 $\arccos(x) = \frac i n \pi \iff x = \cos(\frac i n \pi)$。

我们只需要计算这几个点的插值就行了。

## Economization of Power Series

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_22_55_29_202405082255199.png"/>

可以发现：

- 二阶泰勒展开远不如四阶泰勒展开+减去两个余弦基

---

由于 Chebychev polynomials $\set{T_0, T_1, \dots}$ 构成了一组多项式空间的基底，因此，还有另一种方法，就是直接把对方的多项式从自然基变换成 Chebychev 基，然后将高频的 Chebychev 基去掉就好。

- 由于 Chebychev 基和傅里叶基非常相似（可以说两者之间的差距就是一个变量替换），因此可以从傅里叶分解的视角上看待 Chebychev 基——就是将高频部分消除
