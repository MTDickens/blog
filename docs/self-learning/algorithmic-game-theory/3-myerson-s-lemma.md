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

