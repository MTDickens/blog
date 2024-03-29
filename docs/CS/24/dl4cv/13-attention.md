# Sequence-to-Sequence with RNNs

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290626691.png" alt="image-20240329062645879" style="zoom: 40%;" />

如图，对于 sequence to sequence（两者不一定对齐/等长）的文本转换，我们如果使用传统 RNN 架构，就如上图所示：

- 把所有关于原文的信息封装在 $c$ 和 $s_0$ 里面

可惜，$c$ 的长度有限，直觉上+信息论上并不能够封装任意长的信息。因此，我们需要的是充分利用到每一个 $h_i$。

# Attention Mechanism

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290658624.png" alt="image-20240329065857158" style="zoom:40%;" />

如图，我们的 idea 是：

1. 生成每一个词的时候，都让上一个状态来决定我们的对 $h_1 \sim h_T$​ 的 attention
    - i.e. $e_{t,i} = f_{att{(s_{t-1}, h_i)}}$，第 $t$ 轮生成词语时，对第 $i$ 个文本词语的 attention 就是 $e_{t,i}$
2. 然后，我们通过该轮的 attention vector，加权平均得到 context vector，从而生成我们本轮的状态



比如：直觉上来说，"estamos" 在西语中，意思是 "we are"，因此，对 "we" "are" 的 attention 应该差不多多，而对 "eating" "bread" 的 attention 也应该差不多少。

- 从而，我们既能够利用上所有的 $h_i$（i.e. 文本信息），也能够保证使用的合理性（i.e. 不是只取特定的 hidden state vector，而是**根据需要来取用某一些 vectors**。这和实际的语言翻译等工作是类似的）

## Interpretability

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403290713148.jpeg" alt="Interpreting Attention matrix weights in MultiheadAttention ..." style="zoom: 25%;" />

如图，我们可以通过 attention 的矩阵，直接解读出哪些词语和哪些词语之间有关系——"European Economic Area" 和 "zone &eacute;conomique europ&eacute;enne" 是一一对应但是倒序的关系。

## Still Problem

这样的 na&iuml;ve attention mechanism 并没有考虑到输入文本是一个 ordered sequence，而只是把输入文本当成了 unordered set。

- 作为对比，$s_{t-1}$ 是一个 hidden state vector，intrinsically 考虑了临近性——i.e. 它大概只会“记录”附近的一些向量。但是通过 $f_{att}$ 生成 $e_{t,i}$ 的时候，**却对于所有 $h_i$ 一视同仁，而非更加注重某一些“更可能更有价值”的 $h_i$**。