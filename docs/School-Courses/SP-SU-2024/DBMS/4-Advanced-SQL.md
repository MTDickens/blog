## `(NOT) EXISTS`, `(NOT) UNIQUE`

用于指示某个表是否是空的/有重复元素。

## `ALL`, `ANY`

`b <relation> ALL` := &forall; a &in; S: b \<relation\> a

`b <relation> ANY` := &exist; a &in; S: b \<relation\> a

## 如何构建 SQL 指令

以这个问题为例：Find all students who have taken all courses offered in the Biology department.

### Sol 1

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403211948982.png" alt="image-20240321194806923" style="zoom:50%;" />

- 注意：其实这里的 P(S) 和 Q 不是 predicates，而只是 set/set-valued function

### Sol 2

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403211949988.png" alt="image-20240321194949242" style="zoom: 40%;" />

明显，sol 2 比 sol 1 繁琐不少，但是 nonetheless 都是 valid solutions。

 

### Update with Scalar Tricks

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403211952989.png" alt="image-20240321195204953" style="zoom:50%;" />

我们可以在修改某些行的时候，根据行的具体的值，修改成不同的值。

## 视图

一般的视图，就是所属表的一个**引用**。通过视图，我们可以更方便的进行 query。

但是，如果要修改视图，其实是比较麻烦的。

1. 视图可能比原 table 要小，导致插入视图的时候，可能有些列插不进去，而被自动设为 NULL
2. 视图可能含有 `WHERE`，导致插入视图的时候，可能有些项插进去就被 `WHERE` 过滤了。
    - 也就是说，插进去了一项，但是插进去之后，在视图里却找不到。
        - 这虽然不违反 SQL 规则，但是违反“一般习惯”
    - 因此，如果不希望插入可能被过滤的项，可以使用 `With Check Option` 的选项

### Materialized View

视图的计算是需要时间的（和 query 同理）。因此，如果一个视图过于复杂，而我们需要频繁调用，那么我们就应该考虑将其变成 materialized view。

顾名思义，materialized view，就是把视图 materialize——从 query 变成物理上的一个真实的表。

## Index

Index 便于快速寻找到某个元素。

