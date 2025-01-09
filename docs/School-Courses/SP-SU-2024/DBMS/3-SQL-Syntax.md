## 执行 pipeline

```sql
SELECT column1, aggregate_function(column2) AS aggr
FROM table_name
WHERE condition
GROUP BY column1
HAVING condition;
```

执行的 pipeline 就是：

1. 通过 `where` 来 filter table
2. 通过 `group by` 和 aggregation function 来分组+聚合
    - **Note:** Attributes in `select` clause **outside of aggregate functions** must appear in `group by` list
3. 通过 `having` 来 filter result
    - **Note:** Before SQL-93, attributes in `having` conditions must NOT appear in `group by` list

## NULL Value

### 算数

在算数中，NULL 进行任何运算，还是 NULL。如 5 * (7 + NULL) = NULL。

### 逻辑

在逻辑中，NULL 进行任何逻辑判断，都是 Unknown。

- 除了 `is NULL` 和 `is not NULL`

而 Unknown 和其它的逻辑进行判断，就是以下四个：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403141207665.png" alt="image-20240314120658118" style="zoom:50%;" />

### 聚合

除了 `COUNT(*)` 以外，其它的聚合函数直接会**忽略** NULL。

