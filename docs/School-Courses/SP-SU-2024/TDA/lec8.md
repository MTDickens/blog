# Motivation

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_22_28_37_202405212228821.png" style="zoom: 80%;" />

Morse 函数是微分拓扑的概念：涉及了微分几何以及同调的概念。

# Some Concepts

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/21_22_36_37_202405212236190.png" alt="img"  />

切空间就是曲面经过一个点处所有曲线的切线张成的空间。

---

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_10_8_37_202405221008263.png" style="zoom: 67%;" />

如上图，可以认为我们使用了函数构建了一个简单的流形。

如果一个点的所有偏导数的值均为 0，那么这个点就是**临界点**。

如果某个临界点处的 Hessian matrix 满秩，那么就称为**非退化**的。

---

称一个光滑函数是 morse 函数，如果其所有临界点满足以下条件：

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

