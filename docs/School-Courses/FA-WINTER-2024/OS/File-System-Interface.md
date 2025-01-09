## Why Do We Need File System?

- File system vs. Disk
	- File system presents **abstraction of disk**
	- File → Track/sector
- To user process
	- File system provides **coherent view of a group of files**
	- File: a contiguous block of bytes (Unix)
- File system provides protection

**简单来说**：

- CPU 被抽象成 thread
- Memory 被抽象成一段地址空间（而且是虚拟地址空间）
- Storage 被抽象成文件系统

## File Concept

File is a contiguous logical space for storing information

- database, audio, video, web pages...

There are different types of file:

- data: character (e.g. markdown, txt), binary (e.g. memory dump), and application-specific (e.g. ppt, doc)
- program (e.g. `a.out`)
- special one: `proc` file system - use file-system interface to retrieve system information
	- 如果你执行 `df /proc`，就能看到这个“隐藏”的 `proc` file system

### Metadata for a File

文件的 metadata 如下：

- Name - only information kept in human-readable form
- Identifier - unique tag (number) identifies file within file system
- Type - needed for systems that support different types
- Location - pointer to file location on device
- Size - current file size
- Protection - controls who can do reading, writing, executing
- Time, date, and user identification - data for protection, security, and usage monitoring
- Information about files are kept in the directory structure, which is maintained on the disk
- Many variations, including extended file attributes such as file checksum

### Metadata *Specific* for an Open File

Several data are needed to manage open files:

- Open-file table: tracks **open files**
- File pointer: pointer to **last read/write location**, per process that has the file open
- File-open count: counter of **number of times a file is open** - to allow removal of data from open-file table when last processes closes it
- Disk location of the file: cache of data access information
- Access rights: per-process access mode information

## Access Methods

## Directory Structure

## Protection