/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
// 用户页面中使用Phoenix的项目/组织列表。 暂时不配置，之后有需求再配置
const users = require('./data/users');
// const users = [
//   {
//     caption: 'User1',
//     // You will need to prepend the image path with your baseUrl
//     // if it is not '/', like: '/test-site/img/image.jpg'.
//     image: '/img/undraw_open_source.svg',
//     infoLink: 'https://www.facebook.com',
//     pinned: true,
//   },
// ];

// 网站配置
const siteConfig = {
  title: 'Phoenix', // Title for your website.
  tagline: 'Phoenix 官方文档',
  url: 'https://phoenix-docs.sz.iquantex.com', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'phoenix-website',
  organizationName: 'quantex',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [], 导航栏
  headerLinks: [
    // {href: "http://phoenix-website.sz.iquantex.com/docs/next/phoenix-1.x/about/introduction-1x", label: "Phoenix1.x"},
    {doc: 'phoenix-2.x/quick-start/phoenix-lite-2x', label: '文档'}, 
    {blog: true, label: '博客'},
    {page: 'users', label: '用户'},
    {page: 'help', label: '关于我们'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/phoenix1.png',
  footerIcon: 'img/phoenix1.png',
  favicon: 'img/phoenix1.png',

  /* Colors for website */
  colors: {
    primaryColor: '#822127',
    secondaryColor: '#5b171b',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright Â© ${new Date().getFullYear()} Phoenix Group`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  // 在此处添加将放置在<script>标记中的自定义脚本。
  scripts: ['js/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  // docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

    // blog 侧边栏默认显示的文章个数
    blogSidebarCount: 'ALL',
  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
