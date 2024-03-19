[TOC]

# Deep Learning Hardware

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403200115598.png" alt="image-20240320011502840" style="zoom:33%;" />

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403200115847.png" alt="image-20240320011518870" style="zoom:33%;" />

CPU vs GPU

- The **individual core** of CPU is much faster, more powerful (i.e. better branch prediction, caching strategy) and more versatile than that of GPU (shown at the first graph)
- GPU have relatively "stupid" cores compared to CPUs, but it has a LOT of cores.

## Inside a GPU: Titan

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403200137111.png" alt="image-20240320013715535" style="zoom: 33%;" />

如上，

- 每一个 GPU 里，有 72 个 streaming multiprocessors (SMs)
- 每一个 SM 里，有 64 个 FP32 cores
- 每一个 FP32 Core，在一个 cycle 之内可以同时做乘法和加法，因此记作两次
- 同时，每一个 FP32 Core 的时钟频率为 1.77 Gcycle/sec

因此，虽然每一个 FP32 Core 很慢（性能只有 CPU 单核的百分之一不到），但是整体上是很快的。

### Tensor core

另外，GPU 为了深度学习，还专门增添了 tensor core：在一个周期内，可以做到计算 $AB+C$。这需要 

$$
FLOPS(A*B) + FLOPS(+C) = [(4 + 4 - 1)  * 4 * 4] + [4 * 4] = 128
$$
次浮点运算。

因此，如果考虑张量运算，就有：72 SM &times; 8 tensor cores per SM &times; 128 FLOPscycle &times; 1.77 Gcycle/sec &approx; 130.5 TFLOP

**从而，GPU 的性能在矩阵乘法方面，比 CPU 强大得多。**

Sidenote: 

- 卷积操作可以转换成矩阵乘法，因此矩阵乘法对卷积操作非常 crucial
- 大矩阵可以视为小矩阵的分块乘法，因此可以用 4 &times; 4 矩阵乘法作为 subroutine
    - 由于块与块之间是独立的，因此非常适合并行计算
    - 如果大矩阵的边长不是 4 的倍数，那么可能就要 padding 等等，浪费性能，所以目前很多模型的矩阵大小都是 4 的倍数（实际上，都是 2 的次方数）

## TPU

谷歌的 TPU 专门用于矩阵计算。在课程拍摄的时候（2019 年），PyTorch 还不支持 TPU，不过在 2024 年，早已经支持了（此处 TPU 被归为 XLA 设备）。

# Deep Learning Software

## Mainstream Learning Frameworks

Today, there are just two: PyTorch and Tensorflow.

## Why do we need frameworks?

1. Allow rapid prototyping of new ideas, i.e. **it provides us with lots of common layers and utilities** 
2. **Auto-grad for us**, i.e. it automatically use the computational graph to auto-grad, and we don't have to write our own code
3. Run it efficiently on GPU/TPU/..., i.e. **we don't have to deal with the very complicated interface of \*PUs**

## PyTorch

### PyTorch: Fundamental Concepts

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403200222616.png" alt="image-20240320022231392" style="zoom:33%;" />