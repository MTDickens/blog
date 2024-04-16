# Introduction

![](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_19_27_25_202404131927254.png)

如图，上面的表格将 `insturctor(ID, name, salary, dept_name)` 和 `department(dept_name, building, budget)` 两个关系模式合并起来了，变成了更大的一张表 `inst_dept`。

但是，问题在于：

- 信息重复：如果计算机系有 300 个老师，那么，`dept_name, building, budget` 就要重复 300 次
    - 如果分开存储，就只需要存一个即可
- 插入异常：如果学校新成立了一个系——大模型系，但是系里目前还没有老师，那么这个系就无法在表格中体现出来
- 更新困难：如果计算机系有 300 个老师，那么，如果计算机系大楼搬迁/改名等等，那么就必须更新 300 次

## Motivation

我们发现了这个表并不是一个好的表。因此，`inst_dept` 应该被拆开。

## 为什么要拆开？

我们可以在 `inst_dept(ID, name, salary, dept_name, building, budget)` 里发现两个映射关系：

1. `ID` &rarr; `name, salary, dept_name`
2. `dept_name` &rarr; `building, budget`

而且，这两个映射之间，直观上来看：

1. 有重复
2. 重复的部分正好就是其中一个表的 LHS，另一个的 RHS

因此，我们可以 losslessly 地拆开两张表。

## 如何拆开

就按照上面的方式拆开即可。

## Lossloss-Join Decomposition

**定义：** 将一个关系 $R$ 分解成 $R_1, R_2$，如果是无损的，那么必须满足：

- $R = R_1 \cup R_2$
- $\Pi_{R_1}(r) \bowtie \Pi_{R_2}(r) = r$​

---

不难证明，如果 $R = R_1 \cup R_2$，那么 $r$ 作为 $R$ 的一个示例，必然有 $\Pi_{R_1}(r) \bowtie \Pi_{R_2}(r) \supset r$。因此，有损连接就是：$\Pi_{R_1}(r) \bowtie \Pi_{R_2}(r) \supsetneq r$。

---

**定义：** 如果 a decomposition of $R$ to $R_1, R_2$ 是一个 lossless join，那么至少要满足下面二者之一

- $R_1 \cap R_2 \to R_1$
- $R_1 \cap R_2 \to R_2$​

不难发现，如果 $R_1, R_2$​ 满足了 decomposition that is a lossless join，那么必然满足 lossless decomposition。

- 也就是说：lossless join 是更强的条件
- 而且是严格更强。
    - 因为假设一个系有固定两栋大楼，那么就不是 lossless join（i.e. `dept` 不再是主键）
    - 但是仍然是 lossless decomposition（i.e. 满足 $\Pi_{R_1}(r) \bowtie \Pi_{R_2}(r) = r$）

---

![](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_20_51_30_202404132051072.png)

# Functional Dependencies

## Definition

令 R 为一个 relation schema，$\alpha, \beta \subset R$。

如果：$\forall r(R), \forall t_1, t_2 \in r: t_1[\alpha] = t_2[\alpha] \implies t_1[\beta] = t_2[\beta]$，那么就称 **function dependency $\alpha \to \beta$ holds on $R$**。

## Superkey and Candidate Key

$K$ is a **superkey** of $R$ iff: $K \to R$

$K$ is a **candidate key** of $R$ iff: $K \to R$ and $\lnot\exists \alpha \subsetneq K: \alpha \to R$

### Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_21_0_1_202404132100127.png" alt="image-20240413205957855" style="zoom: 67%;" />

## Trivial Function

如果 $\alpha \to \beta$ 中，$\beta \subset \alpha$，那么就称这是 trivial 的依赖。

## Closure of a *Set* of Functional Dependencies

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_21_2_49_202404132102524.png" alt="image-20240413210246159" style="zoom: 67%;" />

### Axioms

我们可以通过公理来推导出函数族的闭包（具体方法就是不断迭代生成）：

- $\beta \subset \alpha \implies \alpha \to \beta$
- $\alpha \to \beta \implies \gamma \cup \alpha \to \gamma \cup \beta$
    - $t_1[\gamma \cup \alpha] = t_2[\gamma \cup \alpha] \implies t_1[\gamma] = t_2[\gamma] \land t_1[\alpha] = t_2[\alpha] \implies t_1[\gamma] = t_2[\gamma] \land t_1[\beta] = t_2[\beta] \implies t_1[\gamma \cup \beta] = t_2[\gamma \cup \beta]$
- $\alpha \to \beta \land \beta \to \gamma \implies \alpha \to \gamma$

这些 rules，不仅 sound（i.e. generate only valid ones），而且 complete（i.e. generate all the valid ones)。

### Lemmas

**引理 1:** $\alpha \to \beta, \alpha \to \gamma \iff \alpha \to \beta\gamma$

- **Note:** $\beta\gamma \overset{\text{def}}{=} \beta \cup \gamma$

**证明:**

*正向*

$\alpha \to \beta \implies \alpha \to \alpha\beta$

$\alpha \to \gamma \implies \alpha\beta\to \beta\gamma$

因此，$\alpha \to \beta\gamma$。

*反向*

由于 $\beta,\gamma \subset \beta\gamma$，因此 $\beta\gamma \to \beta, \gamma$，之后显而易见。

---

**引理 2:** $\alpha \to \beta, \gamma\beta \to \delta \implies \alpha\gamma \to \delta$

**证明:**

$\alpha \to \beta \implies \alpha \gamma \to \beta\gamma$，之后显而易见。

## Closure of *Attribute* Sets

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_21_22_36_202404132122530.png" style="zoom: 80%;" />

### Usages

计算一个某个 $R$ 上的一族函数 $F$ 的闭包往往是非常困难的，因此，我们会选择只计算 $R$ 的某个属性集关于 $F$ 的闭包。属性集的闭包的就可以代替 $F^+$，来判断一些属性集是否满足某些条件：

- Testing for **superkey**: 计算出 $\alpha$ 的 $\alpha^+$，然后 check if $\alpha^+ = R$
- Testing for **functional dependencies:** $\alpha \to \beta \iff \beta \subset \alpha^+$​

当然，$F^+$ 本身也可以通过属性集的闭包来迭代计算：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_22_6_50_202404132206508.png" style="zoom: 33%;" />

## Canonical Cover

正则覆盖就是不存在冗余的覆盖。也就是：里面不存在一个函数，可以通过公理，被其它函数推出来。

我们可以通过画图的方式来求出正则覆盖

## BCNF

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/13_22_10_28_202404132210424.png"  />

简单来说，就是：**非平凡的函数，其 initial object (i.e. &alpha;) 一定是 superkey**

---

**反例：**

由于 `dept_name` &rarr; `{building, budget}`，但是 `dept_name` 并不是 superkey。

### Decomposing of BCNF

如果有一条 $\alpha \to \beta$ 违反了 BCNF，那么，我们把 $R$ 分解为：

- $\alpha \cup \beta$
- $R - (\beta - \alpha)$

由于 $R_1 \cap R_2 = (\alpha \cup \beta) \cap (\bar\beta \cup \alpha) = \alpha$，因此自然有：$R_1 \cap R_2 \to R_1$。满足 lossless join。

### Example

对于下面的依赖图：

<iframe class="quiver-embed" src="https://q.uiver.app/#q=WzAsNCxbMCwwLCJBIl0sWzEsMCwiQiJdLFsyLDAsIkMiXSxbMiwxLCJEIl0sWzAsMV0sWzEsMl0sWzEsM11d&embed" width="375" height="200" style="border-radius: 8px; border: none;"></iframe>

**步骤 1：** 找出 super keys

不难发现，任何包含 A 的属性集都是 super key，反之则都不是。

**步骤 2：** 找出 initial object 不是 superkey 的 initial object

我们发现 $B \to CD$ 的 $B$ 不是 superkey。

**步骤 3：** 分解

令 $R_1 = BCD, R_2 = ABCD - (CD - B) = AB$。

**步骤 4：** 检查

由于 $R_1$ 和 $R_2$ 都是 BCNF，因此不必再递归下去。结束。

- 同时可以发现，$R_1$ 和 $R_2$ 之间是 lossless join，因为 $R_1 \cap R_2 = B$，而 $B$ 正是 $R_1$ 的 superkey。

# Even stricter: Dependency Preservation

令 $F_i \overset{\text{def}}= F_{R_i}^+$，如果一个 decomposition 是 dependency preserving，那么就必须满足：
$$
(\bigcup_{i=1}^n F_i)^+ = F^+
$$

- 实际上，如果令 $F_i \overset{\text{def}}= \text{any F, s.t.} F^+ = F_{R_i}^+$，其实也可以。
    - 毕竟 $(\bigcup_{i=1}^n \text{any F})^+ = (\bigcup_{i=1}^n \text{any F}^+)^+ = (\bigcup_{i=1}^n F_{R_i}^+)^+ = F^+$​
    - 也就是说：检查的时候，使用 Canonical Cover 即可。

## 意义

我们发现，

- 如果满足 dependency preservation 的，就可以通过函数映射+公理，来还原出 $F$​ 的函数映射。
    - 对应 SQL 操作，就是通过任意一个属性集查询任意其闭包内的元素，其难度不会高于属性集本身的大小
- 如果不满足 dependency preservation，就可能导致必须用极高的成本来完成本身很简单的搜索。请看下面的例子。

## Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/15_21_31_43_202404152131875.png"  />

- 如上图，$F_1, F_2$ 就是 Canonical Cover。

对于第二个例子，由于不满足 dependency preservation，就可能引起 SQL 查询的开销很大。

假如 A 表里有 100 亿条项目，分别对应 30 条 B 和 5 条 C。

Case 1: 我希望查询一个 B 属性对应的 C

- 如果采用例一，那么 $R_2$ 就完事了。开销只是两位数级别。和 B 的大小相符。
- 如果采用例二，那么就要 `R1 join R2`，开销就是 100 亿级别。**和 B 的大小严重不符。**

Case 2: 我希望查询一个 A 属性对应的 C

- 如果采用例一，那么就是 `R1 join R2`。开销是 100 亿级别。和 A 的大小相符。
- 如果采用例二，那么就要 `R2`，开销也是 100 亿级别。并不比例一好。和 A 的大小相符。

## Can We Always Arrive at a Dependency Preserved Solution?

如果使用之前的 BNCF 方式，一定能够分解成满足 dependency preserved solution 吗？

<iframe class="quiver-embed" src="https://q.uiver.app/#q=WzAsNSxbMCwwLCJBIl0sWzEsMCwiQiJdLFsyLDAsIkMiXSxbMiwxLCJEIl0sWzEsMiwiRSJdLFswLDFdLFsxLDJdLFsxLDNdLFs0LDNdXQ==&embed" width="375" height="200" style="border-radius: 8px; border: none;"></iframe>

如上图所示，我们可以得到两种分解结果（黑体字为 superkey）：

1. **B**CD, **A**B, **AE**
2. **E**D, **B**C, **A**B, **AE**

但是，由于原图的 $F = \set{A\to B, B \to CD, E \to D}$​，而 (1) 缺少 ED，(2) 缺少 BD。因此，使用这两种算法，都无法使得 dependency get preserved。

---

进一步，考虑

- $R = \set{JKL}$
- $F = \set{JK \to L, L \to K}$

这个 $R$ 显然不是 BCNF。但是只要对其进行分解，就会使得这个 $JK\to L$ 无法被还原。因此，我们通过反例证伪：并非所有 $R$ 都可以同时满足 BCNF 和 DP。

## 3NF

既然已经通过反例证伪，我们就只能退而求其次，不用 BCNF，而用 3NF。

3NF 相比 BCNF，对于一个函数 $\alpha \to \beta$，至少满足下列条件之一：

- 是平凡函数
- $\alpha$ 是 superkey
- **$\beta$ 是 superkey 的子集**

其中，最后一个条件就是松弛条件。

### 3NF分解

![img](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/16_0_25_12_202404160025003.webp)

1. 先求出正则覆盖 $F_c$
2. 对于 $F_c$ 里面的所有函数依赖 $a\to b$,均转化为 $R_i=ab$
3. 对于所有的模式 $R_i$
    1. 如果存在至少一个包含 superkey，进行第 4 步
    2. 如果都不包含 superkey， 将任意一个候选码添加到模式Ri里面
4. 如果一个模式被另一个模式包含，则去掉此被包含的模式。

可以证明：这样的分解，满足 3NF，同时满足 DP。 

### Example

还是以上图为例。

其正则覆盖是 $\set{A \to B, B \to CD, E \to D}$，superkey 是 $AE$

因此，分为： 

- $R_1 = \set{AB}$
- $R_2 = \set{BCD}$
- $R_3 = \set{ED}$

由于没有 $R_i$ 包含 superkey，因此：$R_4 = \set{AE}$

由于 $R_1 \sim R_4$ 之间没有包含关系，因此结束。