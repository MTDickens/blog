# 前言：置信域方法

目标问题：$\min_{\theta \in \mathbb R^n} J(\theta)$

我们采用局部搜索框架：

$$
\theta_\text{new} \leftarrow \mathop{\arg\min}_{\theta \in \mathcal N(\theta_\text{now})} J(\theta)
$$

- 其中，$\mathcal N(\theta_\text{now})$ 就是**邻域**

但是，这样做仍然是困难的。因此，我们构造一个**简单的、邻域内可以近似的函数** $L(\theta | \theta_\text{now})$，从而：

$$
\forall \theta_\text{now} \forall \theta \in \mathcal N(\theta_\text{now}): L(\theta | \theta_\text{now}) \approx J(\theta)
$$

- 在这个语境下，$\mathcal N(\theta_\text{now})$ 就被称为**置信域**，i.e. 我们可以在 $\mathcal N(\theta_\text{now})$ 上信任 $\theta$

> [!info]- 图解置信域
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/8_20_40_7_202407082040510.png"/>

## 伪代码

```python
def TrustRegion(theta, J, L, max_times):
    for i in range(max_times):
        theta = argmax(L, theta, N(theta))
    return theta
```

## 如何选择 $L(\theta | \theta_\text{now})$

我们很多时候，会直接选择：

$$
L(\theta | \theta_\text{now}) = J(\theta_\text{now}) + \nabla f(\theta_\text{now})^T (\theta - \theta_\text{now})
$$
\
- 也就是 vanilla gradient descent

常见的也有二阶优化：

$$
L(\theta | \theta_\text{now}) = J(\theta_\text{now}) + \nabla f(\theta_\text{now})^T s + \frac 1 2 s^T \nabla^2 f(\theta_\text{now}) s, \text{where } s = \theta - \theta_\text{now}
$$

当然，也可以使用 KL 散度等等。

# TRPO


