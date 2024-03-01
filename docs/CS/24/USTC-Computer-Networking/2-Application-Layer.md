# Lec 2.0：应用层概述

## 网络应用的原理

- **网络应用协议的概念和实现方面**
  - 传输层的服务模型
  - 客户-服务器模式
  - 对等模式(peer-to-peer)
  - 内容分发网络


## 网络应用的实例

- **互联网流行的应用层协议**
  - HTTP
  - FTP
  - SMTP / POP3 / IMAP
  - DNS

## 编程

- **网络应用程序**
  - Socket API

# Lec 2.1：应用层原理

## 网络应用的体系结构

可能的应用架构：

- 客户-服务器模式 (C/S:client/server)
- 对等模式 (P2P:Peer To Peer)
- 混合体：客户-服务器和对等体系结构 

### CS 体系结构

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271717465.png" alt="image-20240227171723013" style="zoom:50%;" />

- 服务器
  - 一直运行
  - 固定 IP 地址和周知的端口号
  - 扩展性差
- 客户端
  - 主动与服务端通信
    - i.e. 服务端先启动，客户端后通信
  - 间歇性连接
  - 可能是动态 IP
  - 不直接与其他客户端通信

### P2P 体系结构

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402271723613.png" alt="image-20240227172321985" style="zoom:50%;" />

- 服务器/客户端

  - ~~一直运行~~**（几乎）没有一直运行的**
    - 这使得 P2P 管理比较困难
  - ~~固定~~可能改变的 IP 地址和周知的端口号
  - 扩展性~~差~~强

  - ~~主动与服务端通信~~
  - 间歇性连接
  - 可能是动态 IP
  - ~~不直接与其他~~任意端系统之间可以通信

### 混合体系结构

#### Napster

- 文件搜索：集中
  - 主机在中心服务器上注册其资源
  - 主机向中心服务器查询资源位置
  
- 文件传输：P2P
  - 任意Peer节点之间即时通信

#### 即时通信

- 在线检测：集中
  - 当用户上线时，向中心服务器注册其IP地址
  - 用户与中心服务器联系，以找到其在线好友的位置

- 两个用户之间聊天：P2P

总体而言，就是 **centralized register & lookup, decentralized communication**。

## 进程通信

进程：在主机上运行的应用程序

- 在同一个主机内，可以直接采用**进程间通信机制**进行通信
  - 比如 Linux 的管道[^1]
- 不同主机，通过交换报文（Message）来通信
  - 使用OS提供的通信服务
  - 按照应用协议交换报文
    - 借助传输层提供的服务 

## 三个问题和解决方案

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403020008891.png" alt="image-20240227233453236" style="zoom: 67%;" />

也就是

- 服务者如何区分和定位客户？
- 服务者应该如何服务？
- 客户如何使用服务？

### 问题一方案

- 进程为了接收报文，必须有一个标识 即：**SAP**
  - 主机：唯一的 32 位地址
  - 所采用的传输层协议：TCP or UDP?
  - **端口号**（用于*区分*同一主机上不同进程的标识）
    - 一些知名端口号的例子
      - HTTP: TCP 80 
      - Mail: TCP 25 
      - ftp: TCP 20,21
- 一个进程：用IP+port标示 -> 端节点
- 因此，本质上，一对主机进程之间的通信由 2 个端节点构成 

### 问题二方案

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402272344960.png" alt="image-20240227234443064" style="zoom:67%;" />

例子

- HTTP 协议将 http 的请求头、请求体等等封在 SDU 里
- HTTP 在层间接口 socket 处，通过 socket API，将控制信息 IDU 告知 TCP
  - IDU 即：我是谁？TA 是谁？等等
- 从而，TCP 将这些信息以自己的方式，封装成 TCP header，并进一步下传

同时，由于 socket API 内容繁多，使用起来复杂麻烦，因此，我们就使用 socket 进行传输

- 在 Linux 上，（以 TCP socket 为例，）socket 建立之后，会返回一个文件描述符。我们只要向这个文件描述符传输数据就行
- **（猜测）**一个网络 IP + 端口，只能有一个 open file table entry
  - 因此，比如 `fork` 之后，可以有两个文件描述符指向同一个 entry
  - 但是，不能有两个进程两次调用 socket 指向同一个 ip:port
    - 除非启用了 `SO_REUSEPORT`

---

对于 UDP socket，我们建立 socket 的时候，只用给**自己的端口+IP**，而无需事先给对方的。

- 等到每一次进行传输的时候，再给对方的端口+IP。
- 接收的时候，也要指定接收人的端口+IP。

#### 传输层应该向应用层提供怎样的服务？

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402282307064.png" alt="image-20240228230725606" style="zoom:67%;" />

数据丢失率、延迟、吞吐量、安全性

### 问题三方案

制定**应用层协议**

- 定义了：运行在不同瑞系统出的应用进程如何相互交换报文

  - 交换的**报文类型**：请求和应答报文

  - 各种报文类型的**语法**：报文中的各个字段及其描述

  - 字段的**语义**：即字段取值的含义

  - 进程何时、如何发送报文及对报文进行响应的**规则**

- 应用*协议*（应用层实体）仅仅是应用的一个组成部分
  - 应用=界面+I/O+内部处理逻辑+**应用协议**
  - Web应用：**HTTP协议**，web客户端，web服务器，HTML

# Lec 2.2: Web & HTTP

## Web 术语

- **Web页**：由一些**对象**组成
   - 对象可以是HTML文件、JPEG图像、Java小程序、声音剪辑文件等
   - Web页含有一个**基本的HTML文件**，该基本HTML文件又包含若干对象的引用（链接）
   - 通过URL对每个对象进行引用
      - 访问协议，用户名，口令字，端口等；
- URL格式: `Prot://user:psw@www.someSchool.edu/someDept/pic.gif:port`
                    协议名    用户  口令 主机名                           路径名                         端口

## HTTP

HTTP 本身无状态，其状态由 TCP 维护。

Web Server 有一个守护 socket，相当于经理；每出现一个请求，创建一个 socket 用于服务，相当于叫服务员。

### HTTP 1.0 概况

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402290113625.png" alt="image-20240229011338760" style="zoom: 80%;" />

### HTTP 1.1

对于 HTTP 1.1，HTTP 支持**持久连接**，如图所示：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402292132152.gif" alt="img" style="zoom: 80%;" />

### HTTP 请求流程

假设用户输入 `https://www.cs.cmu.edu/~pavlo/` 的 URL，对于 HTTP 1.0，请求流程如下：

1. 客户端发起建立连接请求
2. 服务端在 80 端口等待连接，接受连接并通知客户端
3. HTTP客户端向TCP连接的套接字发送HTTP请求报文，报文表示客户端需要对象 `~pavlo`
4. HTTP服务器接收到请求报文，检索出被请求的对象，将对象封装在一个响应报文，并通过其套接字向客户端发送
5. HTTP 关闭 TCP 连接
6. HTTP客户端收到包含html文件的响应报文，并显示html。然后对html文件进行检查，找到所有的引用对象
7. 对于每个引用对象，递归重复 1-6 步

因此，对于 HTTP 1.0，一次请求，需要**2 个 RTT + 对象传输时间**。

对于 HTTP 1.1，在建立连接之后，会进行多次 HTTP Request。而且，会以**流水线**的方式，进行 HTTP 请求，即：如果有多个对象需要请求，那么就会同时请求。

### HTTP 请求格式

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402292224917.png" alt="image-20240229222431417" style="zoom: 67%;" />

### HTTP 状态保持：Cookie

为了以某种等价的形式保持 HTTP 的状态，我们需要用到 cookie。

Cookie 中的项，一般都会被保存在服务端的数据库里。从而，服务器可以用于 cookie 来 identify user。

### Web 缓存

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402292312296.png" alt="image-20240229231221447" style="zoom:67%;" />

由于同一个地区的人的访问趋同性，内容访问的时间局部性很好，因此通过设立 Web 缓存，可以有效优化网络。

Web 缓存通常由 ISP 安装（大学、公司、居民区 ISP），用于

- 降低响应延迟
- 减小流量
- 由于互联网大量使用缓存，较弱的 ICP 也能提供服务

至于如何判定缓存内容是否改名，Web 服务器会向 server 发一个 HTTP 请求，但是携带一个键为 If-Modified-Since header，值为 Last-Modified-Time 的信息。

# Lec 2.3: FTP (File Transport Protocol)

（主动模式下的）FTP 连接过程：

1. 客户端打开一个随机的端口（端口号大于1024，在这里，我们称它为x），同时一个FTP进程连接至服务器的21号命令端口。此时，该tcp连接的来源地端口为客户端指定的随机端口x，目的地端口（远程端口）为服务器上的21号端口。
2. 客户端开始监听端口（x+1），同时向服务器发送一个端口命令（通过服务器的21号命令端口），此命令告诉服务器客户端正在监听的端口号并且已准备好从此端口接收数据。这个端口就是我们所知的数据端口。
3. 服务器打开20号源端口并且创建和客户端数据端口的连接。此时，来源地的端口为20，远程数据(目的地)端口为（x+1）。
4. 客户端通过本地的数据端口创建一个和服务器20号端口的连接，然后向服务器发送一个应答，告诉服务器它已经创建好了一个连接。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403010001229.png" alt="Raysync ftp server" style="zoom:67%;" />

---

FTP 显然是有状态的（应用层）协议。服务器和客户端都维持着通信状态。

### FTP 控制命令&返回码示例

![image-20240301001606185](https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403010016086.png)

### 与 HTTP 区别

1. 有状态
2. 控制命令和数据传输分别在两个 TCP 连接上

# Reference

[^1]:[Linux Process Communication With Pipe: A Toy Example](https://raw.githubusercontent.com/MTDickens/dev/main/ustc-networking/ch2/process-communication.c)

