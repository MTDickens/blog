# Basics

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_6_30_54_202405160630235.png"/>

如上图，对于多周期 CPU，往往取 mem 的时候用多周期去取，而且会有一个 ready bit。

# Cache

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/05/16_6_32_15_202405160632429.png" style="zoom: 67%;" />

如上图，可以参考我在 csapp 中的笔记。

## Overhead of Cache

假设我们的 cache 是 1-way associative cache in 32-bit addressable space with 

- block size: 4 words = 16 bytes = $2^4$ bytes
- corresponding memory: 4 KB = $2^{14}$ bytes

从而，我们的

- block offset bits: 4
- index bits: 14 - 4 = 10
- tag bits: 32 - 10 - 4 = 18

从而，cache 实际上需要占用的空间大小是：
$$
2 ^ {10} * (16 + 18 / 8 + 1 / 8) \mathrm{~bytes} = 18.375 \mathrm{~KB}
$$
其中，

- 16 是 block size
- 18 和 1 分别是 tag bits and valid bit (i.e. 上图的 "V")
    - 后面除以 8 是为了将 bit 转换为 byte

# Write Strategies

可以参考 [csapp notes](/self-learning/CMU-CSAPP/12-Cache-Memories/#cache-write)