# Lec 19-20: Storage Allocation

## Fragmentation

### Internal Fragmentation

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202402221551192.png" alt="image-20240222155102467" style="zoom: 50%;" />

It is caused by 
 - Overhead of maintaining heap data structures 
 - Padding for alignment purposes 
 - Explicit policy decisions
  (e.g., to return a big block to satisfy a small request)

### External Fragmentation

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240222155125835.png" alt="image-20240222155125835" style="zoom:33%;" />

> Suppose no internal fragmentation

As shown in the image, there are in total 7 bytes available. But since they are not continuous, we fail to call `malloc(6)`.
