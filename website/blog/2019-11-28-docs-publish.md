---
title: 发布文档的流程介绍
author: yanliang.gao
authorImageURL: https://secure.gravatar.com/avatar/6e52e95ab454c5a82b0eb13055d79bd5?s=72&d=identicon
---

要发布一篇文档(docs)，需要进行如下流程：

 - 在docs文件夹下新增md文件
 - 修改对应版本的 sidebar.json 文件进行展示
 - 重新部署



在 `/docs` 文件夹下添加相应的 `.md` 文档文件，确保每个文件中都包含 `header` 的头信息。 

header 头信息包含以下几项：

 - id - 唯一的文档ID。如果此字段不存在，则文档的ID将默认为其文件名（不带扩展名）。
 - title - 文件标题。如果不存在此字段，则文档标题将默认为其ID。
 - hide_title - 是否将标题隐藏在文档顶部。
 - description - 文档描述，将成为<head>中的<meta name =“ description” content =“ ...” />和<meta property =“ og：description” content =“ ...” />通过搜索引擎。如果此字段不存在，它将默认为内容的第一行。
 - sidebar_label - 该文档的侧边栏和下一个/上一个按钮中显示的文本。如果此字段不存在，则文档的sidebar_label将默认为其标题。
 - custom_edit_url - 用于编辑此文档的URL。如果不存在此字段，则文档的编辑URL将从siteConfig.js的可选字段退回到editUrl。 这个待评估是否需要

示例：

<!--truncate-->

```
// 一般来说每篇文档添加以下三个信息就足够了，特殊需求，酌情添加
---
id: doc1
title: My Document
sidebar_label: Document
---
```

经过版本控制的文档在被复制时会更改其 id 这样才能包含版本号。 新的 id 为 version-${version}-${id}, 其中 ${version} 是该文档的版本号, $ {id} 是原始的 id。 此外，版本文档可得到original_id 文件，使用原版的文件id。

例如：

```
---
id: version-1.0.0-doc1
title: My Document
sidebar_label: Document
original_id: doc1
---
```

## 更多功能

### 链接到其他文档

可以使用其他文档文件的相对URL，这些文档文件在呈现时会自动转换为相应的文档。

例如：

```
[This links to another document](other-document.md)
```

### 链接到图像和其它资源

可以使用相对URL以与文档相同的方式链接静态资产。

在文档和博客中使用的静态资产应分别进入 docs/assets 和 website/blog/assets。 Markdown 被转换成正确的链接路径, 这样这些路径就能为所有语言和版本的文档所用。

例如：

```
![alt-text](assets/doc-image.png)
```


## 侧边栏 & 导航栏

文档写好之后，我们需要将该文档添加到侧边栏的合适位置，不然文档不会显示

可以在website / sidebars.json文件中配置侧边栏的内容及其文档的顺序。

在sidebars.json中，将您在文档标题中使用的ID添加到现有的侧边栏/类别中。

在下面的示例中，docs是侧边栏的名称，而Getting Started是侧边栏中的类别。

```
{
  "docs": {
    "Getting Started": [
      "getting-started"
    ],
    ...
  },
  ...
}
```

对于位于docs子目录中的文档，如下所示：

```
docs
└── dir1
    └── getting-started.md

{
  "docs": {
    "My New Sidebar Category": [
      "dir1/getting-started"
    ],
    ...
  },
  ...
}
```

在 Docs 页面中，左边是侧边栏，展示文档的目录结构，需要我们自己维护。右边是每一篇文档的目录，自动展示，默认按照标题结构展示目录。

### 添加子类别

可以将子类别添加到侧边栏。您可以传递一个对象，其中键将是子类别名称，值是该子类别的ID数组，而不是像前面的示例那样将ID用作类别数组的内容。

```
{
  "docs": {
    "My Example Category": [
      "examples",
      {
        "type": "subcategory",
        "label": "My Example Subcategory",
        "ids": [
          "my-examples",
          ...
        ]
      },
      {
        "type": "subcategory",
        "label": "My Next Subcategory",
        "ids": [
          "some-other-examples"
        ]
      },
      "even-more-examples",
      ...
    ],
    ...
  }
}

/*
The above will generate:

- My Example Category
  - examples
  - My Example Subcategory
    - my-examples
    ...
  - My Next Subcategory
    - some-other-examples
  - even-more-examples
  ...
*/
```

### 添加新的侧边栏

您也可以将文档放在新的侧边栏中。

在下面的示例中，将在sidebars.json中创建一个examples-sidebar侧边栏，该侧边栏的类别为My Example Category，其中包含ID为my-examples的文档。

```
{
  "examples-sidebar": {
    "My Example Category": [
      "my-examples"
    ],
    ...
  },
  ...
}
```

> 注意： 经过测试发现使用版本管理之后 每次修改 sidebars.json 发布之后不会生效，要想生效需要重新打新的版本。
> **或者** 修改对应版本的 sidebars.json 然后重新部署

### 添加导航栏项目

添加导航栏项目需要在配置文件 `siteConfig.js` 中进行配置， 这里直接通过两个例子，来展示如何在导航栏添加项目

例如：在 docs 文件夹下面有一篇文档是 phoenix 白皮书，现在将这片文档添加到导航栏上

文档id为：whitepaper 

```js
  headerLinks: [
    {doc: 'doc1', label: 'Docs'},
    {doc: 'doc4', label: 'API'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
    {doc: 'whitepaper', label: 'Phoenix 白皮书'},
    { href: "https://gitlab.iquantex.com/yanliang.gao/docs", label: "GitLab" }
  ],
```
