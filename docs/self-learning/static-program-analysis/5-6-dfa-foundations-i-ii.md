
## View the Iterative Algorithm in Another Way

Given a CFG (program) with k nodes, the iterative algorithm updates `OUT[n]` for every node n in each iteration.

Assume the domain of the values in data flow analysis is $V$,then we can define a $k$-tuple
$$
OUT[n_1],OUT[n_2],\dots,OUT[n_k]
$$
as an element of set $(V_1, V_2, \dots, V_k)$ denoted as $V^k$, to hold the values of the analysis after each iteration.

因此，每一次 iteration 可以抽象为函数 $F: V^k \to V^k$

### Some Questions

本质上，我们就是找 $F$ 的不动点。

- Is the algorithm guaranteed to terminate or reach the fixed-point, or does it always have a solution?
    - Guaranteed to reach?
- If so, is there only one solution or only one fixed point? If more than one, is our solution the best one (most precise)?
    - How many fixed-points?
    - How "precise" is our solution?
- When will the algorithm reach the fixed point, or when can we get the solution?
    - Time complexity?

## Lattice

### Background: Upper and Lower Bounds

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_59_23_202404091759255.png" alt="image-20240401065837486" style="zoom: 50%;" />

### Definition

**Lattice:** Given a poset $(P, \sqsubseteq)$, $\forall a, b \in P$, if a $a \sqcup b$ and $a \sqcap b$ exist, then $(P, \sqsubseteq)$ is called a lattice.

**Semilattice:** Given a poset $(P, \sqsubseteq)$, $\forall a, b \in P$,

- if only $a \sqcup b$ exists, then $(P, \sqsubseteq)$ is called a **join** semilattice
- if only $a \sqcap b$ exists, then $(P, \sqsubseteq)$ is called a **meet** semilattice

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_59_1_202404091759847.png" alt="image-20240401070722049" style="zoom:50%;" />

- 注：由于程序是有限的，因此，我们的 lattice 就是 finite lattice，也就是 complete lattice。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_58_56_202404091758866.png" alt="image-20240401071147630" style="zoom:50%;" />

## Dataflow Analysis Framework via Lattice

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_58_51_202404091758964.png" alt="image-20240401235420991" style="zoom:67%;" />

如上图（上图是一个 may analysis，采用 join operation）：

- 首先，OUT[s1] 和 OUT[s3] 在 lattice 上对应 {a} 和 {b}。因此，join 就是 {a, b}，我们把它赋值给 
- 然后，IN[s1] 通过 transfer function 来得到 OUT[s1]
- And so on and so forth

## Fix-Point Theorem

定义（单调性）：A function $F: L \to L$ is monotonic if 
$$
\forall a, b: a \sqsubseteq b \implies f(a) \sqsubseteq f(b)
$$
定理：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_58_47_202404091758112.png" alt="image-20240402011819457" style="zoom:50%;" />

证明：

我们不妨只证明 $\bot$ 的情况（$\top$ 的情况同理）。

（存在性）构造升链 $\newcommand{par}{\sqsubseteq}\bot \par f(\bot) \par f(f(\bot)) \par \dots$。从而，通过 pigeon hole's theorem，必然存在 $f^{n}(\bot) = f^{m}(\bot)$，从而又由偏序关系：$f^{n}(\bot) = f^{n+1}(\bot) = f(f^{n}(\bot))$。从而 $f^n(\bot)$ 就是不动点。

（最小）对于任何不动点 $x$，我们构造升链 $x \par f(x) \par f(f(x)) \par \dots$。又由于 $\bot \par x$，因此 $\forall n \in \mathbb N: f^n(\bot) \par f^n(x) = x$。

由于我们最终求得的不动点，也是 $f^n(x)$ 中的一员。因此，我们最终求得的不动点，一定是偏序小于等于其它所有不动点。换言之，就是 least fixed-point。

$\blacksquare$

### $F$ is monotonic

F 可以认为是

- 使用所有 OUT[i, n]，来计算 IN[1, n+1]
- 使用 IN[1, n+1]，计算 OUT[1, n+1]
- 使用 OUT[2\~k, n] 和 OUT[1, n+1]，计算 IN[2, n+1]
- 使用 IN[1, n+2]，计算 OUT[1, n+2]
- ……

一共 2k 步。其中，

- 奇数步是 meet(must) 或者 join(may)
- 偶数步是 $(IN - kill) \cup gen$

**由于格上的偏序关系，就是集合的包含于关系**，因此

奇数步（只是粗略证明）：
$$
\begin{aligned}
&(a_1 , a_2, \dots) \par (b_1, b_2, \dots) \\ 
\iff& a_1 , a_2, \dots \subseteq b_1, b_2, \dots \\
\implies& \bigcup a_i \subseteq \bigcup b_i \\
\iff& (\bigcup a_i) \par (\bigcup b_i)
\end{aligned}
$$
偶数步（易证）。

#### Answer to the first two questions

从而，我们证明了前面三个问题中的两个：

- Is the algorithm guaranteed to terminate or reach the fixed-point, or does it always have a solution?
    - Yes
- If so, is there only one solution or only one fixed point? If more than one, is our solution the best one (most precise)?
    - For the first part, not necessarily!
    - For the second part, our solution will be the least or greatest fixed point, depending on where we start.

#### Answer to the third question

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_58_39_202404091758269.png" alt="image-20240402020117968" style="zoom: 50%;" />

其中，

- $k$ 就是 $F: V^k \to V^k$ 中的 $k$，i.e. basic block 的数量。
- $h$ 就是 set lattice 的高度，i.e. bit vector 的长度。

## Fixed-Point And Algorithm

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_17_58_33_202404091758784.png" alt="image-20240402024747058" style="zoom: 67%;" />

如上图所示，以 reaching definitions (may analysis) 为例

- 由于我们优化的是 **unreachable definitions**，因此 $\bot$ 就是 unsafe，$\top$ 就是 safe but useless
- 我们通过设计 data abstraction 以及 merge function，保证不动点都位于 safe 的区域
- 由于从 unsafe 到 safe，越来越不 precise，因此，我们为了找到最 precise 的不动点，就要找 **least fixed point**
- 由于 $F$ 是单调函数，我们可以从 $\bot$ 开始找，从而找到

Available expression analysis (must analysis) 同理。

总体而言，

1. 我们从 unsafe result 开始找，不是因为它是 unsafe，而是因为它是 most precise。
2. 由于我们已经保证了 fixed point 必须在 safe zone 里，我们不需要担心找到 unsafe fixed point
3. 由于我们保证 $F$ 是单调函数，我们一定可以找到不动点，而且是最精确不动点。

### Another Point of View

对于 $F$ 而言，transfer function 已经被写死了。因此，我们能够改变的，只有 merge function。

不论是 join 还是 meet，都是往上走/往下走的过程中，**走最小的一步**。

因此，通过“小步走”，我们可以避免走到过分 unprecise 的地方。

## Precision

### MOP: Meet Over All Paths

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_18_26_31_202404091826512.png" alt="image-20240409182628855" style="zoom:50%;" />

假如我们根本不知道静态分析的 iterative approach，那么，一个直观的想法是：

枚举**所有可能的路径**（可以有环），然后做一个 meet (must) / join (may)。

但是：

- 部分路径可能根本不会执行，从而这样的分析是 not fully precise 的（详见下面的代码）。
- 所有可能的路径可能指数爆炸，甚至有无穷多，因此这样的分析是 impractical 的。
    - 也就是说：这样的分析方式只存在于**概念**上，而不能用于实际

```assembly
li a5, 0
bne a5, zero, if # Assume no statement would jump to this
jal zero, else   # Assume no statement would jump to this 
if:
## ...
else:
## ...
```

### Compare To Iterative Approach

对于这个简单的示例 (assuming it's may analysis) 而言：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_18_43_23_202404091843664.png" alt="image-20240409184320446" style="zoom:33%;" />

- MOP: `IN[s4] = f_3(f_1(OUT[entry])) join f_3(f_2(OUT[entry]))`
- Iterative: `IN[s4] = f_3(f_1(OUT[entry]) join f_2(OUT[entry]))`

我们把 join 当作二元运算，那么这个 lattice 就是一个**交换群**。而 transfer function $f$​ 就是一个**群同态**。

---

**证明：**
$$
f(x) = (x - kill) + gen
$$
从而：
$$
\begin{aligned}
f(x + y) &= ((x + y) - kill) + gen \\
&= ((x - kill) + (y - kill)) + gen \\
&= ((x - kill) + gen) + ((y - kill) + gen) \\
&= f(x) + f(y)
\end{aligned}
$$
上面讨论的是 join 的情况，对于 meet 同理。

Q.E.D.

### A counterexample: Constant Propagation

Constant prop 是一个类 must analysis。但是，**使用 MOP 和 iterative method 不是等价的**。

#### Lattice and Meet Rules

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_20_57_45_202404092057690.png" alt="image-20240409205741923" style="zoom:50%;" />

Constant propagation 的 lattice 如上图所示。

其中 ，UNDEF 的意思就是：这个 variable 必然是常量（不论是什么路径），但是具体是什么，我们不知道，因为它没有被初始化。

---

meet 的运算是：

- UNDEF &sqcap; u = u
- u &sqcap; u = u
- u &sqcap; v = NAC
    - s.t. u &ne; v
- NAC &sqcap; u = NAC

其中，UNDEF &sqcap; u = u 可能会让人心生疑惑：假如一个变量在使用的时候确实没有被初始化，我们不就完了？

我们这里给出解答：**constant propagation** 的设计里面，已经**假设**了变量使用之前一定已经被初始化了。至于检测是否初始化，那就是 **uninitialized variable detection** 需要做的事了。

#### Transfer Function

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_21_23_36_202404092123974.png" alt="image-20240409212334085" style="zoom:50%;" />

一条语句就是一个 transfer function。如果语句不是赋值操作，那么 transfer function 就是 identity。

#### $F$ is non-homomorphic

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_21_30_0_202404092130537.png" alt="image-20240409212955584" style="zoom:67%;" />

如上图，令 $f$ 为语句 `c = a + b` 的转移函数。

则：
$$
\newcommand{nac}{\text{nac}}
\newcommand{undef}{\text{undef}}
\begin{aligned}
f(X \sqcap Y) &= f((a=1, b=9, c=\undef) \sqcap (a=9, b=1, c=\undef)) \\
&= f((a=\nac, b=\nac, c=\undef)) \\
&= (a=\nac, b=\nac, c=\nac)
\end{aligned}
$$
但是：
$$
\newcommand{nac}{\text{nac}}
\newcommand{undef}{\text{undef}}
\begin{aligned}
f(X) \sqcap f(Y) &= f((a=1, b=9, c=\undef)) \sqcap f((a=9, b=1, c=\undef)) \\
&= (a=1, b=9, c=10) \sqcap (a=9, b=1, c=10) \\
&= (a=\nac, b=\nac, c=10)
\end{aligned}
$$
因此，$F$ 并不是这个 lattice 上的同态。

- 不过，还是可以证明：$f(X \sqcap Y) \sqsubseteq f(X) \sqcap f(Y)$​，也就是说，使用 iterative method 的分析方式，不会优于 meet over all paths 的分析方式。也就是说：iterative method 肯定不会比 MOP 更准。

## Optimization: Worklist Algorithm

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/9_21_42_38_202404092142665.png" alt="image-20240409214235354" style="zoom:50%;" />

如图，标黄的部分，就是 worklist algorithm 相对 na&iuml;ve iterative algorithm 的区别。

优化的思想也很简单：如果上一轮和这一轮的值是不一样的，就把它的 successor 加入 worklist。

- 换言之，假如一个 basic block 的所有 predecessor 在上一轮和本轮（或者上一轮和上上一轮）中是一样的，那么这个 basic block 的 out 在上一轮和本轮肯定也不会变——本轮不需要再计算了。
