# 使用 `rlwrap` 的教程

> 作者：M.T.Dickens, ChatGPT Feb 13 Ver.

`rlwrap` 是一个常用的 readline 包装器，它为 shell 提供了更加便捷的输入方式。本教程将介绍如何使用 `rlwrap` 以及它的使用情景和注意事项。

## 1. `rlwrap` 简介

`rlwrap` 是一个 readline 包装器，它允许用户在终端中使用 readline 的功能，包括命令历史、补全和编辑等。它可以应用于大多数基于 readline 的应用程序，例如 `python`，`ruby`，`mysql`，`psql` 等等。

## 2. `rlwrap` 使用方法

使用 `rlwrap` 非常简单，只需在命令前面添加 `rlwrap` 即可。例如：

```
Copy code
rlwrap python
```

这将启动一个带有 readline 功能的 Python 解释器。

## 3. `rlwrap` 使用情景

`rlwrap` 的主要使用情景是在没有 readline 功能的应用程序中使用 readline。例如，使用 `rlwrap` 可以在没有 readline 功能的 `netcat` 中使用历史命令和补全功能。

另一个常见的使用情景是在远程服务器上使用命令行应用程序。通常，远程服务器的命令行应用程序没有 readline 功能，这使得用户使用起来非常困难。使用 `rlwrap` 可以在远程服务器上获得 readline 功能，从而使得使用命令行应用程序更加方便。

## 4. `rlwrap` 使用时注意事项

使用 `rlwrap` 时需要注意以下几点：

- `rlwrap` 不支持使用管道和重定向。如果需要使用管道和重定向，请在 `rlwrap` 命令后面添加 `-a` 参数，例如：

  ```
  cssCopy code
  rlwrap -a python < input.txt > output.txt
  ```

- `rlwrap` 可能会影响一些应用程序的行为，例如一些使用 `readline` 库但并不完全符合 `readline` 规范的程序。在这种情况下，您可能需要在 `rlwrap` 命令中使用其他参数以更好地支持该应用程序。

- 在使用 `rlwrap` 时，您需要对应用程序的快捷键进行重新映射。例如，在 `vim` 中使用 `rlwrap` 时，您需要重新映射 `Esc` 键。您可以在 `~/.inputrc` 文件中添加重新映射规则。

- `rlwrap` 可能会降低应用程序的性能。如果您在使用 `rlwrap` 时遇到了性能问题，请尝试在不使用 `rlwrap` 的情况下使用应用程序。

## 5. `rlwrap` 的其他参数和用法

除了基本用法外，`rlwrap` 还有一些其他的参数和用法，这里列举一些常用的：

- `-c`: 记录和保存输入历史记录文件，默认文件名为`~/.history`。
- `-r`: 不使用 readline 的历史记录功能。
- `-f`: 从给定的历史记录文件中读取历史记录。
- `-H`: 显示历史记录。
- `-P`: 指定 readline 风格的提示符。
- `-S`: 指定一个字符串，该字符串被认为是一个分隔符，当输入达到该分隔符时，`rlwrap` 将输出输入的所有字符。
- `-t`: 指定超时时间（秒），在该时间内无输入将关闭 `rlwrap`。
- `-v`: 显示版本号。
- `-h`: 显示帮助信息。

这些参数可以通过在 `rlwrap` 命令后面添加参数进行使用，例如：

```
rCopy code
rlwrap -c python
```

这将启动一个带有 readline 功能并记录输入历史的 Python 解释器。
