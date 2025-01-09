## Prelude: What is "Type"?

> [!abstract]+
> 
> “类型”本质上就是一系列推导规则引申出来的**二元关系**（关系符号就是 `:`）

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_14_56_8_202407061456251.png"/>

- 如上图，这就是 type 的一个推导规则。

### 类型的性质

对于上面的这个简单的类型系统，它满足：

1. **Uniqueness of types**: each term *t* has at *most one type*, i.e. if *t* is typable, then its type is unique
    - To be more concise, relation `:` is a **partial function** from *terms* to *types*
2. **Safety**: well-typed terms don't "go wrong", i.e. 经过若干步的 evaluation 之后，一定会 evaluate to some value
    - **Lemma 1 (Progress)**: A well-typed term is not stuck (either it is a value or it can take a step according to the evaluation rules).
        - **说人话**：如果是 well-typed，要么已经是 value，要么可以再走一步
    - **Lemma 2 (Preservation)**: If a well-typed term takes a step of evaluation, then the resulting term is also well typed.
        - **说人话**：如果是 well-typed 且可以再走一步，那么必然也是 well-typed
        - **另外**：对于我们这个不涉及 sub-typing 的简单类型系统，实际上还有更强的结论：the resulting term has the same type as the previous term

## Example: Boolean

我们在这个 lambda calculus 中，只用到 boolean。

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_15_28_57_202407061528097.png"/>

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_15_29_38_202407061529887.png"/>

- 其中，$\Gamma$ 就是 **context**

> [!example]+ An example of **type** derivation
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_15_31_46_202407061531650.png"/>

## Erasure of types

如果将一个 typed lambda calculus 的类型抹去，那么就可以变成 untyped lambda calculus，而且满足：

- 必然最终可以 evaluate to some value

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/6_16_38_40_202407061638747.png"/>

**Definition**: A term m in the untyped lambda-calculus is said to be typable in λ<sub>→</sub> if there are some simply typed term t, type T, and context Γ such that erase(t) = m and Γ ⊢ t : T. 

- **解释**：对于某个 untyped lambda calculus，如果**存在一个 typed lambda calculus，抹去其类型之后，就等于这个 untyped**，那么这个 untyped 必然是一个“好的”函数。
