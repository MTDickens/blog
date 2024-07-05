> 转载自 [linux.do](https://linux.do/t/topic/128683/1)

今天冲浪<img src="https://cdn.linux.do/images/emoji/apple/surfing_man.png?v=12" alt=":surfing_man:" style="zoom:25%;" />的时候看到外网有位老哥分享了AI写作的小技巧，**如何通过一句简单Prompt，让Claude 3.5 Sonnet 模仿任何写作风格。**

看了一下感觉过程蛮简单的，就亲自实践了一下，并把过程和结果做个分享，有兴趣的佬们可以试试看<img src="https://cdn.linux.do/images/emoji/apple/point_down.png?v=12" alt=":point_down:" style="zoom:25%;" />

### 第 1 步：收集并复制一些写作样本。

在这个例子中，我找了红楼梦第一章中，分别不连续的几段的文字。

![image](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_2_36_24_202407060236524.jpeg)

### 第2步：打开Claude并使用此提示。

原作者的提示词很简单，就是定义了一个简单的规则：

- 第一步先让大模型了解自己的角色和任务（模仿风格写作）；
- 第二步让大模型持续吸收和学习用户上传的文章实例；
- 第三步让大模型根据要求模仿风格并输出内容。

**英文提示词**

```rust
I'm going to provide you with my own written material, and your task will be to understand and mimic its style.

You'll start this exercise by saying "BEGIN." After, I'll present an example text, to which you'll respond, "CONTINUE". The process will continue similarly with another piece of writing and then with further examples. I'll give you unlimited examples. Your response will only be "CONTINUE." You're only permitted to change your response when I tell you "FINISHED".

After this, you'll explore and understand the tone, style, and characteristics of my writing based on the samples I've given. Finally, I'll prompt you to craft a new piece of writing on a specified topic, emulating my distinctive writing style
```

**中文版**

```bash
我将为你提供我自己的书面材料，你的任务是理解并模仿其风格。

你将通过说"开始"来开始这个练习。之后，我会呈现一个示例文本，你要回应"继续"。这个过程将以类似的方式继续进行，包括另一段写作和更多的例子。我会给你无限的例子。你的回应只能是"继续"。只有当我说"结束"时，你才被允许改变你的回应。

在此之后，你将根据我给出的样本探索并理解我写作的语气、风格和特点。最后，我会提示你就指定的主题创作一篇新的文章，模仿我独特的写作风格。
```

### 第3步：向Claude提供你的写作样本。

提交提示词后，确保Claude说“开始”。

然后粘贴准备好的文章示例，并等待Claude的“继续”回复，然后再粘贴更多内容。

原作者说最少提交两次示例来训练，并且提供的越多，输出就越好。

在这个例子中，我提交了5次示例内容，4次都是单独的段落，1次是连续的几个段落。

![image](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_2_36_31_202407060236381.jpeg)

### 第 4 步：完成后输入“结束”。

一旦你给 Claude 提供了足够的写作内容（我建议至少 5 篇），请输入“结束”让 Claude 知道你已经完成了。

![image](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_2_36_32_202407060236640.jpeg)

### 第 5 步：根据要求输出对应风格的内容

提交了5次示例内容后，我找了今年的高考作文题让claude试试看，结果如下<img src="https://cdn.linux.do/images/emoji/apple/point_down.png?v=12" alt=":point_down:" style="zoom:25%;" />

个人感觉味道挺足的，效果确实不错，大家也可以试试看

![image](https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_2_36_34_202407060236323.jpeg)