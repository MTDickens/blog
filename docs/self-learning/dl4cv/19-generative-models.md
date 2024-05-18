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