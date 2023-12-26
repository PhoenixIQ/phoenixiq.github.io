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

数据库归档是自动触发的

1. 自动归档： 每隔一段时间触发一次归档（间隔时间可配置，默认不启动自动归档）
2. 快照数量触发归档：当快照数量累计到一定数量后触发一次归档（最大累积快照数量可配置，默认不触发归档）

:::info[配置提示]

自动归档间隔配置：`autoArchiveInterval` （long 单位 ms） 默认为 `1000 * 60 * 60`，每小时心跳一次，判断有哪些聚合根需要归档 （全局配置：`quantex.phoenix.server.event-store.auto-archive-interval`）


最大累积快照数量配置：`numberOfRetainSnapshots` （int） 默认为 `Integer.MAX_VALUE`，不触发归档 （聚合根级别配置）

:::


```
@EntityAggregateAnnotation(
        aggregateRootType = "BankAccount",
        idempotentSize = 100,
        snapshotInterval = 100000,
        numberOfRetainSnapshots = 2)
```