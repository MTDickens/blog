# First & Second Price Seal-Bid Auction

***First Price***: 每一个 bidder 写下一个价格，然后 auctioneer 选择其中最高的价格，出价最高的 bidder pay the price and get the thing。

***Second Price***: 每一个 bidder 写下一个价格，然后 auctioneer 选择其中**第二高**的价格，但是，出价最高的 bidder pay the price and get the thing。

- 直观上的逻辑就是：理论上，出价最高的人，只需要出价比第二高的人**高出那么一点**，就可以赢得拍卖。因此，拍卖方不如就让出价最高的人赢，但是只用支付第二高的人的价格（也许加一个零头，不过无关紧要）。

## Quasi-Linear Utility Function

假设每一个 bidder 心中自有一杆秤：$v_i$。那么，其效用函数（i.e. 奖励函数）就是 $u_i(b_1, b_2, \dots, b_n) = v_i - p \text{ if } b_i > B, 0 \text{ otherwise}$，其中 $p$ 为其实际需要支付的金额，$B$ 就是其他人最大的 bid。

不难发现，**固定其他人的 bid，只改变自身的 bid，那么 $\phi_{i,\{b_1, b_2, \dots, b_{i-1}, b_{i+1}, \dots, b_n\}}(x) = u_i(b_1, b_2, \dots, b_{i-1}, x, b_{i+1}, \dots, b_n)$ 是线性的**。因此称为 quasi-linear。

## Analysis of Second Seal-Bid Auction

我们很容易证明：对于某一个人而言，**在固定下来其他人的出价（其他人的出价可以任意，但是要固定）之后**，这个人的出价必然是 $v_i$ 才能达到效用最大化。

对于任意一组出价 $b_1, b_2, \dots, b_{i-1}, b_{i+1}, \dots, b_n$，其中最大值为 B，假如我的出价是 $b_i$，那么效用就是 $v_i - B \text{ if } b_i > B, 0 \text{ otherwise}$。因此，必须 $v_i = b_i$。

## Properties of Second Seal-Bid Auction

1. ***Strong Incentive Guarantee***: 所有人都是**即使在利益驱动下，也是诚实的；而且这不仅是纳什均衡，还是 dominant strategy**。用专业术语，就是：dominant strategy incentive compatible (DSIC)
    - which means that **truth-telling is a weakly-[dominant strategy](https://en.wikipedia.org/wiki/Dominant_strategy "Dominant strategy")**
2. ***Strong Performance Guarantee***: 产生的社会效用是最大化的。
    - 此处的社会效用，就是**在这次拍卖之后，社会得到的总收益**。用数学严格化表示，就是：$\sum_{i}x_i v_i \text { subject to } \sum_{i} x_i = 1$
        - 其中，$x_i = \text{[拿到了多少件物品]}$ 。对于单次拍卖，此处只能为 $0, 1$。
        - 对于单次拍卖而言，简单来说，就是**物品让最需要它的人取走了**
    - 某种意义上来说，就是自私自利的行为，竟然实现了共产主义（按需分配）
3. ***Computational Efficiency***: 显然，second seal-bid 是多项式复杂度的（实际上，还是线性复杂度的）。

> [!summary]+ 
> 
> 上面两个 properties，分别的意义就是 optimal revenue (for auctioneer) and optimal social surplus。最下面的，就不用我说了，只要是 CSer，就肯定会考虑。

# Case Study: Sponsored Search Auctions

> [!abstract]+
> 
> 我们此次拍卖的商品是 "slot"，广告槽位。
> 
> 我们拍卖物品的性质和之前不一样了：
> 
> 1. 拍卖多个商品
> 2. 拍卖的商品价值不一样。另，我们这里的价值，可以用**点击率**（i.e. 某一个访客点击这个“商品”的概率）

我们要做出以下假设：

1. 令第 i 个 slot 的点击率（i.e. click through rate, CTR）为 $\alpha_i$，那么必须有 $\alpha_1 > \alpha_2 > \dots > \alpha_n$。
2. $\alpha_i$ has nothing to do with bidder, i.e. the advertisement it shows.
    - 其实这个假设很不靠谱，但是解决方法很容易：只要将每一个 bidder 的广告质量进行量化，然后乘以 $\alpha_i$，就可以计算出实际的点击率。当然，算法与简单假设下的不太一样。
3. Bidder 关心的是 $\alpha_i (v_i - p)$ 最大化，i.e. 点击率越大越好，同时每次点击的价格 p 不能太大

同时，我们希望达成以下的目标：

1. DSIC
2. Optimal social surplus: $\sum_{i=1}^n\alpha_i v_i$ 最大化
3. 同时，复杂度是多项式级别的，最好线性时间内完成

至于细节如何，请看下一篇！