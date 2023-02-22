# 图灵机程序

:bulb:注：

1. 请在<a href=https://turingmachine.io/ target="_blank">这个网站</a>测试这些程序。
2. 下面的标题都是语言。标题下方的代码**识别**这种语言。


## $\{0^{2^n}|n \in \mathbb N\}$

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

## $\{\omega|\text{The number of 0s and 1s are the same in }\omega\}$

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
