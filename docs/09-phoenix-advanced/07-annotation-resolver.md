---
id: annotation-resolver
title: 注解解析器
description: 用于将 Spring 配置解析成注解配置
---

## 简介 \{#introduce\}

聚合根注解中的大部分配置用于聚合根的运行性能调优，不限于运行模式、攒批次数、快照间隔等，然而在实际生产运行中，需要通过修改代码的方式来让注解生效是十分不利于频繁的压测以及紧急配置修复的。
因此 Phoenix 内置了注解解析器用于将 Spring 的配置解析成聚合根的注解配置，可用于以下两种类型：

- `@EntityAggregateAnnotation`: 实体聚合根注解
- `@TransactionAggregateAnnotation`: 事务聚合根注解

从 Phoenix 2.2.4开始，依赖了 phoenix-stater 的环境下，聚合根支持从启动参数/环境变量/配置文件中读取参数。

> 在 Phoenix 2.6.0 开始，事务支持也支持注解解析

配置优先级:启动参数 > 环境变量 > 配置文件 > 代码注解自定义 > 注解默认值

聚合根 Spring 的通用配置层次如下：

```yaml
quantex:
  phoenix:
    server:
      <注解类型：entityAggregate/transactionAggregate>:
        <聚合根类型: XX>
          <注解配置1: surviveTime>: 1000
          <注解配置2: batchWeight>: 200

```


## 实体聚合根注解 \{#entity-annotation-config\}

实体聚合根的注解以：`quantex.phoenix.server.entityAggregate` 开头, 并在后面附加聚合根类型和实际注解

| 配置项                                                                                  | 描述                             | 类型          | 对应的注解函数                 |
|:-------------------------------------------------------------------------------------|:-------------------------------|:------------|:------------------------|
| `{aggregateRootType}`                                                                | 聚合根类型，无法从配置文件中读取               | String      | aggregateRootType       |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.surviveTime`             | 聚合根生存时间                        | long        | surviveTime             |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.snapshotMode`            | 快照模式                           | enum        | snapshotMode            |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.snapshotInterval`        | 快照间隔                           | long        | snapshotInterval        |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.numberOfRetainSnapshots` | 需要保留的快照数量                      | long        | numberOfRetainSnapshots |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.idempotentSize`          | 聚合根幂等集合大小                      | long        | idempotentSize          |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.bloomSize`               | 布隆过滤器大小                        | long        | bloomSize               |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.dispatcher`              | 聚合根运行线程池                       | string      | dispatcher              |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.runningMode`             | 聚合根运行模式                        | enum string | runningMode             |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.allowPassivation`        | 聚合根是否允许钝化                      | boolean     | allowPassivation        |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.batchWeight`             | 聚合根消息攒批的最大批次                   | int         | batchWeight             |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.bufferSize`              | 异步模式下，持久化时允许缓存的消息批次（package)数量 | Int         | bufferSize              |

以yaml配置文件为例:

当使用了`@EntityAggregateAnnotation`，并且`aggregateRootType`为`BankAccount`。则:

```yaml
quantex:
  phoenix:
    server:
      entityAggregate:
        BankAccount: # {aggregateRootType}
          surviveTime: 10
          snapshotInterval: 10
          idempotentSize: 10
          bloomSize: 10
```


## 事务聚合根注解 \{#transaction-annotation-config\}

事务聚合根的注解以：`quantex.phoenix.server.transactionAggregate` 开头, 并在后面附加聚合根类型和实际注解

| 配置项                                                                                      | 描述                | 类型     | 对应的注解函数                |
|:-----------------------------------------------------------------------------------------|:------------------|:-------|:-----------------------|
| `{aggregateRootType}`                                                                    | 聚合根类型，无法从配置文件中读取  | String | aggregateRootType      |
| `quantex.phoenix.server.transactionAggregate.{aggregateRootType}.heartbeatTickInterval`  | 心跳滴答间隔(秒)         | int    | heartbeatTickInterval  |
| `quantex.phoenix.server.transactionAggregate.{aggregateRootType}.heartbeatCheckInterval` | 心跳检查间隔(秒)         | int    | heartbeatCheckInterval |
| `quantex.phoenix.server.transactionAggregate.{aggregateRootType}.retryStrategy`          | 重试策略(指数退避和固定频率)   | enum   | retryStrategy          |
| `quantex.phoenix.server.transactionAggregate.{aggregateRootType}.maxRetryNum`            | 事务总超时次数(最大心跳检查间隔） | long   | maxRetryNum            |
| `quantex.phoenix.server.transactionAggregate.{aggregateRootType}.batchWeight`            | 聚合根消息攒批的最大批次      | int    | batchWeight            |

以yaml配置文件为例:

当使用了`@TransactionAggregateAnnotation`，并且`aggregateRootType`为`BankTransferSaga`。则:

```yaml
quantex:
  phoenix:
    server:
      transactionAggregate:
        BankTransferSaga: # {aggregateRootType}
          heartbeatTickInterval: 2
          heartbeatCheckInterval: 2
          maxRetryNum: 10
```
