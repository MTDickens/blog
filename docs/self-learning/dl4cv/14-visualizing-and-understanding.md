## Recall: Visualization

在 CNN 中，对于一个 3 层的 filter，我们可以用 RGB 来 visualize 这个 filter，如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/27_22_14_26_202404272214718.png" alt="image-20240427221425701" style="zoom: 33%;" />

但是，对于多层的 filter，我们就只能用灰度图来 visualize filter 的每一层，如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/27_22_15_5_202404272215868.png" alt="image-20240427221503160" style="zoom:50%;" />

**注：**20x16x7x7 的意思是：

- 一共有 20 个 filter
    - 输出有 20 层
- 每个 filter 有 16 层
    - 输入有 16 层
- 每个 filter 的大小为 7x7

## Recall: Nearest Neighbors

如果我们在 pixel space 中寻找 nearest neighbors，那么往往会找出类型完全不一样，但是 pixel 类似的图片。这不是我们想要的。

如果我们同样应用最近邻算法，但是是在 feature vector 上（比如 AlexNet 的 FC7 layer 的 4096 个输出），就可以得到在 feature space 而不是 pixel space 下最相似的图片，而这正是我们想要的。

## Dimensionality Reduction

可以通过

- PCA
- t-SNE

的方式将 4096 维降至 2 维。

![Madhu Sanjeevi on X: "PCA vs TSNE on MNIST. MNIST is probably one of first  datasets to check the effectiveness of algorithms, ideas we build in DL  research. I just wanna give](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_14_49_202404281014703.jpeg)

更形象地，如果将原始图片放在每一个点上（左图是 t-SNE，右图是在左图的基础上，每一个点都用其 nearest neighbor 填充），就可以得到一个相似图片放在相似位置的图：

![img](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_21_19_202404281021316.jpeg)![img](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_21_23_202404281021437.jpeg)

## Visualizing Activations

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_32_33_202404281032089.png" alt="image-20240428103230220" style="zoom: 25%;" />

如图，通过灰度图来表示 256 个 13x13 的 activation。

- 可能由于 ReLU 或者需要将数值压到 0\~256 之间，绝大部分的地方是黑的。因此非黑的地方就是（该图片）重要的特征。

### Maximally Activating Patches

我们可以找出所有图片中，对某个神经元激活值最高的那些图片，从而得知这个神经元具体在理解哪些信息。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_39_5_202404281039233.png" alt="image-20240428103858124" style="zoom: 33%;" />

比如，第一行主要就是理解 dog eyes，等等。

## Which Pixels Matter?

### Saliency via Occlusion

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_40_20_202404281040377.png" alt="image-20240428104017185" style="zoom:50%;" />

遮蔽部分像素，然后测试。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_42_38_202404281042735.png" alt="image-20240428104234960" style="zoom: 33%;" />

也可以逐个位置进行遮蔽，然后测试遮蔽后的图像分类的 confidence 的下降，从而：下降越多，说明像素越重要。

- 注意：由于需要每一个像素分别进行遮蔽，因此计算代价高

### Saliency via Backprop

**每一个像素关于该图片的类别的得分的导数**（或者说，该图片的类别的得分关于原图片的梯度），可以反映：对原图片某个像素进行修改，图片类别的得分的增减。增加越多，就说明该像素越重要。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_10_50_37_202404281050033.png" alt="image-20240428105031959" style="zoom: 33%;" />

- 注意：这个方法并不总是好用，上面的图片只是恰好比较好用而已。

### Salient Map Application: Segmentation without Supervision

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_11_5_14_202404281105370.png" alt="image-20240428110505589" style="zoom: 33%;" />

在 salient map 的基础上，通过 GrabCut 的方式进行 unsupervised segmentation。

### Saliency via Guided Backprop

想法很简单：正向传播的时候，ReLU 会把小于 0 的值变成 0，从而反向传播的时候，这些反向的梯度也会被变成 0。我们在这里额外再加一个 mask，就是**在 ReLU 的基础上，把反向小于 0 的梯度，也抹去**。

- 也许看起来没什么道理，但是效果确实好

## Gradient Ascent

### Generate From Scratch

步骤：

1. 选定一个类别
2. 初始化一张空白图片（全 0）
3. 求这张图片关于这个类别的梯度，并进行 gradient ascend，从而得以提升这个类别的分数
4. 不断重复，直到分数足够高

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_11_25_28_202404281125901.png" alt="image-20240428112519334" style="zoom: 50%;" />

如下图，使用 L2 regularizer，我们通过梯度上升求：

$$
\arg \max_I Score_c(I) - \lambda \norm{I}_2^2
$$

从而得到以上的图片。可以看出，图片虽然混乱，但是已经有了所属类别的雏形。

- 当然，通过一些 hack on regularizers，我们可以得到更加 realistic 的图片。

### Adversarial Examples

假如我们不从空白图开始，而是从某张**其它类别的图片**开始，然后通过梯度上升的方式，来制造出 adversarial sample。如下图：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_11_29_48_202404281129320.png" alt="image-20240428112945636" style="zoom:50%;" />

### Amplifying Existing Features

我们可以通过**将某一层的 activation 当作该层的梯度**，然后反向传播至图片并进行修改，从而**倍增这一层的 activation**。

- 其实，“将某一层的 activation 当作该层的梯度”，等价于“计算该层的 L2-norm，然后反向传播梯度”
- 因此，本质上，我们目标就是最大化某一层的 L2-norm

---

反复操作，可以让这一层的 activation 近似等比例地放大任意倍。也就相当于将原图片在该层表现出的 feature 放大任意倍。

- 如果目标层是浅层，那么放大的 feature 就是 edge 等等
- 如果目标层是深层，那么方法的 feature 就可能是更加抽象的物体，比如人类、动物、车辆等等

## Feature Inversion

目标：Given a CNN **feature vector** for an image, find a new image that:

1. Matches the given feature vector
2. "looks natural" (image prior regularization)

也就是：

$$
\mathrm x^\ast = \mathop{\arg \min}_{x \in \mathbb R^{H\times W\times C}} \ell(\Phi(\mathrm x), \Phi_0) + \lambda \mathcal R(\mathrm x)
$$

- $\ell(\mathrm x,\mathrm y)=\norm{x-y}^2$
- $\Phi(\mathrm x)$ 就是图片 $\mathrm x$ 的 feature vector
- $\Phi_0$ 就是目标 feature vector

然后，我们使用 total variation regularizer，以保证 spatial smoothness: 

- $\mathcal R_{V^\beta}(\mathrm x)=\sum_{i,j}((x_{i,j+1}-x_{i,j})^2 + (x_{i+1,j}-x_{i,j})^2)^{\frac \beta 2}$

---

例子：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_12_10_1_202404281210863.png" alt="image-20240428120954634" style="zoom: 33%;" />

如图，使用 VGG16 网络，对于浅层的 feature vector，大部分信息依然保存——难以找到另一张更加平滑的图片，使得该平滑图片的 feature vector 和原图片的 feature vector 相似。

而对于深层的 feature vector，我们容易找到另一张更加平滑的图片，使得该平滑图片的 feature vector 和原图片的 feature vector 相似。也就是说，更多的信息在这些深层 vector 中消失了。

## Textures

Feature 可以认为是某一层的输出 (C &times; H &times; W) 中的 H &times; W，而 texture 则是这些 H &times; W 之间的 covariance matrix (又称 **Gram matrix**)。

- 直观来说：texture 就是 feature 之间的关系

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_13_14_52_202404281314387.png" alt="image-20240428131446571" style="zoom: 33%;" />

### Neural Texture Synthesis

我们可以通过以下的方式，计算两张图片之间 texture 的相似程度：

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240428131557394.png" alt="image-20240428131557394" style="zoom: 33%;" />

其中，

- $l$ 是层数。对于 texture，我们一般情况下，会考虑多个层
    - 直观来说：边界、线条的使用也是 texture 的一部分
- $G_{ij}^l$ 指的是：第 $l$ 层的第 $i$ 个和第 $j$ 个 output matrix 之间的 covariance。这是一个标量。

#### Example

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240428132210740.png" alt="image-20240428132210740" style="zoom:50%;" />

如果只考虑其中一层的话，我们可以重建出如上图所示的图片。可以看出，每一层都代表着不同的风格。浅层的风格更加抽象，深层的风格更加具体。

### Neural Style Transfer

通过结合 texture synthesis 和 feature inversion，可以自然地进行风格迁移。

使得生成的图片同时能够 consider Gram matrix of one, and feature vector of the other。

- 注意：虽然浅层的 feature vector 一般只**表现** edges 等简单的 feature，但是它们**携带**了足够多的信息。因此，层数越浅，feature inverse 得到的就和原始图片越一致。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_13_33_30_202404281333802.png" alt="image-20240428133326652" style="zoom: 25%;" />

---

由于反向求梯度一般比较慢，因此我们可以通过下面的方式训练一个 FFN。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_13_38_56_202404281338581.png" alt="image-20240428133853458" style="zoom: 25%;" />

---

还可以不同风格训练出不同的 $\gamma_s, \beta_s$，然后可以进行风格切换甚至混合。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/28_13_42_54_202404281342921.png" alt="image-20240428134251993" style="zoom:25%;" />