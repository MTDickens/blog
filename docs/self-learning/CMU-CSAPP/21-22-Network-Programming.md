# Lec 21-22: Network Programming

## Linux 哲学：一切皆文件

| 文件类型标识  | 文件类型                     |
| ------------- | ---------------------------- |
| `-`           | 普通文件                     |
| `d`           | 目录文件                     |
| `l`           | 符号链接                     |
| `c`（伪文件） | 字符设备（character device） |
| `b`（伪文件） | 块设备（block device）       |
| `s`（伪文件） | 套接字文件（socket）         |
| `p`（伪文件） | 命名管道文件（pipe）         |

如上图，Linux 的哲学就是，一切皆文件。

其中：

- 字符设备和块设备

  - **字符设备**只能以字节为最小单位访问，而**块设备**以块为单位访问，例如 512 字节，1024 字节等。

  - **块设备可以随机访问**，但是**字符设备不可以**

- 套接字文件

  - 使用套接字（socket）除了可以实现网络间不同主机间的通信外，还可以实现同一主机的不同进程间的通信，且建立的通信是双向的通信。

## I/O 通路硬件实现

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402221639963.png" alt="image-20240222163949477" style="zoom:50%;" />

如图，网络信息通过网络适配器进行解译，并通过 I/O 总线传到 I/O 桥，进而进入内存/CPU。

## Internet Protocol

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402221908698.png" alt="image-20240222190759219" style="zoom: 33%;" />

How is it possible to send bits across incompatible LANs and WANs?

Solution: ***protocol*** software running on each host and router 

- Protocol is a set of rules that governs **how hosts and routers should cooperate** when they transfer data from network to network. 
- Smooths out the differences between the different networks 

#### What does an internet protocol do?

- Provides a *naming scheme*

  - An internet protocol defines a **uniform format for host addresses**

  - Each host (and router) is assigned at least one of these internet addresses that uniquely identifies it


- Provides a *delivery mechanism*

  - An internet protocol defines a **standard transfer unit** (packet)

  - Packet consists of header and payload
    - Header: contains info such as packet size, source and destination addresses
    - Payload: contains data bits sent from source host

## Global IP Internet

- Most famous example of an internet 
- Based on the TCP/IP protocol family
  - IP (Internet Protocol):
    - Provides **basic naming scheme** and **unreliable delivery** capability of packets (datagrams) from **host-to-host**
  - UDP (Unreliable Datagram Protocol):
    - Uses IP to provide **unreliable datagram delivery** from **process-to-process**
  - TCP (Transmission Control Protocol):
    - Uses IP to provide **reliable byte streams** from **process-to-process** over *connections*
- Accessed via a mix of Unix file I/O and functions from the ***sockets interface***

## Internet Connections

- Clients and servers communicate by sending streams of bytes over *connections*. 
Each connection is:
- *Point-to-point*: **connects a pair of *processes***. 
- *Full-duplex*: **data can flow in both directions at the same time**, 
- *Reliable*: stream of bytes sent by the source is eventually **received by the destination in the same order it was sent**. 
  - **Note:** A connection must be RELIABLE (e.g. socket via TCP), otherwise it's not a connection (e.g. socket via UDP, ICMP, etc).
- A *socket* is an **endpoint of a connection** 
- Socket address is an `IPaddress:port` pair 
- A *port* is a 16-bit integer that identifies a process: 
- *Ephemeral port*: Assigned automatically by client kernel when client makes a connection request. 
- *Well-known port*: Associated with some *service* provided by a server 
(e.g., port 80 is associated with Web servers)

### Anatomy of a Connection

A connection is uniquely identified by the socket addresses of its endpoints (**socket pair**) 

- `(cliaddr:cliport, servaddr:servport) `

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402221800967.png" alt="image-20240222180003192" style="zoom:50%;" />

## Socket Interface

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402221827836.png" alt="image-20240222182704558" style="zoom: 50%;" />

如图，这就是 socket 的一般执行流程。

其中

- `getaddrinfo` 用于 DNS lookup
- `socket` 用于建立一个抽象的套接字
  - 对于内核而言，是建立了一个 endpoint of communication
  - 对于用户而言，是建立了一个 socket 文件，以便用户直接通过文件 I/O 进行网络通信
- `bind` 用于将该套接字文件和对应的套接字 `addr` bind 在一起
  - 也就是设置这个 socket 的参数
- `listen` 用于将该套接字文件设置为 listen 模式，从而阻塞进程，直到接收到 connection request