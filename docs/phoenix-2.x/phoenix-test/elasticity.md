---
id: elasticity-test-2x
title: 伸缩性测试
---

### 概述
> 可伸缩性(可扩展性)是一种对软件系统计算处理能力的设计指标，高可伸缩性代表一种弹性，在系统扩展成长过程中，软件能够保证旺盛的生命力，通过很少的改动甚至只是硬件设备的添置，就能实现整个系统处理能力的线性增长，实现高吞吐量和低延迟高性能。

Phoenix是一个事件驱动的有状态微服务框架，通过伸缩性测试，可以验证Phoenix能否通过水平伸缩或者垂直伸缩来提升或者缩减系统的负载能力。这一点对一个分布式微服务架构是非常有必要的。

---

### 测试方案（实例数量伸缩）

#### 测试场景

Phoenix框架高伸缩性测试（实例数量伸缩）基于bank-account示例应用进行。通过伸缩kubernates环境中bank-account的集群节点数量，来证明Phoenix能够根据实例的数量来进行横向伸缩，以增大或者减少整个系统的负载能力。

#### 校验方法

测试过程中使用Grafana监控请求的处理情况，观察系统的负载能力（Phoenix监控图中的tps，latency等）是否和节点数量大致呈现正相关。

#### 测试步骤

1. 在kubernates环境中，使用bank-account服务，给定每个pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测出单个服务实例的极限tps和latency，观察pod负载。
2. 前端保证流量不变，扩容pod数量为2。观察Grafana，测出两个服务实例的tps和latency，并观察pod负载。
3. 前端流量保证不变，减少pod数量为1。观察Grafana，测出单个服务实例的tps和latency，观察pod负载。

#### 测试结果

（截取grafana的phoenix监控中的tps和latency的伸缩前后对比图）

---

### 测试方案（cpu资源伸缩）

#### 测试场景

Phoenix框架高伸缩性测试（cpu资源伸缩）基于bank-account示例应用进行。通过伸缩kubernates环境中bank-account的集群pod的cpu核心限制阈值，来证明Phoenix能够根据cpu资源来进行横向伸缩，以增大或者减少整个系统的负载能力。

#### 校验方法

测试过程中使用Grafana监控请求的处理情况，观察系统的负载能力（Phoenix监控图中的tps，latency等）是否和cpu资源（核数）大致呈现正相关。

#### 测试步骤

1. 在kubernates环境中，使用bank-account服务，给定每个pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测出单个服务实例的极限tps和latency，观察pod负载。
2. 前端保证流量不变，改变pod的cpu限制为2c。观察Grafana，测出服务实例的tps和latency，并观察pod负载。
3. 前端流量保证不变，改变pod的cpu限制为1c。观察Grafana，测出服务实例的tps和latency，观察pod负载。

#### 测试结果

（截取grafana的phoenix监控中的tps和latency的伸缩前后对比图）