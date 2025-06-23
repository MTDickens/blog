## Preface

本文主要基于 [DDIM](http://arxiv.org/abs/2010.02502) 这篇论文的内容中的 4.2~4.3 节内容。

**前情提要**：4.1 节之前，主要讲的就是

1. **理论推广：从马尔可夫到非马尔可夫**
    - 文章首先将 DDPM 所依赖的固定的、马尔可夫（Markovian）前向过程，推广到了一个更广义的、**非马尔可夫（non-Markovian）** 的过程族。在这个新框架下，$x_{t-1}$ 的生成不仅依赖于 $x_t$，还可以直接依赖于 $x_0$。
2. **目标函数等价性：训练无需改变**
    - 最关键的一步是证明：尽管前向过程的定义被大大拓宽，但其对应的变分推断目标（variational objective）经过化简后，与原始 DDPM 的训练目标**在形式上是等价的**。
    - **核心结论**：这意味着我们可以沿用 DDPM 的训练方式，训练一个模型，却能同时对应**一整套**不同的生成过程。因此，**可以直接复用预训练好的 DDPM 模型，无需任何修改**。
3. **采样过程的灵活性与加速**
    - **灵活采样**：由于训练和采样解耦，在推理（生成）时，我们可以自由选择不同的反向过程。这具体体现在可以引入一个控制随机性的超参数 $\sigma$。
    - **DDIM 的诞生**：当设置 $\sigma = 0$ 时，每一步的生成都变为**确定性**的，这就得到了本文的核心模型——**Denoising Diffusion Implicit Model (DDIM)**。
    - **采样加速**：更进一步，无论是确定性的 DDIM 还是随机性的 DDPM-like 过程，我们都可以在完整的 $T$ 个时间步中，只选取一个**稀疏的子序列**（例如，1000步中只采50步）来生成图像，从而实现**几十倍的采样加速**。
	    - 同样，这也是因为，即便是采用稀疏的子序列，其对应的（新的、更短的）生成过程所推导出的变分目标，与原始 DDPM 的训练目标**在形式上是等价的**。

简单来说，这篇论文有两个洞见：

1. 由于训练只采用了**一步到位**的加噪方案 $p(x_t | x_0)$，而推理只用到了 $p(x_{t-1}|x_t)$，因此 **$p(x_t |x_{t-1})$ 的马尔可夫性根本就不是必要条件**
	1. 从而，我们~~不再依赖 $p(x_t | x_{t-1})$ 的马尔可夫性来建模~~，而是**用贝叶斯公式+待定系数法求解推理采样过程**
	2. 通过贝叶斯公式+待定系数法，我们成功得到了下面的公式，**以及 $\sigma_t$ 这一个自由元**
	3. 当 $\sigma_t \equiv 0$ 的时候，我们就得到了 **DDIM**（以及跟 DDIM 等价的 ODE。我们之后可以用各种手段加速求解这个 ODE 了）
2. 除了得到 $\sigma_t$ 这个自由元之外，我们甚至发现，**DDPM的训练结果实质上包含了它的任意子序列参数的训练结果**——这就预示着，我们通过精妙地修改子序列的长度可以快进我们的采样过程

或者，某种意义上可以这么说：训练和采样是**耦合**的——如果采样过程有变，那么训练过程的损失函数很可能也会变。**在这里，我们提出了一种新的训练和采样方式**——也就是加上了 $\sigma_t$ 以及稀疏子序列之后，我们的这个训练+采样方法。**好就好在，我们发现，这个新的方法，虽然训练和采样过程和 Vanilla DDPM 都不一样，但是两者的损失函数（在一些限制下）是*等价*的，因此可以复用之前已经训练过的 Vanilla DDPM 模型**。

## 介绍

非 MDP 的一般形式，就是：

$$
\boldsymbol{x}_{t-1}=\sqrt{\alpha_{t-1}} \underbrace{\left(\frac{\boldsymbol{x}_t-\sqrt{1-\alpha_t} \epsilon_\theta^{(t)}\left(\boldsymbol{x}_t\right)}{\sqrt{\alpha_t}}\right)}_{\text {"predicted } \boldsymbol{x}_0 \text { " }}+\underbrace{\sqrt{1-\alpha_{t-1}-\sigma_t^2} \cdot \epsilon_\theta^{(t)}\left(\boldsymbol{x}_t\right)}_{\text {"direction pointing to } \boldsymbol{x}_t{ }^{\text {" }}}+\underbrace{\sigma_t \epsilon_t}_{\text {random noise }}
$$

对于 DDIM，就是 $\forall t \in \{1, 2, \dots, T\}: \sigma_t = 0$，从而，我们有：

$$
\textbf{DDIM}: \boldsymbol{x}_{t-1}=\sqrt{\alpha_{t-1}}\left(\frac{\boldsymbol{x}_t-\sqrt{1-\alpha_t} \epsilon_\theta^{(t)}\left(\boldsymbol{x}_t\right)}{\sqrt{\alpha_t}}\right)+\sqrt{1-\alpha_{t-1}} \cdot \epsilon_\theta^{(t)}\left(\boldsymbol{x}_t\right)
$$

我们对上面这个式子进行变形：

$$
\textbf{DDIM}: \frac{x_{t-1}}{\sqrt{\alpha_{t-1}}} = \frac {x_t} {\sqrt{\alpha_t}} + \left(\sqrt{\frac{1 - \alpha_{t-1}}{\alpha_{t-1}}}-\sqrt{\frac{1 - \alpha_{t}}{\alpha_{t}}}\right)\epsilon_\theta^{(t)}\left(x_t\right)
$$

也就是：

$$
\textbf{Neural-ODE}: \frac{x_{t-\Delta t}}{\sqrt{\alpha_{t-\Delta t}}} = \frac {x_t} {\sqrt{\alpha_t}} + \left(\sqrt{\frac{1 - \alpha_{t-\Delta t}}{\alpha_{t-\Delta t}}}-\sqrt{\frac{1 - \alpha_{t}}{\alpha_{t}}}\right)\epsilon_\theta^{(t)}\left(x_t\right)
$$

为了将这个迭代过程，等价成某个 ODE 的数值求解过程，我们进行 reparameterization：$\sigma = \sqrt{1 - \alpha} / \sqrt{\alpha}, \bar x = x / \sqrt{\alpha}$，从而：

$$
\textbf{Neural-ODE}: \bar x_{t - \Delta t} = \bar x_{t} + \left(\sigma_{t - \Delta t} - \sigma_{t}\right)\epsilon_\theta^{(t)}\left(\frac{\bar x_t}{\sqrt{\sigma^2 + 1}}\right)
$$

从而，对应的微分方程就是：

$$
\mathrm d\bar x(t) = \epsilon_\theta^{(t)}\left(\frac{\bar x(t)}{\sqrt{\sigma^2 + 1}}\right) \mathrm d\sigma(t)
$$

> [!note] 如何推导？
> 
> 首先，微分约束如下：
> 
> $$
> \nabla_t \bar x(t) = \epsilon_\theta^{(t)}\left(\frac{\bar x(t)}{\sqrt{\sigma(t)^2 + 1}}\right) \nabla_t\sigma(t)
> $$
> 
> 而 Euler 方法如下：
> $$
> y(t - \Delta t) \approx y(t) - \Delta t \cdot \nabla_t y(t) = y(t) + \Delta t \cdot f(y(t), t)
> $$
> 
> 从而，套到上面的微分约束上：
> 
> $$
> \begin{aligned}
> &\bar x(t - \Delta t) \newline 
> \approx& \bar x(t) - \Delta t \cdot \epsilon_\theta^{(t)}\left(\frac{\bar x(t)}{\sqrt{\sigma(t)^2 + 1}}\right) \nabla_t\sigma(t) \newline
> =&\bar x(t) - (\nabla_t\sigma(t) \Delta t) \epsilon_\theta^{(t)}\left(\frac{\bar x(t)}{\sqrt{\sigma(t)^2 + 1}}\right) \newline
> =& \bar x(t) + \left(\sigma(t - \Delta t) - \sigma(t)\right)\epsilon_\theta^{(t)}\left(\frac{\bar x(t)}{\sqrt{\sigma^2(t) + 1}}\right)
> \end{aligned}
> $$
> 
> - 最后一个等号成立，是因为 $\alpha$ 关于 $t$ 是分段函数，从而 $\sigma(t)$ 这个函数也是分段函数（然后我们根据需要，取每一个点的左导数或者右导数即可。Anyway, this is just yet another trivial detail）

这个微分方程的初始条件，就是 $t=T$：

- $\bar x(T) \sim \mathcal N(0, \sigma(T))$
	- 由于 $\alpha \approx 0$，因此 $\sigma(T)$ 非常大
	- 也就是说，我们可以从非常大的噪声中，确定性地恢复出一张图片

## 与 SDE 的关系

在 [Score-Based Generative Modeling Through Stochastic Differential Equation (Yang et al 2021)](http://arxiv.org/abs/2011.13456) 里面，作者用更高的 SDE 视角（which allows for stochasticity along the calculation）解释了 DDPM。本文作者的 ODE，本质也是 SDE 的一个特殊情况。

具体请见 SDE 论文分析。