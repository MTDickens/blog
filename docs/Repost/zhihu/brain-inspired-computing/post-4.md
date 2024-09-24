万万没想到这个系列我居然还会写第四篇，其实前三篇核心的思想已经阐述的比较清楚了。但今天和[@赵永威](//www.zhihu.com/people/a2eb96cb44b79eba0818865d5969caf1)就分形计算机的讨论引出了很多额外的思考。

先简单说一下背景，在[mackler：抽象的幻觉（1）](https://zhuanlan.zhihu.com/p/544957616)一文中，我拿寒武纪之前宣传的分形计算机举例讲这种太过大道至简的抽象容易把系统的很多核心问题给抹去，也是因为一周前参加CCF优博论坛刚和他聊过，所以就选了这个例子。他在评论区也发了一个[链接](https://yongwei.site/zh/MPMD-decides-Halting/)阐述了一下分形计算机的具体意义，这个例子里他讲的层次偏计算机理论，大致思想是想证明MPMD（简单理解就是每个线程的代码可以各不相同的并行编程模型）是超越图灵机的，可以解决停机问题，进一步的逻辑是超越图灵机意味着会带来巨大的柯式复杂性（kolmogorov complexity），也就是程序太复杂了写不出来，因此设计了分形计算机模型来替代MPMD，并且分形计算机没有超越图灵机，而且具有并行可扩展性。

这篇仍然是讨论类脑计算，重点不在于分形计算机模型的讨论，而在于这个证明本身的启发。我这里继续补充一些必要的基础知识，停机问题是图灵机以及计算理论里面一个很经典的不可计算问题，这个问题的任务是任意给定一段图灵机程序，有限时间内判断这段程序会不会终止。这个程序可以通过反证法证明不存在，从而得到停机问题是图灵机不可解的。

在这个MPMD的停机证明中，则是假设长度不超过 $N$ 比特的图灵机程序（总共 $2^N$ 个）中有$m$个是会停机的。这个 $m$ 虽然是个不可计算函数，但m这个数是存在的，也就存在这样一个程序可以硬编码这个 $m$。我们只要并行去尝试这 $2^n$ 个程序，然后每一个只要停机了就让记数器加一，当记数器加到 $m$ 的时候就终止整个并行的常识。最后我们只要检查给定的图灵机程序是不是已经停机了即可。

这个逻辑似乎和并行无关，但是随着 $N$ 的扩大，$m$ 的尺寸是$O(N)$的。而图灵机程序的长度肯定要是有限且固定的，必须用一个uniform的程序处理任意大小$N$的输入。而在并行且每个线程可以写不同程序的假设上，因为假设了线程数无限扩展，因此每个线程的程序都保持有限且固定长度，我们也可以夹带无限长的$m$，因此这个证明里MPMD解决停机问题所依赖的超越能力其实是是来自于无限扩展性和每个线程都可以夹带新的程序比特带来的non-uniform能力。

我们这里不进一步讨论这个无限扩展的MPMD引出的可维护性问题对实际软件是否具有的指导意义。重点来讨论一下这个m带来的思考，也引入今天的正题。

在前面的几篇里，我曾经提到了柯式复杂性和我所讲的描述复杂性有一定的相似性，可能是描述复杂性的一种可行的定义，一个东西的柯式复杂性就是生成这个东西描述的最小图灵机程序的比特数。前面这个例子里面的这个$m$，随着$N$的扩大而扩大，尺寸是$O(N)$，而且是因为m是不可计算的（停机问题都不可计算，有多少个停机的程序就更难算了），基本没法进一步通过计算来压缩生成这个m的图灵机程序，最好的办法也就是直接存在程序里。所以说，这个m的柯式复杂性是$O(N)$。而抛开这个硬编码的m，其实我们可以看到，因为计算机程序的长度不取决于输入的长度，是uniform的，所以计算机程序的柯式复杂性一定是$O(1)$，这也是人能维护得动的。

回到深度学习的问题上来，我们怎么理解一个深度学习模型呢？一个训练好的深度学习模型按照我们之前的理解，很可能是个柯式复杂性为$O(N)$的东西（当然也有可能是$N$的任意其他形式）。那么问题来了，这个N是什么？以及这个$O(N)$又意味着什么呢，这个$O(N)$的复杂性又来自哪儿呢？

我们可以依照这一层次去考虑整个深度学习训练的建模。一个深度学习模型需要一个训练程序A，A是一个确定性的程序，也是我们通过软件工程可以写出来的，柯式复杂性为$O(1)$。训练数据/环境可以理解为一个$N$比特数据随机分布的信息源B，其随机分布的描述一定是和$N$的规模相关的，因此其柯式复杂性为$O(N)$。A程序通过B信息源的输入计算产生了一个训练好的模型，程序C。柯式复杂性应当是满足$KC(A) + KC(B) \geq KC(C)$的。此时程序C具有了拥有$O(N)$的柯式复杂性的可能性。

那么$O(N)$柯式复杂性的程序C（深度学习模型）又意味着什么呢？意味着non-uniform的模型，意味着超越图灵机。而维护这样一个non-uniform模型的需要的是一个我们可以维护的uniform模型——程序A（深度学习框架），和一个信号源（数据集/环境）。

这听起来似乎很矛盾，程序C（深度学习模型）就是个图灵机怎么又超越图灵机了？其实我们的程序C也是给定$N$下的特解，只是我们通过程序A可以scale到任意$N$上，而在给定$N$的情况下，停机问题也一样是可以解的。现实中的$N$其实也不会特别大，比如图片信号源的$N$往往也只有几千万比特（MB量级），加上分布的稀疏性，实际的柯式复杂性也不会太大，而且深度学习模型也是在上述假设下的某种近似（信号源有限采样）。

这样一个理论的视角也许能帮我们更深刻的从深度学习这个重要的样本中得到更多的启发。不过这个模型说实话也挺难研究的，柯式复杂性是图灵机视角下的信息度量，而香农的信息度量是通信视角下，以随机信号源为基础的信息度量。在我们上述例子下其实是这两种概念的一种整合，这方面的研究还是比较困难的。柯式复杂性因为其不可计算的特点，导致了往往只能去研究一些非常遥远的bound，不太像香农信息度量那么容易计算。

这篇也算是今天最热乎的一些想法，整体可能还有些混乱，也当抛砖引玉了。

前面讲的涌现其实只是一个整体的哲学思想。不同体系下的涌现背后往往有不同的机理，比如分子到热力学的涌现深入下去对应到系综的那一套理论。计算领域的涌现，深度学习可以说是第一个样本，也非常值得研究，帮助我们更好的去突破计算的边界，我这里也是抛了一个模糊的想法，试图揭示一下涌现的来源，从而产生更加深刻的理解。有感兴趣的也可以一起交流交流。