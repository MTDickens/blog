# Linux 常用软件

## 使用手册

1. `man`: `man` is an interface to the system reference manuals

2. `tldr`: The tldr pages are a community effort to simplify the beloved [man pages](https://en.wikipedia.org/wiki/Man_page) with practical examples. That is, 

   > Simplified and community-driven man pages

## 阅读器与编辑器

### 阅读器

1. `tail`, `head`：字面意思，截取（长）文本后面/前面的几行，并输出到标准输出。

## 查找与替换

### 文本查找

1. `grep`：`grep` 有很多选项，这也使它成为一个非常全能的工具。其中我经常使用的有 `-C` ：获取查找结果的上下文（Context）；`-v` 将对结果进行反选（Invert），也就是输出不匹配的结果。举例来说， `grep -C 5` 会输出匹配结果前后五行。当需要搜索大量文件的时候，使用 `-R` 会递归地进入子目录并搜索所有的文本文件。

2. `ack`

3. `ag`

4. `rg`：我比较常用的是 ripgrep (`rg`) ，因为它速度快，而且用法非常符合直觉。例子如下：

   ```shell
   # 查找所有使用了 requests 库的文件
   rg -t py 'import requests'
   # 查找所有没有写 shebang 的文件（包含隐藏文件）
   rg -u --files-without-match "^#!"
   # 查找所有的foo字符串，并打印其之后的5行
   rg foo -A 5
   # 打印匹配的统计信息（匹配的行和文件的数量）
   rg --stats PATTERN
   ```

### 文本替换

1. `sed`：`sed` 是一个基于文本编辑器`ed`构建的”流编辑器” 。在 `sed` 中，您基本上是利用一些简短的命令来修改文件，而不是直接操作文件的内容（尽管您也可以选择这样做）。

   相关的命令行非常多，但是最常用的是 `s`，即*替换*命令，例如我们可以这样写：

   ```shell
   ssh myserver journalctl
    | grep sshd
    | grep "Disconnected from"
    | sed 's/.*Disconnected from //'
   ```

   上面这段命令中，我们使用了一段简单的*正则表达式*。正则表达式是一种非常强大的工具，可以让我们基于某种模式来对字符串进行匹配。`s` 命令的语法如下：`s/REGEX/SUBSTITUTION/`, 其中 `REGEX` 部分是我们需要使用的正则表达式，而 `SUBSTITUTION` 是用于替换匹配结果的文本。

2. `paste`: merge lines of files

3. `awk`：`awk` 其实是一种编程语言，只不过它碰巧非常善于处理文本。

   `awk` 程序接受一个模式串（可选），以及一个代码块，指定当模式匹配时应该做何种操作。默认当模式串即匹配所有行（上面命令中当用法）。 在代码块中，`$0` 表示整行的内容，`$1` 到 `$n` 为一行中的 n 个区域，区域的分割基于 `awk` 的域分隔符（默认是空格，可以通过`-F`来修改）。

   如：

   1. `awk '{print $2}'` 的代码意思是：对于每一行文本，打印其第二个部分。
   2. ` ... | uniq -c | awk '$1 == 1 && $2 ~ /^c[^ ]*e$/ { print $2 }'`，它的意思是- 
      - `uniq -c` 把连续出现的行折叠为一行并使用出现次数作为前缀。
      - 该匹配要求文本的第一部分需要等于1（这部分刚好是`uniq -c`得到的计数值），然后其第二部分必须满足给定的一个正则表达式。代码块中的内容则表示打印用户名。

### Shell 命令查找

1. `history`：`history`  命令允许您以程序员的方式来访问shell中输入的历史命令。这个命令会在标准输出中打印shell中的里面命令。如果我们要搜索历史记录，则可以利用管道将输出结果传递给 `grep` 进行模式搜索。 `history | grep find` 会打印包含find子串的命令。
2. `Ctrl+R`：对于大多数的shell来说，您可以使用 `Ctrl+R` 对命令历史记录进行回溯搜索。敲 `Ctrl+R` 后您可以输入子串来进行匹配，查找历史命令行。
3. `fzf`：`Ctrl+R` 可以配合 [fzf](https://github.com/junegunn/fzf/wiki/Configuring-shell-key-bindings#ctrl-r) 使用。`fzf` 是一个通用对模糊查找工具，它可以和很多命令一起使用。这里我们可以对历史命令进行模糊查找并将结果以赏心悦目的格式输出。

### 文件查找

1. `find`：所有的类UNIX系统都包含一个名为 [`find`](https://man7.org/linux/man-pages/man1/find.1.html) 的工具，它是 shell 上用于查找文件的绝佳工具。`find`命令会递归地搜索符合条件的文件。

   除了列出所寻找的文件之外，find 还能对所有查找到的文件进行操作。这能极大地简化一些单调的任务。

2. `fd`：

   > :warning: 尽管 `find` 用途广泛，它的语法却比较难以记忆，而 shell 的哲学之一便是寻找（更好用的）替代方案。

   [`fd`](https://github.com/sharkdp/fd) 就是一个更简单、更快速、更友好的程序，它可以用来作为`find`的替代品。它有很多不错的默认设置，例如输出着色、默认支持正则匹配、支持unicode并且我认为它的语法更符合直觉。以模式`PATTERN` 搜索的语法是 `fd PATTERN`。

3. `locate`：`locate` 使用一个由 [`updatedb`](https://man7.org/linux/man-pages/man1/updatedb.1.html)负责更新的**数据库**，在大多数系统中 `updatedb` 都会通过 [`cron`](https://man7.org/linux/man-pages/man8/cron.8.html) 每日更新。这便需要我们在速度和时效性之间作出权衡。而且，`find` 和类似的工具可以通过别的属性比如文件大小、修改时间或是权限来查找文件，`locate`则只能通过文件名。

   

##  数据分析与整理

### 数据分析

1. `bc`: `bc` is an arbitrary precision calculator language.
   - For example, to calculate 4 times 5 then subtract 17: `echo '4 * 5 - 17' | bc`
2. `dc`: `dc` is an arbitrary precision calculator. Uses reverse polish notation (RPN).
   - For example, to calculate 4 times 5 (4 5 *), subtract 17 (17 -), and [p]rint the output:
     `dc --expression='4 5 * 17 - p'`
3. `R`：R 也是一种编程语言，它非常适合被用来进行数据分析和[绘制图表](https://ggplot2.tidyverse.org/)。这里我们不会讲的特别详细， 您只需要知道`summary` 可以打印某个向量的统计结果。我们将输入的一系列数据存放在一个向量后，利用R语言就可以得到我们想要的统计数据。
   - 比如，`R --slave -e 'x <- scan(file="stdin", quiet=TRUE); summary(x)'`
4. `gnuplot`：如果您希望绘制一些简单的图表， `gnuplot` 可以帮助到您：`gnuplot -p -e 'set boxwidth 0.5; plot "-" using 1:xtic(2) with boxes'`

### 数据整理

1. `xargs`：有时候您要利用数据整理技术从一长串列表里找出你所需要安装或移除的东西。我们之前讨论的相关技术配合 `xargs` 即可实现：

   ```shell
   rustup toolchain list | grep nightly | grep -vE "nightly-x86" | sed 's/-x86.*//' | xargs rustup toolchain uninstall
   ```

2. `gzip`：虽然到目前为止我们的讨论都是基于文本数据，但对于二进制文件其实同样有用。例如我们可以用 ffmpeg 从相机中捕获一张图片，将其转换成灰度图后通过SSH将压缩后的文件发送到远端服务器，并在那里解压、存档并显示。

   ```shell
   ffmpeg -loglevel panic -i /dev/video0 -frames 1 -f image2 -
    | convert - -colorspace gray -
    | gzip
    | ssh mymachine 'gzip -d | tee copy.jpg | env DISPLAY=:0 feh -'
   ```

## 文件夹导航

1. `fasd`：Fasd 基于 [*frecency* ](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/Places/Frecency_algorithm)对文件和文件排序，也就是说它会同时针对频率（*frequency*）和时效（*recency*）进行排序。默认情况下，`fasd`使用命令 `z` 帮助我们快速切换到最常访问的目录。例如， 如果您经常访问`/home/user/files/cool_project` 目录，那么可以直接使用 `z cool` 跳转到该目录。
2. `autojump`：以上操作命令，对于 autojump，则使用`j cool`代替即可。

## Shell

1. `zsh`: ***Zsh\*** is a shell designed for interactive use, although it is also a powerful scripting language. Many of the useful features of *bash*, *ksh*, and *tcsh* were incorporated into zsh; many original features were added.

   Zsh 是一个为交互式使用而设计的 shell，尽管它也是一个强大的脚本语言。Bash、 ksh 和 tcsh 的许多有用特性都被合并到 zsh 中; 还添加了许多原始特性。

2. `oh-my-zsh`: Oh My Zsh is a delightful, open source, community-driven framework for managing your Zsh configuration. It comes bundled with thousands of helpful functions, helpers, plugins, themes, and a few things that make you shout...

   Oh My Zsh 是一个令人愉快的、开源的、社区驱动的框架，用于管理您的 Zsh 配置。它捆绑了成千上万的有用功能，帮助程序，插件，主题，和让你兴奋大叫的一些东西……

## 正则表达式

## 其他

1. `sort`, `uniq`：**排序**，**将*连续出现*的行折叠为一行**（一般作用于已排序的数据）
