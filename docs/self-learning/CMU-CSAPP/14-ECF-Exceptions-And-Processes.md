## Lec 14: Exceptional Control Flow - Exceptions and Processes

### The Control Flow

Up to now, we have learnt two mechanisms for changing the control flow:

- (unconditional) jumps and (conditional) branches
- call and return

which react to changes in ***program state***.

But, these are insufficient to systems, which have to handle changes in ***system state***:

- Data arrives from disks or network adapters
- Instruction divides by zero
- User hits ctrl-c at the keyboard
- System timer expires
- ...

These are **exceptional control flow**s, which are outside normal control flows. 

### Exceptional Control Flow

- ECF exists in every level of a computer system.
- Low-level mechanisms
  1. Exceptions  
     - Change in control flow in response to a system event (i.e., change in system state)
     - Implemented using a combination of **hardware and OS software**
- Higher-level mechanisms
  2. Process context switch  
     - Implemented by **OS software and hardware timer**
  3. Signals  
     - Implemented by **OS software**
  4. Nonlocal jumps: `setjmp()` and `longjmp()`
     - Implemented by **C runtime library**

#### Exceptions

An **exception** is **a transfer of control to the OS kernel** in response to some event (i.e.,change in processor state)

- Kernel is the memory-resident part of the OS 

- Examples of events: Divide by 0, arithmetic, overflow, page fault, I/O  request completes, typing Ctrl-C, ...

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240127204732751.png" alt="image-20240127204732751" style="zoom: 33%;" />

> In this picture, it shows that there are 3 possibilities that might happen after the exception is processed
>
> - Return to l_current
>   - e.g. page fault
> - Return to l_next
>   - e.g. typing Ctrl-C
> - Abort
>   - e.g. protection faults

#### Exception Tables

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240127205125788.png" alt="image-20240127205125788" style="zoom:50%;" />

#### Two Kinds of Exceptions

##### Asynchronous Exceptions (Interrupts)

Asynchronous exceptions happen as a result of changes in state that are **occurred outside of the processor**.

- it's indicated by setting **the processor's *interrupt pin***
  - e.g. when disk controller finishes doing a direct memory access and copying data from disk to memory, it notifies the processor by setting the pin high

- handler returns to **"next" instruction**

**Example:**

- Timer interrupt
  - Every few *milliseconds*, an external timer chip triggers an interrupt
  - Used by kernel to take back control from user programs
    - in case the user program is in a dead loop

- I/O interrupt from external device
  - Hitting Ctrl-C
  - Arrival of a packet from a network
  - Arrival of a data from the disk
  - ...

##### Synchronous Exceptions

Synchronous exceptions are caused by events that occur as a result of executing an instruction:

- Traps

  - Intentional

  - Examples: **system call**s, breakpoint traps, special instructions

    - system "call"s look like call, but what it actually does is transferring control to the kernel, and let the kernel do privileged operations

    - example:

      ```assembly
      mov  $0x2,%eax  # "open file" is syscall #2
      syscall         # Return value in %rax
      cmp $0xfffffffffffff001,%rax
      ...
      retq
      ```

      

  - returns to **"next" instruction**

- Faults

  - Unintentional but possibly recoverable
  - Examples: page faults(recoverable), protection faults (unrecoverable), floating point exceptions
  - Either **re-executes faulting** ("current") instruction or **aborts**

- Aborts

  - Unintentional and unrecoverable
  - Examples: illegal instruction, parity error, machine check
  - Aborts current program

### Processes

Definition: A process is an instance **of running program** (i.e. that is in execution)

Process provide each program with two key abstractions (or in another way, "illusions")

- Logical Control Flow
  - Each program seems to have exclusive use of the CPU
  - Provided by kernel mechanism called *context switching*
- Private Address Space
  - Each program seems to have exclusive use of main memory
  - Provided by kernel mechanism called *virtual memory*

#### Multiprocessing

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240127213050560.png" alt="image-20240127213050560" style="zoom:50%;" />

Once in a while, the kernel saves the registers in the CPU in the memory, load the saved registers from the next process, and proceed to run the next process. This is ***context switching***.

For multi-core processor, several processes might be run concurrently. But if the number of processes outmatches the number of CPUs, the kernel still needs to do context switching.

#### Concurrent Processes

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240127213635311.png" alt="image-20240127213635311" style="zoom:33%;" />

Note that concurrency might happen **no matter how many CPU cores you have**. 

- Even if you only have one core, as long as the processes overlap in their **logical control flow**, they are concurrent.

#### Context Switching

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240127213939284.png" alt="image-20240127213939284" style="zoom: 50%;" />

### Process Control

#### System Call Error Handling

On error, Linux system-level functions typically return -1 and set global variable `errno` to indicate cause.

Hard and fast rule:  

- You must check the return status of every system-level function
- Only exception is the handful of functions that return void

Example:

```c
if ((pid = fork()) < 0) {
    fprintf(stderr, "fork error:%s\n", strerror(errno));
    exit(0);
}
```

You can further simplify it by wrappers.

```c
void unix_error(char *msg) { /* Unix-style error */
    fprintf(stderr, "%s: %s\n", msg, strerror(errno));
    exit(0);
}
```

```c
int Fork() {
    int pid = fork();
    if (pid < 0)
        unix_error("Fork error");
    return pid;
}
```



#### Creating and Terminating Processes

From a programmer’s perspective, we can think of a process as being in one of three states:

- Running
  - Process is **either executing, or waiting to be executed** and **will eventually be scheduled** (i.e.,chosen to execute) by the kernel
- Stopped
  - Process execution is *suspended* and **will not be scheduled until further notice** (next lecture when we study signals)
- Terminated
  - Process is stopped permanently

##### Terminate Process

- Process becomes terminated for one of three reasons:

  - Receiving a signal whose default action is to terminate (next lecture)

  - Returning from the main routine

  - Calling the `exit` function

- `void exit(int status)`

  - Terminates with an exit status of `status`.

  - Convention: normal return status is 0, nonzero on error.

  - Another way to explicitly set the exit status is to **return an integer value from the main routine**.

- `exit` is called but **never returns**

##### Creating Process

We use `fork()` to create processes in C.

```c
##include <stdio.h>
##include <unistd.h>
##include <sys/types.h>
##include <stdlib.h>

int main() {
    int *ptr = malloc(sizeof(int));
    *ptr = 0;
    int x = 1;
    
    pid_t pid = fork();

    if (pid < 0) {
        fprintf(stderr, "Fork failed\n");
        return 1;
    } else if (pid == 0) {
        // Child process
        printf("Hello from child process! Child PID == %d, *ptr == %d, x == %d\n", pid, (*ptr += 114514), ++x);
    } else {
        // Parent process
        printf("Hello from parent process! Child PID == %d, *ptr == %d, x == %d\n", pid, (*ptr -= 1919810), --x);
    }

    return 0;
}

```

Output:

```
Hello from parent process! Child PID == 22307, *ptr == -1919810, x == 2
Hello from child process! Child PID == 0, *ptr == 114514, x == 0
```

可以看到，

- 两者的 PID 值不一样，说明 `fork()` 返回了两次——在父进程返回子进程的 PID，在子进程返回 0
- `*ptr` 与 `x` 互不干扰，说明 `fork()` 确实建立了两个进程——把父进程的内存全部拷贝到子进程，当然也包括了 saved registers
  - Even more, child gets identical copies of the parent’s open file descriptors.
  - The only difference between parent and child is their PIDs.
- 在 Github Codespaces 中，父进程先于子进程。但是，事实上，不同平台的顺序可能不同。并不存在一个 100% 确定的顺序关系。因此，don't make assumptions

###### Modeling `fork` with Process Graphs

```c
// header files
// ...

int main()
{
    pid_t pid;
    int x = 1;
    pid = Fork();
    if (pid == 0) { /* Child */
        printf("child : x=%d\n", ++x);
        exit(0);
    }
    /* Parent */
    printf("parent: x=%d\n", --x);
    exit(0);
}
```

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128150138687.png" alt="image-20240128150138687" style="zoom:50%;" />

如图和上述代码，我们可以根据进程之间的关系，作出进程图，并进行拓扑排序。每一个 valid topological sort，都代表一个可能的执行顺序（i.e. feasible total ordering）。

###### More Examples of `fork`

假如我们设计以下 `fork2()` 函数：

```c
void fork2() {
    printf("L0\n");
    fork();
    printf("L1\n");
    fork();
    printf("Bye\n");
}
```

那么，其进程图如下所示：

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128151200609.png" alt="image-20240128151200609" style="zoom:50%;" />

实际测试中，我看到了以下输出：

```
L0
L1
L1
Bye
Bye
Bye
Bye
```

```
L0
L1
Bye
Bye
L1
Bye
Bye
```

```
L0
L1
Bye
L1
Bye
Bye
Bye
```

等等。不难发现，均属于可行的执行顺序。

---

还有一个更复杂的代码（nested fork in parent）：

```c
void fork4() {
    printf("L0\n");
    if (fork() != 0) { /* if not child process */
        printf("L1\n");
        if (fork() != 0) { /* if not child process */
            printf("L2\n");
        }
    }
    printf("Bye\n");
}
```

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128152051446.png" alt="image-20240128152051446" style="zoom:50%;" />

以及 nested fork in children：

```c
void fork5()
{
    printf("L0\n");
    if (fork() == 0)
    {
        printf("L1\n");
        if (fork() == 0)
        {
            printf("L2\n");
        }
    }
    printf("Bye\n");
}
```

##### Reap Child Processes

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128152924722.png" alt="image-20240128152924722" style="zoom:50%;" />

###### Zombie Example

```c
void fork7()
{
    if (fork() == 0) {
        printf("Terminating Child, PID = %d\n", getpid());
    } else {
        printf("Running Parent, PID = %d\n", getpid());
        while (1);
    }
}
```

Linux terminal output:

```
@MTDickens ➜ .../dev/csapp/lec14/fork (main) $ ./zombie &
[1] 38124
Running Parent, PID = 38124
Terminating Child, PID = 38126
@MTDickens ➜ .../dev/csapp/lec14/fork (main) $ ps
    PID TTY          TIME CMD
  21742 pts/2    00:00:00 bash
  38124 pts/2    00:00:01 zombie
  38126 pts/2    00:00:00 zombie <defunct>
  38153 pts/2    00:00:00 ps
@MTDickens ➜ .../dev/csapp/lec14/fork (main) $ kill 38124
[1]+  Terminated              ./zombie
@MTDickens ➜ .../dev/csapp/lec14/fork (main) $ ps
    PID TTY          TIME CMD
  21742 pts/2    00:00:00 bash
  38226 pts/2    00:00:00 ps
```

As you can see, `ps` shows the child process, i.e. process 38126, as "defunct", meaning that it's currently a  zombie.

##### `wait`: Synchronizing with Children

How to reap a children? By calling `wait` (or `waitpid` if you want to reap a child with specific PID).

Specification for `wait`:

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128155446693.png" alt="image-20240128155446693" style="zoom:50%;" />

- **Note:** if you use `waitpid` instead of `wait`, you can specify the wait

Code:

```c
void fork9()
{
    int child_status;
    if (fork() == 0)
    {
        printf("HC: hello from child\n");
        exit(0);
    }
    else
    {
        printf("HP: hello from parent\n");
        wait(&child_status);
        printf("CT: child has terminated\n");
    }
    printf("Bye\n");
}
```

Process Graph (you can see it actually becomes a DAG instead of a tree, after the parent gets synchronized with its children processes):

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128160046726.png" alt="image-20240128160046726" style="zoom:50%;" /><img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128160058535.png" alt="image-20240128160058535" style="zoom: 50%;" />

More code examples on [GeekForGeeks](https://www.geeksforgeeks.org/wait-system-call-c/).

#### Load and Running Processes

You can use `int execve (char *filename, char *argv[], char *envp[])` to **override this process with a new process specified by `filename`, `argv` and `envp`**.

- it overwrites code, data and stack
  - the PID remains unchanged, but the content of this process is completely changed
  - as well as **open files** and **signal context** 
- it is called once and never returns (if successful)

##### Structure of a Stack When a New Program Starts

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128163249200.png" alt="image-20240128163249200" style="zoom:33%;" />

The arguments of `execve` is compatible with the structure of the stack.

##### Example of Executing `/bin/ls -lt /usr/include`

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240128163515962.png" alt="image-20240128163515962" style="zoom: 50%;" />

We executes `/bin/ls -lt /usr/include` in child process using current environment.

Code:

```c
##include <stdio.h>
##include <stdlib.h>
##include <unistd.h>
##include <errno.h>
##include <string.h>

void unix_error(char *msg) {
    fprintf(stderr, "%s: %s\n", msg, strerror(errno));
    exit(0);
}

int Fork() {
    int pid;

    if ((pid = fork()) < 0) {
        unix_error("Fork error");
    }

    return pid;
}

int main(int argc, char *argv[]) {
    char *environ[] = { NULL };

    int pid;

    for (char **argv_ptr = argv; *argv_ptr != NULL; ++argv_ptr) {
        printf("Argv[%ld]: %s\n", argv_ptr - argv, *argv_ptr);
    }
    printf("\n" "We will execute %s with\n", argv[1]);
    for (char **argv_ptr = argv + 1; *argv_ptr != NULL; ++argv_ptr) {
        printf("Argv[%ld]: %s\n", argv_ptr - argv, *argv_ptr);
    }
    printf("\n");

    if ((pid = Fork()) == 0) {
        
        if (execve(argv[1], argv + 1, environ) < 0) {
            printf("%s Command not found.\n", argv[1]);
            exit(1);
        }
    }
    return 0;
}

```

Bash Command Line:

```bash
./execve /bin/ls -lt /usr/include
```

Output:

```
Argv[0]: ./execve
Argv[1]: /bin/ls
Argv[2]: -lt
Argv[3]: /usr/include

We will execute /bin/ls with
Argv[1]: /bin/ls
Argv[2]: -lt
Argv[3]: /usr/include

total 4052
drwxr-xr-x  1 root root   4096 Jan 12 10:08 c++
drwxr-xr-x  2 root root   4096 Dec  8 04:57 gnutls
drwxr-xr-x  2 root root   4096 Dec  8 04:57 libexslt
... (omitted)
-rw-r--r--  1 root root   2590 Jan 14  2019 uodbc_stats.h
-rw-r--r--  1 root root   6893 Aug  6  2018 FlexLexer.h
-rw-r--r--  1 root root   2912 Jul 28  2018 gnumake.h
-rw-r--r--  1 root root  16767 Dec 27  2017 argon2.h
```

