# 定位与功能

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_4_55_56_20241103045556.png"/>

功能：

- 差错控制
- 流量控制
- 成帧
	- 因为传输有延迟（一次必须发一堆数据）、以及信道存在噪声（数据量大的时候，更容易接近香农极限），因此需要将数据打包到一起发送，这些打包到一起的数据“一荣俱荣一损俱损”（i.e. 只要 frame 少量数据损坏且无法修复，那么整个 frame 的数据都用不了了）

# 功能介绍

差错控制，详见 Hamming code 和 CRC。

流量控制，详见 [CSDN](https://blog.csdn.net/shulianghan/category_10287524_2.html)。主要就是基础的停止-等待协议和进阶的两个滑动窗口协议。

- 同时，也起到了差错**纠正**的作用。因为纠错码可能只能检错但是无法纠错（e.g. CRC），或者错误位数之多以至于无法纠错，从而就直接通过**重传机制**进行**纠错**。

# 协议：PPP (Point to Point Protocol) over SONET

> [!note] 位置
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_5_30_28_20241103053027.png" />
> 
> **这里**的 PPP 协议位于物理层 SONET 协议之上，位于网络层（IP）之下。

> [!note]+ Features
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_5_43_55_20241103054354.png"/>
> 
> 1. 首先，可以成帧，具有纠错功能，不过
> 	<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_5_28_28_20241103052827.png" width="70%"/>
> 2. 其次，包含链路控制协议（LCP）和网络控制（NCP）协议，用于协商链路层和网络层的参数，避免两者之间不协调。
> 3. 最后，还包含认证功能，从而可以实现运营商的用户认证以及计费服务等等。

> [!note]+ 具体流程
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_5_50_2_20241103055002.png"/>

**缺点**：没有任何地址信息，因此只能用于一对一通信，不能用于多对多通信（i.e. 每一个通信实体需要和其它多个通信实体进行通信）。从而，诞生了 PPPoE (i.e. PPP over Ethernet)。Ethernet 提供了地址功能，而 PPP 提供了各种认证、协商功能，相得益彰。

# MAC (Medium Access Control) layer

有两种网络：
1. **点对点链路**：两个 相邻 节点 , 通过 单一 链路 连接 , 第三方 无法收到任何信息 ;
	- **应用场景**：PPP 协议 , 广域网 ;
2. **广播式链路**：链路上所有主机 共享 通信介质 ;
	- **应用场景**：局域网 ;
	- **拓扑结构**：总线型 , 星型 ;

对于第二种链路，我们就需要使用这样的协议来协调多个通信实体，使得它们之间通信不会冲突。

## 静态分配

根据 M/M/1 排队理论，如果

1. 帧长：$\frac 1 \mu$ bits/frame
2. 信道容量：$C$ bits/second
3. 信息到达速率：$\lambda$ frames/second

那么，每一帧的平均等待时间为：

$$
T = \frac 1 {\mu C - \lambda}
$$

如果我们采用静态分配协议，将信道划分成 $N$ 份，同时每一个信道的信息到达速率只有原来的 $\frac 1 N$。那么，每一帧的平均等待时间就是：

$$
T_N = \frac 1 {\mu(C/N) - \lambda(C/N)} = NT
$$

也就是**等待时间线性增加**。而等待时间增加的原因，其实就是**没用动态分配，使得信道容量浪费严重**。

## 动态分配

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_6_38_46_20241103063845.png"/>

### ALOHA & 分隙 ALOHA

ALOHA 协议，就是随便发送，只不过：**如果两 frames 之间撞了，那么都无效**。

**定义**：帧时为**一帧发送的时间**，也就是帧大小除以信道容量。

假设所有设备发送帧符合泊松分布，并且在一个帧时之内平均发送 $G$ 个帧，那么，任意一个帧在 $T$ 帧时时刻发送的时候，如果不撞，当且仅当 $T - 1 \sim T+1$ 帧时时刻之间没有任何其它帧发送出来。因此，概率就是 $P_0 = e^{-2G}$。

> [!info]+ 碰撞示意
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_7_14_16_20241103071416.png"/>

由于在一个帧时之内平均发送 $G$ 帧，因此，期望速率就是每帧时发送 $P_0 G = G e^{-2G}$ 帧。

---

至于分隙 ALOHA，就是将**发送时间离散化**，规定只能在每个离散时间槽的开始时刻发送。不妨让时间槽大小等于帧时，每台设备有 $p$ 的概率在时间槽开始时发送。**对于台数很多（不妨令台数为 $N$）、$p$ 很小、$G = Np$ 是一个正常数的情况，可以直接近似成泊松分布**。因此，一个时间槽内，有且只有一台发送的概率，就是 $Ge^{-G}$。因此，期望速率就是每帧时发送 $Ge^{-G}$ 帧。

> [!info]+ 指数分布
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_7_14_44_20241103071443.png"/>

### CSMA 协议

- 非持续CSMA
    - 侦听，如果空闲就发送；否则就等待一个随机时间然后重复上一步。
    - **缺点**：由于非持续侦听，因此信道空闲时间内经常无侦听，导致信道利用率低、浪费严重
    - **优点**：由于不太可能同时发送，加上侦听，碰撞概率极低
- 持续式（1-持续式）CSMA
    - 侦听，如果空闲就发送；如果介质忙，**持续侦听，一旦空闲立即发送**；如果发生冲突就等待一个随机分布时间再重复步骤一
    - **缺点**：由于持续侦听，因此信道繁忙的时候，经常会有多个一起侦听，从而在信道空闲瞬间，它们会同时发送信息，从而造成碰撞
    - **优点**：信道一直都有监听，因此利用率高（如果不算碰撞的话）
- p-持续式CSMA
    - 上面步骤一改成：如果空闲，就以p的概率发送，以 $(1-p)$ 的概率延迟一个时间单元发送
    - 在保留 1-persistent CSMA 优点的同时，让碰撞的概率减小


#### CSMA 冲突

先听再发也会发生冲突。

- 原因：同时传送
- 为什么会同时传送？考虑传播延迟时间，那么两者互相感应不到对方。
	    [![image-20221019140938004](https://github.com/CSWellesSun/ZJUCourse/raw/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%AE%A1%E7%BD%91.assets/image-20221019140938004.png)](https://github.com/CSWellesSun/ZJUCourse/blob/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%AE%A1%E7%BD%91.assets/image-20221019140938004.png)
	
	定义冲突窗口：发送站发出帧后能检测到冲突（碰撞）的最长时间
	
	数值上：等于**最远两站传播时间的两倍**，等于RTT（Round Trip Time）
    

#### CSMA/CD (Collision Detection)

- 原理：先听后发、边发边听。发送的时候，如果检测到了冲突，那么就**立即终止发送，并且发送强化信号**。
- [![image-20221019141429903](https://github.com/CSWellesSun/ZJUCourse/raw/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%AE%A1%E7%BD%91.assets/image-20221019141429903.png)](https://github.com/CSWellesSun/ZJUCourse/blob/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%AE%A1%E7%BD%91.assets/image-20221019141429903.png)

### 信道利用率分析

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_7_38_39_20241103073839.png"/>

### 无冲突协议

对于高负荷的情况，我们需要尽量避免冲突，因此宁愿采用含有 overhead 的无冲突协议。

#### Bitmap 协议

假设一共 $N$ 个用户，那么竞争周期就是 $N$ 轮。第 $i$ 轮的时候，第 $i$ 个用户就声明自己是否需要使用。然后，之后，需要使用的用户，就按照从用户 id 大到小的顺序，逐次发送。

#### 改良版 bitmap: Binary Countdown

#### Adaptive Tree Walk

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/4_4_0_32_20241104040032.png"/>
如图，实际上，adaptive tree walk 就是一个深度优先搜索+剪枝的过程。

- 如果一个节点没有任何发送请求，剪枝
- 如果一个节点只有一个发送请求，发送+剪枝
- 如果一个节点有多个发送请求，继续 DFS

另：d在负载比较低的情况下，自然就是从 0 开始；对于负载很高的情况，显然较小的编号是根本不可能的。

### 无线协议: 以 Vanilla MACA 为例

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/4_4_14_32_20241104041431.png"/>

如上图：对于无线设备而言，信号衰减是严重的。因此很可能造成

1. (a): A、C 两个设备都在给 B 发送信息，两个信息在 B 处互相干扰，但是 A、C 互相不知道对方在发送信息
2. (b): B、C 两个设备分别给 A、D 发送信息，按理说其实是互不干扰的，但是 B、C 互相能够感知到对方，因此**误以为**两者互相干扰了

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/4_4_36_37_20241104043636.png"/>

协议很简单：发送者发一个 RTS 请求，然后接受者回复一个 CTS 回复。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/4_4_36_55_20241104043654.png"/>

如果任何设备收到了 CTS 回复，但是自己并没有发出与之对应的 RTS 请求，那么，就说明**自己此时如果发送的话，就会造成干扰，因此应该等待**。

# 802.11 协议栈

- MAC子层协议：由于是无线连接，因此不能用经典的 CSMA/CD。我们采用的是 CSMA/**CA** 协议，vanilla MACA 的变种。

## 帧格式

802.11 MAC帧由帧头（MAC Header）、帧主体（Frame Body）和帧校验（FCS）字段组成，主要依靠帧头中各属性字段的设置来确定帧的类型。802.11 MAC帧格式如[图2-3](https://support.huawei.com/enterprise/zh/doc/EDOC1100033976/35825214#fig_dc_fd_wlan_basic_000502)所示。

**图2-3** 802.11 MAC帧格式 ![img](https://download.huawei.com/mdl/image/download?uuid=bd2517bb129b4d999e9822537c93bf01)

802.11 MAC 最大帧长为2348字节。以下依次说明每个字段的含义：

- 帧控制（Frame Control）字段：
    - Protocol Version：帧使用的MAC版本，目前仅支持一个版本，编号为0。
    - Type/Subtype：标识帧类型，包括数据帧、控制帧和管理帧。
        - 数据帧：负责传输数据报文，包括一种帧主体部分为空的特殊报文（Null帧）。STA可以通过Null帧通知AP自身省电状态的改变。
            - **说明**：802.11支持省电模式，即在业务空闲没有数据传输的情况下STA可以关闭天线来节省电力。
        - 控制帧：协助数据帧的传输，负责无线信道的清空、信道的获取等，还用于接收数据时的确认。常用的控制帧有：
            - ACK：接收端接收报文后，需要回应ACK帧向发送端确认接收到了此报文。
            - 请求发送RTS（Request To Send）/允许发送CTS（Clear To Send）：提供一种用来减少由隐藏节点问题所造成冲突的机制。发送端向接收端发送数据之前先发送RTS帧，接收端收到后回应CTS帧。通过这种机制来清空无线信道，使发送端获得发送数据的媒介控制权。
        - 管理帧：负责对无线网络的管理，包括网络信息通告、加入或退出无线网络，射频管理等。常用的管理帧有：
            - Beacon：信标帧，AP周期性地宣告无线网络的存在以及支持的各类无线参数（例如，SSID、支持的速率和认证类型等）。
            - Association Request/Response：关联请求/应答帧，当STA试图加入到某个无线网络时，STA会向AP发送关联请求帧。AP收到关联请求帧后，会回复应答帧接受或拒绝STA的关联请求。
            - Disassociation：去关联帧，STA可以发送Disassociation帧解除和AP的关联。
            - Authentication Request/Response：认证请求/应答帧，STA和AP进行链路认证时使用，用于无线身份验证。
            - Deauthentication：去认证帧，STA可以发送Deauthentication帧解除和AP的链路认证。
            - Probe Request/Response：探测请求/应答帧，STA或AP都可以发送探测帧来探测周围存在的无线网络，接收到该报文的AP或STA需回应Probe Response，Probe Response帧中基本包含了Beacon帧的所有参数。
    - To DS/From DS：标识帧是否来自和去往一个分布式系统（Distribution System，其实就是指AP）。例如都为1，表示AP到AP之间的帧。
    - More Frag：表示是否有后续分片传送。
    - Retry：表示帧是否重传，用来协助接收端排除重复帧。
    - Pwr Mgmt：表示STA发送完成当前帧序列后将要进入的模式，Active或Sleep。
    - More Data：表示AP向省电状态的STA传送缓存报文。
    - Protected Frame：表示当前帧是否已经被加密。
    - Order：表示帧是否按顺序传输。
- Duration/ID字段：根据填充值的不同，其作用包括：
    - 实现CSMA/CA的网络分配矢量机制，表示STA占用信道的时间，即信道处于忙状态的持续时间。
    - 标识该MAC帧为无竞争周期CFP（Contention-Free Period）内所传送的帧：此时填充值固定为32768时，表示STA一直占用信道，其他STA不能竞争。
    - 在PS-Poll帧（即省电-轮询帧）中，Duration/ID字段表示关联标识符AID（Association ID），用来标识STA所属的BSS。STA的工作模式包括激活模式（Active）和省电模式（Sleep），STA进入省电模式后，AP会缓存到此STA的数据帧。当STA从省电模式切换到激活模式时，STA可以向AP发送PS-Poll帧来获取缓存的数据帧。AP可根据收到的PS-Poll帧中的AID来下发缓存的数据帧给对应的STA。
- Address *n* 字段：表示MAC地址。4个Address位填法不固定，需要和Frame Control字段中的To DS/From DS位结合来确定。例如，帧从一个STA发往AP，与从AP发往STA，4个Address字段的填法是不一样的。Address *n* 字段填写规则如[表2-2](https://support.huawei.com/enterprise/zh/doc/EDOC1100033976/35825214#table_dc_fd_wlan_basic_000501)所示。
    
**表2-2** Address *n* 字段填写规则

| To DS | From DS | Address 1  | Address 2 | Address 3 | Address 4 | 说明                                                                                                                           |
| ----- | ------- | ---------- | --------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 0     | 0       | 目的地址       | 源地址       | BSSID     | 未使用       | 管理帧与控制帧。例如，AP发送的Beacon帧。                                                                                                     |
| 0     | 1       | 目的地址       | BSSID     | 源地址       | 未使用       | 如[图2-4](https://support.huawei.com/enterprise/zh/doc/EDOC1100033976/35825214#fig_dc_fd_wlan_basic_000503)中的(1)，AP1向STA1发送的帧。 |
| 1     | 0       | BSSID      | 源地址       | 目的地址      | 未使用       | 如[图2-4](https://support.huawei.com/enterprise/zh/doc/EDOC1100033976/35825214#fig_dc_fd_wlan_basic_000503)中的(2)，STA2向AP1发送的帧。 |
| 1     | 1       | 目的AP的BSSID | 源AP的BSSID | 目的地址      | 源地址       | 如[图2-4](https://support.huawei.com/enterprise/zh/doc/EDOC1100033976/35825214#fig_dc_fd_wlan_basic_000503)中的(3)，AP1向AP2发送的帧。  |

**图2-4** WLAN网络组网图

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_19_26_53_20241105192652.png"/>

- Sequence Control字段：用来丢弃重复帧和重组分片，包含两个子字段：
    - Fragment Number：用于分片帧；
    - Sequence Number：用于检验重复帧，当设备收到一个802.11 MAC帧，其Sequence Number与之前收到的帧重复，则丢弃该帧。
- QoS Control字段：该字段只存在数据帧中，用来实现基于802.11e标准的WLAN QoS功能。
- Frame Body字段：也称为数据字段，负责传输上层有效载荷（Payload）。在802.11标准中，传输的载荷报文也被称为MSDU（MAC Service Data Unit）。
- 帧校验序列FCS（Frame Check Sequence）字段：用于检查接收帧的完整性。类似于Ethernet中的CRC。
# Ethernet 协议栈

### 经典 Ethernet

- 最高10Mbps
- 物理层协议：曼彻斯特编码
- MAC子层协议：CSMA/CD协议
- 数据 46 byte到 1500 byte
	- 太短 CD 协议失效（原因见下图）且数据利用率低（i.e. 协议字段的数据部分占整个协议字段比例太小）
		- 如果不够 46 bytes，就需要填充 0
	- 太长错误 bit 过多
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/3_7_59_58_20241103075957.png" width="70%"/>
- 协议格式
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/4_5_12_50_20241104051250.png" width="80%"/>
- 冲突重传
	- ![image-20221019151404063](https://github.com/CSWellesSun/ZJUCourse/raw/main/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%AE%A1%E7%BD%91.assets/image-20221019151404063.png)

# 组网

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_9_52_20241105200951.png"/>

如图，对于同构的网络，我们采用下面的方式就可以组网；对于异构的网络（比如 802.11 转 Ethernet），我们只能使用上面的方式（需要进行 frame 格式的转换）。

组网之后，我们可以将小网串联成大网，形成一个范围更大的 LAN。不过，此时也就引入了分布式系统（如下图）。

> [!info]+ 集中式 vs 分布式 LAN
> 
> 如下图：左边是集中式，右边是分布式。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_11_37_20241105201136.png"/>

802.11 的 4 个 address 中，只有地址，而并没有地址对应的具体端口号。因此，我们需要**学习**地址和端口号的对应。

> [!info]+ Learning Bridges
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_13_58_20241105201357.png"/>

如果网络含有 loop 的话，就会出现问题（如上图，假如还有一个 B3 分别和 B1、B2 相连，那么 B1 发送的泛洪数据包，就会 B1 -> B2 -> B3 -> B1 -> B2 -> ... 无穷无尽）。解决方法如下。

> [!info]+ 最小生成树
> 
> 我们需要借用图论中的最小生成树——我们**动态、分布式地在局域网拓扑中生成一个最小生成树**，泛洪发包的时候，我们只能沿着这棵最小生成树的路径发包。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_18_26_20241105201826.png"/>
> 
> 生成方法如下（简单来说，就是 MAC 地址最小的当做根，然后广度优先遍历一下）
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_22_45_20241105202244.png"/>

## VLAN

物理上，我们的网络连在一起；但是，逻辑上，我们物理连在一起的 LAN，可以**分成若干个逻辑上相互独立的 LAN**。这就是 VLAN 技术。也就是，我们可以给每一个 MAC 地址/端口/IP 地址或者其他 layer 3 协议地址进行“染色”，每一种颜色代表属于一个 VLAN。

当然，一个 MAC 地址/端口/IP 地址或者其他 layer 3 协议地址的“颜色”，只有负责管理它的路由器会记录下来。因此，为了让其它路由器也知道，我们需要在 header 中加入“颜色”，也就是 **VLAN identifier**。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_38_36_20241105203835.png"/>

**Note**: 一些老式的 bridge，是不支持 802.1Q 的。因此，其它路由器发送数据包给它的时候，就需要转换（如下图）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_42_43_20241105204243.png"/>

## 广义的各种“交换机”

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_20_43_42_20241105204341.png"/>

如图：不同的 layer 上面，分别有他自己的“交换机”。

**Note**: 所谓“不同” layer 上面，其实际意思是，这个“交换机”可以最多读取到这层 layer 的信息。比如说 application gateway，可以读取 HTTP、SSH 等等包头；至于 router，只能读取 IP 包头，至于 TCP 以及更上层，一概不管；而 switch，只知道 Ethernet 包头，对于 IP 的信息，一概不考虑。

## 冲突域和广播域

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_21_1_26_20241105210125.png"/>

如图：

- 一个冲突域就是**一个会相互干扰的网络的集合**
- 一个广播域就是**一个可以在 data link layer 上面互相 reach 到的一个网络的集合**
	- 因此，router 可以隔开广播域

注意，冲突域不等于广播域，因为如果使用交换机，那么若干条通信可以并行进行。

> [!Example]+ Example
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_21_9_10_20241105210909.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/5_21_9_5_20241105210905.png"/>

