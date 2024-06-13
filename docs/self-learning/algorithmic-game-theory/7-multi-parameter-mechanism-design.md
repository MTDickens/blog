$$
\newcommand{argmax}{\mathop{\arg\max}}
$$

# Definition

Here are the ingredients of a general, multi-parameter mechanism design problem:

- $n$ strategic participants, or “agents;”
- A finite set $\Omega$ of outcomes;
- Each agent $i$ has a private valuation $v_i(\omega)$ for each outcome $\omega \in \Omega$.

Multi-parameter 自然包括了 single-parameter。以 single-item auction 为例，

- $\Omega = \{\emptyset, 1, 2, \dots, n\}$
    - $\emptyset$ 就是不分配
    - $i \in \{1, 2, \dots, n\}$ 就是分配给第 $i$ 个人
- $v_i(\omega) = \text{private valuation of } i * [\omega = i]$

但是，也有 non-trivial example of multi-parameter setting with a plausible application。

比如：$v_i(\omega) = \text{private valuation of } i * [\omega = i] - \text{private penalty of }i * [\omega \in \text{ opponents of } i]$。我们当然希望自己得到，但是即使得不到，也最好不要让竞争对手得到。

# The VCG Mechanism

> [!warning]+ 单变量和多变量的区别 1
> 
> 对于 single parameter environment 而言，由于 $v_i$ is single-parameter，因此 $b_i$ can be single-parameter。
> 
> 而这里的 $v_i: \Omega \to \mathbb R$，因此同样必须有 $b_i: \Omega \to \mathbb R$。
> 
> 也就是说，此处的 $b_i$ 是一个 function，而不仅仅是一个 variable

> [!warning]+ 单变量和多变量的区别 2
> 
> 单变量的表示中，$v_i$ 是一个固定的数：private valuation；$b_i$ 就是明面上的 valuation
> 
> - 如果我们把单变量的 $v_i$ 用函数表示：$\operatorname v_i(x_i) = v_i * x_i$。
> 
> 多变量的表示中，$\operatorname v_i$ 是一个函数：private valuation **for some situation**；$b_i$ 就是明面上的 valuation **for some situation**
> 
> - $\operatorname v_i(\omega)$ 可以是任意的函数。
> - 某些时候（比如说 $\operatorname v_i$ 是线性算子），$\operatorname v_i$ 可以被 parameterize。
>     - 如果最少只需要 1 个 parameter (i.e. $v_i$) 就可以表示，就是**单变量**。

**Claim** 如果我们使用 welfare-maximizing allocation: $\mathbf {x(b)} = \underset{\omega \in \Omega}{\argmax}\sum_{i=1}^n b_i(\omega)$，那么，令 payment 为

$$
p_i(\mathbf b) = \underbrace{\underset{\omega \in \Omega} {\max} \left(\sum_{j \neq i} b_j(\omega) \right)}_\text{without i} - \underbrace{\sum_{j \neq i} b_j(\omega^\ast)}_\text{with i}, \text{ where } \omega^\ast := \mathbf{x(b)}
$$

> [!note]- 公式的含义
> 
> - "without i": 就是在忽略 i 的 welfare 的情况下，计算出最大除 i 以外的 welfare 之和。
>     - $\underset{\omega \in \Omega} {\max} \sum_{j \neq i} b_j(\omega)$ 等价于 $\underset{\omega \in \Omega'} {\max} \sum b_j(\omega), \text{ where }\Omega' \text{ ignores }i$
> - "with i": 就是在考虑 i 的 welfare 的情况下，得出我们的策略，然后使用这个策略，计算出最大除 i 以外的 welfare 之和。
>     - 虽然 $\omega^\ast$ 考虑到了 $i$，但是 ${\max} \sum_{j \neq i} b_j(\omega^\ast)$ 可不考虑 $i$

*Proof*: Utility of $i$: $[v_i(\omega^\ast) + \sum_{j \neq i} b_j(\omega^\ast)] - \underset{\omega \in \Omega} {\max} \left(\sum_{j \neq i} b_j(\omega) \right)$。

$i$ 为了谋求最大化自己的 utility，只能够更改 $b_i$。因此，$\underset{\omega \in \Omega} {\max} \left(\sum_{j \neq i} b_j(\omega) \right)$ 就是一个常数（**后面我会解释这个常数的作用**）。我们可以忽略。现在就只剩下了 

$$
v_i(\omega^\ast) + \sum_{j \neq i} b_j(\omega^\ast)
$$

从而：
$$
\begin{aligned}
&\max_{b_i} v_i(\omega^\ast(b_i)) + \sum_{j \neq i} b_j(\omega^\ast(b_i)) \newline
\leq& \max_{\omega \in \Omega} v_i(\omega) + \sum_{j \neq i} b_j(\omega) \newline
=& v_i\left(\argmax_{\omega \in \Omega} v_i(\omega) + \sum_{j \neq i} b_j(\omega)\right) + \sum_{j \neq i} b_j\left(\argmax_{\omega \in \Omega} v_i(\omega) + \sum_{j \neq i} b_j(\omega)\right)\newline
=& v_j(\omega^\ast(v_i)) + \sum_{j\neq i} b_j(\omega^\ast(v_i))
\end{aligned}
$$

因此，$b_i = v_i$ 在任意的 $\mathbf b_{-i}$ 的条件下，一定不差于任意 $b_i \neq v_i$。从而为 DSIC。$\blacksquare$

> [!note]+ Another perspective
> 
> **Claim** 如果“世界因你而更美好”，那么就减去“因你而更美好”的那一部分。
> 
> $$
> \begin{aligned}
> p_i(\mathbf b) &= \underbrace{b_i(\omega^\ast)}_\text{bid} - \underbrace{\left[\sum_{j = 1}^n b_j(\omega^\ast) - \underset{\omega \in \Omega} {\max} \left(\sum_{j \neq i} b_j(\omega) \right) \right]}_\text{rebate}, \text{ where } \omega^\ast := \mathbf{x(b)} \newline
> 
> &= \underbrace{b_i(\omega^\ast)}_\text{bid} - \underbrace{\left[ \underset{\omega \in \Omega} {\max} \left(\sum_{j = 1}^n b_j(\omega) \right) - \underset{\omega \in \Omega} {\max} \left(\sum_{j \neq i} b_j(\omega) \right) \right]}_\text{rebate}, \text{ where } \omega^\ast := \mathbf{x(b)}
> \end{aligned}
> $$
> 
> - 如果 total welfare 因你的存在而增加，那么 payment 就减少相应的 total welfare

> [!question]+ $\underset{\omega \in \Omega} {\max} \sum_{j \neq i} b_j(\omega)$ 的作用
> 
> **Q**: Why bother add $\underset{\omega \in \Omega} {\max} \sum_{j \neq i} b_j(\omega)$ in payment formula, since it's not relevant in the proof?
> 
> **A**: 回忆 single-parameter 的 DSIC payment：我们加上了一个条件，"payment is unique if $b_j(0) = 0$"。如果没有这个条件，不仅 payment 可能 nonunique，还可能在 bid = 0 时为负（导致 negative utility，从而 impractical）。
> 
> 因此，我们也需要加上一个常数，保证 utility is non-negative。而 $\underset{\omega \in \Omega} {\max} \sum_{j \neq i} b_j(\omega)$ 恰好可以保证 non-negative utility（自行验证）。

# Example: Combinatorial Auctions

## Definition

A combinatorial auction has **$n$ bidders**

- for example, Verizon, AT & T, and several regional providers. 

There is **a set $M$ of $m$ items**, which are **not identical** 

- for example, a license awarding the right to broadcast on a certain frequency in a given geographic area. 

The outcome set $\Omega$ corresponds to $n$-vectors $(S_1, \ldots, S_n)$, with $S_i$ denoting the set of items allocated to bidder $i$ (its "bundle"), and with no item allocated twice. 

> [!note]+ Observation
> 
> 1. There are $(n + 1)^m$ different outcomes, i.e. $|\Omega| = (n+1)^m$
>     - 因为对于 auctioneer 而言，每一个物品，可以分配给 $n$ 个 bidder 中的一个，或者不分配。
>     - 但是，一个物品不可以同时分配给多个人，因此不是 $2^{nm}$
> 1. Each bidder $i$ has a private valuation $v_i(S)$ for each bundle $S \subseteq M$ of items it might get. 
>    
>    Thus, each bidder has $2^m$ private parameters, i.e. function $b_i: \Omega \to \mathbb R$ is actually $b_i: \mathbb B^n \to \mathbb R$
>     - 因为对于第 $i$ 个 bidder 而言，每一个物品，可以分配给 $i$，或者不分配。
>     - 同时，这里做一个简化：每一个 $b_i$ 只关心自己得到什么，不关心别人。因此只关心 $S_i \in \mathbb B^n$，而不是整个 $\omega = (S_1, \dots, S_n) \in \Omega$

> [!note] Assumptions
> 
> One generally assumes that $v_i(\emptyset) = 0$ and that $v_i(S) \leq v_i(T)$ whenever $S \subseteq T$ (i.e., "free disposal").


## Computational Intractability of Welfare-Maximization

有两大问题：

1. 最重要的问题：由于 $b_i$ 有 $2^m$ 个参数。当拍卖数量比较多的时候，$2^m$ 会爆炸式增长。没有 bidder 想全部说出来，也没有 auctioneer 想听。
2. 其次，surplus maximization 是 NP-hard problem。

其中，第一个问题，可以使用类似于 English auction (i.e. ascending auction，也就是喊价拍卖) 的方式，在平均意义上解决（当然最坏还是需要指数级别）；第二个问题，就是近似算法了。

## Problems on Revenue

这里举两个例子：

**第一个例子** 假如有 2 个 bidders：$V_1(AB) = 1, V_1(other) = 0$；$V_2(AB) = V_2(A) = 1, V_2(other) = 0$。

那么，显然随便选一个，都可以实现 maximal surplus (i.e. 1)。同时，revenue 就是 1（无论最终分给了 1 还是 2，rebate 都是 0）。

**第二个例子** 假如有 3 个 bidders：$V_1(AB) = 1, V_1(other) = 0$；$V_2(AB) = V_2(A) = 1, V_2(other) = 0$；$V_3(AB) = V_3(B) = 1, V_3(other) = 0$。

那么，显然 A 分给 2，B 分给 3，是唯一能够实现 maximal surplus (i.e. 2) 的方式。但是，**由于 2 和 3 的 rebate 都是 1，因此 payment 就会变成 0**。从而 revenue = 0, how ridiculous!

> [!note]
> 
> 回想一下 Vickrey auction，可以发现 collusion 或者 false-name bidding 根本无效。但是，在这里，collusion（比如 2, 3 避免价格战，都只要一个）和 false-name（比如 2 为了零元购，就故意设立一个 3）

## Yet Another Problem

Ascending auction 是重复博弈，因此就存在了各种使用数字进行合作、恐吓等等的可能性。如下：

For example, Cramton and Schwatz found that, in an early and relatively uncompetitive spectrum auction, bidders used the low-order digits of their bids to effectively send messages to other bidders. 

Let’s consider license #378 in that auction, for spectrum use rights in Rochester, MN. USWest and McLeod were battling it out for this license, with each repeatedly outbidding the other. Apparently, USWest tired of this bidding war and switched to a retaliatory strategy — bidding on a number of licenses in other geographical areas on which McLeod was the standing high bidder, and on which USWest had shown no interest in previous rounds. McLeod ultimately won back all of these licenses, but had to pay a higher price due to USWest’s bids. 

To make sure its message came through loud and clear, all of USWest’s retaliatory bids were a multiple of 1000 plus 378 — presumably warning McLeod to get the hell out of the market for Rochester, or else. This particular type of signaling can be largely eliminated by forcing all bids to be multiples of a suitably large number, but other opportunities for undesirable strategic behavior remain.

# Case Study: Spectrum Auction

## Terminology

> [!info]+ A dichotomy
> 
> There is a fundamental dichotomy between combinatorial auctions in which items are *substitutes*, and those in which items are *complements* — with the former being far easier, in theory and in practice, than the latter.

*Substitutes* 就是 $v(AB) \leq v(A) + v(B)$；*complements* 就是 $v(AB) > v(A) + v(B)$。前者比后者简单很多，原因如下：

> [!info]+ Why complements are intractable?
> 
> 考虑一下后者的极端例子：Consider an auction setting with a set $M$ of distinct goods. Each bidder $i$ has a publicly known subset $T_i \subseteq M$ of goods that it wants, and a private valuation $v_i$ of getting them. If bidder $i$ receives the goods $A_i \subseteq M$ at a total price of $p$, then its utility is $v_i x_i - p$, where $x_i$ is 1 if $A_i \supseteq T_i$ and 0 otherwise.
> 
> - 也就是说：每一个 bidder 只考虑获取特定的一组。如果能够获取，那么 welfare 就为 $v_i$，否则就为 0
> 
> 在这种情况下，任意 **maximum-weight independence set** 问题可以 reduce 到一个相似规模的 **welfare maximization of this auction**。Thus, since independent set problem is NP-hard, welfare maximization problem of this auction must be NP-hard, let alone DSIC.

虽然在 spectrum auction 中，*complement* 非常常见，但是为简单起见，我们这一次就只考虑 *substitutes*。

## Rookie Mistakes

There are two naive mistakes that beginners often make:

1. Sequential auction
2. Seal-bid single-item auction

### Sequential auction

假如说组织两次拍卖，而且卖的是 identical items。

然后，

- 如果我的 **valuation 最高**，那么，最佳策略就是：第一次拍卖直接 skip，第二次拍卖用第三高的价格拿下。
    - 如果第一次不 skip，那么就要使用第二高的价格才能拿下
- 如果我的 **valuation 第二高**，那么，最佳策略就是：第一次拍卖拿下
    - 如果第一次不能拿下，那么第二轮就拿不下了

**从而，我的策略和其他人的 valuation 有关，因此，这个 mechanism 就不是 DSIC**。

- 换言之，这个 mechanism 会**迫使**每一个公司对其他公司的 valuation 进行估值。如果估值有偏差，那么可能拍卖结果就会很难看。

> [!note]+ Case Study: A Poorly-Designed Mechanism
> 
> In March 2000, Switzerland auctioned off 3 blocks of spectrum via a sequence of Vickrey auctions. The first two auctions were for identical items, 28 MHz blocks, and sold for 121 million and 134 million Swiss francs, respectively. This is already more price variation than one would like for identical items.
> 
> But the kicker was that in the third auction, where a larger 56 MHz block was being sold, the selling price was only 55 million!
> 
> The bids were surely far from equilibrium, and both the welfare and revenue achieved by this auction are suspect.

### Seal-bid single-item auction

这样会有*非常明显的问题*：假如说有 10 个相同的 licenses，你只想获得一个。那么，你就必须仔细考虑自己的出价：

- 不能太高，否则就会拿到多个
- 也不能太低，否则一个也拿不到

从而，出价必然不是真实的，而且 welfare 自然也难以 maximize。

*另外一个问题*：如果有 3 个 bidder，分别 bid 两个相同的 licenses，每个 bidder 只要一个。那么，如果进行两次 bid where each bidder targets only one license, then **one of the licenses is likely to have only one bidder and will thus be given away for free** (or more generally, sold at the reserve price).

## Simultaneous Ascending Auction

> [!info]+ What is "ascending auction"?
> 
> Let's illustrate an “ascending auction” by example. The following is more or less the “English auction”, familiar from movies, art auction houses, and so on. The basic idea is to **keep raising the proposed selling price until the demand equals the supply.** The parameter $\epsilon > 0$ is an a priori fixed increment amount.
> 
> 1. Initialize the price $p$ to 0.
> 2. The initial set $S_0$ of “active bidders” is all bidders.
> 3. For $t = 1, 2, \ldots$:
>    1. Ask each bidder of $S_{t-1}$ if they want an item at the price $p + \epsilon$. Let $S_t$ be the set of bidders that say “yes.”
>    2. If $|S_t| \leq k$, then halt. Sell an item to each bidder of $S_t$ at the price $p$. If there are items leftover (i.e., $k - |S_t| > 0$), sell them to an arbitrary subset of the bidders of $S_{t-1} \setminus S_t$ at the price $p$.
>    3. Otherwise, increment $p$ by $\epsilon$.


鉴于上面的问题，我们应该就使用 SAA (simultaneous ascending auction)。

简单来说，就是同时进行多个 ascending auction。为了避免 sniping（在结束瞬间之前对某个商品进行 bid）等等恶性事件，我们还要加 activity rules。其中一条就是：**随着时间的推移，你的 bid 数量不能够增加**

- 比如说，你***不能***之前没有任何 bid，结果在拍卖结束之前瞬间，增加到 10 个 bid，从而将许多商品便宜拿下
- 但是，你可以在觉得某件商品太贵的时候，将这个 bid 移动到其它商品去。
    - 这就至少保证了，在拍卖 identical items 的时候，如果某个 item 太贵，就移到另外一个 identical item 上去

### Benefits

这样做，既没有直接让不同 bidder 之间“串通”，也给了 bidder 之间交流的可能（避免恶性竞争/不均匀竞争）：

1. Price discovery: 假设有多个同样/类似的商品，那么，bidder 肯定是**哪一个 item 便宜，就把 bid 移动到哪一个上面**。从而，相同/类似的商品之间的价格**可以保持基本相同**，而不会出现 **bidder 一拥而上某一件商品，造成价格高；而其它同样的商品因为 bidder 少，因此价格低**。
2. Valuation discovery: 在现实中，**对某一些商品进行估价，本身也是需要花钱的**。因此，随着拍卖的进行，对于一些价格高到离谱的商品，你就可以不用考虑了，从而避免多余的估价。

### Vulnerabilities

#### Demand Reduction

假设 $V_1(A/B) = 10, V_1(AB) = 20, V_2(A/B/AB) = 8$（也就是：1 号愿意要两件商品，且多一件就价格翻倍；2 号只愿意要一件）。

在 VCG 机制下，welfare maximization 显然是两件都给 $V_1$，然后，$V_1$ 需要支付 $b_i(\omega^\ast) - \left[ \underset{\omega \in \Omega} {\max} \left(\sum_{j = 1}^n b_j(\omega) \right) - \underset{\omega \in \Omega} {\max} \left(\sum_{j \neq i} b_j(\omega) \right) \right] = 20 - (20 - 8) = 8$。

如果是 SAA，

- 假如说 1、2 号不减少需求量的话，那么 $V_2$ 必然会一直叫价，直到**两件商品**价格均高于 8。虽然 1 号最终买下了两件商品，但是 utility 只有 4；而 2 号的 utility 为 0。
- On the other hand, 假如说 1、2 号**减少需求量**的话，那么两人各选一件商品——全部零元购，utility 相当大，只可惜 revenue 接近 0。

这只是一个简单的示例。在实际的复杂情形中，买家也会**尽量少选、慎选——越少人买，就越便宜，“你好我也好”**，从而需求量会下降。

#### Issue with Complements: Exposure Problem

假设 $V_1(AB) = 100, V_2(A/B/AB) = 75$。

在 VCG 机制下，welfare maximization 显然是两件都给 $V_1$，然后，$V_1$ 需要支付 75。

在 SAA 下，$V_2$ 会不断叫价，直到价格升到 75 元。但是，此时 $V_1$ 就会承受损失：utility = -50。所以，看起来，$V_1$ 的最优策略就是不叫价。

- 具体来说，按照 ascending auction 的规则（见上文）：如果两件商品的价格的当前价格小于 50 元，则 $V_1, V_2$ 都会不断叫价。如果两件商品的价格均等于 50 元，那么 $V_1$ 只好停止叫价，$V_2$ 见状也会停止一个商品的叫价。
  
  从而，最后 $V_2$ 以 50 元获得一件商品，赚了 25，而 $V_1$ *也许会*以 50 元获得另一件（具体要看机制，也许是随机分配给 $V_1$ 或者 $V_2$）。不难看出，$V_1$ 一分没赚，倒赔 50。

但是，如果 $V_2(A/B/AB) = 40$，那么 $V_1$ 还是应该出价的。从而就造成了 bidders 的**风险厌恶和谨慎出价**。

### Variations of SAA

One design approach is to tack on one extra “proxy” round after the SAA where bidders can submit package bids on any subsets of items that they want, subject to an activity rule.

- 具体细节见 [Ausubel et al](https://www.researchgate.net/profile/Paul-Milgrom/publication/4820599_Ascending_Proxy_Auctions/links/0fcfd50b3a959dfe75000000/Ascending-Proxy-Auctions.pdf)
- 这样做是为了 increase demand

A second approach is to **predefine a limited set of allowable package bids**, rather than allowing bidders to propose their own.

- 通常来说，a limited set of allowable package bids，会组成一个树形结构（保证分配的唯一性）。
  一个 bundle 就是树上的一个节点；单一的 item 是叶节点，且所有单一 item 都出现在叶节点上。只有你的 bid 比下面的每一个数都更高的时候，才能够获得这个 bundle
    - sum of bids of children nodes, 
    - sum of bids of grandchildren nodes, 
    - etc. (all the way to sum of bids of leaf nodes).
- 这样做是为了尽量避免 exposure problem

# Case Study: Reverse Auction by FCC

**Reverse auction 相比前面的 SAA，有着截然不同的机制。**

> [!note]+ Objective
> 
> FCC 的目标如下图所示：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/12_20_56_53_202406122056930.png"/>
> 
> **解释**: 假设 38~51 波段，在全国范围内都被占用。我们希望通过收购+再分配，使得 47~51 波段可以空出来，然后 FCC 会将这些波段进行再次拍卖。

FCC 的目标是：

1. 购买部分 TV station 的 license（越便宜越好）
2. 然后将剩下的波段**重新分配**，从而得以全部 pack 到一个更窄的区间内（比如 38 ~ 46）
3. 这样，就有一些全国范围内连续的波段可以被 freed，从而得以再次拍卖

同时，FCC 购买的波段应该 welfare-maximizing and feasible。

**Feasible**: 就是说，在**重新分配**阶段，对于某一个 bidder，我们只能更改其拥有的波段，但是不能更改其拥有的地区。同时，two TV stations with overlapping geographic areas cannot be assigned the same or adjacent channels。因此这是一个 NP-hard 问题（根据 lecture note 上所说，是一个 graph coloring problem）。

- 由于规模不算特别大，我们就用指数级别的方法来求解

**Welfare-maximizing**: 采用以下 greedy algorithm:

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/12_21_21_9_202406122121920.png"/>

>[!note]+ 补充说明
> 
> 如果有多个 $i$，我们就可以用各种 heuristic 来删除——价格最高的、波段平均价格最高的优先删除等等。最后就看哪一种 heuristic 最能够 maximize welfare，就用哪个
> 
> 不难发现，我们提到的上面两种 heuristic 都是（在 reverse auction 意义下）monotone 的。因此也是 DSIC。
> 
> 现实中，我们更希望用 ascending auction。把当前贪心算法中的 seal-bid 改成 ascending auction 的机制，也可以实现 monotone。