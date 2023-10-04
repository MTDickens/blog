总体而言，Sioyek 这款开源的 PDF 阅读器的键盘操作借鉴了 Vim，但是相比于 Vim 又多了其他很多功能，下面我对其中重要的功能进行简要介绍：

!!! Note 注记
    1. `[...]`：只能输入一个字符
    2. `[[...]]`：可以输入字符串
    3. `{...}`：只能输入数字
    4. `<shift>, <ctrl>, ...`：`shift` 键，`ctrl` 键，等等
    5. `<<l>>, <<r>>, <<m>>`：鼠标左、右、中键

1. 页面
    - 前往页面：`{number of that page} + gg`
2. 标记（Mark）
    - 设置标记：`m + [markname]`
    - 前往标记：`u`
3. 书签（Bookmark）
    - 设置书签：`b + [[markname]]`
    - 列出*当前书*的书签：`gb`
    - 列出*所有书*的书签：`gB`
      - 我们可以通过书签在不同的文档间快速跳转
    - 删除当前书签：`db`
    - 批量删除书签：`gb(gB)` 并且在需要删除的书签处使用 `<delete>`
4. 高亮（Highlight）：相比书签而言，少了名字，多了显示
    - 设置当前文字高亮：`h`
    - 列出*当前书*的高亮：`gh`
    - 列出*所有书*的高亮：`gH`
      - 我们可以通过高亮在不同的文档间快速跳转
    - 删除当前高亮：`dh`
    - 批量删除高亮：`gh(gH)` 并且在需要删除的高亮处使用 `<delete>`
5. 目次（Table of Contents, ToC）【也就是 PDF 文件的自带书签】
    - 列出目次：`t`
6. 查询
    - 查询 Google Scholar：`ss` 或 `<<m>>` 或 `<ctrl> + <<l>>`
    - 查询 Library Genesis：`sl` 或 `<shift> + <<m>> `
7. Smart Jump
    - 跳至对应的图、表：`<<m>>` 或 `<ctrl> + <<l>>`
    - 预览对应的图、表：`<shift> + <<l>>`
8. Visual Ruler
    - enable ruler: `<<r>>`
    - disable ruler: `<escape>`
    - 沉浸式阅读: 在 enable ruler 时，用 `j/k/<up>/<down>` 按键进行
9. 打开文件
    - 打开其他文件（系统文件管理器）：`o`
    - 列出之前打开的文件：`<shift> + o`
    - 打开其他文件（内置文件管理器）：`<ctrl> + o`
10. 配置文件
    - 修改操作绑定的按键：在 keys.config 文件中修改
    - 修改其他偏好（如 Libgen 链接，默认搜索引擎等）：在 prefs.config 文件中修改
11. 其他小技巧
    - 纯键盘导航：`v`
    - 纯键盘导航+查询：`F`
12. 扩展 Extensions
    - *TODO*