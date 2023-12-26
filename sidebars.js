/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    docs: [
        "introduce",
        {
            type: "category",
            label: "快速入门",
            collapsible: false,
            link: {
                type: 'generated-index',
                title: '快速入门',
                description: '从设计思想到入门案例快速入门!',
                slug: '/phoenix',
                keywords: ['guides'],
            },
            items: [
                "phoenix/why-event-driven-microservice",
                "phoenix/how-event-driven-microservice",
                {
                    type: "category",
                    label: "快速入门案例",
                    collapsible: true,
                    collapsed: true,
                    link: {
                        type: 'generated-index',
                        title: '快速入门案例',
                        description: 'Phoenix 快速入门案例',
                        slug: '/phoenix/quick-start-example',
                        keywords: ['quick-start'],
                    },
                    items: [
                        "phoenix/quick-start-example/bookings-architecture",
                        "phoenix/quick-start-example/setup-environment",
                        "phoenix/quick-start-example/bookings-microservice",
                        "phoenix/quick-start-example/popularity-projection",
                        "phoenix/quick-start-example/order-microservice",
                        "phoenix/quick-start-example/cluster",
                    ],
                },
                "phoenix/phoenix-all-future",
                "phoenix/phoenix-glossary",
                {
                    type: "category",
                    label: "Release Notes",
                    collapsible: true,
                    collapsed: true,
                    items: [
                        "phoenix/upgrade/2-5-x",
                        "phoenix/upgrade/2-6-x",
                    ],
                },
                "phoenix/license-upgrade",
                "phoenix/phoenix-faq",
            ],
        },
        {
            type: "category",
            label: "Phoenix Framework",
            collapsible: true,
            link: {
                type: 'generated-index',
                title: 'Phoenix Framework',
                description: 'Phoenix 框架核心文档',
                slug: '/phoenix-core',
                keywords: ['core'],
            },
            items: [
                "phoenix-core/phoenix-core-client",
                "phoenix-core/phoenix-core-entity-aggregate",
                "phoenix-core/phoenix-core-event-souring",
                "phoenix-core/phoenix-core-event-store",
                "phoenix-core/phoenix-subscribe-pub",
                "phoenix-core/phoenix-cluster-manager",
                {
                    type: 'category',
                    label: '高级特性',
                    items: [
                        "phoenix-advanced/aggregate-timer",
                        "phoenix-advanced/aggregate-segment",
                        "phoenix-advanced/phoenix-distributed-data",
                        'phoenix-advanced/phoenix-kafka-extend',
                        "phoenix-advanced/starvation-detector",
                        "phoenix-advanced/cluster-pool",
                        "phoenix-advanced/annotation-resolver",
                        "phoenix-advanced/extension",
                    ],
                },
                "phoenix-core/phoenix-core-config",
                "phoenix-core/phoenix-aggregate-test",
            ],
        },
        {
            type: "category",
            label: "Phoenix Transaction",
            collapsible: true,
            link: {
                type: 'generated-index',
                title: 'Phoenix Transaction',
                slug: '/phoenix-transaction',
                keywords: ['transaction'],
            },
            items: [
                "phoenix-transaction/phoenix-transaction-module",
                "phoenix-transaction/phoenix-transaction-aggregate",
                "phoenix-transaction/phoenix-transaction-sample",
            ],
        },
        {
            type: "category",
            label: "Phoenix Event Publish",
            collapsible: true,
            items: [
                "phoenix-event-publish/event-publish-readme",
                "phoenix-event-publish/event-publish-integration",
                "phoenix-event-publish/event-publish-client-usage",
            ],
        },
        {
            type: "category",
            label: "Phoenix DGC",
            collapsible: true,
            items: [
                "phoenix-dgc/phoenix-dgc-introduce",
                "phoenix-dgc/phoenix-dgc-api",
            ],
        },
        {
            type: "category",
            label: "Phoenix Observability",
            collapsible: true,
            link: {
                type: 'generated-index',
                title: 'Phoenix Observability',
                description: 'Phoenix 可观测性文档',
                slug: '/phoenix-observability',
                keywords: ['observability'],
            },
            items: [
                "phoenix-console/phoenix-console-overall",
                "phoenix-console/phoenix-console-service-management",
                "phoenix-console/phoenix-console-business-monitor",
                "phoenix-console/phoenix-console-system-monitor",
            ],
        },
        {
            type: "category",
            label: "测试报告",
            collapsible: true,
            items: [
                "phoenix-test/features-test",
                "phoenix-test/performance-test",
                "phoenix-test/available-test",
                "phoenix-test/elasticity-test",
                "phoenix-test/reliability-test",
                "phoenix-test/pressure-test",
                "phoenix-test/balance-test",
            ],
        },
    ],

    // But you can create a sidebar manually
    /*
    tutorialSidebar: [
      'intro',
      'hello',
      {
        type: 'category',
        label: 'Tutorial',
        items: ['tutorial-basics/create-a-document'],
      },
    ],
     */
};

module.exports = sidebars;
