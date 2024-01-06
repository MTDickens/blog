# Lec 9: Template Functions

**Example:**

```cpp
template <typename T>
T myMax (T a, T b) {
    return (a > b ? a : b);
}
```

Please note that there is a distinction between template classes and templated functions. When creating an object of a template class, it is necessary to explicitly specify the `typename` during initialization. However, when invoking a templated function, there is no need to include the `typename` - the compiler will derive it automatically.

## Constraints & Concepts

As of C++20, we can limit the acceptable types in: 

- template classes 

  - ```cpp
    #include <concepts>
    
    template <typename T>
    concept Addable = requires (T a, T b) {
        a + b;
    };
    
    template <Addable T>
    class Container {
    public:
        // ...
    };
    ```

- template functions 

  - ```cpp
    #include <concepts>
    
    template <typename T>
    concept Multiplicatable = requires (T a, T b) {
        a * b;
    };
    
    template <typename T> requires Multiplicatable<T>
    T add(T a, T b) {
        return a * b;
    }
    ```

- non-template member functions of a template class

  - ```cpp
    #include <concepts>
    
    template <typename T>
    concept FloatingPoint = std::is_floating_point<T>::value;
    
    template <typename T> requires FloatingPoint<T>
    class Vector {
    public:
        // ...
    
        T dotProduct(const Vector<T>& other) const {
            // Implementation of dot product
        }
    };
    ```

**Note:** `concepts` can be used in multiple ways, such as `template <Concept T>` of `template <typename T> requires Concept<T>`, etc.



## Calling template functions

```cpp
template <typename T>
concept Multiplicable = requires (T a, T b) {
    a * b;
};

template <typename T, typename U>
concept GenericMultiplicable = requires (T a, U b) {
    a * b;
};

template <typename T> requires Multiplicable <T>
T mul (T a, T b) {
    return a * b;
}

template <typename T, typename U> requires GenericMultiplicable <T, U>
T smart_mul (T a, U b) {
    return a * b;
}

int main () {
    mul<int> (1, 1); // = 1, valid of course
    mul<int> (1, 1.5); // = 1, valid b/c of implicit casting
    mul<double> (1, 1.5); // = 1.5, valid b/c of implicit casting
    
    mul (1, 1); // valid still
    mul (1, 1.5); // invalid!  b/c the compiler doesn't know 
    // whether to use mul<int> or mul<double>
    mul (1, static_cast<int>(1.5)); // valid b/c of explicit casting 
         
    smart_mul (1, 1.5); // this is valid.
}
```

## Make Your Code Run During Compile Time

**Template code is instantiated at compile time.** 

So we use template metaprogramming takes advantage of this to run code at compile time.

### Template Metaprogramming

```cpp
template<unsigned n>
struct Factorial {
    enum { value = n * Factorial<n - 1>::value };
};

template<> // template class "specialization"
struct Factorial<0> {
    enum { value = 1 };
};

int main () {
    cout << Factorial<10>::value << endl; // 3628800
}
```

It's quite similar to:

```haskell
factorial :: Int -> Int
factorial 0 = 1 -- "specialization"
factorial n = n * factorial (n - 1)
```

### `constexpr`

We could also compute the same example in compile time using `constexpr` instead of template metaprogramming!

```cpp
constexpr double fib (int n) { // function declared as constexpn
    if (n == 1) return 1;
    return fib (n - 1) * n;
}
int main () {
    const long long bigval = fib(20);
    cout << bigval << endl;
}
```

### Applications of TMP

TMP isn’t used that much, but it has some interesting implications: 

- Optimizing matrices/trees/other mathematical structure operations 
- Policy-based design 
- Game graphics

