# Unsupervised Learning

Supervised Learning: given $D \sim \mathcal{X \times Y}$,  learn a function $f: \mathcal X \to \mathcal Y$

Unsupervised Learning: given $D \sim \mathcal X$, learn the "intrinsic structure" of $\mathcal X$

后者的例子有很多，比如：

- 聚类：K-clustering
    - 给定一组点，我们可以从中学习**这些点是由哪几个（高斯）概率分布生成的**。其中，聚类的中心就是多元正态概率分布的期望。
- 降维：PCA
    - 给定一组点，从中学习**哪几个维度有最大的信息量**。使用数学的语言，就是
        - 假设 $\mathrm{x = s+n}$，其中 $\mathrm x$ 就是我们取到的点，而 $\mathrm {s,n}$​ 分别是高斯分布和高斯噪声（其中高斯噪声的 covariance matrix 是 identity matrix 的若干倍，i.e. 噪声向量的不同 element 之间独立）
        - 使用 PCA，可以**最大化**互信息 $\mathrm{I(y;s)}$, where $\mathrm{y = W_L^T x}$，i.e. 投影的矩阵
    - 具体详见[Wikipedia](https://en.wikipedia.org/wiki/Principal_component_analysis#PCA_and_information_theory)
- 密度估计：和聚类是类似的，就是由概率分布产生的点反推概率分布
- 自编码器：……

后者的好处就是：由于无类别的数据远多于有类别的数据，因此 supervised learning 需要耗费手工标注的成本，而 unsupervised learning 无需标注。

# Difference Between Models

我们可以将 model 分为 3 类：

- Discriminative Model: $p(y|x)$
- (Unconditional) Generative Model: $p(x)$
- Conditional Generative Model: $p(x|y)$​​

## Discriminative Model

注意到，**同一个样本空间内，概率之间是互相竞争的，如果你多，那么我必须少；反之亦然**。因此，如果使用 $p(y|x)$，就会产生以下的后果：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_22_37_23_202405182237869.png" alt="image-20240518223720141" style="zoom:50%;" />

- 虽然上面两张图片和猫、狗没有任何关系，但是由于 $p(y|x)$ 中，**不同标签之间是竞争关系**，因此，必须有一个标签的概率比较大，即使这个标签对于这张图片而言非常离谱。

## Generative Model

如果采用生成式模型，那么互相竞争的就不是标签，**而是 $\mathrm x$ 本身**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_22_40_6_202405182240767.png" alt="image-20240518224003277" style="zoom:67%;" />

由于图片空间 $\mathcal X$ 远比标签空间 $\mathcal Y$ 复杂、巨大得多，而生成式模型必须完成的任务之一就是：判断**任意两个图片之间出现概率谁打谁小**。因此，生成式模型必须对图片有一个 deep understanding of images。

- e.g. is a dog more likely to sit or stand? How about a 3-legged dog vs 3-armed monkey?

另外，**generative model 实际上是有能力去 reject 一个图片的**。比如说该张图片的出现概率非常低，那么，模型可以认为这张图片就是不正常的图片，从而拒绝。相比之下，discriminative model 并不能拒绝图片，因为所有标签概率之和总是 1。

## Conditional Generative Model

By Bayesian Law:

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_22_53_47_202405182253238.png" alt="image-20240518225343646" style="zoom:33%;" />

如上图，可以通过上述两个模型，加上 $p(y)$（直接统计各标签数量占总标签数量的比例即可），构建 conditional generative model。

- 和 generative model 一样，conditional generative model 可以拒绝一张图片。比如说即使是 $\mathop{\max}_{y \in \mathcal Y} p(x | y)$ 也在 threshold 之下。

## Comparison

最根本的两种模型，就是 discriminative model 以及 generative model。

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240519191445966.png" alt="image-20240519191445966" style="zoom:50%;" />

# Generative Models

Generative model 的目标函数就是：
$$
\prod_i p(x^{(i)}) = \prod_i f(x^{(i)}, W)
$$

- 也就是假设所有样本均独立，然后采用最大似然推断

或者可以转换一下：
$$
W^\ast = \mathop{\arg\max}_{W} \sum_i \log f(x^{(i)}, W)
$$
而对于某个 $x^{(i)} = (x^{(i)}_1, x^{(i)}_2, \dots)$，通过贝叶斯定律，有：
$$
\begin{aligned}
p(x^{(i)}) &= p(x^{(i)}_1, x^{(i)}_2, \dots) \newline
&= \prod_j p(x^{(i)}_j | x^{(i)}_{j-1}, \dots, x^{(i)}_1) \newline
\end{aligned}
$$
而这样的依赖关系，和 RNN 完全一样：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_20_1_18_202405192001674.png" alt="image-20240519200115849" style="zoom:33%;" />

因此，我们可以使用 RNN 来生成这些概率，然后取对数加起来，得到的就是 $\log p(x^{(i)})$

然后，我们将每一张图片都这样做，然后加起来，就得到了 $\prod_i p(x^{(i)})$

## Taxonomy

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_19_19_25_202405191919469.png" alt="image-20240519191919050" style="zoom: 50%;" />

## Autoregressive Model

### Pixel RNN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_19_47_9_202405191947943.png" alt="image-20240519194705448" style="zoom: 33%;" />

Pixel RNN，顾名思义，就是在 Pixel 上使用 RNN。给出依赖关系（i.e. 依赖左侧和上侧的 pixels），就可以像上图一样“泛洪式”地生成。

**缺点：**速度太慢。

### Pixel CNN

另外还有一种 Pixel CNN，也就是 Mask CNN 的一个变种：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_20_15_45_202405192015271.png" alt="image-20240519201540204" style="zoom: 33%;" />

基本想法就是：我们通过多个 resolution-preserving, masked convolution layer，在保持形状的同时（保证最后的输出中，每一个点对应着原始图片的一个点），遮盖住像素的后继（避免该像素看到后面的像素）进行卷积。最后，我们对输出取一个对数，然后将所有输出相加，就得到了这一张图片的“概率”。

当然，这虽然相比 pixel RNN 有所进步，但是其实也并不快。

### Pros and Cons

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_20_22_23_202405192022842.png" alt="image-20240519202220339" style="zoom:50%;" />

当然，还有很多 tricks 可以提升这些 RNN 的效率。

## Autoencoders

Autoencoder 很简单，就是先通过 downsampling 将 vector 压缩，再通过 upsampling 将 vector 还原，然后 loss 就是 original vector 与 output vector 的 L2 metric。

但是，这种 autoencoder 无法判断图片出现的概率，因此不是 generative model。

想让 autoencoder 的变种具有概率推断的能力，就需要让 z 