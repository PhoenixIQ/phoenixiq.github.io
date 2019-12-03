---
title: Docusaurus 介绍
author: yanliang.gao
authorImageURL: https://secure.gravatar.com/avatar/6e52e95ab454c5a82b0eb13055d79bd5?s=72&d=identicon
---

下面对 Docusaurus 做个简要的介绍

## 安装

需要有node yarn 环境 Node >= 8.x and Yarn >= 1.5

```
// 安装 Docusaurus
yarn global add docusaurus-init 或 npm install --global docusaurus-init
// 安装完成之后，创建站点目录 并运行
docusaurus-init
```

预览

在 `website` 目录下执行如下命令
```
npm start / yarn start
```

## 目录介绍

利用 Docusaurus 生成的站点的目录结构如下：

``` 
phoenix-website
├── Dockerfile
├── README.md
├── docs
│   ├── assets 文档中用到的静态文件放这里
│   ├── phoenix-1.x
│   │   └── phoenix 1.x 版本的文档放在这里
│   ├── phoenix-2.x
│   │   └── phoenix 1.x 版本的文档放在这里
└── website
    ├── blog
    │   └── 博客文章放在这里
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

## 如何发布一篇博客

[如何发布一篇博客](2019-11-27-blog-introduction.md)

## 如何新增文档

[如何新增文档](2019-11-28-docs-publish.md)

## 版本管理机制
[版本管理机制](2019-11-27-docs-versions.md)