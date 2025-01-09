## Live Variables Analysis

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403230412017.png" alt="image-20240323041249822" style="zoom:33%;" />

**注意：** Live variables analysis 和 reaching definition analysis 的区别

- 在一个 program point 处，live variables analysis 的 bit vector 是 variable，而 reaching definitions analysis 是 definitions
- live variables analysis 关注的是在点 $p$ 处的某个变量的值会不会在没有修改之前被使用；而 reaching definitions analysis 是某个定义能不能活到点 $p$，i.e. 没有被重定义

### Constraints

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403230459469.png" alt="image-20240323045935058" style="zoom: 33%;" />

如图，我们本次采用了 backward analysis。

- 可以这么理解：由于 OUT 是 IN 的可能路径的一部分。因此，要从 OUT 往 IN 去分析。

### Transfer Function

 我们考虑 B 处的语句：

1. 只要 B 处 use 了 v，IN[B] 就一定要含有 v
2. 如果 B 处没有 use v，但是重新定义了 v，那么 IN[B] 就一定不能含有 v
3. 其他情况，IN[B] 和 OUT[B] 保持一致

### Algorithm

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403231531432.png" alt="image-20240323153144309" style="zoom: 33%;" />

- 由于是 may analysis，因此所有的 IN[B] 需要是并集

#### How to Deal With Basic Blocks that Contains Multiple `define`s

另外，对于一个块里有多个重定义语句的，我们应该如下处理。举例：

```python
v = k + 1
s = q * 2
w = v / 3
```

如上，我们逐行扫描。对于每一行：

1. 我们将左边的添加到 $def_B$ 里
2. 我们检查右边的是否在 $def_B$ 里，如果在，就跳过；如果不在，就添加到 $use_B$ 里

所以，

1. 第一行：$def_B = \set{v}, use_B = \set{k}$
2. 第二行：$def_B = \set{v, s}, use_B = \set{k, q}$
3. 第三行：$def_B = \set{v, s, w}, use_B = \set{k, q}$
    - 由于 $v$ 已经在 $def_B$ 里，因此我们就跳过



## Available Expressions Analysis

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403231556401.png" alt="image-20240323155629134" style="zoom:33%;" />

这个 analysis 的作用就是，如果你在 $p$ 点需要计算 `x op y` 的值，但是对于任意从 entry 到 p 点的路径

- 一定已经计算过 `x op y`
- 在**最后一次计算 `x op y` 之后，没有重新定义 `x` 或者 `y`**

那么，我们就可以事先记录下来 `x op y` 的值，然后直接用在 $p$ 点上，省去多余的计算。

---

为什么要用 must analysis 呢？我们和之前的 live variables analysis 做一个对比

- 对于 live variable analysis，我们要判断的是 is this variable still alive? 只要 this variable **may** alive，我们就不能把它当成是 dead（比如优化掉）
- 对于 available variable analysis，我们要判断的是 is this expression available at point p? 只有 this expression **must** be available ，我们才能直接替换

### Algorithm

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403231614215.png" alt="image-20240323161359225" style="zoom:33%;" />

## Conclusion and Comparison

**May analysis:** false positive (i.e. you say it's positive, but actually it isn't) allowed, false negative forbidden.

**Must analysis:** false negative allowed, false positve forbidden.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403231718472.png" alt="image-20240323171825651" style="zoom: 33%;" />
