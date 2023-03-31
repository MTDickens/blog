在 Ubuntu 20.04 系统中，如果使用命令 `chsh` 来切换默认的 Shell，并且不慎输错了 Shell（如：**/bin/zsh** 输成 **zsh**），那么，就会出现之后无法登录该用户的情况（即：无法用不合法的 Shell 登录），且登陆后无法正常使用 `chsh`。 

解决方案：

1. **登录用户**方式

   1. 如果是 root 用户无法登录，那么就可以通过 `sudo bash` 命令，强制用 bash 登录。

2. **修改默认 Shell**方式

   1. **警告:warning:：**如果直接用 `chsh`，那么它会要求输密码，但是无论怎么输都不对，而且它会一直报以下错误

      ```
      chsh PAM: Authentication failure
      ```

   2. 修改 `/etc/pam.d/chsh` 的内容

      1. 将

         ```
         auth       required   pam_shells.so
         ```

         改为

         ```
         auth       sufficient   pam_shells.so
         ```

         从而得以不输密码进入 `chsh`

   3. `chsh`

   4. 然后把 `/etc/pam.d/chsh` 的内容改回来，以保证 Linux 安全性。

      