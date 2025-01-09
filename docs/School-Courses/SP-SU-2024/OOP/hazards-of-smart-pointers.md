## Hazard

如图，这是 `shared_ptr` 的结构：

```cpp
template <typename T>
class SharedPtr
{
public:
    SharedPtr() : t_(nullptr), count_(nullptr) {}

    explicit SharedPtr(T *t) : t_(t), count_(nullptr)
    {
        if (t)
        {
            count_ = new int(1);
        }
    }

    explicit SharedPtr(const SharedPtr &rhs)
    {
        t_ = rhs.t_;
        count_ = rhs.count_;
        if (count_)

        {
            (*count_)++;
        }
    }

    ~SharedPtr()
    {
        reset();
    }

    SharedPtr &operator=(const SharedPtr &rhs)
    {
        if (this == &rhs)
        {
            return *this;
        }

        reset();
        t_ = rhs.t_;
        count_ = rhs.count_;
        if (count_)
        {
            (*count_)++;
        }
        return *this;
    }

    SharedPtr &operator*()
    {
        return *this;
    }

    T *operator->()
    {
        return t_;
    }

    T *get() const
    {
        return t_;
    }

    int use_count() const
    {
        return count_ ? *count_ : 0;
    }

    void reset()
    {
        if (count_)
        {
            (*count_)--;
            cout << typeid(T).name() << ' ' << (*count_) << '\n';
            if (*count_ == 0)
            {
                delete t_;
                delete count_;
            }
        }
    }
private:
    T *t_;
    int *count_;
};
```

假如说我们使用**循环引用**，i.e. 两结构体中的指针分别指向对方，就会造成双方（i.e. father 和 son）都以为自己还有其它指针还指向自己，从而无法实现析构，造成内存泄露：

```
class Son;
class Father {
public:
    SharedPtr<Son> son_;
    father(){
        cout << __FUNCTION__ << endl;
    }
    ~Father(){
        cout << __FUNCTION__ << endl;
    }
}

class Son{
public:
    SharedPtr<Father> father_;
    Son(){
        cout << __FUNCTION__ << endl;
    }
    ~Son(){
        cout << __FUNCTION__ << endl;
    }
}

int main() {
    auto son = SharedPtr<Son>(new Son());
    auto father = SharedPtr<father>(new Father());
    son->father_ = father;
    father->son_ = son;
    cout << "son: " << son.use_count() << endl;
    cout << "father: " << father.use_count() << endl;
    return 0
}
```

输出：

```
Son
Father
son: 2
father: 2
6Father 1
3Son 1
```

也就是说，析构的时候：

1. father 先析构，使得 father 的 count 降到 1
2. son 再析构，从而 son 的 count 降到 1

但是，两者的 count 都没有降到 0，因此没有析构，造成了内存泄漏。

我们需要使用 `weak_ptr` 来解决问题。

## Solution: `weak_ptr`

`weak_ptr` 可以认为就是**依附于**某个 `shard_ptr` 的指针。当某个 `weak_ptr` 引用了 `shared_ptr` 时，此 `shared_ptr` 不会自增

最重要的成员函数：

- `use_count`: 返回所依附的 `shared_ptr` 的 `count`
- `expired`: 检查是否所依附的 `shared_ptr` 已经无效
- `lock`: 通过所依附的 `shared_ptr` 新建一个 `shared_ptr`，并返回新建的 `shared_ptr` 的指针

> [!note]+ `weak_ptr` 的本质
> 
> `weak_ptr` 其实就是裸指针的简单封装。
> 
> 由于使用（指向一个智能指针的）裸指针的时候，容易不小心使用悬垂指针（i.e. 智能指针已经失效了，然而你仍然试图解引用这个智能指针），因此我们特地**将*指向一个智能指针的裸指针*封装成*弱指针***。

由于 `weak_ptr` 不会导致 `shared_ptr` 自增，自然没有循环引用的问题。当然，最重要的前提还是：程序员一定要尽量避免循环引用（不论用不用 `weak_ptr`），假如必须有循环引用，那么就用 `weak_ptr`。