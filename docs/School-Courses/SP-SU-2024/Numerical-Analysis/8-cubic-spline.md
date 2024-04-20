# Cubic Spline

**定义：**

设 $a = x_0 < x_1 < \dots < x_n = b$ 是 $[a,b]$ 上 $n+1$ 个点。

1. 在每一个小区间内，样条是一个三次函数
2. 在整个 $[a,b]$ 上，函数的一、二阶导连续
3. 函数经过每一个点

**定义上和插值的不同：**

- 样条函数是分段函数
    - 只不过保证了连接处二阶导连续而已
- 样条函数只和 $f(x_i)$ 有关，和 $f$ 的高阶导数无关
    - 换句话说：样条函数在 $x_i$ 的导数、二阶导，不等于 $f'(x_i), f''(x_i)$

## Algorithm

假设在 $[x_i, x_{i+1}]$ 区间的样条函数是 $S_i(x) = a_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3$，那么：

1. $S_i(x_i) = f_i(x_i), S_i(x_{i+1}) = f_{i+1}(x_{i+1})$
2. $S_i'(x_i) = S_{i-1}'(x_i)$
3. $S_i''(x_i) = S_{i-1}''(x_i)$

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/20_21_23_49_202404202123647.png" style="zoom:50%;" />

从而，我们可以通过绿线部分的公式，推出我们需要的矩阵：
$$
\begin{bmatrix}
\text{TODO} \newline
\Delta x_0 & 2(\Delta x_0 + \Delta x_1) & \Delta x_1 & 0 & \cdots & 0 \newline
0 & \Delta x_1 & 2(\Delta x_1 + \Delta x_2) & \Delta x_2 &  \cdots & 0 \newline
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \newline
0 & 0 & 0 & 0 & \cdots & \Delta x_{n-1} \newline
\text{TODO}
\end{bmatrix}
\begin{bmatrix}
m_0 \newline
m_1 \newline
m_2 \newline
\vdots \newline
m_{n-1} \newline
m_{n}
\end{bmatrix} = 
\begin{bmatrix}
\text{TODO} \newline
\frac{y_2 - y_1}{\Delta_1} - \frac{y_1 - y_0} {\Delta_0} \newline
\frac{y_3 - y_2}{\Delta_2} - \frac{y_2 - y_1} {\Delta_1} \newline
\vdots \newline
\frac{y_{n} - y_{n-1}}{\Delta_{n-1}} - \frac{y_{n-1} - y_{n-2}} {\Delta_{n-2}} \newline
\text{TODO}
\end{bmatrix}
$$
可以发现：

1. 假如矩阵是三对角矩阵，那么就可以在 $\mathcal O(n)$ 之内解得方程。
2. TODO 就是超参数

## 边界条件

**注：** 我们可以把 $m_i$ 视作分段函数在 $x_i$ 处的二阶导。由于 $S_i'(x_i) = S_{i-1}'(x_i)$，因此 $m_i$ 是良定义的。

### 自然边界

自然边界，就是：$m_0 = m_n = 0$，也就是边缘的二阶导为 0。

从而，矩阵为：
$$
\begin{bmatrix}
1&0&0&0&\cdots &0 \newline
\Delta x_0 & 2(\Delta x_0 + \Delta x_1) & \Delta x_1 & 0 & \cdots & 0 \newline
0 & \Delta x_1 & 2(\Delta x_1 + \Delta x_2) & \Delta x_2 &  \cdots & 0 \newline
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \newline
0 & 0 & 0 & 0 & \cdots & \Delta x_{n-1} \newline
0&0&0&0&\cdots &1
\end{bmatrix}
\begin{bmatrix}
m_0 \newline
m_1 \newline
m_2 \newline
\vdots \newline
m_{n-1} \newline
m_{n}
\end{bmatrix} = 
\begin{bmatrix}
0 \newline
\frac{y_2 - y_1}{\Delta_1} - \frac{y_1 - y_0} {\Delta_0} \newline
\frac{y_3 - y_2}{\Delta_2} - \frac{y_2 - y_1} {\Delta_1} \newline
\vdots \newline
\frac{y_{n} - y_{n-1}}{\Delta_{n-1}} - \frac{y_{n-1} - y_{n-2}} {\Delta_{n-2}} \newline
0
\end{bmatrix}
$$
显然是三对角矩阵。

### 夹持边界

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/20_21_23_18_202404202123120.png" style="zoom: 80%;" />

我们令 $S'_0(x_0) = a, S'_{n-1}(n) = b$（也就是将函数左边界和右边界的导数固定为某个值）。

从而，矩阵为：
$$
\begin{bmatrix}
2\Delta x_0&\Delta x_0&0&0&\cdots &0 \newline
\Delta x_0 & 2(\Delta x_0 + \Delta x_1) & \Delta x_1 & 0 & \cdots & 0 \newline
0 & \Delta x_1 & 2(\Delta x_1 + \Delta x_2) & \Delta x_2 &  \cdots & 0 \newline
\vdots & \vdots & \vdots & \vdots & \ddots & \vdots \newline
0 & 0 & 0 & 0 & \cdots & \Delta x_{n-1} \newline
0&0&0&\cdots&\Delta x_{n-1} &-2\Delta x_{n-1}
\end{bmatrix}
\begin{bmatrix}
m_0 \newline
m_1 \newline
m_2 \newline
\vdots \newline
m_{n-1} \newline
m_{n}
\end{bmatrix} = 
\begin{bmatrix}
6 \left(\frac{y_1 - y_0} {\Delta x_0} - a \right) \newline
\frac{y_2 - y_1}{\Delta_1} - \frac{y_1 - y_0} {\Delta_0} \newline
\frac{y_3 - y_2}{\Delta_2} - \frac{y_2 - y_1} {\Delta_1} \newline
\vdots \newline
\frac{y_{n} - y_{n-1}}{\Delta_{n-1}} - \frac{y_{n-1} - y_{n-2}} {\Delta_{n-2}} \newline
6 \left(\frac{y_n - y_{n-1}} {\Delta x_{n-1}} - b \right)
\end{bmatrix}
$$
