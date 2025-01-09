
## Lec 2.8: TCP Socket Programming

### 基本流程

1. 服务器进程必须先处于运行状态

    1. 创建欢迎 socket
    2. 和本地端口捆绑（比如 Web 服务就和 TCP 80/443 捆绑）
    3. 在欢迎 socket 上**阻塞式**等待接受用户的连接
        - **阻塞式：**除非操作系统接收到了用户的连接，否则 OS 的进程调度程序在 context switch 的时候，就不会选择让这个进程继续运行

2. 客户端主动和服务器建立连接

    1. 创建本地套接字（**隐式捆绑**到本地的某个高位 port，比如 51411）
    2. 指定（服务器进程的）IP 地址和端口号，与服务器进程**连接**

3. 当与客户端连接请求到来时

    1. 服务器接受来自用户端的请求，**解除阻塞式等待**，返回一个新的 socket，与客户端通信

        - **注意：**新的 socket 不是原来的欢迎 socket

        好处：

        1. 允许服务端与多个客户端通信
        2. 使用源 IP 和源端口来区分不同的客户端

4. 连接 API 调用有效时，客户端就与服务器建立了 TCP 连接

### 数据结构

`sockaddr_in`：**IP 地址和端口**的数据结构

```c
struct sockaddr_in
{
    short sin_family;        // AF_INET
    u_short sin_port;        // port
    struct in_addr sin_addr; 
        //  IP address, uint32_t
    char sin_zero[8]; // align
};
```

如图，`sin_family` 支持多种协议。

---

`hostent`：**域名和 IP 地址**的数据结构

```c
struct hostent {
   char  *h_name;            /* official name of host */
   char **h_aliases;         /* alias list */
   int    h_addrtype;        /* host address type */
   int    h_length;          /* length of address */
   char **h_addr_list;       /* list of addresses */
};
##define h_addr h_addr_list[0] /* for backward compatibility */
```

`hostent` 作为调用域名解析函数时的参数。返回后，将 IP 地址拷贝到 `sockaddr_in` 的 IP 地址部分。

### TCP 连接

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403100049906.png" alt="image-20240310004910250" style="zoom:50%;" />

如图，注意

1. `connectionSocket = accept(welcomeSocket)` 就是一个阻塞函数，直到 `welcomeSocket` 收到（合法）连接请求之后，才取消阻塞，并且在成功建立连接之后，得到一个新的 `connectionSocket`。
2. `sad` 就是 socket address，对应 `sockaddr_in` 结构体。
3. 图上是单进程的模式。实际上，我们可以在 `connectionSocket = accept(...)` 后面进行 `fork`，用子进程来处理 `connectionSocket`，而父进程还是在 `welcomeSocket` 上监听。
    - 由于 TCP 连接是一个四元组（自身 IP:port，对方 IP:port），因此任何发送到 80 端口的数据包，都能和唯一一个进程的 fd 对应上。
    - 因此，不必考虑多进程时的问题。
4. 图中黑线是连接建立过程，红线是实际数据包发送过程。
5. 图中红线显示的是“先发再收”。但是，普遍而言，“先发再收”还是“先收再发”，取决于应用协议的具体定义。

### UDP 连接 VS TCP 连接

对于 TCP 而言，客户端分这几个步骤：

1. 初始化 socket file descriptor
2. 执行 dns 查询，查找 host 对应的的 ip address
3. 通过端口、IP 构建 sockaddr_in
    - 指定对方 IP 和端口
    - 自己的 IP 和端口隐式绑定
4. 发起连接建立请求
5. send
6. receive
7. 关闭连接

---

对于 TCP 而言，服务端分这几个步骤

1. 初始化 welcome socket file descriptor
2. 通过端口、IP 构建 sockaddr_in
    - 指定自己 IP 和端口
    - IP 经常为 `INADDR_ANY`, `INADDR_LOOPBACK` 等等
3. 阻塞式 listen
    - listen 时，需要绑定 `struct sockaddr_in client_socket`，以便于知道对方的 IP 和端口
4. 创建 connection socket descriptor
5. receive
6. (process query)
7. send
8. 关闭连接

---

对于 UDP 而言，客户端分这几个步骤：

1. 初始化 socket file descriptor
2. 执行 dns 查询，查找 host 对应的的 ip address
3. 通过端口、IP 构建 sockaddr_in
    - 指定对方 IP 和端口
    - 自己的 IP 和端口隐式绑定
4. sendto（需要指定 socketaddr_in）
5. recvfrom（需要指定 socketaddr_in）

**与 TCP 不同：**

1. **无需事先建立连接**
2. **需要指定地址**

---

对于 UDP 而言，服务端分这几个步骤

1. 初始化 socket file descriptor
2. 通过端口、IP 构建 sockaddr_in
    - 指定自己 IP 和端口
    - IP 经常为 `INADDR_ANY`, `INADDR_LOOPBACK` 等等
3. recvfrom（需要绑定 `socketaddr_in client_addr`，以便于知道对方的 IP 和端口）
4. (process query)
5. sendto（需要指定 `socketaddr_in client_addr`）

**与 TCP 不同：**

1. **无需事先建立连接**
2. **需要指定地址**
3. **无需创建新的 connection socket 用于服务这个连接**

## Lec 3.1: Introduction

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403170308600.png" alt="image-20240317030810612" style="zoom:50%;" />

如图，TCP 和 UDP 都提供了多路复用和解复用的服务（也就是说，IP 只提供了主机到主机的服务，因此，如果主机里面的进程希望通信，那么就需要**复用** IP 提供的这一条链路，使之看起来就和**多路**一样）。

但是，除此之外，UDP 不再提供任何其它服务，而 TCP 还提供了可靠、保序的服务，以及拥塞控制、流量控制等额外功能。为了实现这些功能，TCP 需要首先先建立连接。

---

当然，不论是 TCP 还是 UDP，它们能够提供的服务都是有限的。对于延时和带宽，它们无能为力。

## Lec 3.2: Mux and Demux

### TCP

TCP 套接字需要提供 `(Source IP, Source Port, Dest IP, Dest Port)` 这一个四元组。通过这个四元组，我们就可以唯一标识一个 TCP 连接。

具体地：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403171716571.png" alt="image-20240317171620938" style="zoom: 50%;" />

1. 通过 socket，我们将四元组以 IDU 的形式传输给 TCP
2. TCP 将 `(Source Port, Dest Port)` 封装到自己的 PDU 的 header 里去，然后把 `(Source IP, Dest IP)` 继续当作 ICI，传给 IP
3. IP 将 `(Source IP, Dest IP)` 封装到自己的 PDU 的 header 里去，并一路传到对方的对等层
4. 对方的 IP 将 TCP segment 以及 IP 信息传给 TCP
5. 对方的 TCP 将 HTTP 数据包以及 IP, port 信息传给 HTTP，从而完成了一次发送

### UDP

UDP 相比 TCP 的套接字，创建的时候，无需指定对方的 IP 和 port，但是进行传输的时候需要指定。所以，具体的过程和 TCP 其实是大同小异的。

#### UDP 和 TCP 定位进程方式的区别

但是，**UDP 只以目标 IP 和目标 port 来区分进程**。因此，如果多个不同的主机指定了同一个 IP:port，那么就会被转发到同一个对方主机的 PID 上处理。

而 **TCP 还考虑了源 IP,port**，因此可以不同的 connection socket 服务不同的 source IP, port。

如果要通过代码获得一些“感性上的认知”的话。如下

TCP 是：

```c
/**
 * tcp-server.c
 */

int main()
{
    //...
	connection_socket = accept(welcome_socket, (struct sockaddr *)&client_address, &client_address_len);
}

```

在这里面，kernel 就把 client_address 和 welcome_socket 绑定在一起，形成四元组，然后返回这个 file descriptor。

而 UDP 是：

```c
/**
 * udp-server.c
 */

int main()
{
    // ...
	ssize_t bytes_received = recvfrom(sock, buffer, sizeof(buffer), 0, (struct sockaddr *)&client_address, &addr_len);
}
```

在这里面，根本没有新的 file descriptor 被创建，显然只能是采用二元组。
