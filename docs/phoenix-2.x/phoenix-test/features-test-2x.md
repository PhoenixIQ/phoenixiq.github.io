---
id: features-test-2x
title: 功能性测试
---

 ## 前言

 Phoenix是宽拓自主研发的一款事件驱动型的高性能Java开发框架，专注于降低金融行业中业务复杂性高、性能要求高的应用系统的开发难度，助力研发团队打造专业、高效的微服务化的金融应用系统。

 本篇测试报告主要验证了 Phoenix 提供的如下功能：

  - 基于 Phoenix-lite 账户划拨功能正常
  - grafana 使用正常
  - EventSourcing 使用正常
  - Snapshot 使用正常

## Phoenix-lite 划拨功能

### 概述

验证 phoenix-lite 账户划拨功能是否可以正常使用。

### 原理介绍

phoenix-lite 提供了随机划拨和定向划拨两个功能：

 1. 定向划拨：指定账户进行转入转出操作（每个账户默认初始有1000元，划拨金额大于0为转入操作，划拨金额小于0为转出操作）
 2. 随机划拨：指定账户范围和转账次数，多个账户同时进行划拨操作。

![show](assets/phoenix2.x/phoenix-test/features/1.png)

### 测试方案

#### 场景描述

分别使用 Phoenix-lite 提供的两个划拨接口进行下单测试。

#### 校验方法

 - 定向划拨：每次划拨之后校验余额
 - 随机划拨：转入次数 + 转出次数 + 错误转出 = 转账次数

### 测试步骤

 1. 使用 phoenix-lite 的下单页面以每秒 100 笔的速率下单，同时限制账户个数为 10 个，划拨总次数为 1000
 2. 待下单完毕后，进行校验.
   使用 phoenix-lite 的内存查询接口查询内存数据 (转入次数 + 转出次数 + 错误转出 = 转账次数)

   ![show](assets/phoenix2.x/phoenix-test/features/2.png)

 3. 使用定向转账功能，从 A00000000 账户中转出 100 元（通过以上图片发现经过随机转账之后 A00000000 账户中余额为 1379 元）
    转账之后，通过内存查询接口查看账户余额（余额为 1279 元）

    ![show](assets/phoenix2.x/phoenix-test/features/3.png)

### 测试结果

符合预期，phoenix-lite 账户划拨功能可以正常使用。





## Grafana 功能

### 概述

Phoenix 提供了一套默认的 Grafana 监控面板，用于监控 Phoenix 应用的运行情况。监控指标包括如下内容：

 - 消息个数统计
 - 指标个数统计
 - 耗时统计
 - 速率统计
 - 数据总览
 - 根据服务节点或者服务路径进行筛选过滤

### 原理介绍

通过在 phoenix-lite 服务中进行埋点，并将相应的数据上传至 Elasticsearch 最终通过 Grafana 友好的展示出来。不仅可以实时的监控 Phoenix 应用每次下单之后的运行情况，还可以分析上面的指标判断服务的性能。

### 测试方案

#### 场景描述

使用 Phoenix-lite 提供的随机划拨功能以固定的速率进行下单测试，然后打开 Grafana 监控面板监测数据。

#### 校验方法

观察 Grafana 中展示出来的各个指标是否符合预期

Grafana的入口在 Phoenix-admin 中，关于 Phoenix-admin 的使用请参考：[Phoenix-admin 使用说明](../phoenix-admin/admin-instructions-2x)

关于 Grafana 各个监控指标的说明请参考：[Grafana 监控指标说明](../phoenix-admin/grafana-2x)

### 测试步骤

 1. 使用 phoenix-lite 的下单页面以每秒 100 笔的速率下单，同时限制账户个数为 10 个，划拨总次数为 1000
 2. 待下单完毕后，进行校验。
    通过 Grafana 监测服务运行情况。

    ![show](assets/phoenix2.x/phoenix-test/features/4.png)

    通过 Grafana 监控面板可以观察到一共发送了 1000 条消息（CLIENT_SEND_MSG = 1000）,并全部处理完成。整个处理过程耗时平均在 10 ms左右。
 3. 根据服务路径进行筛选过滤（只观察其中一个服务的情况）
    ![show](assets/phoenix2.x/phoenix-test/features/8.png)
 4. 根据服务节点进行筛选过滤（Server端服务支持多活，可以启动多个节点，但是我们可以只观察其中一个节点的情况）
    ![show](assets/phoenix2.x/phoenix-test/features/9.png)
    通过上图我们还可以看出来，该节点一共处理了 500 笔请求（一个 1000 笔请求，共两个处理节点），说明了多个节点之间是可以做到负载均衡的。

### 测试结果

符合预期，可以证明 Phoenix 提供的 Grafana 监控功能够可以正常使用





## EventSourcing 功能

### 概述

Phoenix保证其内存数据正确性的核心原理在于EventSourcing(事件溯源技术)。

### 原理介绍

Phoenix是EDA架构的框架，可以基于事件重塑内存，Phoenix会对所有处理过的事件进行持久化，在节点重启或者聚合根漂移时通过EventSourcing重塑内存状态。

### 测试方案

#### 场景描述

使用 Phoenix-lite 提供的随机划拨功能，首先构造固定数量的请求，处理完成之后观察内存数据情况，然后重启节点后再次观察内存状态是否和之前保持一致，重启之后再进行定向划拨观察服务时候能够正常运作。

#### 校验方法

在 Phoenix-lite 页面通过内存查询功能，观察最终的结果是否正确。

### 测试步骤

 1. 使用 phoenix-lite 的下单页面以每秒 100 笔的速率下单，同时限制账户个数为 10 个，划拨总次数为 1000
 2. 待所有请求处理完成之后，查询内存数据
    ![show](assets/phoenix2.x/phoenix-test/features/5.png)
 3. 重启服务之后，再次查询内存数据
    重启过程中发现各个聚合根确实存在Eventsourcing的过程
    ![show](assets/phoenix2.x/phoenix-test/features/7.png)
    并且重启前后内存数据没有变化
    ![show](assets/phoenix2.x/phoenix-test/features/6.png)

### 测试结果

符合预期，可以证明 Phoenix 提供的 EventSourcing 功能够可以正常使用





## Snapshot 功能

### 概述

Phoenix 应用可以通过EventSourcing功能进行内存数据恢复，使用Snapshot可以加快EventSourcing的内存恢复的速度。

### 原理介绍

Snapshot是对某一瞬间Phoenix应用内存的一次存储。Phoenix提供了两种大快照的方式。

 1. 每处理1000笔消息自动打一次快照
 2. 手动触发打快照

### 测试方案

#### 场景描述

使用 Phoenix-lite 提供的随机转账功能，首先构造 1000 笔下单请求，处理完成之后观察是否打快照，然后重启节点观察EventSourcing过程中是否使用快照。

#### 校验方法



### 测试步骤

