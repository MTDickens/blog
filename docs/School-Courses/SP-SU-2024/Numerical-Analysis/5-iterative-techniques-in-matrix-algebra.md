$$
\newcommand{\abs}[1]{\left| #1 \right|}
\newcommand{R}{\mathbb R}
\newcommand{N}{\mathbb N}
$$

# Norm

## Vector Norm

范数很简单，对于向量范数，只需要满足：

1. $\| x \| \geq 0$ 且 $\| x \| = 0 \iff x = 0$ (positive definite)
2. $\|\alpha x \| = \abs{\alpha} \| x \|$ (homogeneous)
3. $\| x + y \| \leq \| x \| + \| y \|$ (triangle inequality)

即可。

### Converge w.r.t Norm

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403271619934.png" alt="image-20240327161918543" style="zoom: 50%;" />

如图，

1. 我们可以容易证明，无穷范数收敛等价于逐 element 收敛。
2. 我们又通过证明所有 $\R^n$ 的范数等价，因此任意范数收敛等价于逐 element 收敛。

---

**证明 (2)：**

我们不妨证明所有范数与 $l^1$ 范数等价。

对于 $C_2$ 而言，证明是显然的。我们只需要找到自然基下的所有 $C_{2}^{(i)}$ 即可，然后取最大值。

- $\| x \|_A \leq \sum_{i=1}^N \| x_i \|_A = \sum_{i=1}^N \| x_i \|_A \leq \sum_{i=1}^N \abs{x_i}_A \max(C_2^{(i)}) = \max(C_2^{(i)}) \| x \|_1$。

对于 $C_1$ 而言，我们可以使用 Bolzano-Weierstrass 方法证明：

假设不存在这样的 $C_1$，那么，
$$
\forall n \in \N, \exists x(n) \in \R^n, s.t. \|x(n)\|_1 = 1: \frac 1 n = \frac 1 n \|x(n)\|_1 > \|x(n)\|_A
$$
从而：$\lim_{n \to \infty} \|x(n)\|_A = 0$。由于 $\|x(n)\|_1 = 1 \implies x(n) \text{ is bounded}$，由 Bolzano-Weierstrass 定理可知：存在收敛子列，这个收敛子列必然收敛至 $x^*$。

再由范数的连续性（易证）可知：$\|x^*\|_A = \| \lim_{i \to \infty}x(n_i)\|_A = \lim_{i \to \infty} \|x(n_i)\|_A = 0$。

因此，我们的反证法分三大步：

1. 向量的值收敛于 0
2. 向量（的一个子列）收敛
3. 由范数函数的连续性：向量（的一个子列）的收敛点的值等于 0，与 positive definite 矛盾

## Matrix Norm

对于矩阵范数，需要满足：

1. $\| A \| \geq 0$ 且 $\| A \| = 0 \iff x = 0$ (positive definite)
2. $\|\alpha A \| = \abs{\alpha} \| A \|$ (homogeneous)
3. $\| A + B \| \leq \| A \| + \| B \|$ (triangle inequality)
4. $\| AB \| \leq \| A \| \| B \|$ (consistency)

注意第四点是矩阵范数独有的。

### Some Popular Norms

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403271718091.png" alt="image-20240327171833109" style="zoom:50%;" />

第一个 Frobenius Norm 形式上简单，但是数学上解释复杂。

第二个 Natural Norm 是通过向量范数诱导的，形式上略复杂，但是数学上很简单。

对于常见的向量范数，对应的矩阵范数如下：

1. 无穷范数：逐列相加，取最大的那一行
2. 1-范数：逐行相加，取最大的那一列
3. 2-范数：对于一个高维球面，我们对其进行线性变换，然后取其最长轴。或者就是取矩阵最大的奇异值。

# Eigenvalues and Eigenvectors

## Spectral Radius

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403271745887.png" alt="image-20240327174556634" style="zoom:50%;" />

>由于代数闭域上的方阵一定有至少一个 eigenvalue，因为：
>$$
>f(\lambda) = \det(A - \lambda I)
>$$
>是一个多项式。而多项式在代数闭域上必然有根，因此必然有只要一个 eigenvlaue。因此，$\rho(A)$ 是良定义的。

重要的定理是：对于任意的 natural norm，矩阵的谱半径一定不大于 natural norm。

### Convergence of Matrix w.r.t its norm

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403271937818.png" alt="image-20240327193724500" style="zoom: 50%;" />

对于实对称矩阵，我们可以直接 Orthonormal Decomposition，结论更加简单。如果矩阵的特征值的绝对值均小于 1，那么就收敛。

> 更一般地，如下图，任意矩阵都可以分解成若尔当标准型。其中一个若尔当块如图所示。
>
> <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403271940314.avif" alt="img" style="zoom:67%;" />
>
> 同时，不难证明，若尔当型收敛 iff $\abs{\lambda} < 1$。因此只要所有特征值的绝对值小于 1，矩阵就收敛

# Iterative Techniques

## Jacobi Method

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403272031265.png" alt="image-20240327203131134" style="zoom:33%;" /><img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403272031477.png" alt="image-20240327203100794" style="zoom: 33%;" />

我们在这里，用的也是类似于不动点迭代的方法。

### 举例

<p>一个形如 <span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle Ax=b}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>A</mi>
        <mi>x</mi>
        <mo>=</mo>
        <mi>b</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle Ax=b}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/c294fb03a23c833d5b3cc6b3cbe40f25f0005745" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:7.169ex; height:2.176ex;" alt="{\displaystyle Ax=b}"></span> 的线性方程，估计初始<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x^{(0)}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mn>0</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x^{(0)}}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/6ad6bd852c94bbaf7de8ed7a188634cb3848167e" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:3.663ex; height:2.843ex;" alt="{\displaystyle x^{(0)}}"></span>：
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle A={\begin{bmatrix}2&amp;1\\5&amp;7\\\end{bmatrix}},\ b={\begin{bmatrix}11\\13\\\end{bmatrix}},\quad x^{(0)}={\begin{bmatrix}1\\1\\\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>A</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>2</mn>
                </mtd>
                <mtd>
                  <mn>1</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>5</mn>
                </mtd>
                <mtd>
                  <mn>7</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>,</mo>
        <mtext>&#xA0;</mtext>
        <mi>b</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>11</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>13</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>,</mo>
        <mspace width="1em" />
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mn>0</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>1</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle A={\begin{bmatrix}2&amp;1\\5&amp;7\\\end{bmatrix}},\ b={\begin{bmatrix}11\\13\\\end{bmatrix}},\quad x^{(0)}={\begin{bmatrix}1\\1\\\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/2d888398665b64df123e7f5d63f9f33e76fc905f" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:39.071ex; height:6.176ex;" alt="{\displaystyle A={\begin{bmatrix}2&amp;1\\5&amp;7\\\end{bmatrix}},\ b={\begin{bmatrix}11\\13\\\end{bmatrix}},\quad x^{(0)}={\begin{bmatrix}1\\1\\\end{bmatrix}}.}"></span></dd></dl>
<p>我们用上文描述的方程<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x^{(k+1)}=D^{-1}(b-Rx^{(k)})}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mi>k</mi>
            <mo>+</mo>
            <mn>1</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>=</mo>
        <msup>
          <mi>D</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo>&#x2212;<!-- − --></mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo stretchy="false">(</mo>
        <mi>b</mi>
        <mo>&#x2212;<!-- − --></mo>
        <mi>R</mi>
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mi>k</mi>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x^{(k+1)}=D^{-1}(b-Rx^{(k)})}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/0594c12613fa1cf956d617b5ba0fc8309e4a5a8c" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:24.263ex; height:3.343ex;" alt="{\displaystyle x^{(k+1)}=D^{-1}(b-Rx^{(k)})}"></span>来估计<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>x</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/87f9e315fd7e2ba406057a97300593c4802b53e4" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.33ex; height:1.676ex;" alt="{\displaystyle x}"></span>。首先，将等式写为<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle D^{-1}(b-Rx^{(k)})=Tx^{(k)}+C}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>D</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo>&#x2212;<!-- − --></mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo stretchy="false">(</mo>
        <mi>b</mi>
        <mo>&#x2212;<!-- − --></mo>
        <mi>R</mi>
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mi>k</mi>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo stretchy="false">)</mo>
        <mo>=</mo>
        <mi>T</mi>
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mi>k</mi>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>+</mo>
        <mi>C</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle D^{-1}(b-Rx^{(k)})=Tx^{(k)}+C}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/ce2a5c62500ff6e1e00547d387a590387133d9c8" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:28.405ex; height:3.343ex;" alt="{\displaystyle D^{-1}(b-Rx^{(k)})=Tx^{(k)}+C}"></span>以方便计算，其中<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle T=-D^{-1}R}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>T</mi>
        <mo>=</mo>
        <mo>&#x2212;<!-- − --></mo>
        <msup>
          <mi>D</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo>&#x2212;<!-- − --></mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mi>R</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle T=-D^{-1}R}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/b898c19455daacb0b2b0870220548e84ee925c69" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.505ex; width:12.564ex; height:2.843ex;" alt="{\displaystyle T=-D^{-1}R}"></span>和<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle C=D^{-1}b}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>C</mi>
        <mo>=</mo>
        <msup>
          <mi>D</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo>&#x2212;<!-- − --></mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mi>b</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle C=D^{-1}b}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/f1f267f9f2392e5f043b7d4140756198b53d3dc3" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:10.119ex; height:2.676ex;" alt="{\displaystyle C=D^{-1}b}"></span>。注意 <span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle R=L+U}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>R</mi>
        <mo>=</mo>
        <mi>L</mi>
        <mo>+</mo>
        <mi>U</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle R=L+U}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/22f61fb8dec69263215455c18937e6f0c1faa42b" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.505ex; width:11.068ex; height:2.343ex;" alt="{\displaystyle R=L+U}"></span>中的 <span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle L}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>L</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle L}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/103168b86f781fe6e9a4a87b8ea1cebe0ad4ede8" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.583ex; height:2.176ex;" alt="{\displaystyle L}"></span>和<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle U}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>U</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle U}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/458a728f53b9a0274f059cd695e067c430956025" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.783ex; height:2.176ex;" alt="{\displaystyle U}"></span>是<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle A}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>A</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle A}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/7daff47fa58cdfd29dc333def748ff5fa4c923e3" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.743ex; height:2.176ex;" alt="{\displaystyle A}"></span>的严格
递增和递减部分。变成如下数值：
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle D^{-1}={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}},\ L={\begin{bmatrix}0&amp;0\\5&amp;0\\\end{bmatrix}},\quad U={\begin{bmatrix}0&amp;1\\0&amp;0\\\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>D</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo>&#x2212;<!-- − --></mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>1</mn>
                  <mrow class="MJX-TeXAtom-ORD">
                    <mo>/</mo>
                  </mrow>
                  <mn>2</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mn>1</mn>
                  <mrow class="MJX-TeXAtom-ORD">
                    <mo>/</mo>
                  </mrow>
                  <mn>7</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>,</mo>
        <mtext>&#xA0;</mtext>
        <mi>L</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>5</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>,</mo>
        <mspace width="1em" />
        <mi>U</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mn>1</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle D^{-1}={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}},\ L={\begin{bmatrix}0&amp;0\\5&amp;0\\\end{bmatrix}},\quad U={\begin{bmatrix}0&amp;1\\0&amp;0\\\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/fecbbd6246b34ce94068af6cf6488d4235205bf8" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:50.747ex; height:6.176ex;" alt="{\displaystyle D^{-1}={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}},\ L={\begin{bmatrix}0&amp;0\\5&amp;0\\\end{bmatrix}},\quad U={\begin{bmatrix}0&amp;1\\0&amp;0\\\end{bmatrix}}.}"></span></dd></dl>
<p>令 <span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle T=-D^{-1}(L+U)}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>T</mi>
        <mo>=</mo>
        <mo>&#x2212;<!-- − --></mo>
        <msup>
          <mi>D</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo>&#x2212;<!-- − --></mo>
            <mn>1</mn>
          </mrow>
        </msup>
        <mo stretchy="false">(</mo>
        <mi>L</mi>
        <mo>+</mo>
        <mi>U</mi>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle T=-D^{-1}(L+U)}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/49a8a44d159b12006eaae77d89d564b0bfb6f4fb" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:18.815ex; height:3.176ex;" alt="{\displaystyle T=-D^{-1}(L+U)}"></span> as
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle T={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}}\left\{{\begin{bmatrix}0&amp;0\\-5&amp;0\\\end{bmatrix}}+{\begin{bmatrix}0&amp;-1\\0&amp;0\\\end{bmatrix}}\right\}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>T</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>1</mn>
                  <mrow class="MJX-TeXAtom-ORD">
                    <mo>/</mo>
                  </mrow>
                  <mn>2</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mn>1</mn>
                  <mrow class="MJX-TeXAtom-ORD">
                    <mo>/</mo>
                  </mrow>
                  <mn>7</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mrow>
          <mo>{</mo>
          <mrow>
            <mrow class="MJX-TeXAtom-ORD">
              <mrow>
                <mo>[</mo>
                <mtable rowspacing="4pt" columnspacing="1em">
                  <mtr>
                    <mtd>
                      <mn>0</mn>
                    </mtd>
                    <mtd>
                      <mn>0</mn>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd>
                      <mo>&#x2212;<!-- − --></mo>
                      <mn>5</mn>
                    </mtd>
                    <mtd>
                      <mn>0</mn>
                    </mtd>
                  </mtr>
                </mtable>
                <mo>]</mo>
              </mrow>
            </mrow>
            <mo>+</mo>
            <mrow class="MJX-TeXAtom-ORD">
              <mrow>
                <mo>[</mo>
                <mtable rowspacing="4pt" columnspacing="1em">
                  <mtr>
                    <mtd>
                      <mn>0</mn>
                    </mtd>
                    <mtd>
                      <mo>&#x2212;<!-- − --></mo>
                      <mn>1</mn>
                    </mtd>
                  </mtr>
                  <mtr>
                    <mtd>
                      <mn>0</mn>
                    </mtd>
                    <mtd>
                      <mn>0</mn>
                    </mtd>
                  </mtr>
                </mtable>
                <mo>]</mo>
              </mrow>
            </mrow>
          </mrow>
          <mo>}</mo>
        </mrow>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>0.5</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>0.714</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle T={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}}\left\{{\begin{bmatrix}0&amp;0\\-5&amp;0\\\end{bmatrix}}+{\begin{bmatrix}0&amp;-1\\0&amp;0\\\end{bmatrix}}\right\}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/17a8e7ae6c3af8e8abd396a29b6d915405c444a8" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:64.435ex; height:6.176ex;" alt="{\displaystyle T={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}}\left\{{\begin{bmatrix}0&amp;0\\-5&amp;0\\\end{bmatrix}}+{\begin{bmatrix}0&amp;-1\\0&amp;0\\\end{bmatrix}}\right\}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}.}"></span></dd></dl>
<p>解出C为：
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle C={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}}{\begin{bmatrix}11\\13\\\end{bmatrix}}={\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>C</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>1</mn>
                  <mrow class="MJX-TeXAtom-ORD">
                    <mo>/</mo>
                  </mrow>
                  <mn>2</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mn>1</mn>
                  <mrow class="MJX-TeXAtom-ORD">
                    <mo>/</mo>
                  </mrow>
                  <mn>7</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>11</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>13</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>5.5</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1.857</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle C={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}}{\begin{bmatrix}11\\13\\\end{bmatrix}}={\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/d4237dbbbbbe01cb746dd09c24d79a6ce0669e57" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:35.148ex; height:6.176ex;" alt="{\displaystyle C={\begin{bmatrix}1/2&amp;0\\0&amp;1/7\\\end{bmatrix}}{\begin{bmatrix}11\\13\\\end{bmatrix}}={\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}.}"></span></dd></dl>
<p>用计算出来的T和C，我们估计<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>x</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/87f9e315fd7e2ba406057a97300593c4802b53e4" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.338ex; width:1.33ex; height:1.676ex;" alt="{\displaystyle x}"></span>为<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x^{(1)}=Tx^{(0)}+C}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mn>1</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>=</mo>
        <mi>T</mi>
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mn>0</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>+</mo>
        <mi>C</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x^{(1)}=Tx^{(0)}+C}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/b846a2d92d6409fb6038739cb054a5259f555fa7" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.505ex; width:16.668ex; height:3.009ex;" alt="{\displaystyle x^{(1)}=Tx^{(0)}+C}"></span>
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x^{(1)}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}{\begin{bmatrix}1\\1\\\end{bmatrix}}+{\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}={\begin{bmatrix}5.0\\1.143\\\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mn>1</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>0.5</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>0.714</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>1</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>+</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>5.5</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1.857</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>5.0</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1.143</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x^{(1)}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}{\begin{bmatrix}1\\1\\\end{bmatrix}}+{\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}={\begin{bmatrix}5.0\\1.143\\\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/0a1bbbcba1245d3c6b6df9f51bbaa25a54768e9b" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:52.136ex; height:6.176ex;" alt="{\displaystyle x^{(1)}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}{\begin{bmatrix}1\\1\\\end{bmatrix}}+{\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}={\begin{bmatrix}5.0\\1.143\\\end{bmatrix}}.}"></span></dd></dl>
<p>继续迭代得：
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x^{(2)}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}{\begin{bmatrix}5.0\\1.143\\\end{bmatrix}}+{\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}={\begin{bmatrix}4.929\\-1.713\\\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mn>2</mn>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>0</mn>
                </mtd>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>0.5</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>0.714</mn>
                </mtd>
                <mtd>
                  <mn>0</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>5.0</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1.143</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>+</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>5.5</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mn>1.857</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>4.929</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>1.713</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x^{(2)}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}{\begin{bmatrix}5.0\\1.143\\\end{bmatrix}}+{\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}={\begin{bmatrix}4.929\\-1.713\\\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/4c24efe4456fcf440a652cc683b8c3078b5a7317" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:58.079ex; height:6.176ex;" alt="{\displaystyle x^{(2)}={\begin{bmatrix}0&amp;-0.5\\-0.714&amp;0\\\end{bmatrix}}{\begin{bmatrix}5.0\\1.143\\\end{bmatrix}}+{\begin{bmatrix}5.5\\1.857\\\end{bmatrix}}={\begin{bmatrix}4.929\\-1.713\\\end{bmatrix}}.}"></span></dd></dl>
<p>这个过程一直重复直到收敛（直到<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle \|Ax^{(n)}-b\|}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mo fence="false" stretchy="false">&#x2016;<!-- ‖ --></mo>
        <mi>A</mi>
        <msup>
          <mi>x</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <mo stretchy="false">(</mo>
            <mi>n</mi>
            <mo stretchy="false">)</mo>
          </mrow>
        </msup>
        <mo>&#x2212;<!-- − --></mo>
        <mi>b</mi>
        <mo fence="false" stretchy="false">&#x2016;<!-- ‖ --></mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle \|Ax^{(n)}-b\|}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/89830d5a5150cb238c06b036a4e073b321ccae9d" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -0.838ex; width:11.733ex; height:3.343ex;" alt="{\displaystyle \|Ax^{(n)}-b\|}"></span>足够小）。这个例子在25次迭代之后的解是
</p>
<dl><dd><span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML"  alttext="{\displaystyle x={\begin{bmatrix}7.111\\-3.222\end{bmatrix}}.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mi>x</mi>
        <mo>=</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mrow>
            <mo>[</mo>
            <mtable rowspacing="4pt" columnspacing="1em">
              <mtr>
                <mtd>
                  <mn>7.111</mn>
                </mtd>
              </mtr>
              <mtr>
                <mtd>
                  <mo>&#x2212;<!-- − --></mo>
                  <mn>3.222</mn>
                </mtd>
              </mtr>
            </mtable>
            <mo>]</mo>
          </mrow>
        </mrow>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle x={\begin{bmatrix}7.111\\-3.222\end{bmatrix}}.}</annotation>
  </semantics>
</math></span><img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/5458d3839311975d33a349c54b41fbd82e3f7e98" class="mwe-math-fallback-image-inline mw-invert" aria-hidden="true" style="vertical-align: -2.505ex; width:15.386ex; height:6.176ex;" alt="{\displaystyle x={\begin{bmatrix}7.111\\-3.222\end{bmatrix}}.}"></span></dd></dl>

## Gauss-Seidal Method

Gauss-Seidal 方法，在形式上，上和 Jacobi 方法的区别不大。

- 但是 Gauss-Seidal 比较难并行化，因为每计算一个 $x_j^{(k)}$ 都要用到之前的 $x_{j-1}^{(k)}, x_{j-2}^{(k)}, \dots$。

## Comparison

如图，左侧是 Gauss - Seidel 方法，右侧是 Jacobi 方法。两者最大的不同，就是 Gauss - Seidel 方法，总是使用最新的数据。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403272103743.webp" alt="img" style="zoom:33%;" /><img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403272103022.webp" alt="img" style="zoom:33%;" />

## Convergence: Proof

标准的收敛情况，是 $T_j = D^{-1}(L+U)$ 的谱半径小于 1。

---

**证明：**

我们令第 $k$ 轮的误差为 $\vec e^{(k)}$

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240327210927669.png" alt="image-20240327210927669" style="zoom:50%;" />

这个误差，本质上，就是向量值多元函数的不动点迭代法。

因此，如果我们希望误差收敛，就必须要求 $T$ 本身就是收敛的。而 $T$ 是收敛的条件，就是谱半径小于 1（上文已经证明）。

### Other convergence conditions

保证收敛的条件还可以是矩阵 $A$ 为严格或不可约地对角占优矩阵。不过，有时即使不满足此条件，雅可比法仍可收敛。

其中，如果是严格对角线占优，证明如下：

---

我们可以得到 $\lambda I - T = \lambda D^{-1} D - D^{-1} (L + U) = D^{-1} (\lambda D - (L + U))$。

不难发现，如果$\lambda \geq 1$，那么 $\lambda D - (L + U)$ 仍然是严格对角线占优，也就是可逆，从而 $\lambda I - T$ 可逆，从而 $\lambda$ 不可能是 $T$ 的 eigenvalue。

因此，$\rho(T) < 1$。

## Error Bound Estimation

矩阵的 normal norm 相比谱半径更适合用来估计误差。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403272123343.png" alt="image-20240327212230754" style="zoom: 50%;" />

由于谱半径小于等于任意的自然范数，因此：<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403272123492.png" alt="image-20240327212308128" style="zoom:67%;" />

