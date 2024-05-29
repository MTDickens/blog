# Definition

## IVP (Initial Value Problem)

（一阶）初值问题的定义就是：

假设 $\mathrm y = \mathrm y(t)$，其中 $\mathrm y: \Omega \subset \mathbb R^n \to \mathbb R$，给定一个微分约束：
$$
\nabla_t \mathrm y(t) = \mathrm f(\mathrm y, t)
$$
s.t. $\mathrm f: \mathbb R^n \times \mathbb R \to \mathbb R$

同时，给定一点 $(\mathrm y(t_0), t_0) \in \Omega$。

然后，需要你求出 $\mathrm y(t)$ 的表达式。

## Lipschitz

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_21_27_2_202405232127020.png"/>

- 注意：上面说的是 Lipschitz condition **in the variable $y$**，而不是 both $y, t$

## Well-Posedness (适定性)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_21_56_36_202405232156408.png"/>

第一个条件很简单，就是要求 unique solution。而 uniquity 可以由 $f$ 的连续性和（y 上的）Lipschitz 性来保证。

第二个条件稍微复杂一些。意思是：给出初始值和函数本身一个微扰后，保证

- solution 仍然唯一
- 而且扰动后的 solution 和扰动前的 solution 在 $[a,b]$ 上相差无几

也就是说，**对条件进行小扰动，解的变化也必须是小变化**。因此，如果要满是第二个条件，那么微分方程本身必须足够 robust。而这个 robustness，可以由 Lipschitz 来推导出来。

> [!question]+ 为什么可以用 Lipschitz？
> 
> 考虑使用数值近似 IVP：
> 
> 1. 首先，initial value 已经给出。而且是准确的。
> 2. 然后，我们通过数值近似去计算 $y(t_0 + \Delta t) \approx y(t_0) + y'(t_0) * \Delta t = y(t_0) + f(y(t_0), t)$
> 3. 然后，再进一步计算 $y(t_0 + 2\Delta t) \approx y(t_0 + \Delta t) + y'(t_0 + \Delta t) * \Delta t \approx w(t_0 + \Delta t) + f(w(t_0 + \Delta t), t_0 + \Delta t)$
> 
> 其中，$w(t)$ 就是 $y(t)$​ 的近似值。
> 
> 如果要尽量接近，我们就需要保证：$f(y(t_0 + \Delta t), t_0 + \Delta t) \approx f(w(t_0 + \Delta t), t_0 + \Delta t)$
> 
> 而 Lipschitz 恰好可以实现这样的保证。


# Basic Numerical Methods

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
### Local Truncation Error (LTE)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_43_40_202405232243235.png"/>

如图：我们之前的算法是 $w_{i+1} = w_i + h f(t_i, w_i)$。我们不妨将算法 generalize 成 $w_{i+1} = w_i + h\phi(t_i, w_i)$，其中 $\phi$ 可以是任意函数。

那么，local truncation error 的定义就是如上所示。大意就是：如果使用**真正的 $y_i$** 来计算 $w'_{i+1}$，那么和真正的 $y_{i+1}$ 相对误差（相对于 h）会是多少。

如上图，我们通过泰勒展开到 2 阶余项，就可以得出 Euler's method 的 local truncation。

- 不难算出，Euler's method 的 local truncation error 是 $\frac h 2y''(\xi_1) = \mathcal O(h)$，并不算小。

### A Heuristic

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

# Runge-Kutta Method

> [!abstract]+ 引入
> 
> Trapezoidal Method 是：
> 
> $$
> \begin{aligned}
> w_{i+1} &= w_i + \frac h 2 \left[K_1 + K_2\right] \newline
> K_1 &= f(t_i, w_i) \newline
> K_2 &= f(t_i + h, w_{i+1})
> \end{aligned}
> $$
> 
> - 其中，$w_{i+1}$ 需要通过反复迭代的方式近似出来
> 
> 而 Modified (Explicit) Euler's Method 有类似的形式，只是不需要反复迭代了：
> $$
> \begin{aligned}
> w_{i+1} &= w_i + \frac h 2 \left[K_1 + K_2\right] \newline
> K_1 &= f(t_i, w_i) \newline
> K_2 &= f(t_i + h, w_i + hK_1)
> \end{aligned}
> $$
> 
> Modified Euler‘s Method，可以认为就是在 $(w_i, t_i)$ 和 $(w_i + h f(t_i, w_i), t_i + h)$ 这两个地方进行采点，然后求平均。**因此，我们不难想到，为何不能在两点之间的这个小区间内进行多次采点，然后进行加权平均呢？这样做，是不是就更加“全面”、“客观”，进而迭代的结果也会更加精确呢？**



首先，我们可以 generalize modified Euler’s Method：

$$
\begin{aligned}
w_{i+1} &= w_i + h \left[\textcolor{red}{\lambda_1} K_1 + \textcolor{red}{\lambda_2}K_2\right] \newline
K_1 &= f(t_i, w_i) \newline
K_2 &= f(t_i + \textcolor{red}ph, w_i + \textcolor{red}phK_1)
\end{aligned}
$$

- 红色的是待定的参数

> [!note]- 系数关系的推导过程
> 
> 为了实现 $O(h^2)$ 的 local truncation error，我们首先研究一下 $K_2$ 和 $K_1$ 的性质。先在 $K_2$ 上，对 $h$ 进行泰勒展开。
> 
> $$
> \begin{aligned}
> K_2 &= f(t_i + ph, y_i + phK_1) = f(t_i, y_i) + (p f_t(t_i, y_i) + pK_1 f_y(t_i, y_i)) h + O(h^2) \newline
> &= f(t_i, y_i) + phf_t(t_i, y_i) + phK_1 f_y(t_i, y_i) + O(h^2)
> \end{aligned}
> $$
> 
> 又由于：$y''(t) = \frac {\partial f(y(t), t)} {t} = f_t(t, y) + f_y(t, y) y'(t) = f_t(t, y) + f_y(t, y) f(t, y)$  。
> 
> 因此：$K_2 = y'(t) + ph y''(t) + O(h^2)$。
> 
> 代回原式：
> 
> $$
> \begin{aligned}
> &\text{Local Truncation Error} \newline
> =&\frac {y_{i+1} - (y_i + h \left[\textcolor{}{\lambda_1} K_1 + \textcolor{}{\lambda_2}K_2\right])} {h} \newline
> =& \frac {y_{i+1} - (y_i + (\lambda_1 + \lambda_2) h y'(t_i) + \lambda_2 ph^2 y''(t_i) + O(h^3))} {h} \newline
> =& \frac {(y_i + hy'(t_i) + \frac {h^2} 2 y''(t_i) + O(h^3)) - (y_i + (\lambda_1 + \lambda_2) h y'(t_i) + \lambda_2 ph^2 y''(t_i) + O(h^3))} {h} \newline
> =& (1 - \lambda_1 - \lambda_2) y'(t_i) + h (\frac12 - \lambda_2 p) y''(t_i)) + O(h^2)
> \end{aligned}
> $$
> 

通过推导过程可以看出，为了实现二阶，我们必须满足：
1. $\lambda_1 + \lambda_2 = 1$
2. $\lambda_2 p = \frac 1 2$

因此，只要给定步长 $p$，就有 $\lambda_1 = 1 - \frac 1 {2p}, \lambda_2 = \frac 1 {2p}$。

> [!info]+ Observation
> 
> 1. 不难发现，modified Euler's Method 就是令 $p=1$ 时的公式。
> 2. 由于可以随便改变 $p$，因此方法是无穷无尽的。这个类方法的集合，就是所谓的 Runge-Kutta Method of Order 2

## Higher-Order Runge-Kutta

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/29_18_17_21_202405291817624.png"/>

如图，我们可以采多个点，使用高阶的 Runge-Kutta，具体的思路就是：
1. 第一个点，只能是 $(t_i, w_i)$，因为没有别的可以采集了
2. 第二个点，就有了两个超参数：整体上，沿着导数方向移动，但是实际上，你还可以
    1. 左右调整（使用 $\alpha_2$）
    2. 上下调整（使用 $\beta_{21}$）
    从而在导数方向的基础上，按照我们的喜好取点
3. 第三个点，三个超参数：步长 1 个，外加第一个导数和第二个导数的线性组合（两个），共 3 个
4. ……

其中，最常用的就是 4 阶 Runge-Kutta（如上图）。

> [!question]- 阶数越高越好吗？
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/29_18_37_23_202405291837250.png"/>
> 
> 首先，整体的趋势是：阶数增加，best possible LTE 也线性增加。但是，从表格中可以看出，对于某些阶数，也不一定（比如 4 阶）。
> 
> 其次，Runge-Kutta 的 bound 非常依赖泰勒展开。因此，对于“导数比较飘”的函数，高阶展开不是好的选择，同样，高阶 Runge-Kutta 也不是。
> - 此时，就应该像**插值**一样：我们可以减小步长 $h$，然后使用低阶的方法计算。

# Multi-Step Method

> [!abstract]+ 引入
> 
> 我们可以尝试去拟合 $y(t)$ 这个函数。具体就是使用多项式拟合。
> 
> 然后，由于我们知道之前的 $w_i, f(w_i, t_i)$，也就是每一个点，知道其值和导数。因此就可以采用 Hermite 插值，计算出多项式，然后算出下一个 $y(t + h)$。


还有另外一个方法：$y_{i+1} - y_i = \int_{t_i}^{t_i + h} y'(t) \mathrm dt = \int_{t_i}^{t_i + h} f(y(t), t) \mathrm dt$。

因此，这个微分方程的数值问题，就变成了一个数值积分的问题。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/29_19_20_18_202405291920803.png"/>

如上图，我们通过之前几个 $f(y_i, t_i)$，可以插值出一个近似的（当然，由于我们并不知道 $f(y(t), t)$ 的导数，因此这里的插值就是一般的**函数值插值**）$P_{m-1}(t_i+sh)$ 出来。然后我们只需要估计出 $P$ 和真实的 $f$ 之间的差距——$R$ 即可。
- 另外注意：这里的 $P$ 是横坐标上缩放过的，因此可以保证积分域在 $[0,1]$ 上（可以简化之后的分析）

> [!question]+ 为什么要用 $P_{m-1}(t_i + sh)$ 这样奇怪的函数？
> 
> 原因是为了**方便插值计算**。比如如果要用到前面的 $m$ 个点，那么这 $m$ 个点就分别对应 $t_i - (m-1)*h, t_i - (m-2)*h, \dots, t_i$，在 $P$ 中就是 $s = -(m-1), -(m-2), \dots, 0$。

### Explicit Multistep Method

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/29_20_47_25_202405292047345.png"/>

假如有 3 个点，那么我就进行插值：

$$
P_2(t_i + sh) = \frac {(s+1)(s+2)} 2 f_i + \frac {s(s+2)} {-1} f_{i-1} + \frac {(s)(s+1)} 2 f_{i-2}
$$
从而积分可得：

$$
\int_0^1 P_2(t_i + sh) \mathrm ds = \frac {23} {12} f_i - \frac 43 f_{i-1} + \frac 5 {12} f_{i-2}
$$

我们还可以计算出来 error（如下图，不过下图中的 error 是两个点的情况）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/29_21_39_3_202405292139462.png"/>

> [!note]+ 误差计算思路
> 
> 具体计算方法，就是**先不管什么 $sh$ 之类的东西**，直接把它当成拉格朗日插值来近似，那么就是 $f''(t) / 2 * (t-t_i) * (t-t_{i-1})$。然后再将 $t$ 之类的换成 $s$（比如 $t_i$ 就是 $0$，$t_{i-1}$ 就是 $-1$，因此分别对应 $s-0=s$ 和 $s-(-1) = s+1$。
> 
> 因此，最终就是 $\int_0^1 f''(\dots) / 2 (sh) ((s-1)h) \mathrm ds$。
> 
> 对于更加高阶的，计算思路一样。

## Implicit Multistep Method

**隐式方法，和之前一样，本质上就是提前用到下一个点的数据，然后求不动点。**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/29_22_4_8_202405292204021.png"/>

- 系数的推导和 explicit method 基本思路一样。
- （**假如说 $w_{i+1}$ 是之前不知道的**）计算就是设置一个初始值，然后不断迭代解出 $w_{i+1}$

> [!note]+ 隐式方法相比显式方法的好处
> 
> 注意：采用相同的点数，两者的误差阶数其实是一样的。因此不算做隐式方法的好处。
> 
> **隐式方法的主要好处在于**：采用相同的点数（隐式方法包含），系数更小。
> 
> 这是因为我们的积分域是 $[t_i, t_{i+1}]$。如果将 $(t_{i+1}, w_{i+1})$ 引入到插值多项式，Lagrange 误差 $\frac 1 {(n+1)!} f^{(n+1)}(\xi_x) \prod_{i=0}^n (x' - x_i)$ 的后面的那一个 $\frac 1 {(n+1)!} \prod_{i=0}^n (x' - x_i)$ 就会比较小
> - 具体来说，这是因为，$\frac 1 {(n+1)!} \prod_{i=0}^n (x' - x_i)$ 相比 $\frac 1 {n!} \prod_{i=0}^{n-1} (x' - x_i)$ 多乘了一个 $\frac {x'-x_n} {n+1}$。但是由于 $\forall t \in [t_i, t_{i+1}]: (t - t_{i+1}) \leq h$，因此系数就相当于乘了一个 $\frac 1 {n+1}$
> - 或者，简单来说，就是**积分域被包含在插值域里了**。

同样，我们一般也是使用 4 阶的 Adams-Moulton。不过，如果不算 $w_{i+1}$ 的话，那就只需要用到 3 个之前的点。

### Real World Calculation

一般而言，在现实中，我们采用：
1. Runge-Kutta 方法来计算出前几个点
    - 主要是因为前几个点只能这么算（因为再前面没有点了）。
2. Explicit Method 先求一遍
3. Implicit Method 再 correct 一遍

