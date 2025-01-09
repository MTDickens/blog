## Overview

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/5_6_33_45_20241205063345.png"/>

如图，这就是一个盘面的结构。一个盘面分为若干个柱面，一个柱面里面有若干个磁道，一个磁道为 512 B。

## Disk Scheduling

> [!info]+ For SSD
> 
> 这是因为 SDD 本身没有机械结构。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/5_6_42_12_20241205064212.png"/>
> 
> 不过 SDD 除了贵以外，还有一个缺点：擦除的时候，必须一次擦除一整块。而且擦除会造成该块的寿命减少。为了避免某一些块因为频繁使用而很快寿命耗尽，SDD 还会有一个**块平衡算法**：物理地址不是平等的。寿命较长的块，会优先被使用。

> [!info]+ For **regular** HDD
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/5_6_42_23_20241205064223.png"/>

> [!info]+ For HDD with heavy I/O load
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/5_6_42_33_20241205064232.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/5_6_42_40_20241205064240.png"/>


