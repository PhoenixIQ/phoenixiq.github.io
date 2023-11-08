---
id: phoenix-core-event-store-2x
title: 事件管理
---

## 设计思想
Phoenix维护内存状态，核心能力是使用EventSouring技术，Phoenix会定时打快照用来加速EventSouring的恢复。

![show](../../assets/phoenix2.x/phoenix-lite/eventsouring.png)

## EventStore-JDBC
Phoenix默认使用的是内存版本的EventStore,如需使用JDBC版本的请按下面步骤配置

1. 引用EventStore的JDBC依赖
```yaml
        <dependency>
            <groupId>com.iquantex</groupId>
            <artifactId>phoenix-eventstore-jdbc</artifactId>
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