## Does pure Nash equilibrium always exist/unique?

> [!note]+ Recap
> 
> 在我们之前的讨论中，atomic selfish routing game 可以是一种 potential game（位势博弈），而 potential game is guaranteed to have at least an equilibrium。
> 
> 1. 在 potential game 之上，我们可以进一步推广至任意 congestion game（拥塞博弈）
> 2. 另外，由于 non-atomic selfish routing game 本质上就是 atomic selfish routing game with infinitely many players，因此也可以将 potential function 变成积分形式。这样的 potential function，可以证明是连续可微且凸的，又由于所有流构成一个紧集，因此必然存在全局最小值点，也就是 Nash equilibrium。**不仅如此，而且所有的 equilibria 的 cost 都相同 (i.e. unique up to cost)。**
>     - **注意**：atomic selfish routing game 是**离散**问题，因此会出现 **equilibria 不唯一**的情况。此时，我们的 POA 取 **worst-cost equilibria**。


> [!note]+ Bad news: even existence can't be guaranteed
> 
> 即使是 ***existence*** of pure-strategy Nash equilibria，只要对限制稍加放宽，就不一定成立了。比如，仍然是 atomic 的情况，但是 different players different sizes，就会造成**不存在纯策略纳什均衡点**的情况：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/19_2_12_11_202407190212756.png"/>
> 
> 假设两个玩家的流量分别为 $r_1 = 1, r_2 = 2$，都是从 s 到 t，设 $P_1, P_2, P_3$ 和 $P_4$ 分别表示路径 $s \rightarrow t$, $s \rightarrow v \rightarrow t$, $s \rightarrow w \rightarrow t$ 和 $s \rightarrow v \rightarrow w \rightarrow t$。那么：
>  
> 1. 如果玩家2选择路径 $P_1$ 或 $P_2$，则玩家1的唯一反应是选择路径 $P_4$，以最小化其成本。 
> 2. 如果玩家2选择路径 $P_3$ 或 $P_4$，则玩家1的唯一最佳反应是选择路径 $P_1$。 
> 3. 如果玩家1选择路径 $P_4$，则玩家2的唯一最佳反应是选择路径 $P_3$。 
> 4. 如果玩家1选择路径 $P_1$，则玩家2的唯一最佳反应是选择路径 $P_2$。
> 
> ---
> 
> 除此之外，还有无穷无尽的博弈规则，它们同样没有 pure-strategy Nash equilibrium.

## Four Categories of Nash equilibrium

> [!note]+ Background
> 
> **Cost-Minimization Games**
> 
> A cost-minimization games has the following properties:
> 
> - a finite number $k$ of players;
> - a finite strategy set $S_i$ for each player $i$;
> - a cost function $C_i(\mathbf s)$ for each player $i$, where $\mathbf s \in S_1 \times \cdots \times S_k$ denotes a strategy profile or outcome.
>   
> 以 atomic selfish-routing 为例：
> 
> - 共有 $k$ 个玩家
> - 每个玩家的策略集就是所有从 $s_i \to t_i$ 的路径
> - cost function $C_i(\mathbf s)$ 就是 $\sum_{e \in P_i} c_e(\sum_{j} [[e \in P_j]])$，也就是 $P_i$ 上所有边的 edge cost 之和

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/22_0_30_42_202407220030216.png"/>

### PNE: Pure Nash Equilibrium

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/22_0_50_47_202407220050270.png"/>

也就是说：如果只能改变自身策略，那么目前即最优。

### MNE: Mixed Nash Equilibrium

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/22_1_22_34_202407220122020.png"/>

- where $\mathbf \sigma$ denotes the **product distribution** of $\sigma_1 \times \cdots \times \sigma_n$

> [!note] 两种表示的等价
> 
> 从原始定义出发，应该是：
> 
> $$
> \mathbf E_{\mathbf s \sim \sigma}[C_i(\mathbf s)] \leq \mathbf E_{\mathbf s \sim \sigma_i' \times \mathbf{\sigma_{-i}}}[C_i(\mathbf s)]
> $$
> 
> - 也就是说，如果对方使用这个策略，那么我使用这个策略，一定不是最差的
> 
> 但是，由于：
> 
> $$
> \begin{aligned}
> &\mathbf E_{\mathbf s \sim \sigma_i' \times \mathbf{\sigma_{-i}}}[C_i(\mathbf s)] \newline
> = &\mathbf E_{s_i' \sim \sigma_i}[\mathbf E_{\mathbf s_{-i} \sim \mathbf{\sigma_{-i}}}[C_i(s_i', \mathbf s_{-i}) | s_i']] \newline
> = &\sum_{j=1}^{|S_i|} \Pr(s_i' = a_j) \mathbf E_{\mathbf s_{-i} \sim \mathbf{\sigma_{-i}}}[C_i(s_i', \mathbf s_{-i}) | s_i']
> \end{aligned}
> $$
> 
> - 其中：上式的 $s$ 都是随机变量，$a$ 是实际的策略。$S_i = \{a_1, a_2, \dots\}$
> 
> 因此，从原始定义出发的表示，和 Definition 是等价的

### CE: Correlated Equilibrium

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/22_1_35_59_202407220135949.png"/>

我们可以这么解释：

- 假如 $\sigma$ is publicly known，而且一个可信的第三方在 $\sigma$ 中进行 sample，然后将每一个 $s_i$ 私下告诉 player i
- player i 可以选择 follow i，也可以选择不 follow
    - 由于我已经知道了 $s_i$，因此我可以使用贝叶斯公式，推导出 $\mathbf s_{-i}$ 的条件分布。**结合我自己的实际策略**，我可以**推导出在其它人遵守 $s_j$ 的前提下的条件期望**
- 假如，**在其它人遵守 $s_j$ 的前提下**，不论我的实际策略是什么，都不会比老老实实遵循 $s_i$ 更优，那么，这就是 correlated equilibrium

> [!example]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/22_2_20_7_202407220220761.png"/>
> 
> - **Note:** 假如说 trusted third party 对 row player 说了 "you'd better stop"，那么 row player 通过条件概率，可以直接推得：$\Pr(\text{column = go}) = 1, \Pr(\text{column = stop}) = 0$。

> [!note]+ Proof: CE is superset of MNE
> 
> 在 MNE 中，所谓的 trusted third party，其实根本不重要——因为 $\sigma_1, \dots, \sigma_n$ 两两独立，因此任意玩家根本无法通过自己的抽取，得到其它玩家的

> [!note]+ Algorithm
> 
> - **直接计算**：可以使用单纯形法计算（因此已经是 P 问题）
> - **巧妙计算**：有一种 learning algorithm，可以更快地算出（之后介绍）

### CCE: Coarse Correlated Equilibrium

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/22_2_30_16_202407220230975.png"/>

如果 CE 成立，那么 CCE 必然成立；CCE 就是 CE 拿掉了 $s_i$ 这个 condition。因此，CCE 可以认为就是 CE 的一个上界。

同样，CCE 也有 learning algorithm 可以有效计算出来，而且比 CE 更快、更直接。