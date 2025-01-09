
# Basics & Problems

下面是我们在正式学习 video processing 之前，需要预先了解的知识：

1. Video 可以视作一个 4D dimension tensor: 3 x T x H x W (or T x 3 x H x W)；也可以视作 a sequence of images。
2. 正如 image processing 关注的是 **object**，video processing 关注的是 **action**
    - **action** 可以理解为**随着时间变化的 object**

---

视频处理中，最大的问题就是：视频的体积过于巨大。比如 30fps 的 480p 视频，在一分钟之内就有 $(480 * 640) * (30 * 60) * 3 = 1658880000 \mathrm{~bytes} \approx 1.5 \text{~GB} $

- 如此巨大的视频，还只是输入而已，加上参数，可以想象一般 GPU 的显存已经不够用了

因此，我们的方式就是：

1. Down-sampling for T, H, W: 将分辨率降至 112 x 112，帧数降至 16
2. Use short clips: 只用 short clips

### How to train & test?

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_8_25_55_202405180825299.png" alt="image-20240518082550993" style="zoom: 50%;" />

如图，对于一个时间长、帧数高的 raw video，我们首先将其在

1. 时间上 down-sampling
2. 分割成若干 short clips，并将所有 short clips 加入样本集来进行训练
3. 最后在 testing 的时候，我们取所有 clips 的 prediction 的 average

# A Trivial Method of Classification: Single-Frame CNN

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_19_50_32_202405181950464.png" alt="image-20240518195020991" style="zoom: 50%;" />

如图，可以直接将每一帧作为 2d image 传进去，然后通过 cross entropy 进行训练，通过聚合所有 prediction 取众数进行 testing。

这个方法虽然简单，但是效果一般都还不错，可以作为 a very strong baseline for video classification。

## Improvement: Late-Fusion

一个简单的想法是：与其简单地取众数，不如再来几个全连接层进行训练。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/18_21_0_20_202405182100533.png" alt="image-20240518210018008" style="zoom:50%;" />

同时，这样的模型还可以 **take temporal sturcture into account**。

但是，这样做，会导致全连接层非常巨大，不仅耗费计算资源，而且容易过拟合。因此，我们一般会将 TDH'W' 进行 global average pooling over space and time，将其变成 D 维向量，然后传入 MLP 中，输出 C 维的最终 class score。