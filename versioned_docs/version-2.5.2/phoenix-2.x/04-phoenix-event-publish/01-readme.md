---
id: event-publish-readme
title: 功能介绍
---

Phoenix Event Publish是为独立部署的phoenix配套服务，提供领域事件发布服务。

## 功能

* 领域事件(DomainEvent)由Phoenix服务产生并持久化在EventStore中，Event-Publish服务通过定义不同的订阅任务从EventStore中读取领域事件，发送到指定消息队列中，以供其他服务订阅。
* Event-Publish服务定义了两个操作线程，事件读取线程与事件处理线程。读线程负责从EventStore中读取事件，将事件写入到阻塞队列中。事件处理线程负责推送监控数据与事件到消息队列中，并且回写读取事件的状态。
* Event-Publish服务可以共用户自定义事件处理器，由用户选择性拦截事件推送到消息队列。
* Event-Publish服务会保存所有事件发布任务的定义信息和运行状态，保证任务重启后可以从上次状态恢复，并保证订阅的消息有序、不丢地发到消息队列中（有消息重复）。
* Event-Publish服务支持高可用集群部署、多节点横向扩容。

![](../../assets/phoenix2.x/phoenix-event-publish/EventPublish.png)

## 名词定义

1. 事件发布服务（EventPublishService）：即本服务，用于将领域事件从EventStore存储中发布到外部（MQ）的服务。
2. 事件读取线程：负责从EventStore中读取事件，并且将事件写入到阻塞队列中。
3. 事件处理线程：
    - 从阻塞队列中读取事件
    - 发送事件监控数据到Elasticsearch
    - 发送事件到Kafka
    - 处理用户自定义的事件处理器
    - 回写事件的最大时间戳：任务对事件的读取基于时间戳区间，此值确定每次读取的左边界（开区间）
