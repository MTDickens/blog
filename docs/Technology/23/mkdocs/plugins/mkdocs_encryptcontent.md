# `mkdocs-encryptcontent-plugin` 上手指南

> 作者： M.T.Dickens, GPT-4

## 基本操作

1. 安装 `mkdocs-encryptcontent-plugin`：
   在终端中运行以下命令：
   ``` bash
   pip install mkdocs-encryptcontent-plugin
   ```

2. 在项目根目录下找到或创建`mkdocs.yml`文件，并编辑它以启用插件。将以下内容添加到文件中：
   ```yaml
   plugins:
     - search
     - encryptcontent:
         password: your_password
   ```
   将 `your_password` 替换为您希望用于加密内容的密码。

3. 选择要加密的页面，为其添加一个元数据标签。在Markdown文件的顶部添加以下内容：
   ```markdown
   ---
   encrypted: true
   ---
   ```

4. 运行 `mkdocs build` 命令以构建网站。已加密的页面将在构建过程中加密。

5. 使用 `mkdocs serve` 命令启动本地服务器，查看并测试加密内容。

现在，当用户尝试访问被加密的页面时，将显示一个密码输入框。只有输入正确的密码才能查看加密内容。

## 进阶操作

### 使用环境变量

!!! abstract
    由于我们往往将我们的文件夹上传到 Github 之类的平台，而且一般都是 public repository，因此，如果将密码保存在文件内，就会有泄露的风险。

    由于 Github 等平台中，环境变量是 private 的。因此，我们应该将密码保存在**环境变量**中。MkDocs 通过读取环境变量得知我们的密码。

    我们下面先介绍在本地设置环境变量的方法

1. 在系统中设置一个环境变量，例如 `MKDOCS_ENCRYPT_PASSWORD`，并为其分配一个值（您的密码）。具体设置方法取决于您的操作系统。

对于Windows，您可以使用以下命令：
```
setx MKDOCS_ENCRYPT_PASSWORD "your_password"
```

对于Linux和macOS，您可以将以下内容添加到 `~/.bashrc` 或 `~/.bash_profile `文件中：
```
export MKDOCS_ENCRYPT_PASSWORD="your_password"
```

2. 修改 `mkdocs.yml` 文件，以使用环境变量作为密码。将以下内容添加到文件中：

```yaml
plugins:
  - search
  - encryptcontent:
      password: !!python/object/apply:os.getenv ["MKDOCS_ENCRYPT_PASSWORD"]
```

3. 接下来，按照之前的说明，为要加密的页面添加元数据标签。

4. 运行 `mkdocs build` 命令以构建网站，并使用 `mkdocs serve` 命令启动本地服务器，查看并测试加密内容。

### 指定文件加密

*TODO*