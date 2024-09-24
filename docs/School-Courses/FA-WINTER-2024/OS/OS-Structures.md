
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
# Why Applications are Operating System Specific Operating-System Design and Implementation

# Operating System Structure

# Building and Booting an Operating System

# Operating System Debugging





