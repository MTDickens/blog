# Why Estimate Motion?

Lots of uses

- ﻿﻿Track object behavior
- ﻿﻿Correct for camera jitter (stabilization)
- ﻿﻿Align images (mosaics)
- ﻿﻿3D shape reconstruction
- ﻿﻿Special effects

# Optical Flow（光流）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_22_37_34_20241208223734.png"/>

通过前后两张图片，以及时间差，我们可以估计某一个区域的物体的移动速度。由于我们只能通过**像素点**（i.e. 光线）的变化来推测物体的变化，因此就把它称为”光流“。

> [!error]+ Failure Modes
> 
> 如下图，如果物体转动但是像素几乎不变，抑或物体没动但是光源动了，那么我们就无法正确判断出物体的运动。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_20_31_56_20241209203155.png"/>

## 三大假设

光流法的三大假设是：

- **亮度恒定**：同一个物体前后的灰度值几乎不变
- **小运动**：物体的位移足够小（从而我们可以对灰度值才能对位置求偏导）
- **空间一致**：一个场景上邻近的点投影到图像上也是邻近点，且邻近点速度一致

## 推导：亮度恒定+小运动

不妨令前一张照片为 $H(x, y)$，后一张照片为 $I(x, y)$

由于 small motion，因此我们可以进行泰勒展开近似：

$$
I(x+u, y+v) \approx I(x, y) + \frac {\partial I} {\partial x} u + \frac {\partial I} {\partial y} v
$$

由于：

$$
\begin{aligned}
0 &= I(x+u,y+v) - H(x,y) \newline
&\approx I(x, y) + I_x u + I_y v - H(x, y) \newline
&= (I(x, y) - H(x, y)) + I_x u + I_y v \newline
&= I_t + \nabla I \begin{bmatrix} u \newline v\end{bmatrix}
\end{aligned}
$$

从而，对于每一个点 $(x, y)$:

$$
(u, v) = - \frac {I(x, y) - H(x, y)} {\|\nabla I(x, y)\|^2} \nabla I(x, y) + k \mathbf v, \text{where } \mathbf v \perp \nabla I(x, y), k \in \mathbb R
$$

也就是说：我们可以求出沿 $\nabla I(x, y)$ 方向的分量，但是垂直于 $\nabla I(x, y)$ 的分量 $k \mathbf v$，就是未知的。我们需要额外信息来求出 $k \mathbf v$。

> [!info]+ $(u, v)$ 关系：可视化
> 
> 如图，这就是 $(u, v)$ 之间的关系，它们只有一个约束，因此 $(u, v)$ 就在 $\nabla I(x, y) \cdot \begin{bmatrix} u \newline v \end{bmatrix} = -I_t$ 这条线上 
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_21_7_53_20241209210752.png" width="70%"/>

## 推导：空间恒定

我们进一步利用“空间恒定”这一假设：相邻的点，速度应该差不多。

因此，我们就

1. 把相邻点的 $(u, v)$ 关系直线都做出来
2. 求出所有直线的交点
3. 然后进行聚类。
4. 我们将最大的聚类的中心当成最终的解。

如下图：

> [!info]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_21_7_43_20241209210742.png"/>

## 算法：Lucas-Kanade Flow

对于某一点 $(x, y)$，取以该点为中心的 5x5 窗口，一共 25 个点（$p_1, p_2, \cdots, p_{25}$）

令

$$
A = 
\begin{bmatrix}
I_x(p_1) & I_y(p_1) \newline
I_x(p_2) & I_y(p_2) \newline
I_x(p_3) & I_y(p_3) \newline
\cdots \newline
I_x(p_{25}) & I_y(p_{25}) \newline
\end{bmatrix},
d = 
\begin{bmatrix}
u \newline
v
\end{bmatrix},
b = 
\begin{bmatrix}
-I_t(p_1) \newline
-I_t(p_2) \newline
-I_t(p_3) \newline
\cdots \newline
-I_t(p_{25}) \newline
\end{bmatrix},
$$

理想情况下，所有点的速度应该一样，因此 $Ad = b$。现实中，会出现干扰，因此使用最小二乘法拟合：$\min \| Ad - b\|^2$。

求梯度，得到最优解：

$$
A^T A v = Ab \implies v = 
\begin{bmatrix}
\sum_i I_x^2(p_i) & \sum_i I_x(p_i)I_y(p_i) \newline
\sum_i I_x(p_i)I_y(p_i) & \sum_i I_y^2(p_i) \newline
\end{bmatrix}^{-1} 
\begin{bmatrix}
-\sum_i I_x{p_i} I_t{p_i} \newline
-\sum_i I_y{p_i} I_t{p_i} \newline
\end{bmatrix}
$$

### More Constraints: RGB Version of the Algorithm

如果把每一个点的 RGB 值都算上，那么就有了 75 个约束（25 个点，每一个点有 3 个约束）。

### Numerical Considerations

我们希望：

- $A^TA$ 应该 invertible（基本上没问题）
- $A^TA$ 的两个特征值都不应该太小
- **$A^TA$ 的条件数不应该太大，i.e. $\lambda_1 / \lambda_2$ 不应该太大 ($\lambda_1 \geq \lambda_2$)**

对于 $A^TA$ 的条件数，由于 $A^TA = \sum_i \nabla I (\nabla I)^T$，因此我们可以从 $\nabla I(\nabla I)^T$ 入手。

由于

$$
\begin{aligned}
(k\nabla I)(k \nabla I)^T \nabla I &= k^2 \|\nabla I\|^2 \nabla I \newline
(k \nabla I)(k \nabla I)^T (\nabla I^\perp) &= 0, \text{where } \nabla I^\perp \text{ is the vector perpendicular to } \nabla I
\end{aligned}
$$

因此，我们不应该选取相邻 $\nabla I$ 都平行的 $(x, y)$。否则就会造成 $\lambda_1 \approx \sum_i k_i^2 \|\nabla I\|^2, \lambda_2 \approx 0$

同时，为了避免特征值过小，我们也不应该选取所有相邻 $\nabla I$ 都过小的 $(x, y)$

> [!example]+ Bad $(x, y)$
> 
> 相邻 $\nabla I$ 过小的 $(x, y)$ 就是图像内部。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_21_49_49_20241209214949.png"/>
> 
> 相邻 $\nabla I$ 都平行的 $(x, y)$ 就是图像边缘。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_21_50_7_20241209215007.png"/>
> 
> 这种 blob (斑点) 是最理想的 $(x, y)$。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_21_54_12_20241209215411.png"/>

## 改进：Iterative Lucas-Kanade

我们之前的方程是 $\nabla I \begin{bmatrix} u \newline v\end{bmatrix} \approx -I_t$。可见这里用到了约等号。如果希望提升精度，那么就应该多次迭代求出准确值。

每求一次 $(u, v)$，我们就对 $H$ 根据 $(u, v)$ 进行一次更改（使用双线性插值），直到收敛。

## 改进：Coarse-To-Fine Lucas-Kanade

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_22_18_40_20241209221840.png"/>

在 $(u, v)$ 确实小的情况下，就是左图的情况，可以正确对应。在 $(u, v)$ 实际上比较大的情况下，就是右图的情况，无法正确对应。

不难想到，$(u, v)$ 所谓“大小”，都是相对于一个像素点的大小。如果我们增大一个像素点的大小，那么 $(u, v)$ 就会相对变小。这就是 coarse-to-fine 的 intuition。

具体实现如下图：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_22_21_51_20241209222151.png"/>

