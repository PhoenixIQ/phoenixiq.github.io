---
id: event-publish-integration-2x
title: 集成使用
---

Phoenix中提供了可集成于Phoenix Server服务中的EventPublish功能模块，启用该模块可直接在Phoenix服务中运行Event Publish任务，服务部署时可通过配置定义Event Publish任务。

## 引用依赖

phoenix-event-publish模块在phoenix 2.1.5版本中提供，引用依赖如下：

```xml
<dependency>
  <groupId>com.iquantex</groupId>
  <artifactId>phoenix-event-publish-starter</artifactId>
</dependency>
```

## 功能

* 可在phoenix服务中开启event-publish能力，扫描event-store中的领域事件，发布到特定的kafka topic。
* 可在phoenix服务配置中定义event-publish模块的运行参数和定义若干event-publish任务，任务定义可设置任务名称、订阅聚合根、目标topic和相关参数，event-publish模块根据配置中的定义开启event-publish任务。
* event-publish任务保证读取的event-store领域事件完整性，不出现事件遗漏、丢失。
* event-publish任务保证相同的聚合根ID的领域事件按照version严格递增的顺序投递到kafka。
* event-publish任务支持多节点负载均衡和高可用，需要依赖phoenix服务本身的akka集群能力。

## 使用说明

phoenix-event-publish功能模块对phoenix服务本身没有代码入侵，要打开event-publish功能模块，仅需要使用`quantex.phoenix.event-publish`配置。

要开启event-publish功能模块，需要将phoenix服务的`quantex.phoenix.event-publsh.enabled`配置置为"true"，以下为event-publish通用配置的说明：

|配置名称|配置说明|可选值|默认值|备注|
|-------|-------|------|-----|----|
|quantex.phoenix.event-publish.enabled|event-publish功能模块开关|true/false|false|/|
|quantex.phoenix.event-publish.manager-driver|event-publish任务状态存储数据源驱动|"oracle.jdbc.OracleDriver"/"com.mysql.jdbc.Driver"/"org.h2.Driver"|/|/|
|quantex.phoenix.event-publish.manager-data-source.url|event-publish任务状态存储数据源URL|/|/|/|
|quantex.phoenix.event-publish.manager-data-source.username|event-publish任务状态存储数据源username|/|/|/|
|quantex.phoenix.event-publish.manager-data-source.password|event-publish任务状态存储数据源password|/|/|/|
|quantex.phoenix.event-publish.mq-address|event-publish任务领域事件发送的目标MQ地址|/|/|/|
|quantex.phoenix.event-publish.mq-type|event-publish任务领域事件发送的目标MQ类型|"kafka"|"kafka"|目前仅支持"kafka"|
|quantex.phoenix.event-publish.batch-size|event-publish任务每次读取批次的最大事件数量限制|[8, 16384]|32|/|
|quantex.phoenix.event-publish.buffer-queue-size|event-publish任务读取和发送之间缓存队列大小|[1, MAX]|32|/|

以上配置为event-publish功能模块的通用配置，应用于服务内所有event-publish任务。

### Event Publish 任务定义

event-publish模块完全使用配置定义和声明服务中需要运行的event-publish任务，以下为定义任务的配置说明：

|配置名称|配置说明|可选值|默认值|备注|
|-------|-------|------|-----|----|
|quantex.phoenix.event-publish.tasks[].name|event-publish任务名称|/|/|非空串，用于唯一识别一个任务|
|quantex.phoenix.event-publish.tasks[].subscription[]|event-publish任务订阅的聚合根类型名称列表|/|/|/|
|quantex.phoenix.event-publish.tasks[].target-topic|event-publish任务发送的目标MQ topic|/|/|/|
|quantex.phoenix.event-publish.tasks[].auto-reset|event-publish任务在新建和任务状态丢失时，如何重置读取位置状态|"begin"/"end"|begin|

使用示例：

```yaml
quantex:
  phoenix:
    event-publish:
      enabled: true
      manager-driver: oracle.jdbc.OracleDriver
      manager-data-source:
        url: jdbc:oracle:thin:@localhost:1521/PDB
        username: test
        password: test
      mq-address: localhost:9092
      mq-type: kafka
      batch-size: 64
      tasks:
        - name: sample-event-publish-1
          subscription:
            - SomeAggregateA
            - SomeAggregateB
          target-topic: sample-event-publish-1
        - name: sample-event-publish-2
          subscription:
            - SomeAggregateC
          target-topic: sample-event-publish-2
```
