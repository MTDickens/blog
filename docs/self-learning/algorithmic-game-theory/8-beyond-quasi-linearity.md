# A "Small" Change to Our Utility Function

如果我们的 utility function 如下所示：

$$
\operatorname{utility}(\omega, p_i) =\left\{ \begin{matrix}
v_i(\omega)-p_i &\text{if } p_i \leq B_i \newline
-\infty &\text{if } p_i > B_i
\end{matrix}\right.
$$

- 真实案例：长期的收益很可观（i.e. $v_i$），但是短期没这么多钱（i.e. $B_i$）

此时就造成了 payment 和 utility 的非线性性。同时，Myerson's lemma 也用不了了。因为生成的 payment 可能导致很多 bidder "unaffordable"。

> [!note] Demand Function of Each Bidder
> 
> 假设总共有 $m$ 个物品：
> 
> $$
> \hat D_i(p) =\left\{ \begin{matrix}
> \min \{\lfloor \frac {\hat B_i} p \rfloor, m \} &\text{if } p_i < b_i \newline
> 0 &\text{if } p_i > b_i 
> \end{matrix}\right.
> $$

## First Cut: The Market-Clearing Price

具体详见 [timroughgarden.org/f13/l/l9.pdf](https://timroughgarden.org/f13/l/l9.pdf)。

虽然分配策略是单调的（直观来说：bid 更少的钱，只会让卖方认为你的购买力更低），但是由于 payment 并不是由 Myerson's lemma 推出来的，正好相反，payment 决定了具体的分配策略。因此并不满足 DSIC（反例也见上面的 pdf）。因此，需要别的策略。

## DSIC: Clinching Auction

> [!note] Altered Demand Function
> 
> 假设目前剩下 $s$ 个物品：
> 
> $$
> \hat D_i(p) =\left\{ \begin{matrix}
> \min \{\lfloor \frac {\hat B_i} p \rfloor, s \} &\text{if } p_i < b_i \newline
> 0 &\text{if } p_i > b_i 
> \end{matrix}\right.
> $$

算法：

- Initialize p = 0, s = m
- While s > 0:
    - Increase $p$ until there is a bidder $i$ such that $\underbrace {s - \sum_{j \neq i} \hat D_j(p)}_{:= k} > 0$.
    - Give $k$ goods to bidder $i$ at price $p$ (theses good are “clinched”).
    - Decrease $s$ by $k$.
    - Decrease $\hat{B_i}$ by $p \cdot k$

*Proof (DSIC)*: 首先看一下 $\hat D_i(p)$ 的形式：除了最后的条件以外，其它都与 $b_i$ 无关。同时，$p$ 是单调上升的。因此，我们就从这个条件入手。

假设 $i, \vec b_{-i}$ 不变：

1. 如果 $b_i < v_i$，那么拍卖在 $p \leq b_i$ 的时候是不变的，在 $b_i < p < v_i$ 的时候，你已经失去了获得物品的机会，因此肯定不比 $b_i = v_i$ 更好。
2. 如果 $b_i < v_i$，那么拍卖在 $p \leq v_i$ 的时候是不变的，在 $v_i < p < b_i$ 的时候，你仍然有可能得到物品，但是此时得到物品的 utility 是负的。因此也不会比 $b_i = v_i$ 更好。■
