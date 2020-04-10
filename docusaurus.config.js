module.exports = {
  title: 'Phoenix',
  tagline: 'Phoenix',
  url: 'http://phoenix-website.sz.iquantex.com/',
  baseUrl: '/',
  favicon: 'img/phoenix.png',
  organizationName: 'quantex', // Usually your GitHub org/user name.
  projectName: 'phoenix', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: false,
    onPageNav: 'separate',
    navbar: {
      title: '',
      logo: {
        alt: 'Phoenix Logo',
        src: 'img/logo.png',
      },
      links: [
        { to: '/', label: '首页', position: 'right' },
        { to: 'docs/phoenix-2.x/phoenix/phoenix-2x', label: '文档', position: 'right' },
        { to: 'blog/rocketmq-in-phoenix', label: '博客', position: 'right' },
        { to: 'docs/phoenix-2.x/phoenix/phoenix-download-2x', label: '版本', position: 'right' },
        { to: 'https://github.com/PhoenixIQ', label: '社区', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '白皮书',
              to: 'docs/phoenix-2.x/phoenix/phoenix-2x',
            },
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
          title: '案例',
          items: [
            {
              label: '银行转账',
              href: 'https://github.com/PhoenixIQ/bank-account',
            },
            {
              label: '交易风控',
              href: 'https://github.com/PhoenixIQ/bank-account',
            },
            {
              label: '炒股大赛',
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
      copyright: `北京宽拓智融科技有限公司 Copyright @2013 - ${new Date().getFullYear()} iQuantex.com All Rights Reserved. 宽拓公司 版权所有`,
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
