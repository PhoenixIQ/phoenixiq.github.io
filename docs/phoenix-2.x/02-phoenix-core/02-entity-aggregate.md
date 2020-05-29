---
id: phoenix-core-entity-aggregate-2x
title: 实体聚合根
---

在使用 Phoenix 开发项目时，通常需要借助领域驱动设计（DDD），提取领域实体，其中一个特殊的实体为聚合根（领域外对领域内其他实体的访问都需要通过该聚合根），而Phoenix中的实体聚合根概念就对应DDD中的聚合根。

Phoenix 项目中的实体聚合根对象需要遵循如下规范：

1. 聚合根类需要使用 `@EntityAggregateAnnotation` 注解进行标记

2. 聚合根类以及聚合根类中的实体均需实现 `Serializable` 接口

> 注意：在聚合根上添加 `@EntityAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类，该聚合根类别是全局唯一的。且聚合根ID的长度要小于64个字符。

| 配置项            | 描述                                                   | 类型      | 默认值 |
| :----------------| :----------------------------------------------------  | :------   | :----- |
|aggregateRootType | 聚合根类型                                              | String    | 必填项 |
|surviveTime       | 聚合根生存时间,超过该事件聚合根将被销毁                    | long      | Long.MAX_VALUE |
|snapshotInterval  | 快照间隔，每隔snapshotInterval条消息打印一次快照，0为关闭          | long       | 1000 |
|idempotentSize    |  聚合根幂等集合大小。取值应大于零，否则可能会导致启动失败    | long      | 1000d |


要使用实体聚合根所提供的的能力，请在您的项目中添加以下依赖：

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-server-starter</artifactId>
   <version>2.1.5</version> 
</dependency>
```

## 写操作

实体聚合根中需要提供 **act** 方法，用来订阅 Command 消息，进行写操作。同时产生该领域将会发生的 Event 事件，通过 Event 事件修改聚合状态。

对于 Command 命令和 Event 事件，phoenix支持两种协议：

- Protobuf 
- Java Bean

### act 方法

实体聚合根中的 **act** 方法上需要添加 @CommandHandler 注解进行标识。@CommandHandler 中提供两个属性

| 配置项                | 描述                    | 类型      | 默认值 |
| :---------------------| :----------------------| :------   | :----- |
|AggregateRootId        | 聚合根id                | String[] | 必填项 |
|enableCreateAggregate  | 是否允许自动创建聚合根   | boolean   | true |
|idempotentIds          | 幂等id                  | String[] | 空：采用phoenix默认的幂等id |

1. **AggregateRootId**

Phoenix 支持通过拼装多个有意义的字段属性作为聚合根的ID。例如：

```java 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPositionCmd implements Serializable {

    /** 证券代码 **/
    private String secuCode;

    /** 价格 **/
    private Double price;

    /** 交易日期 **/
    private Date date;

}

/**
   * secuCode：证券代码
   * date：交易日期
   */
@CommandHandler(aggregateRootId = { "secuCode", "date" })
public ActReturn act(AddPositionCmd cmd) {
   ...
}
```

在上面的例子中，我们用 证券代码 + 交易日期 共同组成聚合根ID。具体的项目可以根据设计选用具有合适意义的字段作为聚合根ID。

2. **enableCreateAggregate**

该值用来判断接收到 Command 消息之后，当聚合根不存在时是否允许自动创建聚合根。

3. **idempotentIds**

可以防止消息重复处理。支持使用多个字段作为幂等id。

### ActReturn

**act** 方法在处理 Command 命令之后需要返回处理的结果以及一些必要的信息，Phoenix对 **act** 方法的返回值做了一层封装，统一放到了 ActReturn中。

ActReturn包含以下属性：

- RetCode 处理结果
  - NONE 初始值，无含义
  - SUCCESS 处理成功
  - FAIL 处理失败
  - EXCEPTION 处理过程有异常
- retMessage 提示信息
- event 返回的事件

ActReturn中 Event 事件将会到达两个地方：调用方和on方法

### on 方法

实体聚合根中需要定义 **on** 方法，订阅 **act** 方法中处理 Command 命令所产生的 Event 事件。同时 Event 事件会进行持久化处理（EventStore），当需要重建聚合根内存状态时，通过EventSourcing进行状态重塑。在重塑时可以通过快照进行加速。快照相关配置请参考:[配置详情](./phoenix-core-config-2x)

**on** 方法需要遵循如下两条规范：

- on方法中不能有IO操作，例如：调用DB操作，调用外部接口
- on方法中不能有随机函数，例如：获取系统当前时间，获取随机数


### 幂等操作
> 设计参见[Phoenix是如何实现幂等的](../../../blog/idempotent)
Phoenix是消息驱动的框架，消息在传输过程中会存在一笔消息重发的情况，同时上游系统也可能有重试策略(两笔消息,但是业务含义一样)

Phoenix会默认对同一笔消息进行幂等处理，同时也提供功能支持用户自定义幂等主键来实现业务幂等，可以在`CommandHandler`注解上`idempotentIds`声明幂等主键

```java 
@CommandHandler(aggregateRootId = "accountCode", idempotentIds = {"account", "num"} )
public ActReturn act(AccountCreateCmd createCmd) {}
```

Phoenix在处理幂等时，通过内存有限的幂等集合和EventStore中事件的唯一索引来保证。通常情况下，有限幂等集合可以保证最新处理消息的唯一性，如果是历史消息的重试会命中EventStore的唯一索引来保证。可以在`EntityAggregateAnnotation`注解上`idempotentSize`参数来调整幂等集合的大小。

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount", idempotentSize = 1000)
public class BankAccountAggregate implements Serializable {}
```

## 查询操作

Phoenix 提供了查询聚合根状态的能力。通过在 **act** 方法上添加 `@QueryHandler` 注解用来标志该 **act** 方法将会执行一个查询操作。在该 **act** 方法中将需要查询的数据封装进 Event 事件中，通过ActReturn进行返回。

因查询操作不涉及内存状态的修改，只是对数据进行查询，所以查询操作所产生的的Event事件不会进行持久化操作。

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount")
public class BankAccountAggregate implements Serializable {

	private static final long serialVersionUID = 6073238164083701075L;

	/** 账户代码 */
	private String account;

	/** 账户余额 */
	private double balanceAmt;

	/**
	 * 处理查询命令
	 * @param cmd
	 * @return
	 */
	@QueryHandler(aggregateRootId = "accountCode")
	public ActReturn act(AccountQueryCmd cmd) {

		return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage("查询成功").event(
				new AccountQueryEvent(account, balanceAmt, successTransferOut, failTransferOut, successTransferIn))
				.build();
	}
}
```

## 聚合根释放

Phoenix针对每个聚合根类型提供了一种淘汰机制，对于长时间不活跃的聚合根（聚合根长时间不处理消息），在指定时间之后进行淘汰。

可以在每个聚合根的 `@EntityAggregateAnnotation`中增加`surviveTime`不活跃时间可进行配置，配置如下：

```java
// surviveTime 聚合根淘汰策略-不活跃时间(毫秒)   默认值：Long.MAX_VALUE
@EntityAggregateAnnotation(aggregateRootType = "BankAccount", surviveTime = 1000 * 60)
public class BankAccountAggregate implements Serializable {
}
```

## Spring 支持

Phoenix可以和SpringCloud 环境相互打通，比如说聚合根在处理过程中，可以通过feign调用SpringCloud里的服务。通过将聚合根实例纳入Spring管理，使得可以在聚合根中AutoWired其他Bean，或者在其他Bean中AutoWired聚合根实例。以便实现通过Feign接口调用SpribngCloud服务。

使用方式如下：

```java
@Getter
@Setter
@Slf4j
@EntityAggregateAnnotation(aggregateRootType = "BankAccount")
public class BankAccountAggregate implements Serializable {

    private static final long serialVersionUID = 6073238164083701075L;

    /** 账户代码 */
    private String account;

    /** 账户余额 */
    private double balanceAmt;

    /** 成功转出次数 */
    private int successTransferOut;

    /** 失败转出次数 */
    private int failTransferOut;

    /** 成功转入次数 */
    private int successTransferIn;

    /** 第三方服务 */
    @Autowired
    private transient BankAccountService service;
}
```


## 消息订阅

**Phoenix**支持订阅外部**topic**中的数据转化为命令来处理

### 反序列化类

用来反序列化执行topic中的数据，转化为phoenix的命令。

原理：Phoenix会自动拉取指定topic的数据，得到数据后调用指定的反序列方式来获取命令，参数className为kafka消息中的key，bytes为value。

- 范例:

```java
@Override
public List<DeserializationReturn> deserialize(String className, byte[] bytes) {
    List<DeserializationReturn> deserializationReturns = new ArrayList<>();
    // 外部批量聚合根事件转换为多个聚合根的创建cmd
    if (OtherSystemBatchAccountCreateEvent.class.getName().equals(className)) {
        OtherSystemBatchAccountCreateEvent batchAccountCreateEvent = JsonUtils.decode(new String(bytes), className);
        batchAccountCreateEvent.getAccounts().forEach(account -> {
            AccountCreateCmd accountCreateCmd = new AccountCreateCmd(account, batchAccountCreateEvent.getAmt());
            deserializationReturns
                    .add(new DeserializationReturn(accountCreateCmd, "account-server/EA/BankAccount", true));
        });
    }
    return deserializationReturns;
}
```

### 配置

如果消息是**Phoenix**创建的命令，则可以不设置反序列化类路径，Phoenix会使用默认的反序列化类来处理。

| 配置项                | 描述                    | 类型      | 默认值 |
| :---------------------| :----------------------| :------   | :----- |
|quantex.phoenix.server.mq.subscribes.topic| 订阅的topic | String| 无|
|quantex.phoenix.server.mq.subscribes.deserializer| 对应topic的反序列化类路径,为空表示使用默认反序列化方式 | String| 无|

示例:

其中**account-server**使用默认的反序列化方式获取消息

```yaml
quantex:
  phoenix:
    server:
      mq:
        subscribes:
          - topic: account-server
          - topic: account-web-event
            deserializer: com.iquantex.phoenix.bankaccount.subscribes.WebEventTopicDeserializable
```