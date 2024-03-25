# Binomial Queue

1. 每一步操作，都可以考虑和二进制加法、减法的c
2. Binomial Queue 本质上是一个最小多叉树的森林
3. 具体实现的时候，由于我们使用 left-child-right-sibling，将多叉树表示成二叉树。因此，我们希望将一个最小二叉树的最大的子树存在最左侧，每次插入也是插入在左侧
4. 可以使用链表来连接各个子树，其实比使用数组更加方便、高效

# Appendix

**1.** Left-child-right-sibling

如图所示，我们将所有非最左的节点的父节点都设为其 left sibling；同时将所有节点的右节点都设为其 right sibling。

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403251133735.png" alt="Left-child right-sibling binary tree - Wikipedia" style="zoom: 33%;" />

**2.** Linked-List Implementation

![img](https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403251143990.png)