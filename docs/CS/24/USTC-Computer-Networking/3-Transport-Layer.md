# Lec 2.8: TCP Socket Programming

## 基本流程

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

## 数据结构

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
#define h_addr h_addr_list[0] /* for backward compatibility */
```

`hostent` 作为调用域名解析函数时的参数。返回后，将 IP 地址拷贝到 `sockaddr_in` 的 IP 地址部分。

## TCP 连接

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403100049906.png" alt="image-20240310004910250" style="zoom:50%;" />

如图，注意

1. `connectionSocket = accept(welcomeSocket)` 就是一个阻塞函数，直到 `welcomeSocket` 收到（合法）连接请求之后，才取消阻塞，并且在成功建立连接之后，得到一个新的 `connectionSocket`。
2. `sad` 就是 socket address，对应 `sockaddr_in` 结构体。
3. 图上是单进程的模式。实际上，我们可以在 `connectionSocket = accept(...)` 后面进行 `fork`，用子进程来处理 `connectionSocket`，而父进程还是在 `welcomeSocket` 上监听。
    - 由于 TCP 连接是一个四元组（自身 IP:port，对方 IP:port），因此任何发送到 80 端口的数据包，都能和唯一一个进程的 fd 对应上。
    - 因此，不必考虑多进程时的问题。
4. 图中黑线是连接建立过程，红线是实际数据包发送过程。
5. 图中红线显示的是“先发再收”。但是，普遍而言，“先发再收”还是“先收再发”，取决于应用协议的具体定义。

## UDP 连接 VS TCP 连接

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