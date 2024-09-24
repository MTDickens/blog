之前在知乎写了不少回答，涉及类脑计算、人工智能、体系结构、编译器等多个方面，很多看法和观点零零碎碎地分布在不同回答里，挺不成体系的，打算写几个文章集中讨论一下这些看法观点，很多观点也相对比较激进，各位看官酌情食用。

第一篇就先扯一扯类脑计算这一块，我博士期间主要的研究方向就是类脑计算，在这一块也算是深耕了好多年，对这里面的困境也是深有体会，做了很多工作想去改变这种局面。类脑计算发展到今天，争议也确实非常大，今天就来详细捋一捋这里面的种种道道。

类脑计算这个方向本身的出发点很简单很纯粹，就是想抄作业——仿照大脑工作原理设计新的计算范式，实现类脑智能。但大脑的工作原理现在连皮毛都没摸到，抄作业也是难于登天，所以尽管发展了好几十年，这个方向可行性的唯一证据还是客观存在着这么一个高度智慧，低功耗的人类大脑。至于怎么实现它，这么多年其实没有什么实质性的进步，甚至连这个问题有多难也没有实质的认知。其实相对量化地认识到一个问题有多难本身也是一个非常困难的事情，因为如果能知道一个事情本身有多难，也需要对这个事情实现的路径有一定的概念，才能了解路径上各种障碍。

生物上对大脑的认知基本延续了整个生物领域基本的方法论，早期主要从蛋白、粒子通道、化学信号、电信号等易于观测的量出发，逐渐建立了神经元细胞的动力学模型。而类脑计算也则是从这个这样一些动力学模型出发，试图构建更大规模的网络模型，逐渐扩大规模，从而建立起来类脑计算范式。这也是类脑计算过去十几年的主流思路，欧盟的HBP项目投入了大量资金支持这一技术路径的发展。这一路径朴素的想法包括两部分：一部分是通过扫描动物大脑的切片，获取全脑神经元的拓扑连接；一部分是构建超大规模神经元仿真平台，其中主要的研究项目就是类脑芯片。这条路径经过十几年的折腾，基本暴露了这条路有多么不靠谱。

这其中的不靠谱有两个层面。

一个层面是神经元仿真平台的构建上严重缺乏软硬件的架构思维，导致这十几年的类脑计算平台上的扑腾大部分是在缴这方面的学费，至今都没走上正轨。我们今天的计算机系统能构建如此庞大复杂的生态，同时使用门槛极低，海量从业者能保持一定秩序地相互协作，很大程度归功于计算机系统整体宏观架构上的分层与解耦合设计。而类脑计算想要重塑一整套计算系统，则严重缺乏这种分层与解耦合的思维，对分层与解耦合的理解非常浅显，缺乏对复杂性的敬畏，一脚踩进了软硬件协同的泥潭里，在基本的分层基石都没有建立的情况下，为了提高类脑芯片的集成度，还引入大量硬件约束，只为了获得那么一点集成度的提高和功耗的下降。我在学校的时候主要做的就是这一块软件的适配，类脑芯片的这种糟糕设计给软件带来了大量问题，当然也带来了不少水论文的机会，我也水了不少类脑编译器的论文，不过我也一直都有种类脑芯片创造一个本来不存在的问题再通过类脑编译器去解决的感觉。其实国际上不少做类脑计算的大组也都在重复这样一个过程，当然我这种做类脑编译器的思路已经算是在往解耦合的方向努力了，大多数组更多是围绕自己设计的类脑芯片的约束下来重新设计类脑算法，这些算法主要要解决的不是具体的类脑智能问题，而是芯片约束带来的问题，有种带着镣铐跳舞的感觉。

此外，在类脑计算整个发展的路径上，整个类脑领域又逐渐和脉冲神经网络（SNN），忆阻器，存算一体等概念产生了一定的绑定，更是给软硬件架构带来毁灭性冲击。忆阻器把模拟计算引入了进来，存算一体把非冯架构引入了进来，而SNN又一定程度把深度学习挡在了外面。这几点每一个都在给整个领域引入巨大的难度。现阶段大部分类脑方面的努力都在和这些问题做斗争，我们哪里还有精力去思考如何类脑来制造更强的智能？我博士最后一年写了一篇关于类脑解耦合的论文发在了nature正刊上，核心想法是想把类脑计算系统从这种缺乏架构思维的困局中拉回来，至少拉回到和现在的计算机系统的起点处。但说实话，这种工作其实也没有解决什么科学问题，因为即使拉回来了，类脑计算系统的能力现在也只处于计算机系统起步的年代，注意这里不是类比，类脑计算系统和计算机系统并不是平行的赛道，两者其实就是一个赛道！所以那篇论文我自己都觉得没多大用，从计算机的视角看更没有带来太多新的东西。更多是一种比较含蓄的方式尝试指出类脑计算领域现在的问题。

我们仔细回想一下类脑最初的目标：实现类脑智能。为什么我们却强行给这条路赋予了类脑芯片、SNN、忆阻器等镣铐？实现类脑智能基于现有的计算机系统做到底遇到了什么问题需要我们重塑整个软硬件呢？其实类脑计算折腾了这么多，获得的成就却远不如基于计算机系统的深度学习在实现智能方面走得远。其实深度学习的成功也给类脑计算领域带来了巨大的压力，一方面确实打开了原先类脑计算在算法层面的思路，但另一方面又降低了类脑方向的标识度。毕竟广大做深度学习的人并不认为自己是做类脑的，那么做类脑的人怎么标识出自己是做类脑的呢？这种尴尬的状况导致目前大多数做类脑的人一方面积极拥抱深度学习，另一方面又要加入一些SNN等佐料来体现和纯粹做深度学习的不同，这和最初的目标真的是相差太远了，甚至不能认为是朝着这个目标的方向努力。

当然，现代计算机系统存在大量问题，深度学习也存在大量问题，离类脑智能还差非常远。这也是类脑计算的论文在motivation中常常会写的内容。但类脑计算在解决这些问题的方式上，都偏离了各个领域专业的做法，显得极其业余。计算机系统确实存在很多瓶颈，但类脑芯片的设计上主要考虑绝对不是PPA，深度学习也存在大量缺陷，但类脑算法设计上也都缺乏完整的逻辑链来阐述如何解决这些缺陷，一定程度上对这些领域已取得的成果所解决的问题缺乏基本的认知和敬畏，你指望这样的方法论能帮你突破现有的系统？

当然上面这个层面讲的更多是现阶段战术层面的问题，导致很多年的努力更多是在解决自己创造出来的问题，并且是现有系统已经解决得很好得问题。更严重的其实是战略层面的问题，也是我前面说的第二个层面的问题。

第二个层面的不靠谱是对整个类脑计算问题实现难度的认知层面的，当然我相信所有做类脑的人都肯定认为实现类脑智能是极其困难的，但这种困难是缺乏量化的认知的。并且从神经形态计算做全脑仿真这样的技术路径也可以看出来，即使认为这个方向非常困难，整个方向的宏观技术路线仍然是严重低估了难度的。目前的方向一定程度上还是从神经元的规模这个维度来度量我们走到了哪一步，先理解神经元的模型，接下来是几百个神经元的虫子的模型，再理解小鼠规模的模型，然后理解猴脑，最后到人脑规模，对困难的认知是基于规模的线性认知。

这种技术路径隐含的假设很大概率是错误的，我目前也是因此完全抛弃了类脑计算现有的路径。当然了，我相信这些问题所有做类脑的人应该也又切身体会，喷归喷，问题是出路在哪里？我对于任何领域肯定不会光喷不给新的解决思路。篇幅原因，这篇就写到这里了，下次再详细聊一聊战略层面的困难在哪里以及出路在哪里。