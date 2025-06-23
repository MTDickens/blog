![gen_model](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/19_19_19_25_202405191919469.png)

如上图：

- likelihood-based model (i.e. explicit density) 的问题在于：
	1. 计算真实概率（i.e. logits 归一化）困难，也就是 untractable
	2. 或者只能不计算真实概率，而是计算 surrogate objectives（作为代替物的目标），但是这只能计算近似上界
- implicit density 的问题在于：往往需要对抗训练，而众所周知对抗训练
	1. 非常不稳定
	2. 容易出现所谓“模式塌陷”（比如说判别器不知为啥，就是判别不好某种图片；这样生成器就可以 exploit 这种缺陷，生成大量错误或者低质量的、但是恰好能骗过生成器的这种图片）

我们这里要介绍的是一种 likelihood-based model：score matching。它不需要 tractable normalizing constant，而且可以直接通过 score matching 训练得到。

## What is score?

More often than not，对于生成模型，给定一个 $x$，我们可以拟合一个**未归一化的概率** $f_\theta(x)$（实际上，拟合**未归一化概率**的模型，我们称之为 energy-based model）。但是，真正的**拟合概率**是 $p_\theta(x) = \frac {f_\theta(x)} {Z(\theta)}$（其中 $Z(\theta) := \int_u f_\theta(u) \mathrm du$），而 $Z(\theta)$ 是 intractable 的。

我们不妨试图拟合一个 **score-based model**，也就是拟合 $s_\theta(x) \approx \nabla_x \log p_\theta(x)$

- 当然，由于 $\nabla_x \log p_\theta(x) = \nabla_x \log f_\theta(x) - \log Z(\theta) = \nabla_x \log f_\theta(x) - 0 = \nabla_x \log f_\theta(x)$，因此 $s_\theta$ 本身也可以跟 energy-based model 搭上边

如何选择拟合时的 loss 呢？

- 对于 likelihood-based model，其实不是最小二乘法，而是 KL 散度，但是跟 scored-based 在形式上有类似之处
  
  $$\begin{aligned}
  &D_{KL}(p || p_\theta) \newline=& \mathbb{E}_{p({x})}\left[\log p({x})-\log p_\theta({x})\right] = \int_x p(x) \log \frac {p(x)} {p_\theta(x)} \mathrm dx \newline=& \sum_{i=1}^N p(x_i) \log \frac {p(x_i)} {p_\theta(x_i)} = -\frac 1 N \log p_\theta(x_i) + \mathrm{Const}\end{aligned}$$
- 而对于 scored-based model，就是典型的最小二乘，即
	- $\mathbb{E}_{p({x})}\left[\left\|\nabla_{{x}} \log p({x})-{s}_\theta({x})\right\|_2^2\right] = \int_x p(x) \left\|\nabla_{{x}} \log p({x})-{s}_\theta({x})\right\|_2^2 \mathrm dx$

拟合之后，我们可以用 Langevin dynamics 进行采样：

$$
x_{i+1} \leftarrow x_i + \epsilon \nabla_x p_\theta(x) + \sqrt{2\epsilon} z_i, \quad \text{where } i = 0, 1, \dots, K, z_i \sim \mathcal N(0, I)
$$

- 当 $\epsilon \to 0, K \to \infty$ 的时候，$x_K$ 的分布就可以趋近于 $p_\theta(x)$（当然要满足一些 regularity conditions）
- 因此，我们可以让 $\epsilon$ 足够小，$K$ 足够大，然后进行采样

![langevin_1](https://yang-song.net/assets/img/score/langevin.gif)

- 如上图：这就是一个 Langevin 过程

## Problem

对于这个最小二乘：

$$
\mathbb{E}_{p({x})}\left[\left\|\nabla_{{x}} \log p({x})-{s}_\theta({x})\right\|_2^2\right] = \int_x p(x) \left\|\nabla_{{x}} \log p({x})-{s}_\theta({x})\right\|_2^2 \mathrm dx
$$

不难看出：$s_\theta(x)$ 的精度（i.e. $\|\nabla_x \log(x) - s_\theta(x)\|^2$ 的大小），跟 $p(x)$ 有直接关系。在 $p(x)$ 过小的地方，score function 可能会很不准。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/06/23_3_22_54_20250623032253.png"/>

如何解决？我们提出一个粗暴但是有效的方法：加噪声——在每一个数据点处加入一个高斯噪声。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/06/23_3_24_15_20250623032414.png"/>

噪声越大，分布越均匀，就越准，但是只是相对加了噪声之后的分布准，而非加噪声之前的分布（某种意义上，variance 减小，bias 增大）。所以，如何平衡两者呢？

原文如此：Yet another question remains: how do we choose an appropriate noise scale for the perturbation process? **Larger noise can obviously cover more low density regions for better score estimation, but it over-corrupts the data and alters it significantly from the original distribution.** Smaller noise, on the other hand, causes less corruption of the original data distribution, but does not cover the low density regions as well as we would like.

To achieve the best of both worlds, we use multiple scales of noise perturbations simultaneously. **Suppose we always perturb the data with isotropic Gaussian noise, and let there be a total of $L$ increasing standard deviations $\sigma_1<\sigma_2<\cdots<\sigma_L$.** We first perturb the data distribution $p(\mathbf{x})$ with each of the Gaussian noise $\mathcal{N}\left(0, \sigma_i^2 I\right), i=1,2, \cdots, L$ to obtain a noise-perturbed distribution

$$
p_{\sigma_i}(\mathbf{x})=\int p(\mathbf{y}) \mathcal{N}\left(\mathbf{x} ; \mathbf{y}, \sigma_i^2 I\right) \mathrm{d} \mathbf{y}
$$

Note that we can easily draw samples from $p_{\sigma_i}(\mathbf{x})$ by sampling $\mathbf{x} \sim p(\mathbf{x})$ and computing $\mathbf{x}+\sigma_i \mathbf{z}$, with $\mathbf{z} \sim \mathcal{N}(0, I)$.

Next, we estimate the score function of each noise-perturbed distribution, $\nabla_{\mathbf{x}} \log p_{\sigma_i}(\mathbf{x})$, by training a Noise Conditional Score-Based Model $\mathbf{s}_\theta(\mathbf{x}, i)$ (also called a Noise Conditional Score Network, or NCSN, when parameterized with a neural network) with score matching, such that $\mathbf{s}_\theta(\mathbf{x}, i) \approx \nabla_{\mathbf{x}} \log p_{\sigma_i}(\mathbf{x})$ for all $i=1,2, \cdots, L$.

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/06/23_3_27_55_20250623032752.png"/>

然后，训练目标就变成了

$$
\sum_{i=1}^L \lambda(i) \mathbb{E}_{p_{\sigma_i}(\mathbf{x})}\left[\left\|\nabla_{\mathbf{x}} \log p_{\sigma_i}(\mathbf{x})-\mathbf{s}_\theta(\mathbf{x}, i)\right\|_2^2\right]
$$

我们之前是 $x_L \overset{s_\theta(x_L)}{\longrightarrow} x_{L-1} \overset{s_\theta(x_{L-1})}{\longrightarrow} x_{L-2} \dots x_0$，现在就变成了 $x_L \overset{s_\theta(x_L, L)}{\longrightarrow} x_{L-1} \overset{s_\theta(x_{L-1}, L-1)}{\longrightarrow} x_{L-2} \dots x_0$

注意：

- 我们这里的假设还是 $x_L \sim \pi(\cdot)$，而 $x_0$ 应该是趋近于 $p_\theta(x)$

## Relation to Stochastic Process and SDE

当 $\epsilon$ 足够小的时候，每一步的噪声也变得足够小，从而变成一个**连续时间随机过程**所对应的**随机微分方程（SDE）**：

$$
\mathrm dx = \nabla_x p_\theta(x, t) \mathrm dt + \sqrt{2\epsilon} \mathrm dw, \quad \text{where }\left\{\begin{aligned}& w \text{ is standard Brownian motion}, \newline &\mathrm dw \text{ is infinitesimal white noise}\end{aligned}\right.
$$

我们甚至可以将这个 SDE 一般化：

$$
\mathrm dx = f(x, t) \mathrm dt + g(t) \mathrm dw
$$

- 上式可以视作 $x_{t + \Delta t} - x_t = f_t(x_t, t) \Delta t + g(t) \sqrt{\Delta t} \epsilon, \text{where } \epsilon \sim \mathcal N(0, I)$ 在 $\Delta t \to 0$ 时的极限
- 为何随机项是 $\mathcal O(\sqrt{\Delta t})$ 的？
	- 我们可以这里先假设随机项是 $\mathcal O(f(\Delta t))$
	- 那么，一个时间片的噪声就是 $f(\Delta t) \epsilon \sim \mathcal N(0, f(\Delta t)^2)$
	- 从而 $1 / \Delta t$ 个时间片的噪声的叠加，就是 $\sum_{i = 1}^{1 / \Delta t} f(\Delta t)\epsilon_i \sim \mathcal N(0, f(\Delta t)^2 / \Delta t)$
	- 为了保证 $\Delta t \to 0$ 的时候，$f(\Delta t)^2 / \Delta t$ 有界，必须有 $f(\Delta t) = \mathcal O(\sqrt{\Delta t})$

一般化形式的 SDE 都是**可逆**的：

$$
\mathrm{d} \mathbf{x}=\left[\mathbf{f}(\mathbf{x}, t)-g^2(t) \nabla_{\mathbf{x}} \log p_t(\mathbf{x})\right] \mathrm{d} t+g(t) \mathrm{d} \mathbf{w}
$$

因此，如果正向过程的 $f(x, t)$ 和 $g(t)$ 我们知道，那么我们只需要**拟合好逆向的 score $s_\theta(x, t) \approx\nabla_x \log p_t(x)$**，就能数值方法求解这个 SDE。

也就是说，Langevin dynamics with multi-scale Gaussian noise 只是 SDE 的特殊形式而已。我们完全可以将 Langevin dynamics 统一到 SDE 的框架下面。

---

如何拟合这个 score？如下所示：

Our training objective for $\mathbf{s}_\theta(\mathbf{x}, t)$ is a continuous weighted combination of Fisher divergences, given by

$$
\mathbb{E}_{t \in \mathcal{U}(0, T)} \mathbb{E}_{p_t(\mathbf{x})}\left[\lambda(t)\left\|\nabla_{\mathbf{x}} \log p_t(\mathbf{x})-\mathbf{s}_\theta(\mathbf{x}, t)\right\|_2^2\right]
$$

where $\mathcal{U}(0, T)$ denotes a uniform distribution over the time interval $[0, T]$, and $\lambda: \mathbb{R} \rightarrow \mathbb{R}_{>0}$ is a positive weighting function. 

- Typically we use $\lambda(t) \propto 1 / \mathbb{E}\left[\left\|\nabla_{\mathbf{x}(t)} \log p(\mathbf{x}(t) \mid \mathbf{x}(0))\right\|_2^2\right]$ to balance the magnitude of different score matching losses across time.

然后，我们就可以 start with $x(T) \sim \pi$，然后一路用数值方法求解，直到解到 $x(0)$ 为止。

---

注意，对于上面的方法，我们有这几个误差：

1. $s_\theta(x, t) \approx \nabla_x \log p_t(x)$
2. 正向过程求出的最终 $x(T)$ 的分布不严格等于分布 $\pi$
3. 数值方法有精度误差

对于 1、2，当 $\lambda(t) = g^2(t)$ 的时候，可以推导出：

$$
\begin{aligned}
\mathrm{KL}\left(p_0(\mathbf{x}) \| p_\theta(\mathbf{x})\right) \leq \frac{T}{2} \mathbb{E}_{t \in \mathcal{U}(0, T)} \mathbb{E}_{p_t(\mathbf{x})}\left[\lambda(t) \| \nabla_{\mathbf{x}} \log p_t(\mathbf{x})-\right. & \left.\mathbf{s}_\theta(\mathbf{x}, t) \|_2^2\right] \\
& +\mathrm{KL}\left(p_T \| \pi\right)
\end{aligned}
$$


Due to this special connection to the KL divergence and the equivalence between minimizing KL divergences and maximizing likelihood for model training, we call $\lambda(t)=g(t)^2$ the likelihood weighting function. Using this likelihood weighting function, **we can train score-based generative models to achieve very high likelihoods, comparable or even superior to state-of-the-art autoregressive models**.

---

至于数值求解 SDE，怎么说呢？ODE 里面的各种显式/隐式/混合的 vanilla Euler/Runge-Kutta 方法，拿过来改一改就是了。

*TODO*

---

我们如果想求出准确的 likelihoood，那么就要用所谓”概率流“模型。

*TODO*

## Conditional Generation

我们能够很简单地训练一个 CNN 或者 transformer，判别图片的类别。也就是说，训练一个 $q_\phi(y|x) \approx p(y|x)$ 很简单。同样，使用反向传播算法求出 $\nabla_x \log q_\phi(y|x)$ 也很简单。

目前，我们还已经训练了一个 $s_\theta(x) \approx \nabla_x \log p(x)$。那么，不难想到：

$$
\nabla_x \log p(x|y) = \nabla_x \log \frac {p(y|x) p(x)} {p(y)} = \nabla_x \log p(y | x) + \nabla_x \log p(x) - \underbrace{\nabla_x \log p(y)}_{=0} \approx s_\theta(x) + \nabla_x \log q_\phi(y|x)
$$

因此，我们可以直接复用训练好的生成模型以及判别模型，组合两者，得到**条件生成模型 $r_{\theta, \phi}(x | y)$**

## Relation to DDPM

还记得 DDPM 的训练吗：

$$
\mathbb E_{t \sim \operatorname{Uniform}(\{1, 2, \dots, T\})} \left[\mathbb{E}_{\boldsymbol{x}_0 \sim q\left(\boldsymbol{x}_0\right), \epsilon_t \sim \mathcal{N}(\mathbf{0}, \boldsymbol{I})}\left[\left\|\epsilon_\theta^{(t)}\left(\sqrt{\alpha_t} \boldsymbol{x}_0+\sqrt{1-\alpha_t} \epsilon_t\right)-\epsilon_t\right\|_2^2\right]\right]
$$

可以看出两种形式是类似的。

根据[知乎文章](https://zhuanlan.zhihu.com/p/20759828806)，（经过推导，）DDPM 和 score 有下面的联系：

$$
\nabla_{x_t} \log p\left(x_t\right)=s_\theta\left(x_t, t\right)=-\frac{1}{\sqrt{1-\bar{\alpha}_t}} \varepsilon_\theta\left(x_t, t\right)
$$

因此，DDPM 方法训练的 noise predictor 可以直接拿过来、简单转换之后，当成 score 来用。

## 得分匹配

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/06/23_22_37_38_20250623223735.png"/>

上面就是大致的推导过程。这个推导基本上是基于 [Yang Song's blog](https://yang-song.net/blog/2019/ssm/) 的。