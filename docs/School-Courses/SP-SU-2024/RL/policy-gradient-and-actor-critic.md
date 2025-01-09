## Policy Gradient

> [!warning] 注意
> 
> 我们的目标是让 $J(\theta)$ 越大越好（~~而不是机器学习中常见 loss 越小越好~~），因此实际使用中，应该
> 
> 1. 梯度上升（~~而不是机器学习中常见的梯度下降~~）
> 2. 或者，让 $-J(\theta)$ 的梯度下降

我们发现，与其制造一个价值估计函数 $Q(s,a)$，然后间接得到策略，不如直接让函数给出策略。

- i.e. 给出**在一个状态 $s$ 下，我们做出动作 $a$ 的概率** $p(a|s)$

我们可以使用 $\theta$ 来参数化这个策略，从而记作 $p_\theta$。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_13_5_13_202405211305097.png" alt="image-20240521130510321" style="zoom: 33%;" />

如上图，我们的目标直截了当：**找到可以最大化收益的策略函数**。因此，一个简单的想法就是梯度上升。

但是，**虽然 $J(\theta)$ 这个函数性质良好（i.e. 可微）**，但是我们**无法直接通过 $\theta$，求出 $J(\theta)$ 的导数**。

- 这大概是因为：$p_\theta$​ 是概率的，因此必须将每一种可能加起来，然后不出几步，就会导致组合爆炸
- *由于需要求关于* $\theta$ 的导数，因此也不能使用蒙特卡洛估计 $J(\theta)$

因此，就采用一个巧妙的变形：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_13_11_11_202405211311941.png" alt="image-20240521131108951" style="zoom:33%;" />

然后，我们可以在 $x \sim p_\theta$ 中采样，然后近似这个导数。

目前的问题就是：$\frac{\partial} {\partial \theta} \log p_\theta (x)$ 如何计算？

#### $\frac{\partial} {\partial \theta} \log p_\theta (x)$ 的计算

我们令 $x = (s_0, a_0, s_1, a_1, \dots)$，这就是遵循 $\pi_\theta(a|s)$ 策略之后的轨迹，也是一个随机向量。

那么：
$$
\begin{aligned}
\log p_\theta(x) &= \log \prod_i P(s_{i+1} | s_i, a_i) \pi_\theta(a_i | s_i) \newline 
&= \sum_i \log P(s_{i+1} | s_i, a_i) + \log \pi_\theta(a_i | s_i) \newline
\end{aligned}
$$
由于 $\log P(s_{i+1} | s_i, a_i)$ 与 $\theta$ 无关，因此：
$$
\frac{\partial} {\partial \theta} \log p_\theta (x) = \frac{\partial} {\partial \theta} \sum_i \log \pi_\theta(a_i | s_i) = \sum_i \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i)
$$
从而：
$$
\begin{aligned}
\frac{\partial J} {\partial \theta} &= \mathbb E_{x \sim p_\theta} \left[ (f(x)) \left(\frac \partial {\partial \theta}\log p_\theta(x)\right) \right] \newline
&= \mathbb E_{x \sim p_\theta}\left[\left(\sum_{t \geq 0} \gamma^t r_t\right) \left(\sum_{i \geq 0} \frac{\partial} {\partial \theta} \log \pi_\theta (a_i | s_i) \right)\right] \newline
&\approx \frac 1 N \sum_{j = 1}^N \left(\sum_{t \geq 0} \gamma^t r_t^{(j)}\right) \left(\sum_{i \geq 0} \frac{\partial} {\partial \theta} \log \pi_\theta (a_i^{(j)} | s_i^{(j)}) \right) \newline
&= \frac{\partial} {\partial \theta} \left[ \frac 1 N \sum_{j = 1}^N \left(\sum_{t \geq 0} \gamma^t r_t^{(j)}\right) \left(\sum_{i \geq 0} \log \pi_\theta (a_i^{(j)} | s_i^{(j)}) \right) \right]
\end{aligned}
$$

#### PyTorch 实现

我们要做的，就是

1. 通过当前策略 $\pi_\theta(a_i | s_i)$，在 $x \sim p_\theta$ 这个分布中，进行 N 次抽样，获得若干的 $x^{(j)} \mathop{:=} (s_0^{(j)}, a_0^{(j)}, s_1^{(j)}, a_1^{(j)}, \dots)$
2. 然后，令 `loss = ...`
    - 其中 ... 就是 $\frac 1 N \sum_{j = 1}^N \left(\sum_{t \geq 0} \gamma^t r_t^{(j)}\right) \left(\sum_{i \geq 0} \log \pi_\theta (a_i^{(j)} | s_i^{(j)}) \right)$
3. 最后，`loss.backward()`，求导、更新即可

### 改进一：Baseline

为了避免抽样上的偏差，造成的以下后果：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/5_15_31_50_202407051531537.png"/>

- 如图：在只有正奖励的情况下，假如说我们很不幸，若干次只抽到了 b, c，那么就会让 b, c 的权重上升。**此时，即使 a 是最好的，由于 a 的预估权重太小了，因此难以抽中；而又由于 a 难以抽中，因此预估权值之后也难以上升。从而，导致 a 之后再也抽不中的恶性循环**。

我们改变一下目标函数：

由于：

$$
\mathbb E_{x \sim p_\theta} \left[\frac \partial {\partial \theta} \log p_\theta(x) \right] = \int_x p_\theta(x) \frac \partial {\partial \theta} \log p_\theta(x) \mathrm dx = \int_x \frac \partial {\partial \theta} p_\theta(x) = \frac \partial {\partial \theta} \int_x p_\theta(x) \mathrm dx = \frac \partial {\partial \theta} 1 = 0
$$

因此：

$$
\frac{\partial J} {\partial \theta} = \mathbb E_{x \sim p_\theta} \left[ (f(x) - b) \left(\frac \partial {\partial \theta}\log p_\theta(x)\right) \right] 
$$

> [!note]+ 如何设置 $b$？
> 
> 我们适当地设置这个 $b$，使得 $b = \sum_{j=1}^N f(x^{(j)} \approx \mathbb E_{x \sim p_\theta} [f(x)]$。
> 
> 也就是：
> 
> $$
> \begin{aligned}
> \frac{\partial J'} {\partial \theta}
> & = \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d} \left[ \sum_{j=1}^N \left(f(x^{(j)}) - \overline {f(x^{(j)})} \right) \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right] \newline
> & = \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d} \left[ \sum_{j=1}^N\left(f(x^{(j)}) -  \left[\frac{\sum_{i=1}^N f(x^{(i)})}{N}\right]\right) \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right]
> \end{aligned}
> $$
> 
> 不难证明：
> 
> $$
> \begin{aligned}
> \frac{\partial J'} {\partial \theta} 
> =& \frac 1 N \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d} \left[ \sum_{j=1}^N\left(f(x^{(j)}) -  \left[\frac{\sum_{i=1}^N f(x^{(i)})}{N}\right]\right) \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right] \newline
> = & \frac 1 N 
> \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d} \left[ \sum_{j=1}^N f(x^{(j)}) \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right] - \newline 
> & \frac 1 N \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d} \left[ \sum_{j=1}^N \left[\frac{\sum_{i=1}^N f(x^{(i)})}{N}\right] \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right] \newline
> = & \frac{\partial J} {\partial \theta} - \frac 1 N \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d} \left[ \sum_{j=1}^N \left[\frac{\sum_{i=1}^N f(x^{(i)})}{N}\right] \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right] \newline
> = & \frac{\partial J} {\partial \theta} - \frac 1 {N^2} \mathbb E_{\{x_1, x_2, \dots, x_N\} \sim p_\theta, i.i.d}  \left[\sum_{i=1}^N f(x^{(i)}) \sum_{j=1}^N \left(\frac \partial {\partial \theta}\log p_\theta(x^{(j)})\right) \right] \newline
> = & \frac {N-1} {N} \left(\frac{\partial J} {\partial \theta} - \mathbb E [f(x)] \mathbb E [\frac \partial {\partial \theta}\log p_\theta(x)]\right) \newline
> = & \frac {N-1} {N} \left(\frac{\partial J} {\partial \theta} - 0 \right) \newline
> = & \frac {N-1} {N} \frac{\partial J} {\partial \theta} \newline
> \end{aligned}
> $$

### 改进二：离策略梯度

由于 vanilla policy gradient 是典型的同策略算法，因此

1. 样本利用率差（采集 N 条轨迹之后，进行一次梯度更新，**然后这些轨迹将被丢弃**）
2. 稳定性差（由于**训练轨迹由神经网络本身决定，因此本质训练数据和之前的训练数据不是独立的。假设之前的训练数据很不幸地采集得很差，说不定之后的训练轨迹会因为之前的垃圾数据而一直垃圾下去**。这点和经典的监督学习 i.i.d. 有很大不同）

我们可以通过 **importance sampling**，依照其它策略进行采样：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/5_16_28_23_202407051628731.png"/>

- 如何求重要性采样下的策略梯度呢？其实就是按照 policy gradient 的方式去推就行了。**注意不需要对 $\theta'$ 求梯度**

## 演员-评论员方法

> [!abstract]+ 宏观框架
> 
> Policy gradient 方法，为了优化策略 $\theta$，需要使用 $\theta$ 策略完整地进行 $N$ 次轨迹采样，然后更新梯度。这样做，不仅耗费时间，而且方差大。
> 
> 我们可以结合之前的 $Q(s, a)$ 函数的方法（i.e. Q 学习、Sarsa），使用 $Q(s, a)$ 来代替上图中的 $r(\tau)$

### Vanilla (Deep) Actor-Critic

#### 训练 actor

**对比**：

- Vanilla policy gradient: $\frac{\partial J} {\partial \theta} \triangleq \frac{\partial} {\partial \theta} \left[ \frac 1 N \sum_{j = 1}^N \left(\sum_{t \geq 0} \gamma^t r_t^{(j)}\right) \left(\sum_{i \geq 0} \log \pi_\theta (a_i^{(j)} | s_i^{(j)}) \right) \right]$
- Vanilla actor-critic: $J(\theta) = \mathbb E_{x \sim p_\pi}\left[ q_\omega(s_0, a_0) \right] \approx \int_x \pi_\theta(a_0 | s_0) q_\omega(a_0, s_0) \theta$
    - 从而，$\frac{\partial J} {\partial \theta} \triangleq \frac{\partial} {\partial \theta}\left[ \frac 1 N \sum_{j=1}^N q_\omega(s_0, a_0) \log \pi_\theta(a_0, s_0) \right]$
    - 其中，$q_\omega(s, a)$ 就是 critic 的评分

#### 训练 critic

我们使用 **Deep** SARSA 来充当这里的 critic。

> [!note]+ 注意
> 
> DQN 和 SARSA 的重要不同，就是前者是**异策略**的（因此可以使用**经验回放**技巧），而后者是同策略的（只能使用当前的来训练）。
> 
> 可以这么认为：**不使用经验回放的 DQN，就是 Deep SARSA**

#### 最终流程

总流程如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/5_18_17_30_202407051817582.png"/>

- **注意**：至于 critic 的 loss，那么仍然是均方差。**不难发现，此时的 TD 目标 (i.e. $\widehat {y_t}$)，不是按照 critic 的 $\mathop{\arg\max}Q(s, a)$ + ε-greedy 的策略，而是按照 actor 的策略**。从而，TD 误差中，包含了 actor 和 critic 两者的“思考”，在梯度下降的时候，就会促使 critic 和 actor 靠近。

### Vanilla Deep A2C

就是使用了 Baseline 的 AC 算法。同时，这里的算法实现中，采用了

1. **完整轨迹**（从而我们可以通过 $Q^\pi (s_t, a_t) = \mathbb E_{s_{t+1} \sim P_{s_t, \cdot}^{a_t}} [R(s_t, a_t) + \gamma V(s_{t+1})] \triangleq R(s_t, a_t) + \gamma V(s_{t+1})$ 来 estimate $Q^\pi$，避免使用 V 和 Q 两个神经网络）
2. **批量求梯度**（和上文中的 $\mathrm \theta_\text{new} \leftarrow \mathrm \theta_\text{now} + \beta \cdot \widehat{q_t} \cdot \nabla_{\mathrm \theta} \ln \pi (a_t | s_t; \mathrm \theta_\text{now})$ 不同，我们这里将**轨迹中所有的梯度放到一起**）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/5_18_41_47_202407051841972.png"/>

> [!note]+ 节省网络参数
> 
> 设想我们使用 CNN 架构来抽取特征。那么，既然特征本身是一种 general 的东西，那么**我们不妨让 V 和 $\pi_\theta$ 共用同样的 CNN**。
> 
> 优点：减少参数量。
> 
> 缺点：两者的特征不一定是对齐的。

> [!note]+ 改进的优势函数
> 
> 实际上，与其采用单步的采样来估计 $Q$
> 
> $$
> \widehat A^\pi(s_t^i, a_t^i) = \widehat Q(s_t^i, a_t^i)  - \widehat V^\pi (s_{t}^i) = R(s_t^i, a_t^i) + \gamma \widehat V^\pi (s_{t+1}^i) - \widehat V^\pi (s_{t}^i)
> $$
> 
> ，不如尽量利用到所有的采样来估计 $Q$
> 
> $$
> \begin{aligned}
> \widehat A^\pi(s_t^i, a_t^i) = & \widehat Q(s_t^i, a_t^i) - \widehat V^\pi (s_{t}^i)\newline
> =&R(s_t^i, a_t^i) + \gamma R(s_{t+1}^i, a_{t+1}^i) + \gamma^2 R(s_{t+2}^i, a_{t+2}^i) + \dots \newline
> &+ \gamma^{k-1} R(s_{t+k-1}^i, a_{t+k-1}^i) + \gamma^k \widehat V^\pi(s_{t+k}^i) - \widehat V^\pi (s_{t}^i)
> \end{aligned}
> $$
> 
> - 其中，$t+k$ 就是该条轨迹的最后一步——也许是因为走到了终止状态，也许是因为到了
> 
> 而后者也是可以迭代的：
> 
> $$
> \begin{equation}
>   \widehat Q(s_{t+k}^i, a_{t+k}^i)=\left\{
>   \begin{array}{@{}ll@{}}
>     0, & \text{terminal state}\\
>     V(s_{t+k}), & \text{non-terminal state,bootstrapping}
>   \end{array}\right.
> \end{equation} 
> $$
> 
> $$
> \widehat Q(s_t^i, a_t^i) = R(s_t^i, a_t^i) + \gamma \widehat Q(s_{t+1}^i, a_{t+1}^i)
> $$
> 
> 同时也有：
> 
> $$
> \begin{aligned}
> \widehat A(s_t^i, a_t^i) &= R(s_t^i, a_t^i) + \gamma \widehat Q(s_{t+1}^i, a_{t+1}^i) + \widehat V^\pi (s_t^i) \newline 
> &= R(s_t^i, a_t^i) + \gamma \left[\widehat A(s_{t+1}^i, a_{t+1}^i) - \widehat V^\pi (s_{t+1}^i) \right] + \widehat V^\pi (s_t^i) \newline
> &= R(s_t^i, a_t^i) + \gamma A(s_{t+1}^i, a_{t+1}^i) + \gamma \widehat V^\pi (s_{t+1}^i) - \widehat V^\pi (s_t^i)
> \end{aligned}
> $$
> 
> - **注意**：$\widehat A(s_{t+k}^i, a_{t+k}^i) = 0$，无论是否是 terminal state

### Improved (Deep) A2C

实际上，我们也可以采用**经验回放**，也就是 DQN。但是，假如直接使用四元组 $(s, a, s', r)$ 进行策略梯度更新的话，由于是“异策略”的，因此更新的时候，会造成统计上的偏差。

我们可以在“异策略”回放的基础上，**重新选择动作**：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/5_20_53_13_202407052053312.png"/>
