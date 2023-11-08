---
id: event-publish-integration-2x
title: 使用说明
---

Phoenix中提供了可集成于Phoenix Server服务中的EventPublish功能模块，启用该模块可直接在Phoenix服务中运行Event Publish任务，服务部署时可通过配置定义Event Publish任务。

## 引用依赖

```xml
<dependency>
  <groupId>com.iquantex</groupId>
  <artifactId>phoenix-event-publish-starter</artifactId>
  <version>2.2.4</version>
</dependency>
```

## 功能

* 可在phoenix服务中开启event-publish能力，扫描event-store中的领域事件，发布到特定的kafka topic。
* 可在phoenix服务配置中定义event-publish模块的运行参数和定义event-stask与monitor-task,event-stask用于将phoenix处理事件转发至指定的topic，monitor-task可以采集phoenix处理的消息信息，推送给phoenix-amdin进行监控
* event-publish任务保证读取的event-store领域事件完整性，不出现事件遗漏、丢失。
* event-publish任务保证相同的聚合根ID的领域事件按照version严格递增的顺序投递到kafka。
* event-publish任务支持多节点负载均衡和高可用，需要依赖phoenix服务本身的akka集群能力。

## 使用说明

phoenix-event-publish功能模块对phoenix服务本身没有代码入侵，要打开event-publish功能模块，仅需要使用`quantex.phoenix.event-publish`配置。

要开启event-publish功能模块，需要将phoenix服务的`quantex.phoenix.event-publsh.enabled`配置置为"true"，以下为event-publish通用配置的说明：

| 配置项                                                   | 描述                                                         | 类型    | 默认值              |
| -------------------------------------------------------- | ------------------------------------------------------------ | ------- | ------------------- |
| quantex.phoenix.event-publish.batch-size                 | 批量大小                                                     | int     | 128                 |
| quantex.phoenix.event-publish.buffer-queue-size          | 缓存队列大小                                                 | int     | 64                  |
| quantex.phoenix.event-publish.state-table-name           | EventPublish状态表名称                                       | String  | event_publish_state |
| quantex.phoenix.event-publish.fromBegin                  | 新建状态或状态不存在时，是否重置读取位置到EventStore最早时间戳 | boolean | false               |

以上配置为event-publish功能模块的通用配置，应用于服务内所有event-publish任务。

### Event Publish 任务定义

event-publish模块完全使用配置定义和声明服务中需要运行的event-publish任务，以下为定义任务的配置说明：

|配置名称|配置说明|可选值|默认值|备注|
|-------|-------|------|-----|----|
| quantex.phoenix.event-publish.event-task.enabled         | 是否开启领域事件发布                                         | boolean | true                |
| quantex.phoenix.event-publish.event-task.topic           | 领域事件发布的目标topic                                      | String  | 无                  |
| quantex.phoenix.event-publish.monitor-task.enabled       | 是否开启消息监控上报任务                                     | boolean | true                |
| quantex.phoenix.event-publish.monitor-task.broker-server | 消息监控上报的kafka服务地址                                  | String  | 无                  |
| quantex.phoenix.event-publish.monitor-task.topic         | 消息监控上报的目标topic                                      | String  | 无                  |

使用示例：

```yaml
quantex:
  phoenix:
    event-publish:
      batch-size: 64
      buffer-queue-size: 64
      from-begin: true
      event-task:
        enabled: true
        topic: bank-account-event-pub
      monitor-task:
        enabled: true
        broker-server: 127.0.0.1:9092
        topic: bank-account-monitor
```
