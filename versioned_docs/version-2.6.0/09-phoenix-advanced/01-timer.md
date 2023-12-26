---
id: aggregate-timer
title: 聚合根定时任务
description: 聚合根的定时调度工具
---

## 介绍 \{#introduce\}

Phoenix 的聚合根拥有通过 API 定时给自身发送消息的特性，简称为：定时器。并遵循着以下原则：

1. 定时器的生命周期跟随与聚合根
    1. 当 JVM 重启或聚合根淘汰时, 定时器中所有定时任务 Phoenix 实例中取消.
    2. 当聚合根漂移时，定时器中所有定时任务在原聚合根所在实例取消, 在聚合根漂移后的新实例上启动.
    3. 当聚合根溯源时，定时器中所有定时任务重新被发布到 Phoenix 实例的 Scheduler.
    4. 当聚合根淘汰时，定时器被关闭，当聚合根支持钝化时，定时任务会在接收新命令后重启.
2. 集群环境下, 定时器只会在一个 Phoenix 实例中启动(与聚合根相同)
3. 定时器的 API 的作用域仅作用于聚合根本身, A 聚合根不能取消 B 聚合根的定时任务.
4. 聚合根定时任务的调度是基于高吞吐率而设计的, 基于 `TimerWheel` 实现, 因此定时任务的触发时间不是精确的, 存在一定的误差.

:::caution[注意]

定时任务会随着快照以及事件持久化（一次的定时任务不会被持久化）, 仅当开发者手动取消定时任务时才会取消任务执行, 且定时任务发送的消息不会被幂等.

因此聚合根定时任务只适用于一些短途定时, 对于长时的任务调度请使用专业的调度框架.

当一次性定时任务发布之后, 但未到延时执行时间时实例宕机, 此时一次性定时任务失效.

:::

### API 说明 \{#api\}

定时器通过`EntityAggregateContext.getTimer()`获取, 并有以下 API:

- **startTimerAtFixedRate**: 以固定的速率/时间窗口发送命令, 当发送耗时 > 时间窗口, 则下一次时间窗口执行两次定时任务, 依次递推. 当发生 GC 时，可能出现同一时间执行多个定时任务.
- **startTimerWithFixedDelay**: 当前定时任务执行完成后, 延时一段时间执行下一次定时任务。不是定时触发，当 GC 时没有尖峰风险.
- **startSingleTimer**: 执行一次定时任务
- **isTimerActive**: 判断定时任务是否正在运行
- **cancel**: 根据 Key 取消指定定时任务
- **cancelAll**: 取消当前聚合根下的定时任务

### 支持的消息种类 \{#message\}

定时器中定时任务的触发结果是发送一条消息给聚合根，`EntityAggregateContext.getTimer()` 支持的消息种类有：

- **聚合根 Command **：用户自定义消息
- **com.iquantex.phoenix.core.message.Message**：Phoenix 消息 Protobuf 代理类. 通过 `MessageFactory.getCmdMsg()` 创建.

:::tip[小提示]

基于 `MessageFactory.getCmdMsg()` 创建的消息支持自定义 source(src) topic，能够在聚合根处理完成之后回复/投递到此 Topic.

:::

### 示例代码 \{#example\}

```java
public class BankAccountAggregate implements SelectiveSnapshot<SnapshotData> {

    /**
     * 在聚合根创建时，发布定时任务. 聚合根的构造函数必须是无参构造函数.
     */
    public BankAccountAggregate() {
        TimerScheduler timer = EntityAggregateContext.getTimer();
        // 当聚合根一个聚合根被创建, 那么一定是接收了某个命令, 并能够在命令中拿到具体的聚合根ID, 否则无法创建一个聚合根.
        String aggregateRootId = EntityAggregateContext.getAggregateRootId();
        timer.startTimerWithFixedDelay("timerTaskWhenBootstrap", new HeartBeatCmd(aggregateRootId), Duration.ofSeconds(1));
    }


    /**
     * 在某个事实发生后, 取消定时任务
     */
    public void on(TimerSchedulerOkEvent event) {
        // 根据条件取消不同的定时任务
        if (aggregateState == 1) {
            EntityAggregateContext.getTimer().cancel("timerTaskWhenBootstrap");
        } else if (aggregateState == 2) {
            EntityAggregateContext.getTimer().cancel("timerTaskAfterBootstrap");
        }
    }

    /**
     * 同理，在某个事实发生后，新增一个定时任务
     */
    public void on(Account.AccountAllocateOkEvent event) {
        EntityAggregateContext.getTimer().startTimerWithFixedDelay("timerTaskAfterBootstrap", new FetchDataFromRemoteCmd(), Duration.ofSeconds(1));
    }
}
```



## 记住实体 \{#remember\}

当聚合根启动了定时任务时，因应用故障可能导致聚合根钝化（不在内存中，需要通过事件溯源恢复到内存上），此时定时任务相应也会被取消。

这种情况下，可通过开启记住实体（默认开启，如无需此功能，则可以按需关闭）来保证开启了定时任务的聚合根能够在其生命周期内（未被淘汰），通过集群单例的记住实体来唤醒。开关配置如下：

```
quantex.phoenix.akka.enable-remember: false/true
```

当开启此功能时，聚合根有如下行为：

- 当聚合根定时任务发生变更时，判断聚合根是否包含定时任务，并发送记住/取消记住实体命令
- 当聚合根淘汰时，发送取消记住实体命令

当聚合根定时任务和记住实体、钝化结合之下可能会相互产生一些影响，目前能做到保证：

- 聚合根淘汰时发送取消注册实体命令，取消所有定时任务。
- Console 查询内存状态时（溯源聚合根）不会触发溯源定时任务
