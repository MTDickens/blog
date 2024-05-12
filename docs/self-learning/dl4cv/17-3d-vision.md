[TOC]

# Two Basic Problems

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_21_24_45_202405122124552.png" alt="image-20240512212440459" style="zoom: 50%;" />

# Shape Representations

主要有 5 种表示 3d 形状的方式。

## depth map

就是每一个像素点对应一个深度。

- 但是，由于表现能力非常有限（比如被遮挡的物体就表现不出来），所以有时被称为 2.5 D

---

就像 semantic segmentation 一样，我们可以通过一个非常类似的 CNN 结构，来预测深度。

- 不过，由于本次做的是回归而不是分类，因此最终结果只需要 $C_{out} = 1$ 即可
- 损失函数就是 $L^2$-逐像素损失

---

**问题：**由于 depth ambiguity（也就是远处的大物体，和近处的小物体，本质上没有区别），因此一张图片，我们只能够判断出相对的距离（比如 A 物体是 B 物体的 2 倍远），而绝对的距离（比如 A 物体是 1m，B 物体是 2m）是判断不出的。

**解决方法：**使用 scale-invariant loss
$$
\begin{align}
D(y,y^\ast) &= \frac 1 {2n^2}\sum_{i,j}((\log y_i - \log y_j) - (\log y_i^\ast - \log y_j^\ast ))^2 \tag{2} \\
&= \frac 1 n \sum_i d_i^2 - \frac 1 {n^2} \sum_{i,j} d_i d_j = \frac 1 n \sum_i d_i^2 - \frac 1 {n^2} \left(\sum_{i} d_i \right)^2 \tag{3}
\end{align}
$$
具体推导过程如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_23_40_21_202405122340533.png" style="zoom:50%;" />

这个公式有三种解释：

1. $D(y,y^\ast;\alpha)$：找到合适的 $\alpha$，从而将 $y$ 翻 $e^\alpha$ 倍之后，可以最小化损失
2. $(2)$：损失不再是 $L^2$，而是比较所有两点之间的 ground truth diff 和 predicted diff 之间的差别
3. $(3)$：损失就是 $L^2$ 外加一个 $- \frac 1 {n^2} \sum_{i,j} d_i d_j$，如果 $d_i, d_j$ 都是 same direction 的，那么就可以减小误差

## normal(法线) grid

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_0_8_11_202405130008184.png" alt="image-20240513000807071" style="zoom:40%;" />

## voxel grid

上面的缺点：无法**完整**地表示出上面的东西。

下面的 voxel grid，则可以以 3d 的形式表现出来：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_1_31_12_202405130131958.png" alt="image-20240513013109670" style="zoom:33%;" />

- 和 segmentation mask 有点像（如果空间中某方块是物体的一部分，就为 1，否则为 0，当然也可以是一个 [0, 1] 之间的小数，表示占据的空间）

---

优点就是：起码不是 2.5D 了

缺点在于：

- 需要很高的 spatial resolution，才能 capture fine structures
- 但是，这样做会非常 computationally expensive
    - 3d 比 2d 还要多一维，因此计算成本增长更快

### Convolution on 3D pictures

如果要在 3D 上进行卷积，也很简单。将卷积核变成 3D 的就行。其它都不变。

### Convert 2D to 3D

如下图，这是最 naive 的做法。缺点就是过于 computationally expensive（主要是后面的 deconvolution，因为用到了 3D 核，因此计算量很大）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_1_50_12_202405130150678.png" alt="image-20240513015008922" style="zoom: 33%;" />

因此，我们不妨

- 不用 3D deconvolution，而是用 2D deconvolution
- 将 2D deconvolution 最后输出的 feature dimension 当成 3D 模型的 depth dimension

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_1_52_26_202405130152202.png" alt="image-20240513015223261" style="zoom:33%;" />

当然，这样做也有缺点，如下：

#### Drawback: Loss of Translational Invariance

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_15_42_202405130215928.png" alt="img" style="zoom: 50%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_15_52_202405130215797.png" alt="img" style="zoom:50%;" />

如上图，一个 2D 图像使用 2D convolution filter。从左图到右图，特征从左下角平移到了左上角，但是卷积核的**局部性**成功地将这个特征记录了下来。

假设我们不是生成 3D voxels，而是使用 2D-multi-channel-CNN 来处理 3D voxel。这样会使得卷积核失去在 z 轴上的“平移不变性”

- 因为 2D-multi-channel-CNN 卷积的时候，处理的是**局部的** x,y 轴以及**全部的** z 轴。
- 只要特征在 z 轴上进行了一点平移，对应的 convolution filter 就不一样了
- 但是特征在 x,y 轴上进行平移，对应的 convolution filter 仍然是一样的

对于生成 3D voxel，也是类似的。如果 3D 图像在 z 轴上有平移，那么 deconvolution 就是让另一个 **de**convolution filter 去完成。而两者的参数很可能是很不一样的。

### Drawback: Memory Usage

设想使用 1024x1024x1024，那么就要用到 4GB（如果使用的是 float32）的内存。

## Scaling Voxels

### Voxel Oct-Tree

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_29_25_202405130229825.png" alt="image-20240513022922568" style="zoom:50%;" />

如图，我们先获得一个 (sparse) 32 resolution 的 voxel grid，然后通过 "turn on some cells" 的方式，来获得更高精度的 voxel grid。

- 当然，implementation is non-trivial

### Nested Shape Layer

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_31_35_202405130231052.png" alt="image-20240513023107723" style="zoom:33%;" />

如图，我们从粗糙到精细，一加一减，逐渐精细化。

## Implicit Surface

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_42_38_202405130242485.png" alt="image-20240513024234821" style="zoom:33%;" />

## Point Cloud

### Categorize

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_4_33_35_202405130433400.png" alt="image-20240513043328681" style="zoom:40%;" />

### Predict

我们使用 Chamfer loss: $d_{CD}(S_1,S_2) = \sum_{x \in S_1} \min_{y \in S_2} d(x,y) + \sum_{y \in S_2} \min_{x \in S_1} d(x,y)$​

- 也就是：对于每一个点，找另一个点云中具体它最近的点

至于生成，就用下面的：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_4_38_40_202405130438138.png" alt="image-20240513043836063" style="zoom: 33%;" />

## Mesh

好处：

- 图形学标配
- 显示表示（而非 implicit surface 中的隐式表示）
- Adaptive
- 很容易为每一个顶点添加附加信息，然后通过插值来填充整个平面

坏处：不容易在神经网络上处理。

***TODO: Start from https://youtu.be/S1_nCdLUQQ8?list=PL5-TkQAfAZFbzxjBHtzdVCWE0Zbhomg7r&t=2840***
