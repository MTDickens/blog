$$
\newcommand\R[]{\mathbb R}
$$

# Outline

- Strongly Convex Functions
	- Definition of The Strongly Convex and The Class $S_\mu^1 (\R^n)$
	- Property of Strongly Convex Function
	- Equivalent Definitions
	- Examples
- Smooth and Strongly Convex Functions
	- The Class $S_{\mu, L}^{1, 1} (\R^n)$
	- Property of Smooth and Strongly Convex Function
- Conclusion

# Strongly Convex Functions

## 	Definition of The Strongly Convex and The Class $S_\mu^1 (\R^n)$

如果 $f(x)$ 连续可微，且 $\exists \mu > 0, \forall x, y \in \R^n$:

$$
f(y) \geq f(x) + \langle \nabla f(x), y-x \rangle + \frac 1 2 \mu \|y-x\|^2
$$

那么，就称 $f(x)$ **strongly convex, where $\mu$ is the convexity parameter of $f$**.

### 性质

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/17_22_19_42_20241017221941.png"/>

**Note**: 也就是在最优解附近，函数的变化率是足够大的。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/17_22_20_0_20241017221959.png"/>

**Note**: 也就是，强凸系数是线性叠加的。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/17_22_32_26_20241017223225.png"/>

> [!info]+ Proof (Cont.)
> 
> 从而，$\nabla \phi(x) = \nabla f(y) |_{y=x} - \nabla f(x) = 0$。因此，由 Theorem 30:
> 
> $$
> \begin{aligned}
> \phi(x) &= \min_\nu \phi(\nu) \geq \min_\nu \phi(y) + \langle \nabla f(y) , \nu - y \rangle + \frac 1 2 \mu \| \nu - y \|^2 \newline
> &= \phi(y) - \frac 1 {2\mu} \| \nabla \phi(y) \|^2
> \end{aligned}
> $$
> 展开，得到：
> 
> $$
> f(x) + \langle \nabla f(x), y - x \rangle + \frac 1 {2\mu} \| \nabla f(x) - \nabla f(y) \|^2 \geq f(y)
> $$
> 
> 进一步，互换 $x, y$：
> 
> $$
> f(y) + \langle \nabla f(y), x - y \rangle + \frac 1 {2\mu} \| \nabla f(y) - \nabla f(x) \|^2 \geq f(x)
> $$
> 
> 然后两边相加：
> 
> $$
> \frac 1 {\mu} \| \nabla f(x) - \nabla f(y) \|^2 \geq \langle \nabla f(x) - \nabla f(y), x - y \rangle
> $$
> $\blacksquare$

**Note**: (25) 就是**割线不等式**

### Equivalent Definitions

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/18_2_50_1_20241018025001.png"/>

上面两个都是等价定义（证明略）。

### $S_\mu^2 (\R^n) \subseteq S_\mu^1 (\R^n)$

如果 strongly convex function 同时还可以求二阶导（Hessian matrix），那么我们就有更加简单的判定方式：

$$
\nabla^2 f(x) \succ \mu I_n
$$
