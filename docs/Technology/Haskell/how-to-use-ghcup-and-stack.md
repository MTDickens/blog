1. 如果要开启互动 UI (setup interactive UI)，可以输入 `ghcup tui`
2. 如果要**查看**当前 **ghcup, stack 的安装版本**，可以输入 `ghcup --version`, `stack --version`
3. 如果要**查看**当前 **ghc 默认版本**，可以直接输入 `stack ghc` 查看版本
4. 如果要**切换**当前 **ghc 默认版本**，可以用 `stack config set resolver lts-xxx` 切换默认版本
    - 注意：ghc lts version 和 ghc version 的对应关系可以在 [stackage](https://www.stackage.org/) 上查看
5. 如果要 **list 所有 ghc 的版本**，可以去对应目录查看（可以用 `where ghcup`，然后去 ghcup 同目录下查看
    - 比如在 WSL2 的 Ubuntu 20.04 版本上，`where ghcup` 就是 /root/.ghcup/bin/ghcup，因此就去 /root/.ghcup/bin 下查看
    - 比如，如果你下载了 ghc-9.4.7，那么就会有一堆的形如 xxx-9.4.7 和 xxx-9.4 的软链接
6. 如果要**卸载 ghc**，可以用 `ghci rm <version>`
    - 如此，这些软链接也会被删掉
7. 如果要**安装 ghc**，可以如下操作二选一：
    1. 用 `ghcup install ghc-x.x.x` 安装，然后修改 stack 默认版本（i.e.  `stack config set resolver lts-xxx`）
        - 可以在 [stackage](https://www.stackage.org/) 上，查看 ghc 的 lts 版本与版本号（也就是 ghc-x.x.x 后面的 x.x.x）之间的对应
    2. 先 `stack config set resolver lts-x.x`，然后直接用 `stack ghci` 安装
    3. 补充说明
        - 可以用 `ghcup install`, `stack config set resolver lts` 直接安装最新版
        - 但是，两者的最新版不一定相同
8. 如果要**卸载 ghcup** 本身，可以用 `ghcup nuke` 卸载