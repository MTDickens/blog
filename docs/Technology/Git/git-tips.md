# 如何保存 Git 用户名和 token

> Author: M.T.Dickens, ChatGPT Feb 13 Ver.

在 Git 中，可以通过设置 Git 的 `credential.helper` 来保存用户名和 token，避免每次 push 都需要输入。

1. 首先，打开终端（Windows 系统下打开 Git Bash 终端）。
2. 执行以下命令，设置 Git 的 `credential.helper`：

```bash
git config --global credential.helper cache
```

这会将 Git 的 `credential.helper` 设置为 cache，表示会缓存凭证，下次操作时直接使用缓存中的凭证。

!!! note

    需要注意的是，缓存的有效期默认为 15 分钟，你可以通过设置 `credential.helper` 的 timeout 参数来修改有效期，例如：

    ```bash
    git config --global credential.helper 'cache --timeout=3600'
    ```

    这会将缓存的有效期设置为 1 小时。

---

你也可以将 Git 的 `credential.helper` 设置为 store，将凭证保存在文件中，这样就不需要缓存了，但是这种方式**相对不安全**，因为凭证保存在明文文件中。执行以下命令即可：

```bash
git config --global credential.helper store
```

1. 然后，在下一次操作时，Git 会提示你输入用户名和 token，输入一次即可。Git 会自动将凭证缓存或保存到文件中。

现在，每次 push 到 GitHub 时，Git 就会使用缓存中的凭证，避免了每次都需要输入的麻烦。

---

总之，通过设置 Git 的 `credential.helper`，可以方便地保存用户名和 token，避免每次都需要输入。

!!! warning
    需要注意安全性问题，尽量避免将凭证保存在明文文件中。

# 设置代理

如果要设置全局代理：

```bash
git config --global http.proxy http://127.0.0.1:10809

git config --global https.proxy http://127.0.0.1:10809

# 以下为取消代理命令
git config --global --unset http.proxy

git config --global --unset https.proxy
```

如果只对 github.com 设置代理（e.g. 对 gitee 等不用代理），可以使用：

```bash
git config --global http.https://github.com.proxy http://127.0.0.1:10809
git config --global https.https://github.com.proxy http://127.0.0.1:10809

# 以下为取消代理命令

git config --global --unset http.https://github.com.proxy)

git config --global --unset https.https://github.com.proxy)
```

!!! note 
    1. 可以在 `.gitconfig` 内直接修改代理设置
    2. 更详细的，参考[教程](https://gist.github.com/laispace/666dd7b27e9116faece6)

# 大小写敏感

git 默认对文件名不是大小写敏感的。这在 `mkdocs` 中就非常致命。

- 比如说，我之前文件名的大小写搞错了
- 然后我之后修改文件名的大小写，但是却无法将 change 上传到仓库

我们可以通过以下命令来解决：

```
git config core.ignorecase false
```

# 删除被 git 跟踪的文件

> 更加详细的 `git rm` 用法，可以参考[菜鸟教程](https://www.runoob.com/git/git-rm.html)

假如你在将一个文件添加进 Git 之后，又将其添加进 `.gitignore`。此时，即使你在 `.gitignore` 中添加了该文件，Git 依然会跟踪这个文件的变化。我们需要**手动**将 Git 对该文件的跟踪移除。下面是具体的操作步骤：

1. **确认 `.gitignore` 文件中已经包含了要忽略的文件**：

    首先，确保 `.gitignore` 文件中已经包含了你希望 Git 忽略的文件路径。例如，如果我们希望忽略 `.vscode/settings.json` 文件，应该在 `.gitignore` 中加入如下内容：

    ```plaintext
    .vscode/settings.json
    ```

2. **从 Git 仓库中删除对文件的跟踪**：

    使用 `git rm --cached` 命令从 Git 仓库中删除对该文件的跟踪。注意，这个命令不会删除本地文件，只是将它从 Git 的跟踪列表中移除。

    ```bash
    git rm --cached .vscode/settings.json
    ```

3. **提交更改**：

    提交这些更改，这样你的本地仓库和远程仓库都会更新为不再跟踪这个文件。

    ```bash
    git commit -m "Stop tracking .vscode/settings.json"
    ```

4. **验证更改**：

    使用 `git status` 命令验证更改是否生效，确认文件已经从 Git 的跟踪列表中移除，并且不会再显示在 `git status` 输出中。

    ```bash
    git status
    ```

通过以上步骤，你就可以成功地从 Git 仓库中移除某个文件的跟踪，同时保持本地文件不被删除。这样，Git 就会忽略这些文件的后续更改。

完整操作示例如下：

```bash
# 确保.gitignore文件中包含需要忽略的文件
echo ".vscode/settings.json" >> .gitignore

# 从Git仓库中删除对该文件的跟踪
git rm --cached .vscode/settings.json

# 提交更改
git commit -m "Stop tracking .vscode/settings.json"

# 验证更改
git status
```

这样，`.vscode/settings.json` 文件的更改将不会再被 Git 跟踪和显示在 `git status` 中。