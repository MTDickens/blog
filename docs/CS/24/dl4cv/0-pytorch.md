# Lec 0: PyTorch

## 类型和 shape

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

### 创建张量

创建一个新的张量，一般使用 `full`（填充）、`zeros`（全零）、`ones`（全一）、`rand`（随机）来创建。

如果需要使用另一个张量的形状和/或类型来创建新的张量，那么就可以用

```python
x0 = torch.eye(3, dtype=torch.float64)  # Shape (3, 3), dtype torch.float64
x1 = torch.zeros_like(x0)               # Shape (3, 3), dtype torch.float64 # copy shape and type
x2 = x0.new_zeros(4, 5)                 # Shape (4, 5), dtype torch.float64 # copy type
x3 = torch.ones(6, 7).to(x0)            # Shape (6, 7), dtype torch.float64) # copy type
```

## Slicing

Slicing 的语法就是 `[start:end(:step), ...]`。其中，start 和 end 的值有以下含义

- 空：开始、尾后
- 正数/零：那么就是正常的 index
- 负数：就是 size-index

当然，还有一种特殊形式，就是 `start:end:step` 是一个数字（下面会讲）。

### 降维

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

### 深复制

本质上，slicing 可以和 SQL 里的 view（视窗）、C++ 里的引用进行类比——就是一个 alias。如果改动了视窗、引用，那么原来的数组也会改动。

因此，我们通过 `.clone()` 的方法，得到一个 slicing 的深复制，从而避免互相干扰。
