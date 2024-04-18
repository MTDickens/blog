# 单形的符号

如果 $L \sub K$，且 K 只比 L 多一个单形（记作 $\sigma$​，假设是 d-单形），那么，不难证明：

1. 如果 $\sigma$ 和同维单形构成了闭链，那么 $\beta_d(K) = \beta_d(L) + 1$​
2. 如果 $\partial\sigma$ 不能被 $B_{d-1}(K)$ 的基线性表出，那么 $\beta_{d-1}(K) = \beta_{d-1}(L) - 1$

同时，如果 (1) 发生了，那么说明 $\partial (\sigma + \sum_{i=0}^m \sigma_i) = 0 \implies \partial \sigma = -\sum_{i=0}^m \partial \sigma_i$​，也就是 (2) 不会发生。

进一步，我们可以证明 (1) (2) 不仅是互斥的，还是对立的。

因此，给定 $K$，我们可以赋予单形 $\sigma$​ 一个（良定义的）符号。

---

从而，我们还可以用下列算法，通过单形符号来计算 betti number：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/18_11_51_40_202404181151097.png" alt="image-20240418115129954" style="zoom: 50%;" />

- 当 $K = \emptyset$ 的时候，所有 betti number 均为 0，因此可以从零开始加

## 加速计算

### 基于线性空间的计算

通过递推的方法，我们逐一添加单形。每一次计算出单形的边界，判断 (2) 是否成立。

- 如果不能被表出，就记为负，并将单形添加至边界集合
- 如果能够被表出，就记为正

### 直接搜索

0 维同调群可以通过并查集来搜索出来。

高维同调群可以通过 Alexander duality 归约到 0 维同调群和点集本身[^1]。

## Example: 基于线性空间的计算

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/18_12_29_48_202404181229162.png" style="zoom: 67%;" />

如图， $R = \partial V$，V 用于将 $\partial$ 的线性不独立列约掉。

**计算流程**

1. 根据单形加入的先后顺序，构造一个 $\partial$ 的矩阵。
2. 从左到右进行列消元
    - 实际意义就是：判断后者能否被前者表出
    - “从左到右”就是为了避免后面的单形表出前面的单形
3. 对于空列，对应的就是 (1) 的情况，也就是正号；对于非空列，自然就是 (2) 的情况，也就是负号。
4. 对于非空列，其含义就是：所有红色方块之和（在边界等价关系下）为 0。根据先进后出原则，最下面的方块（i.e. 深红色方块）视作被删去。

从而，列的空与非空，就是单形的符号；而深红色方块，就是同调元的生成与消亡。

# Reference

[^1]: [Delfinado93](https://www.cs.jhu.edu/~misha/ReadingSeminar/Papers/Delfinado93.pdf)
