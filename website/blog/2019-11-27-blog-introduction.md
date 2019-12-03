---
title: Docusaurus blog 写法介绍
author: yanliang.gao
authorImageURL: https://secure.gravatar.com/avatar/6e52e95ab454c5a82b0eb13055d79bd5?s=72&d=identicon
---

简单介绍一下 Docusaurus 中发布 blog 的步骤和写法。

<!--truncate-->

## 发布博客

要在博客中发布文章，请在博客目录（`website/blog/`）中创建一个格式为 `YYYY-MM-DD-my-blog-post-title.md` 的文件。

## 文章顶部信息选项 <必选>

每篇文章可以添加一些相应的信息（作者名、头像...）

```
---
title: Introducing Docusaurus
author: Joel Marcey
authorURL: http://twitter.com/JoelMarcey
authorFBID: 611217057
authorTwitter: JoelMarcey
---
Lorem Ipsum...
```

 - author - 作者署名 （必填）
 - authorURL - 与作者关联的URL。可以是Twitter，GitHub，Facebook帐户等。
 - authorFBID - 用于获取个人资料图片的Facebook个人资料ID。(这个我们一般用不到)
 - authorImageURL - 作者头像
 - title - 文章名

## 摘要截取 <可选>

在博客文章中使用 `<！-truncate->` 标记表示在查看所有已发布的博客文章时将显示为摘要的内容。 `<！-truncate->` 标记以上的内容都会成为摘要。

```
---
title: Truncation Example
---
All this will be part of the blog post summary.

Even this.

<!--truncate-->

But anything from here on down will not be.

Not this.

Or this.
```
 
## 更改侧栏标题 <可选>

可以通过将 `blogSidebarTitle` 设置添加到 `siteConfig.js` 来配置特定的侧边栏标题。 

## 社交按钮 <可选>

如果想在文章底部显示Facebook与(或)Twitter社交按钮，那么在网站设置的siteConfig.js中配置facebookAppId 与(或) twitter选项。


参考文章：https://docusaurus.io/docs/zh-CN/adding-blog