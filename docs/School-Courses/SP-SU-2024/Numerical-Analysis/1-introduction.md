$$
\newcommand{d}{\mathrm d}
\newcommand{dx}{\d x}
\newcommand{err}{\widetilde}
$$



# Lecture 1: Introduction

## 误差

### 例子：估计 $\int_0^1 e^{-x^2} \dx$

我们可以使用泰勒展开，来计算这个公式：

$$
\begin{aligned}
\int_0^1 e^{-x^2} \dx &= \int_0^1 (1-x^2 + \frac {x^4}{2!} - \frac {x^6}{3!} + \frac {x^8}{4!}-\dots) \dx \newline
&= 1 - 1 / 3 + 1 / 2! * 1 / 5 - 1 / 3! * 1 / 7 + 1 / 4! * 1 / 9 - \cdots \newline
&\approx 1 - 1 / 3 + 1 / 10 - 1 / 42 \newline
&\approx 1 - 0.333 + 0.1 - 0.024 \newline
&= 0.743
\end{aligned}
$$

在这里，有两个误差，一个是拉格朗日余项，一个是数值精度。

对于拉格朗日余项（$f(x) = e^{-x}$）：

$$
0 \leq R_{Lagrange} = \int_0^1  R_3(x^2) \dx = \int_0^1 \frac {f^{(4)}({x^2}^*)} {4!} (x^2)^4 \dx = \int_0^1 \frac {e^{{x^2}^*}} {4!} (x^2)^4 \dx \leq \int_0^1 \frac {1}{4!} * x^8 \dx = \frac {1}{4!} * \frac {1} {9} \leq 0.005
$$

从而：

$$
\lvert R_{Lagrange} \rvert \leq 0.005
$$


对于数值精度，由于我们采用 rounding，因此每个**存在精度损失的**数值的精度损失不超过 $0.0005$。由于有精度损失的数值有两个：$1/3$，$1/42$，因此最大损失为 $0.001$。

从而，总体最大误差，至多为 $0.006$。

#### 注意

为何选择三位精度？因为 Lagrange 余项的损失上限为 0.005。我们选择的精度的**精度损失上限应该和 Lagrange 余项损失上限*相符***。

### 误差来源

误差来源，有三种

- rounding error
  - 3.97 -> 3, 4.01 -> 4
- chopping error
  - 3.49 -> 3, 3.51 -> 4
- 数据本身的误差

### 绝对误差和相对误差

相对误差在同级相减时容易放大，绝对误差在大除小时容易放大。

#### 相对误差

##### 例子：有效位数

对于 $k$ 位有效位数的数字

- 如果采用 chopping，$p$ 的相对精度是：$10^{-k+1}$
  - e.g. $k=2: 10.99 \to 10$，相对精度就是 $0.099 \approx 0.1 = 10^{-2 + 1} $
- 如果采用 rounding，$p$ 的相对精度是：$0.5 * 10^{-k+1}$
  - e.g. $k=2: 10.49 \to 10$，相对精度就是 $0.049 \approx 0.05 = 0.5 * 10^{-2 + 1} $

##### 例子：同级相减

对于差不多大的数字，**相减**可能会导致有效数字减少。以下是一个极端的例子：

- $a = 3.1415925, \bar a = 3.1415925456789\dots$
- $b = 3.1415926, \bar b = 3.141592556789\dots$
- 那么，$\lvert a - b \rvert = 0.0000001, \lvert \bar a - \bar b \rvert = -0.000000011110\dots$
  - 从而，相对误差从之前的 $10^{-7}$ 量级，增大到了 $10^{-1}$ 之巨

这就是因为：
$$
\begin{aligned}
&a = \bar a + e_a, b = \bar b + e_b \newline
\implies &r = a - b = (\bar a + e_a) - (\bar b + e_b) = (\bar a - \bar b) + (e_a - e_b) \newline
\implies & r = \bar r + (e_a - e_b) \newline
\implies & \text{relative error of } r = \lvert \frac {e_a - e_b} {\bar r} \rvert
\end{aligned}
$$
相比之前的 $\text{relative error of } a \text{ or } b = \lvert \frac {e_a \text{ or } e_b} {a \text{ or } b} \rvert$，分母减小了很多。

#### 绝对误差

（计算同理）

## 数值稳定性

数值稳定性，简单来说，就是：

给入数据小误差，那么计算后的数据也应该小误差。

### 例子：$I_n = \int_0^1 x^ne^x \dx$[^1]

通过分部积分：

$$
\begin{align*}
I_0 &= e - 1\newline
I_n &= \int_0^1 x^n e^x \dx \newline
&= \int_0^1 x^n \d e^x \newline
&= x^ne^x |_0^1 - n \int x^{n-1}e^x \dx \newline
&= e - n I_{n-1}
\end{align*}
$$

令 $J_n = \frac 1 e I_n$（归一化之后方便分析），则
$$
\begin{aligned}
J_0 &= 1 - \frac 1 e\newline
J_n &= 1 - n \frac 1 e I_{n-1} = 1 - n J_{n-1}
\end{aligned}
$$

#### Naive Approach

为了计算 $J_{15}$，我们需要不停地进行迭代，从而得出如此离谱的结果：

```
J(0): 0.6321206
J(1): 0.3678794
J(2): 0.2642412
J(3): 0.2072764
J(4): 0.1708944
J(5): 0.1455280
J(6): 0.1268320
J(7): 0.1121760
J(8): 0.1025920
J(9): 0.0766720
J(10): 0.2332800
J(11): -1.566080
J(12): 19.79296
J(13): -256.3085
J(14): 3589.319
J(15): -53838.78
```

这是因为，每一次计算中，我们实际上计算的是**近似值**：

$$
J_n^* = 1 - n J_{n-1}^* \implies \err J_n = -n \err J_{n-1} \implies \lvert \err J_n \rvert = n! \lvert\err J_0\rvert
$$

（只考虑初始误差时，）这里的绝对误差是**阶乘级（i.e. 甚至超过了指数级）**增长的，相对误差更不必说。

#### Clever Approach

但是，还有另一种方法。我们可以反向计算：

我们容易证明：$\frac {1}{n+1} = \int_0^1 x^ne^0 \dx \leq I_n = \int_0^1 x^ne^x \dx \leq \int_0^1 x^ne^1 \dx = \frac {e}{n+1}$

因此：$\frac{1}{e(n+1)} \leq J_n \leq \frac {1} {n+1}$

并且：$J_{n} = \frac 1 {n + 1} (1 - J_{n + 1})$

---

我们可以先通过 $J_{15}$ 的近似值，计算一下 $J_1$ 试试看。

```
>>> clever_J_upper(0) 
Decimal('0.6321206')
>>> clever_J_lower(0) 
Decimal('0.6321206')
```

和准确值并无差别。

---

我们进而通过 $J_{100}$ 的近似值，计算一下 $J_0$ 到 $J_{15}$：

```
>>> max_val=100
>>> print_result(clever_J_upper)
clever_J_upper(0): 0.6321206
clever_J_upper(1): 0.3678794
clever_J_upper(2): 0.2642411
clever_J_upper(3): 0.2072766
clever_J_upper(4): 0.1708934
clever_J_upper(5): 0.1455329
clever_J_upper(6): 0.1268024
clever_J_upper(7): 0.1123835
clever_J_upper(8): 0.1009320
clever_J_upper(9): 0.09161229
clever_J_upper(10): 0.08387707
clever_J_upper(11): 0.07735223
clever_J_upper(12): 0.07177325
clever_J_upper(13): 0.0669477
clever_J_upper(14): 0.06273217
clever_J_upper(15): 0.05901754
>>> print_result(clever_J_lower) 
clever_J_lower(0): 0.6321206
clever_J_lower(1): 0.3678794
clever_J_lower(2): 0.2642411
clever_J_lower(3): 0.2072766
clever_J_lower(4): 0.1708934
clever_J_lower(5): 0.1455329
clever_J_lower(6): 0.1268024
clever_J_lower(7): 0.1123835
clever_J_lower(8): 0.1009320
clever_J_lower(9): 0.09161229
clever_J_lower(10): 0.08387707
clever_J_lower(11): 0.07735223
clever_J_lower(12): 0.07177325
clever_J_lower(13): 0.0669477
clever_J_lower(14): 0.06273217
clever_J_lower(15): 0.05901754
```

可以发现 upper 和 lower 的值都在精度范围内相等。我们用了一个 $J_{100}$ 的很粗糙的估计值，竟然算出了 $J_0$ 到 $J_{15}$ 的很精确的值！

这是因为，每一次计算中，我们都在减小误差：

$$
J_{n}^* = \frac 1 {n+1} (1 - J_{n+1}^*) \implies \err J_{n} = \frac 1 {n+1} \err J_{n+1}
$$

可以发现，（只考虑初始误差时，）绝对误差从 `max_val` 到 `n` 是阶乘级下降的，相对误差更不必说。

## Reference

[^1]: [迭代稳定性代码](https://github.com/MTDickens/numerical-analysis-sp24/blob/e512d84239e407862c4aa981b90ed9fa68d05cd7/lec1/integral-precision.py?plain=1#L1-L48)