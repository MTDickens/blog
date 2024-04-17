# 泛型

泛型被广泛应用于

- 函数
- 结构体
- 枚举类型
- 方法

中，具体语法见下：

**函数**

```rust
fn example1 <T: std::ops::Add<Output = T>> (a: T, b: T) -> T {
    a + b
}

fn main() {
    let a: i32 = 114514;
    let b: i32 = 1919810;
    println!("{} + {} = {}\n", a, b, example1::<i32>(a, b)); // Explicit
    println!("{} + {} = {}\n", a, b, example1(a, b)); // Implicit
}
```

**结构体**

```rust
struct example2 <T, U> {
    x: T,
    y: U
}
```

**枚举类型**

```rust
enum example3 <T> {
    Just(T),
    Nothing
}
```

**方法和关联函数**

```rust
impl <T, U> example2 <T, U> {
    // Method
    // Mixup x of self and y of other
    fn mixup <V, W> (self, other: example2<V, W>) -> example2<T, W> {
        example2 {
            x: self.x,
            y: other.y
        }
    }
    // Associated function, not method
    fn new (a: T, b: U) -> example2 <T, U> {
        example2 {
            x: a,
            y: b
        }
    }
}

fn main() {
    let example4 = example2::<i32, String>::new (114514, "1919810".to_string()); // Explicit
    let example4 = example2::new (114514, "1919810".to_string()); // Implicit
    let example5 = example2::<i32, String>::mixup::<f32, char> (example4, example2 {x: 114.514, y: '('}); // Explicit
    let example6 = exanple2::mixup (example5, example2 {x: 114.514, y: '('}); // Implicit
}
```

我们需要注意的：

- 外部可以约束内部：以 `fn mixup <V, W> (self, other: example2<V, W>) -> example2<T, W>` 为例
    - 实现 `impl <T, U>` 可以约束模板类 `example <T, U>`
    - 模板类 `example <T, U>` 可以约束模板方法 `fn mixup <V, W> (self, other: example2<V, W>) -> example2<T, W>`
    - 模板方法**整体** `fn mixup <V, W>` 可以约束模板方法的 **arguments 和 return value** `(self, other: example2<V, W>) -> example2<T, W>`
- 模板的 implementation 不需要加 `::`，但是 call 的时候需要加 `::`
- Rust 有自动类型推断的功能

## Const 泛型

另外，如同 C++ 的 `std::array<type, const length>` 一样，我们可以让一个类型本身为整数（称为**const 泛型**）

```rust
fn matrix_multiplication<T: Copy + Default + std::ops::Mul<Output = T> + std::ops::Add<Output = T>, const L: usize, const M: usize, const N: usize>(
    a: &[[T; M]; L], 
    b: &[[T; N]; M]
) -> [[T; N]; L] {
    let mut result = [[T::default(); N]; L];

    for i in 0..L {
        for j in 0..N {
            for k in 0..M {
                result[i][j] = result[i][j] + a[i][k] * b[k][j];
            }
        }
    }

    result
}
fn main() {
    let a: [[i32; 3]; 4] = [[1,2,3],[4,5,6],[7,8,9],[10,11,12]];
    let b: [[i32; 4]; 1] = [[1,1,1,1]];
    println!("{:?}\n", matrix_multiplication(b, a));
}
```

# Trait

Trait，说白了，就是 Haskell 的 type class。

## Example

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct Post {
    pub title: String, // 标题
    pub author: String, // 作者
    pub content: String, // 内容
}

impl Summary for Post {
    fn summarize(&self) -> String {
        format!("文章{}, 作者是{}", self.title, self.author)
    }
}

pub struct Weibo {
    pub username: String,
    pub content: String
}

impl Summary for Weibo {
    fn summarize(&self) -> String {
        format!("{}发表了微博{}", self.username, self.content)
    }
}
```

