# 确定策略梯度

由于策略是连续的，因此我们让神经网络输出具体**策略**而不是**策略的概率**。

同时，我们使用 actor-critic 的方式，一起训练两个网络。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_5_20_2_202407090520370.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_5_20_59_202407090520102.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_5_21_14_202407090521107.png"/>

> [!note]+ 与 DQN 相比
> 
> 该网络和 DQN 非常类似。同时，也都会用到经验回放的方式（异策略）进行更新。

> [!warning]+ 问题
> 
> 之前的**离散动作**、基于策略的 Policy Gradient，首先没有自举（i.e. 不用自己的值来计算自己的梯度），其次没有计算最大值（i.e. 策略不是最大值，而是概率），因此没有高估/低估的问题存在。
> 
> 而目前的网络，显然需要自举（critic 必须通过自举的方式，来计算 loss）以及计算最大值（当前的 $\mathbf \mu(s; \mathbf \theta) \approx \mathop{\arg\max}_{\mathbf a} Q(s, \mathbf a)$，因此显然是试图拟合最高价值动作）。**因此，就会造成高估/低估 $Q$ 值的问题**。
> 
> - 具体来说，计算最大值和自举的式子就是 <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_5_54_51_202407090554439.png"/>

## 改进方式

1. 网络架构：<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_6_23_55_202407090623208.png"/>
2. 动作中添加噪声：<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/9_6_24_30_202407090624570.png"/>
3. 减小更新策略网络和目标网络的频率：理由就是，我们先让价值网络 $q$ 在该策略 $\mathbf \mu$ 下收敛了，再去更新 $\mathbf \mu$

