[TOC]

# 大纲

1. 图、曲面与复形 
2. 同调、上同调与对偶 
3. Morse函数及其应用 
4. 持续同调的计算和加速方法 
5. 持续同调的稳定性理论 
6. 持续同调的向量化 
7. Mapper及持续同调的应用 

# 拓扑空间

## 定义

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240327215559636.png" alt="image-20240327215559636" style="zoom:33%;" />

如图，一个集合的一个拓扑，就是这个集合的**子集的集合**。

## 连续性

对于 $f: X \to Y$，如果所有开集的原象为开集，那么就称 $f$ is a continuous mapping between $X$ and $Y$。

## 同胚

定义：若映射 $f:X \to Y$ 是连续双射，且逆映射 $f^{-1}$也连续，则称 $f$ 是一个同胚映射 (Homeomorphism)。

相应地，称 $X$ 与 $Y$ 是同胚的 (Homeomorphic)。

- 本质上，同胚就相当于：**两个集合之间的开集的一一对应关系**。

# 图论

## 平面图

平面图的欧拉示性数是。因为，一个含有 $n$ 个顶点的平面图的生成树只有

- 一个面
- $n$ 个点
- $n-1$ 条边

而每增加一条边（不与其他边相交），都一定会增加一个面。因此，$F + V - E = 2$​。



另外，$E \leq 3V-6$（可以通过【如果 $E \geq 3$】一个面至少有 3 条边环绕，以及一条边至多与两面相交得到） 

## $K_5$ 和 $K_{3,3}$

对于 $K_5$ 而言，$10 > 3 * 5 - 6$，因此绝对不是平面图。

对于 $K_{3,3}$ 而言，由于是二分图，因此不存在三个点两两相连，从而三角形面不存在，也就是说 $4F \leq 2E$，从而必须满足 $2V- E \geq 4$，可惜 $2 * 6 - 9 = 3 < 4$，因此也不是平面图。

---

之后还有一个 Kuratowski 定理：一个简单图是平面图 &iff; 它不存在与上述两图同胚的子图。

# 拓扑

## 可定向性

通俗来说，就是一个箭头平滑地绕行，能否箭头指向的方向与箭头位置无关。

- 莫比乌斯环就是反例

## 连通和

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290752873.png" alt="image-20240329075246942" style="zoom:50%;" />

如图，分别从 A、B 处挖去一个“开”洞，然后将两者粘在一起，就是连通和，记作 $A \# B$。

## 紧可定向 2-流形的分类

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290758906.png" alt="image-20240329075830813" style="zoom:33%;" />

## 亏格

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290802685.png" alt="image-20240329080227778" style="zoom: 67%;" />

由于紧可定向流形必然同胚于上述的一种“标准型”，而这些标准型的亏格正好等于其“洞”的数量。

因此，对于**紧可定向2-流形**而言，亏格就是洞的数量。

- 注意：亏格仅仅定义在 2-流形上，而 Betti Number 适用于所有的流形。

### 紧可定向 2-流形的欧拉示性数

![image-20240329081517419](https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290815469.png)

证明也比较直观。本质上就是使用连通和进行数学归纳。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290819546.png" alt="image-20240329081903499" style="zoom:50%;" />

- 注意：$边 \backslash 点$ 和 $面 \backslash (边 \cup 点)$ 都必须是开集。因此圆柱面必须要有 1 条边，才能将这个圆柱面“切开”，变成一个开矩形。

### 例子

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290833406.png" alt="image-20240329083349651" style="zoom: 50%;" />

如图，球面的示性数是 2，环面是 0。由于做了三次连通和（三个圆柱面），因此欧拉示性数是 2 + 0 + 3 * (-2) = -4，从而亏格就是 3。

## 紧不可定向 2-流形

交叉帽是莫比乌斯环的二维紧流形的形式，如下图所示。

![img](https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290846261.gif)

而射影平面又是另一大紧流形。本质上就是一个球面的对称等价类：关于原点对称的点等价。亏格为 1。

克莱因瓶是一个 torus 的原点对称等价类，亏格为 2。

- 可以想象，由于环面上关于原点对称的两个圆的点是顺时针一一对应的，因此不能把两个圆“对着”接在一起，而要“顺着”接在一起。所以必须要穿过瓶身，做成 Klein Bottle 的样子。

### 分类

所有紧不可定向 2-流形都与

- 仿射面 $\mathbb P^2 = \mathbb S^2 / \sim$ 
- 或者若干个仿射面的连通和

同胚。