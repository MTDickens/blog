## Outline

- Process Concept
- Process Control Block
- Process State
	- Process Creation
	- Process Termination
	- Process and Signal
- Process Scheduling

## Process Concept

> [!info] 为什么要有进程
> 
> 进程就是资源**分配**（i.e. 一个进程可以使用多少 cpu、mem 等等）和资源**保护**（i.e. 别的进程不能干预这个进程）的基本单元

名词辨析：

- 程序：就是储存在磁盘的一些 bytes
- 进程：程序被加载到内存之后，就是进程
	- 因此，多个**进程**可能是同一个**程序**加载进内存的
	- 一个 OS 中，一般而言都同时有很多进程
	- "job" and "process" can be used interchangeably in OS texts, but we prefer "process"

### 内存组成

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/9_19_15_47_20241009191546.png"/>

**Stack VS Heap**:

- 一般认为，stack 比 heap 快
	- 一是因为 stack 有一个 stack pointer 指向栈顶（因此地址计算啥的比较快）
	- 二是因为 stack 用得多，所以很多都在 cache 里面
- 本质上，stack 和 heap 就是程序运行时的“草稿纸”——用来记录中间信息

**Code & Data Section**: code 和 data section 是其中唯二来自于 elf 文件的。在创建进程的时候，直接映射自 elf 文件。

### 栈

#### 栈的结构

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_5_59_1_202410100559546.png"/>

**Obs**: 函数可以有复杂的调用关系，本质上就是通过一连串栈帧组织起来的；而栈帧之间能够连串，用的就是链表的思想（见上图）。
- 至于每一个栈帧中，其数据的存放也是分门别类的（具体见 ISA 的说明书）。

#### 栈的增长

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_6_4_22_20241010060422.png"/>

**Obs**: Stack overflow，就是栈用的太多导致的。

### 同一程序的进程在不同时刻时的内存差异

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_6_15_23_20241010061523.png"/>

### OS 的内存布局

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_6_16_54_20241010061653.png"/>

如图，（在没有内存映射的前提下，）一个 OS 的内存布局如上图。

## Process Control Block

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_6_20_36_20241010062036.png"/>

每一个进程，都有专门有一个地址，用来存放 meta data。

## Process State

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_6_41_33_20241010064132.png"/>

### Process Creation

一般而言，我们通过 fork 来复制进程。Fork 之后，父进程和子进程之间的区别，只有 PID。然后，我们可以随即对子进程进行处理（比如通过 `exec` 等命令，直接让其它程序覆盖子进程）。

不难看见：子进程和父进程之间的依赖关系，可以形成有根多叉树。如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_6_47_32_20241010064732.png"/>

> [!note]- Linux 的三个特殊进程
> 
> ## 3 个特殊进程
> 
> ### idle 进程，pid = 0
> 
> idle进程：
> 
> - 由系统自动创建, 运行在内核态
> - pid=0，其前身是系统创建的第一个进`
> - 唯一一个**没有**通过`fork`或者`kernel_thread`产生的进程；
> - 完成加载系统后，演变为进程调度、交换；
> 
> ### init 进程，pid = 1
> 
> - init进程由idle通过kernel_thread创建，在内核空间完成初始化后, 加载init程序, 并最终用户空间
> 
> 由0进程创建，完成系统的初始化. 是系统中所有其它用户进程的祖先进程
> 
> Linux中的所有进程都是有init进程创建并运行的。首先Linux内核启动，然后在用户空间中启动init进程，再启动其他系统进程。在系统启动完成完成后，init将变为守护进程监视系统其他进程。
> 
> ### kthreadd 进程，pid = 2
> 
> - kthreadd进程由idle通过kernel_thread创建，并始终运行在内核空间, 负责所有内核线程的调度和管理
> 
> 它的任务就是管理和调度其他内核线程kernel_thread, 会循环执行一个kthread的函数，该函数的作用就是运行kthread_create_list全局链表中维护的kthread, 当我们调用kernel_thread创建的内核线程会被加入到此链表中，因此所有的内核线程都是直接或者间接的以kthreadd为父进程

#### `fork` vs `CreateProcess`

相比 Windows NT 的 `CreateProcess`，`fork` 有以下优缺点：

#### Pros（优点）

1. **简洁：Windows CreateProcess 需提供10个参数**
    - `fork()` 在 UNIX 系统中用于创建进程，只需一个系统调用即可完成。相比之下，`CreateProcess()` 是 Windows 系统的进程创建方式，需传入更多的参数（通常约10个），因此相对复杂。
    - **原因**：`fork()` 直接复制当前进程的状态，不需要用户手动设置过多信息。而 `CreateProcess()` 涉及更多进程启动信息，如路径、环境、权限等，增加了使用的复杂度。
2. **分工：fork搭起骨架，exec赋予灵魂**
    - `fork()` 创建子进程时，只复制当前进程的结构（骨架），然后可以通过 `exec()` 函数替换子进程的内容（灵魂）。
    - **原因**：这是 UNIX 风格的进程创建模式，`fork()` 后可以继续运行子进程的代码，或使用 `exec()` 完全替换子进程的执行内容。`CreateProcess()` 一次性创建和启动进程，没有类似 `fork()` 和 `exec()` 的分离。
3. **联系：保持进程与进程之间的关系**
    - `fork()` 创建的子进程与父进程共享许多资源（如文件描述符等），这有助于父子进程保持紧密的联系。
    - **原因**：`fork()` 通过复制父进程的地址空间，子进程可以继承父进程的大量资源和状态信息。而 `CreateProcess()` 进程是独立的，资源分离较为明显。

#### Cons（缺点）

1. **复杂：两个系统调用**
    - `fork()` 创建进程通常需要与 `exec()` 结合使用，意味着需要进行两次系统调用。
    - **原因**：`fork()` 创建的子进程是父进程的副本，但往往需要通过 `exec()` 来执行新程序，这使得操作需要两步。相比之下，`CreateProcess()` 一步到位完成了进程创建和启动。
2. **性能差**
    - `fork()` 由于复制整个进程的内存和状态信息，性能上可能不如 `CreateProcess()` 高效。
    - **原因**：尽管现代操作系统通过写时复制（Copy-on-Write, COW）优化了 `fork()` 的性能，但在需要创建大量进程时，复制父进程的开销依然可能较大，而 `CreateProcess()` 不复制父进程内容，直接从头初始化子进程。
3. **安全性问题**
    - `fork()` 和 `exec()` 的组合在某些情况下可能引发安全隐患，特别是当进程继承了父进程的资源（如文件描述符、权限等）而没有进行适当的处理时。
	    - 这也是为什么 Linux 需要 `systemd` (用户态) 和 `kthreadd` (内核态) 两个守护进程
    - **原因**：`fork()` 的子进程默认继承父进程的文件描述符、环境变量等，而这些继承的资源如果没有进行严格控制，可能会导致安全风险。而 `CreateProcess()` 中，子进程是从独立的环境启动，避免了资源继承带来的安全隐患。

### Process Termination

说完了 `new` 状态，实际上，`terminal` 状态，是通过一个进程调用 `exit` 这个 kernel call 来实现的。

- 实际上，`main` 函数返回之后，编译器会自动为其创建一个 `exit` call

#### 僵尸进程和孤儿进程

> [!info] 根本原因
> 
> 父进程对子进程需要负很大责任，但是却没负到该负的责任。
> 
> - 当然，孤儿进程也有可能是有意为之（见下文”常见收尸策略“）
> 
> *是誰負責？羞也不羞？我們需要嚴格地檢討！（發自我的手機）——丘成桐*

**僵尸进程**的原因：

-  一个子进程在 `exit` 之后，会进入 terminated 阶段
- 此时，进程不再占用 CPU，但是仍然占用少量的内存（储存 PCB 等信息）
	- 逻辑是：子进程可能会返回给父进程一些有用的信息，因此不能随便就干掉
- 必须通过父进程来亲自”收尸 (reap)“（使用 `wait` 或者 `waitpid`）
- 如果父进程没有去”收尸“，那么子进程就会一直死在那里，称为 zombie
	- 如果 zombie 太多了，就会严重影响系统性能，乃至导致系统崩溃

> [!info]+ 常见收尸策略
> 1. 父进程收尸
> 	- 子进程在 `exit` 时候，会给父进程发送 `SIGCHLD` 信号，
> 		- 这个信号父进程是默认忽略的
> 	- 我们需要写一个 `SIGCHLD` 信号的处理 handle，handle 里就可以通过 `wait` 等等来进行收尸
> 2. systemd 收尸（double fork trick）：我们可以 `fork` 两次，从而创建出 child process 和 grandchild process，然后杀掉 child process，使得 grandchild process 变成孤儿进程（见下文），从而由 systemd 接管，自动收尸
> 	- **注意**：虽然不用管 grandchild 了，但是 child process 仍然需要我们去处理

**孤儿进程**的原因：

- 如果父进程比子进程先死了，子进程的 parent PID 就无效了
- 此时，OS 就会将子进程的 parent PID 直接变成 1
	- 也就是交给 systemd 来管
	- 死后也由 systemd 来自动”收尸“

### Process & Signal

如果一个进程收到了 signal，那么就必须去 handle 它。

- 不同的 signal，默认的 handle 方式不一样
- User 可以为大部分的 signals 设置自定义的 handle
	- 有两个 signal——sigkill 和 sigstop——不能自定义 handler
- User 也可以阻塞大部分的 signals，使得这个 signal 暂时不会被接收到
	- 有两个 signal——sigkill 和 sigstop——不能阻塞

## Process Scheduling

- 目的：最大化利用 CPU；上下文切换快速
- 实现：process scheduler 将 READY queue 上的某个进程放到 CPU core 上去执行
- 维护 `scheduling queue`s for processes，包含 READY 和 WAIT 两种 queues
	- READY: set of all processes residing in main memory, **ready and waiting to execute**
	- `event`-WAIT: set of processes **waiting for an `event`** (i.e. I/O)
	- 进程会在不同 queues 上迁移

### 队列结构

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_20_31_12_20241010203111.png"/>

> [!warning]
> 
> 上图其实根本不是经典的队列。
> 
> Linux 内核中有各种的 `xxx_struct`，为了方便将每一个 struct 变成链表，Linux 采用的策略是：**如果 `xxx_struct` 希望变成链表，那么就在其结构体定义中，加入 `list_head` 这个成员**，如：
> 
> ```c
> struct task_struct {
> // other members ...
> 	struct list_head tasks;
> // other members ...
> }
> ```
> 
> 然后，每一个 `list_head`，指向链表下一个 `xxx_struct` 的 `list_head` 成员。为了计算出下一个结构体的指针位置（而不是下一个结构体的 `list_head` 成员的指针位置），我们还需要减去一个 offset。
> 
> - 有一说一，在这个加加减减+类型强制转换的过程中，很容易出错


### 进程在不同队列之间迁移

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/10_20_32_0_20241010203159.png"/>

如图：

- 如果进程只进行了计算，而没有进行交互，那么就是 time slice expired——结束之后，进程仍然被加入到 ready queue 中
- 如果发起了某些的系统调用，那么可能就会被加到 waiting queue，然后直到这些调用完成的之后，才从 waiting queue 中删去，并放到 ready queue
	- 注意：waiting queue 的数量，等于 waiting targets 的数量

### Context Switch

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/11_4_37_32_20241011043732.png"/>

**原因**：因为**寄存器只有一组**，因此我们需要 context switch，从而保存下来上一个 context 的 structure。

**Trade-off**: 不难看出，context switch 是纯粹的 overhead，因此我们要尽量减小这一部分时间——不论是软件层面上（优化调度），还是硬件层面上（CPU 加速）。

> [!info]+ Linux 内核 RISC-V 架构 context switch
> 
> ```c
> /*
>  * Integer register context switch
>  * The callee-saved registers must be saved and restored.
>  *
>  *   a0: previous task_struct (must be preserved across the switch)
>  *   a1: next task_struct
>  *
>  * The value of a0 and a1 must be preserved by this function, as that's how
>  * arguments are passed to schedule_tail.
>  */
> SYM_FUNC_START(__switch_to)
> 	/* Save context into prev->thread */
> 	li    a4,  TASK_THREAD_RA
> 	add   a3, a0, a4
> 	add   a4, a1, a4
> 	REG_S ra,  TASK_THREAD_RA_RA(a3)
> 	REG_S sp,  TASK_THREAD_SP_RA(a3)
> 	REG_S s0,  TASK_THREAD_S0_RA(a3)
> 	REG_S s1,  TASK_THREAD_S1_RA(a3)
> 	REG_S s2,  TASK_THREAD_S2_RA(a3)
> 	REG_S s3,  TASK_THREAD_S3_RA(a3)
> 	REG_S s4,  TASK_THREAD_S4_RA(a3)
> 	REG_S s5,  TASK_THREAD_S5_RA(a3)
> 	REG_S s6,  TASK_THREAD_S6_RA(a3)
> 	REG_S s7,  TASK_THREAD_S7_RA(a3)
> 	REG_S s8,  TASK_THREAD_S8_RA(a3)
> 	REG_S s9,  TASK_THREAD_S9_RA(a3)
> 	REG_S s10, TASK_THREAD_S10_RA(a3)
> 	REG_S s11, TASK_THREAD_S11_RA(a3)
> 	/* Save the kernel shadow call stack pointer */
> 	scs_save_current
> 	/* Restore context from next->thread */
> 	REG_L ra,  TASK_THREAD_RA_RA(a4)
> 	REG_L sp,  TASK_THREAD_SP_RA(a4)
> 	REG_L s0,  TASK_THREAD_S0_RA(a4)
> 	REG_L s1,  TASK_THREAD_S1_RA(a4)
> 	REG_L s2,  TASK_THREAD_S2_RA(a4)
> 	REG_L s3,  TASK_THREAD_S3_RA(a4)
> 	REG_L s4,  TASK_THREAD_S4_RA(a4)
> 	REG_L s5,  TASK_THREAD_S5_RA(a4)
> 	REG_L s6,  TASK_THREAD_S6_RA(a4)
> 	REG_L s7,  TASK_THREAD_S7_RA(a4)
> 	REG_L s8,  TASK_THREAD_S8_RA(a4)
> 	REG_L s9,  TASK_THREAD_S9_RA(a4)
> 	REG_L s10, TASK_THREAD_S10_RA(a4)
> 	REG_L s11, TASK_THREAD_S11_RA(a4)
> 	/* The offset of thread_info in task_struct is zero. */
> 	move tp, a1
> 	/* Switch to the next shadow call stack */
> 	scs_load_current
> 	ret
> SYM_FUNC_END(__switch_to)
> ```
> 
> 不难看出，就是将  callee saved regs 以及 `ra`，旧的存到旧进程的 PCB 中，新的从新进程的 PCB 中取出来
> 
> - 我们注意到，stack pointer 也改变了，这就是栈本身的切换
> - 实际上，除了 `ra` 以外的 caller saved regs，也会被 interrupt 存起来，但是不放在 `task_struct` 结构体中
> 	- 实际上是因为 timer 到时了之后，就会跳到 `_trap` 去。然后寄存器都存在那里
> - 而 context switch 时候寄存器，都是 PCB 中要用到的，因此存取都在 `task_struct` 结构体中
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/11_6_25_24_20241011062523.png"/>

> [!info]+ 一个进程的 kernel stack
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/10/11_5_57_49_20241011055749.png"/>
> 
> 如图：进程会在内核栈底保存“全局”寄存器值（就是在 context switch 之前，需要把寄存器存到这里）。然后 `thread_info` 就存 PCB，里面就包含 cpu context。

### Scheduling 的细节

在 Linux 中，早期实现中，PRIORITY 越**大**，优先级越大。在 Linux 0.11 中，就是简单的：PRIORITY 正比于分配的时间片（具体见 lab 2）。

## How Does `fork` Work

一言以蔽之：内核在复制进程的时候，已经将子进程的 `pt_regs` 以及 `task_struct` 设置好了。

- For child process, how does `fork` return zero?
	- Also via `pt_regs`, `pt_regs[0] = 0`; set the return value to 0
- When does child process start to run and from where?
	- When forked, child is **READY** → context switch to **RUN**
	- After context switch, run from `ret_to_fork`
		- `ret_from_fork` -> `ret_to_user` -> `kernel_exit` who restores the `pt_regs`
- 至于 `fork` system call 本身，其核心组成就是 `copy_process` 函数，而 `copy_process` 中有很多 `copy_xxx` 的调用，其中一个就是 `copy_thread`

## 进程间通信 (Inter-Process Communication)

主要有四种方法：

1. Shared Memory (与内核无关，只在把同一块物理地址 share 成多个不同进程下的虚拟地址的时候，需要 system call 一下。之后这些进程使用 shared memory 的时候，不需要 system call)
2. Message Passing（每次 passing 的时候，都需要 system call）
3. Pipe
4. 广义上的 IPC，因为是跑在两个物理机器上的交互
	- Sockets
	- RPCs (Remote Process Communication)
		所有的交互都是和 stub 通信，stub 会和远端的 server 通信。 存在网络问题，如丢包。
	- Java RMI
		RPC in Java

具体详见 [hobbitqia 的博客](https://note.hobbitqia.cc/OS/chap03)。