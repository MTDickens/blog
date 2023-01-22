# Linux 必备软件

:warning:注意：以下命令和软件是经 Ubuntu 20.04 测试成功的。对于 Ubuntu 的其他发行版，以及其他的基于 Linux 系统，此处命令的可用性一概不做保证。

对于各系统的安装命令，详见：[command not found](https://command-not-found.com/)

## （解）压缩

1. `7z`：万能压缩和解压缩软件
   - 安装命令：`apt install p7zip-full`
2. `unzip`：基础解压缩，作为不少软件的依赖
   - 安装命令：`apt install unzip`

## 包管理器

1. `pip`：强大的 Python 包管理器。不仅是下载 Python 模组，更可以方便的获取大量 Python 开源软件
   - 安装命令：`apt install pip`

## 其他

1. `tldr`：一个强大的、社区型的 cheetsheet。

      安装命令：

      1. 用 npm：`npm install -g tldr`
      2. 用 pip（推荐）：`pip install tldr`
      3. 用其他包管理器：详见[官方列表](https://github.com/tldr-pages/tldr/wiki/tldr-pages-clients)
      4. 自行编译：详见 [tldr written in C](https://github.com/tldr-pages/tldr-c-client)

2. `v2ray`：不解释，去 Github/Google 上搜”v2ray一键脚本“，一搜一大把

      :warning:警告：强烈建议安装在**非**生产环境的**国外**服务器上。

3. [一些 MIT missing semester 推荐的常用软件](frequently_used_softwares_in_Linux.md)