---
id: cluster-pool
title: 集群计算池
description: 用于将计算任务分发到集群的组件
---

## 聚合根并发 \{#introduce\}

为了保证聚合根的原子性，Phoenix 内部只允许一个线程处理聚合根的方法调用，以确保聚合根代码的线程安全。

对于一些需要进行 CPU 密集计算的聚合根，如果希望提高其处理响应时间，可以将计算任务拆分成可并行执行的模块。在 Phoenix 中，这种拆分并不受限制，用户可以通过线程池的方式进行并行计算（需要注意线程安全）。

然而，线程池的方式只能充分利用单节点的性能，无法利用到集群中多个节点的并行能力。为此，Phoenix 提供了一种集群计算的能力。

## API 说明 \{#api\}

API 主要由两个接口组成：

```java
/**
 * 流水线接口，用于计算任务, 然后由线程池/集群计算 Worker 异步执行.
 */
public interface Pipeline<State extends Serializable> {

    /**
     * 提交计算任务.
     *
     * @param state 计算任务所需要的状态
     * @param taskClass 计算任务的计算逻辑
     */
    void submit(State state, Class<? extends Task> taskClass);
}

/**
 * 用于定义计算任务的逻辑，此实例会在计算前生成，目前暂不支持 Spring 集成.
 */
public interface Task<State extends Serializable, Result extends Serializable> {

    /**
     * 核心计算逻辑
     * 
     * @param state 计算任务所需要的状态
     * @return
     */
    Result execute(State state);
}
```

## 使用说明 \{#usage\}

用户可以在聚合根的 `act(Command cmd)` 方法中通过 `EntityAggregateContext.executeOnPipeline` 方法获取 **Pipeline** 对象，该对象只有一个用于提交计算任务的方法。


```java
List<Serializable> result =
        EntityAggregateContext.executeOnPipeline(
                pipeline -> {
                    // 分解为多个计算任务, 异步并发执行
                    pipeline.submit(200, Factorial.class);
                    pipeline.submit(400, Factorial.class);
                    pipeline.submit(600, Factorial.class);
                    pipeline.submit(400, Factorial.class);
                    pipeline.submit(600, Factorial.class);
                    pipeline.submit(200, Factorial.class);
                    pipeline.submit(100, Factorial.class);
                });
```

## 性能说明 \{#perf\}

使用集群来异步提交计算任务并不是没有开销的，它会带来计算状态在网络中传输的开销。对于提交到 Pipeline 的计算任务，总响应时间可以用以下公式表示：(R = 总响应时间, Ra = 任务总计算耗时, Rb = 网络传输耗时, Rc = 请求响应调度耗时)

$$
R = Ra + Rb + Rc
$$

上述公式过于简化，实际上具体的计算公式涉及多个方面，这是一些符号的定义：

- **_S_** = 所有的计算任务数量
- **_O_** = 计算任务在单个核心中计算所需要的耗时
- **_P_** = 每 1MB 状态/结果在网络中的传输耗时
- **_N_** = 节点数量（可扩展点）
- **_C_** = 节点 CPU 核心数量（可扩展点）
- **_X_** = 计算状态对象体积与 1MB 的倍数
- **_Y_** = 响应结果对象体积与 1MB 的倍数
- **_R_** = 为总响应时间
- **_Ra_** = 为任务总计算耗时
- **_Rb_** = 为网络传输耗时
- **_Rc_** = 为请求和响应的等待调度耗时


:::info 注意
这个计算公式只是作为是否使用集群计算池以及如何拆分计算任务以更适合集群计算池的参考依据，实际上还有上下文切换、网络延迟等其他开销。
:::

具体的计算公式为：

$$
Ra = \max \left (\frac{S\times O}{N\times C}, O \right )
$$
$$
Rb =  (N- 1)\times P \times (X+ Y)
$$
$$
Rc = \max \left (\frac{S\times O}{N}, O \right ) + \max \left (\frac{S\times O}{N}, O \right )
$$ 
$$
R = \max \left (\frac{S\times O}{N\times C}, O \right ) +  \left [  (N- 1)\times P \times (X+ Y)   \right ] + \left [ \max \left (\frac{S\times O}{N}, O \right ) + \max \left (\frac{S\times O}{N}, O \right )  \right ]
$$

对于使用线程池执行的计算任务而言，其中`N 是常量 1，Rb 也是常量 0`，因此计算公式可以简化为：

$$
R = \frac{S\times O}{C}
$$

让我们以一个具体的例子来说明本地线程池和集群计算池的选择：_`一个聚合根需要计算的任务数量是 CPU 核心数量乘以 8，每个计算任务耗时 500ms，状态体积为 1MB，响应体积为 1kb，每个节点有 2 个核心，总节点数量为 8`_。在这种情况下，本地线程池和集群计算池的响应时间为：

$$
\begin{aligned}
R & = \left [ \frac{16\times 500ms}{8\times 2}  \right ] +  \left [  (8- 1)\times 10ms \times (1+ \frac{1}{1024} )   \right ] + (\frac{16\times 500ms}{8} + \frac{16\times 500ms}{8}) \\
&= 500ms + 70ms + 2000ms \\
&= 2570ms \\
\end{aligned}
$$

本地线程池：

$$
R = \frac{16\times 500ms}{2} = 4000ms
$$

## 性能反例 \{#anti-pattern\}

两个经典的反例是：
- **系统负载远大于集群计算池**：_`一个聚合根需要计算的任务数量是 CPU 核心数量乘以 32，每个计算任务耗时 500ms，状态体积为 1MB，响应体积为 1kb，每个节点有 4 个核心，总节点数量为 4`_
- **系统负载远低于本机线程池**：_`一个聚合根需要计算的任务数量是 8，每个计算任务耗时 100ms，状态体积为 1MB，响应体积为 1kb，每个节点有 4 个核心，总节点数量为 4`_

### 系统负载远大于集群计算池 \{#overload\}

$$
\begin{aligned}
R & = \left [ \frac{128\times 500ms}{4\times 4}  \right ] +  \left [  (4- 1)\times 10ms \times (1+ \frac{1}{1024} )   \right ] + (\frac{128\times 500ms}{4} + (\frac{128\times 500ms}{4}) \\
&= 4000ms + 30ms + 32000ms  \\
&= 36030ms \\
\end{aligned}
$$

本地线程池：

$$
R = \frac{128\times 500}{4} = 16000ms
$$

### 系统负载远低于本机线程池 \{#underload\}

$$
\begin{aligned}
R & = \left [ \frac{8\times 100ms}{4\times 4}  \right ] +  \left [  (4- 1)\times 10ms \times (1+ \frac{1}{1024} )   \right ] + (\frac{8\times 100ms}{4} + (\frac{8\times 100ms}{4}) \\
&= 100ms + 30ms + 400ms   \\
&= 530ms \\
\end{aligned}
$$

本地线程池：

$$
R = \frac{8\times 100ms}{4} = 200ms
$$


## 参数配置 \{#config\}

集群计算池提供了一些参数用于根据实际部署的配置来动态调节负载, Spring 集成的配置路径为：`quantex.phoenix.akka.pipeline`

- _**Capacity**_: 任务容量，当内存中积压的计算任务数量大于该容量，那么新提交的计算任务将会立即使用本地执行
- _**Parallelism**_: 并行度，集群线程池的并行度，集群总计的 Worker 数量，一般用法是：`核心数量 * 节点数量`
- _**Timeout**_: 超时配置，接收计算任务响应的耗时，超出该时间则使用本地执行
- _**Dispatcher**_: 调度程序，计算池在每个节点上使用资源数量（线程数量）

或者你也可以在 Akka 配置中调整这些参数（Spring 配置的优先级将会大于 Akka 配置）：

```config
phoenix {
    # 集群计算池
    pipeline {
        # 容量
        capacity = 1000
        # 并行度
        parallelism = 8
        # 超时时间, 默认 30s
        timeout = 30000
        # 默认调度程序
        dispatcher = "distributed-computing-pool-dispatcher"
    }
}
distributed-computing-pool-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  # 线程池配置
  thread-pool-executor {
    core-pool-size-min = 2
    core-pool-size-factor = 1.0
    core-pool-size-max = 10
  }
  throughput = 100
}
```