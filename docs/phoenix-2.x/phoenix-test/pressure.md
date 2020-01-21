---
id: pressure-test-2x
title: 压力测试
---

抗压能力是衡量一个软件系统优劣的又一重要指标，我们将通过下面两种维度来对Phoenix进行压力测试：

1. 持续流量压力
2. 瞬间峰值流量压力

## 持续流量测试

### 测试场景

Phoenix框架持续流量压力测试基于bank-account服务进行。部署2个节点，在前端发起长时间（8h）的随机划拨请求，并给到一定流量（500/s）。

### 校验方法

观察Grafana中的Phoenix监控中的速率图表是否稳定，观察JVM Metrics监控中的GC图表是否稳定。

### 测试步骤

1. 在Kubernates环境中，使用bank-account服务，部署2个节点，每个节点给定pod 2c的Cpu。

   ![1](../../assets/phoenix2.x/phoenix-test/endurance/1.png)

   

2. 调整前端的请求数为500/s，请求时间为8h，开始测试。

3. 待测试完毕后，观察8h内Phoenix监控中的速率图表，JVM Metrics监控中的GC图表，Rancher上的Cpu使用图表，Cpu占用图表等。

   处理速率和发送请求参数：

   ![2](../../assets/phoenix2.x/phoenix-test/endurance/2.png)

   GC图：

   ![3](../../assets/phoenix2.x/phoenix-test/endurance/3.png)

   Cpu使用图：

   ![4](../../assets/phoenix2.x/phoenix-test/endurance/4.png)

4. 观察可知，Phoenix处理速率基本稳定，GC正常，未发生频繁的Full GC，Cpu使用平稳，无太大波动。

## 峰值流量测试

### 测试场景

Phoenix框架峰值流量压力测试基于bank-account示例应用进行。部署2个节点，在前端发起长时间（8h）的随机划拨请求，并给到一定流量（500/s）。

### 校验方法

### 测试步骤

1. 先使用压测程序，一次性发送20万条消息到Kafka中，此时关闭处理程序account_server，模拟消息堆积。

   ![5](../../assets/phoenix2.x/phoenix-test/endurance/5.png)

2. 打开2个节点的account_server，待所有积压的消息全部处理完毕。

   ![6](../../assets/phoenix2.x/phoenix-test/endurance/6.png)

3. 观察8h内Phoenix监控中的速率图表，JVM Metrics监控中的GC图表，Rancher上的Cpu使用图表，Cpu占用图表等。

   处理速率图：

   ![7](../../assets/phoenix2.x/phoenix-test/endurance/7.png)

   GC图：

   ![8](../../assets/phoenix2.x/phoenix-test/endurance/8.png)

   Cpu使用图：

   ![9](../../assets/phoenix2.x/phoenix-test/endurance/9.png)

   Kafka消费图：

   ![10](../../assets/phoenix2.x/phoenix-test/endurance/10.png)

4. 根据上图，我们可以看出，4条Kafka partition有1条只被消费了5332条消息就停止消费了，其他的消息被2个服务节点在1分钟内消费完毕。



## 结论

经验证，对于长时间的流量，Phoenix可以很好的处理；但是对于积压的瞬间流量，Phoenix还不能很好的处理，会有一条Kafka partition不能消费完全。