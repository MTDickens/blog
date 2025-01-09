# 定义

**定义**：根据场景图像，实现场景中信息的**恢复**和**利用**

# 几何特性

## 面积（零阶矩）

$$
A = \sum_{i=0}^{n-1} \sum_{i=0}^{m-1} B[i,j]
$$

## 区域中心（一阶矩）

$$
\begin{aligned}
\bar x &= \sum_{i=0}^{n-1} \sum_{i=0}^{m-1} jB[i,j] \newline
\bar y &= \sum_{i=0}^{n-1} \sum_{i=0}^{m-1} iB[i,j]
\end{aligned}
$$

## 方向

对于直线 $\rho = x \cos \theta + y \sin \theta$，任意一点到该直线距离 $r = x \cos \theta + y \sin \theta - \rho$

因此，如果利用最小二乘法进行拟合（i.e. 使用 quadratic metric loss），我们只需要最小化下面的目标函数：

$$
\begin{aligned}
\chi^2 &= \sum_{i=0}^{n-1} \sum_{i=0}^{m-1} r_{ij}^2 \newline
&= \sum_{i=0}^{n-1} \sum_{i=0}^{m-1} (x_{ij}\cos\theta + y_{ij}\sin\theta - \rho)^2 B[i,j]
\end{aligned}
$$

**求解**：

令

$$
\begin{aligned}
a&= \sum _{i= 0}^{n- 1}\sum _{j= 0}^{m- 1}( x_{ij}- \overline {x}) ^2B[ i, j] \newline
b&=2\sum_{i=0}^{n-1}\sum_{j=0}^{m-1}(x_{ij}-\overline{x})(y_{ij}-\overline{y})B[i,j] \newline
c&=\sum_{i=0}^{n-1}\sum_{j=0}^{m-1}(y_{ij}-\overline{y})^{2}B[i,j]
\end{aligned}
$$

则：

$$\sin2\theta=\pm\frac{b}{\sqrt{b^{2}+\left(a-c\right)^{2}}}$$
$$\cos2\theta=\pm\frac{a-c}{\sqrt{b^{2}+\left(a-c\right)^{2}}}$$

## 其它特性

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_22_25_14_20241125222513.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_22_25_45_20241125222544.png"/>

## 投影计算

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_22_26_35_20241125222634.png"/>

## 连通路径标记

> [!info]- 四联通和八连通
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_22_36_44_20241125223644.png"/>

我们的目的是：给所有值为 1 的点打上一个标记，保证两点的标记相同，当且仅当两点的标记相同

可以用**序贯算法**实现：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_22_55_48_20241125225548.png"/>

## 区域边界跟踪

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_23_1_41_20241125230140.png"/>

我们还是直接使用一个例子来说明：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_23_2_16_20241125230215.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_23_8_6_20241125230805.png" width="60%"/>

如图：

- 首先从上到下，从左到右扫描，找到这个区域的原始点（i.e. 这个点为 1，但是存在一个为 0 的临点）
- 首先让 b 为左邻点，然后四周扫一圈（见图二）
- 我们选择 $n_2$ 为 next b，$n_3$ 为 next c（见图三、四）
- ……

## 数学形态学算子

两个基本算子：膨胀、腐蚀

**记号**：我们令

- 二值图片为 $A$
- 结构元素为 $B$
	- 可以类比卷积核
- $B_x$ 就是结构元素平移到点 $x$ 处

那么：

- **膨胀**（$A \oplus B$）就是 $\{x | B_x \in A\}$
- **腐蚀**（$A \ominus B$）就是 $\{x | B_x \cup A \neq \emptyset\}$

此外：

- **开操作**就是 $(A \ominus B) \oplus B$
- **闭操作**就是 $(A \oplus B) \ominus B$

# 边缘检测

> [!info]+ 边缘的四种不连续
> 
> 1. 亮度不连续
> 2. 深度不连续
> 3. 法线方向（i.e. 表面方向）不连续
> 4. 材质不连续

我们这里假设是亮度不连续。

- 对于物体边缘，其特征就是像素点的值的一个 leap
- 对于一根线条，其特征就是像素点的值的两个 leaps（一个 up，一个 down）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_23_29_18_20241125232918.png"/>

## 噪声

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/25_23_33_49_20241125233348.png"/>

不论是一阶导还是二阶导，对于最下面的情况，根本分辨不出来

## 一维卷积算子

我们可以使用卷积算子来模拟方向导数：

- $\frac {\partial f(x,y)} {\partial x} \approx \frac {f(x+\Delta x, y) - f(x, y)} {\Delta x}$
- 这就是算子 $\begin{bmatrix}1 -1\end{bmatrix}$ 做的事情
- 当然，如果希望提高鲁棒性，可以用 $\begin{bmatrix}1 & 0 & -1 \newline 1 & 0 & -1 \newline 1 & 0 & -1 \newline\end{bmatrix}$

或者，如果希望计算对角线的梯度：

$$
\begin{bmatrix} 1 & 0 \newline 0 & -1 \end{bmatrix}
$$

## 二维卷积算子

如果我们希望计算二阶导数的话，可以这样：

$$
\begin{aligned}
\nabla^2 f &= \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} \newline
&\approx f(x+1,y) - f(x, y) - (f(x, y) - f(x-1, y)) +  f(x,y+1) - f(x, y) - (f(x, y) - f(x, y-1)) \newline
&= f(x+1, y)  +f(x-1, y)+f(x, y+1) + f(x, y-1) - 4f(x, y)
\end{aligned}
$$

对应的卷积算子就是：

$$
\begin{bmatrix}0 & 1 & 0 \newline 1 & -4 & 1 \newline 0 & 1 & 0
\newline\end{bmatrix}
$$

当然，也可以用：

$$
\begin{bmatrix} 1 & 4 & 1 \newline 4 & -20 & 4 \newline 1 & 4 & 1
\newline\end{bmatrix}
$$

## LoG (Laplacian of Gaussian) 边缘检测

先用 Gaussian 算子将整个图像平滑化，然后使用 Laplacian 算子将图像的边缘找出来

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_9_27_20241126000926.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_9_54_20241126000953.png"/>

## Canny Edge Detector

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_17_54_20241126001754.png"/>

### Step 1-2

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_18_40_20241126001840.png"/>

### Step 3

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_18_53_20241126001853.png"/>

**如上图**：如果计算出来的幅角是 22.4 度，那么就算在 0 区内；如果是 22.6 度，就算在 1 区内。
#### Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_19_58_20241126001957.png"/>

如上图：在没有非最大值抑制之前，线条可能会比较粗（可能有一段区间内导数都比较大）。加上非最大值抑制之后，**只有中间最亮的部分会被保留，周围比较暗的部分，因为不是自己方向上极大的导数，因此就会被抑制**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_19_12_20241126001911.png"/>

### Step 4

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_0_22_40_20241126002239.png"/>

就是说：

1. 对于一个高阈值图的点，将其视作**边缘点**；对于非低阈值图的点，将其视作**内部点**
2. 对于一个属于低阈值图，但是不属于高阈值图的点，将其视作**准边缘点**。如果该点通过其它**准边缘点**和某个边缘点连在一起了（这里使用 8 邻域的连接），那么就将其视作**边缘点**，否则视作**内部点**
#### 算法

其实就是将整张图片打上记号：

1. $N[i,j] > T_2$: 2
2. $T_1 \geq N[i,j] > T_1$: 1
3. $T_1 \geq N[i,j]$: 0

然后，

1. 我们对所有 1, 2 的 pixels 做联通路径标记。
2. 如果一个连通分量里面存在 2 pixel，那么就将其标记为 2，否则就标记为 0
3. 对于所有的 1 的 pixels，将其记号改成所属连通分量的记号


# 轮廓

## 曲线拟合：分线段拟合

最经典的是  算法

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_1_36_44_20241126013644.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_1_36_27_20241126013627.png"/>

**对于上图的例子**：

1. 直接在左右两端点之间连线，明显 $d_{\max} \geq D$
2. 我们以 $d_\max$ 所在点为界，把曲线分成两部分，然后分别使用该方法。右侧曲线满足 $d_\max < D$，所以终止迭代；左侧曲线还是 $d_\max \geq D$，因此继续迭代
3. ……

## 曲线拟合：椭圆拟合

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_2_30_27_20241126023026.png"/>

## 曲线检测：Hough 变换

### 理论：w/o noise

如果我们希望检测某些点的序列是否构成了某种几何图形，那么可以这样做：

假设描述几何图形的方程是：

$$
f(x, y; \boldsymbol \theta) = 0
$$

那么，给定一个点 $(x_0, y_0)$，**所有经过这个点的这种几何图形的参数**就是下面的集合：

$$
\{\boldsymbol \theta: f(x_0, y_0; \boldsymbol \theta) = 0\}
$$

因此，如果若干个点确实位于同一个几何图形 $f(x, y; \boldsymbol \theta_0) = 0$上，那么**这些点对应的参数集合必然会有一个公共的交点，就是 $\boldsymbol \theta_0$**。

因此，理论上，我们只需要求出这些点的交点就行了。如果都交于一点，那么即为所求。

### 实践: w/o noise

如下图：令 $f(x, y; a, b) = ax+b-y = 0$。那么，任意点 $(x_0, y_0)$，在参数空间中就对应着 $\{\boldsymbol \theta: f(x_0, y_0; a, b) = x_0a + b - y_0 = 0\}$，也就是参数空间曲线 $b = -x_0a + y_0$ 对应的点集。

- 其实就是说明，Euclidean space 中的点，和 Hough space 中的直线是一一对应的
- 然后求出 Hough space 中所有直线的交点即可

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_2_48_29_20241126024828.png"/>

实际操作中，由于垂直于 x 轴的直线的斜率为无穷大，因此我们采用极坐标的表现方式：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_2_53_37_20241126025336.png"/>

如上图：令 $f(x, y; \theta, \rho) = x\cos \theta + y \sin \theta - \rho = 0$。那么，任意点 $(x_0, y_0)$，在参数空间中就对应着 $\{\boldsymbol \theta: f(x, y; \theta, \rho) = x\cos \theta + y \sin \theta - \rho = 0 \}$。

令 $x = r \cos \phi, y = r \sin \phi$，那么方程就是：$r (\cos \phi \cos \theta + \sin \phi \sin \theta) = \rho \implies \rho = r \cos (\phi - \theta)$。

- 这里，Euclidean space 中的点，和 Hough space 中的三角函数曲线（x 轴上任意平移、y 轴上任意拉伸）是一一对应的
- 然后求出 Hough space 中所有三角函数曲线的交点即可

### 理论：w/ noise

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_2_46_23_20241126024622.png" width="50%"/>

由于噪声是不可避免的，因此我们选择将 $\boldsymbol \theta$ 的参数空间划分成多个 bin——引入累加器。

如上图所示：如果 $\boldsymbol \theta = (\rho, \theta)$，因此参数空间就有两个维度。我们在这两个维度中划分若干个 bins。然后，如果有一条曲线经过这个 bin，那么就对这个 bin 加一。最后，得分最高的 bin 胜出。

# More Info

详见[博客](https://sikasjc.github.io/2018/04/20/Hough/#detection-of-infinite-lines)

# Local Feature

## 5 Key Advantages of SIFT (Scale-Invariant Local Features)

- ﻿﻿**Locality**: features are local, so robust to occlusion and clutter (no prior segmentation)
	- 即使有遮挡，因为是局部特征，**未受遮挡的特征不会受到影响**，仍然和原来几乎一样
- ﻿﻿**Distinctiveness**: individual features can be matched to a large database of objects
	- 特征不能过于 "invariant"，仍然需要保证不同场景下的可区分性
- ﻿﻿**Quantity**: many features can be generated for even small objects
	- 特征数量不能太少
- ﻿﻿**Efficiency**: close to real-time performance
	- 特征算起来要快（否则我们就用深度特征了）
- ﻿﻿**Extensibility**: can easily be extended to wide range of differing feature types, with each adding robustness

## What Can SIFT Do?

- Image alignment (homography, fundamental matrix)
- ﻿﻿3D reconstruction
- ﻿﻿Motion tracking
- ﻿﻿Object recognition
- ﻿﻿Indexing and database retrieval
- ﻿﻿Robot navigation
- ﻿﻿... other

## Feature Detection

### Harris Corner Detection

哪一些位置具有良好的定位能力（i.e. 两个相同场景、略微不同视角拍出来的图片，不仅特征要对应，而且特征的位置也要良好对应）？

- 对于物体内部，任何方向都不能良好对应
- 对于物体边缘，沿着边缘的方向不能良好对应
- 对于边角处，可以良好对应

因此，我们主要需要依靠 corner 来进行定位。而第一步就是找到这些 corners。

#### Mathematics

**定义**：Change in the window $w(x,y)$ for the shift $[u, v]$

$$
E(u, v) = \sum_{x, y} w(x, y) [I(x+u, y+v) - I(x, y)]^2
$$

这个意思就是，我们在图像空间上施加一个 sliding window（见下图）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_23_2_9_20241126230208.png"/>

**解释**：

- 这个 window 可以是 0/1 window：$w(x, y) = \textbf{ if } x_0 - \Delta \leq x \leq x_0 + \Delta \text{ and } y_0 - \Delta \leq y \leq y_0 + \Delta \textbf{ then } 1 \textbf{ else } 0$
- 也可以是 gaussian window：$w(x, y) = {\frac {1}{2 \sigma \pi}}\exp \left(-{\frac {1}{2}}{\frac {(x-x_0 )^{2} + (y - y_0)^2}{\sigma ^{2}}}\right)$

然后，

1. 我们将这个 window 的中心放在 $(x_0, y_0)$ 处，为 window 内部的每个像素计算出来一个值
2. 进行 $(u, v)$ 的平移，i.e. 放在 $(x_0 + u, y_0 + v)$ 处，然后再为 window 内部的每个像素计算出来一个值
3. 最后，将这平移前后 window 内像素的值作差，然后求平方和

#### Approximation

假如这个 $u, v$ 都很小，那么根据 Taylor expansion:

$$
I(x + u, y + v) \approx I(x, y) + u I_x(x, y) + v I_y(x, y)
$$

从而：

$$
\begin{aligned}
E(u, v) &\approx \sum_{x, y} w(x, y) [I(x+u, y+v) - I(x, y)]^2 \newline
&= \sum_{x, y} w(x, y) [u I_x(x, y) + v I_y(x, y)]^2 \newline
&= \sum_{x, y} w(x, y) \left\{ \begin{bmatrix}u & v\end{bmatrix} \begin{bmatrix}I_x(x, y) \newline I_y(x, y)\end{bmatrix}\right\}^2 \newline
&= \sum_{x, y} w(x, y) \begin{bmatrix}u & v\end{bmatrix} 
\begin{bmatrix}
I_x^2 & I_x I_y \newline
I_x I_y & I_y^2
\end{bmatrix}
\begin{bmatrix}u \newline v\end{bmatrix} \newline
&= \begin{bmatrix}u & v\end{bmatrix}
\left(
	\sum_{x, y} 
	w(x, y) 
	\begin{bmatrix}
	I_x^2 & I_x I_y \newline
	I_x I_y & I_y^2
	\end{bmatrix}
\right)
\begin{bmatrix}u \newline v\end{bmatrix} \newline
&= \begin{bmatrix}u & v\end{bmatrix}
\mathbf M
\begin{bmatrix}u \newline v\end{bmatrix} , \text{ where } 
\mathbf M =
	\sum_{x, y} 
	w(x, y) 
	\begin{bmatrix}
	I_x^2 & I_x I_y \newline
	I_x I_y & I_y^2
	\end{bmatrix}
\end{aligned}
$$

很显然，$E(u, v)$ 在 $(0, 0)$ 局部，就是一个二次型。而这个二次型，我们可以很轻易将其用椭圆来可视化：

$$
\mathbf M = \mathbf V^T \text{diag}(\lambda_1, \lambda_2) \mathbf V, \text{ where } \lambda_1 \leq \lambda_2
$$

如果 $\mathbf V = \begin{bmatrix} \mathbf v_1^T \newline \mathbf v_2^T \end{bmatrix}$ 的话，那么，长轴方向就是 $\mathbf v_1$，短轴就是 $\mathbf v_2$

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/26_23_32_26_20241126233225.png" width="50%"/>

椭圆越大，证明这个二次型越平缓。
#### What Do We Want?

- 对于内部而言，应该是 $\lambda_1, \lambda_2$ 都很小——都不怎么增加
- 对于边缘而言，应该是 $\lambda_1$ 很小，$\lambda_2$ 比较大——只有于边缘的方向可以有效改变
- 对于边角而言，应该是 $\lambda_1, \lambda_2$ 差不多——若干个都可以有效改变

因此，我们令 

$$
R = \det \mathbf M - k (\operatorname{trace} \mathbf M)^2
$$

理论上，令 $\lambda_2 = \mu \lambda_1$:

$$
R = (\mu - k (\mu+1)^2) \lambda_1 ^ 2 
$$
$k$ 越大，对边缘的抑制效果就越强

> [!example]
> 
> 我们这里做一个实验（令 $k = 0.05$）：
> 
> - 假设 $\lambda_1 = \lambda_2 = 1$，那么 $R = 1 - 0.05 * (1 + 1) ^ 2 = 0.8$
> - 假设 $\lambda_1 = 1, \lambda_2 = 5$，那么 $R = 5 - 0.05 * (1 + 5) ^ 2 = 3.2$
> - 假设 $\lambda_1 = \lambda_2 = 5$，那么 $R = 25 - 0.05 * (5 + 5) ^ 2 = 20$
> 
> 这显然是很有区分度的

#### Algorithm

1. 用 sliding window 遍历所有点（也许除了图片边缘的），求出这些点的 $R$
2. 将所有 $R > \text{threshold}$ 的点找出来
3. 应用非极大值抑制

#### Invariance of Harris Algorithm

我们需要保证 feature 具有以下的不变性：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_0_29_8_20241127002907.png"/>

显然，旋转只会改变椭圆的方向，但是不怎么会改变两个轴的大小

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_0_49_22_20241127004922.png"/>

显然，如果

- 加上 $b$，那么点的二次型都不应该发生变化，从而完全没有影响
- 乘以 $a$，那么，该是最大值的，还是最大值。但是
	- 如果 $a > 1$ 的话，有些本来不会被选中的，就被选中了
	- 反之，如果 $a < 1$，有些本来会被选中的，就选不中了

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_0_55_13_20241127005513.png"/>

> [!warning]+ Problem: Non-Invariance on Scale
>
> Harris corner detection **不具有尺度不变性**。如果**尺寸变小，但是窗口没变小**，那么**原本被识别为 edge 的部分，就可能被识别为 corner**（如下图）。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_0_57_45_20241127005744.png"/>
> 
> 如何进行 evaluation？我们找出两张图片所有的特征点。如果两个特征点在 $\epsilon$ 之内（当然是缩放之后的），那么就认为是同一个特征点。
> 
> 最后，设置这样的 metric：所有**配对的特征点**的数量占所有特征点的数量的百分比。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_1_1_25_20241127010125.png"/>
> 
> 如上图，如果进行缩放，那么 metric 会断崖式下降
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_1_33_15_20241127013315.png"/>
> 
> 如上图，如果进行旋转，那么 metric 基本不变

### Scale-Invariant Methods

最大的问题就是 scale 会有变。因此，我们就需要设法构造出一种 scale 上不变的特征。

设想，如果用不同尺度的窗口来计算每一个点的 $R$，那么对于每一个尺度的每一个点，都可以绘制该点的 $R$ 和窗口大小之间的关系。对于场景中同一个点，但是位于不同尺度的情况，就有下图的情况：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_9_17_44_20241127091744.png"/>

如图：右边的 image 是左边缩放 1/2。那么，右边使用相对左边大小为一半的窗口时，应该能够得到和左边一样的 $R$。

---

此外，我们希望对于任何一处我们希望检测出来的特征，其值随着检测窗口的大小而变化的时候，最好是有且只有**一个尖峰**（如下图，图 1 没有尖峰，图 2 有多个尖峰，图 3 是最好的）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_9_19_41_20241127091941.png"/>

#### Laplacian of Gaussian (LoG)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_10_51_9_20241127105109.png" width="50%"/>

**注意**：

- 两个公式中的 $F$ 是不一样的
	- 第一个是 Harris function
	- 第二个是 Laplacian of Gaussian
- 这个因为，作者在实践中发现
	- Harris 对于每一层的 edge 识别，还是很好的；但是
		- "The remaining problem is scale selection. During our experiments we noticed that **the adapted Harris function rarely attains maxima in 3D space**. If too few points are detected, the image representation is not robust."
		- 也就是说，如果一个 Harris function 在一个 scale 的图像上是 maxima，它往往在相邻 scale 中不是 maxima，导致这个点选不了，从而导致最后选出的点太少了
	- 因此，对于 scale selection 上面，我们使用 Laplacian 进行 scale selection

**算法流程**：

 1. 我们分别在不同尺度上，进行 Harris edge detection，找出每个尺度的特征点。这些点称为 candidate points
 2. 对不同尺度的图像，分别进行 Laplacian of Gaussian 变换
 3. 最后，对于一个尺度上的 candidate points，
	 1. 我们使用每一个点的坐标
	 2. 找到该尺度、小一级尺度、大一级尺度上这个坐标对应的 LoG 值
	 3. 如果该尺度的 LoG 值大于相邻两个尺度的 LoG 值，那么这个 candidate point 就正式成为 feature point（同时，在可视化的时候，除了在图中标出这个 feature point 的位置以外，还要加一个半径，用于可视化这个 feature point 所处的尺度）

> [!example]+ Example
> 
> 如图，经过第一步之后，可以得到第一行的可视化结果——可以发现，特征太多了
> 
> 经过 2、3 步之后，就是第二行的可视化结果——可以发现，LoG 不是 local maximum 的特征都被 abandon 了
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_10_26_8_20241127102607.png"/>

#### Difference of Gaussian (DoG)

还有另一种 scale invariant 的形式，就是 difference of Gaussian.

$$
\begin{aligned}
& \left| I(x) \ast {\frac {1}{2 k^{n-1}\sigma \pi}}\exp \left(-{\frac {1}{2}}{\frac {x^{2} + y^2}{(k^{n-1}\sigma) ^{2}}}\right) - I(x) \ast {\frac {1}{2 k^n\sigma \pi}}\exp \left(-{\frac {1}{2}}{\frac {x^{2} + y^2}{k^n\sigma ^{2}}}\right) \right|
\end{aligned}
$$

- 其中，$n$ 就是当前 scale 的等级，$k$ 是每 scale 一级的缩放倍数
- 另外注意绝对值

我们往往直接将 diff of Gaussian 既当成每一个 scale 内部 candidate point selection，同时也当成了 scale selection 的函数。这就是经典 SIFT 方法。

当然，由于 scale 选取 candidate point，**vanilla** difference of Gaussian 肯定远远比不上 Harris 算法。 因此我们还得打补丁：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_11_47_47_20241127114747.png"/>

- 对于 Harris 而言，我们先 Gaussian 卷积一遍，然后一阶导来一遍，求出来 local maximum。然后将低于下界的去掉
- 对于 DoG + 补丁而言，我们先 Gaussian 卷积+差分一遍，求出来 local maximum，然后将低于下界的去掉。然后算出来 $\mathbf H$ 这个二阶导，再算出来 Tr/Det，然后再将高于这个上界的又去掉
	- Tr/Det 这种打补丁的思路，其实和 Harris 的异曲同工

#### Performance Comparison

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/27_12_9_41_20241127120941.png"/>

### Affine Invariant Detection

除了旋转、平移以及缩放，还可能存在剪切。

比如说，如果正对着一个长方体，那么正对着的这个面，就是一个长方形；如果偏了一些，那么就可能变成平行四边形。

此时就要用到 Laplacian of Gaussian with Harris 的进化版——Harris affine region detector（此处不介绍）

## Feature Descriptor

### SIFT

SIFT feature descriptor，本质上就是 DoG 加上各种去噪的方法。下面是 SIFT 的流水线：

#### 制造特征

首先，我们找出所有的 SIFT key points:

1. 算出其中所有像素的 DoG，使用非极大值抑制，得到所有 local extremum。它们目前是 candidate key points
2. 然后，对于每一个 local extremum 所处的位置（i.e. $(x, y, \sigma)$ 三元组），我们进行 Taylor expansion: $f(\mathbf x) = D(\mathbf {x_0}) + \frac {\partial D(\mathbf {x_0})} {\partial \mathbf {x_0}} \mathbf {x} + \frac 1 2 \mathbf {x}^T \frac {\partial^2 D(\mathbf {x})} {\partial \mathbf {x}^2} \mathbf {x}$
	- 其中，$\mathbf{x_0}$ 就是 local extremum 所处的位置
	- $\mathbf x$ 是偏移量
3. 对 $f(\mathbf x)$ 求最大值点 $\hat {\mathbf x}$（可以直接准确求解），如果 $\hat {\mathbf x}$ 任何一个维度的绝对值大于 0.5，那么就说明目前的 local extremum 不是真的，需要向那个维度移动相应的距离
4. 如果 $\hat {\mathbf x}$ 所有维度的绝对值小于 0.5，那么进一步求出 $f(\hat {\mathbf x})$。如果 $|f(\hat {\mathbf x})|$ 小于 threshold (一般设为 0.03)，那么就说明这一个特征的**区分度太差（i.e. Difference of Gaussian 中的 difference 太小）**，我们就丢弃这个特征
5. 如果 $|f(\hat {\mathbf x})|$ 大于 threshold，那么继续求 Hessian 矩阵 $\mathbf H = \begin{bmatrix} D_{xx} & D_{xy} \newline D_{xy} & D_{yy} \end{bmatrix}$。进一步求出其 $\frac {\operatorname{tr}(\mathbf H)^2} {\det \mathbf H}$
	- 如何设置这个的 threshold？由于我们的目的是检测这个特征是否**是边而不是角落**，因此假设是边的话，两个特征值 $\alpha, \beta$ 之间差距就会很大，不妨假设 $\alpha = r \beta$ ($r \geq 1$)
	- 那么：$\frac {\operatorname{tr}(\mathbf H)^2} {\det \mathbf H} = (\alpha + \beta) / \alpha \beta = (1+r)^2 / r = r + 1/r+2$
		- 单调递增
	- 因此，设置这个 $r$ 就好了。一个好的建议是设置成 $r=10$
6. 如果 $\frac {\operatorname{tr}(\mathbf H)^2} {\det \mathbf H} > \text{threshold}$，那么这个 candidate key point 就晋升为 key point

之后，正式开始通过这些 key point 计算 SIFT 特征。

我们用 DoG 找到 key points，但是给每个点求最终**特征**的时候，用的是 Gradient of Gaussian。

$$
\begin{aligned}
m(x,y)&=\sqrt{(L(x+1,y)-L(x-1,y))^2+(L(x,y+1)-L(x,y-1))^2}\newline
\theta(x,y)&=\tan^{-1}((L(x,y+1)-L(x,y-1))/(L(x+1,y)-L(x-1,y)))
\end{aligned}
$$

如上图，对于每一层而言，$L$ 就是经过**该层的 Gaussian** 平滑处理后的图片，然后就通过差分法，近似出来梯度的大小和方向

最后，通过这些 key point 的 GoG 特征，求出 SIFT 特征。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/29_4_24_45_20241129042445.png"/>

如图，对于每一个 key point，我们用其相邻的 16x16 blocks 来计算

- 将其分成 16 个 4x4 block
- 对于每一个 4x4 block，根据每个点特征向量的
	- 方向来决定 bin
	- 大小来决定 bin 的增量
	- 从而求出每个 4x4 block 的特征
		- 由于有 8 个 bins，因此有一个 4x4 block 的特征 8 个维度
- 因此，由于 16x16 个 block 含有 16 个 4x4 blocks，因此整个 16x16 block 的特征就是 8x16 =  128 维（图中是 8x8 block，因此只有 32 维）

**注意**：

1. key point 周围的 block 如何采样，i.e. 这个 16x16 block 需要根据 key point 的方向而旋转吗？是的，需要。这个 16x16 的 block 的方向需要和这个 key point 的方向一致
2. 其次，由于 key point 的方向任意，因此这个 16x16 block 肯定和图片像素无法对齐
	- **解决方法**：很简单，线性插值就行
