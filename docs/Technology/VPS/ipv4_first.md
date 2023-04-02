# 设置 VPS ipv4 优先的方法

首先我先说下这问题会出现在什么情况下。

假设我一台ipv6 only的机器，然后这时候我想获得个ipv4地址来访问ipv4站点，那么一般我们的解决方法是使用cloudflare推出的warp来解决这个问题。

那么同时ipv4问题我们解决了。那么接着假设，我现在需要用这台机器来看netflix或者访问其他内容提供商ban掉我们原有的asn的需求。

那么这时候我们需要让系统的路由优先使用ipv4而不是ipv6。

那么可以通过如下来实现，修改 /etc/gai.conf 文件。

- debian系：修改/etc/gai.conf，取消下面这一行的注释

  `precedence ::ffff:0:0/96 100`

- redhat系：修改/etc/gai.conf，添加如下内容

  ```css
  label       ::1/128        0
  label       ::/0           1
  label       2002::/16      2
  label       ::/96          3
  label       ::ffff:0:0/96  4
  precedence  ::1/128        50
  precedence  ::/0           40
  precedence  2002::/16      30
  precedence  ::/96          20
  precedence  ::ffff:0:0/96  100
  ```

保存即可生效。那么这个时候系统会优先走ipv4了。

??? note "另附：优先走 ipv6 代码"
    ```
    label  ::1/128       0
    label  ::/0          1
    label  2002::/16     2
    label  fd01::/16     1
    label ::/96          3
    label ::ffff:0:0/96  4
    precedence  ::1/128       50
    precedence  ::/0          40
    precedence  fd01::/16     40
    precedence  2002::/16     30
    precedence ::/96          20
    precedence ::ffff:0:0/96  10
    ```

---

但是当我们使用v2ray以后发现这个改动并没有生效。那这里就需要修改一下v2ray的配置文件了。

找到你的配置文件，打开，然后找到其中的outbounds标签。

里面有类似下面的代码

```
{
"protocol": "freedom",
"settings": {
}
},
```

将其修改成

```
{
"sendThrough": "0.0.0.0",
"protocol": "freedom",
"settings": { 
"domainStrategy": "UseIP"
  }
},
```

更多参数可查看官方说明。https://www.v2ray.com/chapter_02/01_overview.html#outboundobject

然后保存即可。重启你的v2ray，这时候测试下有没有生效。

https://ipv6-test.com