## Language Class 的包含关系

**结论：**

$$
\begin{aligned}
\text{Regular Language} \subsetneq \newline 
\text{Context Free Language} \subsetneq \newline 
\text{Recursive Language} \subsetneq \newline 
\text{Recursively Enumerable Language} \subsetneq \newline 
\text{All Languages}
\end{aligned}
$$

前两个 $\subsetneq$，可以轻易构造出例子。

第四个 $\subseteq$，不妨固定其字符集为 $\Sigma = \{0,1\}$。因为图灵机的总数是可数的，每一个图灵机恰好对应一个 RE Language，因此 RE Language 是可数的。但是所有语言的集合 $2^{\Sigma^\ast}$ 显然是不可数的，因此我们

第三个 $\subsetneq$，不妨固定其字符集为 $\Sigma = \{0,1\}$。我们设计这样一个语言 $L = \{\langle M, w \rangle: M \text{ accepts or rejects } w\}$。我们不难设计出一个通用图灵机 $H$，它只会 accept 或者 loop：通用图灵机“模拟”其它图灵机 $M$，只要 $M$ 在输入 $w$ 下停机，就 accept；否则只能 loop。

显然，$H$ 半判定上面那个语言。**根据假设，半判定等价于判定**，那么，必然存在某个图灵机 $H'$，可以**判定**这个语言——如果 $M$ 停机，那么就 accept；否则就是 reject（而不是 $H$ 中的 loop）。

固定字符集，我们可以给所有该字符集下的图灵机进行 index，然后列出下表：

|          | $\varepsilon$ | 0        | 1        | 00       | $\cdots$ |
| -------- | ------------- | -------- | -------- | -------- | -------- |
| $M_1$    | A             | R        | L        | A        | $\cdots$ |
| $M_2$    | A             | A        | A        | R        | $\cdots$ |
| $M_3$    | A             | L        | L        | A        | $\cdots$ |
| $M_4$    | L             | L        | R        | L        | $\cdots$ |
| $\vdots$ | $\vdots$      | $\vdots$ | $\vdots$ | $\vdots$ | $\ddots$ |

**Note**: A stands for "accept", R for "reject", L for "loop".

我们构造出这样的图灵机：

```
def T(i):
	if H'(M_i, i) == accept:
		return ~run(M_i, i)
	else
		return accept;
```

显然，$T$ 满足下列两个性质：

1. 一定停机
2. 一定和 $M_i(i)$ 的输出不同（如果有输出的话）

由于 $\exists k: M_k = T$，因此：如果 $T(k) = accept$，那么 $T(k) = ~run(T, k) = reject$; 如果 $T(k) = reject$，那么 $T(k) = ~run(T, k) = accept$。矛盾。从而 $T$ 这个图灵机不应该存在，从而 $H'$ 不应该存在，从而 $L(H)$ 是递归语言，但是**不是**递归可枚举语言。$\blacksquare$

## 几种 R 和 RE 的语言

### $A_{CFG} = \{\langle G, w \rangle: w \in L(G)\}$ is recursive

很简单，我们将 CFG $G$ 转换成等价的 Chomsky Normal Form (CNF)，也即：

$$
\begin{aligned}
S &\to \varepsilon \newline
A &\to a \newline
A &\to BC
\end{aligned}
$$

如果 $w = \varepsilon$，那么 $\langle G, w \rangle \in A_{CFG}$ 当且仅当 $S \to \varepsilon \in G$。

如果 $w \neq \varepsilon$，那么我们的策略就是：

1. 首先，将 $S$ 不断使用某一个第三类规则进行延长，直到延长到 $|w|$。我们将分别尝试每一种延长的方式。
2. 然后，将所有 symbol，试图通过第二类规则进行转换成 $w$。然后根据转换的成功与否，来决定 accept 还是 reject。

这样，我们就可以在有限时间内（其实还是指数时间内）模拟 $A_{CFG}$。从而必然停机，从而这个语言是 recursive。

### $E_{CFG} = \{G: \exists w: w \in L(G)\}$ is recursive

我们可以直接把 CNF 规则变成逻辑：

$$
\begin{aligned}
S &\to \varepsilon : x_S\newline
A &\to a : x_A\newline
A &\to BC: x_B \land x_C \to x_A
\end{aligned}
$$

$G \in E_{CFG}$，当且仅当 $G$ 中规则所代表的逻辑，最终可以推出 $x_S$。这个判定甚至是 $\mathcal O(n)$ 的。

### $A_{TM}$ is recursively enumerate

我们可以通过在通用图灵机上来模拟 $A_{TM}$。这个通用图灵机显然是 semi-decidable。

### $A_{TM}$ is *NOT* recursive

通过证明 Rice's Theorem（见下），这就是推论。

### $ALL_{PDA}$ is *NOT* recursive

**证明方法**：将停机问题规约到 $ALL_{PDA}$。

**思路**：虽然 PDA 不能像图灵机一样计算，但是**给出计算过程，PDA 可以判断这个计算过程是否 valid，以及最终是否 accept**。

我们的 PDA 可以这样：如果

## Rice's Theorem

**定义（$L(P)$）**：$P$ 是一个性质（比如“L(M) 为空”“L(M) 有限”等等），$L(P)$ 是**所有满足**条件 $P$ 的递归可枚举语言。

**定理**： $L(P) \neq \emptyset \land L(P) \neq \textbf{All enumerable recursive languages} \implies \{M: M \text{ is Turing machine} \land L(M) \in L(P)\}$ 是不可判定的。

**Lemma**: $ALL_{TM}, E_{TM}, A_{TM}, EQ_{TM}$ 等等都不可被判定。

## 规约

不妨假设我们现在的规约都是在图灵机计算模型之下（对于 PDA、DFA 等等其它计算模型，也可类比）：

存在 A 到 B 的规约，就相当于：$\exists f \text{ computable}, \forall x: x \in A \iff f(x) \in B$。

因此，为了判断 $x$ 在不在 $A$ 中，我们只需要将 $f(x)$ 在 $M_B$ 中跑一遍就行。显然，$B$ 的难度至少和 $A$ 相当，记为 $A \preceq B$。

因此，如果 $M_B$ 具有怎样的能力，那么一定存在 $M_A$ 存在这样的能力——只需要让 $M_A$ 先运行 $f$，然后再运行 $M_B$ 即可。
