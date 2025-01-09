## Lec 8: Template Classes and Const Correctness

### Motivation

You were working at a graphics startup in 1998, and you needed a simple data structure to manage `Point` objects. 

With your knowledge of pointer arithmetic and classes you create this `PointVector`:

```cpp
class PointVector {
public:
    // methods for adding,removing,accessing Points
	// take a look at the lecture code if intersted!
private:
    Point* elements;
    int size;
}
```

You realized that you not only need to keep track `Point`, but also need to keep track of `bool`, `char`, `int`, `short`, `long`, `long long`, `unsigned int`, `unsigned char`, `unsigned short`, `unsigned long`, `unsigned long long`, `float`, `double`, `long double`, `std::size_t`, `ptrdiff_t`, `int8_t`, `int16_t`, `int32_t`, `int64_t`, `uint8_t`, `uint16_t`, `uint32_t`, `uint64_t`, `char16_t`, `char32_t`, `wchar_t`, `void`, `nullptr`, and finally, `enum` types. That's A LOT of types!

### Template Class

> Definition: Template Class is a class that is **parametrized** **over** some number of **types**; it is comprised of member variables of a general type/types.

**Example (`IntContainer` vs `Container`):**

```c++
/*
* container.h
*/

/*
// This is not a container for all types,
// so we won't use this.
class IntContainer { 
public:
    IntContainer (int val);
    int getValue();

private:
    int value;
}
*/
##pragma once

// When making template classes you need to `#include` the `.cpp` implementation in the .h file. This is a compiler quirk
// — not super important for this class, but just keep it in mind when working with templates. 
##include "container.cpp"

template <typename T>
// This is a template
// declaration and allows us
// to create template classes
class Container {
public:
    IntContainer (T val);
    T getValue();

private:
    T value;
}
```

```cpp
/*
* container.cpp
*/

##include <container.h>

template <typename T>
Container<T>::Container(T val) {
    this->value = val;
}

template <typename T>
T Container<T>::getValue () {
    return this->value;
}
```

**Note:** 

1. It's crucial to highlight that when we write member functions, **we use the notation `Container<T>` instead of just `Container`.** This is because `Container<T>` represents different classes for different types of `T`. For example, `Container<int>` is not the same as `Container<float>`. So, it's important not to mix them up.
2. To correctly define a template with its associated parameters, you need to **put the declaration `template <typename T, ...>` at the beginning of the function**. This tells the compiler that we're using a template and specifies the types of the parameters that will be used.
3. When used in templates, **`typename` and `class` are interchangeable**.
4. When **making template classes** you need to **`#include` the `.cpp` implementation in the .h file**. This is a compiler quirk — not super important for this class, but just keep it in mind when working with templates. 

### Const Correctness

```cpp
std::string stringify(const Student& s){
    return s.getName() + " is " + std::to_string(s.getAge()) +
        " years old." ;
}
// Compiler error!
```

In the absence of the `const` specifier for member methods, the compiler faces the challenge of determining the intrinsic const-ness of the methods`getName` and `getAge`.

So, **we add `const` at the end of a member method that does not modify `this`**.

- Indeed, member methods possess a default argument - `this` - which, by default, is **not** considered `const`.
- So, **the "const correctness" is actually the `const` for `this`**!
- And, for sure, **`const` objects can only interact with const-interface!**

### `const_cast`

`const_cast` performs operations on the low-level`const` (referred to as "casting away the const") in C++.

```cpp
##include <iostream>
##include <string>

using namespace std;

const string& smaller(const string& a, const string& b) {
    // Returns the smaller of the two input strings, 'a' and 'b'.
    return (a < b ? a : b);
}

string& smaller(string& a, string& b) {
    // Returns the smaller of the two input strings, 'a' and 'b'.
    // We use `const_cast<const string&>` here to avoid a self loop.
    // Without `const_cast<const string&>`, the 'smaller' function will merely call itself,
    // i.e., the non-const version, instead of the const version.
    return const_cast<string&>(smaller(const_cast<const string&>(a), const_cast<const string&>(b)));
}

int main() {
    string a = "hello", b = "world";
    auto& c = smaller(a, b);
    cout << c + "!";
    return 0;
}
```

As mentioned above, we can achieve overloading for `smaller` function with the following implementations:

- Return a `const` reference for a `const` argument.
- Return a non-`const` reference for a non-`const` argument.
- Only implement the main function once, and for the non-`const` version, simply call the `const` version - following the DRY principle!