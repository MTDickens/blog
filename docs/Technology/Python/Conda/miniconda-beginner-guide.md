# MiniConda 使用指南

> 作者：Claude 3.5 Sonnet
> 审核：M.T.Dickens

## 简介

MiniConda 是一个轻量级的 Python 和 R 数据科学平台。它是 Anaconda 的精简版本,包含了 conda, Python 和一些基本包。本文将指导您如何安装和使用 MiniConda,以及如何在 VSCode 中集成 MiniConda 环境。

## 第一步：下载 MiniConda

要开始使用 MiniConda,首先需要从官方网站下载安装程序。

官方下载地址: https://docs.conda.io/en/latest/miniconda.html

选择适合您操作系统的版本进行下载和安装。

## 第二步：将 MiniConda 的 shell 添加到 VSCode 中去

要在 VSCode 中使用 MiniConda，我们需要修改 VSCode 的设置。这包括更新全局设置和创建本地设置。

### 1. 修改全局设置

1. 打开 VSCode
2. 按下 `Ctrl+,` (Windows/Linux) 或 `Cmd+,` (Mac) 打开设置
3. 点击右上角的 "打开设置(json)" 图标，打开 `settings.json` 文件
4. 在文件中添加以下配置（请根据您的 Miniconda 安装路径进行调整）：

```json
"terminal.integrated.profiles.windows": {
  "Miniconda PowerShell": {
    "path": "pwsh.exe",
    "args": [
      "-ExecutionPolicy",
      "ByPass",
      "-NoExit",
      "-Command",
      "& 'D:\\programs\\miniconda3\\shell\\condabin\\conda-hook.ps1' ; conda activate 'D:\\programs\\miniconda3' "
    ]
  },
  "Miniconda CMD": {
    "path": "cmd.exe",
    "args": [
      "/K",
      "D:\\programs\\miniconda3\\Scripts\\activate.bat D:\\programs\\miniconda3"
    ]
  }
},
```

5. 保存并关闭文件

> [!warning]+ 注意
> 
> 请以您下载时的 Anaconda Prompt 以及 Anaconda Powershell Prompt 的快捷方式（可以通过右键 prompt，选择“属性”然后可以看到快捷方式。这里的快捷方式就是命令）为准。

### 2. 创建本地设置

1. 在 VSCode 中打开您的项目文件夹
2. 在项目根目录创建 `.vscode` 文件夹（如果还没有的话）
3. 在 `.vscode` 文件夹中创建 `settings.json` 文件
4. 在文件中添加以下内容：

```json
{
  "terminal.integrated.defaultProfile.windows": "Miniconda PowerShell"
}
```

5. 保存文件

这样设置后，当您在这个项目中打开新的终端时，VSCode 将默认使用 Miniconda PowerShell 环境。

### 验证设置

1. 在 VSCode 中打开一个新的终端（Ctrl+` 或 View > Terminal）
2. 您应该看到终端提示符显示了激活的 Miniconda 环境

通过这些步骤，您已经成功地将 MiniConda 的 shell 添加到了 VSCode 中，并将其设置为项目的默认终端。

## 第三步：Miniconda 的基本用法

以下是一些 Miniconda 的基本命令,参考自官方 cheat sheet:

- 创建新环境: `conda create --name myenv python=3.8`
- 激活环境: `conda activate myenv`
- 停用环境: `conda deactivate`
- 安装包: `conda install package_name`
- 更新包: `conda update package_name`
- 列出已安装的包: `conda list`
- 删除环境: `conda remove --name myenv --all`

## 注意事项

1. 必须使用官方 prompt: 为了确保 conda 命令正常工作,请始终使用 Anaconda Prompt 或已经配置好的终端。

2. 环境管理: 为不同的项目创建独立的环境,以避免包冲突。

3. 定期更新: 使用 `conda update --all` 来更新所有包,保持环境最新。

4. 使用 .condarc 文件: 可以通过 .condarc 文件自定义 conda 的行为,如更改默认通道或设置代理。

5. 包管理: 优先使用 conda 安装包。如果 conda 中没有所需的包,再考虑使用 pip。

6. 环境共享: 使用 `conda env export > environment.yml` 导出环境,方便在其他机器上重现相同的环境。

通过遵循这些步骤和注意事项,您可以有效地使用 MiniConda 来管理您的 Python 环境和包。祝您使用愉快！