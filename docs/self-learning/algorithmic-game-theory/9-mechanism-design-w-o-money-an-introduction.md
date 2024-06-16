# Introduction

有些时候，用钱是不道德的（比如说 kidney exchange）或者是不现实的（比如说 house swapping）。此时，套用 Lec 8 的理论：budget 就是 0，但是我们仍然希望达到 DSIC 以及（尽量）最大化 surplus（此时收益就别管了）。

一般而言，auction without money 是很难有好的效果的。但是仍然有几个特殊的例子，可以实现好的效果。

# Example: House Swapping

There are $n$ agents, and each initially owns one house. Each agent has a **total ordering** over the $n$ houses, and need not prefer their own over the others.

我们的目的：如何能够组织合理的交换？满足 DSIC 以及某种意义上的 surplus maximization？

可以使用 **Top Trading Cycle Algorithm (TTCA)**。如下：

- 当还有剩余的 agent：
    - 每个剩余的代理人指向其最喜欢的剩余房屋。这将在剩余代理人之间引发一个有向图 $G$，其中每个顶点的出度为 $1$（图 1）。
    - 图 $G$ 至少有一个有向环。自循环计为有向环。
    - 按照有向环的建议重新分配房屋，每个在有向环 $C$ 上的代理人将其房屋给指向它的代理人，也就是其在 $C$ 上的前驱。
    - 删除在上一步中重新分配房屋的代理人和房屋。

由于每一次一定至少形成 1 个环，因此至多 $n$ 轮就算法就可以结束。

## 证明：DSIC

*Proof*: 固定其他人在相同格局下的意愿（i.e. 格局包括轮数和该轮中剩余的 agents 数量），假设我们在第 i 轮中试图不按照真实意愿行事，仔细考虑下面三种情况：

1. 按照真实意愿，可以在某个环内（不管虚假意愿怎样了）
2. 按照真实意愿，不能在某个环内；按照虚假意愿，也不能在某个环内。
3. 按照真实意愿，不能在某个环内；按照虚假意愿，可以能在某个环内。

(1) 显然是愚蠢的。这样做肯定不会比遵循意愿更优。

(2) 显然是徒劳的。这样做无济于事，下一轮该咋样还是咋样。

(3) 需要进行一定的分析，如下：

> [!note] 分析
> 
> 假如“按照虚假意愿，可以能在某个环内”，那么，**由于所有人的入度和出度均为 1，环上的所有成员，必然是关键成员——i.e. 如果他指向了别人，那么必然导致环无法形成**。假如“按照真实意愿”，则本轮中，这个环必然不会形成，从而下一轮这些人都在，同样这个环还在，“你可以随时指向他们”，同样，下下轮、下下下轮、……。
> 
> 因此，“按照虚假意愿”，肯定不会比遵循意愿更优。

从而，按照真实意愿，**任何情况下不会更差**。■

## 证明：Unique Core Allocation
\
> [!info]+ Core Allocation
> 
> A core allocation is an allocation such that no coalition of agents can make all of its members better off via internal reallocations.

**Theorem** For every house allocation problem, the allocation computed by the TTCA is the unique core allocation.

*Proof*: To prove the computed allocation is a core allocation, consider an arbitrary subset $S$ of agents. Define $N_j$ as in the proof of Theorem 3.1. Let $\ell$ be the first iteration in which $N_\ell \cap S \neq \emptyset$, with agent $i \in S$ receiving its house in the $\ell$th iteration of TTCA. TTCA gives agent $i$ its favorite house outside of those owned by $N_1, \ldots, N_{\ell-1}$. Since no agents of $S$ belong to $N_1, \ldots, N_{\ell-1}$, no reallocation of houses among agents of $S$ can make $i$ strictly better off.

We now prove uniqueness. In the TTCA allocation, all agents of $N_1$ receive their first choice. This must equally be true in any core allocation — in an allocation without this property, the agents of $N_1$ that didn’t get their first choice form a coalition for which internal reallocation can make everyone strictly better off. Similarly, in the TTCA allocation, all agents of $N_2$ receive their first choice outside of $N_1$. Given that every core allocation agrees with the TTCA allocation for the agents of $N_1$, such allocations must also agree for the agents of $N_2$ — otherwise, the agents of $N_2$ that fail to get their first choice outside $N_1$ can all improve via an internal reallocation. Continuing inductively, we find that the TTCA allocation is the unique core allocation. ■

> Uniqueness 应该是在 core allocation 必须保证所有 swapper 得到的房间不比交换前的更差这个条件之下得到的，否则设想以下情况：
> 
> 1, 2, 3 都认为 1 > 2 > 3，然后将 1 分给 2，2 分给 3，3 分给 1。那么这样的话，任何两个人/三个人之间，都不希望交换。貌似也是 core allocation，但是对 1 造成了损害（换到的房，在他眼中，比换之前还差）。

# Example: Kidney Exchange

Kidney Exchange 在某种意义上，也是 house swapping 的一种特例，i.e. 配对越好的肾脏，在 total ordering 中越靠前。

但是，直接使用 house swapping 的算法，会有以下几个问题。

## Problems
### Problem 1: Altruistic Donor and Patients w/o Donor

由于**存在无私的 donor（比如捐献遗体）以及不存在 donor 的病人**。因此，我们的算法不仅要考虑 donor-patient pair，还要额外考虑上述两种情况——同时，保证公平性：所有人在重分配之后，只会更好或者不变，不会更差。

- 如果使用 house 来打比方：存在 houses w/o their initial owners and agents w/o an initial house。
- 一个更加接近生活的例子：每年宿舍变更，新生没宿舍，毕业生住的宿舍没主人。

当然，这个问题是容易解决的：TTCA 存在一个专门为此设计的扩展（细节这里不谈）。

### Problem 2: Long Cycles

> [!info]+ 示意图
> 
> **注**：
> 
> - 虚线代表 patient and **initial** donor，实现代表 patient and **actual** donor
> - NDAD: Non-Direct Altruistic Donor
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/14_17_18_0_202406141718296.png"/>

设想一下，如果两个人不同时做手术（Donor A 和 Recipient A 先做移植手术），那么，假设之后 Donor B 反悔了，那么：

- 根据法律规定，不能强迫 Donor B 手术
- 因此，Recipient B 就继续处在危险状态
- 同时，由于 Recipient B has lost his initial donor，因此**不再有**和别人进行 kidney exchange 的“筹码”了
- **从而，Recipient B 在这一次的重分配之中，蒙受了巨大损失**

**因此，对于 cyclic kidney exchange，必须同时做手术。而既然要同时做手术，那么 cycle 就不能过长，因为医院也没有那么大的能力**。

- 图中只有 A、B 两方，因此同时做手术是可能的。三方 A、B、C 也行。但是如果太长了（比如十几个 agents），就会造成巨大困难。

> [!note]+ Exception: NDAD (or deceased donor)
> 
> 不过，假如存在一个“志愿者”（如上图 C），那么**就允许形成长链**。这是因为，假如中间某一个 donor 反悔了，也不会造成其后的 pair 失去“筹码”。
> 
> - 实践中，存在过长达 30 多人的链。手术一直断断续续持续了 2 个月。

## Algorithms

应对第二个问题，我们决定使用 matching（两两配对）而不是 cycle 来实现。

基本算法就是：

1. 建立无向图，其中每一个节点代表 patient-(initial-)patient pair，每一条边代表**双方可以交换肾脏（i.e. Donor 1's kidney is compatible with Patient 2, and Donor 2's kidney is compatible with Patient 1）**。
2. 在图中找出 [**maximum cardinality matching**](https://en.wikipedia.org/wiki/Maximum_cardinality_matching)（从而最大化 surplus）。此即为最后的结果。

### Problem: Multiple Maximum Cardinality Matches

> [!note]+ Example
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/14_20_21_25_202406142021151.png"/>
> 
> - Figure 5: 假设原始无向图是”正方形“，那么就有两种配对方式（如上图）。不过好在所有配对方式中，所有人都可以成功配型。
> - Figure 6: 根据上图，有 3 种配对方式（i.e. 1-2, 1-3, 1-4）。而且每一种配对方式，都会导致有两个人无法配上。**那么具体该选哪一个配对呢？**

在存在多个 MCM 的情况下，我们采用以下算法进行选择：

```
(3a) Let M[0] denote the set of maximum matchings of G. 
(3b) For i = 1, 2, ..., n:
    (3b.i) Let Z[i] denote the matchings in M[i-1] that match vertex i. 
    (3b.ii) If Z[i] ≠ ∅, set M[i] = Z[i] . 
    (3b.iii) Otherwise, set M[i] = M[i−1]. 
(3c) Return an arbitrary matching of M[n].
```

- **注**：vertices 的顺序，就是 patients 的顺序（由**国家**根据已等待时间、配型稀缺程度等等进行统一排序）

直观来说，我们尽量先满足优先级高的（i.e. 排除掉无法满足优先级高的 agents 的 MCMs，直到无法排除）。当然，细节还是看算法。

### Properties: DSIC

**Theorem 1.1** For every collection $\{E_i\}^n_{i=1}$ of edge sets and every ordering of the vertices, the priority matching mechanism above is DSIC: no agent can go from unmatched to matched by reporting a strict subset $F_i$ of $E_i$ rather than $E_i$ .

**注意**

1. 所有的 agents **不**能够改变自己的排名（国家统一排名），只能够改变自己的 report
2. **必须是 agent 自己进行 report，且 agent 只能够依赖国家系统来获得肾脏资源**。因为如果让医院进行 report，就会出现一些问题（下面会说）。

### Problems: Incentives of Hospitals

由于

1. Agents 不一定要依赖国家系统，而是可以**院内自行解决（i.e. 瞒报）**
2. Agents 均由医院来代报，而**医院也更倾向于院内自己解决**

> [!note]+ Problem 1
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/14_20_44_21_202406142044933.png"/>
> 
> **如果均诚实**，由于 MCMs 有多个，因此显然是有不同的分配方法。为了为自己争取更多利益（i.e. 在**对方诚实的情况下**，保证自己的 patients 可以配对成功），H<sub>1</sub> 会选择不报 2-3，而 H<sub>2</sub> 会选择不报 5-6


> [!note]+ Problem 2
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/14_20_42_3_202406142042987.png"/>
> 
> 显然，H<sub>1</sub> 可以选择 1-2 院内自行解决，H<sub>2</sub> 可以选择 5-6 院内自行解决

