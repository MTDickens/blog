# 加密我的 Git —— git-crypt 使用指南

在开发项目时，保护敏感信息的安全性是非常重要的。Git-crypt 是一个工具，可以帮助开发者对 Git 仓库中的敏感信息进行加密保护，比如密码、私钥等。

在本文中，我们将介绍如何使用 Git-crypt 来加密您的 Git 仓库。

## 如何下载、安装 git-crypt

首先，您需要在您的计算机上安装 Git-crypt。您可以通过以下步骤来安装：

### 在 Mac 上安装

您可以使用 Homebrew 来安装 Git-crypt。在终端中执行以下命令：

```
brew install git-crypt
```

### 在 Linux 上安装

您可以使用您发行版的包管理器来安装 Git-crypt。例如，在 Debian/Ubuntu 上，您可以执行以下命令：

```
sudo apt-get install git-crypt
```

### 在 Windows 上安装

您可以通过从 [Git-crypt 的 GitHub 页面](https://github.com/AGWA/git-crypt/releases) 下载 Windows 版本的二进制文件来安装 Git-crypt。

## 如何 init git-crypt

在您的 Git 仓库中初始化 Git-crypt 非常简单。在终端中，进入您的 Git 仓库，并执行以下命令：

```
git-crypt init
```

这将会在您的仓库中创建一个 `.git-crypt` 目录，用于存储加密密钥和加密配置。

!!! Tip
    请先进行 `git init`，再进行 `git-crypt init`

## 如何设置需要加密的文件/文件夹（使用 .gitattributes）

一旦您初始化了 Git-crypt，下一步就是设置您想要加密的文件和文件夹。您可以通过在您的仓库根目录中创建一个 `.gitattributes` 文件来完成这个步骤。

在 `.gitattributes` 文件中，您可以指定哪些文件应该被加密。例如，如果您想要加密名为 `secret_file.txt` 的文件，您可以在 `.gitattributes` 文件中添加以下行：

```
secret_file.txt filter=git-crypt diff=git-crypt
```

之后，执行命令 `git-crypt status`，你将能看到如下行：

```
...
not encrypted: .gitattributes
...
encrypted: secret_file.txt
```

!!! warning
    如果你要加密一个文件，务必在 `git add` 之前将其添加到 `.gitattributes` 中，这样，在执行 `git add` 命令时，git-crypt 才能够在此时对其进行加密处理。

### 通配符

`.gitattributes` 文件支持也使用通配符进行文件匹配。例如，要加密所有扩展名为 `.secret` 的文件，您可以在 `.gitattributes` 文件中添加以下行：

```
*.secret filter=git-crypt diff=git-crypt
```

这会告诉 Git-crypt 对所有扩展名为 `.secret` 的文件应用过滤器，并在使用 `git diff` 命令时也应用过滤器。这告诉 Git-crypt 对 `secrets.txt` 应用过滤器，并在使用 `git diff` 命令时也要应用过滤器。

## 如何导出密钥

如果您想要在其他计算机上使用与当前计算机相同的密钥，您需要将密钥导出并移动到另一台计算机上。您可以使用 `git-crypt export-key` 命令来导出 Git-crypt 密钥。

在终端中，执行以下命令来导出密钥：

```
git-crypt export-key <key-file>
```

其中，`<key-file>` 是要导出密钥的文件名（比如：`my_key.key`）

## 如何通过其他人的密钥，对其他人的仓库进行解密

如果您需要访问其他人加密的 Git 仓库，您需要使用他们的公钥来解密文件。您可以使用 `git-crypt unlock` 命令来解密受保护的文件。

在终端中，进入要解密的 Git 仓库，并执行以下命令：

```
git-crypt unlock <path-to-public-key>
```

其中，`<path-to-public-key>` 是包含其他人公钥的文件路径。