---
id: phoenix-transaction-aggregate
title: 事务聚合根
---

Phoenix框架提供了事务模块，目前支持的事务模式有SAGA与TCC。在定义事务处理模型时，你可以灵活配置这两种事务模式。本篇将介绍事务聚合根的定义规范。


## maven依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-transaction</artifactId>
   <version>2.4.1</version>
</dependency>
```

## 事务聚合根

事务聚合根需要使用`@TransactionAggregateAnnotation`来标记类，服务启动后phoenix会校验定义规范和创建事务聚合根类对象。事务聚合根类需要遵循如下规范:

1. 聚合根类需要使用 `@TransactionAggregateAnnotation` 注解进行标记。
2. 聚合根类以及聚合根类中的实体均需实现 `Serializable` 接口，并定义serialVersionUID。

> 注意:在聚合根上添加 `@TransactionAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类。
 
#### 示例代码

```java
@TransactionAggregateAnnotation(aggregateRootType = "ShoppingAggregateSagaTcc")
public class ShoppingAggregateSagaTcc implements Serializable {
    private static final long     serialVersionUID          = 7007603076743033374L; 
    // ... act and on method
}
```

## 事务入口

事务聚合根需要使用@TransactionStart表示事务的入口，该事务开始方法需要定义事务的处理模型。

事务开始方法需要遵循如下规范:

- 使用@TransactionStart注解
- 该方法只能有一个入参
- 如果当前类中存在多个使用@TransactionStart注解并且只有一个入参的方法，那么你将收到一个AggregateClassException异常

#### 示例代码

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

#### TransactionReturn

事务的入口方法在处理 Command 命令之后需要返回处理的结果以及一些必要的信息，Phoenix对事务的入口方法的返回值做了一层封装，统一放到了TransactionReturn中。 
```java
public class TransactionReturn {
    private final List<TransactionAction> actions;
    // setter getter ...
}

```
#### TransactionAction

TransactionAction类定义了目标Topic。如果实体聚合根与事务聚合根分开部署，那么Topic需要设置成目标实体聚合根的Topic。如果实体聚合根与事务聚合根集成部署，那么Topic需要设置成空串("")

```java
public abstract class TransactionAction {
    protected String targetTopic;
}

```

目前支持TCC与SAGA两种事务模式，详细的两种模式的说明请参考 [事务模式](03-transaction-module.md)

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
``` java
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

## 事件处理

经过实体聚合根处理后产生的Event事件会发送到事务聚合根，可以根据需要定义on方法来处理Event事件。

**on()** 方法需要遵循如下规范:

- on方法中不能有IO操作，例如:调用DB操作，调用外部接口
- on方法中不能有随机函数，例如:获取系统当前时间，获取随机数
- on方法可以重载定义，并且至少有一个入参。

#### 示例代码
```java
    public TransactionReturn on(AccountTryFailEvent event) {
        log.info("商品<{}> 成功售出", event.getGoodsCode());
        return null;
    }
```

## 事务完成

事务完成后，会调用事务聚合根的onFinish方法

**onFinish()** 方法需要遵循如下规范:

- onFinish方法是唯一的，不可重载定义，否则你会收到一个`AggregateClassException`异常

#### 实例代码

```java
public Object onFinish() {
    return new BuyGoodsEvent("购买商品成功");
}
```