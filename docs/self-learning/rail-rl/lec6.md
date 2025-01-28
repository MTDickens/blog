$$
\newcommand{\set}[1]{\left\{ #1 \right\}}
\newcommand{\ac}{\pi_\theta}
$$

# Actor Critic Algorithms

> [!info] 基本思想
> 
> 引入 critic，**通过 bias 换取 lower variance**

## RECAP: REINFORCE Algorithm

> [!info]+ 步骤
> 
> 1. sample $\set{\tau^i}$ from $\ac(a_t | s_t)$
> 2. $\nabla J(\theta) \approx \sum_i^N \sum_t^T \nabla \log \ac(a_{i, t} | s_{i, t}) \hat Q^\pi_{i, t}$
> 	- 在 REINFORCE 中，$\hat Q^\pi_{i, t} = \sum_{t'=t}^T r(s_{i, t'}, a_{i, t'})$
> 3. $\theta \leftarrow \theta + \alpha \nabla J(\theta)$

也就是经典的三步走：

1. 使用当前策略进行采样
2. 使用采得的样本求 policy gradient
3. 更新策略

## How to Reduce Variance?

> [!note]- Notation
>   
> $$
> \begin{aligned} & Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=\sum_{t^{\prime}=t}^T E_{\pi_\theta}\left[r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right) \mid \mathbf{s}_t, \mathbf{a}_t\right] \newline
> & V^\pi\left(\mathbf{s}_t\right)=E_{\mathbf{a}_t \sim \pi_\theta\left(\mathbf{a}_t \mid \mathbf{s}_t\right)}\left[Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)\right] \newline
> & A^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)-V^\pi\left(\mathbf{s}_t\right)\end{aligned}
> $$
> 
> 注意，这三个 $Q, V, A$ 都是准确的。

由于 $Q^\pi(s_{i, t}, a_{i, t}) = E_{(s_{i, t+1}, a_{i, t+1}, s_{i, t+2}, a_{i, t+2}, \dots) \sim \pi}[\hat Q^\pi_{i, t}]$，因此我们可以把 $\hat Q^\pi_{i, t}$ 替换成 $Q^\pi$，从而减小方差：

$$
\nabla_\theta J(\theta) \approx \frac 1 N \sum_{i = 1}^N \sum_{t = 1}^T \nabla_\theta \log \ac(a_{i, t} | s_{i, t}) Q^\pi(s_{i, t}, a_{i, t})
$$

- 为什么还是约等号？因为虽然 $Q(s_{i, t}, a_{i, t})$ 是准确的，但是 $s_{i, t}$ 和 $a_{i, t}$ 仍然是 stochastic 的

为了进一步减小方差，不难想到，我们需要使用 baseline。这里，我们使用 $V^\pi$ 当做 baseline：

$$
\begin{align}
\nabla_\theta J(\theta) &\approx \frac 1 N \sum_{i = 1}^N \sum_{t = 1}^T \nabla_\theta \log \ac(a_{i, t} | s_{i, t}) [Q^\pi(s_{i, t}, a_{i, t}) - V^\pi(s_{i, t})] \newline
&= \frac 1 N \sum_{i = 1}^N \sum_{t = 1}^T \nabla_\theta \log \ac(a_{i, t} | s_{i, t}) A^\pi(s_{i, t}, a_{i, t})
\end{align}
$$

> [!note]- 证明：如果一个 baseline 只与 state 有关，那么最终求得的梯度就是 unbiased
> 
> 由条件期望定理：
> 
> $$
> \forall t, (f: \mathcal S \to \mathbb R): E[\nabla \log \pi(a_t | s_t) f(s_t)] = E[E[\nabla \log \pi(a_t | s_t) f(s_t) | s_t]]
> $$
> 
> 而 
> 
> $$
> \forall s_t: \int_{a_t \in \mathcal A} \pi(a_t | s_t) \nabla \log \pi(a_t | s_t) f(s_t) \mathrm d a_t= f(s_t) \nabla \left( \int_{a_t \in \mathcal A} \pi(a_t | s_t) \right) \mathrm d a_t = f(s_t) * 0 = 0
> $$
> 
> 因此
> 
> $$
> \forall t: E[\nabla \log \pi(a_t | s_t) f(s_t)] = E[E[\nabla \log \pi(a_t | s_t) f(s_t) | s_t]] = E[0] = 0
> $$
> 
> 由于 $V(s_t)$ 只与 state 有关，因此就是 unbiased。
> 
> - 甚至，即便不用准确的 $V$，而是用对 $V$ 的估计——$V_\phi$（下文提到）。由于 $V_\phi$ 也只与 state 有关，因此在 $Q$ 准确的情况下，也是 unbiased

## Bias-Variance Tradeoff: Fit a Value Function

$$
\begin{aligned}
& Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=r\left(\mathbf{s}_t, \mathbf{a}_t\right)+\underbrace{\sum_{t^{\prime}=t+1}^T E_{\pi_\theta}\left[r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right) \mid \mathbf{s}_t, \mathbf{a}_t\right]}_{V(\mathbf{s}_t)} \newline
\implies &A^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right) \approx r\left(\mathbf{s}_t, \mathbf{a}_t\right)+V^\pi\left(\mathbf{s}_{t+1}\right)- V^\pi\left(\mathbf{s}_t\right).
\end{aligned}
$$

显然，我们无法得到准确的 $Q^\pi, V^\pi$。如果我们用 sample 的方式去逼近，会很浪费样本。又由于我们可以仅用一个 $V$ 来估计 $V, Q, A$ 三个函数。因此，我们决定用拟合的方式——拟合一个函数 $V^\pi_\phi$，来近似 $Q^\pi, V^\pi$。

## AC Algorithms

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/15_14_52_4_A2D4F7B8-8C23-4CE7-A8C0-1C28DE80A358.png"/>

> [!info]- 每一步的解释
> 
> 1. 从当前策略中采样轨迹
> 2. 拟合 $V^\pi_\phi$
> 3. 通过轨迹以及 $V^\pi_\phi$，估计 advantage $A^\pi_\phi$
> 4. （通过 advantage）估计策略梯度
> 5. 反向传播
> 
> 相比 REINFORCE 算法而言，多了两步：
> 
> 1. 拟合 $V^\pi_\phi$
> 2. 通过轨迹以及 $V^\pi_\phi$，估计 advantage $A^\pi_\phi$

如上图：

1. 所谓 batch，就是我们走 k 步之后（或者走完一个/若干个 trajectories 之后），再统一进行更新
2. 所谓 online，就是我们每走一步，就进行一次更新

### Realworld AC Algorithm

> [!warning]
> 
> 下图中的 batch，和上面的 batch 不一样。
> 
> - 下面的 batch 指的是 $\sum_{i = 1}^N$ 这个 batch，即 multi-trajectories
> - 而上面的 batch 指的 $\sum_{t = 1}^T$，即 multi-steps

简单来说，下图中就是

1. 多个 trajectories 并行
2. 对于左边，所有 trajectories 都仿真一步之后，才统一更新一次 $\theta$；右边，每一个 trajectory 仿真一步完成之后，立即更新 $\theta$

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/15_15_11_49_2E8B11D2-E045-4873-9136-39006BC70286.png"/>


在实际中，我们经常采用所谓 A3C 算法：Asynchronous Actor-Advantage-Critic（如下图中右侧所示）。其目标就是：通过异步更新，提高采样效率。

## Replay Buffer

> [!info]
> 
> 如何进一步加速？开源、节流是两大法宝。
> 
> - 上面的 A3C 就是开源（利用了并行和异步）
> - 下面的 replay buffer 就是节流（重用了之前的样本）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/15_15_20_46_EFCB5754-901C-4162-BCA0-D54F751FA0CD.png"/>

> [!info]- 每一步的解释
> 
> 1. 从当前策略中采样轨迹，**储存到 replay buffer 里面**
> 2. 从 **replay buffer** 中 sample 一个 batch
> 3. 拟合 $V^\pi_\phi$
> 4. 通过轨迹以及 $V^\pi_\phi$，估计 advantage $A^\pi_\phi$
> 5. （通过 advantage）估计策略梯度
> 6. 反向传播
> 
> 相比上面的 vanilla AC 算法而言：
> 
> 1. 多了一步：轨迹储存到 replay buffer 里面
> 2. 改了一步：从 replay buffer 中取出一个 batch，而不是直接用当前的采样

### How to Fix the Broken Algorithm?

但是，如果就按照上面的步骤，那么在数学上是有问题的（我们这里先不考虑 $s_i$ 本身的分布）：

1. $y_i = r_i + \gamma V^\pi_\phi (s_i')$ 中，按理说，假设 $V^\pi_\phi$ 是准确的，那么 $y_i$ 就应该是 $V_\phi^\pi(s_i')$ 的无偏估计。

	但是这里的 $a_i$ 是通过旧的策略 sample 的，因此 $a_i$ 的分布不对，从而 $s_i' \sim p(s_i'|s_i, a_i)$ 的分布不对，从而 $y_i$ 显然不是无偏的
2. 同上，由于 $a_i$ 的分布不对，因此 $\log_\theta \ac(a_i | s_i)$ 也不对

如何改正？

1. 实际上，对于异策略的 $(s_i, a_i, r, s_i', a_i')$，我们有 $V^\pi(s_i) \neq Q^\pi(s_i, a_i) = E[r_i + \gamma V^\pi_\phi (s_i')]$，因此，我们拟合一个 $Q$ 就行，而不需要拟合 $V$
2. 改正第一个错误：$y_i = r_i + \gamma Q^\pi_\phi(s_i', a_i'^\pi), \text{ where } a_i'^\pi \sim \pi_\theta(a_i'^\pi | s_i')$。这里，我们不用之前的 $a_i'$，而是通过当前的策略抽样一个 $a_i'^\pi$
3. 改正第二个错误：$\log_\theta \ac(a_i^\pi | s_i), \text{ where } a_i'^\pi \sim \pi_\theta(a_i^\pi | s_i)$。同样，这里，我们不用之前的 $a_i$，而是通过当前的策略抽样一个 $a_i^\pi$

### Rule of Thumb

- 为什么之前我们要想办法降低一个样本的 variance 呢？
- 因为采样困难，因此我们需要谨慎利用每一个样本
- 现在，我们直接从 replay buffer 中抽取，想抽多少就抽多少，因此我们可以用大样本量的方式来降低方差

因此，**我们这里直接用 Q 函数就好，没必要估计 advantage**
	- 第一因为直接用 Q 函数更简单
	- 第二因为估计 advantage 也是额外的计算量，我们还不如多抽一些样本

## Use Critic as Baseline

> [!info]
> 
> **这是在 policy gradient 上的改进**
> 
> 我们可以把 critic 用作 policy gradient 里面的 baseline。这样：
> 
> 1. 不会产生 bias（所有 policy gradient 的方法，都是 unbiased；但是 actor-critic 由于引入了一个 critic，因此存在 bias）
> 2. 相比 vanilla policy gradient，如果 critic 足够准确，那么 variance 可以大大降低

## $V$: State-dependent Baselines

Actor-critic:

$$
\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta\left(\mathbf{a}_{i, t} \mid \mathbf{s}_{i, t}\right)\left(r\left(\mathbf{s}_{i, t}, \mathbf{a}_{i, t}\right)+\gamma \hat{V}_\phi^\pi\left(\mathbf{s}_{i, t+1}\right)-\hat{V}_\phi^\pi\left(\mathbf{s}_{i, t}\right)\right)
$$

- low variance
- not unbiased

Policy gradient: 

$$
\quad \nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta\left(\mathbf{a}_{i, t} \mid \mathbf{s}_{i, t}\right)\left(\left(\sum_{t^{\prime}=t}^T \gamma^{t^{\prime}-t} r\left(\mathbf{s}_{i, t^{\prime}}, \mathbf{a}_{i, t^{\prime}}\right)\right)-b\right)
$$

- high variance
- unbiased

[上文](#how-to-reduce-variance)中，我们证明了如果一个 baseline 只与 state 有关，那么最终求得的梯度就是 unbiased。因此，我们直接令 $b = V^\pi_\phi(s_{i, t'})$ 即可。也就是：

$$
\quad \nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta\left(\mathbf{a}_{i, t} \mid \mathbf{s}_{i, t}\right)\left(\left(\sum_{t^{\prime}=t}^T \gamma^{t^{\prime}-t} r\left(\mathbf{s}_{i, t^{\prime}}, \mathbf{a}_{i, t^{\prime}}\right)\right)-V^\pi_\phi(s_{i, t'})\right)
$$

## $Q$: action-dependent baselines

 相比 $V$ 而言，$Q$ 可以实现更低的 variance（因为多了一个 action，更加精确）。

$$
\begin{aligned}
& Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=\sum_{t^{\prime}=t}^T E_{\pi \theta}\left[r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right) \mid \mathbf{s}_t, \mathbf{a}_t\right] \newline
& V^\pi\left(\mathbf{s}_t\right)=E_{\mathbf{a}_t \sim \pi_\theta\left(\mathbf{a}_t \mid \mathbf{s}_t\right)}\left[Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)\right] \newline
& A^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=Q^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)-V^\pi\left(\mathbf{s}_t\right) \newline
& \hat{A}^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=\sum_{t^{\prime}=t}^{\infty} \gamma^{t^{\prime}-t} r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right)-V_\phi^\pi\left(\mathbf{s}_t\right) \quad \left\{
\begin{array}{l}
\text{+ no bias} \newline
\text{- higher variance (because single-sample estimate)}
\end{array}
\right. \newline
& \hat{A}^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)=\sum_{t^{\prime}=t}^{\infty} \gamma^{t^{\prime}-t} r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right)-Q_\phi^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right) \quad \left\{
\begin{array}{l}
\text{+ goes to zero in expectation if critic is correct!} \newline
\text{- biased}
\end{array}
\right.\newline
& \nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta\left(\mathbf{a}_{i, t} \mid \mathbf{s}_{i, t}\right)\left(Q_{i, t}-Q_\phi^\pi\left(\mathbf{s}_{i, t}, \mathbf{a}_{i, t}\right)\right)+\frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta E_{\mathbf{a} \sim \pi_\theta\left(\mathbf{a}_t \mid \mathbf{s}_{i, t}\right)}\left[Q_\phi^\pi\left(\mathbf{s}_{i, t}, \mathbf{a}_t\right)\right]
\end{aligned}
$$

- $\sum_{t^{\prime}=t}^{\infty} \gamma^{t^{\prime}-t} r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right)-V_\phi^\pi\left(\mathbf{s}_t\right)$ 就是我们刚才推出的 state-dependent baseline
- $\sum_{t^{\prime}=t}^{\infty} \gamma^{t^{\prime}-t} r\left(\mathbf{s}_{t^{\prime}}, \mathbf{a}_{t^{\prime}}\right)-Q_\phi^\pi\left(\mathbf{s}_t, \mathbf{a}_t\right)$ 就是我们希望直接将 $V$ 替换成 $Q$（但是这样做不对）
- 最后一个式子，在倒数第二个的基础上，增加了一个小尾巴，就 unbiased 了

对于这个小尾巴，

- 对于简单的函数来说，可以直接求出解析式
- 对于复杂的函数（如神经网络）来说，也可以多次采样求平均（由于不需要实际在环境中采样，因此代价很小）

## Eligibility Trace and N-Step Returns (Advantage Estimation)

> [!info]
> 
> **这是在 Vanilla AC Algorithm 上的改进**，旨在让我们更加精确地对 bias-variance 进行 tradeoff
> 
> 另外，Eligibility Trace 和 GAE 是同一个公式的两种解释。
> 
> - 我们通过将所有 N-Step Returns 求个加权平均，直接得到 GAE
> - 我们将 GAE 进行变形，从而得到可以通过递推实现 $\mathcal O(n)$ 复杂度的算法。同时，我们得到了 GAE 的另一种解释

### N-Step Returns

经典的 **One-step** advantage estimation 就是：

$$
\hat A_{1}^\pi (s_t, a_t) = r(s_t, a_t) + \gamma \hat V^\pi_\phi (s_{t+1}) - \hat V^\pi_\phi(s_t) = \sum_{t' = t}^{t+1 - 1} \gamma^{t' - t} r(s_{t'}, a_{t'}) - \hat V^\pi_\phi(s_t) + \gamma^1 \hat V^\pi_\phi (s_{t+1})
$$

从而，**N-step** advantage estimation 就是：

$$
\hat A_{N}^\pi (s_t, a_t) = \sum_{t' = t}^{t+n - 1} \gamma^{t' - t} r(s_{t'}, a_{t'}) - \hat V^\pi_\phi(s_t) + \gamma^n \hat V^\pi_\phi (s_{t+1})
$$

一般而言：N 越大，方差越大，bias 越小；N 越小，方差越小，bias 越大。

### GAE: Generalized Advantage Estimation

> [!info] 解释
> 
> Advantage Estimation 指的是各种 step 或长或短的 $\hat A$。GAE 的所谓 "generalized"，就在于将这些 $\hat A$ 进行了加权平均。

因此，我们到底选择哪一个 N 呢？实际上，我们不只用一个 N，而是构造 Generalized Advantage Estimation，用所有的 N 求一个加权平均数：

$$
\hat A_{GAE}^\pi (s_t, a_t) = \sum_{n=1}^\infty w_n \hat A_{n}^\pi (s_t, a_t)
$$

一般而言，我们选择使用指数衰减，主要原因是我们这样可以从后往前递推，从而计算的时间复杂度是 $\mathcal O(n)$ 而不是 $\mathcal O(n^2)$：

$$
\hat A_{GAE}^\pi (s_t, a_t) = \sum_{n=1}^\infty \lambda^{n-1} \hat A_{n}^\pi (s_t, a_t)
$$

但是，上面这个公式，直接看起来，并不是能够递推的。那么，如何转变形式才能递推呢？我们就要把这个 GAE 形式转变成 Eligibility Trace。

### Another POV: Eligibility Trace

> [!info] 解释
> 
> Trace 就是“（留下的痕）迹”，也就是所有 $t$ 对应的 $\delta_t$。Eligibility 就是“资格”——你这个 $\delta_t$，在我最终结果中，有多大的资格（i.e. 加权平均的权重多大）？
> 
> 因此，资格迹本质上就是所有的“迹”的一个加权平均

递推计算方法：

$$
\begin{aligned}
\hat A_{GAE}^\pi (s_t, a_t) = \sum_{n=1}^\infty \lambda^{n-1} \hat A_{n}^\pi (s_t, a_t) = &\sum_{t'=t}^\infty (\gamma\lambda)^{t'-t} \delta_{t'} \newline 
&\text{where } \delta_{t'} = r(s_{t'}, a_{t'}) + \gamma  \hat V^\pi_\phi (s_{t'+1}) - \hat V^\pi_\phi (s_{t'+1})
\end{aligned}
$$

不难看出，我们得到了 GAE 的另一种解释。这种解释被称为 Eligibility Trace。其内涵如下：

- 对于每一个 $t'$，都有一个人拿着喇叭在喊话：$\delta_{t'}$
- 喊话的声音，需要从 $t'$ 一直传回 $t$，才能算被听见
- 声音每隔一个单位，就衰减 $\gamma\lambda$
- 因此，远方的声音，几乎听不到（i.e. 几乎没资格）；近处的声音最响亮（i.e. 资格最大）

