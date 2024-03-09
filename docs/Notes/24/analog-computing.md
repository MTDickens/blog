# 模拟计算的未来

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/GVsUOuSjvcg?si=9CkttbsawJEV0uoB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 模拟计算的历史

通过 RLC 电路，我们可以通过纯电子的方式，模拟物理世界的微分方程（比如洛伦兹吸引子等等）。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403090220091.png" alt="image-20240309022051258" style="zoom:33%;" />

---

在数字计算机中，如果我们要进行 8 比特加法运算，那么就会用掉 50 个晶体管。但是，对于模拟计算机，我们只需要将两个电流相加。

在数字计算机中，如果我们要进行乘法运算，那么就会用掉上千个个晶体管。但是，对于模拟计算机，我们只需要将电流与电阻相乘（得到电压）。

---

1957 年的 Mark I Perceptron，本来要使用 IBM 数字计算机，但是速度太慢，因此改用了自主设计的模拟计算机。

## 模拟计算 VS 数字计算

模拟计算机的优势和劣势如下表所示：

| 劣势                                                         | 优势                               |
| ------------------------------------------------------------ | ---------------------------------- |
| single-purpose<br />(i.e. just used for a narrow range of pure calculation) | 强大（可以进行各种乘法、加法计算） |
| non-repeatable<br />(i.e. same calculation on two analog machines might get different answers) | 速度快                             |
| inexact (i.e. very sensitive to noise)                       | **energy-efficient**               |

## 深度学习

在 2012 年 AlexNet 问世之后，数据驱动、深度学习的强大能力，通过在 ImageNet Competition 取得的惊人成绩，展现在了世人的眼前。因此，之后的趋势就是——网络越来越深、数据越来越多，同时，计算量和能耗也是越来越大。

与此同时，传统（i.e. 数字）计算机

- 受制于 von-Neumann bottleneck
    - 也就是数据在总线上的传输，而非实际的计算，消耗了绝大多数的能量
- 受制于量子效应
- 受制于 Moore 定律的终结

---

好在，深度学习和科学计算、系统运行不一样。

- 它**并不要求 exact 和 repeatable**（反正都是概率\~）。
- 同时，深度学习本质上就是在求矩阵乘法。

因此，对于一个训练好的神经网络，我们使用它实际去做 prediction 的时候，就可以把这个网络的参数**硬编码**在硬件里，然后通过模拟计算的方式，计算矩阵乘法。

具体地，我们将 DRAM 从存储单元变成计算单元，也就是：$I = V * \frac 1 R$。这样，我们只需要输入 $V$，通过硬编码的 $\frac 1 R$，我们就可以得到对应的 $I$。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403090248096.png" alt="image-20240309024813881" style="zoom: 33%;" />

如上图，左侧是电压，下侧是电流。

- 当然，去训练一个深度神经网络，我们还是需要通过 GPU, FPGA 等等。

从而，低功耗、快速、廉价的**边缘 AI** 就成为了可能[^1]。

[^1]: <https://mythic.ai>

<div></div>