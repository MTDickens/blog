## Requirements 

### Prerequisites 

1. 一个 Github 账号
2. 一个 Cloudflare 账号
3. 本地 mkdocs
   - Windows 可以使用 `pip3 install mkdocs` 下载
   - Linux 可以使用 `sudo apt install mkdocs` 直接安装
4. 本地 Git Bash
    - 也可以用 powershell 替代
        - 但是，powershell 必须用 `python3 -m mkdocs` 而非 `mkdocs`

### Optional

1. 一个 custom domain 

## Steps 

### 本地搭建

根据 [mkdocs 中文教程](https://markdown-docs-zh.readthedocs.io/zh_CN/latest/) 或 [mkdocs 官方教程](https://www.mkdocs.org/user-guide/)

1. 建立一个 mkdocs 文件夹
2. 添加 markdown 文件
3. 编辑 **mkdocs.yml** 配置文件
4. 运行 `

:warning:警告：不要擅自把 **.yml** 后缀 改为 **.yaml** 后缀，mkdocs 不认后面的！

### 上传 Github

1. 使用 `cd` 命令，进入到博客的**根文件夹**（即：有 mkdocs.yml 文件和 docs 目录的文件夹）
2. 使用 `git init` 命令，创建 **.git** 文件夹（即初始化 Git）
3. **重要！：** 在根目录下 `touch .gitignore`，添加 **.gitignore** 文件，从而使之后用 `mkdocs build` 命令构建的网页不包括在 Git 之内。
    1. 用你喜欢的文本编辑器添加：
        ```
        site
        ```
    2. 或者直接用 shell 命令：`echo 'site' > .gitignore`
4. 在 Github 上建立一个仓库，名字任意，建议为 **blog**
5. 拉取 **blog** 仓库：`git clone <repo link>`
6. 将本地文件夹拷贝到 blog 文件夹内
7. `git add .; git commit -m <commit message>; git push`
    1. commit message 任写

### 使用 cloudflare pages 构建

[Pages 官方文档主页](https://developers.cloudflare.com/pages/)

1. 参考官方文档
    - [Deploy MkDocs with Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-mkdocs-site/#deploy-with-cloudflare-pages)
2. 如果希望自定义域名的话，在 Cloudflare 的 Pages/blog/Custom Domain 下面，可以用 CNAME 接入自定义域名。
   - **注意：**接入后，可能很长一段时间都在显示 initializing。没有关系，一天后就行了。

坑点：

- 环境变量的 `PYTHON_VERSION` 后，**一定不能**有空格！否则 Cloudflare 无法识别，导致部署时使用老旧的 Python 2.7，导致错误
    - 另外，`PYTHON_VERSION` 只能是：2.7、3.5 和 3.7。输入其他的，都没有用。不要“自作主张”，把最新的 Python 版本号输进去了。详见 [Build Configuration](https://developers.cloudflare.com/pages/platform/build-configuration/)
- **注意：**教程中的 `pip freeze > requirements.txt` 命令并不好用，因为你本地的 Python 的 requirements 太多了。因此，建议将 **requirements** 文件内容用如下替代：
  
    ```
    mkdocs==1.4.2
    mkdocs-material==9.0.3
    <你的其他主题>
    mkdocs-material-extensions==1.1.1
    <你的其他扩展 (extensions)>
    ```
    - 也许以后版本号会改动
- 如果部署失败，进行改动，重新部署时，一定要**不要**用旧的 deployment 进行部署（否则配置是旧的）！要重启一个新的。

    - 另外，如果 github repo 的文件有变，那么，Pages 就会自动重新构建。
