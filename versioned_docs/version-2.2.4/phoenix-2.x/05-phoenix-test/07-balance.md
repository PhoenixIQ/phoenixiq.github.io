---
id: balance-test-2x
title: 均衡性测试
---

## 概述

均衡性直接标识着一个负载均衡算法/系统的优劣。Phoenix内部有诸多负载均衡点，我们关心这些负载均衡能否很好的将流量分配在多个处理单元中。

Phoenix中的均衡性测试将通过以下几个维度展开：

1. 聚合根分布: 校验atleastOneActor分布和AggregateActor分布在多个实例的情况下是否均匀
2. Kafka的消息分布: 查看每个topic的每个partion消息数量是否均衡
3. 数据库记录分布: 查看EventStore分库情况下的数据量是否均匀
4. 整体流量分布: 查看每个实例节点的处理流量是否均匀
5. CPU使用分布: 查看每个实例CPU的使用是否一样

## 聚合根均衡性测试

### 测试场景

在Kubernetes环境部署bank-account服务集群，前端发起批量随机划拨请求，处理完毕后，观察集群内每个节点上分布的聚合根数量。

### 校验方法

观察Grafana上的`Akka Cluster Sharding`图表中的`Shard entities per shard`pannel，看聚合根的分布是否均匀。

### 测试步骤

1. 在Kubernetes环境中，使用bank-account服务，部署2个节点。

   ![1](../../assets/phoenix2.x/phoenix-test/balance/1.png)

2. 发起随机划拨请求，划拨总数为1000。

   ![2](../../assets/phoenix2.x/phoenix-test/balance/2.png)

3. 处理完毕所有请求后，观察Grafana。

   ![3](../../assets/phoenix2.x/phoenix-test/balance/3.png)

4. 观察可得在虚拟IP为`10.42.27.55`和`10.42.29.141`的两个节点内，分别有10个聚合根，因此聚合根分布均匀。

## 消息均衡性测试

### 测试场景

在Kubernetes环境部署bank-account服务集群，前端发起批量划拨请求，处理完毕后，观察Kafka各个partition里的消息数量。

### 校验方法

通过`Kafka tool`工具，连接集群使用的Kafka，观察每个partition的消息分布是否均匀。

### 测试步骤

1. 在Kubernetes环境中，使用bank-account服务，部署2个节点。

2. 发起随机划拨请求，划拨总数为1000。

3. 处理完毕所有请求后，观察`Kafka tool`中每个partition的消息数量。

   ![4](../../assets/phoenix2.x/phoenix-test/balance/4.png)

4. 观察可得，消息在Kafka的多partition内是分布均匀的。

## EventStore均衡性测试

### 测试场景

在Kubernetes环境部署bank-account服务集群，前端发起批量划拨请求，处理完毕后，观察服务所使用的每个数据库中的`event_store`表的数据量。

### 校验方法

通过`select count(1) from event_store`语句查询数据量，观察数据量是否大致相等。

### 测试步骤

1. 在Kubernetes环境中，使用bank-account服务，部署3个节点。

2. 发起随机划拨请求，划拨总数为1000。

3. 观察每个数据库中`event_store`表的数据量。

   ![5](../../assets/phoenix2.x/phoenix-test/balance/5.png)

4. bank-account服务所采用的的`event_store`表分布于两个数据库中，观察可得，在每个数据库里分布的记录也是均匀的。

## 流量均衡性测试

### 测试场景

在Kubernetes环境部署bank-account服务集群，前端发起批量划拨请求，处理完毕后，观察集群内每个节点的处理速率。

### 校验方法

 通过Grafana中的Phoenix监控中的速率图表，观察每个节点的速率是否大致相同。

### 测试步骤

1. 在Kubernetes环境中，使用bank-account服务，部署2个节点。

2. 发起随机划拨请求，划拨总数为200000，每秒发起800次。

   ![6](../../assets/phoenix2.x/phoenix-test/balance/6.png)

3. 观察Grafana。

   IP为`10.42.27.56`的节点处理速率图：

   ![image-20200120184945179](../../assets/phoenix2.x/phoenix-test/balance/7.png)

   IP为`10.42.30.27`的节点处理速率图：

   ![8](../../assets/phoenix2.x/phoenix-test/balance/8.png)

4. 观察可得，每个节点处理的流量是相当均匀的。

## 负载均衡性测试

### 测试场景

在Kubernetes环境部署bank-account服务集群，前端发起批量划拨请求，处理完毕后，观察这段时间每个节点的CPU使用率。

### 校验方法

观察Rancher上每个服务节点的CPU使用图，观察每个节点的CPU占用是否大致相同。

### 测试步骤

1. 在Kubernetes环境中，使用bank-account服务，部署2个节点。

2. 发起随机划拨请求，划拨总数为200000，每秒发起800次。

3. 查看Rancher的CPU使用图。

   ![9](../../assets/phoenix2.x/phoenix-test/balance/9.png)

4. 观察可得，处理过程中，两个节点的CPU占用率也是非常均匀的。

## 结论

经验证，Phoenix能保证每一个负载均衡点都具有非常好均衡性，因而整体上来说，Phoenix具有非常高的均衡性。