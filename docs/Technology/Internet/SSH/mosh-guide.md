# 使用 Mosh 的指南

Mosh（**Mo**bile **Sh**ell）和大家熟知的SSH（**S**ecure **Sh**ell）相比，有以下几个明显的优点：

1. 超级稳定：Mosh在网络信号不好的情况下也能表现得很好。它能自动应对网络延迟和丢包的问题，而且能快速恢复连接。就算你的网络信号断开再重新连接，Mosh也能保持你的工作状态不变。

2. 反应快：Mosh的反应速度更快。它有预测输入的功能，你输入的内容可以立刻显示出来，不用等服务器的反馈。这样一来，即使网络延迟，你也能流畅地工作。

3. 适合移动设备：Mosh是专门为手机和平板这样的移动设备设计的，特别适合那些经常需要切换网络，或者从移动网络切换到Wi-Fi的用户。它能优化数据传输和连接管理，减少电池的消耗，让你在移动设备上也能轻松地控制远程服务器。

4. 穿越防火墙：Mosh用的是UDP协议，所以能更容易地穿越防火墙和NAT路由器。这意味着你在网络限制严格的地方也能用Mosh远程控制电脑，而且不需要额外设置。

5. 兼容性好：Mosh和SSH是兼容的，可以和现有的SSH服务器一起使用。你可以先用SSH建立安全的连接，然后切换到Mosh，体验更好的效果。

总的来说，和SSH相比，Mosh在移动性、反应速度和稳定性上都更胜一筹，即使在网络条件不好的情况下，也能提供很好的使用体验。

本指南将介绍如何使用 Mosh。

## 步骤 1：安装 Mosh

需要在本地和远程都安装 Mosh，才能进行连接。

### Linux

Ubuntu: `sudo apt install mosh`
Archlinux: `pacman -S mosh`

其它 Linux 发行版，可见[官网安装指南](https://mosh.org/#getting)。

### Windows

暂时没有直接能用的。建议搭配 [Termius for Windows](https://termius.com/download/windows) 食用。

注：如果你有 Github Student Pack 的话，那么可以在学生时期一直享有 Termius 的 Pro 和 Team 的权益。具体权益详见 [Pricing](https://termius.com/pricing)。

### MacOS

Via Homebrew: `brew install mosh`

也可以选择直接下载 `mosh-xxx.pkg` 文件，详见[官网安装指南](https://mosh.org/#getting)。

### iOS

官网上也有推荐。不过你也可以用 Termius for iOS。在 AppStore 上搜索 Termius 就可以了。

## 步骤 2：连接到远程计算机

一旦 Mosh 安装完成，您可以使用以下命令连接到远程计算机：

```bash
mosh username@remote-server-ip
```

在这里，`username` 是您在远程服务器上的用户名，`remote-server-ip` 是远程服务器的 IP 地址。

## 注意事项

tl;dr: 一定要开放 **远程服务器**上的 **60000-61000 端口，udp 协议**

由于 Mosh 使用 **udp 协议**作为辅助，并默认使用**动态端口 60000-61000**。因此，一定要事先检查这些端口是否已经开放（因为很多云服务商为安全起见，只默认开放必要的端口）。否则，在使用 Mosh 连接之后，Mosh 会卡住。