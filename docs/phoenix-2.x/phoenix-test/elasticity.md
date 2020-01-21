---
id: elasticity-test-2x
title: 伸缩性测试
---

## 概述

可伸缩性(可扩展性)是一种对软件系统计算处理能力的设计指标，高可伸缩性代表一种弹性，在系统扩展成长过程中，软件能够保证旺盛的生命力，
通过很少的改动甚至只是硬件设备的添置，就能实现整个系统处理能力的线性增长。

系统的伸缩性可以使用以下两个维度衡量：

1. 纵向伸缩: 在同一个逻辑单元内增加资源来提高处理能力，比如增加CPU主频。
2. 横向伸缩: 增加更多逻辑单元的资源，令它们像是一个单元一样工作来提高处理能力。

Phoenix重点关心线性的横向伸缩能力，Phoenix的处理单元是聚合根，Phoenix框架可以根据CPU核心数动态调整处理聚合根的能力，可以根据节点个数动态调整每个节点处理聚合根的个数。
下面分别通过实例的伸缩和CPU核心的伸缩来证明Phoenix的横向伸缩能力。


## 实例数量伸缩

### 测试场景

Phoenix框架高伸缩性测试（实例数量伸缩）基于bank-account示例应用进行。通过伸缩kubernates环境中bank-account的集群节点数量，来证明Phoenix能够根据实例的数量来进行横向伸缩，以增大或者减少整个系统的负载能力。

### 校验方法

测试过程中使用Grafana监控请求的处理情况，观察系统的负载能力（Phoenix监控图中的tps，latency等）是否和节点数量大致呈现正相关。

### 测试步骤

 1. 在kubernates环境中，使用bank-account服务，两个pod，给定每个pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测出单个服务实例的极限tps(这里测试为2k tps)和latency，观察pod负载。
    ![show](../../assets/phoenix2.x/phoenix-test/elasticity/003.png)

 2. 保证每个pod的cpu资源不变，pod数量增加到3，tps增加到2800tps。观察Grafana和pod负载。
    ![show](../../assets/phoenix2.x/phoenix-test/elasticity/004.png)

 3. 保证每个pod的cpu资源不变，前端流量和pod数量恢复到第一次测试的值，观察Grafana和pod负载。
    ![show](../../assets/phoenix2.x/phoenix-test/elasticity/005.png)

 4. 经过观察，我们可以看出来系统的负载能力，和节点数量大致呈现正相关。

## cpu资源伸缩

### 测试场景

Phoenix框架高伸缩性测试（cpu资源伸缩）基于bank-account示例应用进行。通过伸缩kubernates环境中bank-account的集群pod的cpu核心限制阈值，来证明Phoenix能够根据cpu资源来进行横向伸缩，以增大或者减少整个系统的负载能力。

### 校验方法

测试过程中使用Grafana监控请求的处理情况，观察系统的负载能力（Phoenix监控图中的tps，latency等）是否和cpu资源（核数）大致呈现正相关。

### 测试步骤

 1. 在kubernates环境中，使用bank-account服务，创建两个pod，给定每个pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测出单个服务实例的极限tps(这里测试为2k tps)和latency，观察pod负载。
    ![show](../../assets/phoenix2.x/phoenix-test/elasticity/002.png)

 2. 保证pod数量不变，前端流量和pod的cpu资源翻倍。观察Grafana和pod负载。
    ![show](../../assets/phoenix2.x/phoenix-test/elasticity/001.png)

 3. 保证pod数量不变，前端流量和pod的cpu资源恢复到第一次测试值。观察Grafana和pod负载。
    ![show](../../assets/phoenix2.x/phoenix-test/elasticity/003.png)

 4. 经过观察，我们可以看出来系统的负载能力，和cpu资源大致呈现正相关。

## 结论

经验证，Phoenix具有横向伸缩性。