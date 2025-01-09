## What is an OS?

操作系统，in an "old-school" way，主要完成两个任务：

1. 分配资源（各种调度算法等等）
2. 抽象资源（比如说我们使用文件夹打开文件，而不是去磁盘上寻址）

**Note**: 当然，对于一些特定领域的 OS，我们并不希望其进行抽象简化，只希望其分配资源。

## OS 的工作流程

1. OS 启动，此时是“主动”的
2. 在启动之后，此时就是“被动”的

抽象地来说，OS 非常“事件驱动”——有活交给 OS，它才会开干

```c
void processEvent(event) {
	switch (event.type) {
		case NETWORK_COMMUNICATION:
			NetworkManager.handleEvent(event);
			break;
		case SEGMENTATION_FAULT:
		case INVALID_MODE:
			ProcessManager.handleEvent(event);
			break;
			// ...
	}
	return;
}
```

## 内核的设计要领

1. lean: as small as possible
2. mean: just do one job (and do it well)

**Note**: 另外，由于内核处于软件的最底层，**没有其它东西给它兜底**——一旦出错，就是崩溃、蓝屏等等，因此，操作系统编程必须非常谨慎、能够编写 OS 的人也必须是高水平的。

- 当然，如果是 Guest OS（比如说是虚拟机中装的。它可以视为安全情况未知的 OS），那么我们往往会有一层 "hypervisor"，它可以为这个 OS 进行兜底

## OS Events

- Interrupts: hardware-generated, external
- Exceptions: software-generated, internal

## System Calls

系统为用户态程序提供一系列 API，从而用户态可以通过访问这些 API，执行系统为其提供的各种功能（比如读写硬件、请求内存，等等）。

- 通过 ISA 本身的权限控制，用户态程序在理想状态下，是无法执行除了 OS 预设以外的任何高权限代码

## Timer

为了避免用户态获得完全控制权，我们必须适时将管理权交给系统本身。

而所谓“适时”，就是每次 timer 到点之后，就会触发 timer interrupt，从而直接将控制流转向 OS。