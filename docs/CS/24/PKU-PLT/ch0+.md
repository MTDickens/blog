# Chapter 0+: OCaml

## 函数

OCaml 的函数也很简单，比如：

```ocaml
let sumsq_curried (x:int) (y:int) = x * x + y * y;;

let sumsq_uncurried ((x, y): int * int) = x * x + y * y;;

let currying2 (f: 'a -> 'b -> 'c) (x: 'a) (y: 'b) = f x y;;

let uncurrying2 (f: 'a * 'b -> 'c) ((x, y): 'a * 'b) = f (x, y);;

```

注意：对于递归函数，我们需要显式地写出。如下所示：

```ocaml
let rec factorial (x: int) = if x < 0 then -1 else (if x == 0 then 1 else x * (factorial (x - 1)))
```

- 因为，OCaml 默认 the name of function is invisible in the scope of its own body.

## 模式匹配

```ocaml
let rec listSum (l: int list) = 
	match l with
	  [] -> 0
	 |(x :: y) -> x + listSum y
```

---

更加复杂度例子，考虑我们希望将 `string` 转换成 `char list list`，同时不希望任何空列表出现在我们的程序中：

```ocaml
let rec string_to_char_list (s: string) =
  match s with
  | "" -> []
  | x -> (String.get x 0) :: (string_to_char_list (String.sub x 1 ((String.length x) - 1)))
  
let rec split_char_list l = 
  let rec loop (w: char list) l: char list list = 
    match w, l with
    | [], []      -> [] (* When w is of [], we don't add w to the list*)
    | _, []       -> w::[]
    | [], ' '::xs -> loop [] (xs) (* When w is of [], we don't add w to the list*)
    | _, ' '::xs  -> w::(loop [] xs)
    | _, x::xs    -> loop (w@[x]) xs
  in loop [] l
      

(* "Haiyaa!  Uncle Roger disappointed~" -> 
 [['H'; 'a'; 'i'; 'y'; 'a'; 'a'; '!']; ['U'; 'n'; 'c'; 'l'; 'e'];
 ['R'; 'o'; 'g'; 'e'; 'r'];
 ['d'; 'i'; 's'; 'a'; 'p'; 'p'; 'o'; 'i'; 'n'; 't'; 'e'; 'd'; '~']] *)
let split_string (s: string) = split_char_list(string_to_char_list s)
```

## 自定义数据类型

```ocaml
type ast =
  ANum of int
  | APlus of ast * ast
  | AMinus of ast * ast
  | ATimes of ast * ast ;;
```

对应着 Haskell 的

```haskell
type AST =
  ANum Int
  | APlus AST AST
  | AMinus AST AST
  | ATimes AST AST
```

---

从而，我们可以写一个 evaluator:

```ocaml
let eval (a: ast) =
  match a with
  | ANum n -> n
  | APlus x y -> (eval x) + (eval y)
  | AMinus x y -> (eval x) - (eval y)
  | ATimes x y -> (eval x) * (eval y);;
```

对应着 Haskell 的

```Haskell
eval :: AST -> Int
eval (ANum n)     = n
eval (APlus x y)  = (eval x) + (eval y)
eval (AMinus x y) = (eval x) - (eval y)
eval (ATimes x y) = (eval x) * (eval y)
```

## `unit` type

`()` 就是 unit type。在函数式编程语言中，unit type 如果用于返回值，那么一般而言，就是一个副作用函数

- Haskell 的 I/O Monad 就是 `()`

如果用于参数，那么

- 可能是一个耗时的计算，比如：`let f () = <long and complex calculation>;;`

- 可能是 finalization code，如下。

```ocaml
let read file =
  let chan = open_in file in
  try
    let nbytes = in_channel_length chan in
        let string = String.create nbytes in
            really_input chan string 0 nbytes;
            close_in chan;
        string
  with exn ->
    (* finalize channel *)
        close_in chan;
    (* re-raise exception *)
    raise exn;;
```

我们希望，即使出现了 exception，finalization code 也可以正常执行。

我们可以简化为：

```ocaml
let read file =
  let chan = open_in file in
  (* finalization code *)
  let finalize () = close_in chan in
  try
    let nbytes = in_channel_length chan in
      let string = String.create nbytes in
        really_input chan string 0 nbytes;
        finalize()
      string
  with exn ->
    (* finalize channel *)
    finalize ();
    (* re-raise exception *)
    raise exn;;
```

也就是：

```ocaml
let unwind_protect body finalize =
  try
  let res = body() in
  	finalize();
  	res
  with exn ->
  	finalize();
  	raise exn;;
 
let read file =
  let chan = open_in file in
  unwind_protect
  (fun () ->
  	let nbytes = in_channel_length chan in
  	  let string = Bytes.create nbytes in
  	    really_input chan string 0 nbytes;
  	  string)
  (fun () -> close_in chan);;
```

## Reference Cell

```ocaml
let fact n =
  let result = ref 1 in
    for i = 2 to n do
      result := i * !result
    done;
  !result;;
```

如上，

- `:= : int -> ref int -> unit`
- `! : ref int -> int`
- `for ... do ... done; : unit`

如果没有 ref，那么，`in` 后面就是一个函数，不可能对 result 造成影响。

而有了 ref，那么，result 就成了一个“内存地址”，中间的函数就相当于“传引用”，因此 result 指向的地址的值可以被改变。
