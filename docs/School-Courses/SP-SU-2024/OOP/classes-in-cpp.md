# C++ 的类

## 构造函数、析构函数顺序

对于一个类而言，构造函数的顺序是：

1. 调用父类的构造函数；
2. 调用成员变量的构造函数；
3. 调用类自身的构造函数

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
         cout << "Parent class area :" <<endl;
         return 0;
      }
      virtual int virtual_area()
      {
         cout << "Parent class area :" <<endl;
         return 0; 
      }
};
class Rectangle: public Shape{
   public:
      Rectangle( int a=0, int b=0):Shape(a, b) { }
      int area ()
      { 
         cout << "Rectangle class area :" <<endl;
         return (width * height); 
      }
      int virtual_area()
      { 
         cout << "Rectangle class area :" <<endl;
         return (width * height); 
      }
};
class Triangle: public Shape{
   public:
      Triangle( int a=0, int b=0):Shape(a, b) { }
      int area ()
      { 
         cout << "Triangle class area :" <<endl;
         return (width * height / 2); 
      }
      int virtual_area()
      { 
         cout << "Triangle class area :" <<endl;
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
shape->area: Parent class area :
shape->virtual_area: Rectangle class area :
shape->area: Parent class area :
shape->virtual_area: Triangle class area :
```

如上，我们可以发现虚函数和一般成员函数并不完全一样。具体地：

> **虚函数** 是在基类中使用关键字 **virtual** 声明的函数。在派生类中重新定义基类中定义的虚函数时，会告诉编译器不要静态链接到该函数。
>
> 我们想要的是在程序中任意点可以根据所调用的对象类型来选择调用的函数，这种操作被称为**动态链接**，或**后期绑定**。

说人话就是：

- 如果基类希望派生类指针使用的成员函数是派生类的而不是基类的话，就要用虚函数。
- 虚函数并不是说基类的函数时虚的，而是告诉编译器，让编译器不要静态绑定，而是要动态绑定。

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

- 具体地，如果采用 `virtual` 进行动态链接，compiler 就会为每一个派生类的变量添加一个 vtable，里面有对应的 virtual_area() 的地址（i.e. 要么是 Rectangle::virtual_area()，要么是 Triangle::virtual_area()）。
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

