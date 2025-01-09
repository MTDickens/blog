## Lec 2-3: Bits, Bytes And Integers

### Why use `unsigned`?

Firstly, *DON'T* use `unsigned` without understanding implications.

```c
unsigned i;
// This is actually an infinite loop
for (i = cnt - 1; i >= 0; --i) { 
    // ...
}
```

```c
##define DELTA sizeof(int)

int arr[10];
// Also an infite loop,
// in that DELTA is of type `unsigned long`.
// So, `i` in `(i - DELTA)` will be cast to `unsigned long` implicitly
for (i = sizeof(arr); i - DELTA >= 0; i -= DELTA) {
    // ...
}
```

#### Counting Down with Unsigned

Second, you can do counting down with `unsigned`.

```c
// When a variable of type `unsigned` is underflowed,
// it will be set to `MAX_UNSIGNED`
// according to C standard

for (unsigned i = cnt - 1; i < cnt; --i) {
    // ...
}
```

Even better, you can use `size_t` (whose size is 8 bytes, as opposed to the 4-byte `unsigned int`). So, even the condition is `i <= cnt`, it still won't become a infinite loop, as long as `cnt` is shorter than `i`.

```c
// When a variable of type `unsigned` is underflowed,
// it will be set to `MAX_UNSIGNED`
// according to C standard

for (size_t i = cnt - 1; i < cnt; --i) {
    // ...
}
```

#### Tips

Use `unsigned` in the cases of

- modular arithmetic
  - e.g. cryptography
- using bits to represent set

Because the overflow/underflow of `unsigned` is well-defined in C standard, as opposed to signed types.

### Words and Bytes

Any given computer has a **word size**.

It should roughly be

- the largest number
- the range that signifies how big a pointer is

in some language, or the

- largest sort of chunk of hardware for which there's standard support for storing it for arithmetic operations and so forth

e.g. **64-bit** machine has a word size of 8 bytes

**Note:** Actually, word size is determined by both hardware and compiler. For example, `int` is 4-byte, no matter whether on 32-bit machine or 64-bit machine. 
So, in some sense, "word" or "word size" is not a very meaningful term in precise definition. But for pointer size, this makes sense.