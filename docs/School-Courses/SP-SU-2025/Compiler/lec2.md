# Parsing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_20_6_45_202502272006608.png"/>

简单来说，直到 parsing 这一步，我们才涉及到 grammar，也就是需要在意上下文了。

关于 CFG、EBNF 格式这些东西，since they are trivial, they won't be discussed here.

## 推导和规约

### 定义

假如我们有产生式 $A \to \gamma$，那么可以有这样的变换：$\alpha A \beta \Rightarrow \alpha \gamma \beta$。我们可以说：

- $\alpha A \beta$ 直接**推导 (derive)** 到 $\alpha\gamma\beta$
- $\alpha\gamma\beta$ 直接**规约 (reduce)** 到 $\alpha A \beta$

不难看出：**推导**=从文法生成语言里的句子，**规约**=识别句子成分并逐渐规约到开始符号

### 最左推导和最右推导

- 最左推导=每步代换最左边的非终结符。逆过程为最右规约
- 类比可得出最右推导、最左规约的定义
- 在自顶向下的分析中，总是采用**最左推导**；在自底向上的分析中，总是采用**最左归约**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/3_11_4_17_20250303110416.png"width="70%"/>

## Parse Tree

- 分析树性质
    - 根节点=文法初始符号
    - 叶节点=终结符
    - 内部节点=非终结符
    - 父节点→{叶节点}=产生式
- 语法分析(Parsing)中的挑战  
    **核心目标：对于终结符号串 x，要么从 S 推导出 x，要么设法将 x 规约到 S**
    - 自顶向下(Top-down) S->x, 从**根节点**开始构造Parse Tree
    - 自底向上(Bottom-up) x->S, 从**叶节点**开始构造Parse Tree
    作为搜索问题：搜索空间大->空间大小受文法产生式限制。
    - 无限制文法：时间复杂度 $O(n^3)$
	    - 可以想象：如果自底而上的话，最差情况下，需要将当前字符串 $s$ 的所有子串 $s[i:j]$ 遍历一遍，然后只能将 $s$ 的长度减小 1。从而，时间复杂度就是：$O(\sum_{i=1}^n \frac {i(i+1)} 2 + 1) = O(n^3)$
    - 上下文无关语言 CFL 的子集需要的典型时间为 $O(n)$，例如
        - Predictive parsing using LL(1) grammars
        - Shift-Reduce parsing using LR(1) grammars
        - ……

## Ambiguous Grammar

> [!example] A good example
> 
> 如果词法这样（摘自于 SysY 词法）：
> 
> ```ebnf
> Exp ::= AddExp;
> 
> MulExp ::= UnaryExp | MulExp ("*" | "/") UnaryExp;
> AddExp ::= MulExp | AddExp ("+" | "-") MulExp;
> 
> UnaryExp ::= Number;
> ```
> 
> 那么 `2 / 2 * 5 + 3` 只能是
> 
> ```
> E
> |
> A___
> | \ \
> A + M_
> |     \
> M___  U_
> |\  \   \
> M * U_  3
> |     \
> M / U 5
> |   |
> U   2
> |
> 2
> ```
> 
> 也就是：`(((2 / 2) * 5) + 3)`

> [!example] A bad example
> 
> 但是，假如说不讲章法，直接乱来：
> 
> ```ebnf
> Exp ::= Exp | Exp ('+' | '-' | '*' | '/') Exp | Number;
> ```
> 
> 那么，`((2 / (2 * 5)) + 3)` 可以，`(2 / (2 * (5 + 3)))` 也可以。但是这两个都不符合四则运算的优先级。

从上面两个例子中，我们可以粗浅看出：如果希望将隐式的四则变量优先级，变成 EBNF 中显式的优先级，那么就必须要

- 加入更多 non-terminals (即 `AddExp, MulExp` 等等这些)
	- 从而可以迫使一些 `?Exp` 必须在另一些 `?Exp` 之后才能被生成出来

可以[证明](https://cstheory.stackexchange.com/questions/4352/how-is-proving-a-context-free-language-to-be-ambiguous-undecidable)，任意 CFG 的二义性是 undecidable 的。因此，我们需要使用 unambiguous grammars 来保证无二义性：

- 自顶向下：LL(1)
- 自底向上：LR(1), LALR(1)

## 复杂度类简介

> [!info]+ Complexity Hierarchy
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/3_11_22_19_20250303112219.png" width="50%"/>

- LL grammar
	- 终结符长度只有 k 个字符
	- ${\displaystyle {\begin{array}{ccccccc}S&\Rightarrow ^{L}&w_{1}A\chi &\Rightarrow &w_{1}\nu \chi &\Rightarrow ^{*}&w_{1}w_{2}w_{3}\\S&\Rightarrow ^{L}&w_{1}A\chi &\Rightarrow &w_{1}\omega \chi &\Rightarrow ^{*}&w_{1}w'_{2}w'_{3},\\\end{array}}}$
		- 对于上面的情况，如果 $\nu \neq \omega$，那么 $w_2w_3, w_2'w_3'$ 的前 k 个字符必然不同

## Types of Parsers for Grammars

有三种：

- Universal：可以适配任何 grammar，但是过于 inefficient
- Top-Down (LL grammar, i.e. Left-to-right Leftmost-derivation)：从 root 到 leaves
- Bottom-Up (LR grammar, i.e. Left-to-right Rightmost-derivation)：从 leaves 到 root

这种 Universal Parsing 是带回溯机制的，因此可想而知，处理起来基本上不可能是 $O(n)$。

不论是 TD 还是 BU，两者都是从左到右一个一个字符处理的，能够达到线性复杂度（想想看，对于巨型工程而言，$O(n^2)$ 完全不可接受）。因此能够识别的文法有限（LL 和 LR）。但是即便是这些文法的语法，也够我们用了。

至于 TD 和 BU 的区别：

- TD 支持的 LL 文法类比 BU 的 LR 文法类更狭窄
- 我们可以手工实现 TD parser
- 但是只能用自动化工具生成 BU parser（比如 yacc、bison、menhir）

## Top-Down Parsing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/8_20_11_46_20250308201145.png"/>

如上图：

- 首先，我们有一个 `S`，以及一个 `begin print num`
- 读入一个 token (`begin`)，我们发现只有 `begin S L` 能够匹配，因此 `S -> begin S L`，目前是 `begin S L`
- 读入一个 token (`print`)，我们发现只有 `print E` 能够匹配，因此 `S -> print E`，目前是 `begin print E L`
- 读入一个 token (`num`)，我们发现只有 `num` 能够匹配，因此 `E -> num`，目前是 `begin print num L`
- 读入一个 token (`<EOF>`)，我们发现只有 `end := <EOF>` 能够匹配，因此 `L -> end := <EOF>`，目前是 `begin print num <EOF>`

### 递归下降分析

#### Naive Parsing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/8_20_25_55_20250308202554.png"/>

如上图，我们把每一个非终结符抽象成一个函数（比如 `L` 这个非终结符就是 `void L(void)` 这个函数）

```python
def parser(tokens = ['BEGIN', 'PRINT', 'NUM', '\0']):
	global getToken
	def getToken():
		try:
			cur_tok = next(getToken.get)
			return cur_tok
		except AttributeError:
			getToken.get = lexer()
			cur_tok = next(getToken.get)
			return cur_tok
	global li
	li = tokens
	try:
		S()
		try:
			getToken()
			raise Exception("parse failed") # not complete
		except:
			print("parse succeeded")
	except:
		raise Exception("parse failed") # can't parse

def L():
	advance()
	print(tok)
	if tok == "\0":
		eat("\0")
	elif tok == ";":
		eat(";")
		S()
		L()
	else:
		raise Exception()

def S():
	advance()
	print(tok)
	if tok == "IF":
		eat("IF")
		E()
		eat("THEN")
		S()
		eat("ELSE")
		S()
	elif tok == "BEGIN":
		eat("BEGIN")
		S()
		L()
	elif tok == "PRINT":
		eat("PRINT")
		E()
	else:
		raise Exception()

def E():
	advance()
	print(tok)
	if tok == "NUM":
		eat("NUM")
	else:
		raise Exception()

def eat(t):
	assert tok == t
	advance()

def advance():
	global tok
	tok = getToken()



def lexer():
	"""
	这里简化成这样
	"""
	for i in li:
		yield i
	yield None # 已经用尽了所有字符
	
```

#### Optimization: Predictive Parsing

> [!warning]+ Naive method 的问题
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/8_22_40_12_20250308224012.png"/>
> 
> 但是，上文没有考虑到需要回溯的情况：比如，我需要 parse 一个四则运算。那么：
> 
> 1. 假设第一个 token 是 `NUM(114514)`，那么我应该使用哪一条规则呢？
> 2. 目前的非终结符是 `S`，因此只能是 `S -> E$`
> 3. 然后，目前的非终结符是 `E`，可选项有 `E -> E + T` 和 `E -> E - T`。该选哪一个？我们根据目前信息无从下手。
> 4. 因此，只能两个都试一遍，第一个成功就选第一个，否则试第二个。**这就产生了分支**
> 5. 之后在每一个非终结符处，都可能会有分支，导致算法复杂度最差能达到指数级别
> 
> 在产品级编译器中，parsing 时间占据大约 1/3，是耗时的大头，因此亟待优化。

##### 一些定义

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_4_33_23_20250309043322.png"/>

上面是 LL(1) 文法的。对于 LL(k) 文法，我们将 $t$ 定义为长度为 $k$ 的 terminal symbols 即可。

- 不难发现，对于字符集 $\Sigma$ 而言，LL(k) 文法的 $\operatorname{First}(\gamma)$ 里面可能有 $|\Sigma|^k$ 个元素，是指数级增长的

##### 如何选择生成规则

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_5_42_43_20250309054242.png"/>

要么：

- $\gamma$ 能够某种推导中，第一个字母是 $t$
	- $t$ 由 $X$ 生成出来
- $\gamma$ 的够某种推导中，推导成 $\epsilon$ (即空串)，且 $S \rightarrow^\ast \beta Xt \delta$
	- $t$ 由 $X$ 后面东西的生成出来，而 $X$ 本身是个空串

##### 如何计算 Nullable, First 和 Follow

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_6_1_47_20250309060146.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_6_3_22_20250309060322.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_6_3_33_20250309060332.png"/>

- 先把 nullable 推出来
	- 至于手动推导的方法，其实不需要严格按照算法一步步推
- 然后把 first 推出来
- 最后把 follow 推出来

下面是（虎书中的）完整算法：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_9_5_25_20250309090524.png"/>

- 这里其实是在**同步计算** nullable, first 和 follow 三者，和我们之前讲的逐个模块计算不同

##### 如何得到 Predictive Parsing Table

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/9_10_4_50_20250309100450.png"/>

“如何选择”一章已经说过：我们需要构造一个分别为 Next Token (T) 以及 Non-Terminal Symbols (X) 的表格（如上图左下角所示）。我们这里再重复一遍。

> [!info] 构造表格的规则
> 
> 如果：
> 
> - T 属于 First(gamma)，且 X -> gamma
> - 或者，gamma is Nullable，且 T 属于 Follow(X)，且 X -> gamma
> 
> 那么就将这个转换规则填入对应表格

构造完成之后，如果一个表格有**超过一条**规则，就是错误的。

- 比如，这个例子就是错误的，因为 (Z, d) 有两条规则
- 不过，对于一个更简单的例子——检测括号是否匹配——如果我们用 `S -> (S) S; S -> eps`，那么显然可以满足上述条件，因此检测括号这个确实是 LL(1)

###### 反例以及修改

举一个简单的例子（`T` 是终结符）：

```
E -> E + T
E -> T
```

那么，显然，`T`, `T + T`, `T + T + T` 等等就属于这个语言。

但是，如果让我们做一张表：


|     | Nullable | first | follow |
| --- | -------- | ----- | ------ |
| E   | False    | T     | +      |

|     | +   | T                    |
| --- | --- | -------------------- |
| E   |     | E -> E + T<br>E -> T |

所以，`T` 有两条，重复了。那么，如何修改推导规则呢？我们可以改成：

```
E  -> T E'
E' -> + T E'
E' -> \epsilon
```

|     | Nullable | first | follow |
| --- | -------- | ----- | ------ |
| E   | False    | T     | +      |
| E'  | True     | +     |        |

|     | +            | T         | $\varepsilon$  |
| --- | ------------ | --------- | -------------- |
| E   |              | T -> T E' |                |
| E'  | E' -> + T E' |           | E' -> \epsilon |

这样就没有问题了。

##### 如何将某些文法修改成符合 LL(1) 的

> [!info]
> 
> 下面的 `a, b, c` 等等，可以是单个字符，**也可以是字符串**。
> 
> - 比如，`E -> E + T` 中，`a` 就是 `+ T`

###### 立即左递归

对于

```
A -> Aa
A -> b
A -> c
```

这样的**立即左递归 (immediate left recursion)** 文法（其实就是对应语言 `b, ba, bc, baa, bac, bca, bcc, baaa, baac, ...`），我们可以直接改成**立即右递归文法**

```
A  -> bA'
A  -> cA'

A' -> aA'
A' -> \epsilon
```

从而得到满足 `LL(1)` 的文法。

> [!example]+ 例子：四则运算
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/18_2_17_58_20250318021758.png"/>
> 
> 如上图，我们把所有左递归形式（即 `T -> T <op> F` 以及 `E -> E <op> T`），都改成了右递归形式。这样就将四则运算的文法改成了 LL(1)。
> 
> 然后，根据上面改后的文法，我们可以得到驱动表*（请忽略图中那个红点\~）*：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/18_2_22_4_20250318022204.png"/>

> [!warning]+ Limitation
> 
> 上面举的例子，可以处理所有**立即左递归**。但是对于**非立即左递归**（i.e. 通用左递归），就要用更高级的办法了。

###### Left Factoring

如果两个推导式之间有公共前缀的话，那么也会导致驱动表中的重复问题。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/18_2_33_36_20250318023335.png"/>

##### Error Recovery

如果我们遇到了语法错误——也就是说，上述规则都不适用了——那么我们最好能够在输出这个错误之后，**从错误恢复过来，然后继续执行下去**。

- 否则，在现实中，一次编译只输出一个错误，那么用户就需要编译很多遍，才能把错误都改完，造成很大不便

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/18_2_22_4_20250318022204.png"/>

以 `(1++1) * 3+2)` 这个包含两个错误的地方，如果按照上面的驱动表来做的话，就是这样 `S -> E$ -> T E'$ -> F T' E'$ -> (E) T' E'$ ->* (id T' E') T' E'$ ->* (id + T E') T' E'$ -> <stuck>`。目前，我们有两个选择：

1. 增加字符，直到能够继续运作。比如增加一个 `id` 之类的。但是，问题在于：第一，增加什么字符；第二，如何保证停机
2. 减少字符，直到能够继续运作。比如减少 `+`。好处就在于必然可以停机

### 总结

我们可以为简单的编程语言（LL(K)），**手工**设计一个 top-down parser，以线性时间复杂度进行 parsing 以及 error correction。

## Bottom-Up Parsing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/18_3_39_16_20250318033915.png"/>

相比 LL(k) 强大之处：

- 不是只看前 k 个 token 就做选择，而是看到整个产生式右部之后再做选择
	- 也就是将 make decision 的时机推迟到了 entire right-hand side
	- 最关键的问题，就是确定这个“时机”——我应该在什么时候去做选择

### 例子

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/19_21_46_57_20250319214656.png"/>

具体过程如下：

- `.` 代表目前 parser 到达的位置
- 对于下图右边的表格，左侧是一个栈（因此修改只能在最右侧进行），右侧是我们当前的状态

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/19_21_54_44_20250319215444.png"/>

在 parse 的过程中，我们需要记录：

- 当前读入位置（也就是上图右表右侧的 `.`）
- 记录了 terminal 以及 non-terminal 的栈（也就是上图右表左侧的一堆东西）

Parser 可以有三种 actions：

- **shift**: 将下一个字符 push 到栈里面
- **reduce R** (e.g. 上图右表的 line 5 -> line 6):
	- 栈顶需要 match RHS of some rule (e.g. `T -> int * T`)
	- 将 RHS 推出栈 (e.g. `pop int * T`)
	- 将 LHS 推入栈 (e.g. `push T`)
- **accept**: shift `$` (e.g. `push $`) and can reduce what remains on stack to start symbol (e.g. `pop E $; push S`)

### LR(0) Parsing

就是**无需看任何输入中的 token**，只需要根据栈中的符号来确定是否进行规约。

也就是说：我们要设计的算法，**只需要看栈的状态**，就能**决定在什么时刻进行 reduce**，而根本不需要 look ahead。

我们的算法就是：

- 能 shift 就尽量 shift
- 假设本次 shift 会导致栈顶若干元素根本通过任何一条规则规约，那么才考虑 reduce

#### 例子

```
S' -> S $
S  -> (S)
S  -> a
```

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/19_23_3_9_20250319230308.png"/>

如上图：

- `.` 就是当前 parser 的位置
- `a -> b . c` 被称为 LR(0) items。就是**我目前有了 b，只要你再给我生成一个 c，我就能产生一个 a**

状态转移：

- 如果要实现前面的状态，那么必须实现后面的状态
	- i.e. 后面状态是前面状态的必要条件
- 因此，有三种状态转移
	- 第一种，$\varepsilon$
	- 第二种，终结符。从输入中读取一个非终结符。
	- 第三种，非终结符。实际上，输入中是不可能有非终结符的。我们这里是从左侧

转成 DFA 之后，如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/20_0_25_39_202503200025908.png"/>

*(TODO)*

