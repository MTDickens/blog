# Training Dynamics

## Learning Rate Schedules

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242209750.png" alt="image-20240324220901108" style="zoom: 33%;" />

很多时候，我们既希望快速让 loss 下降，也希望能让 loss 降到尽量低。因此，我们往往会在学习的时候改变 learning rate。而改变学习率的方法，称为 learning rate schedule。

### Step Decay

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242252214.png" alt="image-20240324225228129" style="zoom: 33%;" />

如图，每隔一段时间，就会进行学习率下降。从而保证我们一直处于 high learning rate 的左侧的“快速下降区”。

但是，这种方法的坏处是：**hyperparameter 过于多**。你需要调整

1. initial learning rate
2. decay rate
3. decay interval
    - 当然，也有一种 heuristic 的方法来 tuning：先训练，再找 loss plateau，然后在 plateau 的起始处进行 decay

因此，tuning can be a little tricky.

### Cosine Decay

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242300067.png" alt="image-20240324230020511" style="zoom: 33%;" />

好处：只要给定 initial learning rate 和 end learning rate，就可以自动得到一个 learning rate 与 epoch 的对应关系。

同样地还有：

- Linear decay: $a_t = a_0 t / T$
- Inverse square root decay: $a_t = a_0 / \sqrt{t}$
- And ...,  just constant decay: $a_t = a_0$

### Rule of Thumb

1. **不要在一开始就调整** learning schedule，这应该是最后做的事
2. 一开始请**直接使用 constant schedule**
3. 对于 SGD+Momentum，有一个 non-trivial decay schedule 可能是好事。但是**对于更复杂的 optimizers** (e.g. Adam)，其实**没必要使用这些 fancy schedules** - constant schedule is okay.

Sidenote: Plotting losses like the image below (i.e. average training loss as well as the variance) helps you debug your code.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242324823.png" alt="image-20240324232348770" style="zoom:33%;" />

### Sidenote: Early Stopping

在训练的时候，我们需要一直关注以下两张图：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242327584.png" alt="image-20240324232710605" style="zoom:33%;" />

从而，我们可以在 validation accuracy 下降的时候，及时停止 training。

## Hyperparameter Optimization

一种方法，就是 grid search；另一种方法，就是 random search (in some interval)。

Random search 的好处：

1. 在 hyperparameter 数量很多的时候，极大地降低计算量
2. 对于存在部分 unimportant parameters 的情况，我们随机取点（如右图），可以避免左侧的重复计算

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242345921.png" alt="image-20240324234534679" style="zoom: 33%;" />

---

很多时候，hyperparameter 之间其实是相关的，如下图所示：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403242353762.png" alt="image-20240324235352312" style="zoom:33%;" />

因此，grid/random search 是有必要的。你不能假设 hyperparameters 之间独立，然后每一次只调一个 hyperparameter。你必须一起调整。

---

另外，我们甚至可以对 hyperparameter 求梯度，从而实现所谓 hyper gradient descent。当然，这种做法并不 popular，因为计算成本太高。

## How To Choose Hyperparameters

**Step 1:** Check initial loss without any weight decay

- 因为我们可以解析地计算出最开始的 loss 的期望值大概是多少。因此，这可以作为一开始的 sanity check，用于 debug

**Step 2:** Overfit a small sample

*TODO:* https://youtu.be/WUazOtlti0g?list=PL5-TkQAfAZFbzxjBHtzdVCWE0Zbhomg7r&t=2198

# After Training

## Model Ensembles

## Transfer Learning

## Large-Batch Learning