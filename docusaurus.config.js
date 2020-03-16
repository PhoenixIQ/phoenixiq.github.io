module.exports = {
    title: 'Phoenix',
    tagline: 'phoenix是一个消息驱动的有状态微服务框架',
    url: 'https://github.com/PhoenixIQ/PhoenixIQ.github.io',
    baseUrl: '/',
    favicon: 'img/phoenix.png',
    organizationName: 'PhoenixIQ', // Usually your GitHub org/user name.
    projectName: 'PhoenixIQ.github.io', // Usually your repo name.
    themeConfig: {
        sidebarCollapsible: false,
        navbar: {
            title: 'Phoenix',
            logo: {
                alt: 'Phoenix Logo',
                src: 'img/phoenix.png',
            },
            links: [
                {to: 'docs/phoenix-2.x/quick-start/phoenix-lite-2x', label: '文档', position: 'left'},
                {to: 'blog/rocketmq-in-phoenix', label: '博客', position: 'left'},
                {to: 'docs/phoenix-2.x/phoenix/phoenix-download-2x', label: '版本', position: 'left'},
                {to: 'https://github.com/PhoenixIQ', label: 'GitHub', position: 'right'},
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: '文档',
                    items: [
                        {
                            label: '快速入门',
                            to: 'docs/phoenix-2.x/quick-start/phoenix-lite-2x',
                        },
                        {
                            label: 'FAQ',
                            to: 'docs/phoenix-2.x/phoenix/phoenix-faq-2x',
                        },
                    ],
                },
                {
                    title: 'Example',
                    items: [
                        {
                            label: '账户管理',
                            href: 'https://github.com/PhoenixIQ/bank-account',
                        },
                    ],
                },
                {
                    title: '资源',
                    items: [
                        {
                            label: '博客',
                            to: 'blog',
                        },
                    ],
                },
            ],
            copyright: `Copyright Â© ${new Date().getFullYear()} Phoenix Group`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl:
                        'http://phoenix-website.sz.iquantex.com/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
