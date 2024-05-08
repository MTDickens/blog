# Difference Between Seg and Obj Detection

在分割中，我们不需要判断同一个种类的物件有多少个，只需要判断某一个像素属于哪一个种类即可。

## Naive Seg

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_17_47_34_202405071747762.png" alt="image-20240507174645837" style="zoom:33%;" />

如果使用一个 sliding windows，对于每一个 pixel，我们 extract a patch around that pixel，然后放到 CNN 里去分类。

缺点在于：运算量过于巨大。

## Fully CNN Seg 

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_17_47_13_202405071747570.png" alt="image-20240507174710161" style="zoom:33%;" />

如上图，对整张图进行卷积操作（保证每个 feature map 的 HxW 不变），最后得到每个 pixel 上的 category feature。

然后，通过 $\mathop{\arg\max}_c (score_c)$ 来得到 prediction，通过 softmax+多类别交叉熵损失函数来得到损失。

缺点：很多网络都采用 aggressive pooling at beginning，因为对于一张大图片进行卷积是非常 computationally expensive。而 fully CNN 只能够对全图进行卷积。这无疑也是非常慢的。

## Down-Sampling-Then-Up-Sampling CNN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_17_49_54_202405071749503.png" alt="image-20240507174950089" style="zoom: 33%;" />

如图，一目了然。我们的问题就在于：如何进行 up-sampling。

### How to Up-Sample?

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_20_32_59_202405072032727.png" alt="image-20240507180221823" style="zoom: 33%;" />

最简单的方法，就是 bed of nails 或者 nearest neighbor。

如果希望获得均匀的效果，那么就应该使用 bilinear interpolation 或者 bicubic interpolation。

### Choose Which Up-Sampling Method?

如果我们采用 max pooling，那么就最好使用同样地 (misaligned) bed of nails 进行 "max unpooling"

-  其中，nail 的位置和 max pooling 的 arg 位置有关。这是为了避免 misalignment。

如果我们采用的是 average pooling，那么 unpooling 的时候，就用 bilinear/bicubic。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_15_32_29_202405081532870.png" alt="image-20240508153226596" style="zoom:33%;" />

### Transposed Convolution

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_15_50_49_202405081550301.png" alt="image-20240508155042574" style="zoom: 33%;" />

Transposed convolution，又名

- deconvolution
- upconvolution
- fractional strided convolution
- backward convolution

如图，我们使用卷积核 $[x,y,z]$ transpose-convolve $[a,b]$，从而得到 $[ax,ay,az,0,0],[0,0,bx,by,bz] = [ax,ay,az+bx,by,bz]$。

这在计算上，就相当于把卷积的剧本乘法的 $X$ 取了转置（如图）。

# Instance Segmentation

## Concept: Things and Stuff

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_16_32_5_202405081632589.png" alt="image-20240508163201263" style="zoom: 33%;" />

我们一般将事物分为两类，即 thing 以及 stuff。

## Definition

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_16_33_19_202405081633578.png" alt="image-20240508163316535" style="zoom:33%;" />

如图，object detection 只关心 things，而且会区分同类不同个的 things。

Semantic segmentation 关心 things 以及 stuff，但是不去区分 things 以及 stuff。

**Instance segmentation，在 object detection 的基础上，还希望对每一个 thing 都进行 semantic segmentation。**如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_16_36_20_202405081636597.png" alt="image-20240508163617865" style="zoom:33%;" />

## Mask R-CNN

训练也很简单：我们对每一个 proposal 的 box 内的像素取出来，然后使用一个 ***mask*** segmentation 来判断。

注意：

1. instance segmentation 里的 semantic segmentation 只能把其中的 "main thing" 识别出来，比如说上上图的左蓝框里的 "main thing" 是左侧的牛，因此不应该把右侧的牛的像素也包含进去。
2. 此处的 ***mask*** segmentation，相比之前的 semantic segmentation，只需要做二元分类（判断某个像素是否属于该 proposal 的 main object）即可，而不需要进行分类

# Great Idea In CV: R-CNN + "Heads"

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_17_0_36_202405081700174.png" alt="image-20240508170032808" style="zoom:40%;" />

如上图所示：

- keypoint est = obj detection + keypoint prediction
- ...

我们发现，我们可以将复杂的图像处理任务，通过 Faster/Mask R-CNN 进行预处理，然后将每一个 box 内的图像再通过一个 overhead 来进行细化的处理，从而完成我们的任务。

## Example: Dense Captioning

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_17_27_19_202405081727968.png" alt="image-20240508172712090" style="zoom:40%;" />

## Example: 3D shape

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/8_17_29_42_202405081729439.png" alt="image-20240508172936324" style="zoom:40%;" />