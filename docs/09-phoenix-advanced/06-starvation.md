---
id: starvation-detector
title: 线程池饥饿检测器
description: 用于检测线程池是否饥饿的工具
---

## 简介 \{#introduce\}

线程池饥饿检测器是一个应用诊断工具，用于监视聚合根运行线程池及 Phoenix 内部线程池，并在线程池无响应时记录警告。

Phoenix 聚合根线程池无响应的最常见原因是在聚合根内部执行了阻塞调用，从而导致其他聚合根无法及时执行。这将导致严重的性能问题（延迟增加，但 CPU 利用率较低）。
当饥饿发生时，线程内的所有线程都会阻塞，例如：IO 行为，阻塞获取线程池外的异步结果，死锁。

饥饿检测器监视的是线程池而不是线程级别，因此只有在线程池利用率较高且饥饿时，才会发出告警，饥饿检测器并不监视单线程级别的高延迟阻塞。如：

一个 Phoenix 应用部署在 8 核心的机器/容器上，此时线程池数量为 24。（Phoenix 默认给聚合根配置了 CPU 核心数量 * 三倍的线程池数量）此时：

- 使用聚合根使用 20 的并行度执行长时间的阶乘算法：并不会触发告警，因为线程池仍然空闲线程用于执行快速检查。
- 使用聚合根使用 50 的并行度执行长时间的阶乘算法：触发警告，并行度大于线程池数量，线程池阻塞。

> 死锁将会在线程池资源释放时记录告警

:::tip[提示]
除了日志输出之外，线程池饥饿检测器还会在每个节点中保留最近的十次告警历史，可通过 Phoenix Console 查看本节点及其他节点的历史监视记录。
:::


## 使用说明 \{#usage\}

线程池饥饿检测器的使用较为简单，通过简单的配置即可开箱即用。

```yaml
quantex:
  phoenix:
    akka:
      # 饥饿检测器配置
      starvation-detector:
        enabled: true # 开启饥饿检测器
        max-delay-warning-threshold: 500 # 线程池阻塞阈值（ms），此默认较高，可适当降低
        warning-interval: 60000 # 警告输出间隔（ms）
        checker-interval: 1000 # 检查执行间隔 (ms) 可适当降低，较高的间隔也许会错过部分短期的阻塞
        checker-initial-delay: 10000 # 初始化检测任务延迟(ms)
```

## 告警日志输出示例 \{#logging\}

```text
Thread states (total 24 thread):  24 RUNNABLE
Stack traces:
 22 thread(s) in state: RUNNABLE on java.math.BigInteger.multiplyByInt(BigInteger.java:1605) 
    java.math.BigInteger.multiply(BigInteger.java:1521)
    java.math.BigInteger.multiply(BigInteger.java:1495)
    com.iquantex.phoenix.samples.account.domain.BankAccountAggregate.factorial(BankAccountAggregate.java:71)
    com.iquantex.phoenix.samples.account.domain.BankAccountAggregate.act(BankAccountAggregate.java:165)
    java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
    java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
    java.lang.Thread.run(Thread.java:750)

  2 thread(s) in state: RUNNABLE on java.math.BigInteger.multiplyByInt(BigInteger.java:1611) 
    java.math.BigInteger.multiply(BigInteger.java:1521)
    java.math.BigInteger.multiply(BigInteger.java:1495)
    com.iquantex.phoenix.samples.account.domain.BankAccountAggregate.factorial(BankAccountAggregate.java:71)
    com.iquantex.phoenix.samples.account.domain.BankAccountAggregate.act(BankAccountAggregate.java:165)
    java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
    java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
    java.lang.Thread.run(Thread.java:750)

Additionally, 24 threads reported an empty stack trace, and 0  threads were sleeping pool threads waiting for work.

```