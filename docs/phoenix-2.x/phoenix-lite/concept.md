---
id: phoenix-lite-concept-2x
title: 基本概念
---

## 消息相关

### 消息(Message)

Phoenix框架中，服务间使用消息进行数据通讯。

### 命令(Command)

命令是一种特定的消息，一般用于向服务发起请求，命令消息可驱动领域服务发生动作。

### 事件(Event)

事件是一种特定的消息，代表领域中已发生的结果，通过MQ发出，提供给其他服务订阅。

### 领域事件(DomainEvent)
领域事件是Phoenix用于保存聚合根状态而使用的事件存储结构，可以用于EventSourcing恢复聚合根状态

## 聚合根相关

### 聚合根类别  aggregateRootType

Phoenix服务由特定的领域聚合根定义，每个聚合根类会有一个聚合根类别，全局唯一，使用注解@EntityAggregateAnnotation标注其类别名称，长度不超过32字节。

### 聚合根ID  aggregateRootId 

Phoenix服务中一个聚合根类可以有多个聚合根对象，聚合根ID用于唯一标识一个聚合根对象，长度不超过64字节。

## EventSourcing相关

### 事件存储 EventStore

EventStore是用于存储和检索领域事件的Phoenix组件。

### 事件回溯 EventSourcing

通过领域事件重建聚合根状态，基于EventStore实现。

### 快照 Snapshot

对聚合根的状态进行保存，用于加速聚合根状态恢复的速度。

## 服务相关

### 服务名 applicationName

Phoenix是一套微服务框架，applicationName为每个服务的服务名，全局唯一。

## MQ相关

### 订阅主题  subscribeTopic

服务通过MQ接收消息，使用服务名作为订阅的topic名称。

## 路由相关
不同消息在系统中有不同的发送目的地，通过路由表定义某种消息类型的目标服务。

### 服务地址 

消息发送的目标服务地址，此地址即为目标服务订阅MQ的topic名称。

### 消息目的地址 dst

用于定义消息路由中消息的目标聚合根类别，其中dst中包含一下三个地址要素：
* 服务地址(serverName)
* 聚合类别(aggregateType) - 业务聚合根一般使用"EA"作为聚合类别。
* 聚合根类别(aggregateRootType)

格式：服务地址/聚合类别/聚合根类别

### 消息来源地址 src

用于标识一个消息的来源，在需要回复的场景中定位消息的发送目标topic。
  
格式：服务地址/聚合类别/聚合根类别

## 事务相关

### 事务ID transId

事务ID，唯一标识一个事务。

### 子事务Id subTransId

子事务ID，唯一标识一个子事务。

### 子事务类型 subTransactionType

子事务类型，有：SAGA, TCC。

### 子事务动作类型 subTransactionActionType  

* subTransactionType为SAGA时，值有：T， C
* subTransactionType为TCC时， 值有：Try, Confirm, Cancel