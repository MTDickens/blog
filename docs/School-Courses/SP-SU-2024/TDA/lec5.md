$$
\newcommand{K}[1]{K^{(#1)}}
$$



# Persistent Homology

## Filtration

Filtration 就是一个

- 单纯复形的递增序列 $K^{(n)}$: $K^{(0)} \subset K^{(1)} \subset K^{(2)} \subset \cdots$
- 并且每两个相邻复形之间只相差一个单形

Filter 就是一个 filtration 的差序列：
$$
\text{Filter of }K := \set{\sigma_0, \sigma_1, \cdots} = \set{\K{1} - \K{0}, \K{2} - \K{1}, \cdots}
$$
我们用 $C_k^{(n)}, \partial_k^{(n)}, Z_k^{(n)}, B_k^{(n)}, H_k^{(n)}$ 来表示第 $n$​ 项链复形的各项属性

### Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/11_0_17_26_202404110017442.png" alt="image-20240411001722284" style="zoom: 50%;" />

如上图，

- 标减号的，代表**至少有一个拓扑特征在这一步中消失**
    - 以 14 为例：这一步中，
        - 增加了 suw 这一个 2-复形特征，
        - 减少了 su, uw, ws 这三个 1-复形特征，以及 s, u, w 这三个 0-复形特征
        - 不过，由于 uw, s, u, w 之前已经被减少了，因此实际上只减少了 su, ws
- 标加好的，代表**没有任何拓扑特征消失**，只有拓扑特征的增加
    - 以 17 为例：这一步中，
        - 增加了 stw 这一个 2-复形特征，
        - 减少了 st, tw, ws 这三个 1-复形特征，以及 s, t, w 这三个 0-复形特征
        - 不过，由于 st, tw, ws, s, t, w 之前已经被减少了，因此实际什么也没有减少

## How to Construct a Complex With $\varepsilon$?

对于点云而言，可以使用：

- &Ccaron;ech 复形：最小包围球
- VR 复形：最远点对
- Alpha 复形：最小包围球 &cap; 相邻胞腔
- 另外，如果点云数量过于巨大，则可以使用 vineyard 复形来计算

对于标量场而言，可以使用 low-star filtration 来构造上/下水平集。

## How to Construct a Filtration With a certain Complex?

