
## Two Basic Problems

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_21_24_45_202405122124552.png" alt="image-20240512212440459" style="zoom: 50%;" />

## Shape Representations

主要有 5 种表示 3d 形状的方式。

### depth map

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
D(y,y^\ast) = \frac 1 {2n^2}\sum_{i,j}((\log y_i - \log y_j) - (\log y_i^\ast - \log y_j^\ast ))^2 \tag{2} \newline 
= \frac 1 n \sum_i d_i^2 - \frac 1 {n^2} \sum_{i,j} d_i d_j = \frac 1 n \sum_i d_i^2 - \frac 1 {n^2} \left(\sum_{i} d_i \right)^2 \tag{3}
\end{align}
$$
具体推导过程如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_23_40_21_202405122340533.png" style="zoom:50%;" />

这个公式有三种解释：

1. $D(y,y^\ast;\alpha)$：找到合适的 $\alpha$，从而将 $y$ 翻 $e^\alpha$ 倍之后，可以最小化损失
2. $(2)$：损失不再是 $L^2$，而是比较所有两点之间的 ground truth diff 和 predicted diff 之间的差别
3. $(3)$：损失就是 $L^2$ 外加一个 $- \frac 1 {n^2} \sum_{i,j} d_i d_j$，如果 $d_i, d_j$ 都是 same direction 的，那么就可以减小误差

### normal(法线) grid

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_0_8_11_202405130008184.png" alt="image-20240513000807071" style="zoom:40%;" />

### voxel grid

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

#### Convolution on 3D pictures

如果要在 3D 上进行卷积，也很简单。将卷积核变成 3D 的就行。其它都不变。

#### Convert 2D to 3D

如下图，这是最 naive 的做法。缺点就是过于 computationally expensive（主要是后面的 deconvolution，因为用到了 3D 核，因此计算量很大）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_1_50_12_202405130150678.png" alt="image-20240513015008922" style="zoom: 33%;" />

因此，我们不妨

- 不用 3D deconvolution，而是用 2D deconvolution
- 将 2D deconvolution 最后输出的 feature dimension 当成 3D 模型的 depth dimension

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_1_52_26_202405130152202.png" alt="image-20240513015223261" style="zoom:33%;" />

当然，这样做也有缺点，如下：

##### Drawback: Loss of Translational Invariance

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_15_42_202405130215928.png" alt="img" style="zoom: 50%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_15_52_202405130215797.png" alt="img" style="zoom:50%;" />

如上图，一个 2D 图像使用 2D convolution filter。从左图到右图，特征从左下角平移到了左上角，但是卷积核的**局部性**成功地将这个特征记录了下来。

假设我们不是生成 3D voxels，而是使用 2D-multi-channel-CNN 来处理 3D voxel。这样会使得卷积核失去在 z 轴上的“平移不变性”

- 因为 2D-multi-channel-CNN 卷积的时候，处理的是**局部的** x,y 轴以及**全部的** z 轴。
- 只要特征在 z 轴上进行了一点平移，对应的 convolution filter 就不一样了
- 但是特征在 x,y 轴上进行平移，对应的 convolution filter 仍然是一样的

对于生成 3D voxel，也是类似的。如果 3D 图像在 z 轴上有平移，那么 deconvolution 就是让另一个 **de**convolution filter 去完成。而两者的参数很可能是很不一样的。

#### Drawback: Memory Usage

设想使用 1024x1024x1024，那么就要用到 4GB（如果使用的是 float32）的内存。

### Scaling Voxels

#### Voxel Oct-Tree

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_29_25_202405130229825.png" alt="image-20240513022922568" style="zoom:50%;" />

如图，我们先获得一个 (sparse) 32 resolution 的 voxel grid，然后通过 "turn on some cells" 的方式，来获得更高精度的 voxel grid。

- 当然，implementation is non-trivial

#### Nested Shape Layer

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_31_35_202405130231052.png" alt="image-20240513023107723" style="zoom:33%;" />

如图，我们从粗糙到精细，一加一减，逐渐精细化。

### Implicit Surface

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_2_42_38_202405130242485.png" alt="image-20240513024234821" style="zoom:33%;" />

### Point Cloud

#### Categorize

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_4_33_35_202405130433400.png" alt="image-20240513043328681" style="zoom:40%;" />

#### Predict

我们使用 Chamfer loss: $d_{CD}(S_1,S_2) = \sum_{x \in S_1} \min_{y \in S_2} d(x,y) + \sum_{y \in S_2} \min_{x \in S_1} d(x,y)$​

- 也就是：对于每一个点，找另一个点云中具体它最近的点

至于生成，就用下面的：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/13_4_38_40_202405130438138.png" alt="image-20240513043836063" style="zoom: 33%;" />

### Mesh

好处：

- 图形学标配
- 显示表示（而非 implicit surface 中的隐式表示）
- Adaptive
- 很容易为每一个顶点添加附加信息，然后通过插值来填充整个平面

坏处：不容易在神经网络上处理。

下面，介绍一种 pixel2mesh 的方法：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_7_46_26_202405140746980.png" alt="image-20240514074621988" style="zoom: 50%;" />

核心步骤是：

1. 将椭圆形的 mesh (i.e. initial value) 逐渐 deform 成期望的形状，然后再进行细化（具体可以参考图形学上的[细化](../GAMES101/12-Geometry.md#mesh-subdivision-upsampling)）
2. 如何进行 deform？还是使用 CNN，只不过这一次的 reception field 是 adjacent vertices：对于 vertex i，$f'_i = W_0 f_i + \sum_{j \text{ adjacent to }i} W_1 f_j$
3. 如何把 2D 图片的信息引入？我们设定一个 camera angle，将 3D 图像投影到 2D 平面上去。具体来说，就是把 3D 的每一个 vertex 投影到某一个卷积层上去，同时采用 bilinear interpolation 的方式，将卷积层上的 feature vector 附加到 vertex i 上
    <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_8_0_22_202405140800954.png" alt="image-20240514080019700" style="zoom:50%;" />
4. 我们在 predicted meshes 中进行随机取点，然后将这些点和 ground truth meshes 上随机取的点，通过 Chamfer distance 来计算出来 loss

**难点：**

1. 由于 predicted mesh 会发生变化，因此必须 online sampling，如何减少运算量是关键
2. 如何反向传播梯度也是一个问题

这两个问题均在 [smith-19](https://arxiv.org/pdf/1901.11461) 中得到解决（尤其是第二个问题）。

## Comparing Shapes

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_8_29_48_202405140829592.png" alt="image-20240514082944189" style="zoom: 33%;" />

上图是 F1@t score。简单来说，就是计算多少比例的 predicted points and ground truth points 被对方包住。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_8_34_15_202405140834187.png" alt="image-20240514083411052" style="zoom:33%;" />

上图是三种方式的对比。可见：

- IoU 极其粗糙，因为完全无法 capture fine structures
- Chamfer Distance 对**离群点**非常敏感
    - 比如上图中，第二个椅子和第三个椅子相比第一个椅子”犯的错的是一样的“，但是 Chamfer Distance 却不同，这是不应该的
- F1 score 就很好地考虑到了这一点：只要距离在 t 以内就算，在 t 以外就不算。从而两张椅子的误差是一样的，符合直觉。
    - 缺点是有一个超参数

## Camera System

给定一个 2D 图片，希望你 predict 一个 3D 模型。然后，我们拿这个 prediction 和 ground truth 3D shape 进行对比。

但是，两个 3D shape 进行对比，必须以某一个视角来对比（i.e. 相同的 3D 模型，如果视角不同，之间的 distance 会很大）。那么，我们应该用什么视角呢？

- 这里，我们用到的视角，就决定了训练后的模型，根据 2D 图片生成的 3D 模型的视角

---

第一种，canonical coordinates，比如 +Z 轴。

第二种，view coordinates，也就是通过 2D 图片+CNN 来预测视角，然后将 3D 模型变换对应视角去。

在实际中，我们一般使用第二种，因为生成的模型与对应的 2D 图片是”对齐“的，从而泛化能力更强（具体原理我还没来得及了解）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_9_24_14_202405140924296.png" alt="image-20240514092409931" style="zoom:50%;" />

## Dataset

主要有 ShapeNet 和 Pix3D。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_9_39_40_202405140939929.png" alt="image-20240514093937971" style="zoom:50%;" />

后者是通过 IKEA 的家具的 mesh 模型以及 Google 上搜到的买家评论制成的，实际中比前者更好。

## Example: Mesh R-CNN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_9_41_53_202405140941794.png" alt="image-20240514094150839" style="zoom:50%;" />

如上图，通过 Mask R-CNN 预处理，然后通过这一些被标注了类别以及分割过的图像，进一步生成 3D mesh。

但是，由于使用橄榄球形的初始 mesh 生成最终 mesh 的时候，不能够改变模型的拓扑结构。因此，naive method 无法生成亏格大于 0 的模型（简单的例子：茶壶）。

因此，作者采用了间接的形式：

1. 生成 voxels
2. 通过 voxels 生成 initial meshes
    - 带有亏格
3. 通过 initial meshes，经过 iterative refinement，生成 predicted (final) meshes

同时，我们在边上也加上一个 L2 regularizer，从而避免点与点之间不构成三角形：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_9_59_21_202405140959659.png" alt="image-20240514095918584" style="zoom:50%;" />

### Failure Modes

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/14_9_59_55_202405140959932.png" alt="image-20240514095952092" style="zoom:50%;" />

如上图，bookcase 的 2D segmentation fails, so does 3D prediction。因此，作者猜测，3D prediction 的准确性，可能和 2D segmentation 有关。
