# 引入

为了在 $(\lambda x.t_{12}) t_2 \to [x \mapsto t_2] t_{12}$ 这个替换中，不造成变量名的混淆，我们可以使用以下几种命名/替换策略：

1. Represent variables symbolically, and **apply α-reduction**.
2. We can represent variables symbolically, but introduce a general condition that the **names of all bound variables must all be different from each other** and from any free variables we may use. 
    - However, it is not stable under substitution (or beta-reduction): since substitution involves copying the term being substituted, it is easy to construct examples where the result of substitution is a term in which some λ-abstractions have the same bound variable name. This implies that each evaluation step involving substitution must be followed by a step of renaming to restore the invariant. 
3. We can devise some **“canonical” representation of variables** and terms that does not require renaming. 
4. We can avoid substitution altogether by introducing mechanisms such as explicit substitutions (Abadi, Cardelli, Curien, and Lévy, 1991a). 
5. We can avoid variables altogether by working in a language based directly on combinators, such as combinatory logic (Curry and Feys, 1958; Barendregt, 1984)—a variant of the lambda-calculus based on combinators instead of procedural abstraction—or Backus’ functional language FP (1978). 

本文中，我们使用第 3 个，主要原因是: **it tends to fail catastrophically rather than subtly when it is implemented wrong, allowing mistakes to be detected and corrected sooner rather than later.** Our formulation uses a well-known technique due to Nicolas de Bruijn (1972). 
- Bugs in implementations using named variables, by contrast, have been known to manifest months or years after they are introduced. 

# Terms and Contexts

De Bruijn’s idea was that we can represent terms more straightforwardly—if less readably—by making **variable occurrences point directly to their binders**, rather than referring to them by name. 

This can be accomplished by **replacing named variables by natural numbers, where the number k stands for “the variable bound by the k’th enclosing λ.”** 

- For example, the ordinary term λx.x corresponds to the nameless term λ.0, while λx.λy. x (y x) corresponds to λ.λ. 1 (0 1). 

Nameless terms are also sometimes called de Bruijn terms, and the numeric variables in them are called de Bruijn indices.1 Compiler writers use the term “static distances” for the same concept. 

> [!example]+ 例子
> 
> - c<sub>0</sub> = λs. λz. z; -> c<sub>0</sub> = λ. λ. 0
> - c<sub>2</sub> = λs. λz. s (s z); -> c<sub>2</sub> = λ. λ. 1 (1 0)
> - plus = λm. λn. λs. λz. m s (n z s);  -> plus = λ. λ. λ. λ. 3 1 (2 0 1)
> - fix = λf. (λx. f (λy. (x x) y)) (λx. f (λy. (x x) y)); -> fix = λ. (λ. 1 (λ. (1 1) 0)) (λ. 1 (λ. (1 1) 0))
> - foo = (λx. (λx. x)) (λx. x);  -> foo = (λ. (λ. 0)) (λ. 0)

从而，我们就可以定义其 syntax：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/3_14_22_57_202407031422428.png"/>

- 其中，$\mathcal T_n$ 被称为 n-term，意思就是**所有至多只有 n 个 free variable 的 term**。

# Rules

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/3_21_33_32_202407032133264.png"/>
