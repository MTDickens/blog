# Introduction

有些时候，用钱是不道德的（比如说 kidney exchange）或者是不现实的（比如说 house swapping）。此时，套用 Lec 8 的理论：budget 就是 0，但是我们仍然希望达到 DSIC 以及（尽量）最大化 surplus（此时收益就别管了）。

一般而言，auction without money 是很难有好的效果的。但是仍然有几个特殊的例子，可以实现好的效果。

# Example: House Swapping

There are $n$ agents, and each initially owns one house. Each agent has a **total ordering** over the $n$ houses, and need not prefer their own over the others.

我们的目的：如何能够组织合理的交换？满足 DSIC 以及某种意义上的 surplus maximization？

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
