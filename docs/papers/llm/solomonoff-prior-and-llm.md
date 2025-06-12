# Solomonoff 先验以及 LLM——智能即压缩

## 定义

给定一个通用图灵机 $U$，这个通用图灵机可以读取一个串 $x$，然后输出一个串 $U(x)$。

- 我们在这里假设 $x \in \{0, 1\}^\ast$，也就是说 $x$ 是一个二进制串。毕竟所有字符串，本质上都是二进制串罢了。

### 语言模型生成函数

定义如下：

令 $\mathcal{X}$ 为 input prompt 的集合，$\mathcal{S}$ 为随机种子的集合，$\mathcal{R}$ 为可能的模型输出的集合。

$$
g : \mathcal{X} \times \mathcal{S} \to \mathcal{X}^* \quad (1)
$$

使得对于任意 $x \in \mathcal{X}$ 和 $s \in \mathcal{S}$，有 $g(x,s) = x^* = x \circ r$。其中，

- $r \in \mathcal{R}$ 是给定 $x$ 和 $s$ 后模型生成的输出
- $\circ$ 表示字符串连接。

### Solomonoff 复杂度

定义如下：

$$
M(x) := \sum_{p: U(p) \in x^\ast} 2^{-l(p)} \quad (3)
$$

其中，

- $p$ 是一个二进制串
	- $l(p)$ 是 $p$ 这个串的**长度**
	- $U(p)$ 是将 $p$ 喂给通用图灵机 $U$ 之后，输出的串
- $x^\ast$ 是**所有以 $x$ 为前缀的串的集合，即 $x^\ast = \{xz: z \in \{0, 1\}^\ast \}$**

讲人话，就相当于：

1. 首先，我们定义一个概率空间 $\mathcal P$。在这个概率空间里面，长度为 $n$ 的二进制串，其（未归一化）的先验概率是 $2^{-n}$
	- 毕竟吧，$\sum_{p} 2^{-l(p)} = \sum_{i = 0} \text{number of string with length } i * 2^{-i} = \sum_{i = 0} 2^i * 2^{-i} = \sum_{i= = 0} 1 = \infty \neq 1$
2. 然后，$M(x) := \sum_{p: U(p) \in x^\ast} 2^{-l(p)} = \sum_{p} 2^{-l(p)} [[U(p) \in x^\ast]] = \mathbb P_{p \in \mathcal P}[U(p) \in x^\ast]$。
	- 也就是说，$M(x)$ 就是从 $\mathcal P$ 随机抽取一个字符串 $p$，$U(p)$ 的前缀是 $x$ 的概率。当然，这里的概率也是未归一化的概率。

### Solomonoff 归纳

定义如下：

$$
M(x_{t+1}|x_{1:t}) = \frac {M(x_{1:t+1})} {M(x_{1:t})} \quad (4)
$$

- 其实，由于 $M(x) = \mathbb P_{p \in \mathcal P}[U(p) \in x^\ast]$（i.e. $M(x)$ 是概率），因此上面这个式子其实就是贝叶斯定理罢了。

## LLM Training Approximates Solomonoff Prior

定义如下：

令 $\bar{f}(x, s)$ 为根据定义构建的程序，并定义近似索洛莫诺夫先验如下：

$$
\bar{M}(x) := \sum_{s=1}^{\infty} 2^{-\ell(\bar{f}(x,s))}
$$

其中，

- $\ell(\bar{f}(x, s))$ 表示描述 $\bar{f}(x, s)$ 的程序的**长度**。

则：

1.  **上界：** $\bar{M}(x) \leq M(x)$，其中 $M(x)$ 是索洛莫诺夫先验。
2.  **近似：** 随着 $f$ 的损失减小，$\bar{M}(x)$ 逐渐逼近 $M(x)$。