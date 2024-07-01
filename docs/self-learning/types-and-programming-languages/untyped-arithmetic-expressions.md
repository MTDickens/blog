$$
\newcommand{toa}{\to^\ast}
\newcommand{size}{\operatorname{size}}
$$

# Terminology


> [!note]+ Language that We Use
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_15_31_56_202406281531358.png"/>

**Term/Expression:** 就是上面图片所示：不断将 t 替换成右侧的任意一项，直到不含 $t$ 为止，这就是一个 term/expression。

- $t$ 又被称为 metavariable。一个 term 中可以含有 metavariable。
- 我们目前先不谈 term 和 expression 的区别
    - 之后（第八章），我们会说到，expression 实际上分为 term/type/kind/... expression
    - 从而 reserving **term** for the **more specialized sense of phrases representing computations** (i.e., phrases that can be substituted for the metavariable $t$). 

**Evaluation:** 将 term/expression 变成 value 的过程

**Value:** 本例中，值只有两种：真假（True/False）和数字（0, succ(0), succ(succ(0)), ...）。

> [!note]+ Subtleties
> 
> 形如 `if succ(0) then ... else ...`, `succ(true)` 是无意义的。因此，之后会讲到：**类型**的目的之一，就是避免这样的无意义语句的产生。


# 三大性质以及常用归纳策略

## 三大性质

**注意**：Term 本质上来说，是一棵树。我们这里使用括号，就将这棵树变成了一个便于表示的形式。

**一个 term 中含有多少 True/False/0**
<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_16_12_12_202406281612642.png"/>

**Term Tree 的大小**
<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_16_12_16_202406281612717.png"/>

**Term Tree 的深度**
<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_16_12_22_202406281612624.png"/>

## 常用归纳策略

我们可以使用三个性质，进行自然数上的数学归纳法。同时，我们也可以直接使用结构归纳法。如下：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_20_23_17_202406282023878.png"/>


# Evaluation

## An Example

> [!example]+ Example
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_16_22_53_202406281622789.png"/>

对于右侧的 evaluation rule，有几个注意点：

- 对于大多数语言的 `if <cond> then <if-true> else <if-false>` 而言，我们都是**先判断 `<cond>`，再根据 `<cond>` 来选择对应的 sub-expression**。
    - Thus, we designed our `E-IF` rule, such that **to evaluate a conditional, we must first evaluate its guard (i.e. `E-IFTRUE/FALSE`); if the guard is itself a conditional, we must first evaluate its guard (i.e. `E-IF`); and so on.** 
    - 从而
        - `E-IfTrue` and `E-IfFalse` **do the real work** of evaluation, 
        - while `E-If` helps **determine where the work is to be done**.
    - 因此，`E-IfTRUE/FALSE` 又被称为 computation rules，`E-IF` 就是 congruence rule

下面，我们将 evaluation 的过程严格化：

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_16_55_31_202406281655920.png"/>

> [!note]+ 解读
> 
> 1. 我们将规则中的 metavariable 进行替换，从而得到最终的 $\text{xxx} \to \text{yyy}$ 的形式。
>     - **注意**：很多时候，如果要进行一个合法的替换，那么必须满足前提要求。如下图，
>         - `if t then false else false ⮕ if u then false else false` 的前提就是 `t ⮕ u`
>         - 而 `t ⮕ u` 的前提就是 `s ⮕ false`
>         - `s ⮕ false` 满足 `E-IFTRUE`，因此没有前提，自此结束
>     - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_16_58_38_202406281658745.png"/>
> 2. 简单来说，如果某个关系满足推导规则，那么：**对于所有的 $\text{xxx} \to \text{yyy}$，如果所有前提要求都在这个关系中，那么 $(\text{xxx}, \text{yyy}) := \text{xxx} \to \text{yyy}$ 本身也必须被包含在这个关系中**
> 3. 直觉上来说：由于 `E-IFTRUE/FALSE` 没有任何前提，因此必须有 $\forall t_1, t_2, t_3: (\text{if true/false } \text{then } t_2 \text{ else } t_3, t_2/t_3) \in R$。其次，由于 `E-IF`，还需要将 $R$ 继续拓广。
>    
>    从而，关系 $R$ **最小**也可以包含所有通过这三条规则可以实现的 evaluation。

## Determinacy of One-Step Evaluation

**Theorem 3.5.4 (Determinacy of one-step evaluation):** 对于我们这个例子而言，if $t \to t', t \to t''$, then $t' = t''$

*Proof*: 我们可以使用

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_20_30_1_202406282030262.png"/>

对于 $t \to t'$ 的最后一步：

1. 假设最后一步是 `E-IFTRUE`，那么 `t = if t1 then t2 else t3` (where `t1 = true`)。从而，$t \to t''$ 的最后一步也必然是 `E-IFTRUE`，因为 `t1` 既不是 false，而且也 $\nexists u: t_1 \to u$。
2. `E-IFFALSE` 同理
3. `E-IF` 的话，由于 $\exists u: t_1 \to u$，因此 $t_1 \neq \text{true, false}$，从而不可以是 `E-IFTRUE` 或者 `E-IFFALSE`。

$\blacksquare$

## Normal Form

**Definition:** A term $t$ is in *normal form* if no evaluation rule applies to it

**Theorem 3.5.7:** Every value is a normal form. 

*Proof:* Trivial

**Theorem 3.5.8:** Every normal form is a value.

*Proof:* 其逆否命题为：if not a value, then not a normal form。

由于非 value，因此一定是 `if t1 then t2 else t3` 的形式。

采用 structural induction: suppose all non-value sub-term are non-normal-form.

Then: 

1. if `t1 = true`, then $\text{term} \to t_2$
2. if `t1 = false`, then $\text{term} \to t_3$
3. if neither, then it **must** be a non-value. Suppose $t_1 \to t_1'$, `if t1 then t2 else t3 ⮕ if t1' then t2 else t3`

Thus, this term is also a non-normal-form. $\blacksquare$

## Multi-Step Evaluation

**Definition (multi-step evaluation):** *Multi-step evaluation* relation $\to^\ast$ is the 

- **reflexive**
- **transitive**
- **closure**

of one-step evaluation relation.

> [!info]+ 等价表示
> 
> 等价于将上面 3 条规则，变成下面 5 条规则。
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_21_42_3_202406282142661.png"/>
> 


**Theorem 3.5.11 (uniqueness of normal form):** suppose $t \toa u, t \toa u'$, if both $u$ and $u'$ are normal forms, then $u = u'$

*Proof:* $t \toa u \iff t \to t_1 \to t_2 \to \dots \to t_n \to u$。同理：$t \to t_1' \to t_2' \to \dots \to t_n' \to u'$。

假设 $t_i = t_i'$，由 **determinacy of one-step evaluation**：必有 $t_{i+1} = t_{i+1}'$，或者 $t_i = u, t_i' = u'$。$\blacksquare$

**Theorem 3.5.12 (termination of evaluation):** $\forall t, \exists \text{ normal form } t': t\toa t'$

*Proof:* 易证（通过结构归纳和分类讨论）：每一次 $t_i \to t_{i+1}$ 的时候，都有 $\size (t_1) \geq 1 + \size (t_{i+1})$。由于所有的 $t$ 的 size 是有限的，因此一定可以终止。

> [!todo]+ An interesting exercise
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_23_5_11_202406282305286.png"/>
> 
> 答案：
> 
> 1. 第一条显然违反了 3.5.4，同时也违反了 3.5.11
> 2. 第二条显然违反了 3.5.4，但是，并没有违反 3.5.11（直觉上来看，不论先化简 `if ... then ... else` 中的哪一项，其实都是殊途同归）

## A More Intrinsic Example

<img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_23_25_49_202406282325611.png"/>

不难证明：上面的递推同样满足 3.5.4, 3.5.7, 3.5.11, 3.5.12。但是，不满足 3.5.7，比如 `succ true, iszero false, if 0 then true else false`。

**Definition (stuck term):** A closed term is *stuck* if it is in normal form but not a value.

- 直观来说，"stuckness" 其实就是 runtime-error

> [!example]+ Example 1
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/28_23_30_37_202406282330578.png"/>
> 
> 如上图。我们只需证明：对于之前的 evaluation rules，某个 term evaluate to some stuck term，当且仅当在这个 evaluation rules 中，该 term evaluate to `wrong`。
> 
> 而证明也很简单：
> 
> 首先还是证明 3.4.5 成立。以及证明新规则下，最终结果要么是 value，要么是 wrong。
> 
> 然后证明：旧规则下最终不 stuck ⮕ 由 3.4.5 以及新规则包含旧规则：使用新规则，必然可以推到 value ⮕ 新规则下最终不是 wrong。
> 
> 接下来，通过以下方式证明：
> 
> 1. stuck 的语句，其关键位置（i.e. `succ _`, `pred _`, `iszero _`, `if _ then .. else .. ` 中的 `_`）必然是 bad value 或者是 stuck sub-term
> 2. 通过 stuck sub-term/bad value 的结构归纳：证明所有的 stuck 语句，均可以**一步**推导到 wrong
> 3. 从而旧规则最终下 stuck ⮕ 新规则下最终是 wrong（而且一步推导）
>    
> 总结：
> 
> - $t \stackrel{old}{\toa} v \implies t \stackrel{new}{\toa} v$
> - $t \stackrel{old}{\toa} t_{stuck} \implies t \stackrel{new}{\toa} t_{stuck} \stackrel{new}{\to} \text{wrong}$
>    
> （证明很多地方还是有些含糊，建议大家按照思路自己推）

> [!example]+ Example 2
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/29_20_2_38_202406292002745.png"/>
> 
> *Proof:*
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/06/29_20_2_53_202406292002744.png"/>

