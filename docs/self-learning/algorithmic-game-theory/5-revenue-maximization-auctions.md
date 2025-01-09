## Recap: Why We Start by Discussing Surplus Maximization?

1. 社会利益最大化，很多时候是**政府拍卖**的 main objective——相比在拍卖中的收益，政府更加注重社会收益。
2. 我们有 Myerson's Lemma，可以 get a surplus maximizing strategy for free。因此适合教学。

## Example: One Bidder and One Item

为什么 maximizing surplus 比 maximizing revenue 复杂得多？我们通过下面这个 one-bidder-one-item model 来简单阐述。

- 注意：假如我们不设置**最低价格**的话，显然这个 bidder 必然会“零元购”。因此设置最低价格是有必要的。

假设 seller 定价为 r，那么 $x = [r \leq v]$，i.e. 如果定价低于 v，那就买；否则就不买。为了 maximizing surplus，我们只需保证一定能卖得出去即可。因此，**直接将 r 设为 0 即可**。

如果要 maximizing revenue，那么就必须考虑 $v$ 的价格，并且**希望定价恰好就是 $v$**。因此，**我们还必须考虑 $v$ 的概率分布**。

### Bayesian Analysis

我们这里采用 Bayesian 的模型，并且仍然 focus on DSIC (**but not necessarily surplus-maximizing**) models，对“概率分布”进行严格化：

- The private valuation $v_i$ of participant $i$ is assumed to be drawn from 
    - a distribution $F_i$ with density function $f_i$ 
        - with **support contained in $[0, v_{\max}]$**. 
 
    We assume that 
    - **the distributions $F_1, \dots , F_n$ are independent** (but not necessarily identical). 
    
    In practice, these distributions are typically derived from data, such as bids in past auctions.
- The distributions $F_1, \dots , F_n$ are known in advance to the mechanism designer. The realizations $v_1, \dots , v_n$ of bidders’ valuations are private, as usual.
    - Since we focus on DSIC auctions, where **bidders have dominant strategies**, the **bidders do not need to know the distributions** $F_1, \dots , F_n$.


> [!info] Formalization
> 
> 如果定价为 $r$，那么期望收益就是：
> 
> $$
> \mathrm E[p(b)] = r (1 - F(r))
> $$
> 
> - $F$ 是 v 的概率分布的 CDF
> 
> 如果 $v \sim \text{Uniform}([0,1])$，那么显然 $\max \mathrm E[p(b)] = 1/4$（此时 $r = 1/2$）。

### What About More Complicated Scenario?

如果是 2 bidders 呢？采用和上面一样的均匀分布，如果是 2-price auction，那么 $\mathrm E[p(b)] = \mathrm E[\min\{v_1, v_2\}] = 1/2 * \mathrm E[v_1 + v_2 - |v_1 - v_2|] = 1/2(1/2+1/2-1/3) = 1/3$。

但是，如果增加一个最低定价 $r = 1/2$，i.e. 如果最高出价方的出价大于等于 1/2，但是需要支付的金额小于 1/2，那么就必须支付 1/2。那么：

$$
\begin{aligned}
\mathrm E[p(b)] &= 1/4 * 0 + 1/4 * \mathrm E[\min\{v_1, v_2\} | \min\{v_1, v_2\} \geq 0.5] + 1/2 * 1/2 \newline
&= 0 + 1/4 * (1/2 + 1/3 * 1/2) + 1/4 = 5/12
\end{aligned}
$$

可以发现：有所提高。实际上，对于“最低定价法”而言，已是最高（见下面的讨论）。

> [!info]+
> 
> 特别地，对于最低定价 $r = r_0$（小于这个最低定价的概率就是 $r_0$）：
> 
> $$
> \begin{aligned}
> \mathrm E[p(b)] &= r_0^2 * 0 +  * \mathrm E[\min\{v_1, v_2\} | \min\{v_1, v_2\} \geq r_0] + 2r_0(1-r_0) * r_0 \newline
> &= 0 + (1-r_0)^2 (r_0 + (1-r_0)/3) + 2r_0(1-r_0) r_0
> \end{aligned}
> $$
> 
> 不难证明：在 $[0,1]$ 上，最大值点就是 1/2。

但是：满足 **DSIC** 的方法（换言之：monotone functions）无穷无尽，如何找到最好的那一个呢？

## Expected Revenue Equals Expected Virtual Welfare

> [!info]+
>
> Virtual surplus: $\varphi(v_i) = v_i - \frac {1-F_i(v_i)} {f_i(v_i)}$ 

**Given that all bids are truthful**, 我们可以推出以下的结论：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/8_2_49_44_202406080249545.png"/>

### Optimization

如果我们希望最优化上面的 expectation，实际上就是**对于每一个 $\vec v$ 都进行最优化**，i.e. $\forall \vec v \in ([0, v_\max])^n: \underset{x(\vec v)}{\text{maximize}} \sum_{i=1}^n \varphi_i(v_i) x_i(\vec v)$。

- 注意：有时候，$\varphi_i(v_i)$ 会全为负数。此时，按照上面的说法，就应该让 $x(\vec v)$ 全是 0。这也印证了**设立最低价格的方法**是合理的。

同时，我们还希望所有的 $x_i(z;\vec v_{-i})$ 是 monotone function。不难看出，**充分条件就是：$\varphi_i(z)$ is monotone**。

- 对于高斯、指数、均匀分布而言，$\varphi_i(z)$ is indeed monotone, which is perfect since these two distributions are often used.
- 对于双峰分布和一些非常重尾的分布，可能也会让 $\varphi_i(z)$ 变成非 monotone

### Example: Revenue Maximization in the Context of Uniform i.i.d

对于 single item auction 而言，假设所有的 bidder 都是 i.i.d，那么，我们可以很容易地进行 revenue maximization auction：

1. 出价后，然后剔除其中 $v_i < v_\max / 2$ 的（i.e. $\varphi(v_i) < 0$ 的）
2. 然后，**如果有剩余**，就选出最大的，然后按照传统的 Vickery auction 来决定 payment 即可；**如果没有剩余，就不卖了**

此处相比传统意义上的 single item auction，就在于

1. 如果出价均低于 $v_\max/2$，就**不卖了**，从而 social surplus 为 0。
    - 因此，**我们在 revenue maximization 的同时，并没有实现 social surplus maximization**。
2. 如果**只有一人**出价大于等于 $v_\max/2$，那么表面上看来没有 second price。但是，实际上，由于 $X(z; \vec v_{-i} \text{ whose components are all less than }v_\max / 2)$ 在 $z = v_\max / 2$ 的时候会有一次阶跃（从 0 到 1），因此 $p_i(v_i) = v_\max / 2$，**也就相当于设置了一个 minimum price**

因此，是非常合理的拍卖规则。

> [!note]+ 一些 disadvantage
> 
> 对于某些分布而言，
> 
> 1. 有可能出价最高的 bidder 并没有获得最高的收益，因此**并不合理**。
> 2. 有可能**规则非常怪异繁琐**，解释性不强，人们不喜欢。
>    
> 因此，有必要放弃 optimal auction 的条件，使用更加合理+解释性好的算法，来实现 nearly optimal auction. And this will be discussed in our next lecture.