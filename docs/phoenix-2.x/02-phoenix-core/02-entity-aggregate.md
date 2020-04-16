---
id: phoenix-core-entity-aggregate-2x
title: 实体聚合根
---

在使用 Phoenix 开发项目时，通常需要借助领域驱动（DDD）设计方法，提取领域对象和实体对象。Phoenix中的实体聚合根就对应DDD中的聚合对象，实体对象则为实体聚合根中的属性。

Phoenix 项目中的实体聚合根对象需要遵循如下规范：

1. 聚合根类需要使用 `@EntityAggregateAnnotation` 注解进行标记

2. 聚合根类需要实现 `Serializable` 接口

> 注意：在聚合根上添加 `@EntityAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类，该聚合根类别是全局唯一的。

要使用实体聚合根所提供的的能力，请在您的项目中添加以下依赖：

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-server-starter</artifactId>
   <version>2.1.3</version> 
</dependency>
```

## 写操作

实体聚合根中需要提供 **act** 方法，用来订阅 Command 消息，进行写操作。同时产生该领域将会发生的 Event 事件，通过 Event 事件修改聚合状态。

对于 Command 命令和 Event 事件，phoenix支持两种协议：

- Protobuf 
- Java Bean

### act 方法

实体聚合根中的 **act** 方法上需要添加 @CommandHandler 注解进行标识。@CommandHandler 中提供两个属性

1. **AggregateRootId**
   - 含义： 聚合根Id
   - 类型：String[]

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
   - 含义：是否允许自动创建聚合根
   - 类型：boolean
   - 默认值：true

该值用来判断接收到 Command 消息之后，当聚合根不存在时是否允许自动创建聚合根。

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

实体聚合根中需要定义 **on** 方法，订阅 **act** 方法中处理 Command 命令所产生的 Event 事件。同时 Event 事件会进行持久化处理（EventStore），当需要重建聚合根内存状态时，我们可以读取该聚合根的 Event 事件进行状态重塑。我们称这个聚合根重塑的过程为EventSourcing。

**on** 方法需要遵循如下两条规范：

- on方法中不能有IO操作，例如：调用DB操作，调用外部接口
- on方法中不能有随机函数，例如：获取系统当前时间，获取随机数

### 快照功能

为了加快 EventSourcing 的速度，Phoenix 提供了快照的功能（即将集合根某一时刻的内存状态进行存储）

Phoenix 提供了两种打快照的方式：

- 手动调用打快照的接口
- 通过配置（每处理指定数量的Event之后自动打快照）

接口：

```undefined
/phoenix/snapshot/{aggregateId}
```

配置：

```yaml
quantex.phoenix.server.event-store.snapshot.enabled      // 快照开关   默认：false
quantex.phoenix.server.event-store.snapshot.entitySnapshotInterval             // 实体聚合根快照间隔   默认：50000
quantex.phoenix.server.event-store.snapshot.atLeastOneDeliverySnapshotInterval   // 事务聚合根快照间隔   默认：50000
```

### 幂等操作

目前 Phoenix 采用 MQ 进行通讯，我们假设基于MQ的消息通讯不可靠，会出现消息丢失、乱序、重发等情况，上游系统也可能会有重试策略，因此Phoenix服务有很大可能会接收到重复的消息。

Phoenix 针对这种情况在框架内部实现了幂等处理。通过数据库的唯一索引和内存幂等集合等实现保证了同一个 Command 只会处理一次。

内存幂等集合的大小支持可配，可以通过如下配置项自定义配置：

```java 
quantex.phoenix.server.performance.idempotentSize  // 默认值 1000
```

## 查询操作

Phoenix 提供了查询聚合根状态的能力。通过在 **act** 方法上添加 @QueryHandler 注解用来标志该 **act** 方法将会执行一个查询操作。在该 **act** 方法中将需要查询的数据封装进 Event 事件中，通过ActReturn进行返回。

因查询操作不涉及内存状态的修改，只是对数据进行查询，所以查询操作所产生的的Event事件不会进行持久化操作。

## 聚合根释放

Phoenix针对聚合根提供了一种淘汰机制，对于长时间不活跃的聚合根（聚合根长时间不处理消息），在指定时间之后进行淘汰。

不活跃时间可进行配置，配置如下：

```java
// 聚合根淘汰策略-不活跃时间(毫秒)   默认值：86400000 (1天)
quantex.phoenix.server.performance.actor-survive-time
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
