$$
\newcommand{\ord}[1]{\lvert #1 \rvert}
$$



# Lec 3: Untyped Arithmetic Expressions

我们以由数字和布尔值构成的一个简单语言为例，介绍编程语言的基本方面。

## Introduction

### Grammar (Syntax)

我们的这个 toy language 的语法如下：

```
t ::=
	true
	false
	if t then t else t
	o         # const zero
	succ t    # successor of t
	pred t    # predecessor of t
	iszero t  # zero test
```

**Note:** t is meta-variable (non-terminal symbol)

### Programs and Evaluations

A **program** in the language is just a **term** built from the forms given by the grammar.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402231553277.png" alt="image-20240223155259457" style="zoom:50%;" />

## Syntax

除了使用（上下文无关）语法以外，还有其他（等价的）方式定义 syntax。

### Using Inductive Definition

定义：the set of terms is the **smallest set T** s.t.

1. {true, false, o} $\subseteq$ T
2. if $t_1 \in$ T, then {succ $t_1$, pred $t_1$, iszero $t_1$} $\subseteq$ T
3. if $t_1, t_2, t_3 \in$ T, then "if $t_1$ then $t_2$ else $t_3$" $\in$ T

本质上，这和 CFG 的定义是“同构”的。

### Using Inference Rules

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240223155938707.png" alt="image-20240223155938707" style="zoom:50%;" />

> Inference rules = Axioms + Proper rules

不难看出，这就是 Inductive Definition 的简写版本。

### Constructed Concretely/Explicitly

For each natural number $i$, define set $S_i$ as follows:

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402231641305.png" alt="image-20240223164107703" style="zoom:50%;" />

最后，令
$$
S = \bigcup_{i \in \N} S_i
$$
即可。

---

另有两个性质（对应 exercise 3.2.4 & 3.2.5）：

1. $$
   \begin{aligned}\ord{S_0} &= 0 \\ \ord{S_i} &= 3 + 3 \ord{S_{i-1}} + \ord{S_{i-1}}^ 3 \end{aligned}
   $$

2. $\forall i \in \N: S_i \subseteq S_{i+1}$

## Induction on Terms

The set of constants appearing in a term t, written `Consts(t)`, is defined as follows: 

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402231709736.png" alt="image-20240223170920930" style="zoom:50%;" />

The size of a term t, written `size(t)`, is defined as follows: 

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402231709002.png" alt="image-20240223170941631" style="zoom:50%;" />

The depth of a term t, written `depth(t)`, is defined as follows: 

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402231709965.png" alt="image-20240223170954435" style="zoom:50%;" />

- e.g. 对于 `if false then 0 else succ 0`
  - `Consts(if false then 0 else succ 0)=Consts(false)|Consts(0)|Consts(succ 0)=Consts(false)|Consts(0) |Consts(0) = {false, 0}`
  - `size(if false then 0 else succ 0)=size(false)+size(0)+size(succ 0)+1=size(false)+size(0)+size(0)+1+1=1+1+1+1+1=5`
  - `depth(if false then 0 else succ 0)=max(depth(false),depth(0),depth(succ 0))+1=max(1,1,1+1)+1=3`

### Lemma 1

**Lemma.** The number of distinct constants in a term t is no greater than the size of t: 

$| Consts(t) | \leq size(t)$

**Proof.** By induction over the depth of t.
- Case t is a constant
- Case t is `pred t1`, `succ t1`, or `iszero t1`
- Case t is `if t1 then t2 else t3`

这里，我们使用了结构归纳法（也就是对一个良基偏序集进行归纳），也就是

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402231717346.png" alt="image-20240223171715665" style="zoom:33%;" />

- i.e. 对于一个 term，在其所有 sub-term 满足假设的情况下，如果我们能够证明该 term 也满足假设，那么就完成了归纳。

## Semantic Styles

> 原文：[知乎 - Jason Hu](https://www.zhihu.com/question/23861885/answer/762550769)
>
> 改写：Google Gemini

这段话主要介绍了程序语义的三种类型：操作语义、指称语义和公理语义。

**操作语义**定义程序如何运行，是三种语义中最重要的。它与类型系统密切相关，决定了类型系统的有效性。

**指称语义**将程序映射到数学系统中，从而证明程序的一致性。这种语义偏向于数学，对使用者有一定要求。

**公理语义**根据公理定义程序含义，其中 Hoare 逻辑是一种重要的公理语义。传统的 Hoare 逻辑是全局语义，需要描述整个内存状况，而 21 世纪的 Hoare 逻辑（分离逻辑）解决了这个问题。

基本上，程序语义就是数学方法和数学问题。定义程序语义的最终目的就是为了证明程序的正确性。用数学方法的原因是因为你根本没法在地球上找到其他比数学更加全面又一致的理论系统了。

---

在本书中，我们只会用到 operational semantics。

因为 "the bête noire (棘手之处) of **denotational semantics** turned out to be the treatment of **nondeterminism and concurrency**; for **axiomatic semantics**, it was **procedures**."

并且 "Milner’s work on CCS (1980; 1989; 1999), which introduced more elegant formalisms and showed how many of **the powerful mathematical techniques** developed in the context of **denotational semantics could be transferred to an operational setting**."

## Evaluation

（Evaluation 细节具体详见 PPT）

总体而言，我们最好保证

- 对于两个相同的语句，如果能够进行 small-step (i.e. 1-step) evaluation，哪么，无论运用什么规则，结果都是相同的
  - 可能只有一个适合的规则
  - 可能虽然有多个匹配，但是最终结果还是一样
  - Corollary: small-step same $\implies$ normal-form big-step same
- value（我们在文中以 metavariable $v$ 表示）一定是 normal form
  - normal form 就是无法匹配任何规则的

如果能够保证

- normal form 一定是 value

当然更好。但是，with our naive implementation，未必能够保证，如：

- `if (succ 0) then 1 else 0`
- `iszero (if true then true else 0)`

---

我们可以用 `stuck` 这个 term 来指代所有的 non-value normal-form。

或者，我们可以（某种对应关系上）等价、显式地定义 `bad-nat`：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403010038602.png" alt="image-20240301003800413" style="zoom: 50%;" />