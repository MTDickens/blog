# Overview

单目视觉必然会损失深度信息，因此最终的成像就是 2D 图片。

很多时候，我们采用针孔相机模型来近似镜头相机。

# Pin-Hole Camera



# Depth of Field

对于不满足 $\frac 1 u + \frac 1 v = \frac 1 f$ 的物体，无法成一个绝对清晰的像。但是如果 $\frac 1 u$ 和 $\frac 1 f - \frac 1 v$ 相差不大的话，物体一点发出的光，在像平面虽然无法汇聚成一个点，但是可以汇聚在一个足够小的圆内。这个圆被称为**弥散圆** (circle of confusion)

假设我们给这个圆的半径设一个阈值，对于给定的**像距**、**光圈**和**焦距**，就存在一个物距的范围 $[u_\min, u_\max]$，所有 $u \in [u_\min, u_\max]$，都满足弥散圆的半径小于这个阈值。这个物距范围 $u_\max - u_\min$，就被称为 depth of field

> [!info]
> 
> 通过数学推导，不难得出：
> 
> 1. 光圈越大（i.e. 光圈半径越小），depth of field 越大
> 2. 焦距越大，depth of field 越小

# Field of View

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_11_44_58_20241206114457.png"/>

Field of view 就是立体角。不过我们往往用这个立体角一个方向上的平面角来代替。

# 畸变

## 径向畸变

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_12_28_34_20241206122834.png" width="50%"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_12_27_30_20241206122730.png"/>

在径向方向，有两种畸变：桶状 (barrel) 和枕状 (pin-cushion)。一般而言，长焦镜头容易产生枕状畸变，广角（短焦）镜头容易产生桶状畸变。

**产生原因**：

1. 由于镜头不是完美的，因此就会在边缘处产生畸变。
2. 如果挡板（i.e. 光圈）的位置不合适，那么就会让物体一些部分发出的光，不是经过透镜中心部分，而是经过透镜边缘部分，从而造成这个畸变体现了出来。

**畸变估计**：假设在无畸变情况下的某一个点 $(x_{\text{correct}}, y_{\text{correct}})$，在存在畸变的情况下，就会被映射到 $(x, y)$，那么就存在一个函数：$f(x, y) = (x_{\text{correct}}, y_{\text{correct}})$。

根据 [Z Zhang 98](https://www-users.cse.umn.edu/~hspark/CSci5980/zhang.pdf) 的论文，我们进行泰勒展开，可以将 $f$ 近似，并使用三个参数进行参数化：

$$
\begin{aligned}
x_{\text{correct}} &= x(1 + k_1 r^2 + k_2 r^4 + k_3 r^6) \newline
y_{\text{correct}} &= y(1 + k_1 r^2 + k_2 r^4 + k_3 r^6) \newline
\end{aligned}
$$

> [!example]+ 径向畸变
> 
> 如图，箭头就是 $(x_{\text{correct}}, y_{\text{correct}}) \mapsto (x, y)$
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_12_58_1_20241206125801.png"/>

## 切向畸变

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_12_59_18_20241206125918.png" width="50%"/><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_13_0_38_20241206130037.png" width="50%"/>

**产生原因**：底片和针孔/透镜没有平行，导致图像在切向方向产生偏移。

**畸变估计**：假设在无畸变情况下的某一个点 $(x_{\text{correct}}, y_{\text{correct}})$，在存在畸变的情况下，就会被映射到 $(x, y)$，那么就存在一个函数：$f(x, y) = (x_{\text{correct}}, y_{\text{correct}})$。

根据 [Z Zhang 98](https://www-users.cse.umn.edu/~hspark/CSci5980/zhang.pdf) 的论文，我们进行泰勒展开，可以将 $f$ 近似，并使用两个参数进行参数化：

$$
\begin{aligned}
x_{\text{correct}} &= x + [2 p_1 y + p_2 (r^2 + 2x^2)] \newline
y_{\text{correct}} &= y + [2 p_1 (r^2 + 2x^2) + p_2 x] \newline
\end{aligned}
$$

> [!example]+ 切向畸变
> 
> 如图，除了中心区域以外，其余的区域都整体往一个方向偏移
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/6_13_3_23_%E6%88%AA%E5%B1%8F2024-12-06%2013.03.04.png" width="70%"/>

## 畸变校正

已知内参矩阵，可以通过

1. 一张畸变的图以及一张未畸变的图
2. 两张不同视角的畸变的图

再加上若干个点的对应，就可以进行畸变校正（反正就那么多个参数，联立方程就行了，或者，如果对应的点数多于方程数，用最小二乘进行拟合就行了）。

