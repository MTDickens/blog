## Outline

- Three transmission media
	- Guided Transmission Media
	- Wireless Transmission (& Using the Spectrum for  
	    Transmission)
	- Communication Satellites
- From Waveforms to Bits
- Three examples
	- The Public Switched Telephone Network
	- Cellular Networks
	- * Cable Networks
	- Comparing Different Access Networks
- Policy at the PHY layer

## Media

### Guided Transmission Media (有限数据传输)

> [!info] Terminology
> 
> 1. 全双工、半双工、单工：全双工就是同一时刻，双向传输；半双工就是同一时刻，单向传输（但是不同时刻可以不同方向）；单工就是永远一个方向（固定死的一个方向）

- Persistent Storage（持久性存储）
	- 比如邮寄硬盘、磁带
- Twisted pair（双绞线）
	- 就是若干条、并行的两根互相缠绕的铜线（用于减少交流电导致的磁场变化），足够轻量
		- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/14_22_10_54_20241014221053.png" width="70%"/>
	- 可以传输几千米，但是更远的话，就需要放大器了
	- 分为 5、6、7 类
		- 五类网线的传输速率为100Mbps；超五类网线的传输速率为1000Mbps
		- 六类网线的传输速率为1000Mbps；超六类网线的传输速率为10Gbps
		- 5、6 类是 unshielded，7 类就是 shielded
- Coaxial cable（同轴电缆）
	- 如下图：保护层数多、结构复杂，但是耗散小、传输距离远
		- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/14_22_15_7_20241014221507.png" width="50%"/>
- Power Lines（电力线）
	- 可以用于智能家居——只要接上电源，就能使用电线，同时传输能量和信号
	- 国内普及较少
- Fiber optics（光纤）
	- 结构如下：
		- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/14_22_42_29_20241014224228.png" width="70%"/>
	- 光纤的传输能力非常强，远高于目前计算机的处理能力（i.e. 光电信号转换需要计算机处理）
		- 因此，传输信息的时候，往往不压缩，直接传（和蓝牙、WiFi 这种小带宽的不一样），从而节省算力
	- 光学传输系统由三个部分组成：light source -> transmission system -> detector
	- 光纤原理就是全反射
	- 光纤分为单模（只传输一个频率的光线）和多模（可以传输多个频率的光线）

**总体来说，光纤是长距离传输和大带宽传输的首选。**

### Wireless Transmission

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_0_28_43_20241015002842.png"/>

<center><b>不同通信手段的频段</b></center>

**Note**:

- 传输所用的 frequency band 越宽，数据速率越高
- 大多数传输都采用 narrow frequency band
	- 如果需要利用 wide frequency band，就要使用**扩频**技术（如下）

#### 扩频

Some transmission protocols spread its frequency over a wide frequency band:

- Frequency hopping spread spectrum (military, 802.11, Bluetooth)
	- 就是和通信对方进行约定，什么时候使用哪一个信道，使得信道使用一定程度上不可预测，增加安全性
- Direct sequence spread spectrum (3G mobile phones)
	- 就是和通信对方约定一个伪随机码，然后将信息和伪随机码”相乘“（当然可能不是时域上相乘），然后进行传输（在伪随机码的带宽范围上）
	- 可以增加安全性，以及增加容错率（类似于纠错码）
- UWB (Ultra WideBand)
	- 使用很宽的频段，但是每一个频点上功率很低

#### 不同频段的性质

> [!info] 频段名称
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_1_14_59_20241015011459.png"/>

- 对于 VLF, LF, MF，其波动性较强，因此不是直线传输，而是绕着地表传输。
- 对于 HF，就是沿着直线传输，然后经过电离层反射到达目标位置
- 对于频率更高的波，它们会直接穿透电离层，因此只能造基站，然后不借助电离层反射，而是直接在基站之间传播
- 到了红外波这种量级之后，波就几乎无法穿透固体了，从而适用于遥控器等等；同时，红外波和可见光很接近，因此室外（小功率）无法使用
- 到了可见光量级之后，如果是激光传输，那么环境干扰就会造成很大的影响，因此不能在开放环境使用

### 卫星通信

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_1_41_59_202410150141840.png"/>

## From Waveform To Bits

### The Theoretical Basis for Data Communication: Fourier Transformation

（略）
### The Max. Data Rate of a Channel

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_3_16_7_20241015031606.png"/>


<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_3_21_38_20241015032137.png"/>

由于总功率=信号功率+噪声功率，因此：

$$
P = S + N \iff V_{tot}^2 = V_S^2 + V_N^2
$$

直观上：我们必须保证每一个符号的电平，高于噪声的电平。因此：

$$
V = \frac {V_{tot}} {V_N} = \sqrt {\frac P N} = \sqrt {1 + \frac S N}
$$

套用 Nyquist 即可得到结果。

### Digital Modulation 

- **基带传输**：频率从 0 到最大值之间
- **通带传输**：频率在某个特定值附近
### Multiplexing

分为：

- 频分复用
	- 最先进的技术就是 OFDM (Orthogonal Frequency Division Multiplexing)
	- 简单来说，就是不再分成若干不相交的波段（而且波段之间还要有 guard band，又是一个 overhead），而是使用巧妙的数学方法，使得不同载波之间的频域可以重叠，但是不互相影响
		- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_4_2_56_20241015040255.png" width="80%"/>
- 时分复用
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_4_5_12_20241015040512.png"/>
- 码分复用
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_4_12_15_20241015041214.png"/>
	- 简单来说，就是
		- 每一个 station 分配一个专属的 code（下称为 X）
			- 这个 code 与其它 station 都 orthogonal
		- 如果该 station 逻辑上要发送 1，那么物理上就发送 X；如果逻辑上要发送 0，那么物理上发送 -X
		- 然后，所有 station 发送的 code，在线路中是 additive 的
		- 从而，解码的时候，如果要解码 code 为 X 的基站，那么把线路中的信号乘以 X，再除以 X 的长度即可
			- 也就是 $(-X_1 + X_2 - X_3) * X_1 / 8 = -(X_1 * X_1) / 8 = -1$
		- 图例
			- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/15_4_16_17_20241015041616.png" width="80%"/>

## Three Examples

### The Public Switched Telephone Network

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/16_20_31_25_20241016203124.png"/>

我对信号进行采样，不只是对电压信息进行采样，还同时包括相位信息（通过解调可以得到）。上图中，相位信息就是幅角。

### SONET

SONET 规范了电缆、光纤传输的格式和采样频率。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/16_20_14_57_20241016201456.png"/>

### Cellular Network

问题：

1. 首先，一个基站的覆盖范围有限，我们必须使用多个不同的基站
2. 其次，相邻基站之间的信号不应该互相干扰

因此，我们设计下图中的系统，使得基站覆盖区域在平面上密铺，且相邻基站之间频率不同，频率相同的基站之间隔得很远。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/16_20_46_5_20241016204604.png"/>

### Cable Networks

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/16_20_50_29_20241016205029.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/16_20_50_42_20241016205041.png"/>

### Comparing Different Access Networks