$$
\newcommand{abs}[1]{|#1|}
$$

## Numerical Differentiation

我们可以将函数进行泰勒展开，比如：$f(x_0 + h) = 1\left[f(x_0)\right] + 1 \left[hf'(x_0)\right] + \frac 1 2 \left[h^2 f''(x_0)]\right] + \mathcal o(h^3)$，从而如果给定了 $f(x_0), f(x_0 + h), f(x_0 + 2h)$，我们就可以忽略三阶小量，然后消去 $f(x_0), h^2 f''(x_0)$，只留下 $hf'(x_0)$，从而求出导数。

i.e. 

$$
\begin{pmatrix}
1 & 0 & 0 \newline
1 & 1 & \frac 1 2 \newline
1 & 2 & 2 \newline
\end{pmatrix}
\begin{pmatrix}
f \newline
hf' \newline
h^2f'' \newline
\end{pmatrix} \approx
\begin{pmatrix}
f(x_0) \newline
f(x_0 + h) \newline
f(x_0 + 2h) \newline
\end{pmatrix}
$$

从而，$hf' \approx 2f(x_0+h) - 0.5 f(x_0 + 2h) - 1.5 f(x_0)$。

---

当然，也可以通过插值函数来拟合原函数，同时通过插值函数的导数拟合原函数的导数。

- 但是，由于 $\prod_{\substack{k=0\newline k\neq j}} (x_j - x_k)$ 这个数是相当不可控的，因此不一定很稳定

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/9_0_19_59_202405090019215.png" style="zoom: 80%;" />

## Numerical Integration

数值积分，本质上来说，也很简单：将积分区间上插值多项式拿过来近似就行了。

### Degree of Accuracy

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/9_1_8_7_202405090108513.png" style="zoom:80%;" />

如图：对于这样的一次拟合，只能够准确求出 1 次及以下的多项式，因此 DoA 就是 1。

### Higher Order Interpolation

假设我们在 $[a,b]$ 中间均匀插值，插 $n+1$ 个点（包括端点），也就是 $h = \frac {b - a} n, x_i = ih + a$。那么，就可以实现：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/9_1_11_54_202405090111767.png"/>

由于当 $n+1$ 为奇数的时候，$x_{mid} = \frac {a+b} n = x_{\frac n 2}$，因此就可以多抵消一阶小项，precision = n + 2。

### Piecewise Approximation

Motivation: 

1. On large interval, use **low order Newton-Cotes formulas are not accurate**.
2. On large interval, interpolation using **high degree polynomial is unsuitable** because of oscillatory nature of high degree polynomials.
    - 我们还可以通过 Newton-Cotes 误差估计（见上图）一窥究竟：当 $n$ 比较大，且 $h$（积分区域）也比较大的时候，$h^{n+3}$ 可以相当大，从而误差是可以很大的

因此，就像我们不使用单个插值多项式、而是用分段去拟合大范围一样，对于积分区域大的积分式，我们也是采用分段的方式。

---

由于两段之间的点可能会被重复使用，因此我们可以做以下的代数化简：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_7_42_27_202405160742105.png"  />

由于辛普森积分是：
$$
\int_a^b f(x) \mathrm dx \approx \frac h 6 [f(a) + 4f(\frac {a+b} 2) + f(b)]
$$
因此，我们将分段后的每个小积分区域

- 中间点（如上图中的 4）不变
- 边界点（如图上重叠的部分）乘以 2
    - 除了 a, b 以外

就可以了。

### Error Analysis

我们可以证明：Piecewise Simpson's Rule 是稳定的。

这是因为：假如每一项的各种 error（round-off error 等等）是有界的，那么总体的 error 就是有界的。因此，即使有 round-off error，也不怕。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_7_55_54_202405160755496.png" style="zoom: 80%;" />

### Recursive Integration Method: Romberg Integration

我们可以通过反复外推的方式，通过最简单的 Trapezoidal Integration 推导成更加精细的积分。

算法：

<div class="mw-parser-output">
<p>假设我们所考虑的积分是<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle \int_0^1 f(x) \mathrm{d}x =: I}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msubsup>
          <mo>∫<!-- ∫ --></mo>
          <mn>0</mn>
          <mn>1</mn>
        </msubsup>
        <mi>f</mi>
        <mo stretchy="false">(</mo>
        <mi>x</mi>
        <mo stretchy="false">)</mo>
        <mrow class="MJX-TeXAtom-ORD">
          <mi mathvariant="normal">d</mi>
        </mrow>
        <mi>x</mi>
        <mo>=:</mo>
        <mi>I</mi>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle \int_0^1 f(x) \mathrm{d}x =: I}</annotation>
  </semantics>
</math></span><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/12846297177a8cccfa33b53c650b69247d6ae02c" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -2.338ex; width:15.862ex; height:6.176ex;" alt="{\displaystyle \int _{0}^{1}f(x)\mathrm {d} x=:I}"></span>，不在<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle [0,1]}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <mo stretchy="false">[</mo>
        <mn>0</mn>
        <mo>,</mo>
        <mn>1</mn>
        <mo stretchy="false">]</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle [0,1]}</annotation>
  </semantics>
</math></span><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/7254d8924aa1399d4254a857f3fe168593039774" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -0.838ex; width:4.653ex; height:2.843ex;" alt="{\displaystyle [0,1]}"></span>区间上的积分可以做相应的变量代换转化到该区间上去。
</p><p>我们先使用两点梯形公式计算初始迭代值<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle T_1 = \dfrac{1}{2} (f(0) + f(1))}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>T</mi>
          <mn>1</mn>
        </msub>
        <mo>=</mo>
        <mstyle displaystyle="true" scriptlevel="0">
          <mfrac>
            <mn>1</mn>
            <mn>2</mn>
          </mfrac>
        </mstyle>
        <mo stretchy="false">(</mo>
        <mi>f</mi>
        <mo stretchy="false">(</mo>
        <mn>0</mn>
        <mo stretchy="false">)</mo>
        <mo>+</mo>
        <mi>f</mi>
        <mo stretchy="false">(</mo>
        <mn>1</mn>
        <mo stretchy="false">)</mo>
        <mo stretchy="false">)</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle T_1 = \dfrac{1}{2} (f(0) + f(1))}</annotation>
  </semantics>
</math></span><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/58830b6c747ec3ba207efc85018939be95661a89" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -1.838ex; width:20.659ex; height:5.176ex;" alt="{\displaystyle T_{1}={\dfrac {1}{2}}(f(0)+f(1))}"></span>，将区间不断做二等分，得到一系列复化梯形公式
</p><div class="mwe-math-element"><div class="mwe-math-mathml-display mwe-math-mathml-a11y" style="display: none;"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle T_{2^k} = \dfrac{1}{2} T_{2^{k-1}} + \dfrac{1}{2^k} \sum_{j=1}^{2^{k-1}} f\!\left( \dfrac{2j-1}{2^k} \right), k = 1,2,\cdots.}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>T</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
        <mo>=</mo>
        <mstyle displaystyle="true" scriptlevel="0">
          <mfrac>
            <mn>1</mn>
            <mn>2</mn>
          </mfrac>
        </mstyle>
        <msub>
          <mi>T</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mrow class="MJX-TeXAtom-ORD">
                <mi>k</mi>
                <mo>−<!-- − --></mo>
                <mn>1</mn>
              </mrow>
            </msup>
          </mrow>
        </msub>
        <mo>+</mo>
        <mstyle displaystyle="true" scriptlevel="0">
          <mfrac>
            <mn>1</mn>
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mfrac>
        </mstyle>
        <munderover>
          <mo>∑<!-- ∑ --></mo>
          <mrow class="MJX-TeXAtom-ORD">
            <mi>j</mi>
            <mo>=</mo>
            <mn>1</mn>
          </mrow>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mrow class="MJX-TeXAtom-ORD">
                <mi>k</mi>
                <mo>−<!-- − --></mo>
                <mn>1</mn>
              </mrow>
            </msup>
          </mrow>
        </munderover>
        <mi>f</mi>
        <mspace width="negativethinmathspace"></mspace>
        <mrow>
          <mo>(</mo>
          <mstyle displaystyle="true" scriptlevel="0">
            <mfrac>
              <mrow>
                <mn>2</mn>
                <mi>j</mi>
                <mo>−<!-- − --></mo>
                <mn>1</mn>
              </mrow>
              <msup>
                <mn>2</mn>
                <mi>k</mi>
              </msup>
            </mfrac>
          </mstyle>
          <mo>)</mo>
        </mrow>
        <mo>,</mo>
        <mi>k</mi>
        <mo>=</mo>
        <mn>1</mn>
        <mo>,</mo>
        <mn>2</mn>
        <mo>,</mo>
        <mo>⋯<!-- ⋯ --></mo>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle T_{2^k} = \dfrac{1}{2} T_{2^{k-1}} + \dfrac{1}{2^k} \sum_{j=1}^{2^{k-1}} f\!\left( \dfrac{2j-1}{2^k} \right), k = 1,2,\cdots.}</annotation>
  </semantics>
</math></div><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/eff91ccc71412996eadef0935e5da544483eb775" class="mwe-math-fallback-image-display" aria-hidden="true" style="vertical-align: -3.338ex; width:48.974ex; height:8.009ex;" alt="{\displaystyle T_{2^{k}}={\dfrac {1}{2}}T_{2^{k-1}}+{\dfrac {1}{2^{k}}}\sum _{j=1}^{2^{k-1}}f\!\left({\dfrac {2j-1}{2^{k}}}\right),k=1,2,\cdots .}"></div>
这些都是后续迭代的初始值，上式给出了初始值的通式。下面我们开始第一次迭代，令
<div class="mwe-math-element"><div class="mwe-math-mathml-display mwe-math-mathml-a11y" style="display: none;"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle S_{2^k} = \dfrac{4T_{2^{k+1}}-T_{2^k}}{3}, k = 0,1,2,\cdots. }">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>S</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
        <mo>=</mo>
        <mstyle displaystyle="true" scriptlevel="0">
          <mfrac>
            <mrow>
              <mn>4</mn>
              <msub>
                <mi>T</mi>
                <mrow class="MJX-TeXAtom-ORD">
                  <msup>
                    <mn>2</mn>
                    <mrow class="MJX-TeXAtom-ORD">
                      <mi>k</mi>
                      <mo>+</mo>
                      <mn>1</mn>
                    </mrow>
                  </msup>
                </mrow>
              </msub>
              <mo>−<!-- − --></mo>
              <msub>
                <mi>T</mi>
                <mrow class="MJX-TeXAtom-ORD">
                  <msup>
                    <mn>2</mn>
                    <mi>k</mi>
                  </msup>
                </mrow>
              </msub>
            </mrow>
            <mn>3</mn>
          </mfrac>
        </mstyle>
        <mo>,</mo>
        <mi>k</mi>
        <mo>=</mo>
        <mn>0</mn>
        <mo>,</mo>
        <mn>1</mn>
        <mo>,</mo>
        <mn>2</mn>
        <mo>,</mo>
        <mo>⋯<!-- ⋯ --></mo>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle S_{2^k} = \dfrac{4T_{2^{k+1}}-T_{2^k}}{3}, k = 0,1,2,\cdots. }</annotation>
  </semantics>
</math></div><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/3f19999a0cd6f1fe3b2cd9e91fb19d7ae9d3ab14" class="mwe-math-fallback-image-display" aria-hidden="true" style="vertical-align: -1.838ex; width:35.214ex; height:5.509ex;" alt="{\displaystyle S_{2^{k}}={\dfrac {4T_{2^{k+1}}-T_{2^{k}}}{3}},k=0,1,2,\cdots .}"></div>
上式的<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle S_{2^k}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>S</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle S_{2^k}}</annotation>
  </semantics>
</math></span><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/fdf80a3cfed734adc2843f819ac88affcde58664" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -1.005ex; width:3.339ex; height:2.843ex;" alt="{\displaystyle S_{2^{k}}}"></span>是 Simpson 公式的复化自适应求积公式，进一步迭代
<div class="mwe-math-element"><div class="mwe-math-mathml-display mwe-math-mathml-a11y" style="display: none;"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle C_{2^k} = \dfrac{16S_{2^{k+1}}-S_{2^k}}{15}, k = 0,1,2,\cdots. }">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>C</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
        <mo>=</mo>
        <mstyle displaystyle="true" scriptlevel="0">
          <mfrac>
            <mrow>
              <mn>16</mn>
              <msub>
                <mi>S</mi>
                <mrow class="MJX-TeXAtom-ORD">
                  <msup>
                    <mn>2</mn>
                    <mrow class="MJX-TeXAtom-ORD">
                      <mi>k</mi>
                      <mo>+</mo>
                      <mn>1</mn>
                    </mrow>
                  </msup>
                </mrow>
              </msub>
              <mo>−<!-- − --></mo>
              <msub>
                <mi>S</mi>
                <mrow class="MJX-TeXAtom-ORD">
                  <msup>
                    <mn>2</mn>
                    <mi>k</mi>
                  </msup>
                </mrow>
              </msub>
            </mrow>
            <mn>15</mn>
          </mfrac>
        </mstyle>
        <mo>,</mo>
        <mi>k</mi>
        <mo>=</mo>
        <mn>0</mn>
        <mo>,</mo>
        <mn>1</mn>
        <mo>,</mo>
        <mn>2</mn>
        <mo>,</mo>
        <mo>⋯<!-- ⋯ --></mo>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle C_{2^k} = \dfrac{16S_{2^{k+1}}-S_{2^k}}{15}, k = 0,1,2,\cdots. }</annotation>
  </semantics>
</math></div><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/6ff78c23e50b67497b575137f5a29f145b0361f3" class="mwe-math-fallback-image-display" aria-hidden="true" style="vertical-align: -1.838ex; width:36.748ex; height:5.676ex;" alt="{\displaystyle C_{2^{k}}={\dfrac {16S_{2^{k+1}}-S_{2^{k}}}{15}},k=0,1,2,\cdots .}"></div>
上式的<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle C_{2^k}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>C</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle C_{2^k}}</annotation>
  </semantics>
</math></span><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/6f5e4c4f95841a08e57393e2d86612b59eab38b7" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -1.005ex; width:3.576ex; height:2.843ex;" alt="{\displaystyle C_{2^{k}}}"></span>是 Cotes 公式的复化自适应求积公式，进一步迭代
<div class="mwe-math-element"><div class="mwe-math-mathml-display mwe-math-mathml-a11y" style="display: none;"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle R_{2^k} = \dfrac{64C_{2^{k+1}}-C_{2^k}}{63}, k = 0,1,2,\cdots. }">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>R</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
        <mo>=</mo>
        <mstyle displaystyle="true" scriptlevel="0">
          <mfrac>
            <mrow>
              <mn>64</mn>
              <msub>
                <mi>C</mi>
                <mrow class="MJX-TeXAtom-ORD">
                  <msup>
                    <mn>2</mn>
                    <mrow class="MJX-TeXAtom-ORD">
                      <mi>k</mi>
                      <mo>+</mo>
                      <mn>1</mn>
                    </mrow>
                  </msup>
                </mrow>
              </msub>
              <mo>−<!-- − --></mo>
              <msub>
                <mi>C</mi>
                <mrow class="MJX-TeXAtom-ORD">
                  <msup>
                    <mn>2</mn>
                    <mi>k</mi>
                  </msup>
                </mrow>
              </msub>
            </mrow>
            <mn>63</mn>
          </mfrac>
        </mstyle>
        <mo>,</mo>
        <mi>k</mi>
        <mo>=</mo>
        <mn>0</mn>
        <mo>,</mo>
        <mn>1</mn>
        <mo>,</mo>
        <mn>2</mn>
        <mo>,</mo>
        <mo>⋯<!-- ⋯ --></mo>
        <mo>.</mo>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle R_{2^k} = \dfrac{64C_{2^{k+1}}-C_{2^k}}{63}, k = 0,1,2,\cdots. }</annotation>
  </semantics>
</math></div><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/84f35f93dd2c690f63b3615dea90e9d4c06c5cba" class="mwe-math-fallback-image-display" aria-hidden="true" style="vertical-align: -1.838ex; width:37.324ex; height:5.676ex;" alt="{\displaystyle R_{2^{k}}={\dfrac {64C_{2^{k+1}}-C_{2^{k}}}{63}},k=0,1,2,\cdots .}"></div>
上式的<span class="mwe-math-element"><span class="mwe-math-mathml-inline mwe-math-mathml-a11y" style="display: none;"><math xmlns="http://www.w3.org/1998/Math/MathML" alttext="{\displaystyle R_{2^k}}">
  <semantics>
    <mrow class="MJX-TeXAtom-ORD">
      <mstyle displaystyle="true" scriptlevel="0">
        <msub>
          <mi>R</mi>
          <mrow class="MJX-TeXAtom-ORD">
            <msup>
              <mn>2</mn>
              <mi>k</mi>
            </msup>
          </mrow>
        </msub>
      </mstyle>
    </mrow>
    <annotation encoding="application/x-tex">{\displaystyle R_{2^k}}</annotation>
  </semantics>
</math></span><img src="https://services.fandom.com/mathoid-facade/v1/media/math/render/svg/64af6c9fad788d889da8708c4026b8f962d33dd7" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -1.005ex; width:3.678ex; height:2.843ex;" alt="{\displaystyle R_{2^{k}}}"></span>是 Romberg 公式的复化自适应求积公式。
<p></p>
</div>

也就是说：将插值细化一倍之后，我们就可以通过细化了一倍的插值和之前未细化的插值，来计算出未细化过的高一阶的插值。

这样的话，可以通过递归，由低阶的 Trapezoidal Integration 来计算高阶的值。

- **好处是实现方便，无需将复杂的高阶积分的参数算出来，而且可以根据需要不断地进行加高阶**。

## Adaptive Numerical Integration

以上的积分方式，只是进行了运算和误差估计。下面我们进行 adaptive 的 numerical integration。

### 核心思想

如果一个区间的误差已经足够小了，那么细化这个区间，从而榨取所剩无几的”剩余误差“，就是不明智之举。我们应该将目标放在榨取大误差区间的”剩余误差“。

### 核心步骤

就是如果要控制整体的误差小于 $\varepsilon$，那么就可以通过**控制每一个长为 $h_i$ 的小段的误差小于 $\frac {h_i} {b - a} \varepsilon$**。

因此，对于每一个小段，如果误差已经小于 $\frac h {b - a} \varepsilon$，那么就维持现状；如果误差大于 $\frac h {b - a} \varepsilon$​，那么就进一步细分。

如下图中的 $y = e^{-3x} \sin(4x)$：函数的右侧平坦，而左侧起伏大，因此，如果在 [0,4] 上进行均匀划分，那么右侧的积分很可能已经误差达标的，而左侧还没有，因此只需要细化左侧，而不需要细化右侧。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/17_2_36_35_202405170236614.png" alt="image-20240517023629100" style="zoom:50%;" />

### Example: Adaptive Simpson Integration

我们先在 [a,b] 上使用 Simpson Integration。
$$
\varepsilon(f, a, b) = \int_a^b f(x) \mathrm dx - S(a,b) = \frac {h^5} {90} f^{(4)}(\xi)
$$

- ε 在这里就是 $f$ 在 [a,b] 区间上使用 Simpson Integration 的误差

然后进行细化，i.e. 在 [a, (a+b)/2], [(a+b)/2, b] 上也使用，那么误差就缩小为：
$$
\varepsilon' = \frac {(\frac h 2)^5} {90} f^{(4)}(\xi_1) + \frac {(\frac h 2)^5} {90} f^{(4)}(\xi_2) \leq \frac 1 {16} \frac {h^5} {90} f^{(4)}(\xi')
$$
接下来，就和 Romberg 的思想类似：我们**假定** $f^{(4)}(\xi) \approx f^{(4)}(\xi')$，从而可以**通过 $S(\_, \_)$ 来估计出 $\varepsilon$**：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/17_2_54_48_202405170254213.png" style="zoom:67%;" />

也就是说：如果 $\frac 1 {15} \abs{S(a,b) - S(a, \frac {a+b} 2) - S(\frac {a+b} 2, b)} < \varepsilon$，那么就可以认为 $\abs{\int_a^b f(x) \mathrm dx - S(a, \frac {a+b} 2) - S(\frac {a+b} 2, b)} < \varepsilon$。

#### 另一种理解

除了通过”估计误差“这一角度来理解 $\abs{S(a,b) - S(a, \frac {a+b} 2) - S(\frac {a+b} 2, b)}$，我们还可以从下面这个形象的比喻中理解：

1. 如果你考试只考了 60 分（未细化的辛普森积分结果），那么回家就要挨揍（细化的辛普森积分结果）
2. 如果挨揍之后只考了 61 分（$\abs{S(a,b) - S(a, \frac {a+b} 2) - S(\frac {a+b} 2, b)}$​ 太小），那么就说明”朽木不可雕也“，我就不管了
    - 当然，61 分也比 60 分强，因此我们到时候还是返回揍了之后的结果（也就是还是返回细化的辛普森积分结果）
3. 如果挨揍之后却考了 90 分（$\abs{S(a,b) - S(a, \frac {a+b} 2) - S(\frac {a+b} 2, b)}$ 比较大），那么就说明”孺子尚可教也“，我就继续揍，直到”朽木不可雕“为止

### Algorithm

通过上面的 example，我们可以自然地推导出算法。下面就是伪代码：

```
fn adasimp(a, b, f, eps) begin
    mid := (a + b) / 2
    s_a_b := simp(a, b, f)
    s_a_mid := simp(a, mid, f)
    s_mid_b := simp(mid, b, f)
    refined_s := s_a_mid + s_mid_b
    err := (s_a_b - refined_s) / 15
    if (err <= eps) begin
    	return refined_s;
    end
	else begin
		return adasimp(a, mid, f, eps/2) + adasimp(mid, b, f, eps/2)
	end
end
```

- 当然，上面的伪代码没有很好地用到之前的结果，因此并不是非常高效

## Better Methods: Gaussian Quadrature

对于**插值多项式**而言，插 $n+1$ 个点，只能达到 $n$ 的精度

- i.e. 只能够完美拟合至多 $n$ 阶多项式

但是，**插值积分**，在某一种意义来说，结果就是一个 value，而不是一个 function。因此，按理说，同样的插值点，也许可以比多项式做的更好一些。

下面，我们就介绍 Gaussian Quadrature，它可以使用 $n+1$ 个点，就将精度提升到 $2n+1$​。

---

我们希望：
$$
\int_0^1 W(x)f(x) \mathrm dx \approx w_i'f(x_i)
$$

---

而这个问题等价于：使用一种只需要 $n+1$ 个点的值的积分方法，就可以精确求出 $\int_a^b 1, x, x^2, x^3, \dots, x^{2n+1}$。

我们为什么可以做到这一点呢？

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_19_11_36_202405221911421.png" style="zoom: 50%;" />

如图，对于上图的积分，如果要求精度为 3，那么，由于实际上是有 4 个参数，因此显然可能解出来，也就是精度为 3 的要求是可能可以实现的。

- 另，如果任意 $x_0, \dots, x_n$，搭配上某一组系数，可以达到 2n+1 的精度，我们就称其为“高斯点”

**但是，由于直接解需要求解高阶方程，因此不是好方法。**

---

**定理：**$x_0, \dots, x_n$ 是高斯点，当且仅当 $W(x) = \prod_{k=0}^n (x - x_k)$ 与任何 n-1 阶及以下的多项式【在 $\int_0^1 w(x) * \cdot * \cdot \mathrm dx$ 内积意义下】正交。

**证明：**

LHS -> RHS: 如果是高斯点，那么对于任意的 n-1 阶及以下多项式 p(x)，有 p(x)W(x) 必为 2n-1 阶及以下的多项式，从而令 $f(x) = p(x) W(x)$，就有：
$$
\int_0^1 w(x) p(x) W(x) = \sum_{i=0}^n A_i p(x_i) W(x_i) = \sum_{i=0}^n A_i p(x_i) 0 = 0
$$
RHS -> LHS: 如果正交，那么对于任意的小于等于 2n-1 阶的 $f(x)$，都有 $f(x) = p(x) W(x) + r(x)$，其中 $r(x)$ 的阶数小于 n-1 阶。

从而：
$$
\begin{aligned}
    \int_0^1 w(x) f(x) &= \int_0^1 w(x) r(x) + \int_0^1 w(x) p(x) W(x) \newline
                       &= \int_0^1 w(x) r(x) + 0 \newline
                       &= \int_0^1 w(x) r(x) \newline
                       &= \sum_{i=0}^n A_i r(x_i) \text{~~（显然我们可以通过简单的插值找到这样一组} A_i\text） \newline
                       &= \sum_{i=0}^n A_i r(x_i) + \sum_{i=0}^n A_i p(x_i) 0 \newline
                       &= \sum_{i=0}^n A_i r(x_i) + \sum_{i=0}^n A_i W(x_i) 0 \newline
                       &= \sum_{i=0}^n A_i f(x)
\end{aligned}
$$
因此，我们可以通过

1. Gram-Schmidt 算法来求出一组正交（多项式）基
2. 将最高阶的多项式的零点求出来，作为高斯点
3. 通过解一些简单而实际的方程，将系数解出来
    - 对于一个确定的 $w(x)$ 而言，高斯点也是确定的

示例如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_19_51_29_202405221951578.png"/>

### 各种不同 $w(x)$ 下的多项式

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/22_20_1_24_202405222001633.png"/>

使用 Chebyshev 还有一个好处：如果用均匀采点的方法，那么必然会采到 $x = \pm 1$，而函数在这里是奇异的；如果用 Gauss-Chebyshev，那么就没有问题。
