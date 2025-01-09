# Concepts

- **可信基**：**可信计算基**（英语：Trusted computing base, TCB）是指为实现计算机系统安全保护的所有安全保护机制的集合，机制可以[硬件](https://zh.wikipedia.org/wiki/%E7%A1%AC%E4%BB%B6 "硬件")、[固件](https://zh.wikipedia.org/wiki/%E5%9B%BA%E4%BB%B6 "固件")和[软件](https://zh.wikipedia.org/wiki/%E8%BD%AF%E4%BB%B6 "软件")的形式出现
	- 一旦可信计算机基的某个构件出现[程序错误](https://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BA%8F%E9%94%99%E8%AF%AF "程序错误")或者[安全隐患](https://zh.wikipedia.org/wiki/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%AE%89%E5%85%A8%E9%9A%90%E6%82%A3 "计算机安全隐患")，就对整个系统的安全造成危害
	- 与之相反，如果除可信计算基之外的系统的其他部分出现问题，也只是泄漏了系统安全策略赋予它们的相关权限而已，这些权限一般都是比较低的。
	- 精心设计和实现的系统**可信计算基**对系统整体安全至关重要
	- 现代[操作系统](https://zh.wikipedia.org/wiki/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F "操作系统")努力降低TCB的大小，使得通过手工或电脑辅助软件审计（[software audit](https://zh.wikipedia.org/w/index.php?title=Software_audit&action=edit&redlink=1)）或[形式化验证](https://zh.wikipedia.org/wiki/%E5%BD%A2%E5%BC%8F%E5%8C%96%E9%AA%8C%E8%AF%81 "形式化验证")的方法对其代码库彻底的检查成为可能。
- **攻击面**：
	- hack: 纯软件
	- shack: limited hardware
	- lab: unlimited hardware
		- lab 级别的攻击，有可能是一个国家发起的
- **防御纵深**