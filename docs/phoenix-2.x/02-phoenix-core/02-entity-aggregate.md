---
id: phoenix-core-entity-aggregate-2x
title: 实体聚合根
---

在使用 Phoenix 开发项目时，通常需要借助领域驱动（DDD）设计方法，提取领域对象和实体对象。Phoenix中的实体聚合根就对应这里的聚合对象，实体对象为聚合根中的属性

Phoenix 项目中的实体聚合根对象需要遵循如下规范：

1. 聚合根类需要使用 `@EntityAggregateAnnotation` 注解进行标记
2. 聚合根类需要实现 `Serializable` 接口

要使用实体聚合根所提供的的能力，请在您的项目中添加以下依赖：

```xml
<!--phoenix-->
<dependency>
	<groupId>com.iquantex</groupId>
	<artifactId>phoenix-server-starter</artifactId>
	<version>${phoenix.version}</version> 
</dependency>
```

## 写操作定义

实体聚合根中提供 **act** 方法，用来订阅 Command 消息，进行写操作。同时产生该领域将会发生的event事件，通过event事件修改聚合状态。

对于Command 和 Event 事件，phoenix支持两种协议 Protobuf 和 Java Bean。

### @CommandHandler

**act** 方法上需要添加 @CommandHandle 注解进行标识。@CommandHandler中提供两个属性

1. aggregateRootId

含义：聚合根ID
类型：String[]

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

在上面的例子中，我们用证券代码+交易日期共同组成聚合根ID

2. enableCreateAggregate

含义：是否允许自动创建聚合根
类型：boolean
默认值：true

该值用来判断接收到 Command 消息之后，当聚合根不存在时是否允许自动创建聚合根。

### ActReturn

act负责订阅 Command 消息，产生对应的event事件并返回。

ActReturn包含以下属性：

- RetCode 处理结果
  - NONE 初始值，无含义
  - SUCCESS 处理成功
  - FAIL 处理失败
  - EXCEPTION 处理过程有异常
- retMessage   提示信息
- event 返回的事件
- reply
- metaData

### 内存修改

实体聚合根中需要定义 **on** 方法来处理 **act** 方法中返回的 Event 事件。在 **on** 方法中根据event中的内容和语义来修改内存状态。同时 Event 事件会进行持久化处理（EventStore  **Eventstore带修饰**），当需要重建聚合根时，我们可以读取该聚合根的 Event 事件并处理从而重塑聚合根的状态。我们称这个聚合根重塑的过程为EventSourcing。

**on** 方法需要遵循如下两条规范：

- on方法中不能有IO操作，例如：调用DB操作，调用外部接口
- on方法中不能有随机函数，例如：获取系统当前时间，获取随机数

### 内存查询

Phoenix 提供了查询聚合根状态的能力。通过在 **act** 方法上添加 @QueryHandler 注解用来标志该 **act** 方法将会执行一个查询操作。在该 **act** 方法中将需要查询的数据封装进 Event 事件中，通过ActReturn进行返回。

因查询操作产生的 Event 事件就是最终的结果，因此该 Event 不需要编写相应的 **on** 方法，也不会进行持久化操作。

### 幂等功能

概念：同一操作请求，任意多次执行所产生的影响均与一次执行的影响相同

场景：

1. 在phoenix中，采用MQ通讯，我们假设MQ消息通讯不可靠（丢失、乱序、重发）,上游系统也可能会有重试策略，因此phoenix服务可能会收到重复消息。
2. 由于双活场景的存在， 如何保证两个节点收到同一个Cmd的时候， 产生的Event的消息ID是唯一的？

针对场景一，Phoenix的解决方案如下：每个 Command 消息有唯一一个CmdId， Command消息经过聚合根处理会得到一个Event， 因此可以在聚合根中维护一个 CmdId → Event 的集合来实现幂等 （支持可配单个聚合根在内存中Cmdld-EventMsg的缓存数量（加速，空间换时间））

可以通过以下配置来控制幂等集合的大小

```yaml
quantex.phoenix.server.performance.idempotentSize  // 默认值 1000
```

针对场景二，Phoenix的解决方案如下：在产生事务的第一Cmd的时候， 会产生一个事务ID，这个Cmd的消息ID为： 事务ID+0。 那么Cmd产生的Event的消息ID为：事务ID+1，依次类推。这样可以确保多个节点产生的消息ID是一样的。

### 集合根释放

Phoenix针对聚合根提供了一种淘汰机制，对于长时间不活跃的聚合根（聚合根长时间不处理消息），在指定时间之后进行淘汰。

不活跃时间可进行配置，配置如下：

```yaml
// 聚合根淘汰策略-不活跃时间(毫秒)   默认值：86400000 (1天)
quantex.phoenix.server.performance.actor-survive-time  
```

### 快照功能

在上面我们介绍了，Phoenix提供了通过加载 Event 事件进行状态重塑的能力（EventSourcing）。在重塑状态的过程中，需要不断的读取 Event 事件，然后逐一执行进行状态恢复。当事件数量非常多时，这个过程将消耗较多时间。

Phoenix 考虑到了这方面的情况，提供了快照功能来加速状态恢复的过程。通过将某一时刻聚合根的状态进行存储，在状态恢复时，只需要读取该快照之后产生的Event 事件即可，大大加快了EventSourcing的速度。

Phoenix 提供了两种打快照的方式：

- 手动调用打快照的接口
- 通过配置（每处理指定数量的Event之后自动打快照）

接口：

```
/phoenix/snapshot/{aggregateId}
```

配置：

```yaml
quantex.phoenix.server.event-store.snapshot.enabled      // 快照开关   默认：false
quantex.phoenix.server.event-store.snapshot.entitySnapshotInterval             // 实体聚合根快照间隔   默认：50000
quantex.phoenix.server.event-store.snapshot.atLeastOneDeliverySnapshotInterval   // 事务聚合根快照间隔   默认：50000
```

### Spring @Autowrite支持

Phoenix可以和SpringCloud 环境相互打通，比如说聚合根在处理过程中，可以通过feign调用SpringCloud里的服务。通过将聚合根实例纳入Spring管理，使得可以在聚合根中AutoWired其他Bean，或者在其他Bean中AutoWired聚合根实例。以便实现通过Feign接口调用SpribngCloud服务。

使用方式如下：

```java 
@Getter
@Setter
@Slf4j
@EntityAggregateAnnotation(aggregateRootType = "BankAccount")
public class BankAccountAggregate implements Serializable {

	private static final String MONITORY_TIME_OUT_ACCOUNT = "monitor_retry";

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

