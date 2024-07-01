# C++ 的类

## 构造函数、析构函数顺序

对于一个类而言，构造函数的顺序是：

1. 调用父类的构造函数；
    - 默认情况下，调用的是 `ClassOfMyParent()` 这个默认构造函数
    - 如果想使用其它构造函数，可以参考下面的代码    
2. 调用成员变量的构造函数；
    - 默认情况下，调用的是 `ClassOfThisMember()` 这个默认构造函数
    - 如果想使用其它构造函数，可以参考下面的代码    
3. 调用类自身的构造函数

```c++
class A {
public:
    A() = delete;
    A(int i) {
        std::cout << "A(int i)\n";
    }
};

class B : public A {
public:
    // Use A(int i) instead of A(). OK.
    // Use A(int i) for a_in_b. OK.
    B(int i) : A(1), a_in_b(2) {
        std::cout << "B(int i)\n";
    }
private:
    A a_in_b;
};

class C : public A {
public:
    // Error: use A() by default, but A() is deleted
    // Error: use A() for a_in_c by default, but A() is deleted
    C(int i) {
        std::cout << "C(int i)\n";
    }
private:
    A a_in_c;
};
```

---

对于一个类而言，析构函数的顺序是：

1. 调用类自身的析构函数
2. 调用成员变量的析构函数
3. 调用父类的析构函数

## 继承

一个类可以派生自多个类，这意味着，它可以从多个基类继承数据和函数。定义一个派生类，我们使用一个类派生列表来指定基类。类派生列表以一个或多个基类命名，形式如下：

```
class derived-class: access-specifier base-class
```

其中，访问修饰符 access-specifier 是 **public、protected** 或 **private** 其中的一个，base-class 是之前定义过的某个类的名称。如果未使用访问修饰符 access-specifier，则默认为 private。

### 访问控制和继承

派生类可以访问基类中所有的非私有成员。因此基类成员如果不想被派生类的成员函数访问，则应在基类中声明为 private。

我们可以根据访问权限总结出不同的访问类型，如下所示：

| 访问     | public | protected | private |
| :------- | :----- | :-------- | :------ |
| 同一个类 | yes    | yes       | yes     |
| 派生类   | yes    | yes       | no      |
| 外部的类 | yes    | no        | no      |

一个派生类继承了所有的基类方法，但下列情况除外：

- 基类的构造函数、析构函数和拷贝构造函数。
    - i.e. `Base::Base()`, `Base::~Base()`, `Base::Base(const Base &obj)`
- 基类的重载运算符。
    - e.g. `bool Base::operator<(const Base &other)`
- 基类的友元函数。
    - e.g. `friend std::ostream& operator<<(std::ostream& os, const MyClass &obj)`

### 继承类型

当一个类派生自基类，该基类可以被继承为 **public、protected** 或 **private** 几种类型。继承类型是通过上面讲解的访问修饰符 access-specifier 来指定的。

我们几乎不使用 **protected** 或 **private** 继承，通常使用 **public** 继承。当使用不同类型的继承时，遵循以下几个规则：

- **公有继承（public）：**当一个类派生自**公有**基类时，基类的**公有**成员也是派生类的**公有**成员，基类的**保护**成员也是派生类的**保护**成员，基类的**私有**成员不能直接被派生类访问，但是可以通过调用基类的**公有**和**保护**成员来访问。
    - public -> public
    - protected -> protected
    - private -> ​&cross;​
- **保护继承（protected）：** 当一个类派生自**保护**基类时，基类的**公有**和**保护**成员将成为派生类的**保护**成员。
    - public, protected -> protected
    - private -> &cross;
- **私有继承（private）：**当一个类派生自**私有**基类时，基类的**公有**和**保护**成员将成为派生类的**私有**成员。
    - public, protected -> private
    - private -> &cross;

### 多继承

多继承即一个子类可以有多个父类，它继承了多个父类的特性。

C++ 类可以从多个类继承成员，语法如下：

```
class <派生类名>:<继承方式1><基类名1>,<继承方式2><基类名2>,…
{
<派生类类体>
};
```

其中，访问修饰符继承方式是 **public、protected** 或 **private** 其中的一个，用来修饰每个基类，各个基类之间用逗号分隔，如上所示。

## 多态

### 虚函数

话不多说，先举一例：

```cpp
#include <iostream> 
using namespace std;

class Shape {
   protected:
      int width, height;
   public:
      Shape( int a=0, int b=0)
      {
         width = a;
         height = b;
      }
      int area()
      {
         cout << "Parent class, area unknown" <<endl;
         return 0;
      }
      virtual int virtual_area()
      {
         cout << "Parent class, area unknown" <<endl;
         return 0; 
      }
};
class Rectangle: public Shape{
   public:
      Rectangle( int a=0, int b=0):Shape(a, b) { }
      int area ()
      { 
         cout << "Rectangle class area :" << width * height << endl;
         return (width * height); 
      }
      int virtual_area()
      { 
         cout << "Rectangle class area :" << width * height <<endl;
         return (width * height); 
      }
};
class Triangle: public Shape{
   public:
      Triangle( int a=0, int b=0):Shape(a, b) { }
      int area ()
      { 
         cout << "Triangle class area :" << width * height / 2 <<endl;
         return (width * height / 2); 
      }
      int virtual_area()
      { 
         cout << "Triangle class area :" << width * height / 2 <<endl;
         return (width * height / 2); 
      }
};
// 程序的主函数
int main( )
{
   Shape *shape;
   Rectangle rec(10,7);
   Triangle  tri(10,5);

   // 存储矩形的地址
   shape = &rec;
   // 调用矩形的求面积函数 area
   cout << "shape->area: ";
   shape->area();
   cout << "shape->virtual_area: ";
   shape->virtual_area();

   // 存储三角形的地址
   shape = &tri;
   // 调用三角形的求面积函数 area
   cout << "shape->area: ";
   shape->area();
   cout << "shape->virtual_area: ";
   shape->virtual_area();

   return 0;
}
```

输出：

```
shape->area: Parent class, area unknown
shape->virtual_area: Rectangle class area :70
shape->area: Parent class, area unknown
shape->virtual_area: Triangle class area :25
```

如上，我们可以发现虚函数和一般成员函数并不完全一样。具体地：

> **虚函数** 是在基类中使用关键字 **virtual** 声明的函数。在派生类中重新定义基类中定义的虚函数时，会告诉编译器不要静态链接到该函数。
>
> 我们想要的是在程序中任意点可以根据所调用的对象类型来选择调用的函数，这种操作被称为**动态链接**，或**后期绑定**。

说人话就是：

- 如果希望**在基类引用派生类对象，或者基类指针指向派生类对象的情况下**，**区分**派生类中和基类**同名的方法函数**，需要将基类的成员函数类型声明为 virtual 
    - 显然，**析构函数必须是 virtual**，否则会出大问题
    - 同时，构造函数**不能**是虚函数（C++ 语法规定）
- 虚函数并不是说基类的函数时虚的，而是告诉编译器，让编译器不要静态绑定，而是要动态绑定。
    - 静态绑定：编译器判断指针类型，然后在该语句位置，使用汇编调用**你的类型对应的**函数
    - 动态绑定：编译器在每一次指针赋值的时候，都会将该指针指向对象的对应位置

---

另外，如果直接从底层入手，在 RISC-V 汇编中：

```assembly
# area(): static
        lw      a0,-20(s0)
        call    Shape::area() # static
# virtual_area(): dynamic
        lw      a5,-20(s0)
        lw      a5,0(a5)
        lw      a5,0(a5)
        lw      a0,-20(s0)
        jalr    a5
```

可见动态链接（下面）和静态链接（上面）的区别。

- 具体地，如果采用 `virtual` 进行动态链接，compiler 就会为每一个派生类的变量添加一个 vtable，里面有对应的 `virtual_area()` 的地址（i.e. 要么是 `Rectangle::virtual_area()`，要么是 `Triangle::virtual_area()`）。
    - 寻址的时候，就是通过上面 `lw` 进行寻址。

### 纯虚函数

至于纯虚函数，才是真正的所谓“接口”。

```cpp
class Shape {
   protected:
      int width, height;
   public:
      Shape( int a=0, int b=0)
      {
         width = a;
         height = b;
      }
      // pure virtual function
      virtual int area() = 0;
};
```

## 一个有趣的例子

~~（同时也是作业题）~~

```c++
#include <iostream>
using namespace std;

class A
{
public:
  A(int i) : mi(i) {}
  A(const A& rhs) : mi(rhs.mi)
  {
    cout << "A::A(&)" << endl;
  }
  A& operator=(const A&rhs)
  {
    mi = rhs.mi;
    cout << "A::operator=()" << endl;
    return *this;
  }
  virtual void f()
  {
    cout << "A::f(), " << mi << endl;
  }
protected:
  int mi;
};

class B : public A
{
public:
  B(int i, int j) : A(i), mj(j) {}
  void f() override
  {
    cout << "B::f(), " << mi << ", " << mj << endl;
  }
private:
  int mj;
};

int main()
{
  A a1(1);
  B b(3,4);

  A& ra = b;	// 1
  ra.f();		// 2
  ra = a1;		// 3		
  ra.f();		// 4

  A a2 = b;		// 5
  a2.f();		// 6
}
```

首先，`a1` 和 `b` 初始化，分别调用自身的构造函数。

- 其中，`B::B(i, j)` 还调用了 `A::A(i)`，也就是选择使用 `A::A(i)`，而不是 `A::A()`

接下来，我们逐行分析：

1. 就是一个父类引用子类，本质上 `ra` 就是 `b` 的一个别名，因此没有任何行为
    - 实际上，在汇编代码中，也没有任何行为
2. 就是 `b` 调用 `f()`。由于 `class B` 已经 `override` 了 `f()`，因此调用的就是 `B::f()`
    - **输出：**`B::f(), 3, 4`
3. 就是 `b` 调用 `operator=()`。由于 `class B` 本身没有 `operator=`，因此使用继承自 `A` 的，也就是 `A::operator=()`
    - **输出：**`A::operator=()`
    - 同时将 `b.mi` 赋值为 `a1.mi`，也就是 1
4. 同 (2)
    - **输出：**`B::f(), 1, 4`
5. 就是 `a2` 执行构造函数 `A::A(const A&rhs)`
    - **输出：**`A:A(&)`
    - 同时将 `a2.mi` 赋值为 `b.mi`
6. 就是 `a2` 调用 `f()`。自然是调用 `A::f()`
    - **输出：**`A::f(), 1`

## 其他知识点

### 成员函数的 const 修饰符

成员函数本身默认有一个参数，就是 `this`。对于显式的参数，我们可以显式地加上约束，如 `int List::operator[](int index)`；但是对于隐式的 `this`，如何加约束呢？这就要用到成员函数的 `const` 修饰符。这个 `const` 可以让 `*this` 不仅是一个顶层 const（i.e. 指针指向的地址不能变，所有的 `this` 都这样），而且还是底层 const（i.e. 指针指向的地址的值是常量）。

e.g. 

```cpp
int& List::operator[](int index) const {
    // 虽然 *this 是 const，但是这只是说明 this->val 是一个顶层 const
    // 而 this->val 指向的值并不是 const
    // 因此你可以返回一个非常量引用
    return this->val[index];
}

// Equivalent function
int& at(const List * _this, int index) {
    return _this->val[index];
}
```