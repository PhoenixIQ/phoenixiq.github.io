---
id: phoenix-core-2x
title: Phoenix Core(暂时拿掉)
---



## 总览

完整的Phoenix架构包含Phoenix Core、Phoenix-event-publish、Phoenix-admin等多个模块，基于这些模块我们可以轻松开发出有状态的响应式微服务项目，同时具有高度的可用性、扩展性、易运维与易监控等特性。

Phoenix Core是Phoenix架构的核心部分，本文简要阐述在Phoenix Core里的流程和核心概念，让读者对Phoenix有一个初步了解。



**名词解释**

Phoenix server：Phoenix中的业务处理服务。

Transaction server：Phoenix中的事务协调服务。

DomainEvent：Phoenix存储到EventStore供EventSourcing的事件。

EventSourcing：事件溯源技术，帮助重塑内存状态。



**根据上面的调用流程示意图，进行简要说明**

1. Client发起同步调用，发送Request请求至MQ。
2. Transaction server从MQ中接收Request请求，分发到相应的事务聚合根，维护事务相应的状态，存储DomainEvent至EventStore。
3. Transaction server发送Command至MQ。
4. Phoenix server从MQ中接收Command，分发到相应的实体聚合根，进行相应的处理，存储DomainEvent至EventStore。
5. Phoenix server发送Event至MQ。
6. Transaction server从MQ中接收Event，分发至相应的业务聚合根，维护事务状态，判定为事务结束，存储DomainEvent至EventStore。
7. Transaction server发送Response至MQ。
8. Client接收到Response，同步请求结束。



## 客户端介绍
Phoenix Client用于向Phoenix Server（业务处理Server或者事务Server）发起调用。分同步调用和异步调用两种方式。

* 同步调用：阻塞至接收到此次事务结果（无论事务成功或者失败）再返回。

* 异步调用：发送完毕就返回，无法感知到事务的成功或者失败。

  

## 实体聚合根

领域模型中的一个概念，是最通用的聚合根，用来处理用户业务相关的一组聚合数据，用户需要自定义聚合根类和聚合根ID，并维护自己想要的数据结构。

> 聚合：DDD（领域驱动设计）理论中的概念，聚合是一组相关实体的集合，每个聚合定义了一个清晰的边界（边界定义了聚合跟内部都有什么）和一个聚合根。



**Phoenix中的数据分片介绍**

Phoenix基于Akka-Sharding，可以使得Phoenix集群内每个实例节点都分布有不同的shard，每个shard里会有1个以上的actor，Phoenix在每个actor里维护了一个业务聚合根，因此，Phoenix实现了聚合根的分片。

当发生节点故障的时候，处于该节点上的shards会自动漂移到存活节点上，每个shard上所有的实体聚合根都会重新进行EventSourcing，来恢复内存状态。因此Phoenix在数据分片的同时，也能保证数据的可靠性。




## 事务聚合根

Phoenix中进行分布式事务管理的基本单元，聚合根ID为事务ID。在事务聚合根中维护了事务的状态，每处理一个消息，会对事务状态进行相应的修改。

事务聚合根和实体聚合根一样，也有sharding能力，也可以根据EventSourcing重塑内存状态。



## 事件管理

EventStore是Phoenix中的存储层，进行DomainEvent的存储和读取。

当聚合根接收消息并处理后，会产生DomainEvent并持久化到EventStore。EventSourcing的时候，就是借助这些DomainEvent来恢复内存状态的。

DomainEvent中带有聚合根版本字段，EventStore中聚合根版本是联合索引中的一个索引，在写库的时候，可以通过唯一键约束来避免脑裂问题带来的数据重复处理。

Phoenix在实现EventStore的时候提供了分库分表能力，提升了读写数据库的负载能力；同时，借助快照功能，加速EventSourcing的速度。





