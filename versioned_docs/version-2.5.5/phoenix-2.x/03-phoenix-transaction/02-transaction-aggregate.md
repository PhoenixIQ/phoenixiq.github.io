---
id: phoenix-transaction-aggregate
title: 使用说明
---

Phoenix框架提供了事务模块，用来解决分布式事务问题。目前已支持的事务模式有 SAGA 和 TCC。在定义事务处理模型时，你可以灵活配置这两种事务模式。本篇将介绍事务聚合根的定义规范。

## maven依赖

如果需要用到事务模块，需要先引入下面的依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-transaction</artifactId>
   <version>2.5.5</version>
</dependency>
```

## 事务聚合根

事务聚合根需要使用`@TransactionAggregateAnnotation`来标记类，服务启动后phoenix会校验定义规范和创建事务聚合根类对象。事务聚合根类需要遵循如下规范:

1. 聚合根类需要使用 `@TransactionAggregateAnnotation` 注解进行标记。
2. 聚合根类以及聚合根类中的实体均需实现 `Serializable` 接口，并定义serialVersionUID。


:::caution[注意]

在聚合根上添加 `@TransactionAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类。

::: 

#### 示例代码

```java
@TransactionAggregateAnnotation(aggregateRootType = "ShoppingAggregateSagaTcc")
public class ShoppingAggregateSagaTcc implements Serializable {
    private static final long     serialVersionUID          = 7007603076743033374L; 
    // ... act and on method
}
```

## 事务入口

事务聚合根需要使用 `@TransactionStart` 表示事务的入口，该事务开始方法需要定义事务的处理模型。

事务开始方法需要遵循如下规范:

- 使用 `@TransactionStart` 注解
- 该方法只能有一个入参
- 如果当前类中存在多个使用 `@TransactionStart` 注解并且只有一个入参的方法，那么你将收到一个AggregateClassException异常

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

目前支持TCC与SAGA两种事务模式，详细的两种模式的说明请参考 [事务模式](01-transaction-module.md)

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

## 完整案例

购买商品是很常见的业务场景，一般涉及购买方账户扣减，以及商家库存扣减，和订单生成。该案例为了简化实现，不生成订单。

整个业务逻辑由2个聚合根(微服务)构成:

1. 仓储服务: 对给定的商品扣除仓储数量。
2. 账户服务: 从用户账户中扣除余额。

![show](../../assets/phoenix2.x/phoenix-lite/shopping-1.png)

> 该案例使用的是`TCC+Saga`模式。
>
> 更多的事务模式请参见：[PhoenixIQ/phoenix-samples/shopping](https://github.com/PhoenixIQ/phoenix-samples/tree/master/shopping)

#### command/event定义

Phoenix支持 `protostuff` 和 `javaBean` 协议进行序列化，可以通过以下配置进行指定，设定值分别为:`proto_stuff`和`java`

```yaml
quantex.phoenix.server.default-serializer: java
```

这里使用`javaBean`序列化协议进行示范。


**事务服务相关事件**

```java
@Getter
@AllArgsConstructor
public class BuyGoodsCmd implements Serializable {
    private static final long serialVersionUID = -8667685124103764667L;
    private String            accountCode;
    private String            goodsCode;
    private long              qty;
    private double            price;
}
```

**账户服务相关事件**

```java
@Getter
@AllArgsConstructor
public class AccountTryCmd implements Serializable {
    private static final long serialVersionUID = 4778468915465985552L;
    private String accountCode;
    private double frozenAmt;
}

@Getter
@AllArgsConstructor
public class AccountConfirmCmd implements Serializable {
    private static final long serialVersionUID = 6915539313674995272L;
    private String accountCode;
    private double frozenAmt;
}

@Getter
@AllArgsConstructor
public class AccountCancelCmd implements Serializable {
    private static final long serialVersionUID = 3086192070311956483L;
    private String accountCode;
    private double frozenAmt;
}

@Getter
@Setter
@AllArgsConstructor
public class AccountTryOkEvent implements Serializable {
    private static final long serialVersionUID = 1525408241428571363L;
    private String accountCode;
    private double frozenAmt;
}

@Getter
@Setter
@AllArgsConstructor
public class AccountTryFailEvent implements Serializable {
    private static final long serialVersionUID = -8352616962272592136L;
    private String accountCode;
    private double frozenAmt;
    private String remark;
}

@Getter
@Setter
@AllArgsConstructor
public class AccountConfirmOkEvent implements Serializable {
    private static final long serialVersionUID = -6789245872360028227L;
    private String accountCode;
    private double frozenAmt;
}

@Getter
@Setter
@AllArgsConstructor
public class AccountCancelOkEvent implements Serializable {
    private static final long serialVersionUID = -1017410771260579937L;
    private String accountCode;
    private double frozenAmt;
}

```

**仓储服务相关事件**

```java

@Getter
@AllArgsConstructor
public class GoodsSellCmd implements Serializable {
    private static final long serialVersionUID = -4615713736312293797L;
    private String goodsCode;
    private long   qty;
}

@Getter
@AllArgsConstructor
public class GoodsSellCompensateCmd implements Serializable {
    private static final long serialVersionUID = -1797830080849363235L;
    private String goodsCode;
    private long   qty;
}

@Getter
@Setter
@AllArgsConstructor
public class GoodsSellOkEvent implements Serializable {
    private static final long serialVersionUID = 873406977804359197L;
    private String goodsCode;
    private long   qty;
}

@Getter
@Setter
@AllArgsConstructor
public class GoodsSellFailEvent implements Serializable {
    private static final long serialVersionUID = 4825942818190006297L;
    private String goodsCode;
    private long   qty;
    private String remark;
}

@Getter
@Setter
@AllArgsConstructor
public class GoodsSellCompensateOkEvent implements Serializable {
    private static final long serialVersionUID = 3256345453720913064L;
    private String goodsCode;
    private long   qty;
}
```


#### 定义事务聚合根

事务聚合根在接收到购买命令时，分别返回`账户服务TCC`和`仓储服务Saga`的命令给到事务状态机，事务状态机会发送并协调驱动达到最终状态。

事务聚合根可以独立运行，也可以和实体聚合根一起运行。独立运行的情况下，设置targetTopic为实体聚合根的Topic，这里为了方便就设置为空串""代表和实体聚合根集成运行。

事务聚合根的具体定义规则请参考上文 [事务聚合根定义](#事务聚合根)

```java
@TransactionAggregateAnnotation(aggregateRootType = "ShoppingAggregateSagaTcc")
public class ShoppingAggregateSagaTcc implements Serializable {
    private static final long serialVersionUID = 7007603076743033374L;
    private BuyGoodsCmd       request;
    private String            remark           = "";

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

    // ... on method
}
```

#### 定义实体聚合根

实体聚合根中对 **Command** 的处理需要遵循 SAGA 或 TCC 规范，具体的定义规则可以参考 [实体聚合根定义](../02-phoenix-core/02-entity-aggregate.md)

```java
@EntityAggregateAnnotation(aggregateRootType = "AccountAggregate")
public class AccountAggregate implements Serializable {
    private static final long serialVersionUID = 1989248847513267951L;
    private double            amt;
    private double            frozenAmt;
    
    @CommandHandler(aggregateRootId = "accountCode")
    public ActReturn act(AccountTryCmd cmd) {
        if (amt - frozenAmt > cmd.getFrozenAmt()) {
            return ActReturn.builder().retCode(RetCode.SUCCESS)
                .event(new AccountTryOkEvent(cmd.getAccountCode(), cmd.getFrozenAmt())).build();
        } else {
            String retMessage = String.format("资金可用不足，剩余:%f, 当前需要冻结:%f", amt - frozenAmt, cmd.getFrozenAmt());
            return ActReturn.builder().retCode(RetCode.FAIL).retMessage(retMessage)
                .event(new AccountTryFailEvent(cmd.getAccountCode(), cmd.getFrozenAmt(), retMessage)).build();
        }
    }

    public void on(AccountTryOkEvent event) {
        frozenAmt += event.getFrozenAmt();
    }

    public void on(AccountTryFailEvent event) { }

    @CommandHandler(aggregateRootId = "accountCode")
    public ActReturn act(AccountConfirmCmd cmd) {
        return ActReturn.builder().retCode(RetCode.SUCCESS)
            .event(new AccountConfirmOkEvent(cmd.getAccountCode(), cmd.getFrozenAmt())).build();
    }

    public void on(AccountConfirmOkEvent event) {
        amt -= event.getFrozenAmt();
        frozenAmt -= event.getFrozenAmt();
    }

    @CommandHandler(aggregateRootId = "accountCode")
    public ActReturn act(AccountCancelCmd cmd) {
        return ActReturn.builder().retCode(RetCode.SUCCESS)
            .event(new AccountCancelOkEvent(cmd.getAccountCode(), cmd.getFrozenAmt())).build();
    }

    public void on(AccountCancelOkEvent event) {
        frozenAmt -= event.getFrozenAmt();
    }
}

@EntityAggregateAnnotation(aggregateRootType = "GoodsTcc")
public class GoodsAggregate implements Serializable {
    private static final long serialVersionUID = -6111851668488622895L;
    private long              qty;
    private long              frozenQty;

    @CommandHandler(aggregateRootId = "goodsCode")
    public ActReturn act(GoodsSellCmd cmd) {
        if (cmd.getQty() < 0) {
            throw new RuntimeException("数不能小于0");
        }
        if (qty > cmd.getQty()) {
            return ActReturn.builder().retCode(RetCode.SUCCESS)
                .event(new GoodsSellOkEvent(cmd.getGoodsCode(), cmd.getQty())).build();
        } else {
            String ret = String.format("余额不足，剩余:%d, 当前需要:%d", qty, cmd.getQty());
            return ActReturn.builder().retCode(RetCode.FAIL).retMessage(ret)
                .event(new GoodsSellFailEvent(cmd.getGoodsCode(), cmd.getQty(), ret)).build();
        }
    }

    public void on(GoodsSellOkEvent event) {
        qty -= event.getQty();
    }

    public void on(GoodsSellFailEvent event) { }

    @CommandHandler(aggregateRootId = "goodsCode")
    public ActReturn act(GoodsSellCompensateCmd cmd) {
        return ActReturn.builder().retCode(RetCode.SUCCESS)
            .event(new GoodsSellCompensateOkEvent(cmd.getGoodsCode(), cmd.getQty())).build();
    }

    public void on(GoodsSellCompensateOkEvent event) {
        qty += event.getQty();
    }
}
```

> 完整的案例请参考：[PhoenixIQ/phoenix-samples/shopping](https://github.com/PhoenixIQ/phoenix-samples/tree/master/shopping)

