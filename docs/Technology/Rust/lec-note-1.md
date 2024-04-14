Rust 的深复制没什么好说的，就是 `clone()`。

Rust 的 `Copy` trait：
- 基本类型
- 纯基本类型组成的 tuple
- `&T`: immutable reference

因此，对于不显示加 `clone()` 的复制：
- 如果是基本类型，所有权就不变
- 如果是不可变引用，那么就是虽然借用了，但是只借用了值，不借用所有权
- 如果是可变引用，那么就是把所有权也借用了

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
- 如果 s 被不可变引用，那么就不可以再次被可变借用
    - **警告：** 只要是 `&mut s`，不论左侧是 `let x =` 还是 `let mut x =`，都属于可变借用。
- 如果 s 被可变引用，那么就不可以再次被可变/不可变借用

**注意：** 可变引用没有 Copy Trait，所以会造成所有权转移。但是，不论是可变引用，还是不可变引用，都不能**拿走**所有权，而只能**借用**所有权——用完之后，必须要还给人家。因此，下面的代码，是不通过的

```rust
struct My {
    i: String,
    j: u32
}

fn bad_function1(s: &mut My) -> String {
    s.i // Error: s 是可变引用，因此只是借用了所有权，不能拿走
}

fn bad_function2(s: &mut My) {
    let k = s.i; // Error: s 是可变引用，因此只是借用了所有权，不能拿走
}

fn bad_function3(s: &mut My) {
    let k = *s; // Error: s 是可变引用，因此只是借用了所有权，不能拿走
}

fn bad_function4(s: &mut My) {
    let k = s.j; // OK, since s.j is of type u32, which has `Copy` trait
}

fn main() {
    // ...
} 
```

错误：

```
error[E0507]: cannot move out of `s.i` which is behind a mutable reference
 --> src/main.rs:7:5
  |
7 |     s.i // Error: s 是可变引用，因此只是借用了所有权，不能拿走
  |     ^^^ move occurs because `s.i` has type `String`, which does not implement the `Copy` trait
```

## 总结

总而言之，rust 的这套机制，就是为了让

- 不可变引用的数据，在其作用域内，一定不变
- 可变引用的数据，在其作用域内，一定独享