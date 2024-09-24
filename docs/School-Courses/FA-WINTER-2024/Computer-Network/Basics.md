# Network Protocols: Services & Protocols

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_19_31_9_20240919193109.png"/>

- Service 就是向上层提供的服务
- Protocol 就是具体的 implementation
- 而 interface（接口），就是上层使用下层的入口

# Seven-Layer (OSI) Model

> [!note]+ 经典例图
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_22_21_32_20240919222130.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_19_36_39_20240919193638.png"/>

**Observation**: 为什么 data link 要分成“帧” (frame)

1. 这样在发送大文件的时候，可以避免信道被阻塞，也可以时分多路复用
2. 做 error correction 的时候，可以每个帧分别添加校验部分
3. ……

## 物理层

（略）

## 数据链路层

This layer is to take a raw transmission facility and transform it into a line that appears free of undetected transmission errors to the network layer. The design issues are:

- **Framing**: how to create and recognize frame boundaries
- **Error detection, recovery**: how to solve the problems caused by damaged, lost, and duplicate frames
- **Flow control**: how to keep a fast transmitter from drowning a slow receiver in data
- **MAC**: how to control access to the shared channel (for broadcast networks).

## 网络层

- 如何路由
- 如何拥塞控制
	- 拥塞控制既可以在
- 如何连接异构的网络（i.e. 地址不同、maximum packet size 不同、协议不同，等等）

## 传输层

将会话层的数据分割成小块，然后交给网络层。

- 向会话层提供哪一些服务
- 如何区分不同连接之间的信息
- 如何流控

## 会话层

- 对话控制
- how to manage token（避免两个实体同时传输信息）
- how to synchronize different sessions（即使回话崩溃，之后也能够恢复）

## 表示层

- 如何 encode data
- 如何有效地转换
- Big endian vs little endian

## 应用层

（略，比如 HTTP, DNS, DHCP, SMTP, ...）

## Reference Models: The TCP/IP reference model

TCP/IP 简化至 4 层：应用、传输、网络、链路。

- 同时，协议的种类，是上下多、中间少。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_21_57_17_20240919215717.png"/>

# TCP/IP vs OSI

## 对比

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_22_19_47_20240919221947.png"/>

## 为什么人们喜欢用 TCP/IP

主要是下面两张图中的红字的原因：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_22_52_11_20240919225210.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_22_52_22_20240919225222.png"/>

## 为什么 TCP/IP 不是万能的

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_22_41_43_20240919224143.png"/>

**一句话**：虽然简单、（大部分情况下）实用，但是不完整。

# 网络标准

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_22_51_26_20240919225126.png"/>

