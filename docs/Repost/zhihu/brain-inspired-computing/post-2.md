上回主要聊了聊现阶段类脑计算在方法论上存在的问题，主要体现在软硬件架构思维的缺失上，因此大多数努力都是在踩计算机科学已经踩过的坑。这回想进一步聊一聊类脑整个技术路线上存在的问题，尤其是深度学习取得的巨大成功给我们带来的启示。

既然是技术路线和蓝图，那就不得不聊一聊历史。相信大家也都知道人工智能这个词诞生其实非常早，早在图灵、冯诺依曼那个年代就有很多思考。这些思考当然也有很多历史局限性，这些局限性也导致了人工智能的起起落落。早在计算机刚刚发明出来的年代，大家对于图灵机这种通用计算模型充满了信心，毕竟理论上图灵机可以模拟整个宇宙内的万事万物，区区一个人脑又有何难？根据人逻辑推理的方式，早期人工智能先驱围绕逻辑推理和树搜索两个主要方向展开了很多年的尝试，不过很快就深陷算法复杂度的泥潭，随后进入人工智能第一次寒冬。关于人工智能的起起落落，有很多人都讲过，这里我不再赘述。我主要想围绕早期基于逻辑推理和搜索算法的人工智能和当今基于深度学习的人工智能的对比引出我今天要讨论的核心观点。

大家可以先思考一个问题，束缚住早期人工智能的算法复杂度为什么似乎并不是当今的深度学习的主要瓶颈？算法复杂度理论是针对计算机算法的一套理论，对于特定问题（例如下围棋），其最小算法复杂度是与问题本身的结构高度相关的，理论上这些问题的复杂度就高到无法求解。而当今的深度学习仍然是计算机算法，为什么在这些问题上显然没有被理论上的算法复杂度锁死呢？

相信很多人都能给出不少解释，不过我想从更加宏观的角度来阐述这个问题。凝聚态物理有一篇非常有名的论文《More is Different》，也算是为凝聚态物理正名的一篇文章。这篇文章的核心思想正是论文的标题。物理学长期的方法论一直都是还原论的思想，将粒子打碎成更小的基本粒子，从而将很多规律统一到更少的规律上，如果我们能找到更加大一统的规律，我们就可以更全面的认识宇宙。而More is Different这篇文章指出，认识世界不止包含每个基本组件的规律，更包含了组件之间的组织形式。当体系的复杂性增加到一定程度，会涌现出与基本组件规律无关的新规律，而这部分规律也是认识世界的一部分。

更具体一点，学科X的基本实体遵循学科Y的定律并不意味着学科X仅仅是Y的应用，X具有全新的规律。例如固体/多体物理基于粒子物理，化学基于多体物理，分子生物学又基于化学，细胞生物学进一步基于分子生物学，……，心理学基于生理学，社会科学又基于心理学。层级隔的越远，这种规律的独立性体现得越直观，毕竟社会科学的规律靠研究粒子物理怕是永远也得不出来。这就是层级的体现，每一层涌现的新规律都独立于下面层级的规律。这种独立性的另一个体现在于，即使我们更换了支撑底层系统的构成方式与规律，只要高层级规律所依赖的基本抽象不变，高层级的很多规律仍然会成立。

当然涌现性并不特殊，随着系统复杂性的增加，涌现会频繁发生，更关键的是复杂性的维度，举个简单的例子，比如计算机系统的基本组成就是一个CPU以及相应的外设，如果沿着数量的维度增加复杂性，就会涌现出超算、集群、云、互联网；如果沿着指令序列的维度增加复杂性，就会涌现出繁荣复杂的软件生态，不同的维度涌现出的规律也是各不相同的。

深度学习和图灵机的关系也前面说到的不同层级一样：深度学习基于图灵机，但深度学习具有独立于图灵机的能力，让我们这几年在很多传统图灵机算法领域取得突破性进展。那么深度学习带来的新规律是来自于哪个维度呢？

大家可以想一个问题，既然神经网络基于图灵机，又能解决很多传统图灵机算法解决不了的问题，那么我们能不能像拿着标准答案抄作业一样，用传统程序的方式，抄一个效果和神经网络差不多的程序来。比如说五十年前给你一个训练好的resnet模型作为参考答案，让你按照计算机程序的方式写一个图像分类器达到resnet模型的效果。你会发现这个程序虽然可以在当时的计算机上运行，而且结果正确，但是你理解不了。你可能发现这个程序尝试用卷积提取了很多边角特征，但这些特征非常多，而且很多你都没法理解，你更没法理解后面基于这些特征是怎样靠着magic number一样的数字做一些加减乘除就可以得到这么好的图像分类效果，其实这个维度是描述复杂性。

注意这里说的描述复杂性和通常说的算法复杂性不是一个意思，算法复杂性是执行时间和空间占用的规模，而我这里说的描述复杂性是指算法设计和描述的复杂程度。这个复杂性我很难找到一个非常合适的定义，比较接近的定义是柯氏复杂性，但也不完全准确。柯式复杂性的定义是生成一个给定字符串的图灵机算法的最小比特数，这个字符串可以泛化成各种具体任务，而柯式复杂性描述的是完成这个任务最少的逻辑量。当然这个定义不是特别准确，大家可以思考一下这个柯式复杂性可以把一个看起来很复杂的任务压缩到什么程度。我们平常写代码经常考虑代码复用、分层抽象、解耦合，而柯式复杂性描述的是你复用抽象解耦的极限。

实际上我们大多数程序的实际大小远没有达到柯氏复杂性的极限，（当然也没有必要，因为程序会变得非常难懂）。像很多非常大型的软件工程，像操作系统，数据库等，代码量巨大，但描述复杂性并不高，毕竟通过抽象就可以化简成很基础的几个算法写到教科书里。

而图像分类这一类问题之所以难，本质上是因为描述复杂性很高，需要打海量补丁来修各种边界条件。所以在我们的思想实验里面，大家拿着深度学习搞出来的标准答案在图灵机算法层面抄作业也无从下手。

从这个角度看，图灵机可以支持的算法集合是图灵可计算函数集合，甚至包含了模拟整个宇宙的算法在里面。但我们人类可以设计的算法，只是其中的低描述复杂性算法集合，因为人可以维护的描述复杂性是有限的。虽然我们通过抽象和解耦合可以做出非常庞大的软件工程，但描述复杂性是抽象和解耦合的极限，这些庞大的软件工程虽然规模巨大，但既然我们还能通过抽象和解耦合来维护，本质上也是一种“虚胖”，还是一些低描述复杂性算法。

可以说，描述复杂性的层级是根本性的，因为它是抽象和分层的极限对应的复杂性提升，而其他维度的涌现则仍然是通过抽象和分层在低描述复杂性图灵机算法集合里面扑腾。

低描述复杂性算法集合在整个图灵可计算函数中沧海一粟都算不上。而刚刚的思想实验里给的训练好的深度学习模型则是高描述复杂性算法，这也是为什么深度学习模型经常被诟病可解释性差的原因，本质上是人可以维护的复杂性太低，毕竟可解释的意思是可以用简单的几句话描述它的工作原理，如果我们用几千万句话解释一个深度学习模型是怎么处理各种边角料，从而实现高准确率的分类，大家会接受这种解释么？

从另一方面说，深度学习给了我们探索高复杂性算法的机会。而深度学习带来的一系列突破，也正是描述复杂性的层级提升涌现出的能力，毕竟高复杂性可是可以模拟整个宇宙的。那这种层级的突破又是怎么实现的呢？其实我们可以看到，层级的提升必然带来对低层级细节的放弃，例如物理上典型的热力学，当我们以热力学的视角来看一团气体时，我们只关注温度体积压力等指标，而放弃了每个气体分子的动量能量等指标（实际上温度放到微观尺度上都没法定义），在微观层面看一团气体，参数量是非常庞大的，在宏观层面看却非常简洁。回到图灵机算法和深度学习模型上，同样一个resnet模型，不同人训练出来的模型参数具体数值肯定差异巨大，翻译成算法来理解是截然不同的两个算法，但大家不会当做两个不同的深度学习模型，因为在这个过程中我们放弃了对于参数（也就是具体规则）的把控，只关注模型结构了。所以我们可以很轻松的训练一个参数规模成千上万的超大模型，这个模型在算法层面的描述复杂性是非常高的，但在模型层面的描述复杂性则很低，所以我们才能维护这样的模型。

所以进一步推广，深度学习模型的集合是图灵可计算函数的一个很小的子集，但也是非常庞大的，而且基本都属于高复杂性算法的集合内。但我们类可以探索的仍然是低描述复杂性模型子集，同样对于整个深度学习模型集合而言连沧海一粟都算不上。所谓深度学习的瓶颈可能更多是低复杂性深度学习模型的瓶颈，远远谈不上是深度学习的瓶颈。

铺垫了这么多，我们回到类脑，基于层级的思想，我们再来看看人类大脑。大脑的神经元和突触数量可能现在早已经被各种nlp的大模型碾压下去了，但通用智能的能力却碾压目前各种大模型。因为人类大脑的描述复杂性很可能还在好多个层级之上，是一个描述复杂性惊人的超级系统。

层级的观念之所以重要是因为，很多能力和概念在低层级是压根没有的，就像微观层面的气体分子没有温度的概念，涌现上去才有。图灵机也没有训练的概念，深度学习才有。那么大脑的学习到底对应的是深度学习的训练还是某种高层级才涌现出的概念？这个靠我们在深度学习模型上扑腾是没有用的，我们能扑腾的永远只是低复杂性模型的浅滩。

反过来说，这种对类脑智能的探索远不是规模的问题，规模可以虚胖，但描述复杂性是非常难突围的，每一层都很难。整个计算机领域因为图灵机建立了根基，经过这么多年发展，终于通过深度学习爬上了第一层台阶，而我们所期望的AGI，很可能是在复杂性大山的山顶。

当然，人类大脑站着这座山非常高的位置，而它最下面的台阶肯定不是深度学习，但高层级规律是有独立性的。无论走哪个坡面，层级到了那个高度，即使得不到类脑智能，我们也可以得到其他智能。

说了这么多，其实我所反对的是退回去重新找台阶的做法。深度学习不行，所以我们要退回去重新找一个台阶。甚至图灵机是不是也不行，我们要找新的计算模型。而SNN目前连第一级台阶也迈不上去，即使迈上去了，虽然可能可以看到和深度学习不同的风景，但能收获的也只是这个复杂性层级能带来的果子。

这一篇写得有点长，主要想把复杂性的思想代入到AGI的探索中，至于怎么进行复杂性突围，可能下一篇再进一步阐述了