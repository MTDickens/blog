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

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_17_10_3_202405201710931.png" alt="AutoEncoder (一)-認識與理解- NLP & Speech Recognition Note - Medium" style="zoom: 33%;" />

Autoencoder 很简单，如上图，就是先通过 downsampling 将 vector 压缩，再通过 upsampling 将 vector 还原，然后 loss 就是 original vector 与 output vector 的 L2 metric。

但是，这种 autoencoder 无法判断图片出现的概率，因此不是 generative model。

另外，我们也不能够用它来生成图像。因为 $\mathrm z$​​ 有可能是就是一个高维流形上的一个奇葩分布，如果你通过正态分布啥的来进行采点，很可能会产生 rubbish。

---

因此，我们需要给 $\mathrm {z, x}$ 加上一个约束：假设 $\mathrm {z, x}$ 都是 diagonal-covariance-matrix Gaussian distribution，然后我们通过 encoder ($p_\theta(x|z)$) 来推断 $p(x|z)$​。

可惜：$p_\theta(x) = \int p_\theta(x|z) p(z) \mathrm dz$，这个积分完全是 intractable 的。

因此，考虑贝叶斯公式：$p_\theta(x) = \frac{p_\theta(x|z)p(z)} {p_\theta(z|x)}$。问题在于：我们并不知道 $p_\theta(z|x)$​。

因此，我们决定使用 $q_\theta(z|x)$ 来近似 $p_\theta(z|x)$。

也就是下面的结构：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_17_13_38_202405201713739.png" alt="image-20240520171335813" style="zoom: 33%;" />

然后，我们就可以得出：
$$
p_\theta(x) = \frac {p_\theta(x|z)p(z)} {p_\theta(z|x)} \approx \frac {p_\theta(x|z) p(z)} {q_\phi(z|x)}
$$
然后，我们使用 expectation trick:
$$
\begin{aligned}
\log p_\theta(x) &= \log p_\theta(x) (\int q_\phi(z|x) \mathrm dz) \newline 
&= \int q_\phi(z|x) \log p_\theta(x) \mathrm dz \newline 
&= \mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x)] \newline
&\approx \mathbb E_{z \sim q_\phi(z|x)}\left[\log \frac {p_\theta(x|z) p(z)} {p_\theta(z|x)}\right] \newline
&\approx \mathbb E_{z \sim q_\phi(z|x)}\left[\log \frac {p_\theta(x|z) p(z) q_\phi(z|x)} {p_\theta(z|x) q_\phi(z|x)}\right] \newline
&= \mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z) - \log \frac{p(z)}{q_\phi(z|x)} + \log \frac {q_\phi(z|x)} {p_\theta(z|x)}] \newline
&= \mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z)] - D_{KL} [q_\phi(z|x) \parallel p(z)] + D_{KL} [q_\phi(z|x) \parallel p(z)] \newline
&\geq \mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z)] - D_{KL} [q_\phi(z|x) \parallel p(z)]
\end{aligned}
$$
因此，我们找到了目标：找到这样的 encoder 和 decoder，使之能够最大化 $\mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z)] - D_{KL} [q_\phi(z|x) \parallel p(z)]$。

## VAE

### How To Optimize?

#### KL Divergence

其中，$q_\phi(z|x)$ 由 encoder 给出，而 $p(z)$ 这个 prior 并不是估计，而是我们事先 fix 的一个 Gaussian distribution。

- 一般而言，z 这个高斯分布，我们就设成 $z \sim N(0, I)$。反正不同高斯分布之间就是一个线性变换的关系。

因此：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_17_50_13_202405201750401.png" alt="image-20240520175010546" style="zoom:50%;" />

推导过程：
$$
\begin{aligned}
KL[1, 2] &= \int \left[ \frac{1}{2} \log\frac{|\Sigma_2|}{|\Sigma_1|} - \frac{1}{2} (x-\mu_1)^T\Sigma_1^{-1}(x-\mu_1) + \frac{1}{2} (x-\mu_2)^T\Sigma_2^{-1}(x-\mu_2) \right] \times p(x) dx \\
&= \frac{1}{2} \log\frac{|\Sigma_2|}{|\Sigma_1|} - \frac{1}{2} \text{tr}\ \left\{E[(x - \mu_1)(x - \mu_1)^T] \ \Sigma_1^{-1} \right\} + \frac{1}{2} E[(x - \mu_2)^T \Sigma_2^{-1} (x - \mu_2)] \\
&= \frac{1}{2} \log\frac{|\Sigma_2|}{|\Sigma_1|} - \frac{1}{2} \text{tr}\ \{I_d \} + \frac{1}{2} (\mu_1 - \mu_2)^T \Sigma_2^{-1} (\mu_1 - \mu_2) + \frac{1}{2} \text{tr} \{ \Sigma_2^{-1} \Sigma_1 \} \\
&= \frac{1}{2}\left[\log\frac{|\Sigma_2|}{|\Sigma_1|} - d + \text{tr} \{ \Sigma_2^{-1}\Sigma_1 \} + (\mu_2 - \mu_1)^T \Sigma_2^{-1}(\mu_2 - \mu_1)\right].
\end{aligned}
$$
因此：
$$
\begin{aligned}
-D_{KL}[q_\phi(z|x), p(z)] &= - \frac12 * (-\log \prod \Sigma_{z|x} - J + \sum \Sigma_{z|x} + \sum_i \mu_{z|x}^2) \newline 
&= \frac12 \sum\left[\log (\Sigma_{z|x})_j + J - \sum (\Sigma_{z|x})_j - \sum_i (\mu_{z|x})_j^2)\right]
\end{aligned}
$$

- 和上面略微有些出入，不过无关紧要。第一张图中的 $(\Sigma_{z|x})^2_j$ 可能是因为那张图里的 $\Sigma_{z|x}$ 是标准差而不是方差。

---

另外，$p(z)$ 其实可以不同，而且也是一个活跃的研究领域：比如说，可以通过 Bernoulli distribution 完成分类，通过 Laplacian distribution 实现 sparsity 等等。当然，我们选择的函数，必须要容易计算

- 比如 Gaussian 就是一个性质非常好，很容易计算的分布）

最后，我们设置 $p(z)$ 为一个 fixed distribution，就是为了让最后学习出来的 z 满足这样性质良好的分布，i.e. 我们使用高斯分布来采样 $z$，可以生成 reasonable 的图像。

#### $\mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z)]$

我们使用数据集中的 $x$，通过 encoder $q_\phi(z|x)$，生成若干个 $z$ 出来（记作 $Z$），然后就是：
$$
\mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z)] \approx \frac1{|Z|}\sum_{z \in Z} \log p_\theta(x|z)
$$

### How to Train (in Details)?

1. 将数据集的一个 x 通过 encoder，得到 $z_x \sim q_\phi(z|x)$
2. 计算出该 x 为 condition 下的 KL 散度
3. 同时，通过 $z_x$ 这个高维高斯随机变量，采样得到若干个 z
4. 再将这些 z 通过 decoder，得到若干个 $\log p_\theta(x|z)$
5. 计算出 $\mathbb E_{z \sim q_\phi(z|x)}[\log p_\theta(x|z)] \approx \frac1{|Z|}\sum_{z \in Z} \log p_\theta(x|z)$
6. 从而，通过 (2),（5)，我们就得到了 $\log p(x)$ 的一个估计的下界
7. 对每一个数据集里的 x 都重复这样的操作，就计算得到了这个数据集的 likelihood 的下界。我们的目标就是最大化这个 likelihood，梯度上升即可

### How to Generate?

由于 $z$ 就是一个标准的高斯分布，因此我们可以直接进行采样，然后生成 $p_{x|z}(x)$，然后再在 $p_{x|z}(x)$ 中对 x 进行采样，从而得到结果 $x$。

### Interpretability

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_20_13_16_202405202013526.png" alt="image-20240520201312848" style="zoom:50%;" />

通过调整里面的参数，可以得到不同的分布。由于 z 的每两个参数之间是独立的，因此可以这样得到某一个参数的实际含义。

### Practice: Image Editing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_20_24_47_202405202024058.png" alt="image-20240520202443575" style="zoom:50%;" />

不足之处，就是 VAE 会导致图片变模糊——这有可能是因为我们对图片采用了不恰当的假设，图片的真实高斯分布不是对角矩阵。

## Pros and Cons of Autoregressive Models and VAE

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_20_24_23_202405202024681.png" alt="image-20240520202420018" style="zoom:50%;" />

## VQ-VAE2

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_20_33_58_202405202033976.png" alt="image-20240520203356402" style="zoom:50%;" />

如上图：

1. 使用多层的 encoder 以及 decoder
2. 在每一层上，使用 PixelCNN

## GAN

GAN 使用一个生成器和一个判别器：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_21_17_47_202405202117463.png" alt="image-20240520211744177" style="zoom:50%;" />

其中，z 就是一个简单的分布（比如标准高斯/均匀），通过生成器 G，转化成另一个分布。我们的目标就是：让这个分布 G(z) 与图像的分布尽量靠近。

---

我们再训练一个鉴别器 D。

我们的目标函数就是：
$$
\min_G \max_D (E_{x \sim p_{data}}[\log D(x)] + E_{z \sim p(z)}[\log(1-D(G(z)))])
$$
其中：
$$
\begin{aligned}
\max_D (E_{x \sim p_{data}}[\log D(x)] + E_{z \sim p(z)}[\log(1-D(G(z)))]) &= \max_D \int p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx \newline
&\leq \int \max_{D(x)} p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx
\end{aligned}
$$
又由于：
$$
\mathop{\arg\max}_{D(x)} p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx = \frac{p_{data}(x)}{p_{data}(x) + p_G(x)}
$$
因此，令 $D'(x) = \frac{p_{data}(x)}{p_{data}(x) + p_G(x)}$，就有 $\int p_{data}(x) \log D'(x) + p_G(x) \log(1-D'(x)) \mathrm dx = \int \max_{D(x)} p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx$，从而：

- $\max_D \int p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx = \int \max_{D(x)} p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx$

因此：
$$
\begin{aligned}
&\max_D (E_{x \sim p_{data}}[\log D(x)] + E_{z \sim p(z)}[\log(1-D(G(z)))]) \newline
= &\int \max_{D(x)} p_{data}(x) \log D(x) + p_G(x) \log(1-D(x)) \mathrm dx \newline
= &\int p_{data}(x) \log \frac{p_{data}(x)}{p_{data}(x) + p_G(x)} + p_{G}(x) \log (1-\frac{p_{data}(x)}{p_{data}(x) + p_G(x)}) \mathrm dx \newline
\end{aligned}
$$
进一步的推导如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_21_35_57_202405202135936.png" alt="image-20240520213543743" style="zoom: 33%;" />

由于 Jensen-Shannon Divergence 是一个度量，因此在 JSD 取到最小值，当且仅当 p 和 q 相等。

### Problem: Gradient Vanishing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_22_18_58_202405202218989.png" alt="image-20240520221855351" style="zoom:50%;" />

为了避免一开始的梯度消失（如图中蓝线所示），我们可以将 $\log (1 - D(G(z)))$ 改成 $\log D(G(z))$。这样，两个公式在趋势上是一致，形式上是类似的，但是后者在一开始可以有比较大的梯度。

### Caveats of GAN

1. 上文中说到：令 $D'(x) = \frac{p_{data}(x)}{p_{data}(x) + p_G(x)}$。但是，实际上 $D$ 可能根本表示不出来右边这个函数。

2. 虽然取到最小值的时候，JSD 可以保证两个分布相等，但是这是非凸优化问题，不能保证收敛到最小值

    - 特别是：JS Divergence 在两个分布相差很大的时候，很容易产生梯度消失的现象：

        <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_10_8_18_202405211008943.png" style="zoom:50%;" />

    - 我们可以通过 [Wasserstein GAN](https://en.wikipedia.org/wiki/Wasserstein_GAN) 来解决这个问题

        - 期望最小化的目标函数不是 JSD，而是 Wasserstein Metric：$\text{arg min}_\theta W(p, p_\theta) = \text{arg min}_\theta \inf_{\pi \in \Pi(p,q)} \mathbb{E}_{(x,y) \sim \pi}$
        - 通过 Kantorovich-Rubinstein对偶定理 ([Proof](https://courses.cs.washington.edu/courses/cse599i/20au/resources/L12_duality.pdf))，让 Wasserstein 距离更容易计算：$ W(p, q) = \inf_{\pi \in \Pi(p,q)} \mathbb{E}_{(x,y) \sim \pi} \left[ \|x - y\|^2 \right] = \sup_{\|h\|_L \leq 1} \left( \mathbb{E}_{x \sim p} [h(x)] - \mathbb{E}_{y \sim q} [h(y)] \right)$
        - 从而，我们就可以优化 $\min_G \max_D (E_{x \sim p_{data}}[D(x)] - E_{z \sim p(z)}[D(G(z))])$
        - 当然，需要保证 $\|D\|_L \leq 1$​。这一点可以采用简单暴力的 clip 操作完成。
    
3. 最后一点，JSD 并不是 metric，因为不满足三角形不等式。当然这一点貌似无关紧要。

### Practices of GAN

我们除了在 z 上随机取点以外，还可以通过 vector math 来进行更加复杂的操作。比如在两个 z 向量之间进行插值，就可以得到 very non-trivial interpolation between their corresponding images；乃至是 man w glasses - man w/o glasses + woman w/o glasses = woman w glasses。

### Conditional GAN

为了在 GAN 中加入条件信息，我们需要向生成器和鉴别器中引入这个信息。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_22_9_25_202405202209437.png" alt="image-20240520220922543" style="zoom:33%;" />

比如，可以通过下面的方式引入：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/20_22_8_16_202405202208493.png" alt="image-20240520220813596" style="zoom: 33%;" />

当然，也可以直接将标签 concatenate 到生成器的随机向量 z 后面——这个标签可以是经过 embedding 的，从而有着更多的信息。
