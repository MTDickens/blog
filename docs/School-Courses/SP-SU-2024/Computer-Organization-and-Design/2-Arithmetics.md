# 加法器

## Carry Select Adder

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403121457698.png" alt="image-20240312145713051" style="zoom: 50%;" />

本质上，如果要算加法，只需要前面的进位就可以算。那么，我们就可以

- 超前进位，让进位更快地算出来
- 猜测进位（如上图），直接算两个结果出来，然后根据最后实际的进位来选择

本例中，我们使用了 carry select adder，将二进制数分成若干块，块与块之间的加法可以并行计算，算完之后只需要通过上一个进位来选择即可。

本质上，这就是**空间换时间**。

# 乘法器

## 无符号乘法器

**注：**我们以 64 位乘法为例。

### Naive Multiplier V1

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403121509051.png" alt="img" style="zoom: 33%;" />

如图，由于我们需要对 multiplicand 进行移位（类比：我们列竖式不就要移位嘛），因此需要 128 位储存 multiplicand 和 product，**同时还需要 128 位 ALU**。

### Naive Multiplier V2

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403121511948.png" style="zoom: 33%;" />

如图，我们做了一个小优化：移位是**相对**的。与其移位 multiplicand，不如移位 product。这样，我们就只需要 64 位 multiplicand 了。**更关键地，我们只需要 64 位 ALU 了，速度提升至少一倍。**

### Naive Multiplier V3

进一步，我们发现，右上的 multiplier shift right 和 中间的 product shift right 是**同步进行**的。

因此，我们不妨直接**把 multiplier 放到 product 右边 64 bits 那里**，然后每一次只需要进行一次移位（product）即可，从而进一步节省空间和加速。（如下图，不过注意下图是 32 位，不是 64 位的）

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403121531869.png" alt="image-20240312153135980" style="zoom: 33%;" />

Naive Multiplier V3 的流程如下：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403121533720.png" alt="image-20240312153344474" style="zoom: 50%;" />

## 有符号乘法器

有符号的数字，如果相乘之后扩展其位数（比如，我们对两个 32 位整数进行相乘，然后将结果储存在 64 位整数中），那么，就不可以直接相乘。

- 比如：对于 8-bit * 8-bit -> 16-bit，`11111111 * 11111111 = 1111111000000001 != 0000000000000001`

一个 naive 的想法就是

- 先对其符号进行相乘
- 两数转变成绝对值再相乘
- 最后根据原符号来确定最后的值的正负

不过这样做并不方便，而且比较慢。

### Booth 算法

对于 multiplier，我们以前只关注目前的位（记为 $\newcommand{vc}{v_{cur}}\vc$）

- 如果 $\vc=1$，那么加上 multiplicand
- 如果 $\vc=0$，那么就不做加法

现在，我们关注目前的位**以及之前的位（记作 $\newcommand{vp}{v_{prev}}\vp$）**。并且，规则也有所变化（见下表）

| $(\vc, \vp)$ | operation             |
| ------------ | --------------------- |
| $(0,0)$      | No operation          |
| $(0,1)$      | Subtract multiplicand |
| $(1,0)$      | Add multiplicand      |
| $(1,1)$      | No operation          |

- **注意：**最开始的时候，由于 $\vc$ 之前并没有值，我们约定 $\vp$ 最初为 0。

#### 例子

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240312160441658.png" alt="image-20240312160441658" style="zoom:50%;" />

如图：

- 由于 booth 算法需要记录 $\vc, \vp$（见上图红圈内），因此 product 需要再添加一位，用于记录 $\vp$
    - 另外可见 $\vp$ 最初恒为 0
- 移位的时候，**不要改变符号位**
    - `1110 0010`  -> `1111 0001`, `0110 0010` -> `0011 0001`

### 快速乘法

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403121618273.png" alt="img" style="zoom:50%;" />

如图，64 位数乘 64 位数，相当于 64 位 64 位数相加。