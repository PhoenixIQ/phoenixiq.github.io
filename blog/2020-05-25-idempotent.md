---
slug: idempotent
title: Phoenix 是如何实现幂等的
authors: zhengJie
tags: [Idempotent, IdempotentId]
---


> **幂等**：在编程中一个幂等操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同。

## 介绍

**Phoenix**在执行**act**方法前都会对**command message**进行幂等判断，如果消息已处理则直接返回处理结果，不再执行**act**方法和**on**方法。

{/* truncate */}

![总体流程图](images/idempotent/001-overall.png)

## 幂等ID

可以在`@CommandHandler`注解中定义幂等字段，**Phoenix**会调用相应字段的**get**方法并拼接为一个幂等ID，如果为定义则**Phoenix**会生成一个**UUID**来用作幂等ID。如果获取幂等ID失败，将抛出异常事件。

## 幂等判断

**Phoenix**幂等逻辑包含两部分：**内存幂等**和**数据库幂等**，处理顺序为：

`cmdMsg >> 内存幂等  >> 数据库幂等  >> act方法`

### 内存幂等

在**Phoenix**中维护了一个`LinkedHashMap`类型的幂等集合：**key**为幂等ID，**value**为结果事件。在执行内存幂等前会受先通过内存幂等集合来判断幂等，如果判断消息已处理过，则从幂等缓存中读取结果事件直接返回，否则执行后续操作。内存幂等集合大小可以通过参数进行配置，超过该大小的保存在幂等集合的消息将按照先进先出消息丢弃

- 内存幂等集合大小配置

内存幂等集合大小为聚合根级别，可以通过`@EntityAggregateAnnotation`的`idempotentSize`属性进行配置，**默认值:**1000

### 数据库幂等

数据库幂等在内存幂等之后，如果内存幂等判定为未处理，且消息为重试消息，则会根`aggregateId`（聚合id）和`idempotentId`（幂等id）查询数据库。

