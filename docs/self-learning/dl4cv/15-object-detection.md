# Prelude: Tasks in CV

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_6_46_40_202405060646553.png" alt="image-20240506064632136" style="zoom: 33%;" />

# Object Detection

## Challenges

1. 多物体：你不知道有几个物体，因此什么时候结束也无法确定
2. 多类别输出：你不仅要输出 what，还要输出 where
3. 大图片：对于分类而言，图片尺寸只需要在 224x224 即可；但是对于 object detection，需要在 800x600 左右

## Single Object Detection

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/6_7_13_26_202405060713449.png" alt="img" style="zoom: 50%;" />

如上图，我们使用一个**预训练**的网络（往往是在 ImageNet 上训练的），通过微调（预训练模型以及两个 fc layers）进行迁移学习。我们要确保 class scores 和 box coords 都尽量判断正确。

缺点就是：**无法探测一个以上的物体**