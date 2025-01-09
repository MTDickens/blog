## Definition

### IVP (Initial Value Problem)

（一阶）初值问题的定义就是：

假设 $\mathrm y = \mathrm y(t)$，其中 $\mathrm y: \Omega \subset \mathbb R^n \to \mathbb R$，给定一个微分约束：
$$
\nabla_t \mathrm y(t) = \mathrm f(\mathrm y, t)
$$
s.t. $\mathrm f: \mathbb R^n \times \mathbb R \to \mathbb R$

同时，给定一点 $(\mathrm y(t_0), t_0) \in \Omega$。

然后，需要你求出 $\mathrm y(t)$ 的表达式。

### Lipschitz

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_21_27_2_202405232127020.png"/>

- 注意：上面说的是 Lipschitz condition **in the variable $y$**，而不是 both $y, t$

### Well-Posedness (适定性)

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


## Basic Numerical Methods

### Euler's Method

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

### Higher Order Taylor Methods
#### Local Truncation Error (LTE)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_43_40_202405232243235.png"/>

如图：我们之前的算法是 $w_{i+1} = w_i + h f(t_i, w_i)$。我们不妨将算法 generalize 成 $w_{i+1} = w_i + h\phi(t_i, w_i)$，其中 $\phi$ 可以是任意函数。

那么，local truncation error 的定义就是如上所示。大意就是：如果使用**真正的 $y_i$** 来计算 $w'_{i+1}$，那么和真正的 $y_{i+1}$ 相对误差（相对于 h）会是多少。

如上图，我们通过泰勒展开到 2 阶余项，就可以得出 Euler's method 的 local truncation。

- 不难算出，Euler's method 的 local truncation error 是 $\frac h 2y''(\xi_1) = \mathcal O(h)$，并不算小。

#### A Heuristic

我们不妨这样设计一个 heuristic：

如何让 local truncation method 的阶数更高，那就要让 $\phi$ 尽量展开到高阶。也就是下图：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_22_50_35_202405232250961.png"/>

### Implicit Euler's Method

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

#### Trapezoidal Method & Double-Step Method

隐式欧拉误差：$-\frac h 2y''(\xi_1)$

显示欧拉误差：$\frac h 2y''(\xi_1)$

两者平均一下，就可以将误差缩小至 $\mathcal O(h^2)$​。

---

还有一个所谓的 double step 方法。可以先用直接欧拉法算一遍，然后再用 double-step method 再提高精度。

- 这个方法最大的好处就是没有隐式的成分，不需要迭代计算

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/23_23_59_45_202405232359236.png" alt="image-20240523235940161" style="zoom:67%;" />

### Comparison

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/24_0_1_52_202405240001584.png" style="zoom:80%;" />

其中，如果不是做**长序列计算**的话，那么 local truncation error 就是 error 的一个很好的近似。从而 double step 方法是兼具精确性和高效性的方法。

但是，对于长序列计算，double-step 就会变得不稳定，从而一般我们都是使用 Euler's Implicit 以及 Trapezoidal 方法计算。

## Runge-Kutta Method

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

### Higher-Order Runge-Kutta

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

## Multi-Step Method

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

#### Explicit Multistep Method

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

### Implicit Multistep Method

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

#### Real World Calculation

一般而言，在现实中，我们采用：
1. Runge-Kutta 方法来计算出前几个点
    - 主要是因为前几个点只能这么算（因为再前面没有点了）。
2. Explicit Method 先求一遍
3. Implicit Method 再 correct 一遍

## Higher Order ODE

上面的若干个公式中，我们只考虑了 1 阶 ODE。下面我们拓展到任意阶的 ODE：

$$
y^{(m)}(t) = f(t, y, y', y'', \dots, y^{(m-1)})
$$

然后，我们可以将它变成一个**线性 ODE 方程组**，且里面的每一个 ODE 都是 1 阶的：

$$
\begin{aligned}
u_1' &= y' = u_2 \newline
u_2' &= y'' = u_3 \newline
\vdots \newline
u_{m-1}' &= y^{(m-1)} = u_m \newline
u_{m}' &= y^{(m)} = f(\cdot, u_1, \dots, u_m)
\end{aligned}
$$

- 其中：$u_i := y^{(i - 1)}$
- 同时，我们需要给出其初值：$u_1(a) = \alpha_1, \dots, u_m(a) = \alpha_m$。

> [!info]+ A better formalization
> 
> 我们可以将上面的方程组，抽象成一个**多元向量值函数的方程**（$\vec y'(t) = \vec f(t, \vec y)$），然后**形式上**就和 1 阶 ODE 方程统一了。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_20_9_25_202406052009915.png"/>
### Example: Higher Order Modified Euler's Method

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_20_6_43_202406052006836.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_20_23_35_202406052023182.png"/>

## Stability

> [!abstract]+
> 
> 对于 one-step 和 multi-step 的方法，我们可以给出 consistent 和 convergent 的定义（这两个概念，对我们之后的分析有用）
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_20_38_53_202406052038749.png"/>

下面是 **stability** 的定义，以及一个例子（有一个直观印象就好）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_20_41_50_202406052041156.png"/>

- 如图：可以发现 explicit 和 modified methods 的**趋势就是错的**，implicit method 的**趋势是正确的，虽然值差了不少**
    - 其实，如果 $h > 1 / 15$，就会出现不断上升的情况；而如果 $h < 1 / 15$，那么就是不断下降。但是，implicit method 可以保证在 $h = 0.1$ 的情况下下降，说明 **implicit method has better *stability* than explicit/modified ones**。

### Definition of Stability

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_21_13_18_202406052113093.png"/>

上图的意思就是：

- 给定一个 test equation $f(t, y) = y'(t) = \lambda y$，以及初值 $\alpha$（也就是 $y = \alpha e^{\lambda t}$）。
- **给定一个 $\lambda$**，我们计算出来所有的步长 $h$，使得两个参数下，数值计算的误差可以越来越小
    - 那么，对于每一组 $(\lambda, h)$，我们就称 this method is **absolute stable** w.r.t $H = \lambda h$
- 所有的 H 组成一个 region of absolute stability。这个区域越大，则方法越稳定

> [!question]+ 几个问题
> 
> 1. **为什么要求 $\Re(\lambda) < 0$**： 因为只有小于 0，才是右侧的图，真实函数值最终收敛到 0；大于 0，就是左侧的图，本身就是发散的。**本身就发散的函数，谈何“误差”能够收敛？只有本身能够收敛的函数，才能考虑其*误差*也收敛**
> 2. **如何判断 initial error will decrease**：实际上，我们根本不需要判断 initial error。因为在 $\Re(\lambda) < 0$ 的情况下，**真实函数值**随着 $t_i$ 增大收敛到 0，所以只要**数值计算的一系列值 $\{w_i\}$ 也收敛到 0，就必然有 "initial error will decrease"**。

### Example: Explicit & Implicit Euler's Method

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_21_25_19_202406052125824.png"/>

对于 explicit method, 之前的 $y' = -30y$ 的例子，我们通过实验，发现 $h = 1/15$ 是分界线。由于 $1 + H = 1 + 1 / 15 * (-30) = -1$，不难发现我们的理论和实验是相符的。

而对于 implicit method，即使 $h$ 比较大，也可以收敛。实际上，如果忽略除了 initial error 以外的一切 error，那么 implicit method 对于所有的 $(\lambda, h)$ 都收敛。

- 因为 $\Re(\lambda) < 0, h \in \mathbb R^+$，因此 $\Re(H) = \Re(\lambda h) < 0$。而小于 0 的区域，不难看出，全部是蓝色的。
- 也就是说：**unconditionally stable**
### Example: Implicit & Explicit Runge-Kutta Method

> [!note]+ **Implicit** 2nd-order Runge-Kutta method
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_21_37_48_202406052137503.png"/>
> 
> 上图是二阶的 implicit 方法，蓝色区域**恰好就是** $\Re(H) < 0$。因此也是 **unconditionally stable**。

> [!note]+ **Explicit** Runge-Kutta Method
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_21_42_34_202406052142018.png"/>
> 
> 上面是 1 \~ 4 阶的 Runge-Kutta 的绝对收敛域，可以发现，虽然随着阶数的增大，收敛于也增大，但是**远远不及 implicit 方法的无条件收敛**

因此，可以这么说。假如我们给定一个初值：

- 如果只算很少几步，那么，基本上，**四阶显式 Runge-Kutta 比二阶隐式的更准**
- 如果算成百上千步，那么，基本上，**二阶隐式 Runge-Kutta 比四阶显式的更准**

> [!summary]+
> 
> 我们可以这么认为：隐式方法的**贪心策略**比显式的**更优**。虽然 4 阶在一步之内更准，但是其**误差偏的方向不好**，百步之外就会明显恶化；2 阶虽然不那么准，但是**误差偏的方向好**，百步之外也不错。
> 
> 另外，这还说明了：local truncation error **has nothing to do with** stability

### Stability of Linear System

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/5_22_18_1_202406052218308.png"/>

考虑上面的线性系统就是：

$$
\mathrm u' = 
\begin{pmatrix}
u_1' \newline
u_2' \newline
\end{pmatrix} + \mathrm b(t) = 
\begin{pmatrix}
9 & 24 \newline
-24 & -51 \newline
\end{pmatrix} \mathrm u + \mathrm b(t)
$$
进行特征值分解：

$$
\begin{aligned}
&\mathrm u' = \mathrm W 
\begin{pmatrix}
-3 & 0 \newline
0 & -39 \newline
\end{pmatrix} \mathrm W^{-1} \mathrm u + \mathrm b(t) \newline
\implies & (\mathrm W^{-1} u)' = \mathrm W^{-1} (u)' = \begin{pmatrix}
-3 & 0 \newline
0 & -39 \newline
\end{pmatrix} \mathrm W^{-1} \mathrm u + \mathrm W^{-1} \mathrm b(t) \newline
\implies& \mathrm v' = 
\begin{pmatrix}
-3 & 0 \newline
0 & -39 \newline
\end{pmatrix} \mathrm v + \mathrm c(t) \newline
\implies& 
\left\{\begin{matrix} v_1' = -3 v_1 + c_1(t) \newline v_2' = -39 v_2 + c_2(t) \end{matrix}\right.
\end{aligned}
$$

从而，我们得到了两个 decoupled 方程。两个方程分别是 $\lambda_1 = -3, \lambda_2 = -39$。

**假如说不进行 decoupling**，且采用 explicit Runge-Kutta method 进行计算，那么就必须有：

$$
h < \min(2 / 3, 2 / 39) = 2 / 39
$$

从而，就造成了浪费，因为本来第一个迭代方程只需要 $h_1 < 2 / 3$。

> [!info]+ 实际的例子
> 
> ***一***、很多实际中的计算，矩阵的特征值分布是**小特征值很多，大特征值很少**。因此会感觉“很浪费”。
> 
> ***二***、在实际的工业软件中，假如说 h 本来可以为 4 mm，但是现在由于精度问题，必须为 2 mm，那么就会导致：
> 
> 1. 同样的体积，有限元数量增加到了 8 倍
> 2. 从而，进行一次矩阵运算，就需要 8<sup>3</sup>  倍的运算量
> 3. 然后，由于自由度增加了，最大的 eigenvalue 又飙升。总共，导致了 8<sup>4</sup> 的运算量
> 
> 总共就是 4096 倍的运算量。假如说 4 mm 可以在 1 天算完，2 mm 就要用 11.2 年算完，前者非常 trivial，后者完全是 intractable。
> 

> [!note]+ Observation
> 
> 1. 特征值之间的分布越不均匀，这样的浪费越大。
> 2. 矩阵的**条件数**和**步长浪费**一般而言是一起出现的，也就是说，**特征值相差太大的矩阵，不管是在动力系统中，还是在解线性方程组中，都是非常不受喜欢的**。

