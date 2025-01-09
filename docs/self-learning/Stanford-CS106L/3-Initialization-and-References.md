## Lec 3: Initialization and references

### Plan

1. Initialization 
2. References 
3. L-values vs R-values 
4. Const

### Initialization

> **[Definition](https://en.cppreference.com/w/cpp/language/initialization):** Initialization of a variable provides its initial value **at the time of construction**.

#### Ways of initialization

1. Direct initialization
2. Uniform initialization
3. Structured Binding

##### Direct initialization

Direct initialization will do **implicit type conversion**, which is *bug-prone*.

**Example of direct initialization**

```cpp
int main() {
    int test = 12.5;
    int test(12.5);

    return 0;
}
```

**Example of potential bugs via direct initialization**

```cpp
int criticalSystemValueExample() {
  /// implicit conversion! Notice the compiler warning
  int criticalSystemValue(42.5);

  // Critical system operations ...
  // ...

  std::cout << "Critical system value: " << criticalSystemValue << std::endl;

  return 0;
}
```

##### Uniform initialization

Uniform initialization will not allow for **implicit *narrowing* conversion** (which means it doesn't care about widening conversion al well).


**Example of uniform initialization**

```cpp
int main() {
    // error: narrowing conversion of '1.2e+1' from 'double'to 'int'
    int number{12.5};
    return 0;
}
```

**Note:** use curly braces!



Uniform initialization is awesome because:

1. It’s safe! **It doesn’t allow for narrowing conversions**—which can lead to unexpected behaviour (or critical system failures :o)

2. It’s ubiquitous - **it works for all types like vectors, maps, and custom classes, among other things**!
    - ```cpp
      #include <iostream>
      #include <unordered_map>
      
      using namespace std;
      
      
      int mapUniformInitialization() {
        // Uniform initialization of a map
        std::unordered_map<std::string, int> ages{{"Alice", 21.5}, {"Bob", 30}, {"Charlie", 35}};
      
        // Accessing map elements
        std::cout << "Alice's age: " << ages["Alice"] << std::endl;
        std::cout << "Bob's age: " << ages.at("Bob") << std::endl;
      
        return 0;
      }
      
      int main()
      {
          mapUniformInitialization();
          return 0;
      }
      ```

##### Structured binding (C++ 17)

- A useful way to initialize some variables **from data structures with fixed sizes** at compile time.
- Ability to access multiple values returned by a function

**Examples:**

```cpp
std::tuple<std::string,std::string,std::string>getclassInfo() {
	std::string className ="CS106L";
	std::string buildingName "Turing Auditorium";
	std:string language "C++";
	return {className,buildingName,language};
}

int main(){
	auto [className,buildingName,language]getclassInfo();
	std::cout << "Come to " << buildingName << "and join us for " << className
	<< "to learn " << language << "!" << std::endl;
	return 0;
}
```

```cpp

int mapUniformInitialization() {
  // Uniform initialization of a map
  auto [a, b, c] = make_tuple("a", 2, 3.4);
  
  cout << a << ' '<< b << ' ' << c;

  return 0;
}

int main()
{
    mapUniformInitialization();
    return 0;
}
```



**Note:** use `std::tuple`, `std::pair`, etc. as the data structure of initial values, and `auto [v1, v2, v3, ...]` as variables to be initialized.



### References

> Definition: Declares a named variable as a reference, that is, **an alias to an already-existing object or function**.

#### Pass by reference vs pass by copy

```cpp
// Pass by reference
void sqr(double& num) {
    num *= num;
}

// Pass by value
double sqr(double num) {
    return num * num;
}
```

##### Reference copy bug

```cpp
##include <iostream>
##include <math.h>
##include <vector>
void shift(std:vector<std:pair<int,int>> &nums) {
    // THIS IS WRONG
    // num1 and num2 are NOT references of each elements in nums
    // thus incrementing num1/2 doesn't nothing to num
	for (auto [numl,num2]:nums) {
		numl++;
		num2++
	}
    
    // THIS IS CORRECT
    for (auto& [numl,num2]:nums) {
		numl++;
		num2++
	}
}
```

### l/r-value

> Formal definition: an l-value refers to an expression that identifies a memory location and can be modified (**if not `const`**)

An **l-value** can be to the left *or* the right of an equal sign!

An **r-value** can be ONLY to the right of an equal sign.

In normal reference, you can only refer to an **l-value**.



For example, consider a function:

```cpp
int sqr(int& num) {
    return std::pow(num, 2);
}
```

then, `sqr(5)` will be erroneous.

- i.e. **error: cannot bind *non-const* l-value reference of type 'int&' to an r-value of type 'int'**



Wait, **non-const**? Well, if we add `const`  qualifiers, will this work?

### `const`

By using `const` qualifier, you can now bind this **const l-value** reference to an **r-value**

Example:

```cpp
std::pair<int, bool> search(const vector<string> &vec, const string& str) {
    for (int i = 0; i != vec.size(); ++i) {
        if (vec[i] == str)
            return make_pair(i, true);
    }
    return make_pair(-1, false);
}
```

Now, you have a method for implementing a search function that is efficient (i.e., it doesn't need to copy the vector) and allows for r-value inputs.



#### Also note

You CANNOT bind **non-const l-value** reference to a **`const` l-value.**

```cpp
int main() {
    const std::vector<int> const_vec{1,2,3};
    // error: binding reference of type ‘std::vector&’ to ‘const std::vector’ discards qualifiers
    std::vector<int>& non_const_vec_ref = const_vec; 
    const std::vector<int>& non_const_vec_ref = const_vec;
}
```

So, in one word, **`const` l-value** and **r-value** have been almost the same in the world of references so far.
