# Clash 订阅转换

第一次正经用 Clash，因为有分流 YouTube（不看重延时）、AI 工具（很多 AI 都屏蔽了港澳）的需求。使用了好几种方法，试图来代替原订阅，后来还是算了，trade anonymity for convenience 得了，就用公共订阅转换吧。

开局一张图，其余就不写了 :stuck_out_tongue_closed_eyes:

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403171612178.png" alt="image-20240317161203465" style="zoom: 33%;" />

如图，这种配置很适合于 Clash Verge Rev。因为里面不仅区分了 YouTube 和其它国外媒体，而且还增加了 OpenAI 分流。

**注意：**

1. 我选择包含 x0. 的节点，是为了过滤掉倍率太大的节点。
2. 排除除了 `_US_.*@mtdic` 以外的 `_US_` 节点，是为了使用美国节点的时候，只用我自建的节点

### 使用 Merge 配置添加规则

同时，如果你还希望将 Google Gemini 也分流，可以

1. 添加 merge 配置文件
    - 注意 merge 配置文件相当于一个“修饰符”，用于修饰你的订阅（i.e. 原配置文件），而不是代替你的订阅
2. 将 merge 配置文件里面加入代码（我贴在后面了）
3. 右键你刚刚新建的 merge，点击启用

代码：

```yaml
# Merge Template for clash verge
# The `Merge` format used to enhance profile

prepend-rules:
  - DOMAIN-SUFFIX,gemini.google.com,💬 OpenAi
prepend-rule-providers:

prepend-proxies:

prepend-proxy-providers:

prepend-proxy-groups:

append-rules:

append-rule-providers:

append-proxies:

append-proxy-providers:

append-proxy-groups:

```

