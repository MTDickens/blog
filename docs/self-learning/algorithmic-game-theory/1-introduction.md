## Goals and Their Killer Apps

1. When selfish behavior is benign - that is, acquire a bit more computational power, but the rule-maker's goal can be achieved.
    1. 竞价排名
    2. Spectrum 排名
    3. Kidney exchange
    4. ...
2. Let the **price of anarchy** be as near to 1 as possible
    1. Braess's paradox

> [!note]+ Price of Anarchy
> 
> $$
> \text{price of anarchy} = \frac {\text{cost if every participant is selfish}} {\text{(optimal) cost if an almighty arbitrator exists}}
> $$
> 
> e.g. Braess's paradox 的 POA 就是 $\frac{2}{\frac 43} = \frac 34$

## Proof Goal

通常，我们希望证明（**如果存在纳什均衡，**）**participants 的最终行为就必然满足 Nash Equilibrium**。

当然，可以减弱：就是 when you have dominant strategy (i.e. if everybody have their dominant strategy, it can easily be the Nash Equilibrium), people will play it.

## Yet Another Goal

How do players reach Nash equilibrium? Or do they? And can computational complexity shed some light on this question?

***Example of "how"***: When playing scissor-paper-rock game, there is **no deterministic Nash equilibrium**, i.e. you can only reach a (mixed and unique) Nash equilibrium via **randomization**.

***Example of "complexity"***: some games (auctions) are hard to play, and you can see the analysis in the later courses.

#### Computational Tractability and Intractability

***Existence (Nash's theorem)***: if 
1. [**mixed strategies**](https://en.wikipedia.org/wiki/Strategy_(game_theory)#Pure_and_mixed_strategies "Strategy (game theory)") (where a player chooses probabilities of using various pure strategies) **are allowed**, 
2. then every game with **a finite number of players** 
3. in which each player can choose from **finitely many pure strategies** 
4. has **at least one Nash equilibrium**, 
    - which might be a pure strategy for each player or might be a probability distribution over strategies for each player.

***Tractability***: The Nash equilibrium of every **zero-sum game** can be computed in **polynomial time**.

***Intractability***: The computation of Nash equilibrium of some **non zero-sum game** is in the complexity class **PPAD-hard**.

> [!note]+ Observation 1
> 
> 可以证明：除非 NP = co-NP，否则非零和游戏的纳什均衡点的计算问题就**不可能是** NP-hard（然而 NP = co-NP 目前来看是希望渺茫的）。从而，我们只好再造一个 complexity class - PPAD，用于涵盖这个重要的计算问题。
> 
> 因此，可以这么说，上面的问题是 PPAD-hard，但是很可能不是 NP-hard。然而，PPAD-hard 大概也无法找出多项式时间的解，因此**也具有很强的 intractability**。
> 
> 同时，这也是继 factorization, graph isomorphism 之后，第三个目前既未证明是 NP-hard，也未证明是 P 的**重要**问题。

> [!note]+ Observation 2
> 
> Due to the intractability of computing Nash equilibrium of general games, 我们大概可以认为，人类本身就计算不出来纳什均衡点。
> 
> 因此，使用纳什均衡作为 the critique of all games，是非常不符合实际的。 


