# 给 PDF 添加目录

1. 首先[下载](https://github.com/ifnoelse/pdf-bookmark/releases)最新版的 **pdf-bookmark**，并执行 /bin 中的 **pdf-bookmark.bat** 文件

    - 如果链接失效，可以从我的仓库下载并自行编译
        ```
        git clone https://github.com/MTDickens/pdf-bookmark.git
        cd pdf-bookmark
        ./gradlew jlink
        build/image/bin/pdf-bookmark
        ```

2. 之后，见以下文字：

## 使用方法
### 1. 选择pdf文件 ###
点击**选择文件**按钮选择要添加目录的pdf文件
### 2. 填写页面偏移量 ###
有的pdf为扫描版，所以目录中的页码（书籍页码）可能与pdf文件实际页码不同，目录中的页码与pdf文件实际页码之间的差值（实际页码-书籍页码）即为页码偏移量。
#### 2.1 确定页码偏移量的方法： ####
打开pdf文件将pdf翻到任意带页码的一页，如下图，通过pdf阅读软件查看书籍中的页码与实际页码，将这两个数字相减即可得到页码偏移量，比如下图中的页码偏移量为134-120=14
![](https://github.com/MTDickens/pdf-bookmark/raw/master/img/page_offset_m.png)

### 3. 设置目录内容 ###
目前设置目录内容的方法有以下两种
#### 3.1 在pdf-bookmark目录编辑框填入目录内容（方法一）

也就是说，把文章目录从 PDF 上复制粘贴到程序里。如果文章是扫描版，那就用 OCR 工具先处理一遍。

- 这里给出目录层级的自动生成的示意与规则

    ```
    前言
        1
        2
        3
            3.1
            3.2
                3.2.1
                3.2.2
                    ...
    后记
    参考文献
    ```
    
    （其中，**点越多，层级越后；点越少，层级越前；没有点（如：前言、后记、参考文献），层级最前。**）

⚠️注意：有可能书中目录的编排与这里的规则不符，从而生成混乱的书签。可能需要

1. 改目录格式
2. 或者，改书签

（不过，好消息是，页码是对的）

#### 3.2 或者包含此书目录内容的页面url（url方式目前只支持china-pub）（方法二）
##### 3.2.1 示例
假设要给《快学scala》自动生成目录书签，我们可以通过互联网书店找到目录内容，以[china-pub](http://www.china-pub.com/)为例，我们可以搜索到《快学scala》的详情页`http://product.china-pub.com/3684420`，以下为目录部分的截图
![](https://github.com/MTDickens/pdf-bookmark/raw/master/img/scala_exp_cp.png)

以上为china-pub中书籍详情页目录部分，可以点击**↓展开全部内容**然后将完整目录复制到pdf-bookmark目录编辑框中，或者直接将此页面url填入目录编辑框

**填入目录内容示例**

![](https://github.com/MTDickens/pdf-bookmark/raw/master/img/scala_exp_bm1.png)

**填入url示例**

![](https://github.com/MTDickens/pdf-bookmark/raw/master/img/scala_exp_bm2.png)

#### 4. 生成目录

点击**生成目录**按钮就会生成一个新的包含目录的pdf文件。