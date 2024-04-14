# 对一个问题的粗浅理解

```rust
// Buggy code
fn main() {
    let mut v = String::from("hello,");
    let r = &mut v;

    match r {
       ref mut value => value.push_str(" world!") 
    }
    // println!("{}", r);
}
```

如图，这一段代码是通不过的。具体原因很复杂，暂且不讨论。

## Code 1

下面的代码是可以通过的：

```rust
fn main() {
    let mut v = String::from("hello,");
    let r = &mut v;

    match r {
       value => value.push_str(" world!") 
    }
    // println!("{}", r);
}
```

但是，这一段代码的问题：

- v 把所有权**借给**了 r
- r 把所有权**交给**了 value，同时 v 的所有权也**转借给**了 value
- value 通过 v 的所有权，对 v 进行修改
- value 在作用域外析构，并且将 v 的所有权还给 v（因为是借的），但是 r 的所有权就丢弃了（因为是 r 交给它的）

因此，如果加上 `println!("{}", r)`，就会报错。

## Code 2

下面的代码是可以通过的（注意 $r$ 仍然有效）：

```rust
fn main() {
    let mut v = String::from("hello,");
    let r = &mut v;

    match *r {
       ref mut value => value.push_str(" world!") 
    }
    println!("{}", r);
}
```

- v 把所有权的**借给**了 r
- 由于 `ref mut value = *r`，因此 r 把 *r 给了出去，具体地，就是把 v 转借给了 value，但是 r 的所有权还在 r 手上

## Disclaimer

这只是我的粗浅解释。目前，Rust 的一些细节之处还很恶心，经常会发生变化。所以我只是通过几个小案例，总结出了自己的一家之词，实际情况肯定复杂地多。
- 可以看这个解释: [Rust 圣经 - 评论区](https://github.com/sunface/rust-by-practice/discussions/192#discussioncomment-8992825)