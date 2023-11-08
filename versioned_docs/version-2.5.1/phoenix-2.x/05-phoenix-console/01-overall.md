---
id: phoenix-console-overall
title: 服务架构
---

Phoenix 提供了监控管理平台，支持对 Phoenix 服务进行系统状态管理、事件管理、性能监控、业务监控、事务调用链追踪以及异常分析。

![image](../../assets/phoenix2.x/phoenix-console/overall/001.png)

## 服务管理

Phoenix 原生支持系统状态管理、事件管理、事务调用链追踪以及异常分析等功能。

更详细的功能介绍可参考：[服务管理](./02-service-management.md)

:::info

为了更好的对 Phoenix 服务的性能以及业务信息进行监控，Phoenix 需要借助一些第三方的监控组件，例如Grafana、Elasticsearch、Prometheus。

:::

## 业务监控

Event-publish-es 是 Phoenix 框架提供的一个 Event Publish 任务, 该任务可以将 Phoenix 服务处理过的事件进行转换并上报至 Elasticsearch , Grafana 通过读取 Elasticsearch 中的数据进行可视化的展示。

同时 Phoenix 还提供了一组业务数据的监控面板，可以更方便的供开发人员进行使用。更详细的功能介绍可参考：[业务监控](./03-business-monitor.md)

## 系统监控

Phoenix 框架默认集成了 Prometheus Agent 同时配合 [Java Management Extensions (JMX)](https://en.wikipedia.org/wiki/Java_Management_Extensions) 对系统中的一些关键系统节点进行埋点。系统监控数据最终将通过 Grafana 进行可视化的展示。

同样的 Phoenix 也提供了一组系统数据的监控面板，可以更方便的共开发人员进行使用。更详细的功能介绍可参考：[系统监控](./04-system-monitor.md)

## 快捷部署

业务监控和系统监控需要依赖于prometheus，grafna，elasticsearch，并且需要导入Phoenix配置的[面板数据](../../assets/file/phoenix-admin/system-monitor-model.md)。

如果你在公司环境，可以通过rancher一键部署这三个服务在开发环境中使用，这样部署的服务默认集成了phoenix相关的grafna面板，可以直接使用。当然，如果是生产环境，建议让运维部署好这三个服务，然后通过后面[业务监控](./03-business-monitor.md)和[系统监控](./04-system-monitor.md)中的使用说明在grafna中手工配置和导入。

**rancher一键部署:**

1. 登陆rancher，打开应用商城，点击**启动**按钮。

![](../../assets/phoenix2.x/phoenix-console/overall/002.png)

2. 搜索phoenix-metric，点击。

![](../../assets/phoenix2.x/phoenix-console/overall/003.png)

3. 可以自定义名称和命名空间，点击**启动**即可部署好三个服务了。

![](../../assets/phoenix2.x/phoenix-console/overall/004.png)

![](../../assets/phoenix2.x/phoenix-console/overall/005.png)


