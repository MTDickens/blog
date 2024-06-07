# Counterexample: Knapsack Auction

1. Bidder $i$ has a public size $w_i$ (requirement) and a private valuation $v_i$
2. Seller has capacity $W$
3. Feasible set: $X = \{\vec x \in \{0, 1\}^n | \vec w \cdot \vec x \leq W \}$

因此，surplus maximization，就是：

$$
X(b) = \mathop{\arg \max}_{\vec x} ~\vec b \cdot \vec x
$$

本质上就是一个 0-1 背包问题（可以用简单的动态规划解决，详见 [Wikipedia](https://zh.wikipedia.org/wiki/%E8%83%8C%E5%8C%85%E9%97%AE%E9%A2%98#0-1%E8%83%8C%E5%8C%85%E9%97%AE%E9%A2%98:~:text=%E6%88%90%E7%BA%BF%E6%80%A7%E5%85%B3%E7%B3%BB%E3%80%82-,0%2D1%E8%83%8C%E5%8C%85%E9%97%AE%E9%A2%98,-%5B%E7%BC%96%E8%BE%91%5D)）。同时容易证明 $X(b)$ 是 monotone 的。

从而，$p_i(b)$ 就是：如果没分配到，就是 0；如果分配到了，就是 $z$，其中 $z$ 就是 $x_i$ 从 0 变 1 时的 $b_i$。

**但是，由于 knapsack problem is np-hard，因此 $X(b)$ is computationally intractable。从而，it's *NOT* a perfect auction.**

## How to deal with it?

Perfect auction 有三个条件：

1. DSIC
2. Maximal surplus
3. Poly-time

三者显然是**不兼容**的，我们必须丢弃一个条件。

- 实际上，(2) 和 (3) 两者之间都是不兼容的。因此丢弃 (1) 是没有用的。

因此，要么丢弃 (3)，要么丢弃 (2)。

> [!note]+
> 
> 丢弃 (3) 其实是可以的，因为 knapsack 实际上是一个 pseudo poly time 的问题：$\mathcal O(NW)$。如果 $W$ 本身不太大，那么时间是完全可以接受的。
> 
> - 同时，$p$ 同样可以以伪多项式时间算出来

# Algorithmic Mechanism Design

> [!abstract]+
> 
> 本质上，algorithmic mechanism design has **very similar flavor to algorithm design**。

Basically，你只需要设计出一个

- 高效的 approximation/heuristic 算法，外加 monotone 的附加条件
    - 比如说：对于 knapsack problem，有近似比为 $1 - \varepsilon$ 的多项式经典算法，**但是并不单调**。不过，我们只要对经典算法加以巧妙的变形，就可以转变成单调的算法。
- 然后直接套进 Myerson's Lemma 中计算，就可以得出一个**nearly perfect auction**

> [!question]+ An Open-Problem
> 
> 如果一个问题有多项式时间的、近似比为 k 的算法，是否说明一定也有多项式时间的、近似比为 k 的**单调**算法？
> 
> - 如果一定有，请告诉我将 nonmonotone 转换成 monotone 算法的 routine
> - 如果一定没有，请举一个例子

## Reasons of Getting Rid of DSIC

前面提到，很多问题的本质是 maximal surplus 和 poly-time 不兼容，和 DSIC property 没有直接关系。同样，很多情况下，如果满足了 poly-time maximal surplus，那么就可以 automatically 满足 poly-time DSIC (via some reduction)。

因此，**the reason why we don't want DSIC, is NOT to make it computationally tractable, but rather to get better revenue, etc.**

---

我们这里 get rid of DSIC，顶多从下面两方面入手：

1. Get rid of that every bidder has a dominant strategy
2. Get rid of that every bidder's dominant strategy is truthful bidding

第一个方面，我们确实可以通过丢弃 DSIC 的条件，从而得以创造出 **more aggressive payment**。这个 payment 可能不是 DSIC，但是有 equilibriums (or even pure-strategy ones)。只要我们有意让这个 equilibrium 成为现实，就可以获得比 DSIC 更高的 revenue。

第二个方面，假如说我们不丢弃 (1)，那么由于 every bidder has a dominant strategy，可以证明：Every bidder has a dominant strategy in every condition $\iff$ The mechanism is DSIC.

***证明***：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/7_18_45_27_202406071845678.png"/>

对于某个 mechanism M，假如说第 $i$ 个人的 dominant strategy 就是 $b_i = s_i(v_i)$，那么，我们可以设计一个 M'，该机制直接将输入 $\vec b$ 转换成 $s(\vec b)$，然后喂给 M。

这样，不难证明：$b_i = v_i$ 必然是 dominant strategy under mechanism M'，因为若 $b_i \neq v_i$，那么 $s(b_i)$ **可能**就不等于 $s(v_i)$ 了，也就是说，utility 不会变大，因此 $v_i$ 就是 dominant。$\blacksquare$

