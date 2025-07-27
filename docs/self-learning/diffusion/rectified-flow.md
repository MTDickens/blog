## 前情提要

DDPM 及其衍生出来的若干种方法：

1. 在公式上面，需要用到变分下界（基本形式 $\ln p_\theta(x) \geq \mathbb E_{z \sim q_\phi}\left[\ln \frac {p_\theta(x, z)} {q_\phi(z)}\right]$）的冗长复杂推导

    <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/07/27_21_43_46_202507272143030.png" style="zoom: 67%;" />

	- 如果从 score function 的角度出发的话，那么又会牵扯到 score matching
		- 将离散时间随机过程转换成连续时间随机过程之后，又会牵扯到 SDE 这种更加高级的数学工具
2. 在生成速度方面，由于需要多步生成，因此生成速度慢（典型的例子是需要几十步）

---

因此，DDPM 在可拓展性方面差（毕竟这种高深的数学不利于入门），在生成速度方面也不友好。

我们这里提出一个直截了当，而且可以一步生成的方法：rectified flow。

---

跟 DDPM 及其衍生方法相比：

1. 原理简单：我们无需一般扩散模型复杂的推导，代之以一个简单的**“沿直线生成”**的思想。算法理解上不需要变分法或随机微分方程等基础知识。我们的方法是基于一个简单的常微分方程(ODE)，通过构造一个“尽量走直线”的连续运动系统来产生想要的数据分布。
2. 生成步数少：“尽量走直线”的目的是让我们模型实现快速生成。通过一个叫**“reflow”**的方法，我们可以实现梦想中的“**一步生成”：**只需一步计算就直接产生高质量的结果，而不需要调用计算量大的数值求解器来迭代式地模拟整个扩散过程。
3. 可用于迁移学习：通常的扩散模型是把高斯白噪声转换成想要的数据(比如图片)。我们的方法可以把任何一种数据或噪声(比如猫脸照片)转换成另外一种数据(比如人脸照片)。所以我们的方法不仅可以做生成模型，还可以应用于很多更广泛的**迁移学习** (比如domain transfer）任务上。

## 原理

### 流模型

无论是从噪声生成图片(generative modeling)，还是将人脸转化为猫脸 (domain transfer)，都可以这样概括成**将一个分布转化成另一个分布的问题**

在常见的生成模型中：

- $Z_0 \sim \pi_0$ 是噪声分布
- $\pi_1$ 是数据的分布（比如 imagenet）
- 我们希望使用一个（确定的）映射 $T$，让 $Z_1 = T(Z_0) \sim \pi_1$

---

我们如何拟合这个 $T$ 呢？我们这里使用所谓“流模型”来拟合：

- 随着时间从 $0$ 变为 $1$，一个粒子从位置 $Z_0$ 流动到位置 $Z_1$
- 其中，在时间为 $t$ 的时候，这个粒子的位置是 $Z_t$。它此刻的速度是 $v(Z_t, t)$
    - 也就是说，我们需要拟合的对象，就是一个随着时间变化的速度场 $v(x, t)$
    - 而 $T$ 这个映射，就通过基于这个速度场的 ODE 来定义：$\frac {\mathrm d}{\mathrm dt} Z_t = v(Z_t, t)$
        - 当然，$Z_0 \sim \pi_0, \forall t \in [0, 1]$

### 走直线

我们的最终目标，本质上就是一个：训练一个类似于 neural ODE 的东西，一步步将 $Z_0$ 变换成 $Z_1$。

也就是说，我们只需要让 $Z_1 \sim \pi_1$ 即可，**至于中间的 $Z_t$ 怎么样，我们并不那么在乎**

因此，我们在训练的过程中，就可以对中间的 $Z_t$ 也动手脚——让它也走直线。

- 也就是说，我们让 $Z_0 \to Z_1$ 的轨迹，尽量笔直
    - 也就是让 $v$ 尽量笔直
- 从而，我们可以采用更少次数的 ODE 求解器，就能用这个笔直的 $v$，拟合 $T$

---

直觉上，一个走直线的 $T$，就是要拟合一个 $v(x, t)$，使得：

- $\forall i, t: Z_t^{(i)} \approx (1-t) Z_0^{(i)} + t Z_1^{(i)} \implies v(Z_t^{(i)}, t) \approx Z_1^{(i)} - Z_0^{(i)}$
- 也就是：$(Z_1 - Z_0) - v(Z_t, t) \approx 0$

也就是最小化下面的式子：

$$
\begin{aligned}
& \min _v \int_0^1 \mathbb{E}_{X_0 \sim \pi_0, X_1 \sim \pi_1}\left[\left\|\left(X_1-X_0\right)-v\left(X_t, t\right)\right\|^2\right] d t, \quad \text { where } \quad X_t=t X_1 + (1-t) X_0 .
\end{aligned}
$$

#### 如何解决 causality？

##### 问题

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/07/27_23_28_21_image-20250727232819942.png" alt="image-20250727232819942" style="zoom: 33%;" />

如上图所示：

- 不难看出，$t = 0, 1, \frac 1 2$ 的时候，这四个积分式会出现重叠的情况（如下图 a）
- 在实际的神经网络训练中（i.e. $\pi_0, \pi_1$ 不是多点分布，而是多个正态分布的叠加），如果出现重叠的情况，会怎么样？答案是：就是大致 1/2, 1/2 的分流，从而形成下图 (b)
    - 这样一来，就有 1/2 的绿色和蓝色路径，并没有走直线，而是走曲线了

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/07/27_23_31_23_image-20250727233121334.png" alt="image-20250727233121334"  />

##### Reflow

$$
\begin{aligned}
& \min _v \int_0^1 \mathbb{E}_{X_0 \sim \pi_0, X_1=\operatorname{Flow}_1\left(X_0\right)}\left[\left\|\left(X_1-X_0\right)-v\left(X_t, t\right)\right\|^2\right] d t, \quad \text { with } X_t=t X_1 + (1-t) X_0 .
\end{aligned}
$$

我们将最初式子中的 $X_1 \sim \pi_1$，替换成了 $X_1 = \operatorname{Flow}_1(X_0)$。

这样的好处在于：

1. 如果 $\operatorname{Flow}_1(X_0) \sim \pi_1$ ，那么新求出来的 $v'$ 所诱导的映射 $\operatorname{Flow}_2(X_0) \sim \pi_2$（假设 $v$ 拟合能力足够强）
2. 传输代价 $\operatorname{Flow}_2$ 是不大于 $\operatorname{Flow}_1$ 的，同理，flow3 也不大于 flow2，flow4 也不大于 flow3，……。也就是说，传输代价单调下降，而且最终可以收敛到完全直的状态
    - TODO: 需要参考原论文，才能得知单调性具体严不严格、在什么情况下才能收敛，等等

坏处：由于 $v$ 的拟合能力不一定那么强，因此每一次 $v$ 优化的不完美，从而会产生一定误差。**如果 reflow 次数太多了，那么误差就会积累**

## Reflow vs Distillation

**Reflow:**
$$
\begin{aligned}
& \min _v \int_0^1 \mathbb{E}_{X_0 \sim \pi_0, X_1=\operatorname{Flow}_1\left(X_0\right)}\left[\left\|\left(X_1-X_0\right)-v\left(X_t, t\right)\right\|^2\right] d t, \quad \text { with } X_t=t X_1 + (1-t) X_0 .
\end{aligned}
$$
**Distillation:**
$$
\min_v \mathbb E_{X_0\sim\pi_0, X_1 = f_{\text{model to be distilled}}(X_0)}\left[\|X_1 - X_0 - v(X_0, 0)\|^2\right]
$$
两者的差别在于：

1. Distillation 会一五一十的尝试复现 $(X_0, X_1)$ 的配对关系。但是，如果这个配对关系是随机的，那么就导致最后生成的 $X_1$ 的边缘概率并不接近 $\pi_1$（具体分析详见 https://zhuanlan.zhihu.com/p/603740431）
2. 即便有一一配对的关系，这个配对关系也可能非常复杂，导致直接蒸馏比较困难

形象的来说：

1. Reflow 比较灵活变通。可以改善配对
2. Distillation 比较死板，不会改善配对。但是从公式中可以看出，更适合于一步生成

简单来说，reflow 改善的是配对（走直线），而 distillation 改善的是单步生成。

---

下图是一个 toy problem 上的真实实验，展示的就是 reflow 的实际作用：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/07/28_1_4_38_v2-e5a328cb8504c546478f8a59121a135c_1440w.jpg" alt="img" style="zoom: 50%;" />

## 理论保证

1. **边际分布不变**: 当 $v$ 取得最优值时，对任意时间 $t$，我们有 $Z_t$ 和 $X_t$ 的分布相等。因为 $X_0 \sim \pi_0, X_1 \sim \pi_1$，因此 $Z$ 确实可以将 $\pi_0$ 转移到 $\pi_1$。
2. **降低传输损失**: 每次Reflow都可以降低两个分布之间的传输代价。特别的，Reflow并不优化一个特定的损失函数，而是同时优化所有的凸损失函数。
3. **拉直ODE轨迹**: 通过不停重复Reflow，ODE轨迹的直线性(Straightness)以 $O(1/k)$ 的速率下降，这里，$k$ 是reflow的次数。

