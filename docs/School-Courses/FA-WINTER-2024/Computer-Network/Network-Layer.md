# 大纲

I. Network Layer Design Issues（网络层设计概述）
II. Routing Algorithm（路由算法）
IL.Internetworking（网络互连）
IV.Software Defined Networking
V. The Network Layer in the Internet
VI.\*Congestion Control Algorithms（拥塞控制算法）
VIL.\*QoS Control Algorithms（服务质量控制算法）

# 网络层设计概述

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/11_22_41_24_20241111224123.png"/>

具体细节略。

# 路由算法

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_0_17_45_20241112001744.png"/>

## 路由的模式（pattern）和技术

- **目的**：根据需求，实现各种路由的模式（红字）。
- **方法**：使用各种技术（蓝字）来进行实现。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_0_44_13_20241112004413.png"/>

## Introduction

### What is a routing algorithm

The routing algorithm is used to decide which output line an incoming packet should be transmitted on

- ﻿﻿For datagram networks, this decision must be **made anew for every arriving data packet** since the best route may have changed since last time.
	- 说人话：**就是每来一个数据包，都会针对它做决定（动态决定）**
- ﻿﻿For virtual-circuit networks, this decision is **made only when a new virtual circuit is being set up**.  
	- Thereafter, **data packets just follow the previously established route**.

由于互联网是 datagram network，因此路由是**动态决定**的。

A router performs two tasks:

- ﻿﻿Forwarding: To forward the incoming packet according to the routing table
- ﻿﻿Routing: To fill in and update the routing table 

### Desirable properties in a routing algorithm

- ﻿﻿Correctness (正确性），simplicity (简单性）：实现简单，且最终能将数据包送到应该送的地方
- ﻿﻿Robustness (健壮性): 如果一个网络的拓扑、网络拥塞程度发生了变化，或者一部分路由器炸了，也不应该使得整个网络所有的路由器都中断/重启，而是应该适应目前的变化并做出调整
- ﻿﻿Stability (稳定性）：在网络变化的时候，路由器能够（分布式地）平滑做出变化，而不是发生剧烈抖动
- ﻿﻿Fairness (公平性），efficiency (高效率）：Conflict between fairness and efficiency
	- <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_1_0_30_20241112010030.png" width="70%"/>
	- 如图，最大的总流量就是 3，但是会造成严重的不公平；在完全公平的情况下，总流量只有 2，但是够公平

### Classification of algorithms

分为两种算法：自适应和非自适应。

自适应算法就是 change their routing decisions according to the current network topology and traffic

非自适应算法就是 use the route computed in advance, i.e. the route is computed either in a centralized or decentralized way, and it will be downloaded to the router before it is even booted.


## 最优化原理

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_1_10_6_20241112011005.png"/>

如图：

1. 最优化原则：就是最优子结构，pass
2. 汇集树：就是所有单源最短路的集合。
	- **注意**：我们可以保证其中不形成环路

至于用什么来充当 metric，可以是网络延时、费用等等。

## Unicast Routing (One to One)
### Distance Vector Routing

使用 Bellman-Ford 算法，算是自适应式算法。这里，distance vector，就是每一个节点保存到其它所有节点的 dist 信息（解释见下）

> [!info]+ Bellman-Ford 算法简介
> 
> 假设一共有 V 个节点，E 条边。初始化 dist(v0) = 0, dist(其它) = inf。
> 
> **定义（松弛操作）**：对边 $e = \langle u, v \rangle$ 进行松弛操作，就是看一看 dist(u) + weight(e) 和 dist(v) 大小相比如何。如果 dist(u) + weight(e) 更小，那么就**更新 dist(v) = dist(u) + weight(e)**
> 
> 我们重复 $V-1$ 轮操作，每一轮操作都对所有边进行一次松弛。
> 
> **正确性证明**：假设没有负权回路，那么任意一个点到另外一个点的所有最短路径中，一定存在一个边数不超过 $V-1$ 的。因此，最短路就是 $v_0 \to v_1 \to v_2 \to ... \to v_n, \text{where } n \leq V-1$.
> 
> 不妨使用归纳法证明：第 $k$ 轮松弛的时候，我们可以得到正确的 dist($v_k$)。
> 
> 首先，第 0 轮迭代的时候，dist($v_0$) = 0，就是正确的。
> 
> 如果第 k 轮迭代的时候，dist($v_k$) 正确。那么，第 $k+1$ 轮迭代的时候，dist($v_{k+1}$) 一定会与 dist($v_k$) + weight($v_k, v_{k+1}$) 进行比较（并替换，如果 dist($v_{k+1}$) 不够短的话），从而 dist($v_{k+1}$) 在 $k+1$ 轮中一定是正确的。


<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_1_56_9_20241112015609.png"/>

Distance Vector Routing，本质上就是分布式 Bellman-Ford。

- 每一个节点，只知道到其邻居的信息（如延迟、费用等）
- 每过一段时间（比如若干毫秒），就将自己维护的 `distTo` 发送给所有邻居（`distTo` 就是 distance vector），同时收到邻居发来的 DV
- 所有节点根据所有邻居发送来的 DV，来更新自己的 distTo。同时更新自己的路由表

#### Drawbacks

对于网络而言，我们希望的是：好事不出门，坏事传千里。因为如果坏事发生（比如一个链路断了），那么就必须紧急取消所有到这条链路的路由；如果好事发生（比如一个链路恢复正常），我们仍然要假以时日，直到链路确认是恢复正常，才会用它。

**可惜，DV routing 中，完全是相反的——好事传千里，坏事不出门**。

**好事传千里**：如果一个链路 $\langle u, v \rangle$ 修复了，那么对于网络中所有节点 $w$：

- 如果 $w$ 到另外一个节点 $x$ 的最短路中，包含了 $\langle u, v \rangle$。根据最优子结构，所有在 $u$ 到 $w$ 之间的节点，其到 $x$ 最短路中也必然包含 $\langle u, v \rangle$。
- 因此，这条“好事”就会顺着这个路径传下去

**坏事不出门**：以 `a -- 1ms -- b -- 1ms -- c` 为例

- 正常情况下，以 a 为源点，最短距离分别是 `b: 1ms, c: 2ms`
- 如果 a, b 之间的链路断了，那么 b 会立即收到这件坏事
	- 然后更新前往 a 的路由表。此时，b 只能走 c 了，因此就是 `b: 3ms, c: 2ms`
- 然后，c 会收到 b 的 DV，从而 c 只能再次更新 `b: 3ms, c: 4ms`
- 然后，b 收到 c 的 DV，再次更新 `b: 5ms, c: 4ms`
- ……

根本原因，是因为 b、c 前往 a 的路由表之间形成了**环路**，因此 gg。

#### Solutions

一个简单的想法是：我们只要检测出来这个环路就行。如果存在这样的环路，那么我们直接破坏它。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_3_9_51_20241112030951.png"/>

实际上，我们只需要一个 3 个节点组成的环，就能让这个无效：

```
a -- 1 ms -- b -- 1 ms -- c -- 1 ms -- d 
             |_________ 1 ms __________|
```

从而造成下面的结果（`x n y` 的意思就是 `x` 到 `a` 的最短路长度为 n，下一跳是 `y`）：

```
b 1 a, c 2 b, d 2 b
b 3 c, c 2 b, d 2 b
b 3 c, c 4 d, d 4 c
b 7 c, c 4 d, d 4 c
b 7 c, c 11 b, d 11 b
b 18 c, c 11 b, d 11 b
b 18 c, c 22 d, d 22 c
b 40 c, c 22 d, d 22 c
b 40 c, c 62 b, d 62 b
...
```

在 3、7、…… 的位置形成的环路。Poison reverse 在 4 -> 5, 8 -> 9 的时候起作用了（i.e. 4 -> 5, 8 -> 9 的时候，c 没有走 d、d 没有走 c，而是都走了 b。因为 4、8 的时候，根据 poison reverse，c、d 互相发送的 DV 的 a 都是无穷大）。**但是，并没有防止 c、d 重新走 b，然后 b 再往上加，c、d 再互相走，然后再走 d，……。**

当然，假设 `b n a, c m b, d m b`，那么传播 4 轮之后，就是：

```
b n a, c m b, d m b
b n+m a, c m b, d m b
b n+m a, c 2m d, d 2m c
b n+3m a, c 2m d, d 2m c
b n+3m a, c n+5m b, d n+5m b
```

$$
\begin{pmatrix}
n_{i+1} \newline
m_{i+1}
\end{pmatrix} = 
\begin{bmatrix}
1 & 3 \newline
1 & 5 \newline
\end{bmatrix}
\begin{pmatrix}
n_{i} \newline
m_{i}
\end{pmatrix}
$$
<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/12_3_36_50_20241112033650.png"/>

因此，这里的数是成**指数级**增长的，很快就会超过最大允许延时（超过这个延时，系统自动标记为链路损坏）。所以其实不是非常麻烦。

### Link State Routing

DV 算法的缺陷：

- 针对**大规模**网络，收敛时间过长
- 针对**动态性强**的网络，由于网络时时都在变化，因此经常还没有收敛就变化了，导致路由一直位于次优解

LS 算法，是基于 Dijkstra 算法，每一个节点可以计算出来源点为自身的、整个网络的单源最短路：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_22_34_37_20241115223436.png"/>

#### Step 1

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_22_41_9_20241115224108.png"/>

就是简单的 hello packet 一来一回。

不过，对于 broadcast LAN 的情况，就会复杂很多：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/15_22_44_34_20241115224433.png"/>

上图中的所有节点都连接在黄色的总线上。逻辑上，它们两两都是相连的，因此有着 quadratic edges。假如它们都要向 neighbor 发送数据包并且收到回复的话，那么网络的拓扑就会过于复杂。

#### Step 2

如果 metric 是 latency 的话，那么就测一下 RTT，再除以 2 即可。

#### Step 3

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_0_48_11_202411160048235.png"/>

构建这样的 LS Packet。注意这些 packets 里面也包含了

- sequence number (出生日期)
- age (年龄)

这两个信息。

#### Step 4

如何传播这些信息？一般而言，为了传播给全网，我们需要采用 flooding 的方法。

同时，为了

- 避免广播风暴
	- 对应 "else (duplicate), discard"
- 避免使用更老的信息
	- 对应 "if seq number is lower than highest one seen so far, reject as obsolete"
- 避免使用太旧的信息
	- "if age hits 0, discard the information"

我们就使用下图中的机制：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_1_1_32_20241116010131.png"/>

实际中，对于每一个 router，我们都有一个数据结构，用来记录：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_1_8_27_20241116010827.png"/>

**Note**: 后面的 send flags 和 ack flags，就是对于这个数据包，我需要向哪一些路由器

- 转发数据包
	- 需要将这个数据包转发给这些路由器给 A 和 C
- 回复 ACK
	- 因为这个数据包本身就是从 A 发过来的，因此要回复 ACK

### Comparison Between LS and DV

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_2_11_38_20241116021138.png"/>

- DV 中，所有节点只知道相邻节点到所有节点最短距离
- LS 中，所有节点都知道整张图

### Hierarchical Routing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_2_16_13_20241116021613.png"/>

tldr：假设 multiple-level routing 分为 region1 -> region2 -> region3 -> ... -> regionk -> routers，那么，每一个 router 必须知道：

- 到同属于同一个 regionk 的所有 routers 的（下一跳）路由
- 以及对于 j = 1, 2, ..., k-1，所有和自己 regionj 不同的其它 regionj

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_2_27_37_20241116022737.png" width="70%"/>

> [!info]+ 最优应该分几层
> 
> 假设分为 $k$ 层，第 $j$ 层有 $r_j$ 个 $r_1 r_2 \dots r_k = N$，那么每个路由器需要的路由表 entries 数量就是 $r_1 + r_2 + \dots + r_k - (k-1)$。
> 
> $$
> L(r_{1 \sim k}, \lambda) = r_1 + r_2 + \dots + r_k - (k-1) - \lambda (r_1 r_2 \dots r_k - N)
> $$
> 
> 从而对任何进行偏导：
> 
> $$
> \frac {\partial L} {\partial r_j} = 1 - \lambda r_1 r_2 \dots r_{j-1} r_{j+1}  \dots r_k = 1 - \lambda \frac N {r_j} = 0 \iff r_j = \lambda N
> $$
>  从而：
> 
> $$
> \lambda^k N^k = N \iff \lambda = N^{\frac 1 k - 1} \implies r_j = N^{\frac 1 k} \implies r_1 + r_2 + \dots + r_k - (k-1) = kN^{\frac 1 k} - (k-1)
> $$
> 
> 从而：
> 
> $$
> \frac {\partial kN^{\frac 1 k} - (k-1)} {\partial k} = \frac {N^{(\frac 1 k)} (k - \ln(N))} k - 1 \approx \frac {N^{(\frac 1 k)} (k - \ln N)} k
> $$
> 
> 因此，最好用 $\ln N$ 层，每个路由器有 $\ln(N) N^{\frac 1 {\ln N}} - (\ln N - 1) = (e-1) \ln N + 1$ 个表项。每层有 $e$ 个不同的 regions。

## Broadcasting Routing (One to All)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_2_51_40_20241116025139.png"/>
### Flooding

采用泛洪的方式：对于进入的任意数据包，发送给（除了发进来的地址之外的）所有地址。

泛洪的方法，首先可能造成广播风暴，所以要加上一个类似于 TTL 的字段；其次会占用大量带宽，因此多用于

- 不计成本、对可靠性要求极高的领域，比如军事
- 非常不可靠的链路，比如 DTN (Delay-Tolerant Network)

### Sink-Tree Based Broadcast

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_3_5_22_20241116030521.png"/>

如果对于任何 `src`，任何节点都知道自己出现 `src` 节点的 sink tree 中的两条边是什么，那么就可以这样发包。

显然，这样发包是最优的（i.e. 时间最短、发包数最少）。

**问题**：对于 DV 协议而言，节点并不知道全局的状态，也就是说，并不知道 `src` 的 sink tree 在自己上面的边有几条、是哪几个？

### Reverse path forwarding

对于 DV 协议而言，我们不知道 `src` 的 sink tree 在自己上面的边有几条、是哪几个？我们**只知道，自己到 `src` 的最短路的下一跳是哪个**。

- 也就是说，假如包的流向就是 `src` 的 sink tree，那么包应该通过谁发给我

因此，如果 `src` 的包从应该进的地方进来了，那么我就转发；否则就丢弃。这样做，可以防止包引发广播风暴。

具体的，伪代码如下：

```python
# packet p arrives
# and also 
	# let `prev` be the node that send p here
	# let lines be all lines connected to nearby nodes
should_come_from_this = dv[p.src].next

if prev == should_come_from_this:
	for line in lines:
		if line != prev: send(p, line)
else:
	# discard p
```

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_3_21_48_20241116032147.png"/>

> [!info] 如何计算 how many transmissions？
> 
> 对于每一个数据包，每一个节点（除了 source 以外）都会进行一轮转发（i.e. 当这个包从 `should_come_from_this` 进来）。因此，除了 `src` 发送以外，其它每一个节点，都会 transmit **其度数减一**次。
> 
> 由于节点度数之和等于 $2|E|$，因此，除了 `src` 以外的所有节点度数之和就是 $2|E| - \deg_{graph} (\text{src})$。
> 
> 因此，除了 `src` 以外的所有节点的 transmit 次数共为 $2|E| - \deg_{graph} (\text{src}) - |V| + 1$。
> 
> 因此，所有节点的 transmit 次数共为 $2|E| - \deg_{graph} (\text{src}) + \deg_{\text{sink tree of src}} (\text{src}) - |V| + 1$。
> 
> - 注意：source 是知道自己的 sink tree 的下一跳该是什么的。因此知道自己该把 packet 发给哪些节点。也就是说，不用向其它节点一样直接全部广播出去。

图中，$I$ 的边数为 4，$|E| = 19, |V| = 15$，因此，除了 `src` 以外的所有节点的 transmit 次数共为 $38 - 4 - 15 + 1 = 20$。

又由于 I 的 sink tree 在 I 处的度数为 4（注意：sink tree 的度数不要和节点度数搞混！），因此总共有 $24$ 次 transmission。

## Multicast (One to Many)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_4_23_51_20241116042350.png"/>

其实和广播类似。不过，不再有 sink tree——我们需要剪枝，把不在 *source 到 each member of the group 的若干条最短路*的边删掉。

> [!example]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_4_25_46_20241116042545.png"/>

对于组播而言，如果采用 reverse path forwarding，就会（相对）过于 expensive，尤其是当这个组很小的时候。

因此，我们会在网络中选择一个 core，然后预建出 core 的 sink tree。之后，我们所有网络 packet 都沿着这个 tree 来移动。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_4_35_28_20241116043528.png"/>

## Anycast (One to NEAREST One)

Anycast 就是**播到离你最近的节点**。

如何实现呢？任播相当于，若干个处于不同位置的主机，**都有共同的名字**。然后，其余的算法，就和 unicast routing 一样。

## Ad Hoc Network

对于拓扑结构瞬息万变的（无线组网的）网络，我们采用下面的方法：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_7_27_27_20241116072726.png"/>

# Internetworking (网络互联)

## How are Networks Connected

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_8_28_1_20241116082800.png"/>

## Tunneling

以 6to4 为例：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_8_29_15_20241116082914.png"/>

**Note**: 隧道机制和上面的包转换机制最大的区别就是，隧道不更改原有的包头，而是外面再增加一个包头；包转换则是直接修改包头。

## Internetwork Routing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_8_34_15_20241116083415.png"/>

## Fragmentation

为了传输一个大数据包，我们必须采用分片的形式：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_8_41_24_20241116084124.png"/>

如图：上面 a, b, c 就是三种对同一个 packet 的不同分片形式。它们都是 valid 的，接收端都可以重组出原来的 packet。

> [!warning]+ IP 分片大小限制
> 
> IP 头格式如下：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/26_21_54_5_20241226215405.png"/>
> 
> 其中，分片偏移**字段**有 13 bits，但是实际的分片偏移需要将这一字段左移三位，也就是乘以 8。
> 
> 所以**除了最后一片以外**，其它片的数据部分大小都必须是 8 bytes 的倍数。

### MTU

不同的路由器，不同 MTU 大小。Basically，MTU 就是**某个路由器**最大允许转发的包长。如果 packet 大小大于 MTU，要么路由器会将其分段，要么就直接丢弃。
### Path MTU Discovery

如果我们希望传输尽量大的数据包，**但是事先不知道链路上 MTU bottleneck 的大小**，那么可以采用下面的方法：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_8_50_33_20241116085032.png"/>

**Note**: 这里，我们不用 binary search，因为

- MTU values tend to cluster around fairly limited numbers of media MTUs 
- Each probe that is silently discarded incurs two fivesecond timeouts (by default) 
- Cheaper to send a packet that gets ICMP feedback than one that does not 
- Use a table of MTU values to guide the search

## 软件定义网络

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_8_56_1_20241116085601.png"/>

路由器分为控制平面和数据平面。前者**负责（通过 DV 等信息）构建路由表等**，后者**负责通过路由表进行转发等**。

传统路由器，就是两个简单的模块，而且两个模块支持的协议，都是定死的（固件都是烧死的），非常不灵活。

SDN 并不是对路由器进行修改，而是在路由器之外，加上一个集中控制器。从而，路由器就仅仅作为数据平面使用。而这个可编程的集中控制器，就是支持复杂规则、任意协议的**控制平面**。

### SDN vs Traditional Router

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_10_45_20241116091044.png" width="60%"/> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_11_7_20241116091107.png" width="60%"/>

 第一张图就是传统的 router 架构，第二张图就是 SDN。
 
 - **注意**：我们这里说的是 logical centralized controller，其物理实现可以是分布式的

**SDN 为什么（在逻辑上）要中心化？**

1. 集中控制，避免每个路由器自己出问题（i.e. 集中控制出了问题好排查），同时避免需要在每个路由器上都安装一遍
2. 集中控制，从而控制平面可以获得全局信息

### Some Examples: Flow-based Forwarding

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_20_19_20241116092018.png"/>

Example 1: Ad-hoc rules

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_20_52_20241116092052.png"/>

Example 2: Load balancing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_21_4_20241116092104.png"/>

Example 3: Source/Previous\-hop-based forwarding

### Conclusion

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_28_30_20241116092829.png"/>

Takeaways:

- 更复杂、细粒度的路由控制
- 分离数据平面和控制平面
- 使用软件来控制
- 可编程

### SDN 结构

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_9_59_8_20241116095908.png"/>

分为三层，

- 最上层对接人类，用于人类传递 high-level command
	- **流量工程**（Traffic Engineering）：优化流量路径，提高网络利用率
	- **安全管理**：防火墙、入侵检测和预防等功能
	- **负载均衡**：动态分配流量到不同服务器或路径
	- **服务质量 (QoS)**：定义带宽、延迟等策略
- 中层是 SDN 的“大脑”，负责全局网络视图的管理、路由决策和策略分发。它通过南向接口与底层网络设备通信
	- **全局网络视图**：基于底层设备的状态信息构建网络拓扑
	- **路径计算**：根据应用层需求和网络状态动态生成路由规则
	- **策略管理**：将应用层的需求翻译为设备级别的流表规则
	- **设备管理**：监控底层设备状态，处理故障和性能问题
- 低层就是支持 SDN 接口的路由器
	- **全局网络视图**：基于底层设备的状态信息构建网络拓扑
	- **路径计算**：根据应用层需求和网络状态动态生成路由规则
	- **策略管理**：将应用层的需求翻译为设备级别的流表规则
	- **设备管理**：监控底层设备状态，处理故障和性能问题


其中，低层如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/16_10_6_43_20241116100642.png"/>

中层如下所示（此处是“使用 Dijkstra 算法，SDN 负责计算路由，最底层的路由器发生异常，并把情况告知上层，上层需要重新计算路由表并发放给路由器”的情况）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_1_14_3_20241122011402.png" width="70%"/><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_1_22_37_20241122012236.png"  width="70%"/>


### 流表

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_0_51_54_20241122005154.png"/>

低层使用流表 来储存基础规则。流表由中层计算并安装到低层。中低层之间的流表可以采用 Openflow 等协议来传输。流表中的规则很简单，因此适用于路由器这种大吞吐量的情况。

> [!info]+ 流表的字段
> 
> 流表可以
> 
> 1. 匹配下图中的字段
> 2. 对数据包进行很多操作（转发、修改、丢弃、封装）
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_0_52_10_20241122005210.png"/>

> [!example]+ 
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_1_2_7_20241122010207.png"/>

# The Network Layer in the Internet

> [!info]+ 网络层协议十诫
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_1_41_51_20241122014151.png"/>
> 
> 其中，第 8 点就是一句话：do for the best and prepare for the worst

## 自治系统

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_1_49_44_20241122014943.png"/>

- 每个自治系统都是一个相对独立的实体，任何其它人无权干涉一个自治系统内的配置
- 而且，网络本身就是异构的（主干网上的跨洋光缆以及最后一公里的同轴线缆）

## IPV4 字段

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_1_54_43_20241122015443.png"/>

1. Version: v4 or v6?
2. IHL: How long the ***header*** is, **in (4-byte) word**?
	- IHL 可以在 5\~15 之间，说明 header 大小可以是 20 \~ 60 bytes 之间
3. Differentiated service:
	- **Type of service (past)**: 3 for priority, 3 for Delay, Throughput, and Reliability, and 2 unused.
	- **Differentiated services (now)**: 6 for service class, 2 for congestion (e.g. ECN).
4. Identification: 由于数据包可能会分片，因此需要用 identification 来将**本来同一个数据包但是在不同分片中的**组装起来
5. DF: Don't fragment, 0 if you don't want the packet to be fragmented, 1 if you don't care
6. MF: More fragment, 0 if this packet is the **last fragment**, 1 otherwise
7. Fragment offset: 就是**该 fragment 的起始位在原始 packet 中的 offset**，单位为 **8-bytes**（也就是说，如果有 fragmentation 的话，除了最后一个 fragment 以外，其它都必须是 8 bytes）
	- e.g. 如果一个数据包的 payload 为 800 bytes，之后均匀分成两个 fragments
		- 那么 total length 都是 800，但是第一个的 offset 就是 0，第二个就是 (800 / 2) / 8 = 50
	- 由于 fragment offset 一共有 13 位，而两个 fragment 之间的 offset 至少相差 1，因此数据包至多可以分为 8192 个
	- **Obs**: Total length 最多为 65536 bytes。如果均匀分为 8192 个 fragments，那么每一个正好 8 bytes
8. **TTL**: 每经过路由器转发一次，TTL 就减一
9. Protocol: 传输层协议
10. Options: <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_2_48_50_20241122024850.png"/>


## CIDR

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_3_33_8_20241122033307.png"/>

这是在 CIDR (Classless Inter-Domain Routing) 出现之前的网络划分方法。显然，这种划分方法过于粗糙（比如 ZJU 有 6 万多人，每人分配一个 ip 地址，外加冗余，那么 65536 就不够，但是 16777216 又太多了。

因此，我们引入 CIDR 来划分（就是形如 `1.1.1.0/24` 这样的，`x.y.z.w/s`，`s` 代表块的大小）。这样划分更加细粒度。

- 当然，只是取消了这种“大字母”的粗糙分配方式而已。特殊 IP（比如 D、E 类）目前仍然是特殊 IP

### 特殊 IP 地址

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_3_40_46_20241122034046.png"/>

因此，可用的主机号 = 主机号 - 2

## NAT

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_3_56_16_20241122035615.png"/>

NAT **内部**地址一般是上图三者之一。

具体转换流程也很简单，请见 [yanfukun](https://yanfukun.com/read/deep-tcpip/nat)。

### NAT 分类

设想一下，

- 你的 PC 的 ip\:port 是 10.10.10.10:12345
- 服务器的 ip\:port 是 8.8.8.8:80
- NAT 网关的公网 ip 是 6.6.6.6

当你主动和 `8.8.8.8:80` 建立连接的时候，NAT 网关就会建立一个映射。不妨令这个映射的端口是 `23456`：`10.10.10.10:12345 <-- NAT --> 6.6.6.6:23456`

从而，目前的链路情况就是 `10.10.10.10:12345 <-- NAT --> 6.6.6.6:23456 <----> 8.8.8.8:80`。

---

接下来，你希望去访问 `1.1.1.1:80`。

- 如果 NAT 网关收到你的请求之后，**复用了之前的 23456 端口**，那么就是**锥型 NAT**
- 如果 NAT 网关收到你的请求之后，**因为这个新的连接，因此就分配一个新的端口 (比如 34567)**，那么就是**对称型 NAT**

---

接下来，`1.1.1.1:80` 希望通过 `6.6.6.6:23456` 来访问你。

- 如果**拒绝访问**，就是**对称型 NAT**
- 如果**无条件转发给你**，就是**全锥型 NAT**
- 如果**仅当你之前访问过 1.1.1.1，才转发给你**，就是**受限锥型 NAT**
- 如果**仅当你之前访问过 1.1.1.1\:80，才转发给你**，就是**端口受限锥型 NAT**

---

不难发现，论安全性：对称型 > 端口受限锥型 > 受限锥型 > 全锥型

## IPV6 字段

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_4_37_15_20241122043715.png"/>

- Diff. Serv: 和 ipv4 的一样
- Flow label: 类似于 ipv4 的 identification
- Next header: 如果存在的话，下一个字段（其实就是 optional 字段）在哪里
- Hop limit: 就是 TTL

> [!info]+ 一些和 ipv4 的不同
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_4_42_2_20241122044201.png"/>

### headers

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_4_45_10_20241122044510.png"/>

IPV6 的 optional header 如上图所示。如果你需要其中几个，应该通过 IPV6 本身的 next header 以及这些 header 中的 next header 字段，来将这些 headers **以类似于链表的方式**串在一起。

> [!example]- 几个 headers
> 
> Hop-by-hop 专用于大 datagram（i.e. 大小大于 65536 bytes 的 datagram）的传送。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_4_47_17_20241122044716.png"/>
> 
> Routing header 和 ipv4 的类似
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_4_48_28_20241122044828.png"/>

## ICMP: 控制平面协议

IPV4 和 IPV6 都是用来传输数据的**数据平面协议**，而 ICMP 是用来检测连通性等等的**控制平面协议**。

对于 IPV4 而言，ICMP 协议前 160 bits（i.e. 20 bytes）就是 IPV4 的头部，后面的如下表所示：

| Bits    | 160-167        | 168-175 | 176-183       | 184-191 |
| ------- | -------------- | ------- | ------------- | ------- |
| **160** | Type           | Code    | 校验码（checksum） |         |
| **192** | Rest of Header |         |               |         |

Type 以及 code 两者相组合，就决定了这个 ICMP packet 的语义。具体语义见 [Wikipedia](https://zh.wikipedia.org/wiki/%E4%BA%92%E8%81%94%E7%BD%91%E6%8E%A7%E5%88%B6%E6%B6%88%E6%81%AF%E5%8D%8F%E8%AE%AE#%E6%8A%A5%E6%96%87%E7%B1%BB%E5%9E%8B)

## ARP 协议

> [!info] tl;dr
> 
> 很简单，如果你希望找到 IP 地址对应的 MAC 地址，那么就通过将 ARP 协议在局域网上广播即可找到

## DHCP 协议

> [!question]
> 
> Wikipedia 上面写的貌似是应用层？因为会用到 UDP

其实就是 MAC -> IP，正好反过来。功能就是请求 DHCP 服务器给我这个 MAC 地址分配一个 IP。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_5_12_50_20241122051250.png"/>

## MPLS

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_5_17_15_20241122051714.png"/>

类似于在路由器上，建立了一个类似于 circuit switching 的东西。也就是说，我们可以保证数据包通过某条线路。

## BGP

更详细的内容可以参考 [cnblogs](https://www.cnblogs.com/linfangnan/p/13036026.html#bgp-%E5%8D%8F%E8%AE%AE)

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_5_40_53_20241122054052.png"/>

### BGP 广播信息

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_6_12_28_20241122061227.png"/>

如图，BGP 协议包有三个重要组成部分：

1. prefix
2. AS-path
	-   作用就是 keep track of the path，只不过这一次 path 的基本组成单位是 ASN
3. nextHop

就是告诉收到该 BGP 协议的路由器：如果你想访问 prefix，只需要跳到 nextHop。这样就能依次通过 AS-path 上的路径访问到 prefix 了。
### 例子

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_5_40_17_20241122054016.png"/>

如图：

1. AS4 向 AS1 购买了 transit
	- 这样一来，AS1 就有义务对自己所有的邻居广播 `(C, AS4, 1-4)`，同时，有义务将自己得知的所有 BGP 信息的广播给 AS4
2. AS3 和 AS4 互相为 peer
	- 这样一来，AS3/4 之间就要互相广播 `(B, AS3, 3-4)`, `(C, AS4, 3-4)`
	- 但是，AS3 **不会**把 `(C, AS4, 3-4)` 广播给 AS1 或者 AS4，因为 AS3 只希望源于自己的流量经过自己
3. ……

从而，

1. 如果 A 希望和 C 进行通信，由于 AS2 只收到了 `(C, [AS1, AS4], 1-2)`，因此别无选择，只能把路由发给 `1-2` 这个边界路由器
2. 如果 B 希望和 C 进行通信，由于 AS3 收到了 `(C, AS4, 3-4)` 以及 `(C, [AS1, AS4], 1-3)` 两个 BGP 包，因此就要进行一番选择（见下文）

### BGP Route Selection

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_6_34_53_20241122063453.png"/>

B 希望和 C 进行通信，由于 AS3 收到了 `(C, AS4, 3-4)` 以及 `(C, [AS1, AS4], 1-3)` 两个 BGP 包，我们就要进行选择：

1. 一般而言，还是 prefer peering to transit 的吧，所以选发送到 `3-4`
2. 显然要发送到 `3-4`
3. 只能说两者（i.e. `1-3` 和 `3-4` 边界路由器）孰近孰远，我就不得而知了 : (
4. 不知道了 : (

我们可以感受到：

1. 只有边界路由器对“外部世界”有直接的感知，内部世界对外部的所有感知，都源于
	- 边界路由器通过 BGP 数据包，构建出来的的路由表
	- 然后，边界路由器，通过任何一种 intra-AS routing 的协议（比如 RIP、OSPF），将自己的路由表信息，传给了内部世界的所有路由器
	- 因此，elimination rule，都是**通过边界路由器，按照不同的 elimination rule，构建不同的路由表**实现的
		- 比如说，hot potato，只需要将所有 BGP 包中可达的， cost 一律设置成 0
		- 比如说，shortest AS-PATH，也许可以将 cost 设置成正比于 AS-PATH length 的值（而且要是大值）来实现
2. 在**逻辑上**，只有边界路由器之间会直接传递 BGP 信息
	- 如果同属一个 ASN，就是 iBGP（协议双方在物理上不要求直接相连）
	- 否则就是 eBGP
3. BGP 包在边界处传送的时候，nextHop 和 AS-Path 就会有改动

### 对比：Infra-AS vs Inter-AS Routing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/22_6_55_23_20241122065523.png"/>

# 拥塞控制

传输层的拥塞控制（i.e. TCP）是最有名的，但是如果配合上网络层，效果更好。

> [!info]+ 拥塞控制 (congestion control) vs 流量控制 (flow control)
> 
> 前者是子网、全局的概念：比如，子网中有 1000 台主机，每一台主机有一根 10 Mbps 的线连到网关。现在，其中 500 台主机，每一台都希望发一个 100 kbits 的数据包到另外 500 台主机。
> 
> 后者是 end-to-end、局部的概念：比如，一个网络中，一台主机网卡有处理 1Gbps 流量的能力，而另一台只有处理 100 Mbps 的能力，然后，两者之间连的网线是 200 Mbps。
> 
> 两者共同点是：都是为了让 sender 停下来，要么是因为 receiver 处理能力不够，要么是因为带宽不够（i.e. sender 的 waiting queue 越积越长）

## Approaches

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/12_1_48_46_20241212014846.png"/>

- 其中：**准入控制**可以用 token bucket
	- 每隔一段时间，往 bucket 里面放入一个 token，直到上限
	- 同时，如果来了一个数据包，数据包大小不大于 token 数量，就减去 token，并且发送该数据包
	- 如果数据包大小大于 token 数量，就丢弃数据包

