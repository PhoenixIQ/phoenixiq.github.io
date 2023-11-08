---
id: phoenix-console-business-monitor
title: Phoenix ElasticSearch
description: Phoenix 和 ElasticSearch 的集成方案
---
Phoenix 通过 ElasticSearch + Grafana开源组件搭建业务监控系统，能够清晰的展示一段时间内的事件数据，有利于业务过程中快速排查异常数据和异常行为。业务监控系统为开发人员展示消息总数、异常总数、消息分布、消息过滤、节点列表、消息数量、消息内容、消息原始日志等诸多信息。

Phoenix 服务端提供的事件发布功能(Event-Publish-ES)将监控数据直接传入指定 ElasticSearch 中，用户端使用Grafana从 ElasticSearch 中获取数据，通过自定义仪表面板友好的展示出来。

![image](../assets/phoenix-console/business-monitor/001.png)

## 业务监控 \{#bus-monitor\}
#### 监控总览 \{#overall\}
监控总览能够非常直观的展示一段时间内的消息详情
![image-20200115192350535](../assets/phoenix-console/business-monitor/002.png)

#### 筛选栏 \{#filter\}
可以通过监控的信息进行自定义筛选，也可以通过表格中的加号进行筛选
![image-20200115111102393](../assets/phoenix-console/business-monitor/003.png)

#### 消息个数统计面板 \{#count\}
统计系统内各个消息的个数，包括消息总数，异常消息总数等统计信息
![image-20200115111030625](../assets/phoenix-console/business-monitor/004.png)

#### 消息详情 \{#detail\}
白面板对消息的一些重要指标进行单独展示，可以通过表格提供的筛选功能定位一条消息的处理流程
![message](../assets/phoenix-console/business-monitor/005.png)

#### 消息原始日志面板 \{#raw\}
展示数据的详细信息，这里展示了采集到的所有监控信息
![image-20200115111217069](../assets/phoenix-console/business-monitor/006.png)

该监控面板采用最近的grafana监控面板，鼠标移动到某条消息上可以展示完整的json数据
![image-20200115111217069](../assets/phoenix-console/business-monitor/007.png)

## 使用说明 \{#usage\}
1. 部署 ElasticSearch 和grafana

2. 启用 Event-Publish-ES 任务：
```yaml
quantex.phoenix.event-publish.monitor-task.enabled: true
```
3. 支持可配置的 ElasticSearch 地址，
默认是` ElasticSearch -master.phoenix-dev.svc.cluster.local:9200`
```yaml
quantex.phoenix.event-publish.monitor-task.es-server: 127.0.0.1:9200
```
4. 通过grafana获取 ElasticSearch 中的监控数据
- 在grafana中配置 ElasticSearch 数据源<br/>
![message](../assets/phoenix-console/business-monitor/008.png)

- 使用grafana一键导入面板，用于展示数据
![message](../assets/phoenix-console/business-monitor/009.png)

- 使用json-model数据即可快速生成phoenix message  ElasticSearch 监控面板：[model](../assets/file/phoenix-admin/message-es-model.md)
![message](../assets/phoenix-console/business-monitor/010.png)

- 当然，除了phoenix提供的监控指标之外，用户可以自定义业务指标来实现业务监控。具体指标定义，参考[grafana](https://grafana.com/)教程。
![message](../assets/phoenix-console/business-monitor/011.png)

