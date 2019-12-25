---
id: phoenix-lite-concept-2x
title: 基本概念
---

## 消息相关

### 消息 msg

定义：

- phoenix 中，消息用于服务跟服务之间的通讯

相关概念：

* 消息的ID，全局唯一

### 父消息 parentMsg

定义：

- 在 phoenix 中，一个消息会产生另外一个消息，则前者为后者的父消息

相关概念：

* 父消息Id  parentMsgId

### 命令 cmd

定义：

- 请求，未发生

相关概念：

- 命令Id cmdId

### 事件 event

定义：

- 事实，已发生

### 领域事件 DomainEvent

定义：

- 领域专家所关心的发生在领域中的一些事件


## 聚合根相关

### 聚合  aggregate

定义：

- 聚合是一组相关实体的集合，每个聚合定义了一个清晰的边界（边界定义了聚合跟内部都有什么）和定义了一个聚合根

### 聚合ID aggregateId

定义：

* phoenix中，聚合对象的唯一标识，全局唯一； 格式： 聚合类别/聚合根类别/聚合根ID
* 长度不超过128字节

### 聚合类别 aggregateType

定义：

* phoenix中，定义了一些封装好的特定功能聚合，采用聚合类别进行区分。 
* 长度不超过16字节
* 如下提到的EntityAggregate、TransactionAggreate等； 

## 聚合版本 version

定义：

- phoenix中，聚合内发生了事件后，自生状态会发生变化，每产生一个事件改变状态，版本+1

### 聚合根 aggregateRoot

定义: 

- 聚合根是聚合所包含的一个特定的实体；
- 聚合内的所有实体中，只有聚合根才能被外部对象引用；
- 外部对象访问聚合内部其它实体，只能通过聚合根。

### 聚合根类别  aggregateRootType

定义：

* phoenix中，每个聚合根类会有一个聚合根类别，用于区分不同的聚合根类，全局唯一
* 长度不超过32字节

### 聚合根ID  aggregateRootId 

定义：

* 聚合根类的唯一标识，在同一个聚合根类别下唯一
* 长度不超过64字节

### 实体聚合 EntityAggregate

定义：

- phoniex中，最通用的聚合封装类， 跟聚合等价。 聚合类别为：EA

### 事务聚合 TransactionAggregate

定义：

- 特定类别的聚合，定义了事务边界：具有SAGA、TCC事务支持。 聚合类别为：TA

### 至少一次投递聚合 AtLeastOneDiliveryAggregate

定义：

- 特定类别的聚合； 聚合类别为：AA

## EventSourcing相关

### 事件存储 EeventStore ES

定义：

- 存储领域事件

### 事件回溯 EventSourcing ES

定义：

- 通过领域事件重建聚合

### 快照 Snapshot

定义：

- 快照用于加速事件回溯速度

## 服务相关

### 服务名 applicationName

定义：

- phoenix是一套微服务框架，applicationName为每个服务的名字，全局唯一

## mq相关

### 订阅主题  subscribeTopic

定义：

- 服务采用MQ对外通讯时， 订阅主题为服务用于接收消息的topic名字

## 路由相关

### 服务地址 

定义：

- 服务采用mq通讯对外通讯时，采用服务接收的topic名字

### 消息目的地址 dst

定义：

- 用于路由消息到聚合根对象       格式： 服务地址/聚合类别/聚合根类别

### 消息来源地址 src

定义：

- 用于标识一个消息的来源，用于在需要回复的场景中进行消息回复。
  格式：服务地址/聚合类别/聚合根类别


## 事务相关

### 事务ID transId

定义：

- 事务 Id

### 子事务Id subTransId

定义：子事务 Id

### 子事务类型 subTransactionType

定义：

- 分类有：SAGA， TCC

### 子事务动作类型 subTransactionActionType  

定义：

* subTransactionType为SAGA时，值有：T， C
* subTransactionType为TCC时， 值有：Try, Confirm, Cancel


## 分布式相关

* 分组  shard
* 分组Id， shardId