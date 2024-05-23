# Definition

## IVP (Initial Value Problem)

（一阶）初值问题的定义就是：

假设 $\mathrm y = \mathrm y(t)$，其中 $\mathrm y: \Omega \subset \mathbb R^n \to \mathbb R$，给定一个微分约束：
$$
\grad_t \mathrm y(t) = \mathrm f(\mathrm y, t)
$$
s.t. $\mathrm f: \mathbb R^n \times \mathbb R \to \mathbb R$

同时，给定一点 $(\mathrm y(t_0), t_0) \in \Omega$。

然后，需要你求出 $\mathrm y(t)$ 的表达式。

## Lipschitz

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_21_27_2_202405232127020.png"/>

- 注意：上面说的是 Lipschitz condition **in the variable $y$**，而不是 both $y, t$

---

我们为什么需要 Lipschitz 呢？考虑使用数值近似 IVP：

1. 首先，initial value 已经给出。而且是准确的。
2. 然后，我们通过数值近似去计算 $y(t_0 + \Delta t) \approx y(t_0) + y'(t_0) * \Delta t = y(t_0) + f(y(t_0), t)$
3. 然后，再进一步计算 $y(t_0 + 2\Delta t) \approx y(t_0 + \Delta t) + y'(t_0 + \Delta t) * \Delta t \approx w(t_0 + \Delta t) + f(w(t_0 + \Delta t), t_0 + \Delta t)$

其中，$w(t)$ 就是 $y(t)$​ 的近似值。

如果要尽量接近，我们就需要保证：$f(y(t_0 + \Delta t), t_0 + \Delta t) \approx f(w(t_0 + \Delta t), t_0 + \Delta t)$

而 LIpschitz 恰好可以实现这样的保证。

## Well-Posedness (适定性)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_21_56_36_202405232156408.png"/>

第一个条件很简单，就是要求 unique solution。而 uniquity 可以由 $f$ 的连续性和（y 上的）Lipschitz 性来保证。

第二个条件稍微复杂一些。意思是：给出初始值和函数本身一个微扰后，保证

- solution 仍然唯一
- 而且扰动后的 solution 和扰动前的 solution 在 [a,b] 上相差无几

也就是说，**对条件进行小扰动，解的变化也必须是小变化**。

这个条件，就是对微分方程自身的 robustness 提出了要求。

# Numerical Methods

## Euler's Method

欧拉方法是最 naive 的方法，具体如下所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_4_21_202405232204923.png" style="zoom: 80%;" />

- 上面图片中的定理，注意 L 在指数项上也有，因此函数实际上随着 L 的增大而增大，符合我们的直觉
- y 的二阶导（i.e. 弯曲程度）M 和步长 h 越小，则误差越小，也是符合直觉的

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_21_41_202405232221817.png" style="zoom: 80%;" />

**obs 1**

使用链式法则，可以得出：
$$
y''(t) = y'(t) f^{(0, 1)}(t, y(t)) + f^{(1, 0)}(t, y(t))
$$

- 图片中的貌似有一些问题

**obs 2**

但是，如果考虑了 round-off error（使用浮点数，处处都是 round-off error），那么，情况就大有不同：

圆括号中的 $\left(\frac {hM} 2 + \frac \delta h\right)$ 是有下界的：$\sqrt{2 M \delta}$。即使你可以把步长取得很短，也无法避免 round-off error，从而欧拉方法有着一个不可逾越的误差界。

## Higher Order Taylor Methods

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_43_40_202405232243235.png"/>

如图：我们之前的算法是 $w_{i+1} = w_i + h f(t_i, w_i)$。我们不妨将算法 generalize 成 $w_{i+1} = w_i + h\phi(t_i, w_i)$，其中 $\phi$ 可以是任意函数。

那么，local truncation error 的定义就是如上所示。大意就是：如果使用**真正的 $y_i$** 来计算 $w'_{i+1}$，那么和真正的 $y_{i+1}$ 相对误差（相对于 h）会是多少。

如上图，我们通过泰勒展开到 2 阶余项，就可以得出 Euler's method 的 local truncation。

- 不难算出，Euler's method 的 local truncation error 是 $\frac h 2y''(\xi_1) = \mathcal O(h)$，并不算小。

---

我们不妨这样设计一个 heuristic：

如何让 local truncation method 的阶数更高，那就要让 $\phi$ 尽量展开到高阶。也就是下图：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_50_35_202405232250961.png"/>

## Implicit Euler's Method

欧拉法是：
$$
w_{i+1} = w_i + h f(w_i, t_i)
$$
而隐式欧拉法是：
$$
w_{i+1} = w_i + h f(w_{i+1}, t_{i+1})
$$
这里的想法就是：欧拉法就是根据**当前**的 f，走到下一个点，**走哪算哪**；而隐式欧拉法，必须保证自己走到下一个点之后，**自己和下一个点的连线必须就是下一个点的切线**。

由于 f 非线性，因此我们一般只能用迭代法来求解。

- 求解出来的误差是 $-\frac h 2y''(\xi_1)$

### Trapezoidal Method & Double-Step Method

隐式欧拉误差：$-\frac h 2y''(\xi_1)$

显示欧拉误差：$\frac h 2y''(\xi_1)$

两者平均一下，就可以将误差缩小至 $\mathcal O(h^2)$​。

---

还有一个所谓的 double step 方法。可以先用直接欧拉法算一遍，然后再用 double-step method 再提高精度。

- 这个方法最大的好处就是没有隐式的成分，不需要迭代计算

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_23_59_45_202405232359236.png" alt="image-20240523235940161" style="zoom:67%;" />

## Comparison

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_0_1_52_202405240001584.png" style="zoom:80%;" />

其中，如果不是做**长序列计算**的话，那么 local truncation error 就是 error 的一个很好的近似。从而 double step 方法是兼具精确性和高效性的方法。

但是，对于长序列计算，double-step 就会变得不稳定，从而一般我们都是使用 Euler's Implicit 以及 Trapezoidal 方法计算。