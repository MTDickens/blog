$$
\newcommand{\set}[1]{\left\{ #1 \right\}}
\newcommand{\ac}{\pi_\theta}
\newcommand{\acnew}{\pi_{\theta'}}
$$

# Policy Gradient

> [!info] 记号说明
> 
> 1. $p(s_{t+1}|s_t,a_t)$: Dynamics (环境)
> 2. $\pi_\theta(a_t | s_t)$: Policy (parameterized by $\theta$) (策略)
> 3. $\pi_\theta (\tau) = p(s_1) \left( \prod_{t=1}^{T-1} \ac(a_t | s_t) p(s_{t+1} | s_t, a_t)\right) \ac (a_T | s_T)$: Probability of this trajectory under policy $\pi_\theta$ (这个策略下该轨迹的概率)
> 4. $p_\theta (\tau) = \prod_{t = 1}^T \ac(a_t | s_t)$: Probability of all the action under policy $\pi_\theta$ and the states (i.e. probability of trajectory w/o dynamics) (固定该轨迹中的状态，这个策略下所有该轨迹中的动作的概率。也就是轨迹的概率除以所有环境的概率)

## Off-Policy Policy Gradient

假设我们当前的 policy 是 $\theta'$ ，而我们的数据是通过 $\theta$ 这个 old poilcy 采得的。

那么：

$$
\begin{align}
J(\theta') &= E_{\tau \sim \ac} \left[ \frac {\acnew (\tau)} {\ac (\tau)} r(\tau) \right] \newline
&= E_{\tau \sim \ac} \left[ \frac { p(s_1) \left( \prod_{t=1}^{T-1} \acnew(a_t | s_t) p(s_{t+1} | s_t, a_t)\right) \acnew (a_T | s_T)} { p(s_1) \left( \prod_{t=1}^{T-1} \ac(a_t | s_t) p(s_{t+1} | s_t, a_t) \right) \ac (a_T | s_T)} r(\tau) \right] \newline
&= E_{\tau \sim \ac} \left[ \prod_{t=1}^{T} \frac {\acnew(a_t | s_t)} {\ac(a_t | s_t)} r(\tau) \right] \newline
&= E_{\tau \sim \ac} \left[ \frac {p_{\theta'}(\tau)} {p_{\theta}(\tau)} r(\tau)\right] \quad 
\begin{aligned}
&\text{where } p_\theta (\tau) = \prod_{t = 1}^T \ac(a_t | s_t) \newline
&\text{ i.e. probability of trajectory w/o dynamics } p(s'|s,a)
\end{aligned}
\end{align}
$$

接下来，就是求梯度。

> [!note]+ （近似）梯度推导
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/15_12_54_28_JPEG%E5%9B%BE%E5%83%8F-4FFC-8E05-FB-0.jpeg"/>

最终结果就是：

$$
\nabla_{\theta'} J(\theta') \approx E_{\tau \sim \theta} \left [ \sum_{t=1}^T 
 \frac {p_{\theta'} (a_t | s_t)} {p_{\theta} (a_t | s_t)} \nabla_{\theta'} \log \acnew(a_t | s_t) \left( \sum_{t' = t}^T r(s_t', a_t') \right) \right]
$$

关于上面这个式子的推导过程中的“近似”，我在下面回答几个问题：

> [!questions]+ 几个问题
> 
> Q1: 我们为什么要把 $\prod$ 删去？
> 
> A1: 
> 
> 1. 避免 $T$ 比较大的时候，这个 $\prod$ 过大或者过小（过小是主因）。从而导致梯度爆炸或者梯度消失（同上文，梯度消失是主因）。
> 
>	**为何 $\prod$ 会过大/过小**：既然 $\tau$ 是从旧策略 $\theta$ 中采样的一条路径，我们自然认为 $\forall t: p_\theta(a_t | s_t) > p_{\theta'}(a_t | s_t)$ 是大概率的事件。如果 $t$ 比较大，就会导致多个小于 1 的 $\frac {p_{\theta'}(a_t | s_t)} {p_{\theta}(a_t | s_t)}$ 连乘，从而***导致 $\prod$ 过小***。
> 2. $T$ 比较大的时候，连乘式会大大增加方差，这也是我们不想要的
> 
> Q2: 为什么可以把 $\prod_{t'' = t}^T \cdots$ 删去？
> 
> A3: 删去之后，虽然式子就不再等于梯度，但是属于 policy iteration 这个算法框架了。Policy iteration 仍然可以对 $\pi_\theta'$ 进行优化
> 
> Q3: 为什么可以把 $\prod_{t'=1}^t$ 删去？
> 
> A3: （见上面图片中最下方蓝色部分「为什么能这么做」）

