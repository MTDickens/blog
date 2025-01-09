$$
\newcommand\R[]{\mathbb R}
$$

## Outline

- Strongly Convex Functions
	- Definition of The Strongly Convex and The Class $S_\mu^1 (\R^n)$
	- Property of Strongly Convex Function
	- Equivalent Definitions
	- Examples
- Smooth and Strongly Convex Functions
	- The Class $S_{\mu, L}^{1, 1} (\R^n)$
	- Property of Smooth and Strongly Convex Function
- Conclusion

## Strongly Convex Functions

### 	Definition of The Strongly Convex and The Class $S_\mu^1 (\R^n)$

如果 $f(x)$ 连续可微，且 $\exists \mu > 0, \forall x, y \in \R^n$:

$$
f(y) \geq f(x) + \langle \nabla f(x), y-x \rangle + \frac 1 2 \mu \|y-x\|^2
$$

那么，就称 $f(x)$ **strongly convex, where $\mu$ is the convexity parameter of $f$**.

> [!info]+ Comparison
> 
> 
> - $S^1_\mu: f(y) \geq f(x) + \langle \nabla f(x), y-x \rangle + \frac 1 2 \mu \|y-x\|^2$
> - $C_\mu^{1,1}: f(x) + \langle \nabla f(x), y-x \rangle + \frac 1 2 \mu \|y-x\|^2 \geq f(y) \geq f(x) + \langle \nabla f(x), y-x \rangle - \frac 1 2 \mu \|y-x\|^2$

#### 性质

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

#### Equivalent Definitions

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/18_2_50_1_20241018025001.png"/>

上面两个都是等价定义（证明略）。

#### $S_\mu^2 (\R^n) \subseteq S_\mu^1 (\R^n)$

如果 strongly convex function 同时还可以求二阶导（Hessian matrix），那么我们就有更加简单的判定方式：

$$
\nabla^2 f(x) \succ \mu I_n
$$

**证明略**

## Smooth and Strongly Convex Functions

### Definition

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_7_34_32_20241117073431.png"/>

- 注意条件数的定义
### Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_7_29_18_20241117072917.png"/>

### 性质

> [!info]- Some Useful Lemmas
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_9_46_56_JPEG%E5%9B%BE%E5%83%8F-4F61-ADA7-84-0.jpeg"/>

**Theorem 36 (Theorem 2.1.12)**

If $f \in \mathcal{S}_{\mu, L}^{1,1}\left(\mathbb{R}^n\right)$, then for any $\boldsymbol{x}, \boldsymbol{y} \in \mathbb{R}^n$ we have
$$
\begin{aligned}
\langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle & \geq \frac{\mu L}{\mu+L}\|\boldsymbol{x}-\boldsymbol{y}\|^2 \newline
& +\frac{1}{\mu+L}\|\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y})\|^2
\end{aligned}
$$

Proof.

Denote $\phi(\boldsymbol{x})=f(\boldsymbol{x})-\frac{1}{2} \mu\|\boldsymbol{x}\|^2$. Then $\nabla \phi(\boldsymbol{x})=\nabla f(\boldsymbol{x})-\mu \boldsymbol{x}$.

We check $\phi \in \mathcal{F}_{L-\mu}^{1,1}\left(\mathbb{R}^n\right)$ as follows.

$$
\begin{aligned}
& \phi(\boldsymbol{x})-\phi(\boldsymbol{z})-\langle\nabla \phi(\boldsymbol{z}), \boldsymbol{x}-\boldsymbol{z}\rangle \newline
& =f(\boldsymbol{x})-\frac{1}{2} \mu\|\boldsymbol{x}\|^2-\left(f(\boldsymbol{z})-\frac{1}{2} \mu\|\boldsymbol{z}\|^2\right)-\langle\nabla f(\boldsymbol{z})-\mu \boldsymbol{z}, \boldsymbol{x}-\boldsymbol{z}\rangle \newline
& =\underbrace{f(\boldsymbol{x})-f(\boldsymbol{z})-\langle\nabla f(\boldsymbol{z}), \boldsymbol{x}-\boldsymbol{z}\rangle}_{\leq \frac{L}{2}\|\boldsymbol{x}-\boldsymbol{z}\|^2}-\frac{\mu}{2} \underbrace{\left\{\|\boldsymbol{x}\|^2-\|\boldsymbol{z}\|^2+2\langle\boldsymbol{z}, \boldsymbol{z}-\boldsymbol{x}\rangle\right\}}_{=\|\boldsymbol{x}-\boldsymbol{z}\|^2} \newline
& \leq \frac{L}{2}\|\boldsymbol{x}-\boldsymbol{z}\|^2-\frac{\mu}{2}\|\boldsymbol{x}-\boldsymbol{z}\|^2=\frac{L-\mu}{2}\|\boldsymbol{x}-\boldsymbol{z}\|^2 .
\end{aligned}
$$

**Case 1**: If $\mu=L$,

$$
\begin{aligned}
& \langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle \geq \frac{1}{L}\|\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y})\|^2 \newline
& \langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle \geq \mu\|\boldsymbol{x}-\boldsymbol{y}\|^2,
\end{aligned}
$$

Add up the upper two inequalities, the theorem can be proved.

**Case 2**: If $\mu<L$,
$$
\begin{aligned}
\langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle & \geq \frac{1}{L}\|\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y})\|^2 \newline
\phi(\boldsymbol{x}) & =f(\boldsymbol{x})-\frac{1}{2} \mu\|\boldsymbol{x}\|^2
\end{aligned}
$$

从而可以推出：
$$
\langle\nabla \phi(\boldsymbol{x})-\nabla \phi(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle \geq \frac{1}{L-\mu}\|\nabla \phi(\boldsymbol{x})-\nabla \phi(\boldsymbol{y})\|^2
$$.

Consider the LHS of the last inequality. We have

$$
\langle\nabla \phi(\boldsymbol{x})-\nabla \phi(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle=\langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle-\mu\|\boldsymbol{x}-\boldsymbol{y}\|^2 .
$$

Consider the RHS of the last inequality. We have

$$
\begin{aligned}
&\frac{1}{L-\mu}\|\nabla \phi(\boldsymbol{x})-\nabla \phi(\boldsymbol{y})\|^2 = \newline
&\frac{1}{L-\mu}\left\{\|\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y})\|^2+\mu^2\|\boldsymbol{x}-\boldsymbol{y}\|^2-2 \mu\langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle\right\}
\end{aligned}
$$

After some rearrangements, we have

$$
\frac{L+\mu}{L-\mu}\langle\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y}), \boldsymbol{x}-\boldsymbol{y}\rangle \geq \frac{\mu L}{L-\mu}\|\boldsymbol{x}-\boldsymbol{y}\|^2+\frac{1}{L-\mu}\|\nabla f(\boldsymbol{x})-\nabla f(\boldsymbol{y})\|^2
$$


### Conclusion

不同的 continuity，对于 0、1、2 阶的情况分别是什么？

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_7_32_21_20241117073220.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_7_31_55_20241117073154.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_7_33_6_20241117073306.png"/>

## Hierarchy of Functions

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_8_26_59_20241117082658.png"/>

其中，PŁ 虽然比不上强凸，但是也是很好的性质。下面我们证明强凸 $\implies$ PŁ，以及举反例说明 PŁ $\centernot\implies$ 强凸。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/17_9_48_46_JPEG%E5%9B%BE%E5%83%8F-4A3B-8EEE-81-0.jpeg"/>

> [!info] $z = f(x,y) = 2x^2$
> 
> 不难看出，由于沿着 y 轴，完全是平坦的，因此绝对非强凸（甚至非凸）；但是
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/24_2_16_50_20241124021650.png"/>

