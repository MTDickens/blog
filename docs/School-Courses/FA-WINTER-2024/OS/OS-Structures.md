
# Operating System Services

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/18_22_7_47_20240918220746.png"/>

**注**：

1. system call 就是 user space 和 kernel space 之间的桥梁
2. 红圈内的就是为用户提供服务（抽象资源），蓝圈内的就是优化服务（分配资源）

# User and Operating System-Interface

（略）
# System Calls

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_11_37_19_20240919113718.png"/>

**解释**：
1. `printf` 本质上就是 `write` 的一个 wrapper
2. `write` 函数（i.e. 上面的 `__libc_write`），里面有一个 syscall，将控制流从用户手中交给系统
3. 注意 `%eax` 为 `1`，因为 Linux x86 的 syscall 的 1 号就是 `write`

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_11_43_27_20240919114327.png"/>

**解释**：进入 kernel space 之后，就做下面三件事
1. 无论如何，`kernel_entry` 的代码先会被执行
2. 然后根据传入的 `%eax`，从 `syscall_table` 中获取 `ksys_write` 的地址并 call
3. 在完成之后，执行 `ret_to_user`，并最终返回用户态

> [!note]+ 图示
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_12_8_25_20240919120825.png"/>
> 
> syscall 的完整流程如上


## Types of System Calls

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_1_3_20240919130103.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_1_46_20240919130146.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_1_23_20240919130123.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_1_58_20240919130158.png"/>

# System Services

（略）

# Linkers and Loaders

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_5_34_20240919130534.png"/>

**注**：中间缺了一个预处理环节

## ELF Format

> [!tips]+ 使用 `readelf` 查看 ELF 格式文件
> 
> 1. `readelf -S <file>`：获取 `<file>` 的分区信息，各分区的（虚拟内存）地址、（文件中对应的）偏移量、权限等等
> 2. `readelf -s <file>`：获取符号表，以及各符号的所在地址、所在分区编号、类型、名字等等
> 3. `readelf -p <section> <file>`: Displays the contents of the indicated section as printable strings.
> 4. `readelf -x <section> <file>`: Displays the contents of the indicated section as a hexadecimal bytes.

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_59_49_20240919135948.png"/>

**Answer to quiz**:
1. 所有 `const` 都去 `.rodata`
2. 对于非 `const`，若已经初始化，就去 `data`
3. 若尚未初始化，就去 `bss`

如下图所示：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_14_23_0_20240919142300.png"/>

```
  [Nr] Name              Type             Address           Offset     Flags
  [15] .rodata           PROGBITS         00000000000007e0  000007e0   AX
  [22] .data             PROGBITS         0000000000011000  00001000   WA
  [23] .bss              NOBITS           0000000000011014  00001014   WA
```

**Note**: A(alloc), X(execute), W(write)
## Details of Loader

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_13_57_5_20240919135705.png"/>

`a.dynamic` 就是动态编译（也是默认编译选项）的产物。其中 `.interp` 段指定了解释器。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/19_14_32_22_20240919143221.png"/>

## Running a binary

对于动态加载库的 elf 文件，在操作系统上运行，初始化如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_22_33_10_20240924223309.png"/>

- Who setups ELF file mapping
	- Kernel: exec `syscall`
- Who setups stack and heap
	- Kernel: exec `syscall`
- Who setups libraries
	- Loader: `ld-xxx`


> [!example]+ 动态/静态链接的 `syscall` 对比
> 
> 执行 `a.dynamic` 的时候，可以看到用到了 `ld.so`
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/24_22_39_17_20240924223916.png"/>
> 
> 至于 `a.static`（左图），相比 `a.dynamic`（右图），就会少很多各种加载
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_0_6_20_20240925000618.png"/>

> [!example]+ 动态/静态链接的内存布局对比
> 
> `a.static` 如下，很干净：
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_0_17_18_20240925001718.png"/>
> 
> `a.dynamic` 如下，在 `heap` 和 `vvar` 之间，有 `libc` 的动态链接库（不同虚拟内存，映射到同一个文件，但是权限不同）；在 `vdso` 和 `stack` 之间，就是 loader 的动态链接库（同上）
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_0_17_42_20240925001742.png"/>

> [!example]+ 动态/静态链接执行流程对比
> 
> 如图：上面是静态，下面是动态。区别就一点：动态的时候，`load_elf_binary` 直接跳转至 loader 的起始地址（而不是二进制程序的起始地址）。
> 
> 然后 loader 进行一通操作（i.e. `mmap`），将动态链接库文件（e.g. `libc`）映射到内存中，最后再跳至 `_start`。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_1_48_20240925020147.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_3_14_20240925020313.png"/>

# Why Applications are Operating System Specific Operating-System Design and Implementation

# Operating System Structure

> [!info]- TL;DR
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_15_7_20240925021506.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_25_23_20240925022522.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_26_16_20240925022615.png"/>
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_26_42_20240925022641.png"/>

> [!note]- Linux Kernel 一览
> 
> <iframe src="https://makelinux.github.io/kernel/map/" width="100%" height="600px"></iframe>

## Different Kernels

- 宏内核（Monolithic Structure）：各种 driver 等等辅助组件都在 kernel 内部，并且通过 privileged mode 运行
	- PROS
		- 速度快
	- CONS
		- 内核代码多，不易移植和扩展
		- 如果 driver 在内核态运行过程中崩溃，那么就容易导致整个系统崩溃，稳定性差
		- 安全性相对差
- 微内核（Microkernel）：不那么重要而 drivers，就不在 kernel 内部，并且在用户态下运行
	- PROS
		- 内核代码少，易于移植和扩展
		- 尽量不在内核态中执行，稳定性好
		- 安全性好
	- CONS
		- 由于很多模块位于用户态中，但是又必须通过 `syscall` 来执行关键步骤、传递信息，因此调用链长，速度慢（如下图）
- hybrid kernel：前两者混合，取长补短

> [!note] 微内核调用链
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_11_52_20240925021151.png" scale='50%'/>


# Building and Booting an Operating System

（略，见 lab0）

# Operating System Debugging

> [!note]- 工具一览
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/09/25_2_32_32_20240925023231.png"/>

**Rules of thumb**:

1. Remember the separation of policy and mechanism
2. log（包含 `printk` 和 core dump 等等）为主，gdb 为辅
3. 不要在代码中用 tricks，尽量多加注释、简洁明了
4. 推荐工具
	- `strace` - trace system calls invoked by a process
	- `gdb` - source-level debugger
	- `perf` - collection of Linux performance tools
	- `tcpdump` - collects network packets
