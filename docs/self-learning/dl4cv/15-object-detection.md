# Prelude: Tasks in CV

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_6_46_40_202405060646553.png" alt="image-20240506064632136" style="zoom: 33%;" />

# Challenges

1. 多物体：你不知道有几个物体，因此什么时候结束也无法确定
2. 多类别输出：你不仅要输出 what，还要输出 where
3. 大图片：对于分类而言，图片尺寸只需要在 224x224 即可；但是对于 object detection，需要在 800x600 左右

# Single Object Detection

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_7_13_26_202405060713449.png" alt="img" style="zoom: 50%;" />

如上图，我们使用一个**预训练**的网络（往往是在 ImageNet 上训练的），通过微调（预训练模型以及两个 fc layers）进行迁移学习。我们要确保 class scores 和 box coords 都尽量判断正确。

缺点就是：**无法探测一个以上的物体**

# Multiple Object Detection

## Sliding Windows

最原始的想法，就是对于不同大小、不同中心的 sub-image，都抽出来，通过一个 CNN 求 softmaxed scores，然后根据 score 的无穷范数来选取 top-k 个区域（或者使用 threshold），作为输出。

但是，这里的问题就是：计算量过于巨大。因此实际上不可取。

## R-CNN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_20_50_22_202405062050396.png" alt="image-20240506205019844" style="zoom: 33%;" />

### training sketch

首先，通过 selective search 算法（非神经网络的传统方法），得到 region proposals（大约有 2000 个）

然后，对于每一个 region，我们将其

1. resize 成 224x224
2. 丢到 CNN 模型里去
3. 最后得到两个输出：
    1. (softmaxed) scores
    2. region transform
4. 然后，我们通过 region transform 来变换该 region，得到最终的 region
5. 最后，通过和 ground truth 的 region 以及 category 两者，分别计算 loss，然后加权加起来得到最终 loss，再进行反向传播

### training details

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_6_13_21_202405070613609.png" alt="image-20240507061318805" style="zoom:33%;" />

如图，我们通过**ground truth (i.e. boxes of training set)**来将 box 划分成不同类别：positive, neutral and negative。

其中，

1. positive 的，我们需要完成分类+调整box位置的操作；
2. negative 的，由于调整box位置的操作没有任何作用，因此只需要完成分类即可。
    - 目标分类是 background，是我们自己加上去的分类
3. neutral 的，我们就不管了

### predicting/testing

首先，通过 selective search 算法（非神经网络的传统方法），得到 region proposals（大约有 2000 个）

然后，对于每一个 region，我们将其

1. resize 成 224x224
2. 丢到 CNN 模型里去
3. 最后得到两个输出：
    1. predicted category and its score
    2. region transform

然后，通过一些规则选取部分 region（比如分数 top-k 的/超过 threshold的），输出对应 region 和对应的 category。

### *Note*

我们的 CNN 不会接受任何和原始 subimage 大小相关的参数。

### Comparing Boxes

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_21_27_32_202405062127306.png" alt="image-20240506212729118" style="zoom:50%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_21_28_18_202405062128440.png" alt="image-20240506212808359" style="zoom: 50%;" />

### Overlapping Boxes

有时候，若干个 overlapped boxes 可能指代的是同一个物体，此时，我们需要将一些 boxes 清除出去。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_21_33_50_202405062133524.png" alt="image-20240506213345183" style="zoom: 33%;" />

如图，这是一个**贪心算法**。

我们首先抽取分数最高的 box（也就是蓝色 box），然后计算其到其它 boxes 的 IoU 距离。然后剔除所有 IoU 距离小于 threshold 的 dogs（也就是橙色 box）。

然后，我们抽取*剩下的*分数次高的 box（也就是紫色 box），然后剔除所有 IoU 距离小于 threshold 的 dogs（也就是黄色 box）。

由于没有比紫色 box 分数更低的 box，算法结束。

```
// 伪代码
fn NMS(Category "c", Float "threshold") -> Array:
	"Arr" = all boxes of category "c"
	Sort "Arr" by their score in descending order
	"IsEliminated" = boolean array of "Arr".shape
	Set all elements in "IsEliminated" to False
	for each object "obj", "check" in zip("Arr", "IsEliminated"):
		if "check":
			continue
		for each object "o", "c" after ("obj", "check") in zip("Arr", "IsEliminated"):
			if (IoU("obj", "o") >= "threshold"):
				"c" = True
	return "Arr"[!"IsEliminated"]
```

### Performance Metric

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_21_56_25_202405062156641.png" alt="image-20240506215622731" style="zoom:33%;" />

如上图，对于 dog category 的每一个 box，我们将其根据 score 从大到小进行排序，然后就可以得到一个 dog boxes sorted by score。

然后，我们根据排序顺逐一进行匹配：

- If it matches some GT boxes with IoU > 0.5, mark it positive
- Otherwise mark it negative

然后，将**当前的 precision-recall ratio** 作图到 P-R 图上。

之后，我们

- 对所有的 category 都这样计算，从而求出 mean average performance (mAP)
- 将 IoU 的 lower bound 从 0.5 逐渐往上调（比如 `[0.5, 0.6, 0.7, 0.8, 0.9, 0.95]` 这样），求出每一个 IoU threshold 对应的 mAP，然后再求平均

---

不难设想，最好的情况就是：分数最高的几张图片，已经将所有的 GT boxes recall 了。然后剩下的就不管了。

## Faster R-CNN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_0_13_24_202405070013728.png" alt="image-20240507001318714" style="zoom: 33%;" />

左图中，我们不去对每一个 proposal 都走完整的一遍流程，而是

1. 将整个图片透过网络前面的若干个纯 CNN 层（这里称为 **backbone**），得到若干个 image features
2. 由于 backbone 为纯 CNN，因此**每一个 input image 的 box 都可以对应一个 image features 的一个 box**
3. 然后，我们就将 image feature 上对应的 box 进行
    1. pooling（细节见下）
        - 从而不论 box 的大小，pooling 之后都是一样大的
    2. 再输入到一个规模比较小的 CNN 里
    3. 最后得到 class 以及 box transformation

这样做的好处就是**通过共用 backbone，大大降低 training 时的计算量**（i.e. 正向计算只用算一次，反向求导也只用求一次，而不是算/求 # of proposals 次）

### Details of Pooling

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_16_42_0_202405071642881.png" alt="image-20240507164156902" style="zoom:20%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_0_25_6_202405070025739.png" alt="image-20240507002502297" style="zoom:20%;" />

左侧是比较粗糙的 pooling，问题在于

1. 由于 snapping，input image 上的绿色框对应到 feature map 上，**无法完全对齐，从而必须要 snap。snap 之后，偏移就更大了。**
2. 将 box coordinates 作为参数，loss 的改变**不是连续的**，而且在非间断处的导数为 0
    - 因为，如左图，微扰 box 的坐标，snap 后的蓝色框区域并不会发生变化

右侧是优化的 pooling，均匀划分 4 个区域，在每一个区域内均匀采样，采样使用双线性插值，最后使用 max pooling。好处在于

1. feature map 上的均匀采样点，在 input image 上也是均匀的
2. 将 box coordinates 作为参数，loss 的改变**是连续的**，而且在非边界处是可微的

## Fast*er* R-CNN

由于 selective search 算法用不了 GPU，因此我们如果需要加速，那么就必须使用神经网络：

RPN (Region Proposal Network) 的主要工作是根据输入的图片，生成一些可能包含物体的区域，每一个区域都会有一个得分，表示这个区域是否真的包含物体的概率。这些区域和得分，就可以作为下一步物体检测的输入。RPN使用了一种叫做锚框（anchor box）的机制，这种机制会在图片的每一个位置上，生成一些预设的大小和形状的窗口，然后对这些窗口进行打分和调整。

RPN的工作流程大概是这样的（如下图所示）：

1. 首先，输入的图片会通过一些卷积层，得到一个特征图（feature map）。
2. 然后，**在特征图的每一个位置上，生成一些预设的锚框**。每一个锚框都有一个中心点和一个大小，中心点就是锚框所在的位置，大小包括宽度和高度。
3. 对每一个锚框，通过一些卷积层，得到一个得分和一个位置调整量。得分表示这个锚框内是否包含物体的概率，位置调整量用来微调锚框的位置，使其更准确地覆盖物体。
4. 最后，根据得分和位置调整量，得到一些可能包含物体的候选区域。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_3_49_15_202405070349641.png" alt="image-20240507034909857" style="zoom: 33%;" />

### Two Stages VS One Stage

基本情况就如图下图所示，可以发现，有两个 stages：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_4_48_54_202405070448539.png" alt="image-20240507044849382" style="zoom: 33%;" />

- 第一个 stage 就是判断 anchors 是否含有 object，以及 transformation
- 第二个 stage 就是判断**第一轮中通过的 anchors** 是否含有 object，以及 transformation
    - 由于第二个 stage 依赖第一个 stage 的判断，因此，含有 object 的 anchors 是会动态发生变化的，实现起来有一定难度



- 当然，实际上，也可以将两个 stage 合二为一：第一个 stage 处理 RPN 的时候，与其判断 "anchor is an object?"，不如判断 "what category does this object belong to?"。
    - 同时，我们需要加上一个 background category，从而模仿 one stage
    - 效果一般来说比 two stages 差一些，但是速度更快
- 同时，我们的 box transforms 可以为 $C \times 4K \times 20 \times 15$，从而每一个类别都有其不同的 box transformation 参数，在实际中更加准确。

### Takeaways

- Two stage method (Faster-CNN) get the best accuracy, but are slower
- Single-stage methods (SSD) are much faster, but don't perform as well
- Bigger backbones (e.g. Resnet instead of MobileNet) improve performance, but are slower

## CornerNet: multi-object detection without anchors

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_17_16_47_202405071716323.png" alt="image-20240507171643885" style="zoom:33%;" />

由于 RPN 需要大量的 anchor，而且 anchor 本身就带有大量的超参数，因此使用起来不方便。因此，我们不妨直接不使用任何的 anchor。

上图中的 CornerNet 的工作原理是：

1. 通过 backbone CNN，对 upper left corner 和 lower right corner 分别生成一个 heatmap 和 embeddings。其中，
    - heatmap 就是**该区域是某个 bounding box 的 upper left/lower right corner** 的可能性
    - embeddings 就是**该区域的 embedding 向量**
2. 我们通过将 heatmap 上高分的 upper left 和 lower left，根据 embedding 的相似程度来匹配，从而无需 anchor 即可得到 bounding box

# Conclusion

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_5_51_46_202405070551700.png" alt="image-20240507055139922" style="zoom:40%;" />
