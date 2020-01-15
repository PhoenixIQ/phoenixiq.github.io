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

### 命令 cmd

定义：

- 请求，未发生

相关概念：

- 命令Id cmdId

### 事件 event

定义：

- 事实，已发生


## 聚合根相关

### 聚合根类别  aggregateRootType

定义：

* phoenix中，每个聚合根类会有一个聚合根类别，用于区分不同的聚合根类，全局唯一
* 长度不超过32字节

### 聚合根ID  aggregateRootId 

定义：

* 聚合根类的唯一标识，在同一个聚合根类别下唯一
* 长度不超过64字节


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