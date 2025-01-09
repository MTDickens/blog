
## Compilers and Static Analyzers: Difference

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403181511020.png" alt="image-20240318151143154" style="zoom:50%;" />

如上图，这就是 compiler 会做的事情

1. 通过正则表达式检查词法：单词拼写对不对？
2. 通过下推自动机检查语法
3. 通过属性语法检查类型
4. 翻译成 IR
5. 翻译成二进制码

其中，1~4 属于前端，5 属于后端。

为什么要翻译成 IR 呢？因为编译器要做优化。即使不做优化，也要进行 bug、安全漏洞的检查。

## AST vs.IR: Difference

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403181541345.png" alt="image-20240318154125740" style="zoom: 50%;" />

如上，IR 的好处就是

- 接近机器语言
    - 显然
- 语言无关
    - 从而分析一种 IR，就可以分析多种可以转换成这种 IR 的语言
    - “前后端分离”：前端负责把所有语言转换成这一种 IR，后端负责分析这个 IR
- 非常紧凑、简介
    - 没有 AST 里面的 `do-while`, `body`, `assign` 等冗余信息
- 与 AST 相比，IR 含有直接的数据流信息
    - 显然

## IR: Three-Address Code(3AC)

Definition: 

- There is **at most one operator** on the right side of an instruction.
- Each 3AC contains **at most 3 addresses**

e.g. `c = a + b + 3` &longrightarrow; `t1 = a + b, c = t1 + 3`

**NOTE:** Address can be one of the following

- Name: a, b, c
- Constant: 3
- Compiler-generated temporary: t1

## 3AC in Real Static Analyzer: Soot

### Example 1

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403181643193.png" alt="image-20240318164340495" style="zoom: 50%;" />

注意：

1. `<clinit>` 就是对静态变量的一个初始化操作
    - 也就是说，在程序运行到某个类型的一瞬间（比如说 `B b = ...` 中的 `B`，不管有没有 `new`），就会调用 `<clinic>`
2. 由于我们没有显式定义 `<init.`，因此在 `<init>` 里面，需要让 r0 调用其父类的构造函数，也就是 `specialinvoke`

### Example 2

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403181626635.png" alt="image-20240318162628809" style="zoom:50%;" />

注意：

1. \$r0 是 `this` 指针。
    - `this` 在 static method 不存在（如 Example 1 里的 `public static void main`，因为 static method 就是一个类的静态方法，并不是某个对象特有的）
2. \$r3 \~ \$r6 都是 `java.lang.StringBuilder`，可以之后隐式类型转换成 `java.lang.String`



### Sidenote: JVM `invoke`'s

`invokespecial`: call constructor, call superclass methods, call private methods

`invokevirtual`: instance methods call (virtual dispatch)

`invokeinterface`: cannot optimization, checking interface implementation

`invokestatic`: call static methods

**Java 7:** `invokedynamic` - Java static typing dynamic language runs on JVM

### Sidenote: Method Signature

The structure of signature in Java is 

```
[Class Name]: [Return Type] [Method Name]([parameter types]) 
```

For example, a constructor in Java might be:

```
specialinvolk java.lang.StringBuilder: void <init>()
```



## Static Single Assignment(SSA)

SSA 是一个过时的技术。它主要有两个特征：

1. Every variable has exactly one definition
2. 在 control flow merges 中，使用 operator &varphi;.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403190018224.png" alt="image-20240319001827079" style="zoom: 50%;" /><img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403190019668.png" alt="image-20240319001905885" style="zoom:33%;" />

## Basic Blocks (BB)

Basic Block 就是一段连续的 3AC，其中

- 只有第一个指令可以通过 goto, jump 等跳转到
- 只有最后一个指令可以通过 goto, jump 等跳走

### 算法

算法的目的是分化出尽可能少的 blocks。

我们不妨称一个 basic block 的第一个指令为 leader。因此，我们希望 leader 越少越好。

那么：

- 第一条指令是 leader
    - 显然的
- 所有**被（条件）跳转到**的指令是 leader
    - 显然的
- 所有**（条件）跳转指令的下一条指令**是 leader
    - 因为本条指令必须代表着一个块的结束，因此下一条指令必须代表一个块的开始

### Example

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403190052014.png" alt="image-20240319005213299" style="zoom:50%;" />

## Control Flow Graphs(CFG)

通过 basic block，我们就可以画出 control flow graph。

**规则：**A 到 B 需要连一条边，当且仅当

1. A 末尾为**条件跳转**，B 紧邻 A 之后
2. A 末尾为**条件跳转**，B 是 A 的跳转对象
3. A 末尾**不跳转**，B 紧邻 A 之后
4. A 末尾为**无条件跳转**，B 是 A 的跳转对象

由此可见，无条件跳转和不跳转都只有一个出口，而条件跳转有两个出口。