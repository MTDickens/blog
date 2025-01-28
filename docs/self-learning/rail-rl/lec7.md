# Q-Learning

> [!info]
> 
> Basically, Q-Learning 相比 policy gradient 以及 actor-critic 而言，直接将 policy 的那部分网络舍弃掉了——我们拟合 $Q$ 函数，然后用 $Q$ 函数直接构造出来 $\pi_Q$

## Policy Iteration

### Intuition

我们之前采用的方法是：

1. 采样
2. fit $\hat V$
3. 求出 $\hat A$
4. 求出策略梯度
5. 梯度下降

本质上，4、5 两步的目的，就是**使用 $\hat A$ 对策略进行优化**。因此，除了使用梯度以外，我们还有没有别的方法可以进行优化呢？

是有的。假设我们之前的策略是 $\pi_\theta(a|s)$，那么：

- $\theta_\text{new} = \theta + \alpha \nabla_\theta J(\theta)$ 是优化
- $\pi_{\theta_\text{new}}(a_t|s_t) = \left\{\begin{aligned}& 1 \quad \text{if } a_t = \mathop{\arg\max}_{a \in \mathcal A} \hat A(a, s_t) \newline & 0 \quad \text{otherwise}\end{aligned}\right.$ 也是优化
	- 如果 $\hat A$ 估计准确，我们可以保证 $\pi_{\theta_\text{new}}$ 不劣于 $\pi_\theta$

而后面这种，相比前面的好处就在于：不需要显式的 $\pi$，只需要 $\hat A$ 就可以

### High Level Idea

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_5_31_34_20250119053134.png"/>

至于如何拟合这种 $\hat A$？和之前一样：$A^\pi(s, a) = r(s, a) + \gamma E[V^\pi(s'）] - V^\pi(s)$

因此我们就去 evaluate $V$ 就是了。

### Algorithm

#### Fit $V$

> [!example]
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_5_58_13_20250119055813.png"/>

如上：

- 首先，我们使用 bootstrap 的方式，将 $V^\pi$ 进行一次更新
	- 更新 $V$ 的同时，由于 $A^\pi$ 是由 $V^\pi$ 决定的，因此策略也同时被更新了

> [!note]
> 
> 这个其实和之前图片中的 policy iteration algorithm 并不完全一样：
> 
> 1. 之前的 policy iteration algorithm，我们应该是将 $\pi$ 固定不变，然后迭代多次，直到求出比较准确的 $V^\pi$。此时，再更新一次策略。
>     - 也就是说，每更新一步策略 $\pi$ 之后，就将 $V$ 精确值求出来
> 2. 但是，我们这里的算法，每迭代一次，就更新一次策略。
>     - 也就是说，更新策略 $\pi$ 和 $V$ 的拟合是同步的
> 
> **本质区别**：其实就是将 offline (1) 变成了 online (2) 算法。
> 
> 当然，我们这里的算法，也可以不从 policy iteration 这个角度解释，而是从 Bellman Equation 迭代求解这个角度来解释。后面，我们将用 Bellman Equation 这个框架来解释 policy iteration 的收敛性

#### Fit $Q$

显然，fit $V$ 最大的问题就在于，如果我们不知道 environment，那么，用 $V$ 也求不出 $A$。

因此，我们不如直接 fit $Q$：

- 更新 $Q(s, a) \leftarrow r(s, a) + \gamma E[V(s')] := r(s, a) + \gamma E[Q(s', \pi_Q(s'))] := r(s, a) + \gamma E[\max_a Q(s', \pi_Q(s'))]$
	- 更新 $Q$ 的同时，由于 $A$ 是由 $Q$ 决定的，因此策略也同时被更新了
- 为了方便起见，我们用 $V(s)$ 来记录下来 $\max_a Q(s, a)$：令 $V(s) \leftarrow Q(s, \pi_Q(s)) := \max_a Q(s, a)$
	- 这样，我们每次更新 $Q$ 的时候，就不需要去求 $\max_a Q(s, a)$

### Deep Q Learning

不过是做出两个改动罢了：

1. 上面用的是一个 table 来记录所有 $Q(s, a)$。这里状态动作太多了，table 记不下
	- 那么我就用 $\phi$ 来参数化 $Q$（i.e. $Q_\phi$）
 2. 上面将所有 $Q(s, a)$ 精确赋值。这里我没法精确，也没法做到所有状态-动作都更新一次
	- 那么就通过某个 policy 取轨迹，然后对这条轨迹平方误差最小化（i.e. $y_i \leftarrow r(s_i, a_i) + \gamma \max_{a_i'} Q_\phi(s_i', a_i'),\ \phi \leftarrow \mathop{\arg\min}_\phi \sum_i \|Q_\phi (s_i, a_i) - y_i\|^2$）

具体算法如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_6_50_52_20250119065051.png"/>

当然，我们很多时候还是喜欢在线算法，也就是不（通过 $K$ 次梯度下降）近似求出 $\mathop{\arg\min}$，而是只求一步梯度。同时，我们也只做一个 action（而不是一个 batch），就更新一次：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_7_0_6_20250119070006.png"/>

## Learning Theory

### Value Function

#### Tabular

Tabular value function iteration 是这样的：

1. $Q(s, a) \leftarrow r(s, a) + \gamma E[V(s')]$
2. $V(s) \leftarrow \max_a Q(s, a)$

也就是：$V(s) \leftarrow \max_a r(s, a) + \gamma E_{s' \sim p(s'|s, a)}[V(s')]$

我们不妨定义两个算子（我把两者的类型也标注出来了）：

- $(\mathcal T_a :: (\mathcal S \to \mathbb R) \rightarrow (\mathcal S \to \mathbb R)):\quad V, s \mapsto E_{p(s' | s, a)} [V(s')]$
- $(\mathcal B :: (\mathcal S \to \mathbb R) \rightarrow (\mathcal S \to \mathbb R)) : \quad V \mapsto \max_a r_a + \gamma \mathcal T_a V$

那么，我们每一次迭代的时候，其实就是做了如下的赋值：$\mathcal B V\leftarrow V$

令 $\|f\|_\infty = \max_x |f(x)|$，由于：

$$
\begin{align}
&\|\mathcal BV - B\bar V\|_\infty \newline
= & \max_s |(\mathcal BV)(s) - (\mathcal B\bar V)(s)| \newline
= &|(\max_a r(s, a) + \gamma E[V(s')]) - (\max_b r(s, b) + \gamma E[\bar V(s')])| \newline \leq 
& \max_a |(r(s, a) + \gamma E[V(s')]) - (r(s, a) + \gamma E[\bar V(s')])| \newline
= &\max_a \gamma |E[V(s') - \bar V(s')]| \newline
\leq &\gamma \|V - \hat V\|_\infty
&
\end{align}
$$

从而，由压缩映射定理，不动点是存在且唯一的。又由于最优策略对应的 value function 满足 $\forall s: V^\ast(s) = \max_a r(s, a) + \gamma E[V^\ast(s')]$。从而最终 $V$ 一定会收敛到 $V^\ast$，从而 $Q$ 就会收敛到 $Q^\ast$，从而 $\pi_Q$ 就会收敛到 $\pi^\ast$

#### Non-Tabular

这里，即便我们用于采样 $\{(s, a, s')\}$ 的 policy 够好（i.e. 我们可以认为将所有的 policies 都包括进去了），也不行，因为这里除了上面的 $\mathcal B$ 算子以外，还要额外加一个 $\Pi$ 算子：

$$
(\Pi :: (\mathcal S \to \mathbb R) \rightarrow (\mathcal S \to \mathbb R)): \quad \mathop{\arg\min}_{V' \in \Omega} \frac 1 2 \sum \| V'(s) - V(s) \|^2
$$

而这个 $\Pi$ 只能保证：$\| \Pi V - \Pi \bar V\|^2 \leq \| V - \bar V\|^2$。虽然一眼看上去，貌似和 $\mathcal B$ 复合之后，仍然是压缩映射，但是不要忘记了，$\Pi$ 用的是 $l_2$-norm。因此，$\Pi\mathcal B$ 啥都不是。

> [!info]+ 图示
> 
> 形象的说：
> 
> $V' = \Pi \mathcal B V$ 就是如下的过程：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_17_56_53_20250119175653.png" width="50%"/>
> 
> 可能虽然 $\mathcal B$ 将你往 $V^\ast$ 拉近了，但是神经网络一下就把你拉回来了。
> 
> 从而，tabular 的就是左边的轨迹，而 non-tabular 的就是右边的轨迹。对于右边来说，虽然 $\mathcal BV$ 确实离最优函数更近了，但是 $V'$ 反而比 $V$ 离最优函数更远
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_17_59_24_20250119175924.png"/>

### What About fitted Q-iteration?

如果我们不把 $V$ 当成主体，而是把 $Q$ 当成主体，结果也大差不差。该不收敛的，还是不收敛。毕竟在已知 environment dynamics 的情况下， $Q$ 和 $V$ 本身就是一体。

如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_18_6_45_20250119180644.png"/>

### Wait! Isn't online Q iteration just *regression*?

Online Q iteration 乍看起来像是某种 gradient descent（i.e. 试图优化某个目标函数）。但是，实际上并不是（如下图所示）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/19_18_19_23_20250119181923.png"/>

**解释**：

- $Q$ learning 分两步：第一步是 $Q_\text{temp} \leftarrow \mathcal BQ$，第二步是 $Q \leftarrow \Pi Q_\text{temp}$
- 因此，第二步在优化的时候，就不会管第一步中已经求出来的 $Q_\text{temp}$
	- 对应实际问题，就是第二步的时候，我们**不会对第一步求出来的 $y_i$ 进行求导，虽然 $y_i$ 里面是包含 $Q_\phi$ 的**
	- 也就是说，如果我们求导的话，那么就应该是 $\frac {\mathrm d Q_\phi(s_i, a_i) - y_i} {\mathrm \phi} (Q_\phi(s_i, a_i) - y_i)$。但是，由于我们不管第一步的 $y_i$了（把它视作常数），因此就不对 $y_i$ 求导了，也就是 $\frac {\mathrm d Q_\phi(s_i, a_i)} {\mathrm \phi} (Q_\phi(s_i, a_i) - y_i)$
- 从而，我们第二步中进行的优化，压根就**不是对某个函数进行梯度下降**

> [!question]+ 为什么不用真正的梯度下降？
> 
> 真正的梯度下降方法也有，就是所谓 residual gradient，可以让我们每一次优化的步骤等价于梯度下降。问题就在于，这样的方法**数值过于不稳定**，导致 in practice 效果非常差。

## Exploration

> [!info] 引入
> 
> 为什么我们要用到这样的 exploration rule？
> 
> 在上面的 learning theory 中，我们提到了，对于 non-tabular 的情况，我们希望样本的 state 的分布能够尽量“全面”。而一个全面的样本，就需要一个比较好的 policy。
> 
> 但是，一开始，$Q$ 是随机的，因此必然很差。此时 policy 不好，只能拿“多样性”来凑。我们就让 trajectory 多样一些。此时就需要引入 **exploration**

我们通常用到下面两种 exploration 的方式：
$$
\begin{array}{ll}
\pi\left(\mathbf{a}_t \mid \mathbf{s}_t\right)= \begin{cases}1-\epsilon \text { if } \mathbf{a}_t=\operatorname{arg~max}_{\mathbf{x}_t} Q_\phi\left(\mathbf{s}_t, \mathbf{a}_t\right) \newline
\epsilon /(|\mathcal{A}|-1) \text { otherwise }\end{cases} & \text { "epsilon-greedy" } \newline
\pi\left(\mathbf{a}_t \mid \mathbf{s}_t\right) \propto \exp \left(Q_\phi\left(\mathbf{s}_t, \mathbf{a}_t\right)\right) & \text { "Boltzmann exploration" }
\end{array}
$$

其中：

- eps-greedy 的好处就在于简单
- Boltzmann 的好处就在于
	1. 如果两个动作差不多好，那么第二好的不会沦为可怜的 $\epsilon$ 的一员，而是和第一好的被选到的概率差不多
	2. 如果一个动作非常差，那么我们就希望永远不再选它（i.e. $\exp$ 的值小到可以忽略），而不是和其它的动作平等

## Problems with Vanilla Q-Learning

回顾一下，online Q iteration 分为三个步骤：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_3_5_21_20250120030521.png"/>

有两个明显的问题：

1. 相邻的轮中，我们使用的 $(s, a, s', r)$ 是 correlated——比如，相邻的 $s$ 一般比较相似。这和 stochastic gradient descent 的 i.i.d. 假设冲突了
2. 没用 gradient。当然即便用了所谓 residual gradient，也会导致数值稳定性很差，效果很不好

### How to Decorrelation

**我们先着手解决第一个问题**

数据相干性最大的问题在于：

- 由于短时间内，很多个相似的状态可能相邻出现，因此容易对 trajectory 上每一群类似的状态**过拟合**，从而导致下一次还走这条路，陷入其中难以自拔

我们的目标，就是在短时间内，不要让多个相似的状态相邻出现。我们有两个思路：

1. 使用多个 workers 同时跑。可以 synchronous 也可以 asynchronous
	- 由于 Q learning 还真就不那么看重数据的及时性，因此我们可以大大方方地使用 asynchronous
2. 使用 replay buffer
	- 由于 Q learning 还真就不那么看重数据的及时性，因此用旧一些的策略是完全没问题的

由于 replay buffer 最经济实惠，因此我们自然选用 replay buffer。

#### Replay Buffer in Q-Learning

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_3_47_23_20250120034723.png"/>

如图，由于 Q Learning 不太在乎数据是从当前分布中取得的，因此 replay buffer 随便用。

当然，由于我们也需要考虑到 replay buffer 里的 state 能够”良好地“覆盖 state space，因此最好还是时不时用最新的策略，往 replay buffer 里面添加用最新 Q +某种探索方法构成的策略采得的样本，从而往 replay buffer 里面注入新鲜血液。

### Target Networks

**我们再着手解决第二个问题**

最大的问题就在于：$y_i$ 本身包含 $Q_\phi$，但是在对 $\phi$ 求导的时候，竟然把 $y_i$ 当成了与 $\phi$ 无关的函数，没有包含 $y_i$。

那么，我们干脆就**真将 $y_i$ 变成一个与 $\phi$ 无关的函数**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_4_5_36_20250120040536.png"/>

如上图，我们让 $\phi'$ 每隔 $NK$ 次求梯度，才更新一次。这样就保证 $\phi$ 可以在 $\phi' \leftarrow \phi$ 之前收敛到比较好的值。

## "Classic" DQN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_4_10_4_20250120041003.png"/>

本质上，就是 vanilla target network 中使用了 $K = 1$ 的情况。

### Alternative Target Network

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_4_18_22_202501200418975.png"/>

> [!info] 动机
> 
> $\phi'$ 毕竟是比 $\phi$ 更早的策略——我们保持 $\phi'$ 不变，只是为了梯度更新的稳定罢了。
> 
> 如图，假设 $N=4$，那么对于第一个 $(s, a, s', r)$，我们使用它来更新，那么 $\phi'$ 就是最新的；，对于第二个 $(s, a, s', r)$，$\phi'$ 就是老一些的；对于第三个 $(s, a, s', r)$，$\phi'$ 就是更老的；……；到了第 5 个，由于 $N=4$，所以在此更新之前，$\phi' \leftarrow \phi$ 刚完成，从而又是最新的了。
> 
> 这就导致了，不同时间点的 $\phi'$ 的“老朽程度”不同，从而可能造成些许的不平衡。

> [!info] 算法
> 
> 为了让：
> 
> 1. 不同时间点的 $\phi'$ 的“老朽程度”一样
> 2. $\phi'$ 需要滞后于 $\phi$ 变化——i.e. 几乎不变
> 
> 我们选择使用滑动窗口的方式来更新，也就是插值的方式来更新。我们直接取消 $N$，使用 $\tau$ 取而代之。每一轮，我们都更新一次 $\phi'$，但是只进行微小的更新。
> 
> 这样，就能满足上面两个要求。

> [!question]
> 
> 但是，问题又来了。我们插值，本身的意愿是让 $\forall s, a: Q_{\phi'}(s, a) \leftarrow \tau Q_{\phi'}(s, a) + (1 - \tau) Q_{\phi}(s, a)$。
> 
> 由于 $Q$ 本身是深度网络，并不是线性函数，直接用其参数插值，并不代表插值得到的函数值就是两个函数函数值的插值。因此，上图中给出的 $\phi' \leftarrow \tau \phi' + (1-\tau) \phi$ 这种直接神经网络参数来插值，貌似不太 make sense？
> 
> 其实，这种参数插值，就是 Polyak averaging，it makes perfect sense。当然，只适用于 $\phi'$ 和 $\phi$ 差距不大的情况。由于我们每求一次导就更新一次，因此确实差距不大，可以这么用

## Summary: A More General View

> [!info]+ 不同 Q-Learning 的算法
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_16_34_25_20250120163425.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_16_32_47_20250120163246.png"/>

对于我们上面所说的所有 Q-Learning 变种，我们都可以将其 fit 进以下的框架中：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/20_16_27_25_20250120162724.png"/>

如图：

- 我们将不同的步骤变成了不同的 processes
- 这些 processes 可以有**不同速率**
- 这些 processes 可以**同步或者异步**
	- 对于 large replay buffer 的情况，我们往往可以将 data collection 这个 process 异步于另两个 processes

上图举了三个例子，就是使用我们这个 general view 来刻画三种算法。

## Improved Q-Learning

Q-Learning 有一个很大的问题，在于 over-estimation。其原因如下：

我们的 target value $y_i = r_i + \gamma \max_{a_i'} Q_{\phi}(s_i', a_i')$，我们的目标是 $Q_{\phi}(s_i, a_i) = y_i$。

但是，由于 SGD 的原因，$Q_{\phi}$ 的值一般而言只能在某个固定值附近波动，因此，我们实际上做到的是：

$$
E[Q_\phi(s_i, a_i)] = E[r_i + \gamma \max_{a_i'} Q_{\phi}(s_i', a_i') ]
$$

又由于：

$$
E[\max(X_1, X_2)] = \int_{x, y} \max(x, y) p(x, y) \mathrm dx \mathrm dy \geq \max\left(\int_{x, y} x p(x, y) \mathrm dx \mathrm dy, \int_{x, y} y p(x, y) \mathrm dx \mathrm dy \right) = \max(E[X_1], E[X_2])
$$

因此，$E[r_i + \gamma \max_{a_i'} Q_{\phi}(s_i', a_i')] \geq \max_{a_i'} E[r_i + \gamma Q_{\phi}(s_i', a_i')]$，从而：

$$
\begin{aligned}
Q(s_i, a_i) = r_i + \gamma \max_{a_i'} Q(s_i', a_i') \implies E[Q(s_i, a_i)] &= \max_{a_i'} E[r_i + \gamma Q(s_i', a_i')] \newline
E[Q_\phi(s_i, a_i)] &\geq \max_{a_i'} E[r_i + \gamma Q_{\phi}(s_i', a_i')]
\end{aligned}
$$

因此，可以粗略推出，在 $Q_\phi$ 基本稳定收敛之后：$E[Q_\phi(s_i, a_i)] \geq E[Q(s_i, a_i)] = Q(s_i, a_i)$

### Double DQN

为什么 Q Learning 不行？根本原因是 $E[\max(X_1, X_2)] \geq \max(E[X_1], E[X_2])$，或者说 $E_\phi[\max_a f_\phi(a)] = \int_\phi \max_a f_\phi(a) p(\phi) \mathrm d\phi \geq \max_a \int_\phi f_\phi(a) p(\phi) \mathrm d \phi = \max_a E_\phi[f_\phi(a)]$，从而导致高估。

我们目标，就是删去这个大于号。方法很直接，用一个与 $\phi$ 不相干的 $\mu$ 来做决策：

$$
E_\phi[f_\phi(\mathop{\arg\max}_{a}f_\mu(a))] = \int_\phi f_\phi(\mathop{\arg\max}_{a}f_\mu(a)) p(\phi) \mathrm d\phi \quad (?) \quad \int_\phi f_\phi\left(\mathop{\arg\max}_{a}\int_\phi f_\mu(a) p(\phi)\mathrm d\phi\right) p(\phi) \mathrm d \phi = E_\phi[f_\phi(\mathop{\arg\max}_aE_\phi[f_\mu(a)])]
$$

- 在一定情况下，$(?)$ 就可以是等号

因此，具体来说，我们就是使用两个相对独立的网络 $\phi_{A}, \phi_B$，然后分别使用对方的最优动作来更新对方：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/21_7_26_26_20250121072625.png"/>

#### Double-DQN in Practice

在实际中，我们不需要使用两个网络。由于我们使用 DQN 训练的时候，有 $\phi$ 和 $\phi'$，因此我们只要对更新式子中的第二个改一下就好。也就是：

- 从 $y_i = r_i + \gamma \max_{a'} Q_{\phi'} (s', a') = r_i + \gamma Q_{\phi'} (s', \mathop{\arg\max}_{a'} Q_{\phi'}(s',a'))$
- 改为 $y_i = r_i + \gamma Q_{\phi'} (s', \mathop{\arg\max}_{a'} Q_\phi(s',a'))$（注意动作处的下标从 $\phi'$ 变成了 $\phi$，也就是说，我们 evaluate 这个动作，仍然用 $Q_{\phi'}$，但是挑选动作的时候，就用 $Q_\phi$）

### Q-Learning with N-step Returns

$$
y_t = \sum_{t'=t}^{t+N-1} \gamma^{t-t'} r_{t'} + \gamma^N \max_{a_{t+N}}Q_{\phi'}(s_{t+N}, a_{t+N})
$$

这样做的好处就是：

- less biased
- typically faster learning, esp. early on
	- 因为一开始的时候，$Q$ 值就是垃圾

但是，问题就是：由于 $\forall t'-t < N-1: s_{t'}, a_{t'}, s_{t'+1}$ 都是使用之前的策略采集的，因此其期望值就不等于 $Q(s_t, a_t)$。

- 在 $N=1 \iff N-1 = 0$ 时，尚且没有什么问题，毕竟不存在 $t' - t < 0$ 的
- 但是在 $N \geq 2$ 之后，就存在了这些状态

---

**How to fix it?**

- ignore the problem
	- 有一说一，直接忽略也不是不行，而且通常效果还不错
- cut the trace
	- 最关键的问题就在于，$a_{t'}$ 是否是通过当前策略 $\pi_{\phi'}(s_{t'})$ 取得的
	- 假设一条旧轨迹是 $(s_{t+1}, a_{t+1}, s_{t+2}, a_{t+2}, \dots)$，我们找出最大的 $n$，使得：$\forall t' < n: a_{t'} = \pi_{\phi'}(s_{t'})$，那么，我们就可以令 $y_t = \sum_{t'=t}^{t+N-1} \gamma^{t-t'} r_{t'} + \gamma^N \max_{a_{t+n}}Q_{\phi'}(s_{t+n}, a_{t+n})$。这样得到的 $y_t$，也是无偏的
		- 由于 $s_t, a_t$ 本身在 $Q(s_t, a_t)$ 中，因此我们不要求 $a_t = \pi_{\phi'}(s_t)$
- importance sampling

## Q-Learning with Continuous Actions

对于连续的动作空间，我们需要重新审视一下我们如何取得 max：


$$
\begin{aligned}
& \text{policy } &\pi\left(\mathbf{a}_t \mid \mathbf{s}_t\right)=\left\{\begin{array}{l}
1 \text { if } \mathbf{a}_t=\arg \max _{\mathbf{a}_t} Q_\phi\left(\mathbf{s}_t, \mathbf{a}_t\right) \\
0 \text { otherwise }
\end{array}\right. \\
& \text {target value } &y_j=r_j+\max _{\mathbf{a}_j^{\prime}} Q_{\phi^{\prime}}\left(\mathbf{s}_j^{\prime}, \mathbf{a}_j^{\prime}\right)
\end{aligned}
$$

对于上面的 policy 和 target value 的 max，如果是连续情况，那么就会很麻烦。

- 特别是 target value，因为在 DQN 中，计算 target value（从而进行更新）位于 inner loop，使用非常频繁

### Random Sampling

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/21_20_33_26_20250121203326.png"/>

最简单的方法，就是 random sampling。当然，除了无脑随便 sample 以外，使用 CEM 和 CMA-ES 可以 heuristically 提升 sample efficiency。

> [!note]
> 
> 对于 policy 而言，为了 $a_t$ 准确性，我们还是最好尽量增加样本量
> 
> 对于 target value，由于
> 
> - 我们本身是为了得到 $\max_a$ 而不是 $a$ 本身
> - 同时 $Q$ 被高估是常见的（从而 $Q$ 的高估和抽样的低估之间，某种意义上相互抵消了）
> - （正如上面所说）target value 的计算速度很重要
> 
> 因此，我们可以不需要那么多样本。

### Easily Maximizable Q-Functions

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/21_20_43_0_20250121204300.png"/>

由于，$f_{s, \phi}(a) := Q_\phi(s, a)$ 本身并不是二次函数，因此这样做，会降低 representation power

### Learn an Approximate Maximizer: DDPG

> [!info]
> 
> DDPG 可以说是 Q-Learning 和 Actor Critic 的混合体——两者的框架我们都可以套用

1. take some action $\mathbf{a}_i$ and observe ( $\left.\mathbf{s}_i, \mathbf{a}_i, \mathbf{s}_i^{\prime}, r_i\right)$, add it to $\mathcal{B}$
2. sample mini-batch $\left\{\mathbf{s}_j, \mathbf{a}_j, \mathbf{s}_j^{\prime}, r_j\right\}$ from $\mathcal{B}$ uniformly
3. compute $y_j=r_j+\gamma Q_{\phi^{\prime}}\left(\mathbf{s}_j^{\prime}, \mu_{\theta^{\prime}}\left(\mathbf{s}_j^{\prime}\right)\right)$ using target nets $Q_{\phi^{\prime}}$ and $\mu_{\theta^{\prime}}$
4. $\phi \leftarrow \phi-\alpha \sum_j \frac{d Q_\phi}{d \phi}\left(\mathbf{s}_j, \mathbf{a}_j\right)\left(Q_\phi\left(\mathbf{s}_j, \mathbf{a}_j\right)-y_j\right)$
5. $\theta \leftarrow \theta+\beta \sum_j \frac{d \mu}{d \theta}\left(\mathbf{s}_j\right) \frac{d Q_e}{d \mathrm{a}}\left(\mathbf{s}_j, \mu\left(\mathbf{s}_j\right)\right)$
6. update $\phi^{\prime}$ and $\theta^{\prime}$ (e.g., Polyak averaging)

第五步有两种的解释方法：

- 如果在 Actor Critic 的框架下：$Q_{\phi^{\prime}}\left(\mathbf{s}_j^{\prime}, \mu_{\theta^{\prime}}\left(\mathbf{s}_j^{\prime}\right)\right)$ 就是 $J(\mu_{\theta'})$ 的一个估计 $J_{\phi'}(\mu_{\theta'})$，因此本质上是在做策略梯度（只不过由于目前我们是 deterministic policy，因此没有 $\log$ 那一堆东西了）
- 如果在 Q-Learning 的框架下：我们希望拟合 $\mu_{\theta'}$，使得  $\mu_{\theta'}(s) = \mathop{\arg\max}_a Q_{\phi'}(s, a)$，也就是说，我们需要进行以下的最优化：$\operatorname{maximize }_{\theta'} Q_{\phi'}(s, \mu_{\theta'}(s))$。从而，我们采用梯度上升的方法

但是，如果用 Actor Critic 的框架，那么本质上还是最优化这个策略 $\theta$， 也就是数据必须是 on-policy 的。如果用 off-policy 的数据，那么还需要 importance sampling 等等。

如果用 Q-Learning 的框架，那么本质上是对 $Q_\phi$ 进行一个拟合。用 off-policy 的数据完全没问题。

## Practical Tips for Q-Learning

- ﻿﻿Q-learning takes some care to stabilize
	- ﻿﻿Test on easy, reliable tasks first, make sure your implementation is correct
		<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/21_21_56_25_20250121215625.png"/>
- ﻿﻿Large replay buffers help improve stability (比如说 1M replay buffer)
	- ﻿﻿Looks more like fitted Q-iteration
- ﻿﻿It takes time, be patient - might be no better than random for a while
	- 因为一开始，各个状态上的 Q 函数还没有收敛。等到收敛了，就好了
- ﻿﻿Start with high exploration (epsilon) and gradually reduce
	- 毕竟一开始，Q 函数就是 garbage，此时就是需要 high exploration

## Some Advanced tips for Q-Learning

### Gradient Clipping

Bellman error 可以非常大。比如说，$Q$ 对于某个 $s_0, a_0$ 的值是 100 万，然后计算的 $y$ 是 90 万。但是其他的 $s, a$ 对的函数值 $Q(s, a)$ 基本上都是个位数。这样，$s_0, a_0$ 的结果就会将其它所有结果覆盖住，从而出现问题。

如何进行 clipping 呢？

1. 直接 gradient clipping
2. 使用 Huber loss，相当于间接使用 L<sup>2</sup> 范数进行 clipping
	
	$$
	L(x) = \left\{\begin{aligned} &x^2/2 \quad \text{if } |x| < \delta \newline &\delta |x| - \delta^2 / 2 \quad \text{otherwise} \end{aligned}\right.
	$$
	
	从而：

	$$
	\nabla_x L(x) = \left\{\begin{aligned} &x \quad \text{if } |x| < \delta \newline &\delta \frac {x} {|x|} \quad \text{otherwise} \end{aligned}\right.
	$$

### Other Advises

- 请任何情况下务必使用 Double DQN
- N-step return 在开始的时候可以用用，在训练稳定下来之后就别用了
- 使用 exploration rate decay 和 learning rate decay
- 使用 Adam (如果原代码用的是 RMSProp，请换成 Adam)
- 请重复多次尝试训练，每一次训练用不同的 random seeds。因为不同随机化之间的差距很大（如下图所示，Venture 有一次就训练得很好）
	<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/01/21_21_56_25_20250121215625.png"/>
