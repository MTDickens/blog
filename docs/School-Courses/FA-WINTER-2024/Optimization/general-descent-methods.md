## Definition

Formally,  the descent direction is defined as follows.

$$
\boxed{
\begin{aligned}
&\textbf{Definition 4 (Descent Direction)} \newline
\newline
&{\boldsymbol{d}\mathrm{~is~a~descent~direction~for~}f\mathrm{~at~}x\mathrm{~if~}f(\boldsymbol{x}+t\boldsymbol{d})<f(\boldsymbol{x})\text{ for all }t>0\text{ sufficiently small.}}
\end{aligned}
}
$$

Also , the following proposition is easy to obtain:

$$
\boxed{
\begin{aligned}
&\textbf{Propsition 5 (Descent Direction)} \newline
\newline
& \text{if } f \text{ is continuously differentiable in a neighborhood of $x$,then any $d$ such that} \newline
&\boldsymbol{d}^\top\nabla f(\boldsymbol{x})<0 \text{ is a descent direction.}
\end{aligned}
}
$$

## Steepest Descent Direction

给定一个范数 $\|\cdot\|$，我们就可以定义**这个范数意义下的 steepest descent direction**。

$$
\boxed{
\begin{aligned}
&\textbf{Definition 5 (Steepest Descent Direction)} \newline
&\newline
&\Delta_{\|\cdot\|}\boldsymbol{x}\triangleq\underset{\boldsymbol{v}:\|\boldsymbol{v}\|\leq1}{\operatorname*{argmin}}\langle\boldsymbol{v},\nabla f(\boldsymbol{x})\rangle 
\end{aligned}
}
$$
**Note**: 

1. 其实，我们是希望让 $\Delta_{\|\cdot\|}\boldsymbol{x}\triangleq\underset{\boldsymbol{v}:\|\boldsymbol{v}\|\leq1}{\operatorname*{argmin}} f (\boldsymbol{x} + \boldsymbol{v})$ 的。但是由于直接最小化是不现实的，因此我们只能采用近似策略：$f(\boldsymbol{x} + \boldsymbol{v}) \approx f(\boldsymbol{x}) + \langle \boldsymbol v, \Delta f(\boldsymbol{x}) \rangle, \text{where } f(\boldsymbol{x}) \text{ is constant}$
2. 显然，如果使用 2-范数的话，那么这个 domain 就是 high-dimensional sphere，等价于梯度下降

### Examples: Different Norms

$$
\begin{aligned} & \Delta_{\|\cdot\|_2} \boldsymbol{x}=- \nabla f(\boldsymbol{x}), \newline & \Delta_{\|\cdot\|_1} \boldsymbol{x}=-\operatorname{sign}\left(\frac{\partial f(\boldsymbol{x})}{\partial \boldsymbol{x}_l}\right) \boldsymbol{e}_l, \quad l=\underset{i \in 1, \ldots, n}{\operatorname{argmax}}\left|\frac{\partial f(\boldsymbol{x})}{\partial \boldsymbol{x}_i}\right|, \newline & \Delta_{\|\cdot\|_A} \boldsymbol{x}=-\|\nabla f(\boldsymbol{x})\|_{A^{-1}}^{-1} A^{-1} \nabla f(\boldsymbol{x})\end{aligned}
$$

> [!info]- 证明
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/18_3_5_19_JPEG%E5%9B%BE%E5%83%8F-46AF-BC81-85-0.jpeg"/>

因此，对于三种范数，descent direction $\boldsymbol d$ 就是：

$$
\begin{aligned} 
& d_{gd} =- \frac {1}{\|\nabla f(\boldsymbol x) \|} \nabla f(\boldsymbol{x}), \newline
& d_{cd} =-\operatorname{sign}\left(\frac{\partial f(\boldsymbol{x})}{\partial \boldsymbol{x}_l}\right) \boldsymbol{e}_l, \quad l=\underset{i \in 1, \ldots, n}{\operatorname{argmax}}\left|\frac{\partial f(\boldsymbol{x})}{\partial \boldsymbol{x}_i}\right|, \newline
& d_A =-\|\nabla f(\boldsymbol{x})\|_{A^{-1}}^{-1} A^{-1} \nabla f(\boldsymbol{x})
\end{aligned}
$$

### Example: TRPO

TRPO 是强化学习的一个最优化方式。

Let $\pi_\theta$ denote a policy with parameters $\theta$. The theoretical TRPO update is:

$$
\begin{aligned}
\theta_{k+1}=\arg \max _\theta & \mathcal{L}\left(\theta_k, \theta\right) \\
\text { s.t. } & \bar{D}_{K L}\left(\theta \| \theta_k\right) \leq \delta
\end{aligned}
$$

where $\mathcal{L}\left(\theta_k, \theta\right)$ is the *surrogate advantage*, a measure of how policy $\pi_\theta$ performs relative to the old policy $\pi_{\theta_k}$ using data from the old policy:

$$
\mathcal{L}\left(\theta_k, \theta\right)=\underset{\tau \sim \pi_{\theta_k}}{\mathrm{E}}\left[\sum_{t=0}^T \gamma^t A^{\pi_{\theta_k}}(s_t, a_t)\right]
$$

and $\bar{D}_{K L}\left(\theta \| \theta_k\right)$ is an average KL-divergence between policies across states visited by the old policy:

$$
\bar{D}_{K L}\left(\theta \| \theta_k\right)=\underset{s \sim \pi_{\theta_k}}{\mathrm{E}}\left[D_{K L}\left(\pi_\theta(\cdot | s) \| \pi_{\theta_k}(\cdot | s)\right)\right]
$$


The theoretical TRPO update isn't the easiest to work with, so TRPO makes some approximations to get an answer quickly. We Taylor expand the objective and constraint to leading order around $\theta_k$ :

$$
\begin{aligned}
\mathcal{L}\left(\theta_k, \theta\right) & \approx g^T\left(\theta-\theta_k\right) \\
\bar{D}_{K L}\left(\theta \| \theta_k\right) & \approx \frac{1}{2}\left(\theta-\theta_k\right)^T H\left(\theta-\theta_k\right)
\end{aligned}
$$

- $g = \nabla_{\theta_k} \mathcal{L} (\theta_k, \theta)$
- By the property of KL-divergence, $D_{KL}(\pi_{\theta_k} \| \pi_{\theta}) |_{\theta_k = \theta} = 0, \nabla_{\theta_k} D_{KL}(\pi_{\theta_k} \| \pi_{\theta}) |_{\theta_k = \theta} = \vec 0$, thus the second order Taylor expansion of $D_{KL}$ only consists of the Hessian matrix

resulting in an approximate optimization problem,

$$
\begin{aligned}
\theta_{k+1}=\arg \max _\theta & g^T\left(\theta-\theta_k\right) \\
\text { s.t. } & \frac{1}{2}\left(\theta-\theta_k\right)^T H\left(\theta-\theta_k\right) \leq \delta
\end{aligned}
$$

### Randomized Schemes

#### Coordinate Descent

For **coordinate descent** method, the direction of $f$ at $\boldsymbol{x}$ can be randomly chosen, and is given by
$$
d_{c d-\text { rand }} \triangleq-[\nabla f(\boldsymbol{x})]_{i_k} \boldsymbol{e}_{i_k},
$$
where $i_k$ chosen uniformly at random from $\{1,2, \ldots, n\}$ at each $k$.

**Note**: 由于 $\langle -[\nabla f(\boldsymbol x)]_{i_k} \boldsymbol e_{i_k}, \nabla f(\boldsymbol x) \rangle = -\nabla f(\boldsymbol x)_{i_k}^2 \leq 0$，因此满足条件

#### Stochastic Gradient

For **stochastic gradient** method, the direction of $f$ at $\boldsymbol{x}$ is given by
$$
d_{s g c} \triangleq-g\left(\boldsymbol{x}_k, \xi_k\right),
$$
where $\xi_k$ is a random variable, such that $\mathbb{E}_{\xi_k} g\left(\boldsymbol{x}_k, \xi_k\right)=\nabla f\left(\boldsymbol{x}_k\right)$. That is, $g\left(\boldsymbol{x}_k, \xi_k\right)$ is an unbiased ( but often very noisy ) estimate of the true gradient $\nabla f\left(\boldsymbol{x}_k\right)$.

**Note**: 最常见的，就是 batch gradient descent。均匀（不重复）抽样一组 batch，然后进行 descent。