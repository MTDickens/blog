# Basics

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/10_0_0_1_20241210000000.png"/>

# I/O 的种类

**Polling**：如果 I/O 设备忙，那么就 busy waiting。

**Interrupt**: 发出 I/O 请求之后，就不再管它，而是直接去执行代码；然后 I/O 请求收到回复之后，硬件发出中断，然后再去处理这个。

前者的问题在于如果 I/O 设备忙，那么需要一直等待；后者的问题在于，如果 I/O 请求很多，那么会造成程序一直在处理中断，根本没去运行代码。

# DMA

DMA 是一种技术，旨在让 I/O 设备读写内存的时候，不需要经过 CPU。从而我们可以实现 CPU 执行和 I/O 过程异步进行。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/10_0_33_8_20241210003307.png"/>

如图，

1. 使用 `ioctl` system call
2. trap 就会去告知对应的 device driver
3. Device driver 会通知相应的 drive controller
4. Drive controller 就会告知 DMA controller 开始 DMA transfer，直接将数据通过 PCIe bus 以及 CPU memory bus 写入 memory。此谓 **direct memory access**
5. 写入完毕之后， DMA controller 就会给 CPU 发送 interrupt

# Characters of I/O Devices

| aspect             | variation                                                          | example                               |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------- |
| data-transfer mode | character <br>block                                                | terminal <br>disk                     |
| access method      | sequential <br>random                                              | modem<br>CD-ROM                       |
| transfer schedule  | synchronous<br>asynchronous                                        | tape <br>keyboard                     |
| sharing            | dedicated <br>sharable                                             | tape <br>keyboard                     |
| device speed       | latency <br>seek time<br>transfer rate<br>delay between operations |                                       |
| I/O direction      | read only<br>write only<br>read-write                              | CD-ROM<br>graphics controller<br>disk |

- ﻿﻿Broadly, I/O devices can be grouped by the OS into
	- ﻿﻿block I/O: read, write, seek
	- ﻿﻿character I/O (Stream)
	- ﻿﻿memory-mapped file access
	- ﻿﻿network sockets
- ﻿﻿OSs have usually an escape/back door that passes any I/O  
    commands from app to device
- ﻿﻿Linux's `iocti` call to send commands to a device driver

> [!info]+ Synchronous I/O vs Asynchronous I/O
> 
> 如图，左图是同步 I/O，右图是异步 I/O。
> 
> 左图中，如果 I/O 硬件没有执行完毕，那么这个指令就不会返回；右图中，发出 I/O 命令之后，直接返回。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/10_0_14_3_20241210001402.png"/>

# Kernel I/O Subsystem

宏内核包含了 I/O 子系统。这个系统可以做下面的事情：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/10_0_41_43_20241210004142.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/10_0_42_35_20241210004235.png"/>

- spooling 就是输出缓存

# I/O Protection

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/10_0_45_12_20241210004511.png"/>

键盘事件肯定不是所有软件都能监听到的。可能只有处于焦点的软件才能监听到（否则就难免会出现密码泄露）。因此键盘事件必须是 privileged。

# UNIX I/O Kernel Structure

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/14_6_21_11_20241214062110.png"/>

> [!info]+ Kernel source code



```c
struct task_struct {
	// ...

	/* Filesystem information: */
	struct fs_struct		*fs;

	/* Open file information: */
	struct files_struct		*files;

	// ...
}
```

`struct files_struct *files` 就是 per-process open-file table:

```c
/*
 * Open file table structure
 */
struct files_struct {
  /*
   * read mostly part
   */
	atomic_t count;
	bool resize_in_progress;
	wait_queue_head_t resize_wait;

	struct fdtable __rcu *fdt;
	struct fdtable fdtab;
  /*
   * written part on a separate cache line in SMP
   */
	spinlock_t file_lock ____cacheline_aligned_in_smp;
	unsigned int next_fd;
	unsigned long close_on_exec_init[1];
	unsigned long open_fds_init[1];
	unsigned long full_fds_bits_init[1];
	struct file __rcu * fd_array[NR_OPEN_DEFAULT];
};
```

其中，这个 `struct file * fd_array` 就是指向各种 record 的指针的 array。

## I/O Request to Hardware

﻿﻿Consider ***reading a file from disk*** for a process:
- ﻿﻿determine device holding file
- ﻿﻿translate name to **device representation**
	- ﻿﻿FAT, UNIX: major/minor
- ﻿﻿physically read data from disk into buffer
- ﻿﻿make data available to requesting process
- ﻿﻿return control to process

> [!info]+ Lifecycle of An I/O Request
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/14_6_40_18_20241214064017.png"/>

## How to Reduce I/O Overhead

一句话：make devices smarter。

具体来说，能用 DMA 就用 DMA，设备的 controller 能够胜任就让它来负责——别所有东西都让 CPU 来决策。

## Question: How to Register a Device on Linux

以 `tty` 为例：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/14_6_47_55_20241214064754.png"/>

可以大致看出，需要进行注册。因此，我们在热插拔设备的时候，就会产生中断，然后进行设备的注册和取消注册。

## Linux I/O Implementation

### `write`

`write` -> ... -> `vfs_write` -> (indirect call) `tty_write`

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/14_7_0_53_20241214070052.png"/>
### `ioctl`

`ioctl` -> `vfs_ioctl` -> (indirect call) `tty_ioctl`

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/14_7_3_10_20241214070309.png"/>
