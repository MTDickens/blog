## Lec 16: System Level I/O

### Unix I/O Overview

> Definition: A Linux *file* is a sequence of $m$ bytes
>
> Unix Philosophy: Everything Is A File
>
> - Example: <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240130221121343.png" alt="image-20240130221121343" style="zoom:33%;" />

Elegant mapping of files to devices allows kernel to export simple interface called *Unix I/O*:

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240130221246643.png" alt="image-20240130221246643" style="zoom:50%;" />

#### File Types

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240130221507932.png" alt="image-20240130221507932" style="zoom:50%;" />

- Note: pipes (e.g. `ls -lah | grep csapp`) are also files

#### Regular Files

- A regular file contains **arbitrary data**
- Applications oft distinguish between *text files* and *binary files*
  - Text files are regular files with only ASCII or Unicode characters
  - Binary files are everything else
    - e.g., object files, JPEG images
  - Kernel doesn't know the difference!

#### Directories

- Directory consists of an array of *links*
  - Each link maps a *filename* to a file
- Each directory contains at least two entries
  - `.` is a link to itself
  - `..` is a link to the parent directory

#### Directory Hierarchy

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240130235328935.png" alt="image-20240130235328935" style="zoom:50%;" />

The kernel maintains *current working directory (cwd)* for each process.

- Modified using the `cd` command (for shell)

#### Open/Close/Read/Write

`open` takes in file name, and returns a file descriptor, or -1 if an error occurred.

`close` takes in a file descriptor, and returns a negative number if an error occurred.

`read` takes in an `fd`, pointer to buffer, and buffer size. And it returns the actual bytes it has read, or a negative number if an error occurred.

`open` is similar to `read`.

**Moral:** always check return codes, even for seemingly benign functions such as `close`

- i.e.
  ```c
  int Close(int fd) { /* Safe Close */
      int retval; /* return value */
      if ((retval = close(fd)) < 0) {
          perror("close");
          exit(1);
      }
      return retval;
  }
  ```
  

### RIO (Robust I/O Library)

#### Unbuffered I/O

```c
##include "csapp.h"
ssize_t rio_readn(int fd, void *usrbuf, size_t n);
ssize_t rio_writen(int fd, void *usrbuf, size_t n);
/* Return:num.bytes transferred if OK, 0 on EOF (rio readn only), -1 on error */
```

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201013239058.png" alt="image-20240201013239058" style="zoom: 50%;" />

Example:

Implementation of `rio_readn`:

```c
/*
 * rio_readn - Robustly read n bytes (unbuffered)
 */
ssize_t rio_readn(int fd, void * usrbuf, size_t n) {
    size_t nleft = n;
    ssize_t nread;
    char * bufp = usrbuf;
    while (nleft > 0) {
        if ((nread = read(fd, bufp, nleft)) < 0) {
            if (errno == EINTR) /* Interrupted by sig handler return */
                nread = 0; /* and call read() again */
            else
                return -1; /* errno set by read() */
        } else if (nread == 0)
            break; /* EOF */
        nleft -= nread;
        bufp += nread;
    }
    return (n - nleft); /* Return >= 0 */
}
```



#### Buffered I/O

##### Example: Buffered Input

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201014423243.png" alt="image-20240201014423243" style="zoom:50%;" />

#### Buffered I/O Implementation

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201014518113.png" alt="image-20240201014518113" style="zoom:50%;" />

- **Explanation:** You read a batch of bytes from a file at once *in reality*, but provide the content to the process in several times *in logic*.

### Metadata, Sharing and Redirection

#### Metadate

- *Metadata* is data about data, in this case file data.

- Per-file metadata maintained by kernel
  - Accessed by users with the `stat` and `fstat` functions.

```c
/* Metadata returned by the stat and fstat functions */
struct stat {
    dev_t st_dev; /* Device */
    ino_t st_ino; /* inode */
    mode_t st_mode; /* Protection and file type */
    nlink_t st_nlink; /* Number of hard links */
    uid_t st_uid; /* User ID of owner */
    gid_t st_gid; /* Group ID of owner */
    dev_t st_rdev; /* Device type (if inode device) */
    off_t st_size; /* Total size, in bytes */
    unsigned long st_blksize; /* Blocksize for filesystem I/O */
    unsigned long st_blocks; /* Number of blocks allocated */
    time_t st_atime; /* Time of last access */
    time_t st_mtime; /* Time of last modification */
    time_t st_ctime; /* Time of last change */
};
```

#### Sharing

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201173135963.png" alt="image-20240201173135963" style="zoom: 50%;" />

This is how Unix kernel represents open files.
**Terminology:**

- File pos: the "current file position" pointer for each entry of open file table.
- `refcnt`: similar to the `refcnt` of `shared_ptr` in C++, in the sense that they can be shared by descriptor tables.

**Note:**

- **Descriptor tables are one per process**, but **open file table and v-node table are shared by all processes** (i.e. one per kernel).
- two entries of descriptor tables can point to the same entry of open file table. Typically in case of `fork`.
  <img src="C:/Users/mtdickens/AppData/Roaming/Typora/typora-user-images/image-20240201173259945.png" alt="image-20240201173259945" style="zoom: 33%;" />
- Two entries of open file table can point to the same entry of v-node table
  <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201173400361.png" alt="image-20240201173400361" style="zoom: 33%;" />

#### I/O Redirection

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201202911801.png" alt="image-20240201202911801" style="zoom:50%;" />

也就是说，将 `fd1` 本来指向的的 file table（指向文件 `/dev/stdout`），改成了对应 `fd4` 所指的 file table（指向我们希望重定向的文件）。从而实现将 `stdout` 重定向至其他文件。

Example:

```c
##include <stdio.h>
##include <sys/types.h>
##include <sys/stat.h>
##include <fcntl.h>
##include <unistd.h>

##define MAX_LENGTH 200

int main(int argc, char* argv[]) {
  char input[MAX_LENGTH] = {0};

  int fd = open("io-redirection.txt", O_RDWR|O_CREAT, S_IRUSR|S_IWUSR);
  dup2(fd, 1);

  fgets(input, MAX_LENGTH, stdin);  // 从标准输入获取输入
  printf("%s", input);  // 输出到标准输出

  close(fd);
  return 0;
}
```

### Closing Remarks

**如何选择要使用的 I/O？**

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201204001891.png" alt="image-20240201204001891" style="zoom:50%;" />

**避免对于二进制文件（字节流）使用基于行的 I/O 函数**

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/image-20240201204202638.png" alt="image-20240201204202638" style="zoom:50%;" />
