# Lec 13: Linking

## Static Linking

Suppose we have two `.c` files:

```c
/*
 * main.c
 */
int sum(int *a, int n);

int array[2] = {1, 2};

int main()
{
    int val = sum(array, 2);
    return val;
}
```

```c
/*
 * sum.c
 */
int sum(int *a int n)
{
    int i, s = 0;
    for (i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}
```

The overall procedure is shown below:

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240125175139031.png" alt="image-20240125175139031" style="zoom:50%;" />

- C preprocessor: `cpp`
- C compiler: `cc1`
- Assembler: `as`
- Linker: `ld`

## Why Use Linkers?

Why not just put all codes into one file?

**Reason 1: Modularity**

- Program can be **written as a collection of smaller source files**, rather than one monolithic mass.
- Can **build libraries of common functions** (more on this later)
  - e.g. Math library, standard C library

**Reason 2: Efficiency**

- Time: Separate compilation
  - Change one source file, compile, and then relink.
  - **No need to recompile other source files.**
- Space: Libraries
  - Common functions can be aggregated into a single file...
  - Yet executable files and running memory images contain only code for the functions they actually use.

## What Do Linkers Do?

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240125182111725.png" alt="image-20240125182111725" style="zoom:33%;" />

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240125182123607.png" alt="image-20240125182123607" style="zoom:33%;" />

## Three Kinds of Object Files

- Relocatable Object File (`.o` file)
  - Contains code and data in a form that **can be combined with other relocatable object files** to form executable object file.
    - Each `.o` file is produced from exactly one source (`.c`) file
- Executable Object File (`.out` file)
  - Contains code and data in a form that **can be copied directly into memory** and then executed. 

- Shared object file (`.so` file) 
  - Special type of relocatable object file that **can be loaded into memory and linked dynamically**, **at either load time or runtime.**
  - Called Dynamic Link Libraries (DLLs) by Windows 

## Object File Format

The standard format for object file is "Executable and Linkable Format (ELF)".

- General name is **ELF binaries**

### ELF Object File Format

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240125183020675.png" alt="image-20240125183020675" style="zoom: 50%;" />

- Elf header:
  - Word size, byte ordering, file type (.o, exec, .so), machine type, etc.


- Segment header table:
  - Page size, virtual addresses, memory segments (sections), segment sizes.


- `.text` section (code indicator):
  - **Code**


- `.rodata` section:
  - **Read-only data: jump tables, ...**


- `.data` section:
  - **Initialized global variables**


- `.bss` section:

  - **Uninitialized global variables**

  - "Block Started by Symbol"

  - "Beginner Save Space"

  - Has section header but occupies no space

- `.symtab` section:

  - **Symbol table**

  - ***Procedure* and *static* variable *names***

  - Section names and locations


- `.rel.text` section:

  - **Relocation info for `.text` section**
    - i.e. Assembler, "*I don't know where these symbols are located in memory, so linker, please fix these for me.*"


  - Addresses of instructions that will need to be modified in the executable

  - Instructions for modifying


- `.rel.data` section:

  - **Relocation info for `.data` section**
    - similar to `.rel.text`


  - Addresses of pointer data that will need to be modified in the merged executable


- `.debug` section:
  - Info for symbolic debugging (gcc -g)


- Section header table:
  - Offsets and sizes of each section

## Linking And Executing Procedure

There are 3 kinds of linker symbols in total:

- **Global symbols**
  - Symbols defined by module *m* that can be referenced by other modules
  - e.g. non-`static` C functions and non-`static` global variables
- **External symbols**
  - Global symbols that are **referenced** by module *m* but defined by some other module
- **Local symbols**
  - Symbols that are defined and referenced exclusively by module *m*
  - E.g.:C functions and global variables defined with the `static` attribute
  - Local linker symbols are *not* local program variables
    - it's a way to define "private functions" and "private variables" in C

### Step 1: Symbol Resolutions

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126013753878.png" alt="image-20240126013753878" style="zoom: 50%;" />

#### How Linkers Resolve Duplicative Symbols?

- Program symbols are either strong or weak
  - Strong: procedures and initialized globals
  - Weak: uninitialized globals

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126010113104.png" alt="image-20240126010113104" style="zoom:50%;" />

#### Linker's Symbol Rules

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126010147526.png" alt="image-20240126010147526" style="zoom:50%;" />

##### Bad Code

```c
// main.c
int x = 0xa;
int y = 0x14;

#include <stdio.h>

void change();

int main() {
    change();
    printf("%x %x\n", x, y);
}
```

```c
// bad.c
double x;

void change() {
    x = 3.1415926;
}
```

Then, the `x` in bad.c will overwrite x and y, resulting in

```
4d12d84a 400921fb
```

where 0x400921fb4d12d84a is the double precision representation of 3.1415926.

---

**Rule of thumb:**

- Avoid using global variables
- Otherwise
  - use `static`
  - Initialize if you define a global variable
    - i.e. make it strong
  - Use `extern` if you reference an external global variable

### Step 2: Relocation

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126024549938.png" alt="image-20240126024549938" style="zoom: 33%;" />

#### Relocation Entries	

For this piece of code:

```c
int sum(int *a, int n);

int array[2] = {1, 2};

int main()
{
    int val = sum(array, 2);
    return val;
}
```

The assembly is (via `objdump -r -d main.o`):

```assembly
0000000000000000 <main>:
   0:	f3 0f 1e fa          	endbr64 
   4:	55                   	push   %rbp
   5:	48 89 e5             	mov    %rsp,%rbp
   8:	48 83 ec 10          	sub    $0x10,%rsp
   c:	be 02 00 00 00       	mov    $0x2,%esi
  11:	48 8d 3d 00 00 00 00 	lea    0x0(%rip),%rdi        # 18 <main+0x18>
			14: R_X86_64_PC32	array-0x4
  18:	e8 00 00 00 00       	callq  1d <main+0x1d>
			19: R_X86_64_PLT32	sum-0x4
  1d:	89 45 fc             	mov    %eax,-0x4(%rbp)
  20:	8b 45 fc             	mov    -0x4(%rbp),%eax
  23:	c9                   	leaveq 
  24:	c3                   	retq   
```

As you can see, `14: R_X86_64_PC32	array-0x4` means

- calculate the relative offset of *array* and *\*0x14*
- decrease it by 0x4, since the PC is at 0x18
  - i.e. `(array - 0x14) - 0x4 = array - 0x18`

- fill this 32-byte offset at 0x14 

Since `array` will be relocated during linking, we don't know exactly where it will be, so this patch is necessary.

### Step 3: Load Into Memory

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126124817811.png" alt="image-20240126124817811" style="zoom:50%;" />

- The color indicates the correspondence of the segments of  `.out` file and the memory regions where they are loaded.

- **Note:** There is a place called **memory-mapped region for shared libraries** between the huge gap of user stack and run-time heap. 

## Packaging Useful APIs

How to package functions commonly used by programmers?

- e.g. math, I/O, memory management, string manipulation, etc

Given the linker framework so far, it can be awkward:

- Options 1: Put all functions into a single source file
  - Programmers link big object file into their memory
  - It's time and space inefficient
- Option 2: Put each function in a separate source file
  - Programmers explicitly link appropriate binaries into their programs
  - More efficient,but burdensome on the programmer
    - i.e. ridiculous large command line to `gcc`

### Old-Fashioned Way: Static Library

`gcc` has a default path to static libraries: `/usr/lib/...`

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126134918250.png" alt="image-20240126134918250" style="zoom:50%;" />

Linker's algorithm for resolving external references:

- Scan `.o` files and `.a` files **in the command line order.**
- During the scan, **keep a list of the current unresolved references.**
- As each new `.o` or `.a` file, `obj`, is encountered, try to resolve each unresolved reference in the list against the symbols defined in `obj`.
- If there are any entries in the unresolved list at the end of the scan, then error.

#### Problem

Suppose you have a piece of C code:

```c
#include <stdio.h>      /* printf */
#include <math.h>       /* cos */
#define PI 3.14159265
int main ()
{
    double param, result;
    param = 60.0;
    result = cos ( param * PI / 180.0 );
    printf ("The cosine of %f degrees is %f.\n", param, result );
    return 0;
}
```

Then, 

```
gcc main.c -o main -lc -lm -nodefaultlibs -static -L/usr/lib/x86_64-linux-gnu/ 
```

is okay, 

whereas

```
gcc -lc -lm main.c -o main -nodefaultlibs -static -L/usr/lib/x86_64-linux-gnu/ 
```

is not okay, because `main.c` (later `main.o`) is scanned after `libm.a` and `libc.a`. 

## Modern Approach: Dynamic Linking

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240126143608071.png" alt="image-20240126143608071" style="zoom:50%;" />

Unlike statically linked exes, the function calls in dynamically linked exes get linked **not at linking time, but at load time**.

And it can even get linked **at runtime**.

### Runtime Dynamic Linking

```c
/* main.c */
#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>

long x[2] = {1, 2};
long y[2] = {3, 4};
long z[2];
void (* addvec) (long *v1, long *v2, long *vdest, unsigned int size);

int main()
{
    void *handle;
    char *error;

    handle = dlopen("./libvector.so", RTLD_LAZY);
    if (handle == NULL)
    {
        fprintf(stderr, "%s\n", dlerror());
        exit(EXIT_FAILURE);
    }

    addvec = dlsym(handle, "addvec");
    if ((error = dlerror()) != NULL)
    {
        fprintf(stderr, "%s\n", error);
        exit(1);
    }
    
    addvec(x, y, z, 2);
    printf("z = [%ld %ld]\n", z[0], z[1]);

    /* Unload the shared library */
    if (dlclose(handle) < 0)
    {
        fprintf(stderr, "%s\n", dlerror());
        exit(1);
    }

    return 0;
}
```

```c
/* addvec.c */
void addvec(long *v1, long *v2, long *vdest, unsigned int size) {
    for (int i = 0; i != size; ++i) {
        vdest[i] = v1[i] + v2[i];
    }
}
```

Then, use `gcc -shared -fpic -o libvector.so addvec.c` to generate shared object file.

And use `gcc -o main main.c libvector.so -ldl` to generate exe obj file.

- `-ldl` stands for `libdl.so`, which is used to link  `dlfcn.h`

## Library Interpositioning

See [here](https://hansimov.gitbook.io/csapp/part2/ch07-linking/7.13-library-interpositioning) for details.

There are three interpositioning techniques in all:

- on compilation

  - 思路：使用本地的 `malloc.h`，在预处理阶段，替换 `main.c` 的头文件，从而达到**预处理期替换函数的作用**
    - 使用 `-I.` flag
    - 注意：`mymalloc.c` 不能加 `-I.` flag，从而 `mymalloc` 里的 `malloc/free` 不会被预处理成 `mymalloc/myfree`

- on linking

  - 思路：使用 linker 的独特机制，i.e. `--warp, func`，在 linking 时，将对 `func` 的引用解析成 `__warp_func`，对 `__real_func` 的引用解析成 `func`。从而达到**链接期强制替换（引用）符号的作用**。

- at runtime

  - 思路：使用 loader 的特殊机制，

    - i.e. 如果 LD_PRELOAD 环境变量被设置为一个共享库路径名的列表，那么当你加载和执行一个程序，需要解析未定义的引用时，动态链接器会先搜索 LD_PRELOAD 库，然后才搜索任何其他的库。

  - 从而，可以从外部指定一个函数将如何执行。也就是达到**运行时替换动态链接库，从而替换函数地址的作用**。

  - **注意：**原运行时打桩的代码是错误的，因为 `printf` 也会用到 `malloc` 和 `free`，从而导致无限循环。我们需要使用 `static` 变量来记录递归次数。我们只在 `malloc` 递归深度为 1 的时候进行输出。

    ```c
    void *malloc(size_t size)
    {  
        static int calltimes = 0;
        calltimes++;
        // ...
        if (calltimes == 1)
            printf(...)
        calltimes--;
        
        return 0;
    }
    ```

    `free` 同理。

 