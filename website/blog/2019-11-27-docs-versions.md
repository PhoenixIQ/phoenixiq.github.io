---
title: docs 版本管理
author: yanliang.gao
authorImageURL: https://secure.gravatar.com/avatar/6e52e95ab454c5a82b0eb13055d79bd5?s=72&d=identicon
---

Docusaurus 提供了版本管理的功能。

## 如何创建新版本

运行以下脚本以生成列出所有站点版本的入门版本页面：

```
yarn examples versions
```

脚本运行完成之后，将会生成 `pages/en/versions.js` 文件，改文件可以自定义。

将以下脚本添加至 `package.json` 

```
...
"scripts": {
  "version": "docusaurus-version"
},
...
```

使用想要创建的版本的命令行参数运行脚本

```
yarn run version 1.0.0
```

该命令将会保留当前 `docs` 目录中的所有文档，作为版本1.0.0的文档。

版本生成之后将自动在网站导航栏的标题旁边显示最新的版本号

## 版本号的格式

可以使用任何所需的格式创建版本号，并且可以使用任何版本号创建新版本，只要它与现有版本不匹配即可。版本顺序由创建版本的顺序决定，与版本编号方式无关。

## 历史版本

版本化文档放置在 `website/versioned_docs/version-${version}` 中，其中 `${version}` 是您提供的版本脚本的版本号。

版本化的侧边栏被复制到 `website/versioned_sidebars` 中，并命名为 `version-${version}-sidebars.json`

首次添加版本时会创建一个 `website/versions.json` 文件，Docusaurus使用该文件来检测存在哪些版本。每次添加新版本时，都会将其添加到 `versions.json` 文件中。

如果您希望更改旧版本的文档，则可以访问相应版本的文件。

每次指定新版本时，只会复制docs目录中的文件和侧边栏文件中与最新版本不同的文件。如果版本之间没有变化，Docusaurus将使用该文件的最新版本。

例如，对于最新版本1.0.0，存在原始ID为doc1的文档，并且其内容与docs目录中具有ID doc1的文档相同。创建新版本2.0.0时，不会将doc1的文件复制到versioned_docs / version-2.0.0 /中。仍然会有docs / 2.0.0 / doc1.html的页面，但是它将使用版本1.0.0的文件。

## 重命名现有版本

要将现有版本号重命名为其他版本，请首先确保以下脚本位于package.json文件中：

```
...
"scripts": {
  "rename-version": "docusaurus-rename-version"
},
...
```

运行带有命令行参数的脚本，脚本的第一个参数是当前版本名称，然后是第二个新版本名称。例如

```
yarn run rename-version 1.0.0 1.0.1
```
