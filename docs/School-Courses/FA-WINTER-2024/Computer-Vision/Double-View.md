## Overview

有了双目，我们就可以将两张 2D 的图片，重建成一张 2.5D 的深度图。

### A Trivial Example

如果两个眼睛的“底片”是

1. 位于同一平面且对应的边对齐（如下图）
2. 距离固定

那么我们通过两张图片上两点之间的对应，就可以推算出来这个点在 3D 中，距离双眼的距离是多少（Z 轴）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_11_48_25_20241208114824.png"/>

> [!warning]+ Limitation
> 
> 如图，由于 $Z = \frac {fT}{x^l - x^r} = \frac {fT}{\Delta x}$，因此，$\Delta x(Z) = \frac {fT} Z \implies \Delta x'(Z) = - \frac {fT} {Z^2}$。距离越远，距离变化的时候，$\Delta x$ 变化幅度越小，越难以察觉。
> 
> 因此，这种方法，对于距离很远的物体，效果就不好，只适用于距离比较近的物体。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_11_56_19_20241208115619.png"/>

### 对极几何

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_12_42_10_20241208124209.png"/>

如上图，

- $e, e'$ 就是两者的“对极点”
- 对于左**侧**上任意一点 $p$，如果将其与 $e$ 连线成 $l := pe$，那么就会在右**侧**上对应某条经过 $e'$ 的线（$l'$）

假设左**侧** $p$ 的坐标是 $(x_l, y_l)$，容易证明，存在一个仿射变换 $E$，将其变成右**侧**中的 $l': ax_r + bx_r + c = 0, \text{where } (a, b, c) = (x_l, y_l, 1) E^T$。

从而，如果左**侧**的点 $(x_l, y_l)$ 和右**侧**的点 $(x_r, y_r)$ 对应，那么就必须满足：

$$
\begin{bmatrix}
x_r & y_r & 1
\end{bmatrix}
\begin{bmatrix}
a \newline
b \newline
c
\end{bmatrix}
 = 0 \iff 
\begin{bmatrix}
x_r & y_r & 1
\end{bmatrix}
\mathbf{E}
\begin{bmatrix}
x_l \newline y_l \newline 1
\end{bmatrix}
= 0
$$


这个 $\mathbf E$ 就是 essential matrix，可以将左侧的点变换到右侧的一条线上（同样，对于右侧而言，$\mathbf E^T$ 可以将右侧的点变换到左侧的线上）

#### Essential Matrix as Perspective Transformation

#### Derivation of Essential Matrix

#### Homography, Essential Matrix and Fundamental Matrix

> [!info] 四个坐标系
> 
> 世界坐标系 (3D)、相机坐标系 (3D)、图像坐标系 (2D)、像素坐标系 (2D)

- Essential Matrix 负责将两个不同**图像坐标系**里的点对应起来。要求这两个相机都是 normalized camera，也就是焦距为 1
	- Essential Matrix 本质上是两个*相机参考系*之间的变换
	- 但是由于我们的变换必须是二维射影平面之间的变换，因此我们还是得用*图像参考系*
		- 这里用的就是 normalized 参考系
- Fundamental Matrix 负责将两个不同**像素坐标系**的点对应起来。没有任何要求。
	- 比如，可以是任意两个相机拍的同一地点、角度差不多的相片。
- Homography 就是任意两个射影空间的变换。

由于 $x' \sim Hx \implies x' \sim \alpha x' \sim (\alpha H) x$ (注：这里的 $\sim$ 指射影意义上等价），因此缩放 $H$ 是毫无意义的。从而，homography 的自由度只有 8 个。

由于 $F = K'^T R[t]_\times K$，而 $[t]_\times$ 显然 rank 为 2，不是可逆矩阵。因此 $\det(F) = 0$，自由度相比 $H$ 再降低一个，就是 7 个。

- 因此，理论上 7 点就能求出 fundamental matrix
- 实际上，我们经常用 8 点法，也就是把 fundamental matrix 当成 homography，抛弃它的 $\det(F) = 0$ 这个非线性条件

至于 $E = R[t]_\times$，$R$ 有 3 个自由度，$[t]_\times$ 也有 3 个，然后又由于缩放无意义（其实就是 $[t]_\times$ 缩放无意义，归根结底是 $t$ 缩放无意义），$3+3-1=5$ 个自由度。

## Structured Light (结构光)

对于双目视觉而言，如果某一个点在另外一张图像上没有找到对应，那么就会造成深度缺失。为了保证所有点的深度都能求出，我们需要采用 structured light 的方式——主动探测，主动往结构上打上特殊的光，然后通过反射回来的信号，来判断深度。

**原理**：一个结构光投影仪，产生具有特殊结构的图案，投射到待测物体上。然后一个 camera 用于识别反射的光线，根据畸变情况来计算深度信息。

> [!example]+ 
> 
> 下面是一个非常 naive 的例子：情况非常简单，但是这就是结构光的基本原理
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_21_30_54_20241208213053.png"/>
> 
> 见下图（令结构光投影仪到物体的光束为 $l_1$，camera 到物体的光束为 $l_2$）：
> 
> 我们将若干个条码打在物体上。我们应该横向打一次，然后纵向打一次。任何一个点，检测其位于第几个横纵条码，这样就能大致定位这个点的 $l_1$（定位精度的影响因素之一，就是条形码的细度）。然后，再加上 $l_2$，我们就能通过上图的算法求出深度信息。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_21_32_52_20241208213252.png"/>

> [!info]+ Pros and Cons
> 
> **优点**：成本低，速度快（根本无需复杂的双目视觉匹配，可想而知速度快）
> 
> **缺点**：粗糙，需要后处理

### 结构光深度图拼接

> [!info]+ Problem
> 
> 拼接之前，我们首先需要将两个点云变换到“同一坐标系”下面。
> 
> **对于双目视觉**：两个摄像机，可以产生一个深度图；如果有多个摄像机，那么相邻摄像机之间，可以产生多个深度图。显然，两个深度图之间的变换矩阵是已知的。
> 
> **对于结构光**：一个摄像机，可以产生一个深度图；不同摄像机之间的位置关系不已知。因此需要我们使用匹配算法，来对相邻的点云进行匹配，然后求出之间的变换矩阵。

算法（vanilla）：

1. 给定两张图，src 和 dest。我们首先手动标注出 src 和 dest 中的若干对应点。然后自动拟合一个仿射变换，将 src -> src_1
2. 对于 src_n 上的每一个点，我们将其匹配到 dest 上距离其最近的点
3. 拟合一个仿射变换，使得变换之后，src_n+1 和 dest 之间的误差最小
4. src_n -> src_n+1, and goto (2)

当然，还有以下细节需要讨论：

- 误差是什么
- 如何避免 outlier 对结果造成影响
	- 两张图的重合度肯定不是 100%，因此肯定有一些点不应该能够匹配上的
	- 除此之外，也会存在一些点，虽然在两张图中都出现了，但是由于图片本身的噪声，匹配失败
- 什么时候可以停止
- ……

## Shape from X

人类并不是完全使用双目来判断形状——单眼也不是不行。这就是因为使用了很多额外的信息。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_22_28_25_20241208222824.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/8_22_29_6_20241208222906.png"/>
