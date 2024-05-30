# Motivation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_22_28_37_202405212228821.png" style="zoom: 80%;" />

Morse 函数是微分拓扑的概念：涉及了微分几何以及同调的概念。

# Some Concepts

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_22_36_37_202405212236190.png" alt="img"  />

切空间就是曲面经过一个点处所有曲线的切线张成的空间。

---

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_10_8_37_202405221008263.png" style="zoom: 67%;" />

如上图，一个流形有一个图册，对流形上的函数 $f: M \to \mathbb R$ 在 $x \in M$ 点处求所谓的梯度，实际上是：

- 给定图册中的一个包含 $x$ 的坐标卡，$\varphi: U (\subset M) \to \mathbb R^n, \text{ s.t. }x \in U$，我们求 $f \circ \varphi^{-1}: \mathbb R^n \to \mathbb R$ 在 $\varphi(x)$ 的梯度。
    - 假如 $f \circ \varphi^{-1}$ 在 $\varphi(x)$ 处梯度为 0，那么对于其它任意的坐标卡 $\xi: U \to \mathbb R^n$，一样梯度为 0：
        $$
        \begin{aligned}
        \left[\grad (f\circ \varphi^{-1})\circ(\varphi \circ \xi^{-1})\right] (\xi(x)) &= \left[\grad (f\circ \varphi^{-1})\right]((\varphi \circ \xi^{-1}) (\xi(x))) \times \left[\grad (\varphi \circ \xi^{-1})\right] (\xi(x)) \newline
        &= \left[\grad (f\circ \varphi^{-1})\right](\varphi(x)) \times \left[\grad (\varphi \circ \xi^{-1})\right] (\xi(x)) \newline
        &= \mathrm O \times \left[\grad (\varphi \circ \xi^{-1})\right] (\xi(x)) = \mathrm O
        \end{aligned}
        $$
    - 因此，$f$ 的临界点是良定义的。

---

当然，还有一种方法，就是将我们研究的流形限制为 Riemann 流形。

- Riemann 流形具体定义我也不是非常清楚，但是直观想一想，我们平时用到的“性质良好”的流形，其“梯度”是显然的。
    - 比如说一个流形上的函数，其函数值就是流形上的点的 height。那么，任意一个点的梯度，显然是“往上走”的。其临界点，就是最高的点。

---

称一个光滑函数是 Morse 函数，如果其所有临界点满足以下条件：

1. 非退化
2. 函数值不同

## Morse Lemma

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_10_13_45_202405221013809.png" style="zoom: 67%;" />

本质上来说，就是：

如果 $\nabla f(\mathrm x) = 0, \det H_f(\mathrm x) \neq 0$，那么，我们可以变换一下坐标系，使得上面的图片成立。成立的原因如下：

 <p>在<a href="/wiki/%E4%BB%A3%E6%95%B0%E5%AD%A6" class="mw-redirect" title="代数学">代数学</a>中，<b>西尔维斯特惯性定理</b>（<span lang="en">Sylvester's law of inertia</span>）是指在<a href="/wiki/%E5%AE%9E%E6%95%B0%E5%9F%9F" class="mw-redirect" title="实数域">实数域</a>中，一个形如<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle a_{11}x_{1}^{2}+a_{12}x_{1}x_{2}+a_{13}x_{1}x_{3}+...+a_{nn}x_{n}^{2}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>a</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>11</mn>
          </mrow>
        </msub>
        <msubsup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>1</mn>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
        <mo>+</mo>
        <msub>
          <mi>a</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>12</mn>
          </mrow>
        </msub>
        <msub>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>1</mn>
          </mrow>
        </msub>
        <msub>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msub>
        <mo>+</mo>
        <msub>
          <mi>a</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>13</mn>
          </mrow>
        </msub>
        <msub>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>1</mn>
          </mrow>
        </msub>
        <msub>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>3</mn>
          </mrow>
        </msub>
        <mo>+</mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>+</mo>
        <msub>
          <mi>a</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mi>n</mi>
            <mi>n</mi>
          </mrow>
        </msub>
        <msubsup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mi>n</mi>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle a_{11}x_{1}^{2}+a_{12}x_{1}x_{2}+a_{13}x_{1}x_{3}+...+a_{nn}x_{n}^{2}}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/874b316b81951969793ab2f46d79ef285d0f0f0f" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -1.005ex; width:39.619ex; height:3.176ex;" alt="{\displaystyle a_{11}x_{1}^{2}+a_{12}x_{1}x_{2}+a_{13}x_{1}x_{3}+...+a_{nn}x_{n}^{2}}"></span>的<a href="/wiki/%E4%BA%8C%E6%AC%A1%E5%9E%8B" title="二次型">二次型</a>通过<a href="/wiki/%E7%BA%BF%E6%80%A7%E5%8F%98%E6%8D%A2" class="mw-redirect" title="线性变换">线性变换</a>可以化简成惟一的标准型<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle y_{1}^{2}+y_{2}^{2}+...+y_{p}^{2}-y_{p+1}^{2}-....-y_{r}^{2}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msubsup>
          <mi>y</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>1</mn>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
        <mo>+</mo>
        <msubsup>
          <mi>y</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
        <mo>+</mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>+</mo>
        <msubsup>
          <mi>y</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mi>p</mi>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
        <mo>−<!-- − --></mo>
        <msubsup>
          <mi>y</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mi>p</mi>
            <mo>+</mo>
            <mn>1</mn>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
        <mo>−<!-- − --></mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>.</mo>
        <mo>−<!-- − --></mo>
        <msubsup>
          <mi>y</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mi>r</mi>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <mn>2</mn>
          </mrow>
        </msubsup>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle y_{1}^{2}+y_{2}^{2}+...+y_{p}^{2}-y_{p+1}^{2}-....-y_{r}^{2}}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/278e4e434124054347184f2f96f1a91af737b45c" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -1.338ex; width:33.309ex; height:3.509ex;" alt="{\displaystyle y_{1}^{2}+y_{2}^{2}+...+y_{p}^{2}-y_{p+1}^{2}-....-y_{r}^{2}}"></span>。其中的正项数（称为正惯性系数）、负项数（称为负惯性系数）以及 0 的数目惟一确定，其中的<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle r}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>r</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle r}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/0d1ecb613aa2984f0576f70f86650b7c2a132538" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.049ex; height:1.676ex;" alt="{\displaystyle r}"></span>为系数<a href="/wiki/%E7%9F%A9%E9%98%B5" title="矩阵">矩阵</a>的<a href="/wiki/%E7%A7%A9" class="mw-disambig" title="秩">秩</a>。正惯性系数<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle p}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>p</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle p}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/81eac1e205430d1f40810df36a0edffdc367af36" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.671ex; margin-left: -0.089ex; width:1.259ex; height:2.009ex;" alt="{\displaystyle p}"></span>－负惯性系数<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle (r-p)}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mo stretchy="false">(</mo>
        <mi>r</mi>
        <mo>−<!-- − --></mo>
        <mi>p</mi>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle (r-p)}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/147bf5ac299b662ce0a8950cafcb20cb331c88f2" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:6.868ex; height:2.843ex;" alt="{\displaystyle (r-p)}"></span>的值<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle (2p-r)}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mo stretchy="false">(</mo>
        <mn>2</mn>
        <mi>p</mi>
        <mo>−<!-- − --></mo>
        <mi>r</mi>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle (2p-r)}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/e3f3991bf25064ad53405e00c6e2694ff8d6a83d" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:8.03ex; height:2.843ex;" alt="{\displaystyle (2p-r)}"></span>称作符号差。
</p>

## 积分曲线

积分曲线就是由实数 parameterize（i.e.实数到流形上的一个映射）的一个曲线。满足**积分曲线每一处的切向量都和 Morse 函数的梯度方向是一致的**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_20_14_45_202405262014531.png" style="zoom: 67%;" />

- 注意，如果 $M \subset \mathbb R^m$，那么积分曲线是**向量值函数**，Morse 函数是**多元函数**。因此，前者的“梯度”应该是纵坐标，后者的“梯度”应该是横坐标。

积分线的性质如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_20_11_10_202405262011281.png" style="zoom: 67%;" />

1. 第一条，可以通过常微分方程的性质得出
2. 第二条，因为每一个点都有一条经过它的积分线，因此易得
3. 第三条，直观上来看，好像挺有道理。但是仔细一看，为啥起点和终点必须在临界点处？还得是靠常微分方程的性质。

### Example

以 $f(x,y) = x^2 + y^2$ 为例，按照上面的说法，那就必须满足方程：

$$
[\grad f](\beta_x(x), \beta_y(x)) = (2\beta_x(x), 2\beta_y(x)) = \frac {\partial} {\partial x} \beta(x) = (\beta_x'(x), \beta_y'(x))
$$

显然，解就是：

$$
\beta(x) = (C e^{2x}, D e^{2x})
$$

也就是可以沿着任意从原点发出去的射线到达无穷远处。又 $\lim_{x \to -\infty}\beta(x) = (0,0), \lim_{x \to +\infty}\beta(x) = (+\infty, +\infty)$，因此显然是满足上图的三个要求的。

## 稳定和不稳定流形

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_20_43_4_202405262043650.png" style="zoom: 67%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_20_48_37_202405262048877.png" style="zoom: 67%;" />

如第一张图，稳定流形，就是**给定一个临界点（一般而言，要么是极小值，要么是极大值）**，我们可以得到一个区域。所有经过这个区域中某一个点的积分曲线，都以这个临界点为终点；不稳定流形的定义也类似。

如第二张图，每一个左侧的区域（由实线包围起来），都是该区域中的极大值点的稳定流形；每一个右侧的区域（由虚线包围起来），都是该区域中的极小值点的稳定流形。

## Morse-Smale 函数

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_21_1_55_202405262101426.png" style="zoom: 80%;" />

如果两个流形的边界交于 p 点，那么，**两个子流形的边界的切线（i.e. 边界是线，而线的切空间就是切线）**，必须能够张成**流形的切空间**。

- 也就是说：**两个切线不平行**
    - 这样，两个流形的相交区间才是有形的

## Morse-Smale 复形

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_21_25_13_202405262125342.png" style="zoom: 67%;" />

由 Morse-Smale 的良好性质，对于任意两个 U(p) 和 S(q)，其相交区域就是一个 M-S 复形中的一个**四边形单元**（如右侧所示），而且这个单元必然由两个鞍点、一个极大值和一个极小值所构成。

---

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/26_22_50_44_202405262250982.png" style="zoom:67%;" />

如图，对于二维情况，就和上面所说的一样；对于三维情况，

- 1-鞍点，就是惯性系数为 1（i.e. Hessian 矩阵的合同标准型有 1 个负号）
- 2-鞍点，就是惯性系数为 2（i.e. Hessian 矩阵的合同标准型有 2 个负号）
- ……

# 离散情况：分片线性函数

我们可以通过以下的方法获得分片线性函数：

1. 在一个光滑流形上均匀采点，对每一个点算出对应的函数值
2. 将这些点连线，建立一个 mesh
3. 在每个三角网格中，采用重心坐标插值来近似函数值

## 判断离散的临界点

> Lower Link 的定义：
> $$
> Lk_u = \set{\sigma \in Lk_u | x \in \sigma \implies f(x) < f(u)}
> $$
> 这和 lower star（$Lk_u = \set{\sigma \in Lk_u | x \in \sigma \implies f(x) < f(u)}$）略有不同。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_1_15_41_202405270115970.png" style="zoom:80%;" />

如上图，粉红色+黑线条的就是 lower star，仅黑线条的就是 lower link。

对于极小值、鞍点、极大值，它们分别有不同的拓扑特征。

## 分片线性函数的 Morse 理论

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_1_21_50_202405270121874.png" style="zoom: 50%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_1_21_26_202405270121820.png" style="zoom: 50%;" />

对于不满足上面条件的函数，有时候可以通过一些小操作，就变成了满足条件的函数。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_1_25_47_202405270125190.png" style="zoom:67%;" />

### Unfolding

如图，中间的那一个点，旁边有**三个高点和三个矮点**，其 0 阶约化贝蒂数为 2（连通分支有 3 个）。

- 因此，既不是一般点（不与单点同调）；也不是 PL 简单点（因为 0 阶约化贝蒂数为 2）

但是，我们可以将中间点视作**重叠的两个点**，然后再进行计算。此时发现，这两个点分别都是鞍点。

### Perturbation

如果存在两个值一样的 PL 简单点，那么就加一个小扰动，让两个值不一样就好了。

# Reeb 图

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_23_22_20_202405272322622.png"/>

给定一个流形以及流形上的光滑实值函数，我们就可以求出每一个实数值对应的流形上的水平集（也就是函数值等于这个实值函数的点）。f

我们将每一个水平集的连通关系当作等价类（通俗来说，就是**将圆圈缩成点**），就可以得到一个 Reeb 图。

## Reeb 图的性质

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_23_40_15_202405272340426.png"/>

## Morse 函数的 Reeb 图

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_1_13_12_202405280113316.png"/>

Morse 函数相比一般函数性质更好，因此 Reeb 图也能更好地反映原始的拓扑信息。

对于一个可定向的、有 g 个洞的二维流形，Morse 函数确定的 Reeb 图中有 g 个环路。

因此，可以使用 Reeb 图，来快速地求出该二维流形的洞数，而不必仰仗计算同调。
## 离散 Reeb 图的构造

我们可以通过之前所说的分片线性函数，来构造离散的 Reeb 图。

我们将所有点按照 Morse 函数的值从小往大排。然后，每一个值对应的水平集，实际上就是三角形面片上的点，也就对应着若干个三角形。随着值的增加，不断有三角形被移出，同时不断有三角形进入（我们可以构建一个循环链表来实现高效的移除、进入）。

具体来说，每加入一个点的时候，就是对应以下几种情况：

**极小值点**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_0_39_4_202405280039620.png"/>

**一般顶点**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_0_41_34_202405280041157.png"/>

**鞍点**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_0_43_59_202405280043293.png"/>

对于鞍点的情况，就是要么合并，要么分裂：
1. 如果是合并，就将这个鞍点的对应的 lower star 在两个链表中分别删除，然后将两个循环链表”粘“起来，并且加入这个鞍点的 upper star
2. 如果是分裂，就将这个链表对应的 lower star 删除，**然后不要把断开的部分连起来**，此时这个链表应该可以分裂成多个链表了。
3. 假如说是一些奇葩的不可定向克莱因瓶之类的，可能会出现绕行方向的突变，此时需要重拍（**当然，图形学中，我们遇到的都是可定向的，因此不用在意这种情况**）

**极大值点**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_1_0_41_202405280100087.png"/>

首先，我们先移除这个极大值点的 lower star 的三角形。而且此时，它的链表应该已经为空了。

> [!note]+ 如何根据上面的信息绘制 Reeb 图？
> 
> 我们在 Reeb 中，绘制出所有临界点即可。然后对于临界点之间的连线，就是根据一个链表的出生到消亡来绘制的。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_1_7_41_202405280107797.png"/>

### 一些应用

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_1_27_23_202405280127731.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_1_27_13_202405280127704.png"/>

> [!info]+ 几何图形骨架提取
> 
> 我们在关键点处（上图中，就是左脚、右脚、两手和头顶**共四个点**）设立一个热源，然后在流形上模拟热扩散。
> 
> 之后，加入这个温度标量场性质足够良好，就将它当作 Morse 函数。
> 
> 然后就是求出这个 Morse 函数的 Reeb 图。这个 Reeb 图就是其几何骨架。

还可以进行 3D mesh 的匹配。众所周知，计算两个 3D 形状的相似性是困难的事情。因此，我们将 3D 形状通过某种离散 Morse 函数，构建出 Reeb 图。然后，我们就可以对两个不同的 Reeb 图之间进行匹配。

# Morse 复形算法简介

如何计算 Morse 复形？具体来说，如何在二维三角面片上，使用离散 Morse 函数，计算 Morse 复形？主要有下面三种方法：

1. Boundary Based：就是试图计算出从极大/极小值点出发，到达鞍点的线。而这些线就能够分割出一个个（不）稳定流形
2. Region Growth：从极大/极小点开始，逐渐加入临近的三角面片，从而逐渐得到该点对应的稳定/不稳定流形
3. Watershed：将“一盆水”从极大值点“泼下去”，使之留到不同的极小值点。留到同一个极小值点的那些水，就属于同一个“流域”。而这个流域，就是一个 Morse 复形

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/28_1_52_8_202405280152938.png"/>

***TODO***
