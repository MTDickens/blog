# 使用密码或密钥登录 ssh

## tl;dr
1. 生成私钥（id_rsa）和公钥（id_rsa.pub）
2. 将公钥（id_rsa.pub）**追加**到远程主机的`~/.ssh/authorized_keys`文件
3. 在远程主机的 `/etc/ssh/sshd_config` 文件中，增加以下内容：
    ```
    RSAAuthentication yes
    PubkeyAuthentication yes
    AuthorizedKeysFile .ssh/authorized_keys
    ```
4. 重启远程主机的ssh服务
    ```
　 　// ubuntu系统
　 　service ssh restart
 
　 　// debian系统
　 　/etc/init.d/ssh restart
    ```
5. 使用私钥登录
    - 可能要在 `~/.ssh/config` 配置内加入
      ```
      IdentityFile ~/.ssh/<your private key file name>
      ```
      这一行

### Tips

有些时候，并非远程主机上没有你的私钥，而是由于重装了远程主机，导致远程主机的 fingerprint 出现变化。

这种情况下，你可以简单地将你本地的 `~/.ssh/known_hosts` 对应的 host 删除即可。

## ssh 原理

SSH之所以能够保证安全，原因在于它采用了公钥加密。

整个过程是这样的：
1. 远程主机收到用户的登录请求，把**自己的公钥**发给用户。
2. 用户使用这个公钥，**将登录密码加密**后，发送回来。
3. 远程主机用**自己的私钥**，**解密登录密码**，如果密码正确，就同意用户登录。

这个过程本身是安全的，但是实施的时候存在一个风险：如果有人截获了登录请求，然后*冒充*远程主机，将伪造的公钥发给用户，那么用户很难辨别真伪。因为不像https协议，SSH协议的公钥是没有证书中心（CA）公证的，也就是说，都是**自己签发**的。

可以设想，如果攻击者插在用户与远程主机之间（比如在公共的wifi区域），用伪造的公钥，获取用户的登录密码。再用这个密码登录远程主机，那么SSH的安全机制就荡然无存了。这种风险就是著名的"中间人攻击"（Man-in-the-middle attack）。

SSH协议是如何应对的呢？

## 登录方式

### 密码登录

如果你是第一次登录对方主机，系统会出现下面的提示：

```
　　$ ssh user@host

　　The authenticity of host 'host (12.18.429.21)' can't be established.

　　RSA key fingerprint is 98:2e:d7:e0:de:9f:ac:67:28:c2:42:2d:37:16:58:4d.

　　Are you sure you want to continue connecting (yes/no)?
```

这段话的意思是，无法确认host主机的真实性，只知道它的公钥指纹，问你还想继续连接吗？

所谓"公钥指纹"，是指公钥长度较长（这里采用RSA算法，长达1024位），很难比对，所以对其进行MD5计算，将它变成一个128位的指纹。上例中是98:2e:d7:e0:de:9f:ac:67:28:c2:42:2d:37:16:58:4d，再进行比较，就容易多了。

很自然的一个问题就是，用户怎么知道远程主机的公钥指纹应该是多少？回答是没有好办法，远程主机必须在自己的网站上贴出公钥指纹，以便用户自行核对。

假定经过风险衡量以后，用户决定接受这个远程主机的公钥。
```
　　Are you sure you want to continue connecting (yes/no)? yes
```
系统会出现一句提示，表示host主机已经得到认可。
```
　　Warning: Permanently added 'host,12.18.429.21' (RSA) to the list of known hosts.
```
然后，会要求输入密码。
```
　　Password: (enter password)
```
如果密码正确，就可以登录了。

当远程主机的公钥被接受以后，它就会被保存在文件$HOME/.ssh/known_hosts之中。下次再连接这台主机，系统就会认出它的公钥已经保存在本地了，从而跳过警告部分，直接提示输入密码。

- 如果发现之后连接时公钥和之前的公钥不同，则 ssh 会进行警告

每个SSH用户都有自己的known_hosts文件，此外系统也有一个这样的文件，通常是`/etc/ssh/ssh_known_hosts`，保存一些对所有用户都可信赖的远程主机的公钥。

### 公钥登录

使用密码登录，每次都必须输入密码，非常麻烦。好在SSH还提供了公钥登录，可以省去输入密码的步骤。

所谓"公钥登录"，原理很简单，就是**用户将自己的公钥储存在远程主机上**。登录的时候，远程主机会向用户发送一段随机字符串，用户用自己的私钥加密后，再发回来。远程主机用事先储存的公钥进行解密，如果成功，就证明用户是可信的，直接允许登录shell，不再要求密码。

---

这种方法要求用户必须提供自己的公钥。如果没有现成的，可以直接用ssh-keygen生成一个：
```
　　$ ssh-keygen
```
运行上面的命令以后，系统会出现一系列提示，可以一路回车。其中有一个问题是，要不要对私钥设置口令（passphrase），如果担心私钥的安全，这里可以设置一个。

运行结束以后，在`$HOME/.ssh/`目录（Windows 下一般为 `C:\Users\<user name>\.ssh`）下，会新生成两个文件：`id_rsa.pub`和`id_rsa`。**前者是你的公钥，后者是你的私钥。**

这时再输入下面的命令，将公钥传送到远程主机host上面：
```
　　$ ssh-copy-id user@host
```
好了，从此你再登录，就不需要输入密码了。

???+ Tip
    对于 Windows 的 PowerShell，很可能没有 `ssh-copy-id` 这个 Linux 命令，因此，需要你手动将 `id_rsa.pub` 的内容**追加**到远程主机的对应文件后。

    - 注意：是追加，而不是覆盖。

    远程主机对应文件是：`$HOME/.ssh/authorized_keys`

---

如果还是不行，就打开远程主机的`/etc/ssh/sshd_config`这个文件，检查下面几行前面"#"注释是否取掉。
```
　　RSAAuthentication yes
　　PubkeyAuthentication yes
　　AuthorizedKeysFile .ssh/authorized_keys
```
然后，重启**远程主机**的ssh服务。
```
　　// ubuntu系统
　　service ssh restart

　　// debian系统
　　/etc/init.d/ssh restart
```

### 总结

密码登录：vps 把公钥发给你 -> 你输入密码 -> 用公钥加密 -> vps 用私钥解密 -> vps 验证
    - 证明你有密码

公钥登录：你把公钥提前储存在 vps -> vps 制造随机字符串 -> 用公钥加密 -> 你用私钥解密 -> vps 验证
    - 证明你有私钥