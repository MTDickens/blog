# 计算模型

我们采用 PRAM 的计算模型。

本质很简单：

1. 无限多个处理器
2. 无限多的共享内存
3. 每一个处理器的独享内存无限大
4. 每一个时间单元（unit），可以进行下面三件事之一
    1. 执行一个简单运算，比如 c = a + b
    2. 从共享内存读取一个数据
    3. 向共享内存写入一个数据

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_14_1_14_202405271401149.png" style="zoom:67%;" />

如上图，我们一般有三种可用的冲突解决方法：

- 第一种不实用
- 第二种是经典的情况，读取用共享锁，写入用独享锁
- 第三种就是为了更加高效。我们对写入的数据进行判断，保证写入的数据是真实的

# 例子：前缀和

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_15_54_23_202405271554017.png"/>

步骤：

1. 两两计算和，得到 $B(h, i)$（也就是在第 $h$ 次计算时，得到的第 $i$ 个结果）
    - 通过 $B(h, i) = B(h-1, 2i) + B(h-1, 2i-1)$
2. 然后再往下传递前缀和，得到 $C(h, i)$（定义：如果 $B(h, i) := \sum_{i = n}^m B(0, i)$，那么 $C(h,i) := \sum_{i=1}^m B(0,i)$）
    - 通过 $C(h,2i) = C(h+1, i), C(h, 2i-1) = C(h+1, i) - B(h, 2i)$
3. 这样，我们使用大约 $4n$ 的 workload 以及 $2 \log n$​ 的时间，就可以算出 n 个数的前缀和（**假设共享内存足够多**）。
    - 如果采用简单的前向加法，虽然 workload 是 $n$（同数量级，稍小一些），但是时间也是 $n$（数量级不同）

# 例子：归并

## Serial Method

对于数列 A, B，假设分别有 $n, m$ 个数，已经排好序，且两两不相同。那么，如果希望归并两个序列的话，使用单核 CPU 执行：

- workload: O(n+m)
- time: O(n+m)

## Naive Parallel Method (via Binary Search)

如果是多核 CPU（假设核的数量足够多），那么，我们可以分别处理两列**（我们这里以 A 为例）**，然后对其中每一个数，找到其 Rank(B, A<sub>i</sub>)。

Rank 的定义如下：

- Rank(B, A<sub>i</sub>) = 0, if A<sub>i</sub> < B<sub>1</sub>
- Rank(B, A<sub>i</sub>) = j, if B<sub>j</sub> < A<sub>i</sub> < B<sub>j+1</sub>
- Rank(B, A<sub>i</sub>) = n, if B<sub>n</sub> < A<sub>i</sub>

**直观来说，就是看看 A<sub>i</sub> 可以插在哪一个 B<sub>j</sub> 之前。**

这是很简单的，只要通过二分查找，就可以找到，时间为 O(log m)。

然后，对于 Rank 为 j 的 A<sub>i</sub>，我们就插在第 j+i 的位置（从 1 开始）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_16_14_33_202405271614333.png" style="zoom:67%;" />

如上图，以 A<sub>3</sub> 为例，因为 15 应该插在 16 前面，因此 Rank 为 2。从而，就插在第 2 + 3 = 5 个位置。

---

从而，

- time: O(log n + log m)
- workload: O(m log n + n log m)

可以看到，其实效果也不尽人意，因为 workload 多了一个指数项。

## Clever Parallel Method (via Binary Search)

> 这里先假设 A, B 的长度一样，都是 n。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_16_27_31_202405271627871.png" style="zoom:80%;" />

> [!tip]+ 核心思想
> 我们这里采用的思想是：不直接 global binary search，而是将整个 array 分为 subarray（大小为 $f(n)$)，然后将这些 subarray 进行排序。

***第一步：*** 对于每一个 subarray，我们都要找到其 RankSubArray(B/A, A/B<sub>i</sub>)，也就是，**这个 subarray 的第一个数应该插在哪一个对方的数的前面**。

- time: $O(\log n)$
- workload: $O(n / f(n) * \log n) = O(n / \log n * f(n))$

> [!note]- 细节实现：如何让每一个 element 知道自己应该放在哪一个位置？
> 我们只要知道自己位于哪一个组（具体来说，是知道自己位于哪一个组的箭头，就是
> 至于如何让每一个 element 都知道自己属于哪一组，也是简单的：
> 1. 每一个 subarray 的 head machine，线性扫描一下指向本组的对方箭头（**如果指向同一点，那么大者优先，从而保证了可以在在 f(n) 时间内完成，总共的 workload 是 n / f(n) * f(n) = n**），同时在指定区域，为自己的 subarray 的每一个 element 都协商
>     
> 2. 然后，每一个己方的机器，都读取指定区域的数据，从而得知自己的组（**时间是 O(1)，workload 是 O(n)**）

***第二步：*** 就是每一个 element，按照自己的所在组（**上图中每一个绿色的部分，对应一个分组**），复制到对应的位置。然后每一个机器找到自己的待排序组，然后开始 serial method 排序。

- time: $\mathcal O(f(n))$
- workload: $\mathcal O(n / f(n) * \log n)$ = $\mathcal O(n * \log n / f(n))$

从而，很显然，当且仅当 f(n) = &Omega;(log n) 的时候，time 和 workload 均可以实现最优化。其中，time 跟 serial method 一样；workload 比 serial method 更好。

- time: O(log n)
- workload: O(n)
# 例子: Maximum Finding

## Serial Method

很简单，就是 $T(n) = O(n), W(n) = O(n)$。

## Naive Parallel Method

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/27_18_36_51_202405271836440.png" style="zoom:80%"/>

首先，我们如果直接将前缀和中的 `+` 改成了 `max`，那么就是 $T(n) = O(\log n), W(n) = O(n)$。

如果更加激进一些，采用这样的方式：
1. 首先两两进行比较
2. 然后一堆机器同时写入比较结果：只要有比它大的，就为 1。
    - 因此只有最大值，能够为 0（因为没有其它任何值比它还要大了）
4. 然后，所有机器同时检测对应处是否值为 1，如果为 1，就将某处对应的原始值输出
    - 写的有点抽象，第 4 条的具体情况可以参考源代码

## Clever Parallel Method

还是利用分治的思想。

假设我们将所有的点分成 $f(n)$ 份，然后每一份求出最大值，最后通过 compare all pairs 的算法求出来最终结果。

那么就有：

$$
\begin{aligned}
T(n) &= T(f(n)) + O(1)\newline
W(n) &= \frac {n} {f(n)} W(f(n)) + O\left((\frac {n} {f(n)})^2\right)
\end{aligned}
$$
如果令 $f(n) = \sqrt n$，那么显然有 $T(n) = O(\log\log n), W(n) = O(n \log\log n)$。

## Even Cleverer Parallel Method

我们能不能把 $W$ 后面的 $\log \log n$ 拿掉呢？答案是可以的。方法如下：

1. 我们先将所有数进行分组（分成 $h$ 份）
2. 然后并行计算得到每一份的值。其中计算每一份的时候，直接采用 serial method
3. 现在就只有 $n/h$ 个值了。我们就通过 Clever Parallel Method 将这 $n / h$ 个值的最大值算出来。

这样，就有：

$$
\begin{aligned}
T'(n) &= O(h + T(n/h)) = O(h + \log\log (n / h))\newline
W'(n) &= O(h (n/h) + W(n/h)) = O(n + (n/h)\log\log(n/h))
\end{aligned}
$$

为了拿掉 $\log\log n$，我们必须满足 $(n/h)\log\log(n/h) = n$，那么就要满足 $h + \log\log h = \log\log n$。不难证明：$h \in (\frac 1 2 \log\log n, \log\log n) = O(\log \log n)$。

从而：$T'(n) = O(\log\log n)$ 是显然的。同时，$W'(n) = O(n)$，实现了和 serial method 一样的代价。

## Randomized Method

我们还可以使用一种随机化的奇技淫巧。

从长度为 $n$ 的数列中随机抽取 $n^k$ 个元素，然后将元素以 $n^j$ 为大小来 partition。对于每一个 partition，都采用两两比较的算法。然后就得到了 $n^{k-j}$ 个 elements，然后迭代即可。

迭代一次的复杂度：

$$
\begin{aligned}
T(n) &= O(1) \newline
W(n) &= O(\left(n^{j})^2\right) n^{k-j} = O(n^{k + j})
\end{aligned}
$$
为了保证每次迭代的 $W(n) = O(n)$，那么：$j_1 = 1 - k_1 \implies k_2 = k_1 - j_1 = 1 - 2j_1 \implies j_2 = 2j_1 \implies \dots$。

比如说：$j = \frac18$，那么 $k_1 = \frac78, k_2 = \frac34, k_3 = \frac 12, k_4 = 0$（算完了）。

此时，一次抽中的概率是 $n^{\frac 78} / n = n^{-\frac 18}$。

> [!question]- 探索
> 事实上，给定 j，就有
> 
> $$
> \begin{aligned}
> P(n) &= n^{-j} \newline
> T(n) &= O(\log 1 j) \newline
> W(n) &= O\left(n * n^j \left(\sum_{i=0}^\infty n^{-2^ij}\right)\right)
> \end{aligned}
> $$
> 
> 如果仿照 BPP 的话，就让 $P(n) = n^{-j} = \log \frac 23$ 即可。也就是 $j = \frac {\log \frac 32} {\log n}$。于是 $T(n) = O(\log\log n)$，和 Even Cleverer Parallel Method 一样。但是 $W(n)$ 好像不太好算，你可以试试用积分审敛法来计算一下 upper bound。

