# Data Storage Structure

详见 [HobbitQia](https://note.hobbitqia.cc/DB/db9/#fixed-length-records)

整体来说，就是

- fixed length 当成 `struct xxx array[N]` 就行了
- variable length 则需要有记录**可变长属性的长度**的 header。如图：
    <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_20_43_22_202404262043742.png" style="zoom: 33%;" />

**Slotted page**

至于如何将 variable record 存在一个 block 中？如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_20_47_48_202404262047814.png" style="zoom:33%;" />

其中，**slotted page（分槽页）** header contains:

- number of record entries
- end of free space in the block
    一个指针指向 free space 末尾，用来分配内存
- location and size of each record

当删除的时候，

1. 一种方法是把后面的记录挪过去，让自由空间更紧凑，这样需要修改 entries, free space 的指针，偏移量也要调整。
2. 也可以暂时不调整，等后面如果需要分配内存但不够用时，再一次性重整之前的空间。

# 文件中 record 的组织方式

> **注意：**
>
> 1. 组织方式（怎么存）和索引结构（怎么找）是独立的。我们可以使用 B+ 树或者 hash 来构建索引结构，从而得以快速定位某一个 record。
> 2. 另外，B+ 树叶节点的数据虽然是有序、连续的，但是不代表它们指向的 records 在物理介质中也是有序、连续储存的。
>     - 还有，B+ 树节点的数据记录的是指向的 records，而“指针”和传统意义上内存的指针不同。这个指针含有 block number 以及 index。
>         - 通过 block number，读取对应 block 到内存中（当然也有可能本身已经缓存了）
>         - 如果是 variable length，
>             - 则通过 index，在 slotted page header 中找到对应的 location
>             - 通过 location，最终找到对应的内容
>         - 如果是 fixed length，那就直接算出 location := length \* index 即可

1. [堆组织](https://note.hobbitqia.cc/DB/db9/#heap-file-organization)：通过堆的形式，记录一个块的空闲空间，并采用多级的方式存储（便于快速查找最空闲的块）。
    - 这样储存的数据，连续的 key 不代表这些 key 对应的 records 被储存在连续的 block 中，因此如果需要读取连续大量的 records，速度会显著地比下面的方法慢。
2. [顺序组织](https://note.hobbitqia.cc/DB/db9/#heap-file-organization)：就是一个有序链表。插入、删除参考有序链表的插入和删除（也许用到了二分查找）。
    - 这样储存的数据，连续的 key 对应的 records 被**一开始**储存在连续的 block 中。但是，随着随机删除和随机插入的增加，会逐渐造成储存数据的非连续性的
        - 比如在 block 3 删除了 1919810 record（不妨假设 1919810 record此时是最后一个record），但是又要插入 114514 record
            - 就导致了 block 1 的 114513 record 必须**跨越 block** 指向 block 3 的  114514 record
            - 同时，block 3 的 114514 record 也必须**跨越 block** 指向 block 1 的  114515 record
    - 从而，隔一段时间，我们就需要将整条链表进行重排，保证连续的 key 被储存在连续的 block 中
3. [多表混合](https://note.hobbitqia.cc/DB/db9/#multitable-clustering-file-organization)：对于两个紧密相关的 table（比如 dept 和 instructor），我们可以把它们存储在一起。
    - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/26_19_13_43_202404261913029.png" style="zoom:50%;" />
        - 如上图，如果我们希望查询 instructor &bowtie; dept，那么这样储存就可以极大地减少 I/O。
        - 但是，如果是仅仅查询系的话，那么就需要用到链表，而且失去了 locality（两个逻辑上相邻的系可能不在同一个 block 中）。
    - 具体储存在一起的方式，详见博客。
4. [单表划分](https://note.hobbitqia.cc/DB/db9/#table-partitioning)：对于一个过于大的 table，我们可以把表分开来存。比如对于所有老师的表，我们可以把计算机系的老师分出来，数学系的老师分出来。
    - 当然，依据什么来划分，还是要考虑实际意义。比如如果依据工号顺序，那么就无实际意义；如果依据性别，那么只会分为两类，没什么作用；依据系，有着实际的意义，而且确实可以有效减小每一张子表的大小

---

一张表既有 record，也有 schema。后者被称为 dictionary data。包含

- Information about *relations*
- *User and accounting* information, including passwords
- *Statistical* and descriptive data
- *Physical file organization information*
- Information about *indices*

我们也需要来储存它。

# Buffer Management

详见[HobbitQia](https://note.hobbitqia.cc/DB/db9/#storage-access-buffer-manager)。

其中，clock 算法可以详见[知乎](https://zhuanlan.zhihu.com/p/196478796)。