# TCP

## TCP 头部

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/27_21_52_34_20241227215233.png"/>

如图：

1. 首先是两个端口，自不必说
2. 然后是 seq number，也就是序号字段。TCP链接中传输的数据流中每个字节都编上一个序号。
3. 后面是确认号，用于 TCP 传输
4. 再后面就是四位 data offset，其实也就是 header length
5. 然后就是一堆 signal
6. 窗口大小用于流量控制：窗口起始于确认序号字段指明的值，这个值是接收端正期望接收的字节数。窗口最大为65535字节

## 三次握手和四次挥手

> [!info]+ 图示
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/27_22_47_32_20241227224731.png" width="70%"/>

这里还是 Alice 作为发送方，Bob 作为接收方

### 三次握手

1. Bob 收到 SYN：Bob 知道 Alice 需要建立 TCP 连接
2. Alice 收到 SYN+ACK：Alice 知道 Bob 知道 Alice 需要建立 TCP 连接
3. Bob 收到 ACK：Bob 知道 Alice 收到了 SYN+ACK，也就是 Bob 知道了 Alice 需要建立连接