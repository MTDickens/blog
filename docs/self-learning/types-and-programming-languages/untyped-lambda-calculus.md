# Evaluation Schemes

主要有这几种 evaluation scheme:

1. **full beta-reduction**
    - 只要是 `(lambda x. t1) t2` 的形式，就可以 reduce
    - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/3_11_0_24_202407031100985.png"/>
2. **normal order**
    - **优先** reduce outermost, leftmost。如果没有，那就再考虑其它的形式。
    - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/3_11_1_24_202407031101655.png"/>
3. **call by name**
    - **不允许**在 abstraction 内部进行 reduce (i.e. `t1 t2` or `lambda z. t2` 的 t2，被禁止 reduce)
    - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/3_11_1_38_202407031101729.png"/>
        - variants used by ALGOL-60 and Haskell: **call by need**
4. **call by value**
    - 和 call by name 正相反。`lambda z. t2` 仍然禁止 reduce，但是 `t1 t2` 中，**必须先 reduce t<sub>2</sub>，才能进一步 reduce 左侧的**
    - <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/img/2024/07/3_11_1_57_202407031101722.png"/>

本书中，我们使用 call-by-value 策略。因为 call-by-value 应用最广泛，而且很容易扩展到 reference 以及 exception。