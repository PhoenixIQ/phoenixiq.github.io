// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
export default {
    title: 'Phoenix',
    tagline: 'Phoenix',
    favicon: 'img/phoenix.png',

    // Set the production url of your site here
    url: 'http://phoenix-website.sz.iquantex.com/',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'PhoenixIQ', // Usually your GitHub org/user name.
    projectName: 'phoenixiq.github.io',
    trailingSlash: false,
    deploymentBranch: 'gh-pages',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'zh-cn',
        locales: ['zh-cn'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/PhoenixIQ',
                    lastVersion: 'current',
                    versions: {
                        current: {
                            label: 'latest',
                            path: '',
                        },
                    },
                    remarkPlugins: [math],
                    rehypePlugins: [katex],
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/PhoenixIQ',
                    feedOptions: {
                             createFeedItems: async (params) => {
                               const {blogPosts, defaultCreateFeedItems, ...rest} = params;
                               return defaultCreateFeedItems({
                                 // keep only the 10 most recent blog posts in the feed
                                 blogPosts: blogPosts.filter((item, index) => index < 10),
                                 ...rest,
                               });
                             },
                           },
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    themes: [
        [
            require.resolve("@easyops-cn/docusaurus-search-local"),
            ({
                // ... Your options.
                // `hashed` is recommended as long-term-cache of index file is possible.
                hashed: true,
                // For Docs using Chinese, The `language` is recommended to set to:
                // ```
                language: ["en", "zh"],
                // ```
            }),
        ]
    ],
    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: '',
                logo: {
                    alt: "Phoenix Logo",
                    src: "img/logo.png",
                    srcDark: 'img/logo_dark.png',
                },
                items: [
                    {to: "/", label: "首页", position: "left"},
                    {
                        type: 'dropdown',
                        label: '文档',
                        position: 'left',
                        items: [
                            {
                                label: '介绍',
                                to: "/docs/introduce"
                            },
                            {
                                label: '快速入门',
                                to: "/docs/phoenix"
                            },
                            {
                                label: 'Phoenix 框架',
                                to: "/docs/phoenix-core"
                            },
                            {
                                label: 'Phoenix 事务',
                                to: "/docs/phoenix-transaction"
                            },
                            {
                                label: 'Phoenix 可观测性',
                                to: "/docs/phoenix-observability"
                            },
                        ],
                    },
                    // {
                    //     type: 'docSidebar',
                    //     sidebarId: 'docs',
                    //     position: 'left',
                    //     label: '文档',
                    // },
                    {to: 'blog/', label: '博客', position: 'left'},
                    {type: "docsVersionDropdown", position: "right"},
                    {
                        href: 'https://github.com/PhoenixIQ',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            docs: {
                sidebar: {
                    hideable: false,
                    autoCollapseCategories: true,
                },
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "文档",
                        items: [
                            {
                                label: "Phoenix介绍",
                                to: "docs/introduce",
                            },
                            {
                                label: "快速入门",
                                to: "docs/phoenix/quick-start-example/bookings-architecture",
                            },
                        ],
                    },
                    {
                        title: "案例",
                        items: [
                            {
                                label: "账户管理",
                                href: "https://github.com/PhoenixIQ/phoenix-samples/tree/master/bank-account",
                            },
                            {
                                label: "交易风控",
                                href: "https://github.com/PhoenixIQ/phoenix-sample-risk",
                            },
                            {
                                label: "购物车",
                                href: "https://github.com/PhoenixIQ/phoenix-samples/tree/master/shopping-cart",
                            },
                            {
                                label: "酒店预订",
                                href: "https://github.com/PhoenixIQ/hotel-booking",
                            },
                        ],
                    },
                    {
                        title: "资源",
                        items: [
                            {
                                label: "博客",
                                to: "blog",
                            },
                        ],
                    },
                ],
                copyright: `北京宽拓智融科技有限公司 Copyright @2013 - ${new Date().getFullYear()} iQuantex.com All Rights Reserved. 宽拓公司 版权所有`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['java','bash', 'diff', 'json'],
            },
            // 目录最大最小级别. 取 Header 的级别. 2-4 等于三级.
            tableOfContents: {
                minHeadingLevel: 2,
                maxHeadingLevel: 4,
            },
        }),
    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
        type: 'text/css',
        integrity:
          'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
        crossorigin: 'anonymous',
      },
    ],
    markdown: {
        mdx1Compat: {
            comments: true,
            admonitions: true,
            headingIds: true,
        },
    }
};