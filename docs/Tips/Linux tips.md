# Tips for Shell

## 如何修改默认编辑器？

在使用 Git 等软件时，这些软件常常会打开默认编辑器，让你进行文本操作。如果你的默认编辑器不是你常用编辑器的话，你使用 Shell 时的体验感、流畅感会大大降低。

以下是修改建议（顺序依据为建议的推荐程度，由高到低排序）：

1. 输入命令 `sudo update-alternatives --config editor`，选择适合的编辑器。

2. 或者，输入命令 `export VISUAL=<your default editor name>;export EDITOR="$VISUAL"` （如：`sudo export VISUAL=vim`），可以**临时**设置
   1. 如果希望**永久**设置，则建议在 **.bashrc/.zshrc** （**rc** 前面的东西取决于你的 Shell 的种类）中加上这两句命令：
   
      ```shell
      export VISUAL=<your default editor name>;
      export EDITOR="$VISUAL";
      ```
   
