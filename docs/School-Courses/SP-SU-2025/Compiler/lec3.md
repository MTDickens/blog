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

## 为什么需要抽象语法

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2025/03/24_10_34_47_20250324103446.png"/>

如上图：

- 抽象语法树里面有很多冗余信息（比如括号）
- 因此，如果直接传递抽象语法树的话，不仅会徒增很多冗余信息，而且会导致语法树过度依赖具体文法
	- 如果具体文法做了改动，那么就会导致语法树大变


## Positions

由于抽象语法树相比源代码已经“面目全非”。因此，在 parsing 之后，如果我们在 semantic analysis 中发现错误并报错，那么由于报错信息中**没有位置信息**，因此我们就无法定位到源代码中的错误。

因此，我们一般会在构建 ast 的时候，**往 ast 的节点中主动加入位置信息**。

