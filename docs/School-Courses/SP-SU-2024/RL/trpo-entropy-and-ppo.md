# 前言：置信域方法

目标问题：$\min_{\theta \in \mathbb R^n} J(\theta)$

我们采用局部搜索框架：

$$
\theta_\text{new} \leftarrow \mathop{\arg\min}_{\theta \in \mathcal N(\theta_\text{now})} J(\theta)
$$

- 其中，$\mathcal N(\theta_\text{now})$ 就是**邻域**

但是，这样做仍然是困难的。因此，我们构造一个**简单的、邻域内可以近似的函数** $L(\theta | \theta_\text{now})$，从而：

$$
\forall \theta_\text{now} \forall \theta \in \mathcal N(\theta_\text{now}): L(\theta | \theta_\text{now}) \approx J(\theta)
$$

- 在这个语境下，$\mathcal N(\theta_\text{now})$ 就被称为**置信域**，i.e. 我们可以在 $\mathcal N(\theta_\text{now})$ 上信任 $\theta$

> [!info]- 图解置信域
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/8_20_40_7_202407082040510.png"/>

## 伪代码

```python
def TrustRegion(theta, J, L, max_times):
    for i in range(max_times):
        theta = argmax(L, theta, N(theta))
    return theta
```

## 如何选择 $L(\theta | \theta_\text{now})$

我们很多时候，会直接选择：

$$
L(\theta | \theta_\text{now}) = J(\theta_\text{now}) + \nabla f(\theta_\text{now})^T (\theta - \theta_\text{now})
$$
\
- 也就是 vanilla gradient descent

常见的也有二阶优化：

$$
L(\theta | \theta_\text{now}) = J(\theta_\text{now}) + \nabla f(\theta_\text{now})^T s + \frac 1 2 s^T \nabla^2 f(\theta_\text{now}) s, \text{where } s = \theta - \theta_\text{now}
$$

当然，也可以使用 KL 散度等等。

# TRPO

对比：

- 状态价值：$V_\pi(s) = \mathbb E_{A \sim \pi(\cdot | s; \mathrm\theta)}[Q_\pi(s, A)] = \sum_{a \in \mathcal A} \pi(a | s; \mathrm \theta) Q_\pi(s, a)$
    - 与 $\pi$ 和 $s$ 有关
- 策略价值：$J(\mathrm \theta) = \mathbb E_S [V_\pi (S)]$
    - 只依赖于 $\mathrm \theta$

TRPO 遵循置信域方法的框架，重复**做近似**和**最大化**两个步骤，直到算法收敛。

## 1. 做近似

我们通过 importance sampling 改写一下 $J(\mathrm \theta)$:

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_1_9_53_202407090109234.png"/>

然后，采样一条完整轨迹（$s_1, a_1, r_1, s_2, a_2, r_2, \cdots, s_n, a_n, r_n$），从而得到估计式：

$$
L(\theta | \theta_\text{now}) = \frac 1 n \sum_{t=1}^n \frac {\pi(a_t|s_t; \mathrm \theta)} {\pi(a_t|s_t; \mathrm \theta_\text{now})} Q_\pi (s_t, a_t)
$$

- 从而，这里的 $L$ 就是 $J$ 的**无偏估计**
    - 当然，我们这里做一个大胆的近似：采集出来的 $s_1, s_2, \dots s_n \sim S$

> [!warning] Problem
> 
> 但是，仍然有问题：我们的网络是**策略网络**，而不是**价值网络**，因此没法给出 $Q_\pi(s_t, a_t)$。

因此，我们就干脆直接用下面的估计：

$$
Q_\pi(s_t, a_t) = r_t + \gamma \ast r_{t+1} + \gamma^2 \ast r_{t+2} + \gamma^{n-t} \ast r_n
$$

- 令 $u_t = \text{RHS}$，那么显然就得到更简化的形式：$Q_\pi(s_t, a_t) = u_t$

从而，最终的结果就是：

$$
\widetilde L(\theta | \theta_\text{now}) = \frac 1 n \sum_{t=1}^n \frac {\pi(a_t|s_t; \mathrm \theta)} {\pi(a_t|s_t; \mathrm \theta_\text{now})} u_t
$$

## 2. 最大化

我们的最大化问题：

$$
\max_{\mathrm \theta} \widetilde L(\mathrm \theta | \mathrm \theta_\text{now}); \quad s.t. \mathrm \theta \in \mathcal N(\mathrm \theta_\text{now})
$$

对于邻域而言，我们有两种邻域：

**球邻域（简单）**

 $$
 \mathcal N(\mathrm \theta_\text{now}) = \{\ \mathrm \theta : \| \mathrm \theta - \mathrm \theta_\text{now} \|_2 \leq \Delta\}
 $$

**KL 散度邻域（效果好）**

$$
\mathcal N(\mathrm \theta_\text{now}) = \left\{\ \mathrm \theta : \frac 1 t \sum_{i=1}^t \operatorname{KL}\left[ \pi \left( \cdot | s_i; \mathrm \theta_\text{now} \right)  {\|} \pi \left( \cdot | s_i; \mathrm \theta \right) \right] \leq \Delta \right\}
$$

## 3. 如何进行优化？

求一个**由不规则函数所定义的区域**内的一个**不规则目标函数**的最大值，只能将**区域和目标函数**两者都进行近似：要么梯度、要么进一步用 Hessian matrix。

- 我们这里将
    1. 目标函数 $L$ 进行一阶近似
    2. KL 散度进行二阶近似

然后，使用 KKT 条件进行转化。

具体如下图：

[<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_3_22_45_202407090322073.png"/>](https://hrl.boyuai.com/chapter/2/trpo%E7%AE%97%E6%B3%95#113-%E8%BF%91%E4%BC%BC%E6%B1%82%E8%A7%A3)

### 共轭梯度法

得到了最终的可以用来计算的式子之后，我们就采用共轭梯度法来求解。

> [!info]+ 维基百科：共轭梯度法
> 
> 设我们要求解下列线性系统
> 
> ![{\displaystyle Ax=b,}](https://wikimedia.org/api/rest_v1/media/math/render/svg/66dbdc9ace4de8b9bdcf2bd7eb7bfb117307e90b)
> 
> 其中 ![{\displaystyle n\times n}](https://wikimedia.org/api/rest_v1/media/math/render/svg/59d2b4cb72e304526cf5b5887147729ea259da78) 矩阵 ![{\displaystyle A}](https://wikimedia.org/api/rest_v1/media/math/render/svg/7daff47fa58cdfd29dc333def748ff5fa4c923e3) 是[对称](https://zh.wikipedia.org/wiki/%E5%B0%8D%E7%A8%B1%E7%9F%A9%E9%99%A3 "对称矩阵")的（即 ![{\displaystyle A^{T}=A}](https://wikimedia.org/api/rest_v1/media/math/render/svg/42a74fbcf03f7eddf2b58f8c0ce38411830f6281)），[正定](https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%AE%9A%E7%9F%A9%E9%98%B5 "正定矩阵")的（即 ![{\displaystyle \forall {\vec {x}}\neq 0,{\vec {x}}^{T}A{\vec {x}}>0}](https://wikimedia.org/api/rest_v1/media/math/render/svg/e07cdde194c6d7f8992054cb6ad0940772882e7f)），并且是实系数的。 将系统的唯一解记作 ![{\displaystyle x_{*}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/54181bafc8b3401909a790683476457984f484ba)。
> 
> 经过一些简化，可以得到下列求解 ![{\displaystyle Ax=b}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c294fb03a23c833d5b3cc6b3cbe40f25f0005745) 的算法，其中 ![{\displaystyle A}](https://wikimedia.org/api/rest_v1/media/math/render/svg/7daff47fa58cdfd29dc333def748ff5fa4c923e3) 是实对称正定矩阵。
> 
> ![{\displaystyle {\begin{aligned}&\mathbf {r} _{0}:=\mathbf {b} -\mathbf {Ax} _{0}\\&\mathbf {p} _{0}:=\mathbf {r} _{0}\\&k:=0\\&{\text{repeat}}\\&\qquad \alpha _{k}:={\frac {\mathbf {r} _{k}^{\mathsf {T}}\mathbf {r} _{k}}{\mathbf {p} _{k}^{\mathsf {T}}\mathbf {Ap} _{k}}}\\&\qquad \mathbf {x} _{k+1}:=\mathbf {x} _{k}+\alpha _{k}\mathbf {p} _{k}\\&\qquad \mathbf {r} _{k+1}:=\mathbf {r} _{k}-\alpha _{k}\mathbf {Ap} _{k}\\&\qquad {\hbox{if }}r_{k+1}{\text{ is sufficiently small, then exit loop}}\\&\qquad \beta _{k}:={\frac {\mathbf {r} _{k+1}^{\mathsf {T}}\mathbf {r} _{k+1}}{\mathbf {r} _{k}^{\mathsf {T}}\mathbf {r} _{k}}}\\&\qquad \mathbf {p} _{k+1}:=\mathbf {r} _{k+1}+\beta _{k}\mathbf {p} _{k}\\&\qquad k:=k+1\\&{\text{end repeat}}\\\end{aligned}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/65c4a04b3745ab744633eabb5eb2194013f8b240)
> 
> 结果为 ![{\displaystyle {x}_{k+1}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c88bea93faadfd84aeb50f02ca29d0cc1aabe6a0).

# 熵正则

熵损失就是：

$$
\mathbb E_S [H(S; \mathrm \theta)]
$$

从而：

$$
\begin{aligned}
\nabla_{\mathrm \theta} \mathbb E_S [H(S; \mathrm \theta)] 
&= -\mathbb E_S \left[\nabla_{\mathrm \theta} \sum_{a \in \mathcal A} \pi(a | s; \mathrm \theta) \ln \pi(a | s; \mathrm \theta) \right] \newline
&= -\mathbb E_S \left[\sum_{a \in \mathcal A} \left[ 1 + \ln \pi(a | s; \mathrm \theta)\right] \nabla_{\mathrm \theta}\pi(a | s; \mathrm \theta) \right] \newline
&= -\mathbb E_S \left[\sum_{a \in \mathcal A} \pi(a | s; \mathrm \theta)\left[ 1 + \ln \pi(a | s; \mathrm \theta)\right] \nabla_{\mathrm \theta} \left(\ln\pi(a | s; \mathrm \theta) \right)\right] \newline
&= -\mathbb E_S \left[ \mathbb E_{A \sim \pi(\cdot|s; \mathrm \theta)} \left[ (1 + \ln \pi(a | s; \mathrm \theta)) \nabla_{\mathrm \theta} (\ln\pi(a | s; \mathrm \theta)) \right]\right]
\end{aligned}
$$

- 推导类似于 policy gradient
- 我们的目标函数可以是 $\max_{\mathrm \theta} J(\mathrm \theta) + \lambda \cdot \mathbb E_S [H(S; \mathrm \theta)]$。其中 $\lambda$ 可以 tune

> [!seealso]+ 
> 
> 熵正则是策略学习中常见的方法，在很多论文中有使用。虽然熵正则能鼓励探索，但是增大决策的不确定性是有风险的：**很差的动作可能也有非零的概率**。
> 
> 一个好的办法是用 Tsallis Entropy 做正则，让离散概率具有稀疏性，每次决策只给少部分动作非零的概率，“过滤掉”很差的动作。有兴趣的读者可以阅读相关论文。

# PPO 算法

由于 TRPO 算法的求解比较 computationally expensive，因此我们采用近似的 PPO 算法。

对比

- TRPO: <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_4_18_27_202407090418725.png"/>
- PPO 惩罚: <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_4_18_44_202407090418715.png"/>
- PPO 截断（实际性能比 PPO 惩罚更好）: <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_4_29_50_202407090429002.png"/>

> [!summary]+ TRPO 和 PPO 小结
> 
> 1. 注意 $\theta_k$ 和 $\theta$ 不应该认为是有关的。因此对 $\theta$ 求梯度的时候，应该忽略 $\theta_k$
> 2. 但是，策略梯度中，应该用的是 $s \sim v^{\pi_\theta}$，说明 $s$ 的分布本身是和 $\theta$ 有关的。然而，很多推导中，貌似也忽略掉了。

