# Prelude: The Meaning of Probability

> [!abstract]+ Prelude
> A very original and thoroughgoing development of the theory of probability, which does not depend on the concept of frequency in an ensemble, has been given by Keynes. In his view, **the theory of probability is an extended logic**, the **logic of probable inference**. 
> 
> **Probability** is a relation between a hypothesis and a conclusion, **corresponding to the degree of rational belief** and limited by the extreme relations of certainty and impossibility.
> 
> **Classical deductive logic**, which deals with these limiting relations only, **is a special case in this more general development**.
> 
> R.T.Cox

概率可以从两个方面考虑：
1. Frequency of outcomes in random experiments
2. Degree of belief in some proposition

对于第一个表述，表面上是更加“科学”、“严谨”的，但是实际上，如果要解释 frequency，就要解释 average；如果要解释 average，那么又要弯弯绕绕回到概率上去了。因此本质上是一个看似正确的 circular definition。这是**频率学派**的表述。

第二个表述，如果一个 belief measure 可以满足 Cox Axioms，那么它就可以被 mapped onto probabilities。这是**贝叶斯学派**的表述。

> [!note]+ Cox Axiom 相关
> 
> 可以参考这个[网站](https://risingentropy.com/coxs-theorem/)的推导。
> 
> 简单来说，就是对于**任意可以量化（i.e. 满足第一条公理）+合理的（i.e. 满足第 2, 3, 4 条公理）的 belief measure**，它必然同构于某一个 probability measure，从而可以使用概率论的数学工具去推导、演算。
> 
> 因此，贝叶斯的概率论就更加**普适**了——只要你认知世界的方法是合理的，就必然会归于概率论。<del>而非频率学派所谓的可重复、无限次的实验的频率才是概率。</del>
> 
> 同时，通过贝叶斯，所谓概率推导，其实就是 inference——通过已知的 belief measure（i.e. assumptions），推导未知的 belief measure

# Entropy

对于一个**信息源**的 **outcome**，其 **Shannon information** 的定义是：

$$
h(x) = \log_2 \frac 1 {P(x)}
$$

---

对于一个**信息源**，其 **Shannon entropy** 的定义就是 **the expected Shannon information of the outcome**，即：

$$
H(X) \equiv \sum_{x \in A_X} P(x) \log_2 \frac 1 {P(x)} = \mathbb E_{x \in A_X} \left[h(x)\right]
$$

> [!note]- Observation
> 
> 1. 如果 $|A_X|$ is fixed and finite，那么均匀分布的 entropy 最大
> 2. $H(x) \geq 0$，而且当且仅当 $\exists x_0 \in A_X: P(x) = \delta_{x, x_0}$ 时取等。
>     - 也就是说，当且仅当信息源只输出一个值的时候，entropy 为 0。这也是符合直觉的。

---

对于一个**信息源**，其 **redundancy** 的定义是：

$$
1 - \frac {H(x)} {\log_2 |A_X|}
$$
> [!note]- Observation
> 
> 1. redundancy 必然是正的，因为 H(x) 最大也就是均匀分布，而均匀分布的 entropy 就是 $\log_2 |A_X|$

---

**Joint Entropy**：定义和 Shannon Entropy 类似

$$
H(X,Y) \equiv \sum_{(x,y) \in A_X \times A_Y} P(x,y) \log_2 \frac 1 {P(x,y)} = \mathbb E_{(x,y) \in A_X \times A_Y} \left[h(x,y)\right]
$$

> [!note] Observation
> 
> 如果 X,Y 独立，那么 $H(X,Y) = H(X) + H(Y)$

## Decomposition of Entropy

> [!abstract]+ 前言
> 
> Entropy 就是**平均信息**。既然是”信息“，那么应该能够被分解——同时得到 A+B，相当于先得到 A，再在 A 的基础上得到 B。恰好，entropy 支持这种定义。

### An Example: Flipping Coins

举一个例子：假如我们掷一个硬币，如果正面，就返回 0，如果反面，就再掷一次，如果是正面，就返回 1，如果反面，就返回 0。

不难看出，这个 ensemble 的概率就是：{0: .5, 1: .25, 2: .25}。熵就是 $.5\log_2(1/.5) + .25 \log_2(1/.25) + .25\log_2(1/.25) = 1.5$。

如果我们分开考虑这件事情：
1. 首先，考虑第一枚硬币，显然概率分布就是 {.5, .5}，熵就是 1
2. 然后，如果第一枚硬币是正面，那么第二枚就不用看了，必然输出是 1，因此熵是 0（i.e. P(output = 1 | first_coin = 1) = 1）
3. 如果第一枚硬币是反面，那么还要看一看第二枚，分布式 {.5, .5}，熵也是 1。

因此，总共的熵就是：1 + 正面概率 * 正面熵 + 反面概率 * 反面熵 = 1 + 0.5 * 0 + 0.5 * 1 = 1.5。和合起来考虑一样。

### Formulae of the Decomposition of Entropy

下面是一个 generalized version of decomposition of entropy：
- **注意**：为方便起见，我们之后不再使用 ensemble，而统一使用概率分布 $\mathrm p$ 来代替 ensemble $X$

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/30_0_50_45_202405300050846.png"/>

上图的公式的意思就是：the entropy of some probability distribution equals to the sum of the following two values
- 任意找一组可以将概率空间 partition 的事件，计算出其概率分布，然后计算出其 entropy
    - 比如一个事件及其否事件
    - 也可以是若干个事件 $\set{A_i}_{i \in [N]}$，满足
        - $\forall i \neq j: A_i \cap A_j = \emptyset$
        - $\bigcup_{i \in [N]} A_i = 1$
- 对于上述的每一个事件，求出 $H(X | A_i)$。然后以事件 $A_i$ 概率为权重，加权平均：$\sum_{i \in [N]} P(A_i) H(X | A_i)$

> [!note]+
> 
> 最 general 的 formula，用数学符号表示，就是：$H(X) = H(\set{A_i}_{i \in [N]}) + \sum_{i \in [N]} P(A_i) H(X | A_i)$ 

## Gibbs Inequality

两个（输出相同但是概率不同的） ensemble P, Q 之间的相对熵就是 KL divergence:

$$
D_{KL} (P \| Q) = E_{x \in A_P}\left[\log_2 \frac {P(x)} {Q(x)} \right] = E_{x \in A_P}\left[h_Q(x) - h_P(x) \right]
$$

通过 Gibbs 不等式，可以证明上述式子必然大于等于 0，且只在 P 和 Q 分布完全一样的情况下取等。