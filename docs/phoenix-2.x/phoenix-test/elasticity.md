---
id: elasticity-test-2x
title: 伸缩性测试
---

## 概述

可伸缩性(可扩展性)是一种对软件系统计算处理能力的设计指标，高可伸缩性代表一种弹性，在系统扩展成长过程中，软件能够保证旺盛的生命力，
通过很少的改动甚至只是硬件设备的添置，就能实现整个系统处理能力的线性增长。

系统的伸缩性可以使用以下两个指标衡量：

1. 纵向伸缩: 在同一个逻辑单元内增加资源来提高处理能力，比如增加CPU主频。
2. 横向伸缩: 增加更多逻辑单元的资源，令它们像是一个单元一样工作来提高处理能力。

Phoenix重点关心线性的横向伸缩能力，Phoenix的处理单元是聚合根，Phoenix框架可以根据CPU核心数动态调整处理聚合根的能力，可以根据节点个数动态调整每个节点处理聚合根的个数。
下面分别通过实例的伸缩和CPU核心的伸缩来证明Phoenix的横向伸缩能力。


## 测试方案（实例数量伸缩）

### 测试场景

Phoenix框架高伸缩性测试（实例数量伸缩）基于bank-account示例应用进行。通过伸缩kubernates环境中bank-account的集群节点数量，来证明Phoenix能够根据实例的数量来进行横向伸缩，以增大或者减少整个系统的负载能力。

### 校验方法

测试过程中使用Grafana监控请求的处理情况，观察系统的负载能力（Phoenix监控图中的tps，latency等）是否和节点数量大致呈现正相关。

### 测试步骤

1. 在kubernates环境中，使用bank-account服务，给定每个pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测出单个服务实例的极限tps和latency，观察pod负载。（描述下根据性能测试，1c的cpu下的服务实例的极限tps和latency是多少多少，这里就不截图了）。

2. 前端保证流量不变，扩容pod数量为2。观察Grafana，测出两个服务实例的tps和latency，并观察pod负载。

   （截图：rancher节点图，grafana上的latency和tps图）

3. 前端流量保证不变，减少pod数量为1。观察Grafana，测出单个服务实例的tps和latency，观察pod负载。

   （截图：rancher节点图，grafana上的latency和tps图）

4. 经过观察，我们可以看出来系统的负载能力，和节点数量大致呈现正相关。

## 测试方案（cpu资源伸缩）

### 测试场景

Phoenix框架高伸缩性测试（cpu资源伸缩）基于bank-account示例应用进行。通过伸缩kubernates环境中bank-account的集群pod的cpu核心限制阈值，来证明Phoenix能够根据cpu资源来进行横向伸缩，以增大或者减少整个系统的负载能力。

### 校验方法

测试过程中使用Grafana监控请求的处理情况，观察系统的负载能力（Phoenix监控图中的tps，latency等）是否和cpu资源（核数）大致呈现正相关。

### 测试步骤

1. 在kubernates环境中，使用bank-account服务，给定每个pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测出单个服务实例的极限tps和latency，观察pod负载。

   （描述下根据性能测试，1c的cpu下的服务实例的极限tps和latency是多少多少，这里就不截图了）。

2. 前端保证流量不变，改变pod的cpu限制为2c。观察Grafana，测出服务实例的tps和latency，并观察pod负载。

   （截图：rancher cpu限制图，grafana上的latency和tps图）

3. 前端流量保证不变，改变pod的cpu限制为1c。观察Grafana，测出服务实例的tps和latency，观察pod负载。

   （截图：rancher cpu限制图，grafana上的latency和tps图）

4. 经过观察，我们可以看出来系统的负载能力，和cpu资源大致呈现正相关。

## 结论

经验证，Phoenix具有横向伸缩性。