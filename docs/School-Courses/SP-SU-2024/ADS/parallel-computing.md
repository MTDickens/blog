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

# 续篇：外部排序

## 模型

我们这里的内存模型：

1. 有一个内部内存，大小为 M cells
    - 一个 cell 可以装一条数据
2. 有若干个外部“内存”，大小不限制，每一块大小为 B cells。外部内存只能顺序读写。
    - 需要保证 M >= 3B，否则内存太小了，没用
3. 数据量为 N cells，其中 N >> M
4. 内存的计算时间可以忽略，我们这里只考虑从外部内存传输到内部内存的时间。

## 例子

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/3_18_33_27_202406031833083.png"/>

如图：如果待排序的有 $N$ 条记录，而 working memory 只能装 $M$ 条记录。那么，

- 如果一共使用 4 条磁带（含初始数据的磁带。每次归并用两条磁带，记作一组。两组之间交替储存数据），那么就是 2-way merge，也就是每一次将待 merge 的组数除以 2。一共需要 $\lceil \log_2 (N / M) \rceil$ 次
- 加上初始在 T<sub>1</sub> 上的一次，总共需要 $1 + \lceil \log_2 (N / M) \rceil$ 次

我们可以从哪里入手来加速排序呢？

1. More ways: 使用 2k 条磁带，就可以将底数变成 k
2. Less segments: 使用更多的内存，就可以在 N 不变时，让 N/M 更小

> [!note]+ Time concerns
> 
> 我们关心下面的这几个次数：
> 
> 1. Seek time: 每一次 merge 中的一条磁带，对应一次 seek
> 2. Block read: 读一个 block 的时间
> 3. Internal sort time
> 4. Merge N record time

## Optimization

### Reduce The \# of passes

使用 k-way merge 可以 reduce the number of passes greatly。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/3_18_55_22_202406031855300.png"/>

我们可以使用 k-way merge，从而可以让底数由 2 变成 k。

- 但是必须保证：k <= M / B + 1（因为需要有一个格子放输出）。

如果我们调小 B，那么可以使得 M / B 更大，从而 k 可以更大。但是，后果就是：N / B 也会随之变大，从而使得磁盘大小不好控制。

### Heuristic Merge for Nearly-Sorted Data: Generating Longer Runs

> [!note]+
> 
> 又称 replacement selection。

如果我们可以创造出很长的 tape 的话，那么，排序时间就可以大大缩短：i.e. 其它短序列使用很少的时间合并之后，再和长序列进行一次合并。

假如说我们的数据几乎排好了序，那么，我们可以使用这样的策略进行 exploit：

1. 首先，读取前 M / B 个 blocks，然后将其中最小一个 M cells 当作 1 个 block 输出出去。
2. 然后，再读入一个 blocks，然后将当前所有比之前 block 更大的（中最小的），组成一个 排好序的 block，并输出出去
3. 如此往复，直到当前所有数据中，找不到一**整**个 block 比之前 block 更大的。就开下一个磁带
4. ……

然后，这样就会导致，磁带的长短不一。因此，我们采用**类似哈夫曼树的策略**，将磁带由短到长逐一合并。

Example (假设一个 block 就是一个 cell)：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/4_4_46_21_202406040446450.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/4_4_47_6_202406040447495.png"/>

这样做，每一个 block 只需要处理其深度次数（i.e. 2 -> 6 -> 11 -> 26，一共经历了 3 次排序），我们让更小的节点位于更深的位置，从而确保了总处理次数最小化：2 * 3 + 4 * 3 + 5 * 2 + 15 * 1 = 43。
#### Use 3 Tapes to Sort Efficiently

> [!abstract]+
> 
> 如上图：假如均匀划分的话（比如 6 runs on T2 and 7 runs on T3），那么一遍过之后，就会在 T1 上产生 6 个 runs，然后 T3 还剩 1 个 run。然后 T1 和 T3 在 T2 上产生 1 个 run，然后再 T1 和 T2 在 T3 上产生 1 个run……如此循环，就会导致 seek time 的显著增加。下面，我们介绍一种可以使用 3 条磁带，但是 seek time 比较有保证的一种方法。

假设我们在 T1 处有 13 个 runs (i.e. blocks)，那么我们可以使用特殊的划分方法，让 3 条磁带就能跑。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/4_5_16_40_202406040516272.png"/>

- 缺点：不难看出，上面采用的是斐波那契数，因此 seek  时间大概是 $\log_{1.6} N / M$。如果用 4 条磁带，就可以是 $\log_2 N/M$。Anyway，起码我们在 3 条磁带下实现了还算高效的方法。