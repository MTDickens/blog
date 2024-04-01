[TOC]

# View the Iterative Algorithm in Another Way

Given a CFG (program) with k nodes, the iterative algorithm updates `OUT[n]` for every node n in each iteration.

Assume the domain of the values in data flow analysis is $V$,then we can define a $k$-tuple
$$
OUT[n_1],OUT[n_2],\dots,OUT[n_k]
$$
as an element of set $(V_1, V_2, \dots, V_k)$ denoted as $V^k$, to hold the values of the analysis after each iteration.

因此，每一次 iteration 可以抽象为函数 $F: V^k \to V^k$

## Some Questions

本质上，我们就是找 $F$ 的不动点。

- Is the algorithm guaranteed to terminate or reach the fixed-point, or does it always have a solution?
    - Guaranteed to reach?
- If so, is there only one solution or only one fixed point? If more than one, is our solution the best one (most precise)?
    - How many fixed-points?
- When will the algorithm reach the fixed point, or when can we get the solution?
    - Time complexity?

# Lattice

## Background: Upper and Lower Bounds

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010658220.png" alt="image-20240401065837486" style="zoom: 50%;" />

## Definition

**Lattice:** Given a poset $(P, \sqsubseteq)$, $\forall a, b \in P$, if a $a \sqcup b$ and $a \sqcap b$ exist, then $(P, \sqsubseteq)$ is called a lattice.

**Semilattice:** Given a poset $(P, \sqsubseteq)$, $\forall a, b \in P$,

- if only $a \sqcup b$ exists, then $(P, \sqsubseteq)$ is called a **join** semilattice
- if only $a \sqcap b$ exists, then $(P, \sqsubseteq)$ is called a **meet** semilattice

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010707961.png" alt="image-20240401070722049" style="zoom:50%;" />

- 注：由于程序是有限的，因此，我们的 lattice 就是 finite lattice，也就是 complete lattice。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202404010711205.png" alt="image-20240401071147630" style="zoom:50%;" />