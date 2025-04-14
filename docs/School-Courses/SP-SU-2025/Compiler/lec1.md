# Introduction and Lexers

## Introduction

> [!info]
> 
> 编译器的整体流程
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_11_47_26_20250217114726.png"/>

## Lexer

### Overview

目的是将字符流转换成 token 流，同时丢弃空白和注释

- “丢弃注释”这一步，有可能是用 preprocessor 来完成的

### What is a "Token"?

Token 就是最小的语义单元。Token 的数量一般是无限的，但是种类是有限的。举例如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_18_21_49_20250217182149.png" width="50%"/>

### Representation of Token Type

我们需要将 token 的 type 形式化，因为：

- 严谨（当然不是主因，因为加上用词限制的自然语言也可以相对严谨）
- 可以根据这种形式，**自动生成**符合这种形式要求的 tokenizer
	- 比如 flex
	- 这样的好处就是：无需自己手动实现 "ad hoc" tokenizer。减少工作量，减少 bug，易于扩展

这里的形式化的具体意思，就是将其表达为**正则表达式**。 例子如下。

> [!example]+
> 
> ```
> if                                    {return IF;}
> [a-z][a-z0-9]*                        {return ID;}
> [0-9]+                                {return NUM;}
> ([0-9]+"."[0-9]*)|([0-9]*"."[0-9]+)   {return REAL;}
> ("--"[a-z]*"\n")|(" "|"\n"|"\t")+      {/*do nothing*/}
> .                                     {error():}
> ```

#### Disambiguation: Longest Match, Rule Priority

上面的一组正则表达式规则是**有歧义**的，具体来说，举下面两个例子：

1. `if8`：应该被匹配为 `IF` 还是 `ID` 呢？（应该是 `ID`）
2. `if 89`前面的 `IF`：应该被匹配为 `IF` 还是 `ID` 呢？（应该是 `IF`）

我们添加下面两个元规则，来消歧义：

3. 首先，我们用所有规则进行匹配。我们只保留**能匹配到最长字符串**的规则。
4. 然后，对于上述保留下来的（最长的）字符串，我们根据优先级，选择**优先级最高**的。

> [!example]
> 
> 对于 `if8` 而言，由于 `ID` 可以匹配到 `if8`，而 `IF` 只能匹配到 `if`，因此只有 `ID` 被保留。
> 
> 对于 `if 89` 而言，由于都匹配到 `if`，但是 `IF` 优先级最高，因此 `IF` 被保留。

### Implementation v0.0

#### RE -> DFA

> [!warning] 实际的转换步骤：RE -> NFA（详见 v1.0）
> 
> 使用 Thompson's Construction，可以机械地转成 NFA（反正之后也要是 NFA，不如一步到位）

我们会把所有规则的正则表达式转换成对应的 DFA。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_12_27_50_20250217122749.png"/>

#### Multiple DFAs -> Aggregated DFA

> [!warning] 实际的转换步骤（详见 v1.0）
> 
> 实际上，直接将多个 DFA 整合成”大 DFA“，是困难的。因此我们实际的流程是，现将其转换成”大 NFA“，然后再将 NFA 转换成 DFA。
> 
> - 算法我们之后会说到

然后，将所有的 DFA 整合成一个巨大的 NFA：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_12_23_52_20250217122351.png"/>

#### DFA -> Table

之后，我们通过表驱动的算法来进行计算（就是将 NFA 用二维数组来表示）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_12_32_11_20250217123210.png"/>

#### Algorithm

**目标**：使用上图的表，搭配这样的算法，使得每一次匹配到的字符串，都满足：

5. 最长
6. （如果等长）最优先

由于第二个条件（*最优先*）已经在构造大 DFA 的时候被解决了，因此我们目前只需要解决第一个条件（*最长*）。

**算法**：维护两个变量，`Last-Final` 和 `Input-Position-at-Last-Final`

- `Last-Final` (the state number of the most recent final state)
    最近一次接收状态。
- `Input-Position-at-Last-Final`
    最近一次接收状态时的输入位置。

我们不断往前检查，直到进入了 0 状态，就

7. 将状态退回到 `Last-Final`
8. 将位置退回到 `Input-Position-at-Last-Final`
9. 根据 `Last-Final` 和 `Input-Position-at-Last-Final`，做出对应的 accept action

一个具体的例子如下：

> [!example]-
> 
> 对于 `if --not-a-com` 而言
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_12_21_36_20250217122136.png"/>

### Implementation v1.0

#### RE -> NFA

直接用 Thompson reconstruction:

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/26_21_25_33_20250226212532.png"/>

#### NFA -> DFA

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_17_35_43_20250227173543.png"/>

我们跟着走一遍就好：

- `p=1,j=0,s[0]={},s[1]={1,2,6}`
- `p==1,j==0,s[0]=={},s[1]=={1,2,6}`
	- `DFAedge(s[0],'a')=={}==s[0]` -> `trans[0,'a']=0`
	- `DFAedge(s[0],'b')=={}==s[0]` -> `trans[0,'b']=0`
	- `j=j+1==1`
- `p==1,j==1,s[0]=={},s[1]=={1,2,6}`
	- `DFAedge(s[1],'a')=={3,4,7,8}` -> `p=p+1==2,s[2]={3,4,7,8},trans[1,'a']=2`
	- `DFAedge(s[1],'b')=={}==s[0]` -> `trans[1,'b']=0`
	- `j=j+1==2`
- `p==2,j==2,s[0]=={},s[1]=={1,2,6},s[2]=={3,4,7,8}`
	- `DFAedge(s[2],'a')=={}==s[0]` -> `trans[2,'a']=0`
	- `DFAedge(s[2],'b')=={5,8}=={}` -> `p=p+1==3,s[3]={5,8},trans[2,'b']=3`
	- `j=j+1==3`
- `p==3,j==3,s[0]=={},s[1]=={1,2,6},s[2]=={3,4,7,8},s[3]=={5,8}`
	- `DFAedge(s[3],'a')=={}==s[0]` -> `trans[3,'a']=0`
	- `DFAedge(s[3],'b')=={}==s[0]` -> `trans[3,'b']=0`
	- `j=j+1==4`
- `j==4>p==3`, end

> [!info]- 表格
>
> `states` 表格
>
> | j |  States          |
> | :----- | :----------------------- |
> | 0      | $\{\}$                   |
> | 1      | $\{s 1, s 2, s 6\}$      |
> | 2      | $\{s 3, s 4, s 7, s 8\}$ |
> | 3      | $\{s 5, s 8\}$           |
> 
> `trans` 表格
> 
> |              | a | b |
> | :----------- | :----------- | :----------- |
> | $\mathbf{0}$ | 0            | 0            |
> | $\mathbf{1}$ | 2            | 0            |
> | $\mathbf{2}$ | 0            | 3            |
> | $\mathbf{3}$ | 0            | 0            |
> 
> 第 p 轮的时候，DFAedge 的计算结果
> 
> | p|j|c | DFAedge(states[j], c)    |
> | :----------- | :----------- | :----------- | :----------------------- |
> | 1            | 0            | a            | $\{\}$                   |
> | 1            | 0            | b            | $\{\}$                   |
> | 1            | 1            | a            | $\{s 3, s 4, s 7, s 8\}$ |
> | 2            | 1            | b            | $\{\}$                   |
> | 2            | 2            | a            | $\{\}$                   |
> | 2            | 2            | b            | $\{s5, s8\}$             |
> | 3            | 3            | a            | $\{\}$                   |
> | 3            | 3            | b            | $\{\}$                   |

**注意**：为了满足“等长优先”的匹配规则，我们将每一个 DFA 终止状态（集合）中最优先的取出来，当做这个 DFA 的实际状态。比如说：`s[1]={1,2,6}`，同时 2 和 6 是终止状态且 `2 > 6`，那么我们就让 `actual_state[1]=2`

#### DFA optimization/minimization

> [!example]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_18_11_9_20250227181108.png"/>
> 
> 如上图：`{5,6,8,15}` 和 `{6,7,8}` 是“等价”的，因此可以合并

> [!info] 定义（等价）
> 
> 如果自动机从两个状态开始，能够接受的字符串完全一样，那么称这两个状态等价

> [!warning]
> 
> 没有等价状态，只是 DFA 最优的必要不充分条件。也就是说，即便我们消解的所有等价状态，DFA 依然可以是 suboptimal 的

> [!info] 定义（可区分状态）
> 
> - 如果从状态 `s` 和状态 `t` 开始，沿着标有字符串 `x` 的路径到达的状态中，**恰好只有一个**是终态，那么字符串 `x` 就区分了状态 `s` 和状态 `t`。
> 	- 也就是说，`s --x--> s', t --x--> t'`，只有 `s'` 或者 `t'` 其中之一是 final state
> - 如果存在**至少一个**字符串可以区分状态 `s` 和状态 `t`，那么状态 `s` 就可区分于状态 `t`。

由于直接找出 equivalent state 是困难的，因此我们的算法，就是**找出所有可区分的状态**

##### 算法步骤

> [!info]
> 
> 这个算法，实际上相当于：从空串开始，逐渐增加字符串的长度，并进行区分。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_18_42_39_20250227184239.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_18_43_7_20250227184306.png"/>

##### 算法示例

> [!info]
> 
> 看着就是要用并查集的

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_18_43_54_20250227184354.png"/>

**走一遍流程**：

- `Pi={ABCD,E}`
	- `a`: A->B, B->B, C->B, D->B; E->B
	- `b`: A->C, B->D, C->C, D->E; E->B
		- 这里 ABCD 就要分成 ABC, D 两个 subgroup 了。因为 A,B,C -> ABCD，但是 D -> E
- `Pi={ABC,D,E}`
	- `a`: A->B, B->B, C->B; D->B; E->B
	- `b`: A->C, B->D, C->C; D->E; E->B
		- 这里 ABC 就要分成 AC, B 两个 subgroup 了。因为 A,C -> ABC，但是 B -> D
- `Pi={AC,B,D,E}`
	- `a`: A->B, C->B; B->B; D->B; E->B
	- `b`: A->C, C->C; B->D; D->E; E->B
		- 这里不需要分了。毕竟对于 `a` 而言，A,C -> B; 对于 `b` 而言，A,C -> C

然后，在这些新状态之间连上线, which is trivial。Done. 最终结果在上图的右下角。

### Software: Fast LEX (FLEX)

我直接让 Gemini 2.0 Pro 写了一篇入门教程，就放在这了。

#### 什么是 Flex？

Flex（Fast Lexical Analyzer Generator）是一个用于生成词法分析器的工具。词法分析器（也称为扫描器）是编译器或解释器的重要组成部分，负责将输入的字符序列分解成一个个有意义的标记（Token），供后续的语法分析阶段使用。

Flex 的主要优势在于：

*   **快速高效：** Flex 生成的词法分析器以速度著称，能够快速处理大量文本。
*   **易于使用：** Flex 使用简洁的声明式语法，通过正则表达式来描述词法规则，大大简化了词法分析器的开发过程。
*   **与 Yacc/Bison 集成：** Flex 通常与 Yacc 或 Bison 等语法分析器生成器结合使用，构建完整的编译器或解释器。

#### Flex 文件结构

一个典型的 Flex 文件（通常以 `.l` 为扩展名）由三个部分组成，用 `%%` 分隔：

```flex
%{
// 定义部分 (Definitions)
// C 代码包含区，这里的代码会被原样复制到生成的 C 代码中
#include <stdio.h>
int charCount = 0;
%}

// 正则表达式的缩写定义
digit [0-9]

%%
// 规则部分 (Rules)
// 模式-动作 对
{digit}+   { printf("发现一个整数: %s\n", yytext); }
.        { charCount++; } // 匹配任意单个字符

%%
// 用户代码部分 (Auxiliary Routines)
// 辅助函数，会被原样复制到生成的 C 代码中
int main() {
    yylex(); // 调用 Flex 生成的词法分析函数
    printf("总字符数: %d\n", charCount);
    return 0;
}
```

1.  **定义部分 (Definitions)**

    *   `%{ ... %}` 之间的内容：包含 C 代码，如头文件包含、全局变量声明等。这些代码会被原样复制到生成的 C 代码文件的开头。
    *   正则表达式缩写：可以为常用的正则表达式定义别名，方便后续使用。例如：`digit [0-9]` 定义了 `digit` 代表数字。

2.  **规则部分 (Rules)**

    *   由一系列 **模式-动作** 对组成。
    *   **模式**：使用正则表达式描述要匹配的文本模式。
    *   **动作**：当模式匹配成功时执行的 C 代码。
    *   `yytext`：Flex 提供的变量，指向当前匹配到的文本。
    *   `yyleng`：Flex 提供的变量，表示当前匹配到的文本的长度。

3.  **用户代码部分 (Auxiliary Routines)**

    *   包含辅助函数，如 `main` 函数。
    *   `yylex()`：Flex 生成的词法分析函数，调用它开始进行词法分析。

#### 示例：统计单词、数字和行数

让我们创建一个更全面的示例，该示例将统计输入文本中的单词数、数字数和行数。

```flex
%{
// 定义部分
#include <stdio.h>

int wordCount = 0;
int numberCount = 0;
int lineCount = 0;
%}

// 正则表达式缩写
letter [a-zA-Z]
digit [0-9]
whitespace [ \t\r]+

%%
// 规则部分
{letter}({letter}|{digit})*  { wordCount++; printf("Word: %s\n", yytext); }
{digit}+                   { numberCount++; printf("Number: %s\n", yytext); }
\n                         { lineCount++; }
{whitespace}               { /* 忽略空白字符 */ }
.                          { /* 忽略其他字符 */ }

%%
// 用户代码部分
int main() {
    printf("请输入文本 (Ctrl+D 结束):\n");
    yylex();
    printf("\n统计结果:\n");
    printf("单词数: %d\n", wordCount);
    printf("数字数: %d\n", numberCount);
    printf("行数: %d\n", lineCount);
    return 0;
}
```

**代码解释：**

*   **定义部分：**
    *   声明了三个计数器变量：`wordCount`、`numberCount` 和 `lineCount`。
    *   定义了三个正则表达式缩写：`letter`（字母）、`digit`（数字）和 `whitespace`（空白字符）。
*   **规则部分：**
    *   `{letter}({letter}|{digit})*`：匹配由字母开头，后跟字母或数字的单词。
    *   `{digit}+`：匹配一个或多个数字。
    *   `\n`：匹配换行符，用于统计行数。
    *   `{whitespace}`：匹配空白字符（空格、制表符、回车），但不执行任何动作（即忽略）。
    *   `.`：匹配任何其他单个字符，也不执行任何动作。
*   **用户代码部分：**
    *   `main` 函数提示用户输入文本，然后调用 `yylex()` 开始词法分析。
    *   最后，打印统计结果。

**编译和运行：**

4.  **保存：** 将代码保存为 `word_count.l` 文件。
5.  **编译：** 使用 Flex 编译该文件：
    ```bash
    flex word_count.l
    ```
    这将生成一个名为 `lex.yy.c` 的 C 代码文件。
6.  **链接：** 使用 C 编译器（如 GCC）编译并链接 `lex.yy.c`：
    ```bash
    gcc lex.yy.c -o word_count -lfl
    ```
    *   `-lfl` 选项用于链接 Flex 库。
7.  **运行：** 运行生成的可执行文件：
    ```bash
    ./word_count
    ```
    现在，您可以输入文本，程序将统计单词数、数字数和行数。

