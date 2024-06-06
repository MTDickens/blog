# Methodology

理想情况下，以下三大性质都应该被满足：

1. DSIC
2. Optimal social surplus
3. 同时，复杂度是多项式级别的，最好线性时间内完成

对于 second seal-bid auction，我们已经证明了其可以满足；对于 sponsored search auction 乃至更复杂的拍卖问题，我们希望**有一个通用的 methodology，可以证明其三大性质是否满足**。

对此，我们的策略是：

1. 假设 (1) 成立（i.e. 所有人的出价都是 $v_i$），如何能够满足 (2), (3)
2. 然后，我们通过设计 payment，来实现 (1)

(2) 是重头戏，而我们可以通过 Myerson's Lemma 一窥究竟。

# Abstractions and Definitions
## An Abstraction for Auctions

为了更清晰地阐述 Myerson's Lemma，我们需要将一个 auction 进行形式化。在这里，我们使用 single-parameter environment abstraction。

- 共有 n 个 bidders
- 每个 bidder 有一个 private valuation
- 我们将最终的拍卖结果，抽象成一个向量 $(x_1, x_2, \dots, x_n) \in X$，其中 $X$ 就是所有的可行解（i.e.可能出现的拍卖结果）。

对于这个向量，不同的问题有不同的约束：

1. Single-item auction: 0-1 向量，且 $\sum x_i = 1$
2. Multiple-item auction (where each person can get at most 1 item): 0-1 向量，且 $\sum x_i = k$，k 为商品数
3. **Sponsored search auction**: 如果第 i 个 bidder 申请到了第 j 个 slot，那么 $x_i = \alpha$
4. ……

> [!note]+ 更加数学化的定义，以及我们这里的约束
> 
> 拍卖的过程，就是：
> 
> 1. Collect n bids: $b_1, b_2, \dots, b_n$
> 2. Choose who wins (**allocation rule**): $X(b) \in X \subset \mathbb R^n$
> 3. Determine the payment (**payment rule**): $p(b) \subset \mathbb R^n$
> 4. Utility vector: $U(b) = v \odot X(b) - p(b)$
>     - $\odot$ is the element-wise multiplication between vectors
> 
> 约束就一条：$\forall i, b: p_i(b) \in [0, b_i * x_i(b)]$
> 
> - 也就是说，seller 不会倒贴钱，而且 auctioneer 也不会收益为负

## Some Definitions of Allocation Rules

**定义 (implementable allocation rules)**：一个 allocation rule $\mathrm X(b)$ 被称为 implementable, if there exists a payment rule $\mathrm p(b)$, s.t. the seal-bid auction $(\mathrm X, \mathrm p)$ is DSIC.

- 比如：Award-the-good-to-the-highest-bidder rule，就是一个 IAR——可以使用 second-highest-bid payment 来实现
    - 而 award-the-good-to-the-**second**-highest-bidder rule 呢？我们好像找不到这样的 payment，而证明没有这样的 payment 貌似也不容易

**定义 (monotone allocation rules)**：简单来说，就是 $\mathrm X(b)$ 这个函数，对于 $b$ 的每一个**分量**，都是（不严格）单调的。

- 比如：Award-the-good-to-the-highest-bidder rule，就是 MAR；而 second-highest 就不是，因为如果出价第二高的增大自己的 $b_i$，直到高于最高的了，那么 $X(b_i)$ 就会从 1 变成 0。
- 可以看出：**monotonicity** 相比于 **implementability**，是比较好判断的一个性质


# Myerson's Lemma

> [!abstract]+
> 
> 简单来说，就是三部分：
> 
> 1. Implementability 和 monotonicity 等价
> 2. Monotonicity 可以推出唯一的 DSIC payment 方案
> 3. 这个唯一的 payment 方案是容易构造的

## Three Parts of Myerson's Lemma

一共有三个部分：

1. Implementability is **equivalent to** monotonicity, i.e. one $X(b)$ is implementable i.f.f. it's monotone
2. If $X(b)$ is monotone, then there's a **unique** payment rule such that the sealed-bid mechanism $\mathrm{(X, p)}$ is DSIC
    - 还需要加上一个限制：assuming the normalization that $b_i = 0$ implies $\mathrm p_i(\mathrm b) = 0$。
        - 不过在我们的 setting 中，由于 $\forall i, b: p_i(b) \in [0, b_i * x_i(b)]$，假如 $b_i = 0$，那么 $p_i(\mathrm b) \in [0, 0 * x_i(b)] \implies = 0$。因此这个条件是自然成立的。
3. The payment rule in (2) is given by an **explicit formula**

> [!info]+ **Corollary**: There is an awesome auction for sponsored search.
> 
> **证明**：
> 
> 为了实现 optimal social surplus，我们可以直接采取简单的贪心策略：**按照出价顺序分配槽位**。从而 $b_i$ 之间的顺序和 $X_i(b)$ 之间的顺序是一致的。
> 
> 而这个策略也显然是 monotone（出价更高，只会让你得到更不差的槽位），因此就可以实现 DSIC，从而 $v_i$ 之间的顺序和 $X_i(b) = X_i(v)$ 之间的顺序是
> 
> 同时，$p$ 可以直接简单地计算出来，因此复杂度也是线性的。
> 
> $\blacksquare$

## Proof

> [!abstract]+ Proof Sketch
> 
> Consider an allocation rule $x$, which may or may not be monotone. Suppose there is a payment rule p such that $(x, p)$ is a DSIC mechanism — what could $p$ look like? The plan of this proof is to **cleverly invoke the stringent DSIC constraint to whittle the possibilities for $p$ down to a single candidate**.
> 
> We will establish all three parts of the theorem in one fell swoop.

> [!info]
> 
> 注意：下图中的 $X(z)$，实际上代表 $X(z) := X_i(z;\vec b_{-i})$。$p(z)$ 同理。


<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/6_15_29_49_202406061529227.png"/>

简单来说，上述证明就是：通过夹逼定理，分间断和连续可导两种情况，将 $p(z)$ 在某点处的跳跃或者导数，通过 $X(z)$ 确定下来。这样，我们通过构造性证明的方式，证明了该引理。

从而，我们通过 Riemann–Stieltjes 积分（也就是允许 $\mathrm d$ 右侧是一个不连续函数的积分）的形式，就可以 $p(z)$ 表达出来。

# Application: Sponsored Search Auction

我们使用能够满足 optimal surplus strategy：谁给的多，就给谁优先分配。

对于只有间断点和导数为 0 区域的情况，我们直接在阶跃点求和即可。

不妨假设：$b_1 > b_2 > b_3 > \dots > b_n \geq b_{n+1} = 0$，从而：$x_1 = \alpha_1 > x_2 = \alpha_2 > \dots > x_k = \alpha_k > x_{k+1} = \alpha_{k+1} = 0 = x_{k+2} = \dots = x_n$（$b_{n+1}, \alpha_{k+1}$ 是为了下文方便而额外添加的）。

也就是说：

$$
p_i(b_i;\dots) = \sum_{j=i}^{k} b_{j+1} (\alpha_{j} - \alpha_{j+1})
$$
显然：

$$
\sum_{j=i}^{k} b_{j+1} (\alpha_{j} - \alpha_{j+1}) < \sum_{j=i}^2 b_{i+1} (\alpha_{j} - \alpha_{j+1}) =  b_{i+1} \alpha_i < b_i \alpha_i = b_i x_i
$$

> [!note]+ Observation
> 
> 1. $p_i(b_i; \dots)$ 满足 $\forall i, b: p_i(b) \in [0, b_i * x_i(b)]$。从而这个分配方式符合我们上面的限制。
> 2. $p_i(b_i; \dots)$ 和 $b_i$ 本身的**值**无关，而只跟 $b_i$ 的**顺序**有关。因此避免了用户的虚假报价。
>     - 和 second price auction 如出一辙
> 3. $p_i(b_i;\dots) = \sum_{j=i}^{k} b_{j+1} (\alpha_{j} - \alpha_{j+1}) = \alpha_i (\sum_{j=i}^k b_{j+1} \frac {\alpha_j - \alpha_{j+1}} {\alpha_i})$，因此，上面的公式的可解释性也很强：你需要支付的金额，就等于比你出价低的 bidder 的 bids 的**加权平均值**

> [!info]+
> 
> For historical reasons, **sponsored search auction 并不使用这个 DSIC 的策略，而是使用一个所谓 generalized second price auction**:
> 
> $$
> p_i(b_i; \dots) = b_{i+1} \alpha_i
> $$
> 
> - 上面的 payment，在非零的情况下，是**严格高于** DISC 的 payment 的（假设所有 bid 和 click rate 均不同），因此是更加 aggressive。
> - 虽然 generalized second price auction (GSP auction) 不是 DSIC，但是存在一个 equilibrium, which in some sense, simulating the dominant strategy of our DSIC payment.
>   
> 为什么 Google 当时不用这个呢？因为不知道理论。为何现在也不用？因为
> 
> 1. 已成惯性
> 2. 而且由于 $p_i$ 会涉及到**所有** bids，因此 Google 必须将所有 bids 均展示出来以示公正（免得 Google 内部虚报价格），从而**一个 bidder 的 bid 的就会被迫暴露给所有价格比他高的 bidders**。而这就会造成公司信息泄露。
>     - 对于 GSP auction，只会暴露给刚好高于自己的人。因此暴露面比较少。
> 3. 当然，还有一点，就是这个 DSIC 的策略太复杂了
