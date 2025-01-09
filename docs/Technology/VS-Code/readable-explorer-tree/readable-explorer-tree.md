## 前言

VS Code 侧边栏的文件显示，在文件夹嵌套较多的时候，会相当不清晰。

这主要是因为以下两点：
1. 不同层级间文件夹的缩进太小（只有 8 像素）
2. 不同层级间没有很好的分割线、提示线等等

下面，我们通过改变以下两个 VS Code 设置，来优化我们的使用体验。

1. `workbench.tree.indent`
2. `tree.indentGuidesStroke` within `workbench.colorCustomizations`

!!! tip
    若希望查找并改变 VS Code 的设置，请按以下两个简单步骤：

    1. 按下 `ctrl + p`，并输入 `>`
    2. 再输入 `settings`
    3. 单击 `setting sync: show settings` 选项
    
    然后，你就可以搜索、改变设置了。

## 设置

### Tree Indent

在 settings 中，搜索 `workbench.tree.indent`，并把它的值从 8 改为一个你喜欢的值。
- 我个人使用的是 20

### Tree Guide Stroke

搜索 `workbench.colorCustomizations`，并点击 `Edit in settings.json`。

在 json 文件中，添加

```json
{
  "workbench.colorCustomizations": {
    "tree.indentGuidesStroke": "#ff0000"
  }
}
```

其中，`#ff0000` 是<span style="color:#ff0000">红色</span>，你可以改为其他颜色。
- 我选用红色的原因是：它比较醒目

## 最终效果

最终效果如图：

<img src="../effect.png" style="zoom:33%;" />