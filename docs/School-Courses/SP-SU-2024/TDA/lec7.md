# 函数“时间”序列

**略**

# 持续图上的度量以及稳定性

**略**

有两种距离，Wasserstein-p 距离和 Bottleneck 距离。

对于两个点集 $X$ 和 $Y$，不妨假设两者的点数一样多（假设不一样多，我们可以往点数较少的一方，在对角线上加点，毕竟对角线上相当于出生即消亡，可以随便加）。

那么就有（$\mu$ 是 $X \to Y$ 的一个双射）：

- $\operatorname{bottleneck}(X, Y) = \operatorname{Wasserstein-}\infty(X, Y) = \inf_\mu \sup_{x \in X} \norm{x - \mu(x)}_\infty$
- $\operatorname{Wasserstein-p}(X, Y) = \inf_\mu (\sum_{x \in X} \norm{x - \mu(x)}_\infty^p)^{\frac1p}$

结论：如果对点云/函数做一个小扰动，那么扰动之后生成的持续同调的 PD 图的两种度量，和扰动之前的相比，变化也很小。

# 度量的计算以及加速算法

如果希望在 PD 图上，计算两个点集之间的距离，可以使用 Wasserstein Distance 或者 Bottleneck Distance。

不管使用哪一种，本质上还是最优化问题，而且找的是一个双射 $\mu: X \to Y$。

---

因此，可以规约为一个最优二分图匹配问题。具体来说：

如果采用的是 Wasserstein-p 距离，那么对于任意 $x \in X, y \in Y$：
$$
e_p(x,y) = \begin{cases}
 & \norm{x-y}_\infty^p \text{ if x, y are neither on diagonal}  \newline
 & \abs{x_x - x_y}^p(\text{or }\abs{y_x - y_y})^p \text{ if one of y or x is on diagonal} \newline
 & 0 \text{ if both on diagnal}
\end{cases}
$$
目标是：找二分图上的一个完美匹配，使得权重之和最小。

如果采用的 bottleneck，那么就是：
$$
e_{\text{bottleneck}}(x,y) = \begin{cases}
 & \norm{x-y}_\infty \text{ if x, y are neither on diagonal}  \newline
 & \abs{x_x - x_y}(\text{or }\abs{y_x - y_y}) \text{ if one of y or x is on diagonal} \newline
 & 0 \text{ if both on diagnal}
\end{cases}
$$
目标是：找二分图上的一个完美匹配，使得最大权重最小。

---

对于 bottleneck（最大权重最小）的问题，不难看出问题是单调的，因此可以采用二分法去做。

具体流程：

- 将所有边长从大到小排个序
- 从边长中位数开始，以二分的方式
    - 删去**大于**该边长的所有边
    - 试图求一个完美匹配
    - 如果能够求出来，就说明最大权重可能还可以更小，就去搜索 $\frac {a + m} 2$
    - 如果求不出来了，就说明最大权重必须更大，就去搜索 $\frac {b + m} 2$
    - 直到“自己能够求出来，比自己小的权重中最大的权重求不出来”为止，此时，自己的权重就是答案

算法时间复杂度（边数为 $n^2$）：

1. 排序：$\mathcal O(n^2 \log n)$
2. 二分查找：$\mathcal O(\log n * \text{Dinic})$
3. Dinic: $\mathcal O(n^{2.5})$

因此，时间复杂度就是 $\mathcal O(n^{2.5} \log n)$

---

对于 Wasserstein，就是求二分图完美匹配最小流。具体算法是匈牙利算法的一个变种，这里只把图贴上来，~~因为目前太困了就先不管了~~

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_22_26_39_202405212226519.png" style="zoom: 80%;" />

