# Phoenix

## Phoenix是什么

Phoenix是一个高性能的响应式微服务开发框架。使用Phoenix您可以快速便捷地构建复杂的响应式微服务系统，Phoenix提供了适合复杂业务系统的技术特性和解决方案，这可以为您的系统带来高性能、高解耦和横向扩展等强大能力。而您在构建业务系统时无需关心这些技术的实现细节，这让您在开发系统时更加关注于业务实现。

Phoenix为响应式微服务系统开发抽象了一个服务构建的基本模型。Phoenix服务类型分为Command Side Service（C端服务）、Query Side Service（Q端服务）和Transaction Service（事务协调服务），他们之间基于消息队列进行消息通信。

> 配图：服务间通讯

服务的状态基于内存计算，以提高服务的响应性和吞吐量。结合EventSourcing技术，使用数据库存储服务状态，并在服务故障宕机后提供状态恢复能力，保证服务状态的可靠性和可用性。

> 配图：Event-Sourcing示意图

## 特性

* 内存计算
* 消息驱动
* 微服务
* 易于编程
* 横向伸缩
* 高可用
* 读写分离
* 运维监控

## Maven Dependency

Phoenix Server Starter

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-server-starter</artifactId>
    <version>${phoenix.version}</version>
</dependency>
```

Phoenix Client Starter

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-client-starter</artifactId>
    <version>${phoenix.version}</version>
</dependency>
```

Phoenix Transaction Starter

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-transaction</artifactId>
    <version>${phoenix.version}</version>
</dependency>
```

## 快速入门

[快速入门](./docs/phoenix-2.x/01-phoenix/02-quick-start.md)

## 文档

完整文档可访问 [Phoenix文档](文档链接)

## Issues

> 说明Issue的提出方法和流程，给一个链接。
