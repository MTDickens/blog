$$
\newcommand{defeq}{\stackrel{\text{def}}{=}}
$$

## N-ary Relation

在集合 $S_1 \times S_2 \times \dots \times S_n$ 上的 n 元关系就是 $R \subseteq S_1 \times S_2 \times \dots \times S_n$。

> [!note]+ 特例
> 
> 1. 对于一元关系 $P \subseteq S$，我们记 $P(s) := s \in P$，i.e. 把关系当作谓词 $S \to \{T, F\}$ 来用
> 2. 对于三元关系 $R \subseteq S_1 \times S_2 \times S_3$，我们一般使用所谓 "mixfix" 来表示：$\Gamma \vdash s : T \defeq (\Gamma, s, T) \in R$

## Domain and Codomain of a Relation

**Definition:** The ***domain*** of a relation $R$ on sets $S$ and $T$, written $\text{dom}(R)$, is the set of elements $s \in S$ such that $(s, t) \in R$ for some $t$. 

The ***codomain*** or range of $R$, written $\text{range}(R)$, is the set of elements $t \in T$ such that $(s, t) \in R$ for some $s$.

## Relation as Partial Function and Function

**Definition:** A relation $R$ on sets $S$ and $T$ is called a ***partial* function** from $S$ to $T$ if, whenever $(s, t_1) \in R$ and $(s, t_2) \in R$, we have $t_1 = t_2$. 

- If, in addition, $\text{dom}(R) = S$, then $R$ is called a total function (or just function) from $S$ to $T$.

## Whether Defined or Undefined?

**Definition:** A partial function $R$ from $S$ to $T$ is said to be ***defined on an argument $s \in S$ if $s \in \text{dom}(R)$, and undefined otherwise.*** 

We write
1. $f(x) \uparrow$, or $f(x) = \uparrow$, to mean “$f$ is undefined on $x$,” 
2. and $f(x) \downarrow$ to mean “$f$ is defined on $x$.”