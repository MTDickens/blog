# Tips for Git

## 如何保存 Git 用户名和 token

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