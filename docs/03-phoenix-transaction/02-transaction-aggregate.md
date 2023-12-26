---
id: phoenix-transaction-aggregate
title: 使用说明
description: Phoenix 分布式事务使用说明
---

Phoenix框架提供了事务模块，用来解决分布式事务问题。目前已支持的事务模式有 SAGA 和 TCC。在定义事务处理模型时，你可以灵活配置这两种事务模式。本篇将介绍事务聚合根的定义规范。

## maven依赖 \{#dependency\}

如果需要用到事务模块，需要先引入下面的依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-transaction</artifactId>
   <version>2.6.1</version>
</dependency>
```

## 事务聚合根 \{#transaction-aggregate\}

事务聚合根需要使用`@TransactionAggregateAnnotation`来标记类，服务启动后phoenix会校验定义规范和创建事务聚合根类对象。事务聚合根类需要遵循如下规范:

1. 聚合根类需要使用 `@TransactionAggregateAnnotation` 注解进行标记。
2. 聚合根类以及聚合根类中的实体均需实现 `Serializable` 接口，并定义serialVersionUID。


:::caution[注意]

在聚合根上添加 `@TransactionAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类。

::: 

#### 示例代码 \{#aggregate-example\}

```java
@TransactionAggregateAnnotation(aggregateRootType = "ShoppingAggregateSagaTcc")
public class ShoppingAggregateSagaTcc implements Serializable {
    private static final long     serialVersionUID          = 7007603076743033374L; 
    // ... act and on method
}
```

## 注解配置

| 配置项                    | 描述                                   | 类型     | 默认值                             |
|:-----------------------|:-------------------------------------|:-------|:--------------------------------|
| aggregateRootType      | 聚合根类型                                | String | 必填项                             |
| heartbeatTickInterval  | 心跳滴答间隔, 该参数可以降低事务聚合根的 CPU 开销(提高间隔).  | int    | 1                               |
| heartbeatCheckInterval | 多少次心跳触发一次超时和重试的检测                    | int    | 2                               |
| retryStrategy          | 重试策略, 默认为指数退避, 可选(指数退避, 固定频率)        | enum   | EXPONENTIAL_BACKOFF 可选 FIX_RATE |
| maxRetryNum            | 总事务最大重试次数                            | int    | Integer.MAX_VALUE               |
| batchWeight            | 聚合根最大攒批大小 (尽力而为的攒批模式, 当下游可用时总是会优先交付) | int    | 200                             |


对于事务聚合根而言，每次重试的间隔相当于：`heartbeatTickInterval * heartbeatCheckInterval` 

`heartbeatCheckInterval` 相当于重试策略的基数，例如在指数退避模式下，重试间隔为则为: `(2 << 0), (2 << 1), (2 << 2), (2 << 3)`

## 事务入口 \{#start\}

事务聚合根需要使用 `@TransactionStart` 表示事务的入口，该事务开始方法需要定义事务的处理模型。

事务开始方法需要遵循如下规范:

- 使用 `@TransactionStart` 注解
- 该方法只能有一个入参
- 如果当前类中存在多个使用 `@TransactionStart` 注解并且只有一个入参的方法，那么你将收到一个AggregateClassException异常

#### 示例代码 \{#start-example\}

Phoenix事务聚合根可以对实体聚合根提供的TCC和SAGA接口灵活组装，该示例使用的是TCC+SAGA混合模式。

```java
    @TransactionStart
    public TransactionReturn on(BuyGoodsCmd request) {
        this.request = request;
        double frozenAmt = request.getQty() * request.getPrice();
        return TransactionReturn
            .builder()
            .addAction(
                TccAction.builder().tryCmd(new AccountTryCmd(request.getAccountCode(), frozenAmt))
                    .confirmCmd(new AccountConfirmCmd(request.getAccountCode(), frozenAmt))
                    .cancelCmd(new AccountCancelCmd(request.getAccountCode(), frozenAmt)).targetTopic("")
                    .subTransId(UUID.randomUUID().toString()).tryMaxRetryNum(2).confirmRetryNum(3).cancelRetryNum(3)
                    .build())
            .addAction(
                SagaAction.builder().targetTopic("").tiCmd(new GoodsSellCmd(request.getGoodsCode(), request.getQty()))
                    .ciCmd(new GoodsSellCompensateCmd(request.getGoodsCode(), request.getQty())).tiMaxRetryNum(2)
                    .ciMaxRetryNum(2).subTransId(UUID.randomUUID().toString()).build()).build();
    }
```

#### TransactionReturn \{#return\}

事务的入口方法在处理 Command 命令之后需要返回处理的结果以及一些必要的信息，Phoenix对事务的入口方法的返回值做了一层封装，统一放到了TransactionReturn中。 
```java
public class TransactionReturn {
    private final List<TransactionAction> actions;
    // setter getter ...
}

```
#### TransactionAction \{#action\}

TransactionAction类定义了目标Topic。如果实体聚合根与事务聚合根分开部署，那么Topic需要设置成目标实体聚合根的Topic。如果实体聚合根与事务聚合根集成部署，那么Topic需要设置成空串("")

```java
public abstract class TransactionAction {
    protected String targetTopic;
}

```

目前支持TCC与SAGA两种事务模式，详细的两种模式的说明请参考 [事务模式](/docs/phoenix-transaction/phoenix-transaction-module)

TccAction中的tryCmd、confirmCmd和cancelCmd均需要定义，否则事务执行过程中会出现事务回滚/提交异常（无法保证状态一致性）。

```java
public class TccAction extends TransactionAction {
    // try      默认最大重试次数
    public static final int TRY_MAX_RETRY_NUM_DEFAULT     = 5;
    // confirm  默认最大重试次数
    public static final int CONFIRM_MAX_RETRY_NUM_DEFAULT = 10;
    // cancel   默认最大重试次数
    public static final int CANCEL_MAX_RETRY_NUM_DEFAULT  = 10;
    private final Object    tryCmd;
    private final Object    confirmCmd;
    private final Object    cancelCmd;
    private final Integer   tryMaxRetryNum;
    private final Integer   cancelMaxRetryNum;
    private final Integer   confirmMaxRetryNum;
    private final String    subTransId;
    // getter setter ...
}
```

正常事务模型中SagaAction中的tiCmd和ciCmd均需要定义，否则事务执行过程中会出现事务回滚异常（无法保证状态一致性）。

```java
public class SagaAction extends TransactionAction {
    // ti 默认最大重试次数
    public static final int TI_MAX_RETRY_NUM_DEFAULT = 5;
    // ci 默认最大重试次数
    public static final int CI_MAX_RETRY_NUM_DEFAULT = 10;
    private final Object    tiCmd;
    private final Object    ciCmd;
    private final Integer   tiMaxRetryNum;
    private final Integer   ciMaxRetryNum;
    private final String    subTransId;
    // getter setter ...
}
```

针对一些特殊场景，比如只需要Saga发出一个TiCmd，不需要回滚的场景，可以设置SagaAction中的ciCmd为`PhoenixServer.TransactionSagaMockCiCmd`，参考实例代码

```java
public TransactionReturn on(BuyGoodsCmd buyGoodsCmd) {
    this.buyGoodsCmd = buyGoodsCmd;
    return TransactionReturn.builder()
            .addAction(
                    SagaAction.builder()
                            .tiCmd(new AccountQueryCmd(buyGoodsCmd.getAccountCode()))
                            .ciCmd(SagaAction.genMockCiCmd())
                            .build())
            .build();
}
```

## 事件处理 \{#event-handler\}

经过实体聚合根处理后产生的Event事件会发送到事务聚合根，可以根据需要定义on方法来处理Event事件。

**on()** 方法需要遵循如下规范:

- on方法中不能有IO操作，例如:调用DB操作，调用外部接口
- on方法中不能有随机函数，例如:获取系统当前时间，获取随机数
- on方法可以重载定义，并且至少有一个入参。

#### 示例代码 \{#handler-example\}
```java
    public TransactionReturn on(AccountTryFailEvent event) {
        log.info("商品<{}> 成功售出", event.getGoodsCode());
        return null;
    }
```

## 事务完成 \{#finish\}

事务完成后，会调用事务聚合根的onFinish方法

**onFinish()** 方法需要遵循如下规范:

- onFinish方法是唯一的，不可重载定义，否则你会收到一个`AggregateClassException`异常

#### 示例代码 \{#finish-example\}

```java
public Object onFinish() {
    return new BuyGoodsEvent("购买商品成功");
}
```

## 超时、重试机制  \{#timout-and-retry\}

Phoenix 事务模块使用心跳检查来触发重试，并且针对总事务和子事务均有最大重试，超时机制。下面是一些参数的说明：

- 注解 `heartbeatTickInterval`：触发一次心跳更新状态的周期（秒），心跳打印聚合根状态，触发重试策略计数器自增。
- 注解 `heartbeatCheckInterval`：多少次心跳触发一次检查，是重试、超时机制的计数器的基数，用于判断超时和重试
- 注解 `maxRetryNum`：事务聚合根会在多少次重试之后超时结束（不会触发事务补偿）
- 子事务属性 `tryMaxRetryNum`：子事务在多少次重试之后超时结束，触发补偿和回滚动作。

心跳 Tick 只会打印事务聚合根和修改重试策略的计数器状态，重试需要心跳滴答到 Check 的次数之后，才会触发，并判断是否超时。

简而言之，重试周期 = `heartbeatTickInterval * heartbeatCheckInterval`

超时周期 = `重试周期 * maxRetryNum/tryMaxRetryNum`

可以将 heartbeatCheckInterval 设置为 1，以方便计算，heartbeatCheckInterval 的主要作用是作为重试策略的基数：

- `FIX_RATE`: 以 heartbeatCheckInterval 为一个周期重试
- `EXPONENTIAL_BACKOFF`: 以 heartbeatCheckInterval 为基数指数增加，如 heartbeatCheckInterval = 2，则
  - 第一次重试：`2 << 0 `
  - 第二次重试：`2 << 1`
  - 第三次重试：`2 << 2`
  - ...
  - 第 N 次重试： `2 << n - 1`

如：用户需要 30s 全局事务超时，和每个子事务拥有 10s 的超时时间，则可以配置为：

- 注解 `heartbeatTickInterval = 1`： 每秒心跳一次
- 注解 `heartbeatCheckInterval = 2`：每两次心跳检查一次
- 注解 `maxRetryNum = 14`：重试 14 次后超时
- 子事务 `tryMaxRetryNum = 4`：重试 4 次后超时

为什么重试次数总是少了 1 呢？这是因为 maxRetryNum 是重试的次数，而第一次发送不认为是重试，那么则有如下计算公式：

```
重试周期 = heartbeatTickInterval * heartbeatCheckInterval
超时时间 = 重试周期 + (重试周期 * maxRetryNum)
```

也就是

```
事务聚合根初始化 -> 心跳周期 -> (心跳判断 + 第一次重发) -> 心跳周期 ->  (心跳判断 + 第二次重发) -> ....
```