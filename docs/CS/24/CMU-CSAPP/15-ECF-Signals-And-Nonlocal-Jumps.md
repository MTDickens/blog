# Lec 15: Signals and Nonlocal Jumps

## Shells

There's only one way to create process in Linux: `fork` call. And it create a subprocess of the current process.

So, there's a process hierarchy in Linux

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129022547514.png" alt="image-20240129022547514" style="zoom:33%;" />

"Init" process creates "Daemon" and "Login shell"s. "Shell"s create their children, grandchildren, and so on.

### Shell Programs

> A shell is an application program that **runs programs on behalf  of the user**. 

A (not 100% correct) implementation of a simple shell:

```c
void eval(char *cmdline)
{
    char *argv[MAXARGS]; /* Argument list execve() */
    char buf[MAXLINE];   /* Holds modified command line */
    int bg;              /* Should the job run in bg or fg? */
    pid_t pid;           /* Process id */
    strcpy(buf, cmdline);
    bg = parseline(buf, argv);
    if (argv[0] == NULL)
        return; /* Ignore empty lines */
    if (!builtin_command(argv))
    {
        if ((pid = Fork()) == 0)
        { /* Child runs user job */
            if (execve(argv[0], argv, environ) < 0)
            {
                printf("%s: Command not found.\n", argv[0]);
                exit(0);
            }
        }
        /* Parent waits for foreground job to terminate */
        if (!bg)
        {
            int status;
            if (waitpid(pid, &status, 0) < 0)
                unix_error("waitfg: waitpid error");
        }
        else
            printf("%d %s", pid, cmdline);
    }
    return;
}
```

As you see, the only difference between background processes and foreground processes is whether to wait or not.

But wait, there's a problem: the background processes might become zombies if not reaped in time. So, how to reap them without `wait` or `waitpid`?

It turns out that we can use a kind of ECF to fix this - **signals**!

## Signals

A *signal* is a small message that notifies a process that an event of some type has occurred in the system

- akin to exceptions and interrupts
- **sent from the kernel** (sometimes at the request of another processes) **to a process**
- signal types is identified by small integer ID's (1-30)
- **Only information in a signal** is 
  - **its ID** 
  - and **the fact that it arrived**

| ID   | Name    | Default Action | Corresponding Event                      |
| ---- | ------- | -------------- | ---------------------------------------- |
| 2    | SIGINT  | Terminate      | User typed ctrl-c                        |
| 9    | SIGKILL | Terminate      | Kill program (cannot override or ignore) |
| 11   | SIGSEGV | Terminate      | Dump Segmentation violation              |
| 14   | SIGALRM | Terminate      | Timer signal                             |
| 17   | SIGCHLD | Ignore         | Child stopped or terminated              |

### Signal Concepts

The *kernel* **sends (delivers)** a signal to a **destination process** by *updating some state in the context of the destination process*. 

The signal is delivered for one of two reasons: 

1. The *kernel* has detected a system event such as a divide-by-zero (SIGFPE) or the termination of a child process (SIGCHILD).
2. A process has invoked the `kill` function (discussed in the next section) to explicitly request the kernel to send a signal to the destination process. 
   - Note: A process can send a signal to itself. 

---

A *destination process* **receives** a signal when it is *forced by the kernel to react in some way to the delivery of the signal*. 

Some possible ways to react:

- **Ignore** the signal
- **Terminate** the process
- **Catch** the signal by executing a *user-level* function called **signal handler**
  <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129174349330.png" alt="image-20240129174349330" style="zoom: 50%;" />

#### Pending and Blocked Signals

A signal is **pending** if sent but not yet received.

- There can be at most one pending signal of any particular type
  - That is, other signals of the same type will get discarded

A process can **block** the receipt of certain signals

- Blocked signals can be delivered (i.e. sent), but can't be received till the signal gets unblocked

---

In fact, kernel maintains `pending` and `blocked` bit vectors in the context of each process.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129175750595.png" alt="image-20240129175750595" style="zoom:50%;" />

### Process Groups

<img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240129181022965.png" alt="image-20240129181022965" style="zoom: 50%;" />

### How to Send Signals?

You can send signals by three ways:

1. `/bin/kill` program

   - <img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240129181130100.png" alt="image-20240129181130100" style="zoom:33%;" />

2. From the keyboard 

   - Examples of Ctrl-C and Ctrl-Z

     <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129181323358.png" alt="image-20240129181323358" style="zoom: 33%;" />
     Note that Ctrl-C and Ctrl-Z send `SIGINT` and `SIGTSTP` to all processes belonging to **foreground process group**.

3. `kill` function

   ```c
   void fork12()
   {
       pid_t pid[N];
       int i;
       int child_status;
       for (i = 0; i < N; i++)
           if ((pid[i] = fork()) == 0)
           {
               /* Child: Infinite Loop */
               while (1);
           }
   
       for (i = 0; i < N; i++)
       {
           printf("Killing process %d\n", pid[i]);
           kill(pid[i], SIGINT);
       }
       for (i = 0; i < N; i++)
       {
           pid_t wpid = wait(&child_status);
           if (WIFEXITED(child_status))
               printf("Child %d terminated with exit status %d\n",
                      wpid, WEXITSTATUS(child_status));
           else
               printf("Child %d terminated abnormally\n", wpid);
       }
   }
   ```

   

### How to Receive Signals?

1. Suppose kernel is *returning from an exception handler* and is *ready* to pass control to process `B`.
   <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129183159170.png" alt="image-20240129183159170" style="zoom: 50%;" />
   - **Recall:** Why "returning from an exception handler"?
     Because all context switches are initiated by calling some exception controller.
2. The kernel will compute `pnb = pending & ~blocked`
3. If `pnb == 0`, just pass control to next instruction in the logical flow for `p`
4. Else
   - choose least nonzero bit $k$ in `pnb` and *force* `p` to receive signal $k$
   - The receipt of signal $k$ triggers some **action** by `p`
   - Repeat for all nonzero $k$ in `pnb`
   - Finally, pass control to next instruction in the logical flow for `p`

#### Default Actions

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129183814503.png" alt="image-20240129183814503" style="zoom: 50%;" />

#### Installing Signal Handlers

If we want to modify the action, we have to use the `signal` function.

```c
handler_t *signal(int signum, handler_t *handler)
```

#### Signal as Concurrent Flow

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129185023924.png" alt="image-20240129185023924" style="zoom: 67%;" />

#### Nested Signal Handlers

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129185454717.png" alt="image-20240129185454717" style="zoom:50%;" />

### How Signals Get Blocked?

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240129185644917.png" alt="image-20240129185644917" style="zoom:50%;" />

```c
sigset_t mask, prev_mask;
Sigemptyset(&mask);
Sigaddset(&mask, SIGINT);

/* Block SIGINT and save previous blocked set */
Sigprocmask(SIG_BLOCK, &mask, &prev_mask);

/* Code region that will not be interrupted by SIGINT */
/* Restore previous blocked set, unblocking SIGINT */
Sigprocmask(SIG_SETMASK, &prev_mask, NULL);
```

- **Note:** capitalized function is the wrapped function

### Safe Signal Handling

There are three factors that might make your program unsafe:

1. They might form deadlocks 
2. Since signals of the same kind aren't queued, you can't use them to count events.
3. They are not portable across different Linux dists

#### Guidelines

- G0: Keep your handlers **as simple as possible**
  - e.g., Set a global flag and return (recommended by CMU cert guideline)
  
- G1: Call **only async-signal-safe functions** in your handlers
  - `printf`, `sprintf`, `malloc`, and `exit` are not safe!
  
- G2: **Save and restore `errno`** on entry and exit
  - So that other handlers don't overwrite your value of `errno`
  
  - e.g.
    ```c
    void handler (int sig) {
        int saved_errno = errno;
        // ...
        errno = saved_errno;
    }
    ```
  
    
  
- G3: **Protect accesses to shared data** structures by temporarily blocking all signals.
  - To prevent possible corruption
    e.g. when you are making changes to list, a signal is detected, and it also reads/writes the invalid list
  
- G4: Declare **global variables** as `volatile`
  - To prevent the compiler from storing them in a register
  
- G5: Declare **global flags** as `volatile sig_atomic_t`
  - `flag`: variable that is only read or written (e.g. `flag = 1`, not `flag++`)
  - Flag declared this way does not need to be protected like other globals
  - Note: *usually* `sig_atomic_t` is an alias of `int`

#### Async Signal Safety

Function is *async-signal-safe* if either reentrant (e.g.,all variables stored on stack frame,CS:APP3e 12.7.2) or non-interruptible by signals.

POSIX guarantees 117 functions to be async-signal-safe

Popular functions on the list:
- `_exit`
- `write`
- `wait`
- `waitpid`
- `sleep`
- `kill`

Popular functions that are not on the list:
- `printf`
- `sprintf`
- `malloc`
- `exit`

**Unfortunate fact:** `write` is the only async-signal-safe output function.

**Sidenote:** the reason why `printf` is not ASS is that it has a "lock" which isn't on stack frame, thus not reentrant and might cause deadlock (say, `printf` is interrupted by a signal whose handler also calls `printf`).

#### Synchronizing Flows to Avoid Races

There's a potential races between the parent and the child in the code below:

```c
void handler(int sig) {
    int olderrno = errno;
    sigset_t mask_all, prev_all;
    pid_t pid;
    Sigfillset( & mask_all);
    while ((pid = waitpid(-1, NULL, 0)) > 0) {
        /* Reap child */
        Sigprocmask(SIG_BLOCK, & mask_all, & prev_all);
        deletejob(pid); /* Delete the child from the job list */
        Sigprocmask(SIG_SETMASK, & prev_all, NULL);
    }
    if (errno != ECHILD)
        Sio_error("waitpid error");
    errno = olderrno;
}

int main(int argc, char ** argv) {
    int pid;
    sigset_t mask_all, prev_all;
    Sigfillset( & mask_all);
    Signal(SIGCHLD, handler);
    initjobs(); /* Initialize the job list */
    while (1) {
        if ((pid = Fork()) == 0) {
            /* Child */
            Execve("/bin/date", argv, NULL);
        }
        Sigprocmask(SIG_BLOCK, & mask_all, & prev_all); /* Parent */
        addjob(pid); /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, & prev_all, NULL);
    }
    exit(0);
}
```

也就是说，可能会由这样的情况：

1. `Fork()` 之后，kernel 进行上下文切换，并直接执行完了 child
2. 然后再进行上下文切换。假设直接回到了 `main()` 函数，那么 SIGCHILD 就会触发 handler，并删除了一个**不存在的 PID**
3. 然后 kernel 再回到 `main()` 的 next instruction，并执行了 `addjob(pid)`。
4. 从而，这个 PID 永远不可能被删除了，造成了我们不希望出现的结果。

---

我们可以 slightly fix the program，使得两者 synchronize：

```c
// handler
// ...

int main(int argc, char ** argv) {
    int pid;
    sigset_t mask_all, mask_one, prev_one;
    Sigfillset( & mask_all);
    Sigemptyset( & mask_one);
    Sigaddset( & mask_one, SIGCHLD);
    Signal(SIGCHLD, handler);
    initjobs(); /* Initialize the job list */
    while (1) {
        Sigprocmask(SIG_BLOCK, & mask_one, & prev_one); /* Block SIGCHLD */
        if ((pid = Fork()) == 0) {
            /* Child process */
            Sigprocmask(SIG_SETMASK, & prev_one, NULL); /* Unblock SIGCHLD */
            Execve("/bin/date", argv, NULL);
        }
        Sigprocmask(SIG_BLOCK, & mask_all, NULL); /* Parent process */
        addjob(pid); /* Add the child to the job list */
        Sigprocmask(SIG_SETMASK, & prev_one, NULL); /* Unblock SIGCHLD */
    }
    exit(0);
}
```

如上，我们通过 `Sigprocmask(SIG_BLOCK, & mask_one, & prev_one);` 将 SIGCHILD 信号在添加 child process 之前就进行了阻塞，保证不会出现 SIGCHILD 在 `addjob` 之前就被 receive。

我们在 `addjob` 和子进程里面进行了 unblock。保证在 `addjob` 之后，SIGCHILD 可以顺利被处理；同时，由于子进程继承了父进程的 block mask，我们要将子进程也恢复如常。

---

Rule of Thumb: `fork` 的瞬间，你就要考虑 asynchrony，也就是父进程和子进程之间的执行顺序可以任意。从而，你需要添加信号阻塞等等，避免出现 race 的情况。

#### Explicitly Waiting For Signals

我们之前都是 implicitly wait for signals（也就是我们持续执行进程，有 signal 来了再打断），现在，我们希望 explicitly wait for signals（也就是我们停下来等待，直到有 signal 来了，再处理 signal，再继续执行）。

（详见 [csapp lec 15 pdf](https://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/lectures/15-ecf-signals.pdf) P40-44）

tl;dr: use `sigprocmask(<signal that you want to wait for>)`

- `sigprocmask` 就是原子化（i.e. 不可能被打断的）：

  ```c
  sigprocmask(SIG_SETMASK, &mask, NULL);
  pause();
  sigprocmask(SIG_SETMASK, &prev, NULL);
  ```

  