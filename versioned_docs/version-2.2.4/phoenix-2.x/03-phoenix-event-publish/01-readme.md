---
id: event-publish-readme-2x
title: 功能介绍(旧版)
---

Phoenix Event Publish是为独立部署的phoenix配套服务，提供领域事件发布服务。

## 功能

* 领域事件(DomainEvent)由Phoenix服务产生并持久化在EventStore中，Event-Publish服务通过定义不同的订阅任务从EventStore中读取领域事件，发送到指定消息队列中，以供其他服务订阅。
* Event-Publish服务可以定义不同的事件发布任务（Task），每个事件发布任务需要配置其订阅的领域聚合根集合，该任务发布的事件仅由这些领域聚合根产生；同时事件发布任务需要指定发布的目标队列，由唯一的Topic定义。
* Event-Publish服务可以同时运行多个事件发布任务，每个任务有其独立定义和工作线程（Actor）。
* Event-Publish服务会保存所有事件发布任务的定义信息和运行状态，保证任务重启后可以从上次状态恢复，并保证订阅的消息有序、不丢地发到消息队列中（有消息重复）。
* Event-Publish服务支持高可用集群部署、多节点横向扩容。

![show](../../assets/phoenix2.x/phoenix-event-publish/EventPublish.svg)

## 名词定义

1. 事件发布服务（EventPublishService）：即本服务，用于将领域事件从EventStore存储中发布到外部（MQ）的服务。
2. 事件发布任务（EventPublishTask）：服务中可以注册不同的事件发布任务，每个任务有不同的领域聚合根订阅集合（Subscription），有不同的事件发布目标队列（MQ Topic），有独立的任务信息和状态存储，由独立的线程（Actor）负责运行。
3. 事件发布任务信息（Info）：
    * 任务名称（TaskName）
    * 任务订阅（Subscription）：任务订阅的领域聚合根类集合，发布的事件中仅包含这些领域聚合根产生的领域事件
    * 发布目标Topic（PublishTopic）：发布任务需要将事件发布到哪个topic中（目标topic使用单partition，默认发往partition-0）
4. 事件发布任务状态：
    * 是否处于运行状态（isRunning）：任务是否正在运行
    * 上次已读取的时间戳（lastReadTimestamp）：任务对事件的读取基于时间戳区间，此值确定每次读取的左边界（开区间）
