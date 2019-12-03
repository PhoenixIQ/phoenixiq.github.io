---
title: docs 版本管理
author: yanliang.gao
authorImageURL: https://secure.gravatar.com/avatar/6e52e95ab454c5a82b0eb13055d79bd5?s=72&d=identicon
---

Docusaurus 提供了版本管理的功能。但是经过研究和讨论，发现 Docusaurus 提供的版本管理功能仅适用于文档本身的版本管理，并不适用于 Phoenix 的版本管理需求。

现结合 Docusaurus 暂定了一套 Phoenix 的版本管理机制，请各位评审一下是否合适：

<!--truncate-->

鉴于我们的文档是统一放在 `docs` 目录下的，可以通过不同的目录来区分不同的版本，以现在phoenix 的 1.x版本和2.x版本为例

分别在 `docs` 目录下创建文件夹 phoenix-1.x 和 phoenix-2.x，目录结构如下

``` 
phoenix-website
├── docs
│   ├── assets 文档中用到的静态文件放这里
│   ├── phoenix-1.x
│   │   └── phoenix 1.x 版本的文档放在这里
│   ├── phoenix-2.x
│   │   └── phoenix 1.x 版本的文档放在这里
```

然后通过在 `url` 在导航栏展示不同版本的地址。

Docusaurus 提供的版本管理机制，用作文档自身的版本管理，这两种可共同使用。

下面介绍下 Docusaurus 提供的版本管理机制的使用方式：

> 使用 Docusaurus 的版本功能需要一些配置，这些配置在初始化 phoenix-website 的过程中已经配置过了，所以这里直接介绍如何使用。想要了解如何配置的可以参考[https://docusaurus.io/docs/zh-CN/1.9.x/versioning](https://docusaurus.io/docs/zh-CN/1.9.x/versioning)

## 如何创建新版本

要想使用 Docusaurus 的版本管理功能，需要本地安装有 Docusaurus 环境，具体的安装方法参考[Docusaurus 介绍](2019-12-03-Introduce.md)

使用想要创建的版本（这里使用版本号1.0.0）的命令行参数运行脚本

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

运行带有命令行参数的脚本，脚本的第一个参数是当前版本名称，然后是第二个新版本名称。例如

```
yarn run rename-version 1.0.0 1.0.1
```




