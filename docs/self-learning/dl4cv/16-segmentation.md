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

### How to Up-Sampling?

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/7_20_32_59_202405072032727.png" alt="image-20240507180221823" style="zoom:50%;" />