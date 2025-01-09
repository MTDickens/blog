# How to Choose Step Size

(1) The sequence $\left\{\left\{h_k\right\}_{k=1}^{\infty}\right.$ is chosen in advance. For example,

$$
h_k=h>0,(\text { constant step }) \text { or } h_k=\frac{h}{\sqrt{k+1}} .
$$

(2) Full relaxation:

$$
h_k=\underset{h \geq 0}{\operatorname{argmin}} f\left(\boldsymbol{x}_k-h \nabla f\left(\boldsymbol{x}_k\right)\right) .
$$

(3) Goldstein-Armijo Find $\boldsymbol{x}_{k+1}=\boldsymbol{x}_k-h \nabla f\left(\boldsymbol{x}_k\right)$ such that

$$
\begin{aligned}
& \alpha\left\langle\nabla f\left(\boldsymbol{x}_k\right), \boldsymbol{x}_k-\boldsymbol{x}_{k+1}\right\rangle \leq f\left(\boldsymbol{x}_k\right)-f\left(\boldsymbol{x}_{k+1}\right), \\
& \beta\left\langle\nabla f\left(\boldsymbol{x}_k\right), \boldsymbol{x}_k-\boldsymbol{x}_{k+1}\right\rangle \geq f\left(\boldsymbol{x}_k\right)-f\left(\boldsymbol{x}_{k+1}\right),
\end{aligned}
$$

where, $0<\alpha<\beta<1$ are some fixed parameters.

> [!example]+ Geometric Interpretation of Goldstein-Armijo
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_9_59_29_20241117095928.png"/>
> 
> 如图：我们要找到这样的 $x_{k+1}$，使得它落在红线和蓝线之间（也就是橙色区域）
# Performance for $C_L^{1,1}(\mathbb R^n)， F_L^{1,1}(\mathbb R^n), S_{\mu,L}^{1,1}(\mathbb R^n)$

> [!info]- Proof for $C_L^{1,1}(\mathbb R^n)$
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/18_1_53_23_JPEG图像-4023-90EB-AA-0.jpeg"/>

> [!info]- Proof for $F_L^{1,1}(\mathbb R^n)$
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/18_1_53_23_JPEG图像-41E3-95D9-B2-0.jpeg"/>

> [!info]- Proof for $S_{\mu, L}^{1,1}(\mathbb R^n)$
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/24_2_47_3_JPEG%E5%9B%BE%E5%83%8F-4A20-AD14-D6-0.jpeg"/>

**总结**：

- 如果只是 Lipchitz continuous，那么基本上没有什么有用的性质
	- 最多只能 bound 住 gradient，并不能保证收敛到最小值点
- 如果是 Lipchitz continuous + convex，那么只能保证很慢的收敛
- 如果是 Lipchitz continuous + $\mu$-strongly convex，那么就能保证线性收敛（i.e. 一阶收敛）
	- 实际上，如果是 Lipchitz continuous + $\mu$-PL，那么也可以保证线性收敛。证明和结论详见 [Wikipedia](https://en.wikipedia.org/wiki/%C5%81ojasiewicz_inequality#Gradient_descent)

