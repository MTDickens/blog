# 抽象语法

## 语义动作（semantic actions）

我们以加减乘除的计算机为例。假设我们有下面的 tokens：

- `num`
- `+`, `-`, `*`, `/`
- `(`, `)`

那么，我们的 semantic actions 就类似于下面这样：

```c
case NUM:
	return $1;
case PLUS:
	return $1 + $2;
case MINUS:
	return $1 - $2;
case MULT:
	return $1 * $2;
case DIV:
	return $1 / $2;
case PARENTHESIS: // LPAREN E RPAREN
	return $2; // return E
```

> [!note]
> 
> 实际上，AST 的构建就是靠这个 semantic actions

### 例子

由于符号本身和值是绑定的，因此我们可以直接将符号栈和值栈二合一（如下图）：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/26_23_17_5_20250326231705.png"/>

## 为什么需要抽象语法

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/24_10_34_47_20250324103446.png"/>

如上图：

- 抽象语法树里面有很多冗余信息（比如括号）
- 因此，如果直接传递抽象语法树的话，不仅会徒增很多冗余信息，而且会导致语法树过度依赖具体文法
	- 如果具体文法做了改动，那么就会导致语法树大变


## Positions

由于抽象语法树相比源代码已经“面目全非”。因此，在 parsing 之后，如果我们在 semantic analysis 中发现错误并报错，那么由于报错信息中**没有位置信息**，因此我们就无法定位到源代码中的错误。

因此，我们一般会在构建 ast 的时候，**往 ast 的节点中主动加入位置信息**。

## Semantic Analysis

语义分析，基本可以起三种功能：

1. Scope and visibility of names
	- every identifier is declared before use
2. Type of variables, functions and expressions
	- every expression has a proper type
	- function calls should conform to definitions
3. 将 AST 翻译成一个更加简单、更容易转换成机器码的表达方式，即 IR (Intermediate Representation)

### Symbol Tables

#### A Motivating Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_0_34_10_20250327003410.png"/>

因此，一个符号表至少需要支持 4 个操作（对于某个 binding）：

1. 插入
2. 查找
3. `beginScope`: 进入新作用域
4. `endScope`: 离开当前作用域

> [!example] 多重符号表
> 
> 在一些语言中，同一时刻可能会存在**多个 active environment**。
> 
> 以支持前向引用的 Java 为例：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_0_45_26_20250327004525.png"/>
> 
> 我们首先完整扫描一遍文件，求出以 class 为单位的所有符号表。然后，我们在所有符号表均 active 的前提下，自前往后扫描第二遍，对 class 内部进行检查
> 
> 以不支持前向引用的 ML 为例：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_0_45_39_20250327004538.png"/>
> 
> 我们从头到尾扫描一遍即可。

#### 符号表的类型

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_0_50_7_20250327005006.png"/>

如上图：

- 对于命令式，我们**只在全局维护一个统一的符号表**，以及一个 undo stack。前者用于追踪目前环境的符号；后者用于在退出某个环境的时候，可以 pop 掉所有该环境的符号
- 对于函数式，我们将每一个环境都分开记录

##### 命令式

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_11_31_52_20250327113152.png"/>

> [!example]- 三种基本操作：Pop, Lookup, Insert
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_11_38_41_20250327113840.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_11_39_35_20250327113935.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_11_39_44_20250327113943.png"/>

如上图，技术上主要有三点：

- 使用哈希表，保证 $\mathcal O(1)$ 的查找速度
- 哈希表的每一个 bucket 里面，都是一个链表
	- 链表的每一项，代表同一个 symbol 在不同 scope 中的 binding
	- 链表的表头，就是该 symbol 在当前 scope 中的 binding
- 此外，我们再额外维护一个链表：每插入一个符号，就在其头部进行插入；每 enterScope，就做一个记号；每 endScope，就从头部开始一直删除，直到删除到记号位置

##### 函数式

实际上，我们这里就是运用了类似于“可持久化数据结构”的方法

- 可持久化，其重要特征有二
	- 一是**保留所有历史信息**
	- 二是**数据的不可变性**（即我们不能修改原有内容，而是只能用最新的数据建立一个新的数据结构）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_12_4_59_20250327120458.png"/>

我们这里的树，保留了所有历史信息，并且保证**除了 `endScope` 以外，不会对任何数据结构进行删除操作**。

具体来说：

- 当我们插入 `mouse` 的时候
	- 搜索路径如下：m2 -> (dog, m1) -> (dog, m1) 的右子节点, which is NULL
	- 此时，我们在 (dog, m1) 这里的右子节点进行插入，而是**将 (dog, m1) 复制成 (dog, m2)，插到 m2 里面，最后在 (dog, m2) 的右子节点处插入 (mouse, m2)**
- 在插入 `mouse` 之后，我们搜索 camel 的时候
	- 搜索路径如下：m2 -> (dog, m2) -> (bat, m1) -> (camel, m1)
- 在找到 `camel` 之后，我们 `endScope`
	- 删除整个 m2，并且将当前的 scope 切换到 m1


**注意**：上面两种方法，第一种插入、查找快，删除慢；第二种插入、查找略慢，但是删除快。两种都是常用的方法。

### 转载：Tiger编译器符号相关的实现 ([Source](https://cubicy.icu/compiler-construction-principles/#Tiger%E7%BC%96%E8%AF%91%E5%99%A8%E7%AC%A6%E5%8F%B7%E7%9B%B8%E5%85%B3%E7%9A%84%E5%AE%9E%E7%8E%B0))

> [!note]
> 
> Tiger 编译器用的其实就是第一种方法（简单、容易实现）。
> 
> 我们这里是讲一讲具体的 implementation tricks

在哈希表中的链表进行 lookup 时，不断进行字符串比较是很耗时的。

- 解决办法：使用新的数据结构将符号对象关联到一个整数上（哈希值）

Tiger 编译器的 environment 是 destructive-update 的。也就是说，有两个函数：

- `S_beginScope`: 记下当前符号表的状态
- `S_endScope`: 恢复到最近的、还未被恢复的 `S_beginScope` 记下的状态

我们引入一个 **辅助栈(Auxiliary stack)** 来维护上文提到的必要的额外信息:

- 符号入栈时，会将 binding 联动地插入对应 bucket 的链表头
- 弹出栈顶符号时，对应 bucket 的链表头也会联动地被移除
- beginScope: 压入一个特殊标记到辅助栈中
- endScope: 一直弹出符号直到弹出了一个特殊标记
    - 可以由此标记推断：此次因为退出 scope 引发的 restore 操作可以就此结束

### Type Checking

> [!info]
> 
> 我们基于 AST，检查一些静态的性质、规则是否被满足
> 
> 我们要回答的关键问题包含三个：
> 
> 1. 哪些类型表达式是合法的/非法的？
> 	- e.g. `int`, `string`, `nil`, `array` of `int`
> 2. 如何定义”两种类别是等价的“
> 3. What are the type-checking rules?

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_18_6_58_20250327180657.png"/>

#### Type Equivalence

有两种等价的定义：

- Name Equivalence: if they are **defined by the exact same type declaration**
	- `a = {x: int, y:int}; b = a`，则 `a == b`
	- `a = {x: int, y:int}; b = {x: int, y: int}`，则 `a != b`
- Structural Equivalence: if they are composed of **the same constructors applied in the same order**.
	- `a = {x: int, y:int}; b = a`，则 `a == b`
	- `a = {x: int, y:int}; b = {x: int, y: int}`，则 `a == b`

对于 tiger 语言，我们用 name equivalence

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_18_30_12_20250327183011.png"/>

#### Namespaces in Tiger

Tiger 有两套 namespaces:

- types
- functions and variables

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_18_34_11_20250327183411.png"/>

对于两个 namespaces，我们分别用一下两种方式来维护：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/27_18_35_48_20250327183547.png"/>

### Type Checking in Action

- Type-checking expressions
    - `transExp`可以在给定的两个环境下将输入的表达式标记上type（如果发现非法则报错）
- Type-checking **declarations**
    - 在Tiger语言中声明只可能在`let`语句中出现
    - **变量声明**：如果提供了变量类型，则检查初始化表达式类型是否匹配；否则直接通过初始化表达式类型获得变量类型
	    - 比如 `let int a = 3 in ...`
    - **类型声明**：**递归地**获取类型别名对应的实际类型。
	    - 比如 `let type a = b`, `type b = {first: int, rest: a} in ...`
        - Q: 如何处理递归声明 `type list = {first: int, rest: list}`？A: 不使用one-pass而是two-pass，如下
	        - pass#1: 记录声明头部（左侧）放入环境
	        - pass#2: 完成
        - 不允许类型的直接循环引用(`type a=b;type b=a`)：必须通过record或array完成(`type a=b;type b={i:a}`)
    - **函数声明**：检查形参、返回值与函数体
	    - 比如 `let int fib (int a) = {...} in ...`
        - Q: 如何处理递归声明？A: 不使用one-pass而是two-pass，如下
	        - pass#1: 记录函数声明（签名）放入环境
	        - pass#2: 处理函数体

**注意**：在 C 语言中，initialization 和 declaration 是不一样的。如果两者存在”循环使用“的情况，那么就需要 declaration 在前。这样做，只需要 one pass 即可。

当然，对于更加现代的语言，就没有所谓 declaration 了。但是这样做，编译器就需要 two passes。

