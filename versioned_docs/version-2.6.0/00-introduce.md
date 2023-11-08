---
id: introduce
title: Phoenix介绍
---

> Phoenix 是宽拓自主研发的一款事件驱动型的高性能 Java 开发框架，在金融行业中得到了验证。Phoenix 专注于降低业务复杂性高、性能要求高的应用系统的开发难度，助力研发团队打造专业、高效的微服务化的应用系统。

## 整体介绍 \{#introduce\}

Phoenix 是一款高性能、事件驱动型的微服务框架。Phoenix 使开发者专注于满足业务需求，无需编写底层代码来实现可靠性、容错和高性能。

传统的微服务架构做法不利于应对现代计算机体系结构的设计挑战，开发分布式的微服务系统将会面临以下问题：
- 组件崩溃没有响应
- 消息在链路中丢失而无迹可寻
- 网络延迟波动

为了帮助开发者编写出更符合现代计算机体系结构的程序，Phoenix 建立在异步和事件思想之上提供了以下特性：
- [事件驱动](/docs/phoenix/why-event-driven-microservice#eda)：事件驱动型架构能够真正解耦微服务，这种松耦合在系统中提供了一定程度的弹性。
- [EventSourcing](/docs/phoenix/why-event-driven-microservice#eventsourcing)：Phoenix提供高性能以及可伸缩的EventSourcing编程模型，方便用户面向领域编程。
- [CQRS](/docs/phoenix/why-event-driven-microservice#cqrs)：在EventSourcing的模式之上提供可靠的事件发布功能，方便用户构建Q端模型，从而实现命令查询职责分离架构。
- [审计](/docs/phoenix/why-event-driven-microservice#eventsouring#eda)：Phoenix 使用一系列不可变事实的事件表示程序状态，因此支持通过事件流回溯程序状态的历史记录以实现审计和跟踪。
- [横向伸缩](/docs/phoenix-test/elasticity-test)：在Phoenix运行模型中，聚合根是最小并发以及隔离单位，聚合根会自动平均shard到各个节点当中，用户可以通过增/减节点来实现横向伸缩。
- [高可用](/docs/phoenix-test/available-test)：依赖于 Phoenix 的集群调度能力，当节点故障时，集群能够快速检测并恢复，故障节点的状态会转移到健康节点。
- [事务支持](/docs/phoenix-transaction/phoenix-transaction-module)：Phoenix 支持 TCC 和 Saga 分布式事务，并支持两种事务混用，以满足业务需求。
- [运维监控](/docs/phoenix-console/phoenix-console-overall)：Phoenix 实现了一套强大的服务监控平台，支持对多个项目、服务、实例的监控以及内存的管理。

Phoenix 对聚合根的使用封装了一套易于使用的抽象 API，使开发者能够面向对象设计编程，不会陷入面向表结构设计的困境；在应用架构层面，Phoenix 基于事件驱动架构实现了有状态的微服务的异步通信，帮助开发者构建出松耦合、高可用、可伸缩的微服务架构。

> 有关 Phoenix 在领域驱动设计方面的设计思想，可以参考：[Phoenix 使用场景介绍](/blog/phoenix-scene)

## 如何入门 \{#guide\}
如果您想要快速上手 Phoenix，我们建议您从运行简单的 Hello World 项目开始，了解 Phoenix API 和相关配置。有关 HelloWorld 项目的内容，请参阅：[https://github.com/PhoenixIQ/phoenix-samples/](https://github.com/PhoenixIQ/phoenix-samples/tree/master/hello-world)

如果您想要深入了解 Phoenix 背后的设计思想以及更高级别的信息，请查阅下面的指南。该指南讲述了 Phoenix 如何改造微服务架构以适应现代分布式系统的需求，并包含一个教程，帮助开发者进一步了解 Phoenix 该指南涵盖了以下主题：

- [为什么需要事件驱动微服务](/docs/phoenix/why-event-driven-microservice)：从微服务架构挑战出发，介绍事件驱动型架构
- [Phoenix实现事件驱动型微服务](/docs/phoenix/how-event-driven-microservice)：介绍 Phoenix 在事件驱动型架构中的实践
- [复杂的酒店预订案例](/docs/phoenix/quick-start-example)，在 Hello World 项目之上，用于示例常见的微服务程序
- [Phoenix概念](/docs/phoenix/phoenix-glossary)

## 框架性能 \{#perf\}

在 Phoenix 中，框架的性能将使用以下两个指标衡量：

- 吞吐：指系统每秒可以并发处理事务的个数
- 时延：指每笔事务处理的耗时情况

下面表格数据展示在不同硬件资源，不同实例配置下，Phoenix 的性能表现情况：

> 更多 Phoenix 性能及可用性等层面的测试，可以参考：[Phoenix 测试报告](/docs/phoenix-test/features-test)

| 压测参数(消息总量/TPS/聚合根范围) | 实例个数 | 硬件配置       |线程池配置 | DB配置   | MQ配置         |  平均时延  | CPU使用率 | 实际处理TPS |
| --------------                | ------- | -------------|--------- | -----    |  -------------|  -------- | ---------| ---     |
| 540W/4.5W/100                  | 6       | 4Core 8GB    |ForkJoin64| 4实例   |1实例36partition |  1782ms    | 56%      | 35272 |
| 600W/5W/100                    | 12      | 4Core 8GB    |ForkJoin64| 4实例   |1实例36partition |  1896ms    | 40%      | 42646 |
| 900W/7.5W/100                  | 18      | 4Core 8GB    |ForkJoin64| 4实例   |1实例36partition |  1172ms    | 32%      | 52500 |
| 780W/6.5W/100                  | 24      | 4Core 8GB    |ForkJoin64| 4实例   |1实例36partition |  1858ms    | 24%      | 58880 |
| 1080W/9W/100                   | 30      | 4Core 8GB    |ForkJoin64| 4实例   |1实例36partition |  1437ms    | 24%      | 57077 |