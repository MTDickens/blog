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

# Other Issues in Indexing

如果指针存的是绝对地址，那么就会导致在某一个 entry 的地址更换的时候，需要将所有索引对应的地址进行相应的更新，从而导致大量的磁盘 I/O，效率低下。

因此，我们采用**间接指针**的思想，对于 secondary indices，我们不存放 entry 的绝对地址，而是存放 entry 的 primary key 的值。然后，我们下一步使用 primary key 来找到绝对地址。

- 这样做是因为：一个 entry 的 primary key 一般不变

---

**好处：**改变 entry 地址（比如说 sequential file organization 进行 list 重排）的时候，只需要更改 primary key 对应的 entry 的地址即可。

**（主要）坏处：**由于为间接指针，需要进行两次查询

# Indexing Strings

- 变长字符串
    - 如果有变长字符串，那么就使用 variable fan out
    - 而且，我们在 B+-Tree 上所说的 $n$，在变长字符串的意义下，可以当成**占用的空间大小**，而不是有多少个 entries
- Prefix Compression
    - 对于索引而言，其目的就是**能够区分不同的索引**。因此，我们可以使用字符串的**前缀**，as long as 能够起到区分作用。
        - e.g. "Silas" and "Silberschatz" can be separated by "Silb"

# How to Bulk-Build a B+-Tree?

如果给一批数据，那么一个一个插入肯定比批量建树要慢得多。

我们首先肯定要先进行排序。

其次，我们可以自底而上地建树，使得节点尽量紧密。

最后，同层节点之间最好连续地储存在一起。

- 首先，储存的时候更快；其次，范围查询的时候更快。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_4_19_30_202405120419757.png" style="zoom: 80%;" />

# Indices on Multiple Keys

e.g. 采用 `(dept_name, salary)` 作为 search key，那么就先比较 dept\_name，再比较 salary 即可

# Indexing on Different Media

## Main Memory

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_5_49_42_202405120549329.png"/>

如上图：

- 主存比硬盘不知道快了多少，但是，仍然比 CPU 的 cache 要慢
- 如果在 B+ 树的 4K-byte (big) node 中进行 binary search，那么会造成大量的 cache miss
- 为了利用 CPU 的 cache，我们就在 4K 大小的 big node 内部，再使用 B+ 树。但是此时的 node size 就是 cache block 的大小：64 bytes
    - 也就是，我们要 **be cache conscious**
    - 思想就是所谓的“树套树”

---

另外，为了充分利用 cache，我们在物理上可以**按列存储**，从而针对某一个属性范围读取的时候，可以读到的 cache 里面所有数据都是这个属性（i.e. 列）的。

## Flash Memory

由于 flash memory 必须**擦除**后才能写入，因此，我们要**尽量避免写操作**。

但是 B+ 树在 write intensive 的情况下，对于磁盘而言，磁盘的 I/O 比较慢，导致插入非常缓慢；**对于闪存而言，同样严重，因为每 insert 一次，都需要擦除重写一次**。

# Write Optimized Indices

## Log structured Merge (LSM) Tree

LSM 本来是为了在*磁盘*高写入情形下，避免过多的写入操作而实现的数据结构。但是后来发现也可用做减少闪存的写入擦除。

---

简单来说，就是一个 B+-Tree 的森林：

1. 第 $i$ 层的树的最大大小就是 $n*k^i$，其中 $n$​ 就是内存中一棵树的默认大小
2. 当内存中的树满了，就将内存的树和第 1 层的树进行 merge（使用 bottom-up build）
3. 当第 1 层也满了，就与第二层 merge
4. 递归地进行下去
    - 这和二项堆有相似之处，不同就在于二项堆每增长一层，大小翻 2 倍，而 LSM 树大小翻 k 倍

如下图所示，左图是 naive 实现，右图减少了合并树的次数：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_7_9_26_202405120709970.png" style="zoom: 40%;" /><img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_7_12_10_202405120712572.png" style="zoom:40%;" />

但是，右图的后果就是：树过于多。我们查找一个值的时候，需要在每一棵树中都进行一次查找。树越多，找的越慢。

**优化：**使用布隆过滤器。

## Buffer Tree

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_7_30_55_202405120730572.png"/>

如图，思想很简单：lazy data structure，也就是延迟下传，直到 buffer 满了，再整体下传，一次写一整个 buffer。

---

代价：

- 由于保留了一部分做 buffer，fan-out 减少了
    - 如果整个 block 全是 buffer，那么就退化成了扫描
    - 如果整个 block 没有 buffer，就退化成了普通 B+-Tree，也就是插入一次必须递归地插到底

# Bitmap Indices

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_7_37_11_202405120737239.png"/>

假设某一种类型是枚举类型，显然建立索引是无意义的，而且会造成每一个索引对应大量的数据。那么，我们可以对于每一个枚举值，都使用一个 bitmap 来描述。

这样，进行查找的时候，就可以通过对不同的 bitmap 进行 and/or/not 的操作，来得到目标结果。

- 比如：找出男性且收入为 L3 的，那么就是 m 和 L3 的 bitmap 取 and。

---

如果我们希望统计某一个 bitmap 的 1 的个数，为了避免一个 byte 一个 byte 地数，我们采用下面的方法：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/12_7_42_47_202405120742406.png"/>

假设以 byte 为单位，那么就将 0\~255 建一个“有多少个 1”的表，然后对应每一个 byte 都查表。这样可以避免以 bit 为单位统计，而是以 byte 为单位统计。
