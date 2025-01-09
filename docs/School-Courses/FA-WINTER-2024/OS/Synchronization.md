## Failure Case: Unsynchronized 

给一个例子：

```c
##include <stdio.h>
##include <stdlib.h>
##include <pthread.h>


int counter = 0;
static int loops = 1e6;
// pthread_mutex_t pmutex = PTHREAD_MUTEX_INITIALIZER; // Uncomment to use mutex


void *worker(void *arg) {
    int i;
    printf("%s: begin\n", (char *)arg);
    for (i = 0; i < loops; i++) {
        // pthread_mutex_lock(&pmutex); // Uncomment to use mutex
        counter++;
        // pthread_mutex_unlock(&pmutex); // Uncomment to use mutex
    }
    printf("%s: done\n", (char *)arg);
    return NULL;
}


int main() {
    pthread_t p1, p2;
  
    printf("main: begin (counter = %d)\n", counter);
    pthread_create(&p1, NULL, worker, "A");
    pthread_create(&p2, NULL, worker, "B");

    pthread_join(p1, NULL);
    pthread_join(p2, NULL);
    printf("main: done with both (counter = %d)\n", counter);
    return 0; 
}
```

使用 `riscv64-linux-gnu-gcc test.c -g -Og -o test` 进行编译，之后，`worker` 函数的汇编就是

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_3_42_17_202411080342605.png"/>

可见，即便做了 Og 优化，简单如加法操作，仍然不是 atomic。从而，可能造成这样的情况：

1. 在多核的情况下，两核分别运行两个线程。两个线程寄存器是独立的，内存是共享的（实际 low level cache 也是独立的）。因此， 只有内存被刷新了，两个线程才能读到对方的数据
2. 即便在单核的情况下，线程 1 跑到 `addiw a5, a5, 1` 的时候 timer int 了，之后线程 2 从 `aupic a3, 0x2` 开始跑，跑完之后再回到线程 1 的 `sw a5, 0(a3)`，导致线程 1 的 `addiw a5, a5, 1` 没有实际作用。从而少加了 1。

当然，如果使用 `pthread_mutex_lock/unlock`，那么就可以正确输出 2000000。



## Race Condition

如果多个进程（或者线程）并行执行，而且输出结果取决于这几个进程/线程指令的执行顺序，那么这种情况就被称为 race condition

> [!info]+ 为什么进程也会有这种情况
> 
> 因为系统在内核态的时候，也可以发生中断（中断可以无线嵌套）。因此，可能发生以下情况（如果没有竞争控制的话）：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_17_47_20241108051746.png"/>

## Critical Section

Critical section 用于访问**不能所有处理器共享**的资源。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_18_16_20241108051815.png"/>

**Note**:

- 在 entry section，进程需要询问是否能进入 critical section
- 如果当前不能，就等待一段时间并再次询问；如果可以，就进入 critical section
- 在 exit section，进程执行退出 critical section（同时释放 critical section 的资源）的步骤
- 然后，进入 remainder section，最后重新回到 entry section

## Sufficient Requirements for Solution

如何避免上图中出现 race condition？充分条件是下面的三个：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_21_15_20241108052115.png"/>

### Peterson's Solution

在只有两个进程的情况下，Peterson 构造出了一种可行的方案：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_27_31_20241108052731.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_28_2_20241108052801.png"/>

> [!info]+ Proves
> 
> **Mutual Exclusion**
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_39_29_20241108053929.png"/>
> 
> **Progress Req**
> 
> 在其中一个线程 quit CS 的瞬间，如果另一个线程卡在 CS 处，那么由于 flag = FALSE，因此另一个线程可以立即进去；如果两个线程都在 entry section，那么谁**先**执行 `turn = ...`，谁就可以获得进入 CS 的机会。
> 
> **Bounded Waiting**
> 
> 如果进程 A 进入了，进程 B 等待。那么，只需要等进程 B 执行完毕，并且完成 exit section，进程 A 就可以进去执行。这显然是 bounded waiting。

### Drawbacks of Peterson's Solution

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_47_52_20241108054752.png"/>

三个瑕疵。其中，第三个瑕疵可以见下图：

> [!note]+ 第三个瑕疵
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_50_26_20241108055025.png"/>
>
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_5_50_9_20241108055009.png"/>
> 
> 简单来说，如果 compiler 在优化的时候，直接将线程 2 中的两行代码调换了位置（因为它们之间无依赖关系，因此可以调换位置），那么就会导致输出结果不同。
> 
> 同理可以考虑 Peterson's solution 在编译优化或者乱序执行下可能造成的后果。


## Hardware Fix

### Memory Barrier

首先，在**多核模型**下，我们看看 memory hierarchy：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_6_1_48_20241108060148.png" width="50%"/>

- 也就是说，执行 `ld/sd` 这类命令的时候，改变未必能够迅速反映给所有的 cores。

具体 memory barriers 的定义，详见下图：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_6_0_11_20241108060011.png"/>

因此，我们只需要在第三个瑕疵中，加入 `memory_barrier` 即可：

```c
int flag = 0;
x = 0;

void * thread1(void * args) {
	while(!flag);
	memory_barrier(); // So that the change of x can be propagated (from L3 or memory) to thread1
	print(x);
}

void * thread2(void * args) {
	x = 100;
	/*
	* First, the order of `x = 100` and `flag = 1` will not be reversed
	* Second, propagate x to shared L3 cache or main memory. So that thread1 may read it.
	*/
	memory_barrier();
	flag = 1;
}
```

### Atomic `test-and-set`

`test-and-set` 功能上等价于下面这个函数：

```cpp
bool test_set (bool *target)
{
	bool rv = *target;
	*target = true;
	return rv;
}
```

只不过在硬件上实现是 atomic。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_6_24_53_20241108062453.png"/>

如上，这样简单的 protocol，是否满足三个 reqs 呢？

- **Mutual exclusion**: 如果任何进程希望从 entry section 进入 CS，那么必须在某一刻：
	- `lock` 是 false。
	- 并且下一刻，该进程执行 `test_set`，得到返回值 false（从而跳出 `while`），并且将其变成 true。
	而只有在 CS 中的进程可能将 lock 变成 false。因此，一个进程进入 CS 之后、退出 CS 之前，不可能有第二个进程进入 CS
- **Progress**: 如果进程退出了 CS，那么 lock 就变回 false。如果此时有进程在 entry，那么就可以抢这个 lock。抢到就是胜利。
- **Bounded-waiting**: 但是，一个进程是可能**抢不到**的。只要抢不到，就要一直等；如果一直等，那么就不是 bounded-waiting。
	- 因此，这个简单的 protocol ***不能***实现同步。我们还需要改进

> [!info]+ 改进
> 
> 如图，在退出阶段，退出者会尝试自己之后的每一个进程
> - 如果存在一个等待的，那么就通过设置 `waiting[j] = false` 来把所有权给它
> 	- 可以理解为：我不把 lock 仍在地上，而是交给了 j，因此 lock 一直都是 true
> - 如果没有任何在等待资源的进程，就设置 `lock = false`
> 	- 可以理解为：我把 lock 扔在地上，先到先得
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_22_45_28_20241108224527.png"/>

### Atomic `compare-and-swap`

`compare-and-swap` 功能上等价于下面这个函数：

```cpp
int compare_and_swap (int *value, int expected, int new_value)
{
	int temp = *value;
	if (*value == expected)
		*value = new_value;
	return temp;
}
```

只不过在硬件上实现是 atomic。

因此，我们只需要将前面的程序改成：

```cpp
while (true) {
	while (compare_and_swap(&lock, 0, 1) != 0)
		; // do nothing
	/* critical section */

	lock = 0;
	/* remainder section */
}
```

即可实现除了 bounded-waiting 以外的其它两个功能。

### Example: arm64

ARM64 并没有 `compare-and-swap` 这个指令，我们用到的是 `ldxr/stxr` 指令对。我们可以使用这对指令，实现一样的功能。

> [!info]+ ldxr/stxr
> 
> [LDXR](https://developer.arm.com/documentation/ddi0602/latest/Base-Instructions/LDXR--Load-exclusive-register-) 是内存独占加载指令，它从内存中以独占方式加载内存地址的信到通用寄存器里。
>
> 以下是 `LDXR` 指令的原型，它把 `Xn` 或者 `SP` 地址的值原子地加载到 `Xt` 寄存器里。
>
> 	ldxr xt, [xn | sp]
> 
>[STXR](https://developer.arm.com/documentation/ddi0602/latest/Base-Instructions/STXR--Store-exclusive-register-) 是内存独占存储指令，它以独占的方式把新的数据存储到内存中。
>
> 	stxr ws, xt, [xn | sp]
>
>以下是 `STXR` 指令的原型，它把 `Xt` 寄存器的值原子地存储到 `Xn` 或者 `SP` 地址里，执行的结果反馈到 `Ws` 寄存器中。
>
>- 若 `Ws` 寄存器的值为 0，说明 `LDXR` 和 `STXR` 指令都执行完了。
>- 如果结果不是 0，说明 `LDXR` 和 `STXR` 指令都已经发生错误，此时需要跳转到 `LDXR` 指令处，重新做原子加载以及原子存储操作。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_23_9_21_20241108230920.png"/>

因此，我们可以通过这样的指令，来原子式地 lock。

**注意**：线程 A 设置的 `ldxr`，线程 B 不能够解锁。

## Abstractions

### `atomic` library

我们可以使用（库中）实现好的 atomic variable，来当作原子变量（i.e. 锁）。比如 C++ 的 `std::atomic` 类型。
### Mutex

Basically，互斥锁就是下面这个东西。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_23_47_46_20241108234746.png"/>

**问题 1**：在线程多、核少的情况下，如果 critical section 很长，那么执行的时候，难免会进行上下文切换。此时，如果只有一个线程在执行 critical section，那么说明其它所有线程都在 busy waiting。假设只有一个核以及 N 个线程，那么 CPU 利用率就是可怜的 $\frac 1 N$。

**Sol 1**：加入 **waiting queue**，让等待的进程去 sleep。直到执行 critical section 的进程 quit 的时候，才去“叫醒”这些等待的进程。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_23_51_0_20241108235100.png"/>

### Semaphore（信号量）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/8_23_52_46_20241108235246.png"/>

信号量模型就是一个变量（`S`）+两个动作（`wait/signal`）。假设 S 初始的时候等于 N，那么意思就是：我们一共只有 N 份资源，你们不能用超过这 N 份。

在 critical section 模型中，同一时间最多只能有一个线程执行目标代码。因此，N = 1，S 本质上就是 boolean 类型，semaphore 退化为 mutex。

> [!info]+ semaphore with blocking
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_3_2_57_20241109030256.png"/>

同时，我们需要让 semaphore 的 `wait` 以及 `signal` 也是原子操作（i.e. `wait` 和 `signal` 内部本身就是 critical section）。对此，我们还需要用更轻量的 mutex w/o blocking 来进行保护。
### Blocking Or Not?

对于 CS 较短的情况，我们可以 non-blocking，避免过多进行调度；对于较长的情况，就是 blocking，避免资源浪费。

### Semaphore in Practice

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_3_48_58_20241109034857.png"/>

如上图：`m->guard` 就是小锁（用于保护 `m->flag` 以及相关 critical section，都很短），而 `m->flag` 是大锁（用于保护其它的 critical section）。

下图就是锁的流程。
> [!info]+
> 1. T0 首先抢到了 guard
> 2. T0 在抢到 guard 之后，也顺便抢走了 flag，然后交还 guard
> 3. T1 抢到了 guard，但是 flag 已经被抢走，因此就只能进入 sleep；同时 T0 执行漫长的 critical section
> 4. T0 执行完毕之后，抢到了 guard
> 5. 然后，因为等待队列里有其他线程，因此执行 `unpack`，将 flag “交给” 那个线程，之后交还 guard
> 6. 然后，T1 执行漫长的 critical section
> 7. T1 执行完毕之后，抢到了 guard
> 8. 然后，因为等待队列里**没**有其他线程，因此交还 `flag`——谁想要，谁就去抢吧。当然，之后还要交还 guard
> 9. ……
>    
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_3_50_51_20241109035051.png"/>

### 死锁和饥饿

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_3_50_38_20241109035037.png"/>

如上图：如果只有两个 processes，它们都要用到 S 和 Q 资源。然后，P0 抢到了 S，P1 抢到了 Q。此时，两者都“抓牢”自己的资源，谁都不肯放手，因此就永远拿不到另一方的资源。这就是死锁的经典例子。

死锁会造成 starvation，但是 starvation 不一定是死锁造成的。还可能是一直抢不到资源造成的。

#### Priority Inversion

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_6_54_59_20241109065459.png"/>

如图：

1. 低优先级执行，并且拿到了资源锁
2. 中优先级准备执行，于是打断了低优先级
3. 紧接着，高优先级准备执行，于是打断了中优先级
4. 但是，高优先级需要资源锁，因此只能 block
5. 中优先级继续执行，直到执行完毕
6. 然后，低优先级继续执行，直到执行完毕并释放资源锁
7. 最后，高优先级才能够获得资源锁，并且执行

从而，本次的执行中，是“中>低>高”——优先级倒置了。

### Implementation in Linux

在 Linux 中，

- atomic integers
- spinlocks
- semaphores
- reader-writer locks

都在内核中实现了。

至于用户态的，POSIX 标准要求实现，因此 C 中有专门的库去实现。

### Conditional Variable

有三个基本操作：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_7_34_11_20241109073411.png"/>

示例程序：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_7_34_27_20241109073426.png"/>

和 semaphore 相比，condition variables 可以 broadcast——在 condition is fulfilled 的情况下，将所有的线程叫醒。

## Three Problems in Synchronization

- Bounded-Buffer Problem
- Readers-Writers Problem
- Dining Philosopher Problem

### Bounded-Buffer Problem

**问题描述**：有两个进程，一个是 producer、一个是 consumer，它们 share a buffer of size **N**。Producer 不断 add data into buffer，而 consumer 不断 remove data from buffer。我们需要让：

- Producer stop adding data into the buffer if it is full
- Consumer stop removing data into the buffer if it is empty

**解决方法**：

设置三个 semaphore：

- `mutex`: 初始值为 1
	- 读写权
- `full-slots`: 初始值为 0
	- 能够读的权利
- `empty-slots`: 初始值为 N
	- 能够写的权利

对于 producer:

```c
do {
	// Produce an item
	wait(empty_slots);
	wait(mutex);

	// Add item to buffer

	signal(mutex);
	signal(full_slots);
} while (TRUE);
```

对于 consumer:

```c
do {
	wait(full_slots);
	wait(mutex);

	// Remove item from buffer

	signal(mutex);
	signal(empty_slots);

	// Consume the item
} while (TRUE);
```

### Readers-Writers Problem

**问题描述**：

- A data set is shared among a number of concurrent processes
	- readers: only read the data set; they do not perform any updates
	- writers: can both read and write
- The readers-writers problem:
	- allow multiple readers to read at the same time (shared access)
	- only one single writer can access the shared data (exclusive access)

**解决方法**：

设置三个 semaphore：

- semaphore `mutex`
	- 用于保证整个 entry 的原子性
- semaphore `write`
	- 写的权利
		- 如果在 writer 的手上，那么就是这个 writer 独享的
		- 如果在 reader 的手上，只有第一个 reader 会抢夺它。剩下的 reader 就不需要了（i.e. reader 只要保证 `write` 不在 writer 的手上即可）
- **integer** `readcount`
	- 用于记录 active reader 的数量

对于 writer:

```c
do {
	wait(write);

	// write something

	signal(write);
} while (TRUE);
```

对于 reader:

```c
do {
	wait(mutex);
	readcount++;
	if (readcount == 1)
		wait(write);
	signal(mutex);

	// read something

	wait(mutex)
	readcount--;
	if (readcount <= 0)
		signal(write);
	signal(mutex);
} while (TRUE);
```

- 如上面的代码：只有**第一个** reader 需要尝试抢夺以及释放 `write`。只要抢到了（i.e. 保证 `write` 不在 writer 手上），就可以读了。

#### Variations: Read/Writer Priority

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/9_19_56_45_20241109195645.png"/>

**对比**：

- 对于 reader first 而言，只要 reader 抢到了，那么直到所有 reader 都结束了，才会释放 `write`。
- 对于 writer first 而言，如果 writer 希望进行 write，之前正在 read 的 reader 可以继续，但是新的 reader 就会被阻塞

我们之前的 implementation 显然是 reader first。如果希望 writer first 的话，其实也很好办：可以加上一个 `reader_allow_get_write_lock`（不过这其实就是一个 atomic variable。同时，如果这个变量变成 1 了，那么所有的 reader 都要 wake up）

### Dining Philosopher Problem

并没有现实中直接对应的应用，只是这个问题比较难，可以用来测试 primitive 的设计是否恰当。

**问题描述**：若干个哲学家围着桌子坐。他们主要在思考，偶尔在吃饭，从来不互相交谈。他们每两人之间，摆着一根筷子。必须要两根筷子才能吃饭；只能拿左右两边的筷子。如何不造成 starvation 以及 deadlock？

**Simple but totally failed approach**: 简单用 mutex 来锁住每一根筷子。

显然，如果所有哲学家同时拿起了筷子，那么直接 gg。

**Somehow feasible but stilled flawed approach**:

1. 先（试图）拿左边的筷子
2. 再拿右边的筷子
3. 吃饭
4. 先放右边的筷子
5. 再放左边的筷子

假如所有哲学家同时拿起左边的筷子，那么右边的筷子永远不可能空出来，因此死锁发生。

**Dijkstra's approach**: 

1. 先（试图）拿 A 边的筷子
2. 再拿 B 边的筷子
3. 吃饭
4. 先放 B 边的筷子
5. 再放 A 边的筷子

其中：我们按顺序给哲学家进行编号，如果该哲学家是奇数，那么 A = 左、B = 右；如果该哲学家是偶数，那么 A = 右、B = 左。

> [!example]+ Example
> 
> 如果 1 号哲学家已经拿起了左手边的筷子，那么就在等待右手边。此时，
> 1. 如果 2 号哲学家拿起了左手边的筷子（i.e. 和 1 竞争），那么说明 2 已经拿起了右手边的，因此 2 可以吃饭
> 2. 如果 2 号哲学家没有拿起了左手边的筷子（i.e. 没有和 1 竞争），那么 1 就可以拿起，从而 1 可以吃饭
> 
> 因此，在***1 号哲学家已经拿起了左手边的筷子***的情况下，不会发生死锁。其它情况可以类似推理。

## Deadlocks

比如下面这个程序

```c
##include <pthread.h> #include <stdio.h>

pthread_mutex_t first_mutex; pthread_mutex_t second_mutex;

##include <pthread.h> #include <stdio.h>

pthread_mutex_t first_mutex; pthread_mutex_t second_mutex; pthread_mutex_t add_lock;

int k = 0;

void *do_work_one(void *param) { printf("Thread 1\n"); do { pthread_mutex_lock(&first_mutex); pthread_mutex_lock(&second_mutex);

     int current_k = k;  
 ​  
     pthread_mutex_unlock(&second_mutex);  
     pthread_mutex_unlock(&first_mutex);  
 ​  
     printf("%d ", current_k);  
 ​  
     pthread_mutex_lock(&add_lock);  
     ++k;  
     pthread_mutex_unlock(&add_lock);  
 } while (1);

}

void *do_work_two(void *param) { printf("Thread 2\n"); do { pthread_mutex_lock(&second_mutex); pthread_mutex_lock(&first_mutex);

     int current_k = -k;  
 ​  
     pthread_mutex_unlock(&first_mutex);  
     pthread_mutex_unlock(&second_mutex);  
 ​  
     printf("%d ", current_k);  
 ​  
     pthread_mutex_lock(&add_lock);  
     ++k;  
     pthread_mutex_unlock(&add_lock);  
 } while (1);

}

int main() { pthread_mutex_init(&first_mutex, NULL); pthread_mutex_init(&second_mutex, NULL); pthread_mutex_init(&add_lock, NULL);

 pthread_t thread1, thread2;  
 ​  
 pthread_create(&thread1, NULL, do_work_one, NULL);  
 pthread_create(&thread2, NULL, do_work_two, NULL);  
 ​  
 pthread_join(thread1, NULL);  
 pthread_join(thread2, NULL);  
 ​  
 return 0;

}
```

这样的程序，往往的运行结果是：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_24_11_20241110052410.png"/>

甚至是：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_24_40_20241110052439.png"/>

一眨眼功夫就会出现 deadlock。因此，deadlock 是必须要预防的问题；如果无法预防，那么也要在出现 deadlock 之后进行解决。

### System Model

对于资源以及对其的 request 和 allocation，我们可以使用 resource allocation graph 来表示：

> [!info]+ Resource Allocation Graph
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_31_20_20241110053119.png"/>

> [!example]+ Example 1
> 如图：只要 P3 用完了资源然后释放 R3，P2 就能拿到 R3 并且开始执行，P2 执行完毕之后释放 R1、R2，然后 P1 就能拿到 R1 并且开始执行。
> 
> 因此，执行顺序是 P3, P2, P1。不存在死锁。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_28_46_20241110052846.png"/>

> [!example]+ Example 2
> 
> 如图，所有进程之间的依赖形成了一个环，因此有死锁。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_38_27_20241110053826.png"/>

> [!example]+ Example 2
> 
> 如图，即便部分进程之间的依赖形成了环，也不一定有死锁。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_39_44_20241110053944.png"/>

### Four Conditions of Deadlock

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_5_41_1_20241110054101.png"/>

只有四个条件均达成，才**有可能**导致死锁。

### Deadlock Prevention

只要打破四个条件其中之一，就不会发生死锁。

1. **Mutual Exclusion**: 对于共享资源，这不是问题；对于独享资源，这没法解决 : (
2. **Hold and Wait**: 我们要求所有的进程必须**一次性获取所有资源**。
	- 但是，对于一些需要获取很多资源的进程而言，这是不太现实的——会造成严重的 starvation
3. **No Preemption**: 如果一个进程请求一个不可用的资源
	- 释放所有当前持有的资源
		- 也就是说：a resource can be released by the process holding it **before** it has completed its task
	- 被抢占的资源将被添加到它等待的资源列表中
		- 相当于说：一个进程在收集其所有资源的过程中，如果中途某个资源收集失败了，那么已经收集的资源，将被其它进程所抢占
	- 只有当它能获得所有等待的资源时，进程才会重新启动
4. **Circular Wait (因为这个实现非常简单，所以被操作系统采用)**
	- 在所有资源类型上造一个 totol ordering
	- 要求每个进程按 total ordering 请求资源
	- 许多操作系统采用这种策略来处理某些锁

> [!info]+ Circular Wait 的小问题
> 
> 现实生活中，我们其实不是很容易构造一个合理的 total ordering。比如说，如果把“从 A 账户中取钱存到 B 账户”这一操作当成原子操作，那么到底 `lock_A` > `lock_B`，还是相反呢？这两者是难以比较的。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_6_5_32_20241110060532.png"/>

### Deadlock Avoidance

除了通过打破规则的方法，使得死锁**不可能出现**以外，我们还可以实时检测是否会出现死锁。最著名的算法，就是 banker's algorithm。

（下面截取自 Wikipedia）

#### 背景

在银行中，客户申请贷款的数量是有限的，每个客户在第一次申请贷款时要声明完成该项目所需的最大资金量，在满足所有贷款要求时，客户应及时归还。银行家在客户申请的贷款数量不超过自己拥有的最大值时，都应尽量满足客户的需要。在这样的描述中，银行家就好比操作系统，资金就是资源，客户就相当于要申请资源的进程。

#### 进程

```
      Allocation　　　Max　　　Available
 　　 ＡＢＣＤ　　  ＡＢＣＤ　　ＡＢＣＤ
 P1   ００１４　　  ０６５６　　１５２０　
 P2　 １４３２　　  １９４２　
 P3　 １３５４　  　１３５６
 P4 　１０００　　  １７５０
```

我们会看到一个资源分配表，要判断是否为安全状态，首先先找出它的Need，Need即Max（最多需要多少资源）减去Allocation（原本已经分配出去的资源），计算结果如下：

```
   NEED
 ＡＢＣＤ
 ０６４２　
 ０５１０
 ０００２
 ０７５０
```

然后加一个全都为false的字段

```
 FINISH
 false
 false
 false
 false
```

接下来找出need比available小的（千万不能把它当成4位数 他是4个不同的数）

```
   NEED　　  Available
 ＡＢＣＤ　　ＡＢＣＤ
 ０６４２　　１５２０
 ０５１０<-
 ０００２
 ０７５０
```

P2的需求小于能用的，所以配置给他再回收

```
  NEED　　   Available
 ＡＢＣＤ　　ＡＢＣＤ
 ０６４２　　１５２０
 ００００　＋１４３２
 ０００２－－－－－－－
 ０７５０　　２９５２
```

此时P2 FINISH的false要改成true（己完成）

```
 FINISH
 false
 true
 false
 false
```

接下来继续往下找，发现P3的需求为0002，小于能用的2952，所以资源配置给他再回收

```
 　NEED　　    Available
 ＡＢＣＤ　　Ａ　Ｂ　Ｃ　Ｄ
 ０６４２　　２　９　５　２
 ００００　＋１　３　５　４
 ００００－－－－－－－－－－
 ０７５０　　３　12　10　6
```


依此类推，做完P4→P1，当全部的FINISH都变成true时，就是安全状态。

> [!question] Do we actually use it IRL?
> 
> IRL, Linux 等操作系统中，其实并不使用这样的算法。最主要原因是因为 MAX 是难以预先估计的。

### Deadlock Detection

> [!note]+ 
> 
> 这里假设
> 
> 1. 不同资源之间是 non-identical 的，互相不可代替
> 2. 一个程序如果使用某资源的话，那么只使用一份资源
> 3. 每个资源的份数，就是该资源图中结点的**出边数量（出度）**

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_7_0_54_20241110070054.png"/>

我们可以把第一张图（i.e. system model 中的经典图）转换成第二张图。然后，**存在死锁，当且仅当第二张图有环**。

### Deadlock Recovery

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_7_27_36_20241110072736.png"/>

- 可以将环上 processes 抢占的资源全部释放
- 可以逐一将抢占的资源进行释放，直到 deadlock 不存在为止
	- 具体按照什么顺序？可以参考上图

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/11/10_7_49_59_20241110074958.png"/>


