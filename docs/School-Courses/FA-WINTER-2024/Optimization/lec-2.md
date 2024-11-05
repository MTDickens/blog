$$
\newcommand{\innerprod}[2]{\langle #1, #2 \rangle}
\newcommand{\norm}[1]{\lVert #1 \rVert}
$$

# Outline

1. Relaxation and Approximation
	2. Concepts
	3. 1-st order
	4. 2-nd order
2. Classes of differentiable functions
	1. Class $C^{k,p}_L(\mathbb R^n)$%%  %%
	2. Class $C^{1,1}_L(\mathbb R^n)$
	3. Class $C^{2,2}_M(\mathbb R^n)$

# Relaxation and Approximation

## Concepts

> [!Definition]
> 
> **Definition (relaxation sequence)**: $\forall k > 0: a_{k+1} \leq a_k$，则称 $\{a_k\}^{k=0}_\infty$ 为 relaxation sequence.

对于一个光滑多元函数 $f$，如果要（无约束）最小化，一种途径就是制造一个松弛序列：

$$
\{f(x_k)\}_{k=0}^\infty, \quad f(x_{k+1}) \leq f(x_k), k = 0, 1, \dots
$$

而我们的目标，就是 replace an initial complex object (i.e. $f$) by a simplified one, which is close by is properties to the original.

## 一阶优化

### 梯度下降的局部最优性

一阶优化，就是喜闻乐见的梯度下降。但是我们还是进行一番推导：

> [!Claim]
> 
> *Claim*: 沿着梯度方向移动是“好”的
> 
> *Proof*: 令 $f(x)$ be differentiable at $\bar x$。那么：
> 
> $$
> f(y) = f(\bar x) + \innerprod{\nabla f(\bar x)}{ y - x} + o(\norm{y-\bar x})
> $$
> 
> 为了尽量准确，我们希望 $y-\bar x$ 能够限定在某一个值之内，即：
> 
> $$
> f(y) \approx f(\bar x) + \innerprod{\nabla f(\bar x)}{ y - x}, \quad \norm{y-\bar x} \leq \epsilon
> $$
> 
> 因此，我们的目标就是：
> 
> $$
> \min_{y, s.t. \norm{y-\bar x} \leq \epsilon} f(\bar x) + \innerprod{\nabla f(\bar x)}{y - x}
> $$
> 
> 显然，令 $y-x = \frac {\epsilon} {\norm{\nabla f(\bar x)}}\nabla f(\bar x)$，就是最好的选择。$\blacksquare$

### 梯度的正交空间

> [!Definition]
>
> **定义（水平集）**：$\mathcal L_f(\alpha) = \{x \in \mathbb R^n | f(x) \leq \alpha \}$

> [!Definition]
> 
> **定义**：$S_f(\bar x) = \{s \in \mathbb R^n | s = \lim_{y_k \to \bar x, f(y_k) = f(\bar x)} \frac {y_k - \bar x} {\norm{y_k - \bar x}}\}$
> 
> - 直观来说，就是任照一个以 $\bar x$ 为极限、函数值等于 $f(\bar x)$ 的序列 $\{y_k\}$
> - 若这个序列存在右侧的极限，那么该极限就属于这个集合

> [!lemma]
> 
> **Lemma 1**: $s \in S_f(\bar x) \implies \innerprod{\nabla f(\bar x)} {s} = 0$
> 
> *Proof*: <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/23_20_30_28_20240923203028.png"/>
> 
### 最小值和梯度

如果函数 $f$ 在极小值点 $x^\ast$ 附近一阶光滑，那么显然 $\nabla f(x^\ast) = 0$。

- 当然，反之不对，因为存在鞍部

### 线性约束下的梯度下降

> [!Colloary]
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/23_20_39_59_20240923203958.png"/>
> 
> 如果使用 Lagrange multiplier:
> 
> $$
> L(x, \lambda) = f(x) - \lambda^T (Ax - b)
> $$
> 
> 因此：
> 
> $$
> \nabla_x L = \nabla f(x) - A^T \lambda = 0 \iff \nabla f(x) = A^T \lambda
> $$
> 
> 又：
> 
> $$
> \nabla_\lambda L = Ax - b = 0
> $$
> 
> 因此，我们就是要找出这样的 $\lambda^\ast$，使得 $\nabla f(x^\ast) = A^T \lambda^\ast$ 的同时，也有 $Ax^\ast = b$。

## 二阶优化

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/23_21_1_12_20240923210112.png"/>

### 极小值和 $\nabla^2 f(x)$

> [!note]+ Notation
> 
> - 正定（i.e. $\forall x \neq 0: x^T \nabla^2 f(x) x 0$）：$H \succ 0$
> - 半正定（i.e. $\forall x \neq 0: x^T \nabla^2 f(x) x \geq 0$）：$H \succeq 0$

如果函数 $f$ 在极小值点 $x^\ast$ 附近光滑，那么显然 $\nabla f(x^\ast) = 0$。同时，$\nabla^2 f(x) \succeq 0$。

- 注意，一阶、二阶导数的关系，只是极小值点的**必要条件**。

### 严格极小值和 $\nabla^2 f(x)$

> [!Definition]
> 
> **定义（严格极小值）**：一个 $x^\ast$ 是严格极小值点，当且仅当存在一个邻域，任意点 $x$（除了 $x^\ast$ 以外）的函数值，都比 $f(x^\ast)$ 更大。

> [!theorem]
> 
> **定理**：如果 $f(x)$ 二阶光滑，而且 $\nabla f(x^\ast) = 0$。同时，$\nabla^2 f(x) \succ 0$（注意是*严格*正定，而不是半正定）。那么，$x^\ast$ 必然是极小值点。
> 
> - 也就是说，一阶、二阶导数的关系，是极小值点的**充分条件**。
> 
> **证明**：易证。


# 可微函数

## Class $C_L^{k,p} (\mathbb R^n)$

Let $Q$ be a subset of $\mathbb R^n$。A function $f \in C_L^{k,p} (\mathbb R^n)$ should have the following properties:

1. $f$ is **k** times continuously differentiable on $Q$
2. It's **p**-th derivative is Lipschitz continuous on Q with constant $L$:
	
    $$
    \norm{f^{(p)}(x) - f^{(p)}(y)} \leq L \norm{x-y}
    $$
    
	for all $x, y \in Q$.

**注意**：上面的 $f^{(p)}(x)$，$p=1$ 时，是向量；$p=2$ 时，是矩阵；$p \geq 3$ 时，是高阶张量。我们显然需要用到（通过向量范数诱导出的）矩阵乃至张量的范数

此外，我们不难得出下面三个结论：

1. $p \leq k$，显然
2. 若 $q > k$，那么 $C_L^{q,p} (\mathbb R^n) \supseteq C_L^{k,p} (\mathbb R^n)$
3. 若 $f_1 \in C_{L_1}^{k,p} (\mathbb R^n), f_2 \in C_{L_2}^{k,p} (\mathbb R^n)$，且给定任意 $\alpha, \beta \in \mathbb R^1$，那么，$\alpha f_1 + \beta f_2 \in C_{L_3}^{k,p} (\mathbb R^n), \text{ where } L_3 = |\alpha| L_1 + |\beta| L_2$

## Class $C_L^{1,1}(\mathbb R^n)$

相比 $C_L^{1,1}(\mathbb R^n)$，$C_L^{2,1}(\mathbb R^n)$ 具有更加良好的性质。因此我们经常用后者的充要条件，当做前者的充分条件。

> [!Lemma]
> 
> *Lemma 7*:  $f \in C_L^{2,1}(\mathbb R^n) \in C_L^{1,1}(\mathbb R^n)$, if and only if
> 
> $$
> \forall x \in \mathbb R^n: \norm{\nabla^2 f(x)} \leq L
> $$
> 
> *Proof*: 
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_16_49_6_JPEG%E5%9B%BE%E5%83%8F-472F-A728-90-0.jpeg"/>

> [!Example]
> 
> 对于线性 or 仿射函数，它们都是 $L = 0$；对于二次型，它们都是 $L = \norm{A}, \text{ where } f(x) = \alpha + \innerprod{a}{x} + \frac 1 2 \innerprod{Ax} {x}$
> 
> 对于非上述函数，我们也举一例：
> 
> $$
> f(x) = \sqrt{1 + x^2}, x \in \mathbb R^1
> $$
> 
> 那么，$\nabla f(x) = \frac {x} {\sqrt {1 + x^2}}$，且 $\nabla^2 f(x) = \frac {1} {(1 + x^2)^{3/2}} \leq 1$。
> 
> 因此：$f(x) \in C_1^{1,1}(\mathbb R^1)$

### Geometric Interpretation of Class $C_L^{1,1}(\mathbb R^n)$

> [!Lemma]
> 
> **Lemma 9**: if $f \in C_L^{1,1}(\mathbb R^n)$, then
> 
> $$
> |f(y) - f(x) - \innerprod{\nabla f(x)}{y-x} | \leq \frac L 2 \norm{y-x}^2
> $$
> 
> **注意**：令 $g(y) = f(x) - \innerprod{\nabla f(x)}{y-x}$，则 $g(x) = f(x), \nabla g(x) = \nabla f(x)$，也就是说：$g(y)$ 是 $f(y)$ 的一阶逼近。
> 
> *Proof*: 
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_16_49_58_JPEG%E5%9B%BE%E5%83%8F-423B-90AA-8E-0.jpeg"/>

一个直接推论就是：如果我们构造两个函数

$$
\begin{aligned}
\phi_1(x) = f(x_0) + \innerprod{\nabla f(x_0)}{x - x_0} + \frac L 2 \norm{x - x_0}^2 \newline
\phi_2(x) = f(x_0) + \innerprod{\nabla f(x_0)}{x - x_0} - \frac L 2 \norm{x - x_0}^2
\end{aligned}
$$

那么，显然有：$\phi_1(x) \geq f(x) \geq \phi_2(x), \forall x \in \mathbb R^n$。

> [!info] 两面包夹之势
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_15_45_7_20240924154507.png"/>
> 
> 如图：$g = \phi_1, h = \phi_2$

## Class $C_M^{2,2}(\mathbb R^n)$

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_16_13_7_20240924161307.png"/>

- Lemma 10 的证明方法和 lemma 9 的完全一样

> [!Lemma]
> 
> **Lemma 11**: if $f \in C_M^{2,2}(\mathbb R^n)$，那么 $\nabla^2 f(x) - Mr I_n \preceq \nabla^2 f(y) \preceq \nabla^2 f(x) + Mr I_n$
> 
> - 其中，$r = \norm{y-x}, I_n$ 就是 $n$ 阶单位矩阵
> - 另外，$A \preceq B$ 就是 $A - B \preceq 0$ 的等价记号
> 
> *Proof*: 
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_16_50_31_JPEG%E5%9B%BE%E5%83%8F-4E95-A8E6-50-0.jpeg"/>





