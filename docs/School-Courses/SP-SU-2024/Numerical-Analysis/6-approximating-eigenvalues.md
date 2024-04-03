# Original Method

假设我们最大的 eigenvalue 是 dominant eigenvalue:
$$
|\lambda_1| > |\lambda_2| \geq |\lambda_3| \geq \dots \geq |\lambda_n| \geq 0
$$
我们随机取一个 $\vec{x_0} \neq \vec 0 \text{ and } \vec{x_0} \cdot \vec{v_1} \neq 0$

- 我们可以保证第一个条件，但是第二个条件只是 possibly satisfied

从而：$\vec {x_0} = \sum_{i=1}^n \beta_i \vec{v_i}$, where &beta;<sub>1</sub> &ne; 0.

我们不断对 $\vec{x_0}$ 乘上 $A$，从而：
$$ { }
\begin{aligned}
\vec{x_k} &= A^k \vec{x_0} \\
&= \sum_{i=1}^n \beta_i \lambda_i^k \vec{v_i} \\
&= \lambda_1^k \sum_{i=1}^n \beta_i \left(\frac{\lambda_i}{\lambda_1}\right)^k \vec{v_i} \\
&\approx \lambda_1^k * \beta_1 * \vec{v_1}, \text{ when k is large}
\end{aligned}
$$
从而：$\frac{(\vec{x_k})_1}{(\vec{x_{k-1}})_1} \approx \lambda_1$​, when k is large.

**Note:**

- 对于有多个的 maximum eigenvalue，且 maximum eigenvalue 都相等的情况，也是可以的。具体原因易证。
    - 注意：是 maximum eigenvalue 相等，而不是它们的模相等！
- 由于本质上这还是一个 sequence of vectors，因此可以用 Aitken's &Delta;<sup>2</sup> procedure 来加速求解。

### Normalization

由于 $\vec{x_k}$ 会迅速缩小，因此，我们需要在每一步中，对向量进行放缩，i.e. 令 $\|x\|_\infty = 1$ in each step

### Convergence

我们的目标就是：让 $|\lambda_2 / \lambda_1|$ 尽可能小。

实际上，如果我们令 $B = A - pI$，那么，就会有 $\lambda_1' = \lambda_1 - p, \lambda_2' = \lambda_2 - p$，从而可能 $|\lambda_2' / \lambda_1'|$ 会更小。

- i.e. $|0.98 / 1.00| > |0.01 / 0.03|$

# Inverse Power Method

如果我们希望求出 $A$ 最小的 eigenvalue，那么，就需要依靠 $A^{-1}$。

由于 $\lambda$ is an eigenvalue of $A$ &iff; $\frac 1 \lambda$ is an eigenvalue of $A^{-1}$，因此，我们只需要使用 $A^{-1}$ 迭代即可。

---

**如何计算 $A^{-1}x$？**

但是，显然，我们不会去直接求解 $A^{-1}$（数值稳定性太差），而是通过下面的方法来迭代：
$$
A^{-1}x = y \iff Ay = x
$$

---

**具体步骤**

1. 先将 $A$ 分解（比如 $P'LU$ 分解），便于之后的计算
2. 然后不断迭代即可。每次迭代的时间复杂度为 $\mathcal O(n^2)$，和矩阵乘法一样。

