# 算法铁三角

铁三角就是：

- O: Optimality
- E: Efficiency
- A: All instances

对于 NP-hard 问题，三者**顶多**只能取二：

- O+E: 对于特殊情况的特殊算法
- O+A: （假设 Exponential time hypothesis 成立）指数级别的暴力算法
- E+A: **近似算法**

## 近似比 (Approximation Ratio)

定义：如果对于任意的输入规模 $n$，算法产生的解的成本 $C$ 在最优解的成本 $C^\ast$ 的 $\rho(n)$ 倍以内：
$$
\max\left(\frac C {C^\ast}, \frac {C^\ast} C \right) \leq \rho(n)
$$
如果一个算法的近似比为 $\rho(n)$，那么就被称为 $\rho(n)$-近似算法。

### PTAS and FPTAS

PTAS (Polynomial-Time Approximation Scheme) 就是一个这样的算法：
$$
\exists f(\varepsilon), \forall \varepsilon > 0, \exists \text{ an algorithm A}: 1 - \rho_A(n) < \varepsilon \land time(A) = \mathcal O(n^{f(\varepsilon)})
$$
其中，$f(\epsilon)$ 可以是任意函数。我们只要保证对于每一个 $\varepsilon$，都有一个多项式时间的算法即可。

---

FPTAS (Fully PTAS) 可能是比 PTAS 更加 practical 的选择。
$$
\forall \varepsilon > 0, \exists \text{ an algorithm A}: 1 - \rho_A(n) < \varepsilon \land time(A) = \mathcal O(p(n, \frac 1 \varepsilon))
$$
也就是，有一个 $n, \frac 1 \varepsilon$ 的多项式，可以实现对于任意的 $\varepsilon$。

---

比如：$\mathcal O(n^{e^{\frac 1 \varepsilon}})$ 也算 PTAS，但是显然不是 FPTAS；而 $\mathcal O(n^2 (\frac 1 \varepsilon)^3)$ 算是 FPTAS。

