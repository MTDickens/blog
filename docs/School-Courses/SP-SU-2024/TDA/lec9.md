# Vectorization of Persistent Diagrams

> [!abstract]+ Motivation
> 
> 由于
> 1. 计算 PD 图之间的距离（Wasserstein, Bottleneck, etc），对于 Wasserstein 需要 $O(n^3)$，对于 bottleneck 需要 $O(n^{2.5}\log n)$，因此，对于大数据而言，这种计算量是非常 computationally intractable
> 2. 如果需要使用 DL 的方式进行处理，那么就最好将点云变换成向量
> 3. 变换成向量之后，除了喂给深度网络以外，还可以使用求方差、求均值等等统计方法。
>    
> 综上所述，vectorization 是非常 necessary。

当然，和 Wasserstein, Bottleneck 类似，向量也需要满足稳定性。

下面我们介绍几个向量化的方法。

## Binning

第一个 proposed method。非常原始，也没有稳定性而言（比如数据稍微偏差一点，某一个点可能就从 bin A 变成 bin B 了）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/31_3_57_44_202405310357023.png"/>

## Persistent Landscape

第一个被证明 stable 的向量化方法。具体方法如图可知。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/31_3_58_50_202405310358283.png"/>

## Persistent Images

就是将点云变成高斯，然后采样离散化（i.e. 每一个网格内，积分求出概率），从而得出一个二维网格。之后要 CNN 或者普通 NN 都可以。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/31_4_2_29_202405310402382.png"/>

## Kernel Method

> [!abstract]+ Recap
> 
> PD 图的 kernel method，就是 SVM 中的核方法的变体。
> 
> SVM 的传统核方法，是为了找到一个 computational tractable 的方法，使得可以将低维点**非线性地**映射到高维空间。
> 
> 又由于 Dual SVM 的所有计算都只需要两个高维空间向量内积，而从不需要高维向量本身，因此我们可以 exploit 这一点，通过简单的内积来代替复杂的高维映射。从而，我们引入了**核函数**，其实也就是高维/无穷维空间的内积。
> 
> 对于 persistent diagram 而言，一些情况下，与其找一个合适的 feature vector mapping，不如直接一步到位——为 PD 图构造一个合适的 Hilbert space。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/31_4_11_59_202405310411037.png"/>

构造出合适的内积（i.e. 核函数）之后，就可以直接用在各种核方法上，kernel SVM/PCA/etc。

## Persistent B-spline Grids

就是下面这样，可以看一下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/31_4_29_33_202405310429889.png"/>

B-spline 相比 persistent image 而言，直观上的好处就是：persistent image 是通过采样得到的，实际上的有用信息并不多，就是看着好看；而 persistent B-spline 的控制点是实打实的富含有用信息。

# 持续景观 (Persistent Images)

> [!abstract]+ 研究动机
> 
> 假设我们希望研究某个分布的拓扑性质，那就要在分布上采点。因此，通过大数定律，我们可以用**平均值**、**方差**等来估计分布的性质。为了求出 PD 图的平均值、方差，我们就需要引入持续景观。

对于 barcode 的每一条，我们都构造以下的简单函数：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_18_51_202406020118135.png"/>

> [!note]-
> 
> 可以将 barcode 视作一个分段函数，其中不为 0 的部分恒为 1。然后，我们用其自身和自身卷积，再乘以一个常数（用于将中心高度变成 $\frac {d - b} 2$）即可。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_15_53_202406020115795.png"/>

 - 如上图：$\lambda_1$ 就是蓝线，$\lambda_2$ 就是深红线，$\lambda_3$ 就是浅红线
 
然后， 我们可以 **generalize** 上面的函数：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_25_32_202406020125144.png"/>

> [!note]+ 更多构造
> 
> 可以直接从 PD 图上构造。也很直观。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_27_8_202406020127192.png"/>

## Mean and Variance

> [!info]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_28_48_202406020128369.png"/>
> 
> 如上图，我们可以很容易地定义出两函数之间的 p-度量和无穷度量

既然定义了度量，我们就可以定义均值（使用 **Frechet Mean**）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_37_57_202406020137778.png"/>

> [!note]+ frechet mean 的持续景观，等价于持续景观的 mean
> 
> 当然，这里有一个问题：对于 PD 图，**Frechet Mean** 的解是**不唯一**的。不过，我们可以证明，这几个函数的简单平均值，恰好是**某一个** Frechet Mean。因此，我们就取简单平均值作为 Frechet Mean 了。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_9_34_202406021709597.png"/>
> 
> 如左上图：某个 PD 图是红色点，另一个 PD 图是绿色点。
> 
> 如果求两者的 frechet mean，那么黑色点的 PD 图和紫色点的 PD 图都是解。**但是两个解的持续景观是一样的**。
> 
> 而这两个 frechet mean 解的持续景观，恰好就是红绿两 PD 图（右上和左下）的持续景观的 mean（右下）。

## Statistical Guarantees

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_1_42_14_202406020142328.png"/>

如上图：从 Frechet Mean 为 $\bar\lambda$ 的概率分布中采样，可以保证大数定律和中心极限定律。

**从而就说明：如果从这个概率测度中采样，并且然后估计平均、方差，只要样本数足够多，就可以无限接近真实值。也就是说，我们可以在持续景观上使用统计方法。**

> [!question]-
> 
> 不过，“采样”具体是什么严格数学定义，我还不知道。

## Stability

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_28_27_202406021728067.png"/>

## Example: Torus

> [!info]+ 为什么可以求平均？
> 
> 首先，我们在某个曲面上采样。采样带有噪声。
> 
> 然后，我们将点云通过持续同调的方法生成 PD 图，然后再生成持续景观。**由 stability 可知：曲面上采样的小噪声，变成了持续景观之后，还是小噪声**。
> 
> 通过 statistical guarantee 可知：持续景观的一个分布，其平均值和方差可以通过求简单平均的方法估计出来。**如果这个分布的噪声不大的话，那么就可以很快地收敛**。
> 
> 因此，某一个曲面对应的**持续景观**，可以由多次采样求平均的方法估计出来，**而且收敛速度是有概率上的保证的**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_39_53_202406021739491.png"/>

如上：一个圆环的**持续景观**，可以由多次采样求平均的方法得到。

## Example: Torus VS Sphere

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_43_25_202406021743868.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_43_37_202406021743889.png"/>

如图，通过 $H_1$ 的 PD 图，就可以将 torus 和 sphere 分开。

# 持续图像

首先，我们需要在 PD 上生成一个标量场 $\rho_B(\mathrm z): \mathbb R^2 \to \mathbb R$，也就是 persistent **surface**：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_52_13_202406021752563.png"/>

其中：

- $\phi_u(\mathrm z)$：就是一个 kernel 函数，定义在 $\mathrm u$ 处。我们这里取的是高斯核函数。
- $f(\mathrm u)$：也很好理解。因为不同点处的核函数，其中心高度必须有差别——生存实践越长的点，其中心应该越高。因此，$f(\mathrm u)$ 就是定义了点 $\mathrm u$ 的高斯函数的中心处高度。

> [!note]+ $f(\mathrm u)$
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_55_38_202406021755433.png"/>
> 
> - 我们这里就将 $u$ 的高度当作其中心处的高度

然后，对于每一个像素，我们将其内部的标量场积分即可，从而得到了 persistent **image**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_17_57_43_202406021757687.png"/>

## Stability

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_0_11_202406021800643.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_1_23_202406021801866.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_6_8_202406021806844.png"/>

如上图：我们可以用**持续图之间的 Wasserstein-1 距离，来 bound 住 persistent surface 以及 persistent diagram 之间的各种距离**。因此，是稳定的。

同时：对于**一般**的核函数，bound 的常数中，会有一个 A（图像面积）存在；而对于高斯核函数，就不存在这样的 A。因此，**我们就不必担心处理大图像的时候，会造成常数过大**。

## Example: Circle and Square

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_44_9_202406021844722.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_43_24_202406021843664.png"/>

可以发现，分类精度对分辨率和方差并不敏感。

## 可解释性

通过 SVM 进行分类，可以找到其中一些**在分类过程中起到重要作用的 features**。如下图中的 $\Huge\color{cyan}{\boxtimes}$。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_45_49_202406021845896.png"/>

## Example: Dynamic System

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/2_18_54_55_202406021854134.png"/>

如图：图中蓝色点就是该 dynamic system 在某种参数下的路径。不同的参数有着不同的路径，而这些不同的路径分别有着不同的拓扑结构。我们可以通过持续同调挖掘出这些拓扑结构，并且向量化成 PI。然后就可以通过 SVM 进行多类别分类。

# 持续 B 样条网络

***TODO***