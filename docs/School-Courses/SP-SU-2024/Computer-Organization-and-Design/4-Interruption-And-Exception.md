# Interuption and Exception

Exception arises within the CPU when executeinstruction

Interruption is from an external I/O controller.

- 一般情况下，我们必须**立即**处理 exception
    - 比如说 stack overflow 就是段错误，直接 core dump 了
    - 又比如说 illegal instruction，也是无法继续执行下去，就终止了
    - 也比如 page fault，需要立即去硬盘里取对应的 page，然后复制到物理内存的某个部分，做好虚存的映射，然后再重新跳转回原来的指令处，开始执行
    - 还比如 trap
- 但是可以不立即执行 interruption。
    - 比如 IO 信号就是 interruption

| Type of event                   | From where? | RISC-V terminology |
| ------------------------------- | ----------- | ------------------ |
| System reset                    | External    | Exception          |
| I/O device request              | External    | Interrupt          |
| Invoke the OS from user program | Internal    | Exception          |
| Using an undefined instruction  | Internal    | Exception          |
| Hardware manifunctions          | Either      | Either             |

---

对于 MIPS 等大多数 ISA 而言，interruption 和 exception 是分开的。

但是，**RISC-V 不区分两者**，都是在执行某一条 inst 之前，检查是否有 exception/interruption，然后就跳转至对应的入口。跳转过去之后，再检查具体是 interruption 还是 exception，具体是哪种 interruption/exception，然后执行对应的动作。

## Why we need Interruption?

- 如果由 CPU 专门来轮询等待的话，就会非常浪费资源。
- 如果只是在执行每一条指令之前，检查一下 interruption bit 是否置位，则可以干别的事（比如等待 I/O 的时候，就上下文切换，去执行别的进程，而把当前的进程挂起）。

后者就是所谓 interruption driven I/O。

---

**设计哲学：**我们将所有耗时的外部行为，都交给外部元件去做。然后外部原件做完了之后，通过 interruption 来通知 CPU。

比如，对于硬盘（而非输入输出设备）这种 I/O，我们往往是通过 DMA (Direct Memory Access) 来管理。

具体地：将硬盘数据位置、大小以及希望存储到的内存位置发给 DMA，然后等待 DMA 执行即可。

## How to Handle Exceptions?

1. Save PC
    - In RISC-V: Supervisor Exception Program Counter (SEPC)
2. Save indication of the problem
    - In RISC-V: Supervisor Exception Cause Register (SCAUSE)
3. Jump to handler
    - In RISC-V: Entry address is in a special register: supervisor trap vector (STVEC), which can be loaded by OS

# Privileged Levels

特权可以保证不同的软件栈（不被非法访问）。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_3_57_46_202404190357542.png" alt="image-20240419035745277" style="zoom: 50%;" />

- 为方便起见，我们此处只使用一个 M

# Control and Status Registers (CSR)

如果要找一个 CSR，需要用到 12 位。因此一共有 4096 个 CSR。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_2_13_202404190402308.png" alt="image-20240419040206834" style="zoom:33%;" />

## Instruction Overview

具体而言，我们可以通过以下指令来改变 CSR：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_16_41_202404190416506.png" alt="image-20240419041638572" style="zoom:50%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_17_50_202404190417967.png" alt="image-20240419041747332" style="zoom:50%;" />

其中：

- csr rw rd,csr,rs1：rs1------>csr,csr------>rd,写入新的数据
- csr rc  rd,csr,rs1：~rs1&csr------>csr,csr------->rd,关闭某几位           
- csr rs  rd,csr,rs1：rs1|csr----->csr,csr------>rd,打开某几位       
- csr rwi rd,csr,imm：imm------>csr,csr------>rd,写入新的数据
- csr rci  rd,csr,imm：~imm&csr------>csr,csr------->rd,关闭某几位        
- csr rsi  rd,csr,imm：imm|csr----->csr,csr------>rd,打开某几位

## Address Mapping Conventions

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_5_14_202404190405851.png" alt="image-20240419040512166" style="zoom:50%;" />

## Privileged Call Instructions

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_22_40_202404190422578.png" alt="image-20240419042237556" style="zoom:50%;" />

Obs:

- ecall 本质上和 jal 是类似的
- MEPC 就是用来存返回地址的

## Some Important Registers

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_30_14_202404190430423.png" alt="image-20240419043011111" style="zoom: 50%;" />

### `mstatus`: 全局状态

这是一个全局寄存器，负责记录全局的情况。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_38_31_202404190438657.png" style="zoom: 80%;" />

如图

- MIE, SIE, UIE 分别记录了在这些模式下是否允许 interrupt
    - 意义：我在执行系统代码的时候，可能根本不希望任何来自外部的 interrupt 来打断我的执行
- xPIE 记录了在 trap 之前的的 MIE, SIE, UIE
- xPP 记录了 trap 之前的 mode
    - 由于只会从 low privilege trap 到 high privilege，因此
        1. MPP 可能有 3 种情况（MPP, SPP, UPP），因此需要两位
        2. SPP 只有两种情况（SPP, UPP），因此只需要一位
        3. UPP 只有一种情况（UPP），因此在这里被省略了

### `mie`/`mip`: 更细粒度的状态

这两类寄存器，相比 `mstatus`，粒度更细。也就是说，如果 `mstatus` 的 xIE 为 1，那么`mie`/`mip` 就会对允许的 interrupt 进行更加细致的划分；如果是 0，那么所有 interrupt 均被禁止，`mie`/`mip` 也失去作用。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_52_1_202404190452071.png" style="zoom:80%;" />

如上图

- xEIE 决定是否 enable 外部中断
- xSIE 决定是否 enable 软件中断
- xTIE 决定是否 enable 计时器中断（也就是是否允许 context switch）
- xyIP 决定是否 enable 某种中断 pending
    - 也就是说：不处理这个中断，但是通知你这个中断出现了

### `mtvec`: 入口地址

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_4_56_18_202404190456207.png" alt="image-20240419045613449" style="zoom: 50%;" />

如图

- 当 mode 的值为 0 的时候，不论是异常还是中断，都直接跳到 base，然后再做处理
- 当 mode 的值为 1 的时候，如果是中断，那么就跳到 base+4&times;cause
    - 比如说，external exception 的 cause 是 11，从而机器就跳到 base + 44

### `mepc`: 返回地址

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_5_31_25_202404190531424.png" style="zoom: 80%;" />

### `mcause`: 异常/中断原因（与 `mtvec` 相配合）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_5_34_9_202404190534835.png" style="zoom:80%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_5_38_21_202404190538780.png" style="zoom:80%;" />

**注意：** 不难发现，如果用的是向量模式，那么两个相邻的异常之间，就是一条指令。一条指令能够执行什么中断功能？能够执行 `jal zero, xxx`，继续跳至目标程序地址。

# Priority

不同的中断/异常可能是同时发生的，因此总要有一个先后顺序：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_5_41_4_202404190541702.png"/>

# 中断处理过程

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_5_43_44_202404190543715.png" style="zoom: 80%;" />

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_5_49_31_202404190549133.png" style="zoom: 80%;" />

# Privileged Architecture

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/04/19_6_4_37_202404190604989.png"/>

如图，

- 如果直接面向硬件，那么应用程序就需要自行发起 trap
- 如果下面有操作系统，那么可以进行 system-call，让操作系统代替自己发起 trap
- 有时候，一台裸机上有多个操作系统在运行，运行在 hypervisor 之上，那么就是图三的 hierarchy