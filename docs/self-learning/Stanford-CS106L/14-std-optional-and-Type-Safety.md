# Lec 14: `std::optional` and Type Safety

> **Definition:** The extent to which a function signature guarantees the behavior of a function.

## Introduction

Example:

```cpp
void removeOddsFromEnd(vector<int>& vec){
    while(vec.back() % 2 == 1){
        vec.pop_back();
    }
}
```

如果 `vec` 为空，则 `vector<int>::back()` 行为未定义。

所以，我们要增加判断非空，也就是**【法一】**：

```cpp
void removeOddsFromEnd(vector<int>& vec){
    while(!vec.empty() && vec.back() % 2 == 1){
        vec.pop_back();
    }
}
```

## `std::optional`

我们先看一下 `vector<valueType>::back()` 函数的实现（简化版）：

```cpp
valueType& vector<valueType>::back(){
    if(empty()) throw std::out_of_range;
    return *(begin() + size() - 1);
}
```

抛异常是很烦人的事情。我们希望将异常封装在数据结构里：

```cpp
std::pair<bool, valueType&> vector<valueType>::back(){
    if(empty()) return make_pair(false, valueType()));
    return *(begin() + size() - 1);
}
```

可是，这有三点问题：

1. 首先，`valueType()` 是 r-value，不能绑定在 `valueType&` 上。
2. 其次，即使把 `valueType&` 改为 `const valueType &` 或者 `valueType`，也不行。因为 `valueType` 未必有默认构造函数
3. 最后，即使有默认构造函数，该构造函数执行的时间成本可能也不小。

因此，我们要用 `std::optional<T>` 进行封装：

```cpp
std::optional<valueType> vector<valueType>::back(){
    if(empty()) return std::optional::nullopt;
    return std::optional<int>{*(begin() + size() - 1)};
}
```

- 注意：`std:optional<valueType>` 的 `valueType` 后面没有 `&`。因为 `std::optional` 不允许引用。

### Interface of `std::optional`

如何调取出 `std::optional<T>` 中的东西呢？可以使用以下接口：

```cpp
T std::optional<T>::value();                 // if not `nullopt`, return original value; 
                                             // else, throws bad_optional_access error
T std::optional<T>::value_or(T default_val); // if not `nullopt`, return original value; 
                                             // else, return default_val
std::optional<T>::has_value();               // return if it is not `nullopt`
```

可以类比 Haskell 的代码：

```haskell
-- `value` is impure, since it might throw exceptions
-- so we shall not talk about it here

value_or :: Maybe a -> a -> a
value_or (Just x) _ = x
value_or Nothing  y = y

has_value :: Maybe a -> Bool
has_value (Just _) = False
has_value Nothing  = True
```

因此，`removeOddsFromEnd` 可以改成：

```cpp
void removeOddsFromEnd(vector<int>& vec){
    while(!vec.back().has_value() && vec.back().value() % 2 == 1){
        vec.pop_back();
    }
}
```

这还是有点长了。实际上，由于 `std::optional` 内部已经定义了 conversion member function：

```cpp
template<typename T>
class optional {
public:
    // ...
    operator bool() const {
		return has_value();
    }
private:
    // ...
};
```

因此，`removeOddsFromEnd` 可以进一步简化为：

```cpp
void removeOddsFromEnd(vector<int>& vec){
    while(!vec.back() && vec.back().value() % 2 == 1){
        vec.pop_back();
    }
}
```

### Pros and Cons

**Pros of using `std::optional` returns:**

- Function signatures create more informative contracts
  - i.e. `optional` means that the function might return a bad value


- Class function calls have guaranteed and usable behavior
  - i.e. it never throw exceptions, as long as it is used properly

**Cons:**
- You will need to use `.value()` EVERYWHERE
- (In cpp) It’s still possible to do a `bad_optional_access`
  - nevertheless, C++ is a low-level language that highly depends on `exception`
- (In cpp) Optionals can have undefined behavior too (`*optional` does the same thing as `.value()` with no error checking)
- In a lot of cases, we want `std::optional`... which we don’t have
  - `std::optional<T&>` is not allowed

### Monadic Features (C++ 23)

**`std::optional` "monadic" interface (C++23 sneak peek!)**

- `.and_then(function f)`: Returns the result of calling `f(value)` if the contained value exists, otherwise `null_opt` (where `f` must return `optional`).
- `.transform(function f)`: Returns the result of calling `f(value)` if the contained value exists, otherwise `null_opt` (where `f` must return `optional<valueType>`).
- `.or_else(function f)`: Returns the value if it exists, otherwise returns the result of calling `f`.

`std::optional` is a wrapper, a monad. But it's not that widely used in C++. 

You can have a full taste of monad in Rust, Swift and JavaScript, if you will. 