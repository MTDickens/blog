# Lec 2: Types and Structs

## Static typing v.s. dynamic typing 

By static typing, a name is associate with a type that can't be changed.

Using compiled and statically typed language, types will be checked during compilation.

|                   | compiled              | interpreted                                |
| ----------------- | --------------------- | ------------------------------------------ |
| statically typed  | **C/C++**, Java, Rust | Python *(with type hints)*, **Type**Script |
| dynamically typed | Groovy, Julia         | **Python**, JavaScript, Ruby, PHP          |

### Function overloading

Unlike dynamic typing languages, we use **function overloading (by types)** to realize *(often ad-hoc)* polymorphism.

## Problems with strongly and statically typed languages

Strongly and statically typed languages are great, but
there are a few downsides:

- it can be a pain to know **what the type of a
variable is**
- any given function can **only have exactly one
return type**
- C++ primitives (and even the types in the STL) can
be limited

## Solutions

> it can be a pain to know **what the type of a
variable is**

Use keyword `auto`.

Warning :warning:: 

- only use it when the type is **obvious**
- or the type is **annoyingly verbose** to write out

> any given function can **only have exactly one
return type**
> 
> C++ primitives (and even the types in the STL) can

Use `structs`.
  - `struct`s allow you to return groups of information.
    - you can use `initializer_list` to make structs
  - you can also use `std::pair<T1, T2>` to return a pair of information
be limited