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
	    - 同样，这也是因为，即便是采用稀疏的子序列，推导结果与原始 DDPM 的训练目标**在形式上是等价的**

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
\textbf{Neural-ODE}: \bar x_{t - \Delta t} = \bar x_{t} + \left(\sigma_{t - \Delta t} - \sigma_{t}\right)\epsilon_\theta^{(t)}\left(x_t\right)
$$

从而，对应的微分方程就是：

$$
\mathrm d\bar x(t) = \epsilon_\theta^{(t)}\left(\frac{\bar x(t)}{\sqrt{\sigma^2 + 1}}\right) \mathrm d\sigma(t)
$$



