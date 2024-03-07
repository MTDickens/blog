# Lec 1

## 5V's of big data

- Volume
  - 总量大
- Velocity
  - 产生速度快
- Variety
  - 形式多样：structured, semi-structured and unstructured
    - **结构化数据**
      - **示例：** 数据库中的客户信息表，包含客户姓名、年龄、地址、电话号码等信息。
      - **特点：** 数据具有固定的格式和模式，可以很容易地存储和分析。
    - **半结构化数据**
      - **示例：** XML文件，例如RSS订阅源或商品目录。
      - **特点：** 数据具有一定的格式，但可能不完全一致。
    - **非结构化数据**
      - **示例：** 文本文件、图像、视频、社交媒体帖子等。
      - **特点：** 数据没有任何格式，需要进行解析才能提取有效信息。

- Value
  - 个体价值低
  - 整体价值高
- Veracity
  - 来源多样
  - 真实性难以验证

### 更严格的形式

- 不能集中存储
- 在合理的时间内难以处理
- 个体价值低、整体价值高

## 大数据的例子

- 物理世界产生的大数据：科研大数据
  - 基因工程
    - 基因测序量的增长速度远超科研的数据
  - 天文数据
    - 观测、模拟的数据
  - 电子对撞机
    - 数据产生量为 1PB/sec
    - 我们要从 1PB/sec 减小至 320MB/sec
- 人类活动产生的大数据：人类大数据
  - 搜索引擎、门户网站
  - 社交媒体
    - 比较重要的，如：社交网
  - 通信网络
  - 金融网络
    - 商业关系、现金流等等

## TDA

### Brief History

TDA 源于 Computational Topology，而后者又由 Computational Geometry。

> 对于一个（数学概念），我们要知道：
>
> - 具体概念
> - 提出背景/动机
>
> - 应用领域

### PD 计算

总体而言：

1. 先用持续同调来算出每个同调群 $H_k$ 的每个元素（i.e. 拓扑特征）的持续时间。得到 barcode，然后转为二维点阵（x-axis: birth, y-axis: death）
2. 然后可以用 (Discrete) Wasserstein Metric 计算出两个点阵之间的 distance

### 向量化

首先将二位点阵进行线性变换，将纵坐标从死亡时间变成持续时间。

然后将每个点当作高斯核函数的中心，从而计算出一个标量场。

将这个标量场光栅化，称为**“持续图”**。

最后，一行一行/一列一列地变成向量。

- 可以证明，这样的向量化是稳定的（i.e. 向量的 L^2 距离小于二位点阵的 Wasserstein 距离）

## 标量场的PD计算

如图，通过下水平集重建的方式如下。

<img src="https://www.researchgate.net/profile/Brittany-Fasy/publication/260107617/figure/fig8/AS:668506240598034@1536395716800/We-plot-the-persistence-diagram-corresponding-to-the-upper-level-set-filtration-of-the.png" alt="img" style="zoom:50%;" />

