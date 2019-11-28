---
id: version-0.0.1-introduce
title: Docusaurus Introduce
sidebar_label: Docusaurus Introduce
original_id: introduce
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

## 目录介绍

利用 Docusaurus 生成的站点的目录结构如下：

``` 
root-directory
├── Dockerfile
├── README.md
├── docker-compose.yml
├── docs
│   ├── doc1.md
│   ├── doc2.md
│   ├── doc3.md
│   ├── exampledoc4.md
│   └── exampledoc5.md
└── website
    ├── blog
    │   ├── 2016-03-11-blog-post.md
    │   ├── 2017-04-10-blog-post-two.md
    │   ├── 2017-09-25-testing-rss.md
    │   ├── 2017-09-26-adding-rss.md
    │   └── 2017-10-24-new-version-1.0.0.md
    ├── core
    │   └── Footer.js
    ├── package.json
    ├── pages
    ├── sidebars.json
    ├── siteConfig.js
    └── static
```

 - docs: 用 Markdown 编写的文档放在这里
 - blog: Docusaurus 支持发布博客的功能，想要发布的博客文件放在这里
 - pages: 站点的首页，支持自定义
 - static: 自定义页面所需要的一些静态资源 css img ...
 - Footer.js: 站点的页脚部分，支持自定义
 - siteConfig.js: Docusaurus 的配置文件（站点的名称，配色，社交连接等等）
 - sidebars.json: 侧边目录展示部分
 - 