$$
\newcommand{E}{\mathbf E}
\newcommand{v}{\mathbf v}
$$

> [!abstract]+ Our Goal Today
> 
> In the context of non-i.i.d auction (to be specific, non-identical, but still independent), is there still some
> 
> Are there **simpler, more practical, more robust** auctions that we can prove that are *near*-optimal?

> [!info]- An Open Question
> 
> How to define one auction is simpler than the other? Although we shall see many cases where one auction is definitely simpler than the other, but how to quantize it?

# Prophet Inequality

> [!abstract]+
> 
> Prophet Inequality 的意思就是：假如有一个全知的 prophet, 我们也有一种策略，使得我们的收益可以达到 prophet 的至少 1/2。

**Theorem 2.1 (Prophet Inequality)** For every sequence $G_1, \dots, G_n$ of independent distributions, there is strategy that guarantees expected reward $\frac 1 2 \E_\pi[\max_i \pi_i ]$. In fact, there is such a very simple threshold strategy $t$, which accepts prize $i$ if and only if $\pi_i \geq t$.

*Proof*: 

设 $q(t) = \Pr[\forall i: \pi_i < t]$。 

$$
\begin{aligned}
&\E[\text{payoff of t-threshold strategy}] \newline
=& (1-q(t)) * t + \sum_{i=1}^n \E[\pi_i - t | \forall j < i: \pi_j < t, \pi_i \geq t] * \Pr[\forall j < i: \pi_j < t, \pi_i \geq t] \newline
=& (1-q(t)) * t + \sum_{i=1}^n \E[\pi_i - t | \pi_i \geq t] * \Pr[\forall j < i: \pi_j < t] * \Pr[\pi_i \geq t] \newline
\geq& (1-q(t)) * t + \sum_{i=1}^n \E[\pi_i - t | \pi_i \geq t] * q(t) * \Pr[\pi_i \geq t] \newline
=& (1-q(t)) * t + q(t) \sum_{i=1}^n \E[(\pi_i - t)^+] \quad \text{where} (\pi_i - t)^+ \text{ means } \min(\pi_i - t, 0) \newline
\end{aligned}
$$

又由于：

$$
\begin{aligned}
\E[\max_i \pi_i] &= \E[t + \max_i (\pi_i - t)] \newline
&\leq t + \E[\max_i(\pi_i - t)^+] \newline
&\leq t + \sum_{i=1}^n \E[(\pi_i - t)^+]
\end{aligned}
$$

因此：$\E[\text{payoff of t-threshold strategy}] \geq (1-q(t))t + q(t)(\E[\max_i \pi_i]-t)$。令 $t\in q^{-1}(1/2)$，显然 $\E[\text{payoff of t-threshold strategy}]  \geq \E[\max_i \pi_i] / 2$。$\blacksquare$

> [!note]+ Further Notes
> 
> **首先**，这个 1/2 bound 是紧的。
> 
> **其次**，我们还可以得出更强的结论：如果不是取 the first value that is above the threshold，而是取 the **worst** value (among all values) that are above the threshold，也是 1/2 的 bound。
> 
> - 具体来说，证明的时候，只需要把第二行改成 $(1-q(t)) * t + \sum_{i=1}^n \E[\pi_i - t | \forall j \neq i: \pi_j < t, \pi_i \geq t] * \Pr[\forall j \neq i: \pi_j < t, \pi_i \geq t]$（也就是用 $j \neq i$ 代替 $j < i$），即可

## Example: Single-Item Auction

对于 single-item auction 而言，由于 $\E_\v[\sum_{i=1}^n p_i(\v)] = \E_\v[\sum_{i=1}^n \varphi_i(\v) x_i(\v)]$，因此我们所需要的，就是最大化右侧：$\max_x \E_\v[\sum_{i=1}^n \varphi_i(\v) x_i(\v)] = \E_\v[\max_i (\varphi_i(\v))^+]$。

而我们的简化版策略就是：选取一个适当的 $t$，然后只将物品分配给 $i, s.t. \varphi_i(v_i) > t$。至于分配策略，随便任意的分配策略都可以。

- 因为上面的 further note 说到：即使是 worst value，也是 1/2 bound。因此任意分配策略必然不差于 worst value，从而 bound 也是 1/2。

> [!warning]+ Still an Issue
> 
> 仍然有一个问题：以 eBay 为例，不同的买家有着不同的 distribution，但是你的 $t$ (i.e. reserve price) 不能因为买家的不同而变动——你只能固定一个 reserve price，然后有一些人会来买，有些人不来。
> 
> An interesting open research question is to understand how well the Vickrey auction with an anonymous reserve price (i.e., eBay) can approximate the optimal expected revenue in a single-item auction when bidders valuations are drawn from non-i.i.d. regular distributions. 
> 
> Partial results are known: **there is such an auction that recovers at least 25% of the optimal revenue, and no such auction always recovers more than 50% of the optimal revenue.**
> 
> - 具体详见 [timroughgarden.org/f13/l/l6.pdf](https://timroughgarden.org/f13/l/l6.pdf)

## Case Study: Reserve Prices in Yahoo! Keyword Auctions

### 理论依据

假设所有 bidder 均为 i.i.d. subject to $F$, where $F$ is a [regular distribution](https://en.wikipedia.org/wiki/Regular_distribution_(economics))，那么，利润最优的策略就是：rank bidders by bid (from the best slot to the worst) after applying the monopoly reserve price $\varphi^{-1}(0)$ to all bidders, where $\varphi$ is the virtual valuation function of $F$.

### 计算过程

首先，如何求出每个关键字的 $\varphi_{keyword}^{-1}(0)$？Yahoo 采用了**对数正态分布**来对 $F_{keyword}$ 进行建模（this is somewhat ad hoc, but really doesn't matter）。通过统计历史上的出价信息，求出该分布的 $\mu, \sigma$。从而得到 $\varphi_{keyword}$，从而可以反求 $\varphi_{keyword}^{-1}(0)$。

> [!info]+ 实际的统计
> 
> 由于 Yahoo! 使用的是 Generalized Second Price auction，因此
### 结论

通过理论计算，可以发现之前的 reserve price 过低（$0.1 左右，而理论上的 optimal reserve price 是 $0.3 \~ $0.4）。

提高 reserve price 之后，keywords with **thin market** 的利润有明显的上升。这是因为对于竞争激烈的市场，往往 reserve price 起不到作用（因为很大概率，会有至少两个 bids 的价格大于等于 reserve price），而 thin market 可以起到很好的作用。

# Prior-Independent Auctions

> [!abstract]+
> 
> 有时候我们面对的市场是 thin market——没有什么统计数据，因此完全无法利用先验知识。

我们不妨退回到最基础的 single-item auction with i.i.d. $v_i$。在这个条件下，我们可以得到一个很经典 yet 很 fancy 的结论。

**Theorem 4.1 (Bulow-Klemperer Theorem)** Suppose all $v_i$'s are i.i.d.'s. Let $F$ be a regular distribution and $n$ a positive integer. If we only consider those DSIC mechanisms, then:

$$
\E_{v_1,\dots, v_{n+1} \sim F} [Rev(\mathrm {VA}) (n + 1 \text{ bidders})] ≥ \E_{v_1,\dots, v_{n+1} \sim F}  [Rev(\mathrm{OPT}_F ) (n \text{ bidders})]
$$

*Proof*: 我们引入第三个 $n+1$-bidder auction 作为 auxiliary auction。只需要证明 LHS auxiliary auction, RHS 不优于 auxiliary auction, 就可以。

Auxiliary auction 是：

1. 我们首先在前 $n$ 个 bidder 上进行 optimal auction
2. 如果物品没有被分配，就将物品免费给第 $n+1$ 个 bidder

易证: RHS 不优于 auxiliary auction。

- 实际上，RHS 和这个 auction 的 revenue 是相同的

> [!info]
> 
> **Lemma 1** Vickrey auction 是所有必须分配物品的 mechanism 中 revenue 最高的
> 
> *Proof*: 给定任何一个 mechanism，如果 mechanism 满足 DSIC，那么必然满足 $\E_\v[\sum_{i=1}^n p_i(\v)] = \E_\v[\sum_{i=1}^n \varphi_i(\v) x_i(\v)]$。从而：如果 $\vec x(\mathbf v) \neq \mathbf 0$（i.e. 必须拍卖出去），那么策略就是每一次都分配给最大的 $\varphi_i(\mathbf v)$。
> 
> 由于 $F$ is regular distribution, by definition $\varphi_i(\mathbf v)$ is monotone。因此，最优策略就是 **give the good to the highest bidder**，DSIC 下对应的 mechanism 就是 **Vickrey auction**。$\blacksquare$


由于 auxiliary auction **一定会将物品分配给某个人**，因此，Vickrey auction (LHS) 必然不差于 auxiliary auction。$\blacksquare$
