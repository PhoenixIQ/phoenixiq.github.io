---
id: phoenix-core-event-store
title: 事件管理
---

## 设计思想
Phoenix维护内存状态，核心能力是使用EventSouring技术，Phoenix会定时打快照用来加速EventSouring的恢复。

![show](../../assets/phoenix2.x/phoenix-lite/eventsouring.png)

## EventStore-JDBC

Phoenix 默认使用的是 JDBC 版本的 EventStore, 请按下面步骤进行配置

1. 引用 phoenix-server-starter 的依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-server-starter</artifactId>
   <version>2.5.3</version>
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

## 事件归档

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