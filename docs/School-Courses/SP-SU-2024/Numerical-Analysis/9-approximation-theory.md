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