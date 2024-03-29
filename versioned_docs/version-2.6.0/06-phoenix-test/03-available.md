---
id: available-test
title: 可用性测试
---

## 概述


可用性指系统无中断地执行其功能的能力，代表系统的可用性程度。是进行系统设计时的准则之一。高可用性系统与构成该系统的各个组件相比可以更长时间运行。高可用性通常通过提高系统的容错能力来实现。

系统的可用性可以使用以下两个指标衡量:

1. 恢复时间目标(RTO): RTO 指在业务可接受的范围内，应用系统最多可以中断或关闭（业务不可用）多长时间。
2. 恢复点目标(RPO): RPO 指在业务可接受的范围内，应用系统最多可在系统故障恢复后丢失多长时间的业务数据。

Phoenix 框架致力于构建高可用的应用服务系统，可通过部署多活服务集群来消除服务的单点故障，以满足应用服务的高可用性的要求。所以，我们需要对 Phoenix 框架构建的服务进行高可用性测试。

## 测试场景

Phoenix 框架高可用性测试基于 bank-account 服务进行。部署多个服务实例构建多活服务集群作为测试的目标系统，在压测流量不断的情况下，通过手动关闭一个或若干服务实例模拟系统发生故障。

## 校验方法

1. 测试过程中使用 Grafana 监控请求的处理情况，通过 Grafana 可得到在系统发生故障时，系统响应请求的中断时间长短，统计该时间作为系统可达到的故障恢复时间，即作为系统的 RTO 指标；

2. 在故障恢复后，通过bank-account提供的业务数据校验功能，确认故障恢复后，所有业务数据状态没有出错和丢失。若故障恢复后，所有业务数据状态均正常，则可认为系统可达到的 RPO 指标为0。

## 测试步骤

 1. 在测试环境部署多活 bank-account 服务，实例数量为 3 个。在服务启动正常后以固定流量发起批量转账请求并持续一定时间。
    ![show](../assets/phoenix-test/available/012.png)

 2. 期间手动关闭 1 个 account-server 服务实例以模拟故障。使用 Grafana 监控工具监控请求的处理情况和业务状态，统计服务在测试过程中中断请求响应的时间长短，确定故障恢复后的数据状态正确性，计算本次测试中系统可达到的 RTO 和 RPO 指标。
    ![show](../assets/phoenix-test/available/014.png)
    
    期间手动关掉的服务，可以查看监控页面，服务在关闭之后不再进行消息处理了
    ![show](../assets/phoenix-test/available/004.png)
    
    根据 Grafana 监控页面可以明显观察到删掉一个节点之后其余两个节点处理消息数量有明显提升，即剩下的节点分摊了删除节点的流量。
    ![show](../assets/phoenix-test/available/013.png)
    ![show](../assets/phoenix-test/available/015.png)
    
    交易完成后的下单页面
    ![show](../assets/phoenix-test/available/010.png)
    
    可计算实际转账总数: 5975(成功转出汇总) + 4025(失败转出汇总) = 10000 = 下单数量
    
 3. 经过观察，Grafana 的处理速率图，无间断，因此 RTO 为 0; 前端页面的转入和转出次数之和，与下单请求的转账次数完全一致。因此 RPO 为 0.

## 结论

根据上面测试方案验证，在其中一个应用节点宕机的情况下，系统可以无感的自动切换，所以可以得出 Phoenix 的可用性为 RPO = 0，RTO = 0。
