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
- $R_1 \cap R_2 \to R_2$

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