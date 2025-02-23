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

### Implementation

#### RE -> DFA

我们会把所有规则的正则表达式转换成对应的 DFA。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/17_12_27_50_20250217122749.png"/>

#### Multiple DFAs -> Aggregated DFA

> [!warning]- 实际的转换步骤
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

### Conversion Algorithm

*(TODO)*