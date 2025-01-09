## Lec 0: PyTorch

### 类型和 shape

shape 就是张量的形状。从外到内，比如：

```python
[[[1,1],[1,1],[1,1]],
 [[1,1],[1,1],[1,1]],
 [[1,1],[1,1],[1,1]],
 [[1,1],[1,1],[1,1]]]
```

最外面，它有四个列；每一个列内，又有三个列；再每一个列内，又有两个数。因此，shape 就是 `torch.Size([4,3,2])`

类型的话，pytorch 主要是 float 和 int，其中 int 内又分普通 int 和 uint（unsigned int）。float 和 (u)int 后面都带一个数字，代表宽度。比如 `torch.float64`, `torch.uint32` 等等。

我们建立张量的时候，可以让 pytorch 自动推断类型，也可以自己指明类型。

#### 创建张量

创建一个新的张量，一般使用 `full`（填充）、`zeros`（全零）、`ones`（全一）、`rand`（随机）来创建。

如果需要使用另一个张量的形状和/或类型来创建新的张量，那么就可以用

```python
x0 = torch.eye(3, dtype=torch.float64)  # Shape (3, 3), dtype torch.float64
x1 = torch.zeros_like(x0)               # Shape (3, 3), dtype torch.float64 # copy shape and type
x2 = x0.new_zeros(4, 5)                 # Shape (4, 5), dtype torch.float64 # copy type
x3 = torch.ones(6, 7).to(x0)            # Shape (6, 7), dtype torch.float64) # copy type
```

### Slicing

Slicing 的语法就是 `[start:end(:step), ...]`。其中，start 和 end 的值有以下含义

- 空：开始、尾后
- 正数/零：那么就是正常的 index
- 负数：就是 size-index

当然，还有一种特殊形式，就是 `start:end:step` 是一个数字（下面会讲）。

#### 降维

如果其中一个 `start:end:step` 就是一个数字，那么就会降维；如果采用了 length-one slice，那么就不会降维，比如：

```python
>>> ts = tc.tensor([[1,2,3],[4,5,6]])
tensor([[1, 2, 3],
        [4, 5, 6]])


>>> ts[:,0:1]  # 0:1 is length-one slice
tensor([[1],
        [4]])
>>> ts[:,0]    # 0 is a number
tensor([1, 4])


>>> ts[0:1,:]  # 0:1 is length-one slice
tensor([[1, 2, 3]])
>>> ts[0,:]    # 0 is a number
tensor([1, 2, 3])
```

#### 深复制

本质上，slicing 可以和 SQL 里的 view（视窗）、C++ 里的引用进行类比——就是一个 alias。如果改动了视窗、引用，那么原来的数组也会改动。

因此，我们通过 `.clone()` 的方法，得到一个 slicing 的深复制，从而避免互相干扰。

#### Integer Slicing

除了经典的 `start:end:step` 方式指定，我们还可以直接通过列表来指定。

比如，`a[1:8:3, :]` 就相当于 `a[ [1,4,7], :]`

例子：

```python
import pytorch as torch
## Create the following rank 2 tensor with shape (3, 4)
## [[ 1  2  3  4]
##  [ 5  6  7  8]
##  [ 9 10 11 12]]
a = torch.tensor([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
print('Original tensor:')
print(a)

## Create a new tensor of shape (5, 4) by reordering rows from a:
## - First two rows same as the first row of a
## - Third row is the same as the last row of a
## - Fourth and fifth rows are the same as the second row from a
idx = [0, 0, -1, 1, 1]  # index arrays can be Python lists of integers
print('\nReordered rows:')
print(a[idx])

## Create a new tensor of shape (3, 4) by reversing the columns from a
idx = torch.tensor([3, 2, 1, 0])  # Index arrays can be int64 torch tensors
print('\nReordered columns:')
print(a[:, idx])
```

结果

```
Original tensor:
tensor([[ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12]])

Reordered rows:
tensor([[ 1,  2,  3,  4],
        [ 1,  2,  3,  4],
        [ 9, 10, 11, 12],
        [ 5,  6,  7,  8],
        [ 5,  6,  7,  8]])

Reordered columns:
tensor([[ 4,  3,  2,  1],
        [ 8,  7,  6,  5],
        [12, 11, 10,  9]])
```

---

如果指定了多个列表，那么，就可以有更高级的操作。

比如：`a[ [0,1,2], [1,2,3] ]` 就是

- 首先，选取表格中的第 0,1,2 行
- 然后，在新的表格中，从第 0 行选取第 1 列，从第 1 行选取第 2 列，从第 2 行选取第 3 列。也就是次对角线。

#### Boolean Slicing

1. 首先通过 `predicate(a)` 来获取一个 mask
2. 然后通过 `a[mask]` 来得到一个一维数组
3. 之后，我们可以输出或者进一步处理这个一维数组

```python
a = torch.tensor([[1,2], [3, 4], [5, 6]])
print('Original tensor:')
print(a)

## Find the elements of a that are bigger than 3. The mask has the same shape as
## a, where each element of mask tells whether the corresponding element of a
## is greater than three.
mask = (a > 3)
print('\nMask tensor:')
print(mask)

## We can use the mask to construct a rank-1 tensor containing the elements of a
## that are selected by the mask
print('\nSelecting elements with the mask:')
print(a[mask])

## We can also use boolean masks to modify tensors; for example this sets all
## elements <= 3 to zero:
a[a <= 3] = 0
print('\nAfter modifying with a mask:')
print(a)
```

结果：

```
Original tensor:
tensor([[1, 2],
        [3, 4],
        [5, 6]])

Mask tensor:
tensor([[False, False],
        [False,  True],
        [ True,  True]])

Selecting elements with the mask:
tensor([4, 5, 6])

After modifying with a mask:
tensor([[0, 0],
        [0, 4],
        [5, 6]])
```

### Reshaping

#### Flattened-Order-Preserving Reshaping

通过 `view()`，我们可以去 reshape 一个 tensor，同时**保证两个 tensor 在一维展开 (flattened) 之后，完全相同**。

- 如果将 view 的某个 axis 设置为 `-1`，那么就相当于让程序自动推断这个 axis 的大小。至多只能设置一个 `-1`

#### Transpose

转置一个 tensor，会使得它和原 tensor 在一维展开之后，表示不同。因此，不能通过上述的 `view()` 来转置，而要通过专门的 `torch.t(a)` 或者 `a.t()`来进行。

#### Geometric-Order-Preserving Reshaping

更一般地，转置本身就是 **axes swapping**。而 **axes swapping** 又是 **axes mutation** 的特例。

而 **axes mutation**，可以认为就是把一个高维“长方体”的不同方向之间的编号变换了一下。因此，这种转变是保持了抽象的、几何上的 order 不变，而非展开后的一维数组不变。

如下：

```python
## Create a tensor of shape (2, 3, 4)
x0 = torch.tensor([
     [[1,  2,  3,  4],
      [5,  6,  7,  8],
      [9, 10, 11, 12]],
     [[13, 14, 15, 16],
      [17, 18, 19, 20],
      [21, 22, 23, 24]]])
print('Original tensor:')
print(x0)
print('shape:', x0.shape)

## Swap axes 1 and 2; shape is (2, 4, 3)
x1 = x0.transpose(1, 2)
print('\nSwap axes 1 and 2:')
print(x1)
print(x1.shape)

## Permute axes; the argument (1, 2, 0) means:
## - Make the old dimension 1 appear at dimension 0;
## - Make the old dimension 2 appear at dimension 1;
## - Make the old dimension 0 appear at dimension 2
## This results in a tensor of shape (3, 4, 2)
x2 = x0.permute(1, 2, 0)
print('\nPermute axes')
print(x2)
print('shape:', x2.shape)
```

结果：

```
Original tensor:
tensor([[[ 1,  2,  3,  4],
         [ 5,  6,  7,  8],
         [ 9, 10, 11, 12]],

        [[13, 14, 15, 16],
         [17, 18, 19, 20],
         [21, 22, 23, 24]]])
shape: torch.Size([2, 3, 4])

Swap axes 1 and 2:
tensor([[[ 1,  5,  9],
         [ 2,  6, 10],
         [ 3,  7, 11],
         [ 4,  8, 12]],

        [[13, 17, 21],
         [14, 18, 22],
         [15, 19, 23],
         [16, 20, 24]]])
torch.Size([2, 4, 3])

Permute axes
tensor([[[ 1, 13],
         [ 2, 14],
         [ 3, 15],
         [ 4, 16]],

        [[ 5, 17],
         [ 6, 18],
         [ 7, 19],
         [ 8, 20]],

        [[ 9, 21],
         [10, 22],
         [11, 23],
         [12, 24]]])
shape: torch.Size([3, 4, 2])
```

#### Contiguous Errors

Some combinations of reshaping operations will fail with cryptic errors. The exact reasons for this have to do with the way that tensors and views of tensors are implemented, and are beyond the scope of this assignment. However if you're curious, [this blog post by Edward Yang](http://blog.ezyang.com/2019/05/pytorch-internals/) gives a clear explanation of the problem.

What you need to know is that you can typically overcome these sorts of errors by either by calling [`.contiguous()`](https://pytorch.org/docs/stable/generated/torch.Tensor.contiguous.html) before `.view()`, or by using [`.reshape()`](https://pytorch.org/docs/stable/generated/torch.reshape.html) instead of `.view()`.

```python
x0 = torch.randn(2, 3, 4)

try:
  # This sequence of reshape operations will crash
  x1 = x0.transpose(1, 2).view(8, 3)
except RuntimeError as e:
  print(type(e), e)

## We can solve the problem using either .contiguous() or .reshape()
x1 = x0.transpose(1, 2).contiguous().view(8, 3)
x2 = x0.transpose(1, 2).reshape(8, 3)
print('x1 shape: ', x1.shape)
print('x2 shape: ', x2.shape)
```

Result:

```
<class 'RuntimeError'> view size is not compatible with input tensor's size and stride (at least one dimension spans across two contiguous subspaces). Use .reshape(...) instead.
x1 shape:  torch.Size([8, 3])
x2 shape:  torch.Size([8, 3])
```

### Element-wise Arithmetics

使用 `torch` 的 `add, sub, mul, div, pow` 或者直接使用 `+, -, *, /, **` 即可。

### Reduction

我们可以对一个 axis 做 reduction。

可以理解为：我们把高维的这个立方体的对应的 axis “压扁”。

```python
## Create a tensor of shape (128, 10, 3, 64, 64)
x = torch.randn(128, 10, 3, 64, 64)
print(x.shape)

## Take the mean over dimension 1; shape is now (128, 3, 64, 64)
x = x.mean(dim=1)
print(x.shape)

## Take the sum over dimension 2; shape is now (128, 3, 64)
x = x.sum(dim=2)
print(x.shape)

## Take the mean over dimension 1, but keep the dimension from being eliminated
## by passing keepdim=True; shape is now (128, 1, 64)
x = x.mean(dim=1, keepdim=True)
print(x.shape)
```

Result:

```
torch.Size([128, 10, 3, 64, 64])
torch.Size([128, 3, 64, 64])
torch.Size([128, 3, 64])
torch.Size([128, 1, 64])
```

- 如果 `keepdim=False`（默认），那么这一个被“压扁”的 axis 就会自动剔除
- 如果 `keepdim=True`，那么这一个被“压扁”的 axis 就会保留成大小为 1 的 axis

### Matrix Multiplication

可以用

- `dot` 进行向量点乘
- `mm` 进行矩阵乘（或者可以用 `a @ b`）
    - `addmm` 可以再添加一个 bias
- `mv` 进行向量和矩阵乘
- `bmm` 进行 batch matrix multiplication
    - `baddmm` 可以再添加一个 bias
- `matmul` 进行各种乘（根据 rank 的不同，进行不同的乘法）。

另外，使用 `stack` 可以将 a list of dim-n tensors 变成 a dim-(n+1) tensor。

### Broadcasting

**Broadcasting** is a powerful mechanism that **allows PyTorch to work with arrays of different shapes** when performing arithmetic operations. Frequently we have a smaller tensor and a larger tensor, and we want to use the smaller tensor multiple times to perform some operation on the larger tensor.

#### 工作流程

1. 将 shape 较小的 tensor 的 shape 左侧填充 1
    - e.g. `x.shape = [1,2,3], y.shape = [3]`, then before broadcasting, the rank of y will be padded to `[1,1,3]`
2. 检查 compatibility: 对于 shape 的每一项，如果两者的值相等或者两者的值有一个为 1，那么就算 compatible
3. 将每一个“两者的值有一个为 1”的 axis 中，值为 1 的 tensor 复制
4. 执行 element-wise arithmetics

#### Example

```python
import torch as tc

a = tc.tensor([1, 9, 1, 9])
b = tc.tensor([8, 1, 0])

transformed_a, transformed_b = tc.broadcast_tensors(a.view(-1,1), b)

outer_prod_implicit = a.view(-1,1) * b
outer_prod_explicit = transformed_a * transformed_b

print(f"a, b: {a, b}")
print(f"transformed_a:\n {transformed_a}")
print(f"transformed_b:\n {transformed_b}")
print(f"outer_prod_implicit:\n {outer_prod_implicit}")
print(f"outer_prod_explicit:\n {outer_prod_explicit}")

"""
a.view(-1, 1).shape = [4, 1]
b.shape             = [3]

Thus, b will be padded to [1, 3]

a.view(-1, 1) = [ [1],
				  [9], 
				  [1],
				  [9] ]

b			  = [ [8, 1, 0] ]

transformed_a = [ [1, 1, 1],
				  [9, 9, 9],
				  [1, 1, 1],
				  [9, 9, 9] ]
				  
transformed_b = [ [8, 1, 0],
				  [8, 1, 0],
				  [8, 1, 0],
				  [8, 1, 0] ]
				  
a * b = 
transformed_a * transformed_b = 
[ [ 8,  1,  0],
  [72,  9,  0],
  [ 8,  1,  0],
  [72,  9,  0] ]
"""
```

### In-Place and Out-of-Place Operators

Out-of-place operators (e.g. `add()`) are like **functional programming** (doesn't change the value/state of the operands involved), and in-place ones (e.g. `add_()` or `add(.., .., out-x)`) are like **OOP** (does change the value/state of the operands involved)

Examples:

```python
## Out-of-place addition creates and returns a new tensor without modifying the inputs:
x = torch.tensor([1, 2, 3])
y = torch.tensor([3, 4, 5])
print('Out-of-place addition:')
print('Before addition:')
print('x: ', x)
print('y: ', y)
z = x.add(y)  # Same as z = x + y or z = torch.add(x, y)
print('\nAfter addition (x and y unchanged):')
print('x: ', x)
print('y: ', y)
print('z: ', z)
print('z is x: ', z is x)
print('z is y: ', z is y)

## In-place addition modifies the input tensor:
print('\n\nIn-place Addition:')
print('Before addition:')
print('x: ', x)
print('y: ', y)
z = x.add_(y)  # Same as x += y or torch.add(x, y, out=x)
print('\nAfter addition (x is modified):')
print('x: ', x)
print('y: ', y)
print('z: ', z)
print('z is x: ', z is x)
print('z is y: ', z is y)
```

Results:

```
Out-of-place addition:
Before addition:
x:  tensor([1, 2, 3])
y:  tensor([3, 4, 5])

After addition (x and y unchanged):
x:  tensor([1, 2, 3])
y:  tensor([3, 4, 5])
z:  tensor([4, 6, 8])
z is x:  False
z is y:  False


In-place Addition:
Before addition:
x:  tensor([1, 2, 3])
y:  tensor([3, 4, 5])

After addition (x is modified):
x:  tensor([4, 6, 8])
y:  tensor([3, 4, 5])
z:  tensor([4, 6, 8])
z is x:  True
z is y:  False
```

### GPU Acceleration

