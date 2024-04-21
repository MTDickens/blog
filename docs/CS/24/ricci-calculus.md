# 里奇微积分(Ricci Calculus)：一种计算向量求导，矩阵求导，张量求导的简单方法

 **Author:** [Introspector]

 **Link:** [https://zhuanlan.zhihu.com/p/63176747]

 **Converted from zhihu page to markdown by**: [Zhihu Download on Repl.it](https://replit.com/@MaxDickens/zhihu-download)

在计算反向传播或最优化问题时，经常遇到向量、矩阵、张量对向量、矩阵、张量的求导问题，而类比普通函数求导经常无法处理矩阵转置的问题，因此需要使用一套更简单的符号系统进行运算，即[https://en.wikipedia.org/wiki/Ricci\_calculus](https://en.wikipedia.org/wiki/Ricci\_calculus)。

## 爱因斯坦求和约定  
相乘时符号相同且共轭的指标，如一个[https://en.wikipedia.org/wiki/Covariance\_and\_contravariance\_of\_vectors](https://en.wikipedia.org/wiki/Covariance\_and\_contravariance\_of\_vectors)(下标）遇到一个符号相同的[https://en.wikipedia.org/wiki/Covariance\_and\_contravariance\_of\_vectors](https://en.wikipedia.org/wiki/Covariance\_and\_contravariance\_of\_vectors)（上标），会发生缩并运算成为哑指标，整个表达式自由指标的个数表示最终结果的自由指标个数；当自由指标只有一个 $i$ （如 $x^i,A_i^jx^i=y^j$ ）时，表达式是一个向量（一维张量），有两个 $i,j$ （如 $A_i^j,A^{ij},A_i^jx^j$ ）时，表达式是一个二维张量，以此类推。

## 符号约定  
$R^n$ 表示n维列向量空间， $R^{n*}$ 表示n维行向量空间，$A_{ij}$ 表示[https://en.wikipedia.org/wiki/Bilinear\_map](https://en.wikipedia.org/wiki/Bilinear\_map) $R^n\times R^n\rightarrow R$ ， $A^{ij}$ 表示双线性映射 $R^{n*}\times R^{n*}\rightarrow R$，$x^i$ 表示列向量 $x$， $x_i$ 表示行向量$x^T$（也叫[https://en.wikipedia.org/wiki/Linear\_form](https://en.wikipedia.org/wiki/Linear\_form)或余向量）。

$\delta_i^j$ 是一个单位矩阵， $\delta_{ij}$ 是度量张量（一个双线性映射）， $\delta^{ij}$ 是共轭度量张量，它们有这些性质：$x^j(=x)$ 表示原向量则$\delta_{ij}x^j=x_i(=x^{\top})$ 表示转置向量， $\delta^i_jx^i=\operatorname{diag}(x)$ ， $A_j^i(=A)$ 表示原矩阵则$\delta_{ii}\delta^{jj}A_j^i(=A^\top)$ 表示转置矩阵， $\delta_{ii}\delta^{ii}=1$ ， $\delta_{ij}\delta^{ii}=\delta_j^i$ ，$\frac{dx_i}{dx^j}=\delta_i^j$ ， $\frac{dx^i}{dx^j}=\delta^{ij}$ ， $\frac{dx_i}{dx_j}=\delta_{ij}$ ， $\frac{d X_i^j}{d X_k^l} = \delta^{jl}\delta_{ik}$ 

## 矩阵表示与Ricci Calculus表示法的对比  
$c = x ^ { \top } y \quad c = x _ { i } y ^ { i }$ 

$x = A y \quad x ^ { i } = A _ { j } ^ { i } y ^ { j }$ 

$x ^ { \top } = y ^ { \top } A \quad x _ { j } = y _ { i } A _ { j } ^ { i }$ 

$C = A \cdot B \quad C _ { k } ^ { i } = A _ { j } ^ { i } B _ { k } ^ { j }$ 

$A = x y ^ { \top } \quad A _ { j } ^ { i } = x ^ { i } y _ { j }$ 

$z = x \odot y \quad z ^ { i } = x ^ { i } y ^ { i }$ 

$A=x\otimes y \quad  A^{ij}=x^i y^j$ 

$C=A\otimes B\quad C^{ij}_{kl}=A_k^i B_l^j$ 

$B=A\otimes x\quad B_{ij}^k=A_{ij}x^k$ 

$B = A \operatorname { diag } ( x ) \quad B _ { j } ^ { i } = A _ { j } ^ { i } x _ { j }$ 

$B = \operatorname { diag } ( x ) A \quad B _ { j } ^ { i } = x ^ { i } A _ { j } ^ { i }$ 

## 示例  
根据上述原理计算 $x^TAx$ 对 $x$ 的导数：

$\frac{d (x^{\top}Ax)}{dx}$

$=\frac{d (x_i A_j^i x^j)}{d x^k}$ 

$=\frac{d x_i}{d x^k}A_j^i x^j+x_i A_j^i \frac{d x^j}{d x^k}$ 

$=\delta_i^k A_j^i x^j+ x_i A_j^i \delta^{jk}$ 

$=A_j^k x^j+x_i A_j^i \delta^{jk} \delta_{kk} \delta^{kk}$ 

$=A_j^k x^j+x_i A_j^i \delta^{j}_k \delta^{kk}$ 

$=A_j^k x^j+x_i A_k^i  \delta^{kk}$ 

$=A_j^k x^j+\delta_{ii}x^i A_k^i  \delta^{kk}$ 

$=Ax+A^{\top}x$ 

计算 $y\odot (Xw)$ 对 $X$ 的导数：

$\frac{\partial (y\odot (Xw))}{\partial X}$ 

$=\frac{\partial (y^i X_j^iw^j)}{\partial X_k^l}$ 

$=y^i\delta^{il}\delta_{jk}w^j$ 

$=y^i\delta^{il}w_k$ 

$=\operatorname{diag}(y)\otimes w^\top$ 

需要注意的是， $\delta_{ii}$ 和 $\delta^{ii}$ 并不像常规的Kronecker符号一样等于n（n是下标对应的维数），而是满足$\delta_{ii}\delta^{ii}=1$ ，它有特殊的用途。在本文中，它主要用于表示矩阵转置。在爱因斯坦约定中，表示矩阵转置是一个容易引起记号混乱的事，如果使用 $A_i^j$ 表示原矩阵（方阵）， $A_j^i$ 表示转置矩阵，那么原本 $A_i^j x^i=y^j$ ，转置后却因为指标无法缩并而无法相乘得到列向量了： $A_j^i ? x^i$ ；此外，不区分上下标的爱因斯坦约定对于这是匪夷所思的。但是根据上面的定义，可以使用 $A_j^i \delta_{ii}\delta^{jj}x^i$ 表示 $A^\top x$ ，而不会产生歧义。事实上，在爱因斯坦约定中，指标只能用于表示张量的各个维，如果张量是对称的，那么不管怎么排列指标，表达式看起来都是一样的，因此本文的参考文献[4]使用了上述 $\delta_{ii}$ 和 $\delta^{ii}$ 符号规避了此问题。

如果你没有看懂本文，没有关系，使用参考文献[4]对应的网站[http://matrixcalculus.org/](http://matrixcalculus.org/)即可在线计算矩阵、张量求导（介绍视频如下）。

[https://www.zhihu.com/video/1174568998875316224](https://www.zhihu.com/video/1174568998875316224)你也可以通过numpy的[https://docs.scipy.org/doc/numpy/reference/generated/numpy.einsum.html](https://docs.scipy.org/doc/numpy/reference/generated/numpy.einsum.html)来帮助你计算爱因斯坦约定，更多有关爱因斯坦约定的内容请参考[10]。

在tensorflow和numpy中使用[https://en.wikipedia.org/wiki/Einstein\_notation](https://en.wikipedia.org/wiki/Einstein\_notation)可以极大的简化代码，使用以下代码实现矩阵乘法：

$R=A B\quad R_i^k=A_i^j B_j^k$ 


```python
import tensorflow as tf
import numpy as np
R = tf.einsum('ij,jk->ik',A,B)
R = np.einsum('ij,jk->ik',A,B)
```
**参考文献**

[1] [https://en.wikipedia.org/wiki/Matrix\_calculus](https://en.wikipedia.org/wiki/Matrix\_calculus) 

[2] [https://en.wikipedia.org/wiki/Tensor\_index\_notation](https://en.wikipedia.org/wiki/Tensor\_index\_notation)

[3] [https://en.wikipedia.org/wiki/Kronecker\_delta](https://en.wikipedia.org/wiki/Kronecker\_delta)

[4] S. Laue, M. Mitterreiter, and J. Giesen. Computing Higher Order Derivatives of Matrix and Tensor Expressions, NIPS 2018.

[5] [https://en.wikipedia.org/wiki/Einstein\_notation](https://en.wikipedia.org/wiki/Einstein\_notation)

[6] [https://en.wikipedia.org/wiki/Bilinear\_map](https://en.wikipedia.org/wiki/Bilinear\_map)

[7] [https://en.wikipedia.org/wiki/Linear\_form](https://en.wikipedia.org/wiki/Linear\_form)

[8] [https://en.wikipedia.org/wiki/Covariance\_and\_contravariance\_of\_vectors](https://en.wikipedia.org/wiki/Covariance\_and\_contravariance\_of\_vectors)

[9] [https://en.wikipedia.org/wiki/Abstract\_index\_notation](https://en.wikipedia.org/wiki/Abstract\_index\_notation)

[10] [https://zhangwfjh.wordpress.com/2014/07/19/einstein-notation-and-generalized-kronecker-symbol/](https://zhangwfjh.wordpress.com/2014/07/19/einstein-notation-and-generalized-kronecker-symbol/) 