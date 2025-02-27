# Parsing

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/02/27_20_6_45_202502272006608.png"/>

简单来说，直到 parsing 这一步，我们才涉及到 grammar，也就是需要在意上下文了。

关于 CFG、EBNF 格式这些东西，since they are trivial, they won't be discussed here.

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

