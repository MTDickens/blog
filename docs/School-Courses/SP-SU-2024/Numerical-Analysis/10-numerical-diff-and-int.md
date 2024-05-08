# Numerical Differentiation

我们可以将函数进行泰勒展开，比如：$f(x_0 + h) = 1\left[f(x_0)\right] + 1 \left[hf'(x_0)\right] + \frac 1 2 \left[h^2 f''(x_0)]\right] + \mathcal o(h^3)$，从而如果给定了 $f(x_0), f(x_0 + h), f(x_0 + 2h)$，我们就可以忽略三阶小量，然后消去 $f(x_0), h^2 f''(x_0)$，只留下 $hf'(x_0)$，从而求出导数。

i.e. 
$$
\begin{pmatrix}
1 & 0 & 0 \newline
1 & 1 & \frac 1 2 \newline
1 & 2 & 2 \newline
\end{pmatrix}
\begin{pmatrix}
f \newline
hf' \newline
h^2f'' \newline
\end{pmatrix} \approx
\begin{pmatrix}
f(x_0) \newline
f(x_0 + h) \newline
f(x_0 + 2h) \newline
\end{pmatrix}
$$
从而，$hf' \approx 2f(x_0+h) - 0.5 f(x_0 + 2h) - 1.5 f(x_0)$。

---

当然，也可以通过插值函数来拟合原函数，同时通过插值函数的导数拟合原函数的导数。

- 但是，由于 $\prod_{\substack{k=0\newline k\neq j}} (x_j - x_k)$ 这个数是相当不可控的，因此不一定很稳定

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/9_0_19_59_202405090019215.png"/>

# Numerical Integration

数值积分，本质上来说，也很简单：将积分区间上插值多项式拿过来近似就行了。

## Degree of Accuracy

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/9_1_8_7_202405090108513.png"/>

如图：对于这样的一次拟合，只能够准确求出 1 次及以下的多项式，因此 DoA 就是 1。

## Higher Order Interpolation

假设我们在 $[a,b]$ 中间均匀插值，插 $n+1$ 个点（包括端点），也就是 $h = \frac {b - a} n, x_i = ih + a$。那么，就可以实现：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/9_1_11_54_202405090111767.png"/>

由于当 $n+1$ 为奇数的时候，$x_{mid} = \frac {a+b} n = x_{\frac n 2}$，因此就可以多抵消一阶小项，precision = n + 2。