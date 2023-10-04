# Azure Linux如何启用root用户登录

Azure 里的 linux 模板应该是通过了 sshd_config 文件禁用了 Root 登陆，我们只需重新开启即可。

```bash
sudo su
vim /etc/ssh/sshd_config

# 在 sshd_config 文件里的 “Authentication” 部分加上以下内容
PermitRootLogin yes
# 完成以后退出 vim 并保存

service sshd restart # 重启 ssh 服务以应用更改
passwd root # 直接修改 Root 用户的密码
```

这样重新登陆 ssh 就可以用 Root 登陆了。

