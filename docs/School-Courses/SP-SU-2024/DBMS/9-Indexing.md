[toc]

# Basic Concepts

索引的目的就是：**speed up access to** desired data.

- Search key: attribute to the set attributes used to look up records in a file
- Index File (索引文件) 里面包含 index entries，形式是**键-指针对**（指向目标数据）
    - 索引文件一般比 original file 小得多
- 索引的两种主要类型：有序索引、哈希（无序）索引

## Index Evaluation Metrics

- Access types
    - Point query
    - Range query
- Access time
- Insertion time: 维护索引的耗时
- Deletion time: 维护索引的耗时
- Space overhead: 维护索引的空间消耗

# Ordered Indices

**Primary index** (主索引): 又称 cluster index。

- 这种索引的好处就是：索引顺序和数据的物理顺序是一致的。在范围查询中，可以有效利用 locality。
- 一般而言，primary index 往往（但是不一定）是 primary key

**Secondary indices** (辅助索引): 如下图所示。同一个 key 可能对应 multiple pointers，因此 key 指向 pointer list，而不是直接指向 pointer。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/11_7_40_59_202405110740800.png" style="zoom: 67%;" />

---

**Dense Index Files**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/11_7_45_59_202405110745349.png" style="zoom:67%;" />

Dense index: 每一个 table entry 的对应 attribute 都有一个 index record。

不过，如果 search-key 的顺序和 index key 一致的话（换句话说，如果 dense index 是 primary index），那么就可以省略一些不必要的指针：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/11_7_50_55_202405110750734.png" style="zoom:67%;" />

- 如图，指针并没有指向所有的 table entries，而是只指向了第一个 table entry。

**Sparse Index Files**

顾名思义：每隔一段，建一个索引值。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/11_7_54_43_202405110754702.png" style="zoom:67%;" />

# B+-Tree Index

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/11_8_13_41_202405110813392.png" style="zoom:67%;" />

如上图：数据库中用到的 B+ 树和 ADS 中学的 B+ 树有所不同。因为数据库中的 B+ 树的每一层的格式都是一样的（i.e. leaf 和 internal node 没有什么不同）

---

以浙江大学本科生学号为例，如果使用 1 byte 表示 1 位，那么就是 key 的大小就是定长的 10 bytes。

因此，假设指针为 4 bytes，一个 4K block 就能装下 $\lfloor(4096 - 4) / 14 + 1\rfloor = 293$ 个指针，从而 $n=293, \lceil n / 2 \rceil = 147$。

如果需要存 100 万个数据，假设

- 根节点只有 2 个指针，其它所有节点都半满，那么至少 4 层（根节点算第 1 层）
- 所有节点全满，那么至少 3 层

不难看出，B+ 树是一个非常扁平的树。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/11_8_51_32_202405110851691.png" style="zoom:67%;" />

---

**Obs:**

1. B+ 树的任意非叶层的所有节点合起来，本质上就是一个 sparce indices
2. 块与块之间的位置不需要有任何关系

# B+-Tree File Organization

**注意：** B+-树的 file organization 指的是使用 B+ 树结构来实现 file organization。此概念与堆组织、顺序组织是并列的。

简单而言，就是**叶子节点不存指针，而直接存数据**。

# Indices on Multiple Keys

如果指针存的是绝对地址，那么就会导致在某一个 entry 的地址更换的时候，需要将所有索引对应的地址进行相应的更新，从而导致大量的磁盘 I/O，效率低下。

因此，我们采用**间接指针**的思想，对于 secondary indices，我们不存放 entry 的绝对地址，而是存放 entry 的 primary key 的值。然后，我们下一步使用 primary key 来找到绝对地址。

- 这样做是因为：一个 entry 的 primary key 一般不变

---

**好处：**改变 entry 地址（比如说 sequential file organization 进行 list 重排）的时候，只需要更改 primary key 对应的 entry 的地址即可。

**（主要）坏处：**由于为间接指针，需要进行两次查询

# Indexing Strings

如果含有变长字符串

# Indexing on Different Media

## Flash Memory

## Main Memory

# Write Optimized Indices

## Log structured Merge (LSM) Tree

## Buffer Tree

# Bitmap Indices

