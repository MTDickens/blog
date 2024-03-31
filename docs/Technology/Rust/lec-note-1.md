Rust 的深复制没什么好说的，就是 `clone()`。

Rust 的 `Copy` trait：
- 基本类型
- 纯基本类型组成的 tuple
- `&T`: immutable reference

因此，对于不显示加 `clone()` 的复制：
- 如果是基本类型，所有权就不变
- 如果是**不可变**引用，虽然说是所有权未改变，但是 `i` 仍然是被借用了，因此处于借用状态的 `i` 和未借用状态的 `i` 还是不同的。
    - 可以认为，`&i` 被拷贝了，但是 `i` 其实是属于一个借用状态

```rust
fn main() {
    let mut i: i32 = 114514;

    let j = &i; // i is borrowed, ownership unchanged
    // Error: since i is borrowed, you can't change its value or pass its ownership
    // i += 2;
    // let l = &mut i;
    j;
    // Since j will never be used again, j is released and i is given back

    let mut k = &mut i; // i is borrowed, ownership passed to k
    *k = 1919810;
    // Since k will never be used again, k is released and i is given back

    println!("i: {}", i);
}
```

在 s 被借用的时候，不可以

- 改变 s 的值
- 如果 s 被不可变借用，那么就不可以再次被可变借用
    - **警告：** 只要是 `&mut s`，不论左侧是 `let x =` 还是 `let mut x =`，都属于可变借用。
- 如果 s 被可变借用，那么就不可以再次被可变/不可变借用
    - 根本上，这是因为所有权已经被转移了

## 总结

总而言之，rust 的这套机制，就是为了让

- 不可变借用的数据，在其作用域内，数据保证是不变的
    - 因此，借用之后，不可以借给可变，同时不可以改变数据
- 拥有所有权的数据，在其作用域内，数据保证是独享的
    - 因此，所有权在可变借用/所有权转移的时候，就会发生转移，保证原变量在新变量的作用域内失效