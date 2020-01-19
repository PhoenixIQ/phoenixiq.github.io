---
id: endurance-test-2x
title: 耐力测试
---

耐力测试指的是对系统进行长时间的大流量高压力的测试，观察系统的承受情况。耐力测试可以帮助我们暴露系统内的一些细节问题，比如微小的内存泄漏等。

Phoenix框架致力于构建高可用高性能的应用服务系统，必须保证细枝末节都尽可能完美，能够支撑的住长时间的大流量的冲击，因此有必要进行耐力测试。

## 测试方案

### 测试场景

Phoenix框架高可用性测试基于bank-account示例应用进行。部署单个节点，在前端发起长时间（24h）的随机划拨请求，并调节流量为单节点所能应对的最大值的80%，使得服务处于长时间高压的情况。

### 校验方法

观察Grafana中的Phoenix监控中的速率图表是否稳定，观察JVM Metrics监控中的GC图表是否稳定。

### 测试步骤

1. 在kubernates环境中，使用bank-account服务，给定pod 1c的cpu，不断调试前端的压测请求数量，观察Grafana，测试出1c的cpu资源下，服务能承受住的前端最大请求数为1000/s。

2. 调整前端的请求数为800/s，请求时间为24h，开始测试。

   （截图，前端下单图）

3. 待测试完毕后，观察可知24h内Phoenix监控中的速率图表基本稳定，JVM Metrics监控中的GC图表基本稳定。

   （截图，phoenix监控图，lightbend console jvm metrics图[http://console-server.sz.iquantex.com/cluster/service/grafana/d/P56eeYpZk/jvm-metrics?orgId=1&var-Applications=All&var-Servers=All&var-HeapTypes=All&var-NonHeapTypes=All&var-TotalHeapTypes=All&var-MemoryPools=All]）

## 结论

经验证，Phoenix架构能稳定承受长时间的高负载，因此，Phoenix具有高耐力性。