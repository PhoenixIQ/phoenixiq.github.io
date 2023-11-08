---
id: phoenix-core-event-store
title: 事件存储
description: 事件的存储方式
---

## 设计思想 \{#principle\}
Phoenix维护内存状态，核心能力是使用EventSourcing技术，Phoenix会定时打快照用来加速EventSourcing的恢复。

![show](../assets/phoenix-lite/eventsouring.png)

## EventStore-JDBC \{#jdbc\}

Phoenix 默认使用的是 JDBC 版本的 EventStore, 请按下面步骤进行配置

1. 引用 phoenix-server-starter 的依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-server-starter</artifactId>
   <version>2.6.1</version>
</dependency>
```

2. 在`application.yaml`中增加EventStore配置

其中可以给一个`DataSources`增加`label`隔离业务使用和系统使用,一般用于性能测试

```yaml
quantex:
  phoenix:
      event-store:
        driver-class-name: org.h2.Driver
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
          - url: jdbc:h2:file:./data2/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
            label: reliablity   # 配置Label让资源隔离(性能测试用)
        initial-size: 0
        min-idle: 0
        max-active: 8
```

3. 如果在测试过程中不想使用 EventStore 功能，可以进行如下配置：

```yaml
quantex:
  phoenix:
      event-store:
        no-eventstore: true
```

## 事件归档 \{#archive\}

在选择JDBC支持的数据库时，由于有些数据库不具备动态扩容的功能，事件的存储并不能一直存储下去，需要定期归档。目前调研下来的数据库有

- 不支持动态扩容的: MySQL,Oracle
- 支持动态扩容的: TIDB

数据库归档存在手动/自动触发两种方式

1. 快照数量触发归档：当快照数量累计到一定数量后触发一次归档（最大累积快照数量可配置，默认不触发归档）
2. 手动一键归档： 在 `PhoenixConsole` 的事件管理中，通过 API 触发一键全量归档.

:::info 配置提示

最大累积快照数量配置：`numberOfRetainSnapshots` （int） 默认为 `Integer.MAX_VALUE`，不触发归档 （聚合根级别配置）

:::

```
@EntityAggregateAnnotation(
        aggregateRootType = "BankAccount",
        idempotentSize = 100,
        snapshotInterval = 100000,
        numberOfRetainSnapshots = 2)
```

当配置了最大累积快照数量的聚合根时, 如上图的配置将会在聚合根触发第三次快照归档, 即聚合根到达第 300000 版本时, 会触发归档删掉 0~100000 版本的事件及快照.

## 切片模式 \{#slice-mode\}

EventStore-JDBC 支持切片模式, 当使用切片模式时, 每个事件会根据聚合根 ID 的不同被切分到 1024 个分片中, 并存储到 EventStore 中新增的 Slice 字段中.

在此模式下, 因为索引字短增加所以插入性能有略微下降, 但是 Slice 模式下能够支持启动多个 EventPublish 线程.

:::caution

此模式不与原有的 Time 模式兼容, 当切换时必须清理数据库表并由 Phoenix 重建.

:::

### 使用说明 \{#useage\}

使用配置 `quantex.phoenix.server.event-store.event-query-type` 可以切换 EventStore 的模式, 可选模式为：

- time：默认模式
- slice：切片模式

## 数据库类型 \{#type\}

Phoenix 默认使用 JDBC 作为事件溯源的存储方式，以此实现聚合根的 ACID 特性。虽然这并不提倡，但我们仍然开放了一些其他存储方式供用户选择：

- **jdbc**：默认的存储方式
- **none**：无存储，所有聚合根事件仅会尽力而为的交付到 Phoenix Client 的 RPC Reply、sendNoReply 的 `sourceTopic` 中，此模式下 EventPublish 不可用
- **memory**：内存存储，使用 JVM 内存上的多层次散列表存储聚合根持久化事件，当 JVM 重启后，事件丢失。（虽然我们也为此模式提供了 Console 的支持，但我们只推荐该模式用于集成测试中，对于本地开发，推荐使用 JDBC + H2 Database）
- **async**：异步的 JDBC 存储，在此模式下，事件持久化的是尽力而为的模式，当异步持久化的缓冲区已满时，通过用户配置的溢出策略对未在队列的事件进行决策。
（**注意，此模式下可能导致聚合根无法成功溯源，因为缺失了部分版本的事件信息，如需重启，请提前在 Console 上为聚合根触发快照；对于可靠性投递，为了保证正确溯源，在此模式下也仍然使用 JDBC 模式**）

### 溢出策略说明 \{#overflow\}

:::info 提示
对于可靠性投递而言，保证能够正确溯源非常重要（流量唯一入口），因此无论溢出策略和数据库类型如何选择，可靠性投递都会选择 JDBC 模式 + FAIL 溢出策略（none 和 memory 除外）
:::

溢出策略默认下为 FAIL，将异常交给上层（也就是聚合根来处理，通常是重做），其他溢出策略如下：

- **FAIL**: 返回失败给上层
- **BACKPRESSURE**：背压，阻塞当前线程，直到缓冲区空闲
- **BACKOFF**：背压，阻塞当前线程，直到缓冲区空闲或者超出最大重试次数，超出后则退避为 FAIL
- **DROP**：丢弃当前事件

### 配置 \{#config\}


```yaml
quantex:
  phoenix:
      event-store:
        # 默认数据类型配置
        type: jdbc
        # 默认溢出策略
        overflow-strategy: fail
        # 与溢出策略相关的 Buffer 大小
        buffer-size: 500
        # JDBC 数据源配置
        driver-class-name: org.h2.Driver
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
        
```

其他相关配置请参考 EventStore 配置: [Phoenix 配置说明](/docs/phoenix-core/phoenix-core-config#server)