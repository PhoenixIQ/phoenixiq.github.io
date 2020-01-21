module.exports = {
    title: 'Phoenix',
    tagline: 'phoenix是一个消息驱动的有状态微服务框架',
    url: 'http://phoenix-website.sz.iquantex.com/',
    baseUrl: '/',
    favicon: 'img/phoenix.png',
    organizationName: 'quantex', // Usually your GitHub org/user name.
    projectName: 'phoenix', // Usually your repo name.
    themeConfig: {
        sidebarCollapsible: false,
        navbar: {
            title: 'Phoenix',
            logo: {
                alt: 'Phoenix Logo',
                src: 'img/phoenix.png',
            },
            links: [
                {to: 'docs/phoenix-2.x/quick-start/phoenix-lite-2x', label: '文档', position: 'right'},
                {to: 'blog', label: '博客', position: 'right'},
                {to: 'docs/phoenix-2.x/phoenix/phoenix-faq-2x', label: '社区', position: 'right'},
                {to: 'docs/phoenix-2.x/phoenix/phoenix-version-2x', label: '下载', position: 'right'},
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
                    ],
                },
                {
                    title: '社区',
                    items: [
                        {
                            label: '博客',
                            to: 'blog',
                        },
                        {
                            label: '公开仓库',
                            href: 'https://gitlab.iquantex.com/phoenix-public/bank-account.git',
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
