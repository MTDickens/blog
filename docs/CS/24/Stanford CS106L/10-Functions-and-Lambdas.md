# Lec 10: Functions and Lambdas

## Why "Lambda"s?

Suppose you have implemented a generic function called `count_occurrences`:

```cpp
template <typename InputIter, typename DataType> 
int count_occurrences (InputIter begin, InputIter end, DataType val) {
    int count == 0;
    for (auto iter = begin; iter != end; ++iter) {
        if (*iter == val)
            ++count;
    }
    return count;
}
```

Usage:

```cpp
int main() {
    std::string str = "Xavier";
    std::cout << "Occurrences of 'a': " << count_occurrences (str.cbegin(), str.cend(), 'a') << '\n';
    return 0;
}
```

However, if you want to count, say, all vowels in an `str`, you will want `isVowel(*iter)` instead of `*iter == val`.

- where `isVowel` is a predicate (i.e. return type is `bool`)

### Function Pointers

To meet the requirement, we have to change the code a little bit:

```cpp
template <typename InputIter, /*typename DataType, */typename UniPred>  // UniPred stands for "unary predicate"
int count_occurrences (InputIter begin, InputIter end, /*DataType */UniPred /*val*/pred) {
    int count == 0;
    for (auto iter = begin; iter != end; ++iter) {
        if (pred(*iter)/* == val*/)
            ++count;
    }
    return count;
}

bool isVowel (char c) {
    std::string = "aeiou";
    return vowels.find(c) != std::string::npos;
}

int main() {
    std::string str = "Xavier";
    std::cout << "Occurrences of all vowels: " << count_occurrences (str.cbegin(), str.cend(), isVowel) << '\n';
    return 0;
}
```

Then, what is the type of `UniPred`?

It turns out to be a **function pointer**, 

### Lambda

We might want some function like this:

```cpp
bool isMoreThan (int x, int limit) {
	return x > limit;
}
```

However, this is a binary predicate, and can't be easily sent into `count_occurrences`. If you really want to send, you must change the structure of function, which we don't want.

```cpp
template <typename InputIter, typename BinPred, typename Val1>
int count_occurrences (InputIter begin, InputIter end, BinPred pred, Val_1 val_1) {
    int count == 0;
    for (auto iter = begin; iter != end; ++iter) {
        if (pred(*iter, val_1))
            ++count;
    }
    return count;
}
```

Or just specify the function, which again, is what we don't want.

```cpp
bool isMoreThan3 (int x) {
	return x > 3;
}

bool isMoreThan4 (int x) {
	return x > 4;
}

bool isMoreThan5 (int x) {
	return x > 5;
}

// ...
```

But you can use lambda!

```cpp
int limit = 114514;
auto isMoreThan = [limit](int upper) { return upper > limit; };
isMoreThan(1919810); // True!
```

#### Syntax of "Lambda"

```cpp
[capture_list] (parameter_list) -> return_type { function_body }
```

```cpp
[]                 // captures nothing
[limit]            // captures lower by value
[&limit]           // captures lower by reference
[&limit, upper]    // captures lower by reference, higher by value
[&]                // captures everything except lower by reference
[&]                // captures everything by reference
[=]                // captures everything by value
```

**Tips:**

- Use a lambda when you need a *short function* or to ***access local variables*** in your function. 
- If you need *more logic* or *overloading*, use function pointers.

#### Lambda is a Closure in C++

In the realm of C++, lambda expressions are incredibly powerful tools that allow us to write anonymous functions right within our code. But what makes them even more special is their ability to act as closures.

A closure, in essence, is **a function object that has access to variables from its surrounding scope**. This means it can "capture" and use these variables even after they go out of scope elsewhere in the program. In other words, closures provide a way to preserve data between invocations.

C++ lambdas become closures when we utilize capture clauses - denoted by square brackets `[]` at the start of the lambda expression. Variables can be captured either by value or by reference, allowing different degrees of interaction with the original variable.

For instance, consider this piece of code:
```cpp
{
    int x = 10;
    auto my_lambda = [x]() { return x * 2; }; // return 100
}
```
Here, `my_lambda` is a closure that captures `x` by value. It returns double the value of `x`, regardless of any changes made to `x` outside the lambda afterwards.

This feature enhances flexibility and control over data flow in our programs, making lambdas an essential part of modern C++.

### Lambda As A `class`

> A lambda expression creates an nameless functor - it's syntactic sugar.

A **functor** is any class that provides an implementation of `operator()`.

**By value:**

```cpp
class Functor {
public:
    Functor(int limit_) : limit_(limit) {}
    int operator() (int upper) const {
        return limit + upper;
    }
private:
    int limit_;
};

int limit = 114514;
Functor x(limit);
if (x(1919810)) {...};

// is equivalent to 

int limit = 114514;
auto x = [limit](int upper) { return upper > limit; };
x(1919810);
if (x(1919810)) {...};
```

**By reference:**

```cpp
class Functor {
public:
    Functor(int& limit) : limit_(limit) {}
    void operator() (int upper) {
        limit_ += upper;
    }
private:
    int& limit_;
};

int limit = 114514;
Functor x(limit);
x(1919810);

// is equivalent to 

int limit = 114514;
[&limit](int upper) { limit += upper };
x(1919810);
```

