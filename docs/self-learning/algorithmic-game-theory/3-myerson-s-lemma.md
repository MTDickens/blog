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

# An Abstraction for Auctions

为了更清晰地阐述 Myerson's Lemma，我们需要将一个 auction 进行形式化。在这里，我们使用 single-parameter environment abstraction。

- 共有 n 个 bidders
- 每个 bidder 有一个 private valuation
- 我们将最终的拍卖结果，抽象成一个向量 $(x_1, x_2, \dots, x_n) \in X$，其中 $X$ 就是所有的可行解（i.e.可能出现的拍卖结果）。

对于这个向量，不同的问题有不同的约束：

1. Single-item auction: 0-1 向量，且 $\sum x_i = 1$
2. Multiple-item auction (where each person can get at most 1 item): 0-1 向量，且 $\sum x_i = k$，k 为商品数
3. **Sponsored search auction**: 如果第 i 个 bidder 申请到了第 j 个 slot，那么 $x_i = \alpha$
4. ……

