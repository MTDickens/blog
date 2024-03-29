小学阶段的数学是 $1+2$ ，这称为是算术。

到了初高中，开始接触**代数**，就是用符号来**代替数**，于是有了 $a+b$ 这样的表示。这个时候, $a$ 和 $b$ 表示一个抽象的，不确定的数。

到了高等数学，我们不想局限在实数，乃至数域范围内做代数。于是，数学家发现，其实可以不需要 $a$ , $b$ 表示什么有具体含义的东西。但问题是，如果 $a$ 和 $b$ 不是数，那么诸如 $a\pm b$ , $a\cdot b$ 这样的表示就没有意义。但事实上，这些表达式不需要有什么意义，只要满足一定的形式法则就可以定义出一个代数系统，从而进行代数的运算和研究。譬如， $a+b=b+a$ , $(a+b)+c=a+(b+c)$ 这样的法则就可以定义出**群**的概念。类似的，**环**这个概念是对函数关于乘法和加法两种运算的抽象；**线性空间**这个概念是对几何上的欧氏空间的抽象。

线性空间这个代数结构如此重要，以至于所有在大学阶段需要学数学的专业都会学到它。在研究线性空间的过程中，我们碰到了一个更加重要的概念 $--$ **线性变换**。学过线性代数的都知道，线性变换等价于是**矩阵**。这个时候，前面所讨论的对于代数系统抽象的好处就体现出来了。线性变换，或者矩阵也满足一定的法则，矩阵在它的抽象运算规律下构成一个**代数**。

事实上，任意一个集合上的 “变换”，构成了一个最基本的抽象代数结构 $--$ 群（关于变换的复合）。这里我们发现一个很重要的事实：一个集合本身没有代数结构，但是上面的变换却构成了一个有代数结构的对象。这个事情在线性空间上也成立，虽然线性空间本身的定义法则比较复杂，但是线性变换在其上会多一个变换复合的结构，也就是矩阵的乘法。虽然看起来，好像把事情变得更复杂了，但多一个代数结构，这对于我们的数学研究是由非常多的好处的。

接下来我们来看数学中另一个最基本的对象 $--$ **函数**。分析中，函数是通过无穷小的角度来切入的。代数中，我们则从函数构成的代数系统来研究整体的东西。之前说过，函数上有环的结构。最简单的函数环是实数 $\mathbb{R}$ 上的函数。这基本上就是我们分析学中的研究对象。但对于代数而言， $\mathbb{R}$ 上的函数环过于平凡了。我们想要研究更加复杂的空间上的函数环，比如平面 $\mathbb{R}^2$ , 圆 $S^1$ , 射影空间 $\mathbb{PR}^n$，多项式的零点集等等。**交换代数**的主要研究对象是类似于多项式的零点集上的函数环。通过研究函数环的性质来研究零点集的情况，这也是交换代数和代数几何结合如此紧密的原因。

我们将函数和线性空间这两个概念结合起来看看会得到什么。在线性空间的定义中，我们有实数在向量上的作用，即数乘 $\lambda v$ 。由此，我们把线性变换分为两类：一类是实数 $\mathbb{R}$ 对线性空间 $V$ 的作用，这属于是空间 $V$ 外部的作用；一类是 $V$ 到自身的作用，比如旋转，这是空间 $V$ 内部的作用。这两类作用的区分非常重要，在微分几何中，由此可以直接得到联络的基本概念。

现在我们考虑圆 $S^1$ 上的函数环: 设 $f(x)$ 是函数环中的一个元素。那么对于任意圆上的点 $x$, $f(x)$ 就是一个实数 $\lambda$ , 我们可以考虑 $f(x)$ 在向量空间上的作用 $\lambda v$ 也就是 $f(x) v$ . 由此，我们得到一个函数环在线性空间上的作用。怎么来形象地理解这个线性空间呢？我们可以想象 $S^1$ 上的每个点 $x$ 上都长出一个线性空间，这样，一个函数 $f(x)$ 的作用就可以看作是逐点在线性空间 $V_x$ 上的作用，这种几何对象叫做**向量丛**。也就是说，我们把线性空间的概念推广到任意拓扑空间上的向量丛的概念。

当然，向量丛的概念是几何上的构造。如果我们只考虑代数上的构造，可以定义任意一个环作用上去的群，这在代数上称为是**模**的结构。所以，模这个代数结构基本上可以看作是向量丛的代数类比。这跟之前域的代数结构和环的代数结构分别作为实数和函数空间的推广是一致的。

既然线性空间是模的一种特殊情况，我们想要区分作为线性空间的模和诸如 $S^1$ 上向量丛的模有什么区别。我们发现，两者的本质区别是线性空间有一组基底。这种可以找到基底的模称为是**自由模**。在代数上，自由模是最简单的，它和线性空间是一样的。同时，自由模也是我们研究其他复杂的模的基础。

前面说过，模的几何对应是拓扑空间上的向量丛结构。我们考虑一类比较好的拓扑空间，称之为拓扑流形，它可以由简单的拓扑空间拼合起来。简单的拓扑空间就是拓扑上平凡的空间，诸如直线，平面，开区间这类可以收缩为一个点的空间。有一个拓扑上的结论，说的是，平凡空间上的向量丛都是平凡的，也就是这些向量丛作为模都是自由模。从这个结论也可以看出，我们研究不自由的模，实际上研究的是非平凡的拓扑空间。

现在我们可以考虑拓扑流形上的向量丛了。根据定义，拓扑流形是由平凡的拓扑空间拼接起来的，那么对应的，向量丛也是由局部平凡的向量丛拼合起来的。也就是说，对应的模是由自由模拼合起来的。代数上，这种拼合过程是通过**同调代数**来实现的。给一个表示 $S^1$ 上向量丛的模 $M$, 它限制在拼合成 $S^1$ 的两个平凡的拓扑空间上的模是 $M_1$ 和 $M_2$. 我们知道， $M_1, M_2$ 都是自由的，但 $M$ 有可能是不自由的，这个过程就是用模的序列描述的。具体地说，我们知道 $M_1, M_2$ 都是 $M$ 的子模，因此有模的含入同态 $\iota: M_1\to M$, 以及投影 $p: M\to M_2$ . 这样 $M_1\xrightarrow{\iota} M\xrightarrow{p} M_2$ 构成了一个短序列。不难证明，若我们定义 $H:=\ker(p)/\mathrm{im}(\iota)$ , 则 $H=0$ 当且仅当 $M=M_1\oplus M_2$, 这里的 $\oplus$ 是代数上直和的意思。直和意味着当 $M_1$ 和 $M_2$ 都是自由的时候， $M$ 也是自由的。这样我们就可以用 $H$ 来衡量 $M$ 距离自由模有多远。这就是同调代数研究的内容。

上面这个例子实际上也是**代数拓扑**的一个例子。代数拓扑有两个基本内容：**同调论**和**同伦论**，其中同调论就是上面所说的想法，通过局部平凡的代数结构通过同调来刻画复杂的代数结构，从而反映拓扑的性质。同伦论则走的是另一条路，想法是用最简单的非平凡的拓扑空间 $--$ 球面 $S^n$ 来描绘一个复杂拓扑空间 $X$ 的具体情况。数学上，这可以通过研究连续映射 $f: S^n\to X$ 来实现。和之前类似，连续映射 $f$ 构成的空间可以赋予其代数结构来得到同伦群 $\pi_n(X)$.

代数拓扑的两个基本内容：同调和同伦，反映了数学研究的两种范式。对于一个复杂的对象 $X$, 我们有两种研究它的方法：一种是考虑从 $X$ 到一个已知性质的对象 $O$ 的映射 $f: X\to O$ . 常见的如 $O=\mathbb{R}$, 这样的 $f$ 就是函数。因为 $\mathbb{R}$ 的性质我们是很熟悉的，这赋予了 $f$ 这个集合很多结构，诸如可以加减乘除等。 $O$ 也可以是稍微抽象一些的东西，诸如群等代数对象，这就是同调论的根本想法。另一种是考虑一个已知的对象 $O$ 到未知的，我们要研究的对象 $X$ 之间的映射 $f: O\to X$. 如 $O=\mathbb{R}$, 则得到 $f$ 的集合是 $X$ 中的路径空间，这是同伦论的底层逻辑。这种从研究对象本身 $X$ 到研究对象之间映射 $f$ 的转变是现代数学的一种转向。由此得到的范畴论革命从底层改变了数学研究的思维和面貌。从中可以看到代数拓扑的重要性。