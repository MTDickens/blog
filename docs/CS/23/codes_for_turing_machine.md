# 图灵机程序

:bulb:注：

1. 请在<a href=https://turingmachine.io/ target="_blank">这个网站</a>测试这些程序。
2. 下面的标题都是语言。标题下方的代码**识别**这种语言。

## $\text{ Check if the string} \in \{0^{2^n}|n \in \mathbb N\}$

```yaml
input: '0'
blank: ' '
start state: q1
table:
  q1:
    [' ','x']: {R: reject}
    0        : {write: ' ', R: q2}
  q2:
    'x'      : {R: q2}
    ' '      : {R: accept}
    0        : {write: 'x', R: q3}
  q3:
    'x'      : {R: q3}
    ' '      : {L: q5}
    0        : {R: q4}  
  q4:
    'x'        : {R: q4}
    ' '      : {R: reject}
    0        : {write: 'x', R: q3}  
  q5:
    [0,'x']  : {L: q5}
    ' '      : {R: q2}
  reject:
  accept:
```

## $\text{Check if string} \in \{\omega \in \{0,1\}^*|\omega \text{ has the same number of 0s and 1s}\}$

```yaml
input: '0001100111'
blank: ' '
start state: qs
table:
  qs:
    [1]      : {write: '#',R: q1}
    [0]      : {write: '#',R: q0}
    [' ']    : {R: accept}    
  qm:
    ['#','x']: {R: qm}
    [1]      : {write: 'x',R: q1}
    [0]      : {write: 'x',R: q0}
    [' ']    : {R: accept}
  q1:
    [' ']      : {R: reject}
    ['#','x',1]: {R: q1}
    [0]        : {write: 'x',L: qb}
  q0:
    [' ']      : {R: reject}
    ['#','x',0]: {R: q0}
    [1]        : {write: 'x',L: qb}
  qb:
    ['x',1,0]: {L: qb}
    ['#']: {R: qm}
  accept:
  reject:
```

# Reverse an 0-1-string of arbitrary length

```yaml
input: '110110'
blank: ' '
start state: init
table:
  init:  # the initial state 
         # also check "end of loop" for even-length strings
    '1': {write: '#', R: 'r1'}
    '0': {write: '#', R: 'r0'}
    ['#', ' ']: {R: done}
    [a]: {write: 1, R: done} # when input has even length
    [b]: {write: 0, R: done} # when input has even length
  r1:  # change a/b to 1/0 if needed, then go la
    ' ': {L: la}
    'a': {write: 1, L: la}
    'b': {write: 0, L: la}
    ['#', 1, 0]: {R: r1}
  r0:  # change a/b to 1/0 if needed, then go lb
    ' ': {L: lb}
    'a': {write: 1, L: lb}
    'b': {write: 0, L: lb}
    ['#', 1, 0]: {R: r0}
  # a stands for 1'
  # b stands for 0'
  la:  # write a, then go lx
       # also check "end of loop" for odd-length strings
    '#': {write: 1, L: done}
    '0': {write: a, L: l0}
    '1': {write: a, L: l1}
    [a, b, ' ']: {R: done} # when input has odd length
  lb:  # write b, then go lx
       # also check "end of loop" for odd-length strings
    '#': {write: 0, L: done}
    '0': {write: b, L: l0}
    '1': {write: b, L: l1}
    [a, b, ' ']: {R: done} # when input has odd length
  l1:  # change # to 1, then go back to init
    '#': {write: 1, R: init}
    [a, b, 1, 0, ' ']: {L: l1}
  l0:  # change # to 0, then go back to init
    '#': {write: 0, R: init}
    [a, b, 1, 0, ' ']: {L: l0}
  done:
```