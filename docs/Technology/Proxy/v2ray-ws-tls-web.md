# V2Ray+WS+TLS+WEB+... 全解析

## V2Ray 服务端配置

> 配置文件位于：/etc/v2ray/config.json

- inbounds 配置
  ```json
  "inbounds": [
    {
      "port": 62470, // 端口必须和之后的 Nginx 配置文件上的端口一致
      "listen": "127.0.0.1", // 限制只 listen 内网 ip，避免被外界访问
      "protocol": "vmess", // 可以用传统的 vmess，也可以用新兴的 vless
      "settings": {
        "clients": [
          {
            "id": "687c31c2-6ca7-11ee-b962-0242ac120002", // uuid，自己去 https://www.uuidgenerator.net/ 随机生成一个
            "level": 1,
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network": "ws", // 使用 websocket
        // 同时注意：V2Ray 服务端不需要配置 tls。我们之后在 Nginx 上配置 tls。
        "wsSettings": {
          "path": "/mtdickens", // WebSocket 所使用的 HTTP 协议路径。注意服务端与客户端保持一致。
          "headers": { // V2Ray 接受的 header。注意服务端与客户端保持一致。
            "Host": "xxx.mtds.eu.org" // 我们这里只设置了 "Host" 这一项。
          }
        }
      }
    }
  ]
  ```

- routing 配置
  ```json
  "routing": {
    "domainStrategy": "AsIs", // 我们如何处理转发到这里的数据中的域名呢？
      // 简单来说：
      // AsIs=DomainOnly, IPIfNonMatch=PreferDomain, IPOnDemand=PreferIP
      // （具体解释见代码后面的注解）
    "rules": [
      // 规则一：洋葱域名转 tor
      {
        "type": "field",
        "domain": [
          "regexp:\\.onion$"
        ],
        "outboundTag": "tor"
      },
      // 规则二：bt 下载的禁止
      {
        "type": "field",
        "protocol": [
          "bittorrent"
        ],
        "outboundTag": "block"
      },
      // 规则三：Netflix, OpenAI 和 Disney+ 走 Cloudflare Warp
      {
        "type": "field",
        "domain": [
          "geosite:netflix",
          "geosite:openai",
          "geosite:disney"
        ],
        "outboundTag": "wireguard"
      }
    ]
  }
  ```

  - 注解
    - `domainStrategy`
      - `"AsIs"`: **只使用域名**进行路由选择。默认值。
      - `"IPIfNonMatch"`: **当域名没有匹配任何规则时，将域名解析成 IP**（A 记录或 AAAA 记录）再次进行匹配；
        - 当一个域名有多个 A 记录时，会尝试匹配所有的 A 记录，直到其中一个与某个规则匹配为止；
        - 解析后的 IP 仅在路由选择时起作用，转发的数据包中依然使用原始域名；
      - `"IPOnDemand"`: 当**匹配时碰到任何基于 IP 的规则**，将域名立即解析为 IP 进行匹配；
    - 对于所有的 geosite，详见 [All geosite data](https://github.com/v2fly/domain-list-community/tree/master/data)

- outbounds 配置：

  ```json
  "outbounds": [
    { // 默认（i.e. 没有匹配上任何域名分流规则）走 freedom
      "protocol": "freedom",
      "settings": {}
    },
    { // bt 下载的禁止
      "protocol": "blackhole",
      "settings": {},
      "tag": "blocked"
    },
    { // tor 服务默认运行在 socks://127.0.0.1:9050 上
      "protocol": "socks",
      "settings": {
        "servers": [
          {
            "address": "127.0.0.1",
            "port": 9050
          }
        ]
      },
      "tag": "tor"
    },
    { // 可以用 fcarsman 的 warp 一键脚本
      // 用 Wireproxy+warp，在 socks://127.0.0.1:40000（端口任选）上运行 warp 服务
      "protocol": "socks",
      "settings": {
        "servers": [
          {
            "address": "127.0.0.1",
            "port": 40000
          }
        ]
      },
      "tag": "wireguard"
    }
  ]
  ```

  - 注解

    - warp 一键脚本详见[Gitlab](https://gitlab.com/fscarmen/warp)

      - tl;dr 
        - 首次运行：`wget -N https://gitlab.com/fscarmen/warp/-/raw/main/menu.sh && bash menu.sh`
        - 之后运行：`warp menu`（上面的程序已经将 warp 程序放到了 `/usr/bin` 里）

    - tor 配置详见[新 V2Ray 白话文指南](https://guide.v2fly.org/advanced/tor.html#%E5%AE%89%E8%A3%85-tor-%E8%BD%AF%E4%BB%B6)

      - tl;dr

        - ```bash
          apt install tor
          systemctl enable tor --now
          ```

## Nginx 配置

- 总配置：`/etc/nginx/nginx.conf`

  ```nginx
  user www-data;
  worker_processes auto;
  error_log /var/log/nginx/error.log;
  pid /run/nginx.pid;
  
  # Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
  include /usr/share/nginx/modules/*.conf;
  
  events {
      worker_connections 1024;
  }
  
  http {
      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';
  
      access_log  /var/log/nginx/access.log  main;
      server_tokens off;
  
      sendfile            on;
      tcp_nopush          on;
      tcp_nodelay         on;
      keepalive_timeout   65;
      types_hash_max_size 2048;
      gzip                on;
  
      include             /etc/nginx/mime.types;
      default_type        application/octet-stream;
  
      # Load modular configuration files from the /etc/nginx/conf.d directory.
      # See http://nginx.org/en/docs/ngx_core_module.html#include
      # for more information.
      include /etc/nginx/conf.d/*.conf;
  }
  ```

- 单独网站配置：`/etc/nginx/conf.d/xxx.mtds.eu.conf`

  ```nginx
  server {
      listen 80;
      listen [::]:80;
      server_name xxx.mtds.eu.org;
      return 301 https://$server_name:443$request_uri; ## 跳转至 443 端口
  }
  
  server {
      listen       443 ssl http2;
      listen       [::]:443 ssl http2;
      server_name xxx.mtds.eu.org;
      charset utf-8;
  
      # ssl配置（强制 tls）
      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
      ssl_prefer_server_ciphers on;
      ssl_session_cache builtin:1000 shared:SSL:10m;
      ssl_session_timeout 10m;
      ssl_buffer_size 1400;
      ssl_stapling on;
      ssl_stapling_verify on;
      ssl_session_tickets off;
      ssl_certificate /etc/v2ray/lax.mtds.eu.org.pem;
      ssl_certificate_key /etc/v2ray/lax.mtds.eu.org.key;
  
      root /usr/share/nginx/html;
      location / {
          proxy_ssl_server_name on;
          proxy_pass https://www.wallpaperstock.net;
          proxy_set_header Accept-Encoding '';
          sub_filter "www.wallpaperstock.net" "xxx.mtds.eu.org";
          sub_filter_once off;
      }
      
  	## 注意：此处的 location 必须与 V2Ray 配置文件的 path 相符合
      location /mtdickens {
        proxy_redirect off;
        ## 注意：此处的 proxy_pass 的端口必须和 V2Ray 配置文件的监听端口相符合
        proxy_pass http://127.0.0.1:62470;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        # Show real IP in v2ray access.log
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
  }
  
  ```

## dns 配置

如果使用 singbox，本地 dns 可以选择 localhost（就是直接使用本地电脑上的 dns），远程 dns 可以使用 DNS-Over-HTTPS（DoH），比如 `https://1.1.1.1/dns-query`（毕竟拟合远程服务器建立连接的时候用的是 tcp，而不是 udp，那么你最好也用基于 tcp 的 DoH，而非 udp-over-tcp）。

## 路由配置

建议下载这个 [Github Repo](https://github.com/Loyalsoldier/v2ray-rules-dat) 中的规则文件，然后用它替代之前的 `geosite.dat` 和 `geoip.dat`。

然后，在需要代理的域名中，建议增加一条规则：`geosite:geolocation-!cn`。

!!! Tip 小贴士
    Sing-box 默认规则使用以下匹配逻辑：
    
    (`domain` || `domain_suffix` || `domain_keyword` || `domain_regex` || `geosite` || `geoip` || `ip_cidr`) &&
      (`port` || `port_range`) &&
      (`source_geoip` || `source_ip_cidr`) &&
      (`source_port` || `source_port_range`) &&
      `other fields`

    **注意并非所有匹配项之间都是“或”逻辑。**

!!! Warning 注意
    Sing-box 配置和 V2Ray 配置格式并不完全相同，比如：
    
    1. Sing-box 用 `domain` 来**严格**匹配域名本身，用 `domain-suffix` 匹配后缀
    2. 但是，V2Ray 用 `full` 来**严格**匹配域名本身，用 `domain` 匹配后缀
    
    因此，一定要多加注意。

    -------------

    下面是 sing-box 的基本域名配置规则：

    1. 使用 `domain` 来**严格**匹配域名本身。如：*`domain: google.com`* 匹配 `google.com`，**但不匹配 `www.google.com`（并不完全相同）**
    2. 使用 `domain-suffix` 来匹配域名后缀。如：*`domain-suffix: google.com`* 匹配 `google.com` 以及 `www.google.com`，**但不匹配 `google.com.hk`（多了 `.hk`）**
    3. 使用 `domain-keyword` 来匹配域名关键字。如：*`domain-keyword: google`* 匹配 `google.com`, `www.google.fi` 甚至 `service.googleapis.cn`
    4. 使用 `domain_regex` 来匹配域名 regex。如：*`domain_regex: \.goo.*\.com$`* 匹配 `www.google.com`、`fonts.googleapis.com`，**但不匹配 `google.com`（`google` 前没有匹配 `\.`）**
## 杂项

1. 刷 Cloudflare ip：:warning: 建议把 ipv4 和 ipv6 **都**刷成支持流媒体的 ip（用 fscarsman的脚本）。
2. Wireproxy 和 Tor 的配置：见上文。