---
id: phoenix-core-entity-aggregate-2x
title: 实体聚合根
---

     -  总体介绍
     -  命令处理(介绍CommandeHandler、QueryHandler和act方法，是否创建聚合根，多字段聚合根ID)
     -  查询处理(介绍QueryHandler和act方法，多字段聚合根ID)
     -  事件处理(介绍on方法，和on方法书写规则)
     -  聚合根释放
     -  消息幂等
     -  快照配置
     -  Spring配置

## 实体聚合根介绍

有关此功能的介绍，请参阅 [Phoenix Core 中关于实体聚合根的介绍 ](/)

要使用实体聚合根所提供的的能力，请在您的项目中添加以下依赖：

```xml
<!--phoenix-->
<dependency>
	<groupId>com.iquantex</groupId>
	<artifactId>phoenix-server-starter</artifactId>
	<version>${phoenix.version}</version> 
</dependency>
```

### 命令处理

实体聚合根中提供 **act** 方法用来处理 Command 消息和 Query 消息。

Phoenix 提供两种不同的注解（ `@CommandHandler` 和 `@QueryHandler` ）来区分这两类消息。

#### 注解详情

##### aggregateRootId

 `@CommandHandler` 和 `@QueryHandler` 这两个注解中都有一个 `aggregateRootId` 的属性。该属性是一个字符串数组，每一个字符对应 Command 消息中的一个属性名，Phoenix通过这些属性名来获取其对应的值，进行组装。作为该聚合根的ID。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManyCreateCmd implements Serializable {

	/** 聚合根 **/
	private String fundCode;

	/** 数值 **/
	private int num;

	/** 时间 **/
	private Date date;

}

@CommandHandler(aggregateRootId = { "fundCode", "num", "date" })
public ActReturn act(ManyCreateCmd cmd) {
   return ActReturn.builder().retCode(RetCode.SUCCESS).event(new ManyCreateEvent(cmd.getNum(), cmd.getDate()))
         .build();
}
```

如果接收到ManyCreateCmd(fundCode, 100, 2020-03-24) ，则最终的聚合根ID为 fundCode-100-2020-03-24

##### enableCreatAggregate

@CommandHandler中还提供了一个属性 `enableCreatAggregate` 用来控制当接收到的Command所对应的聚合根不存在时是否自动创建该聚合根。

默认值： true。（当Command 消息对应的聚合根不存在时，自动创建）

#### @CommandHandler

添加 `@CommandHandler` 注解的 **act** 方法主要用来处理 Command 消息，它的主要职责包括

- 对 Command 消息中提供的数据进行校验
- 对依赖数据进行组装（如果 Command 操作需要依赖其他的数据）
- 返回 ActReturn 结果

ActReturn包含以下属性：

- RetCode（NONE, SUCCESS, FAIL, EXCEPTION） 处理结果
- retMessage    返回message
- event 返回的事件
- reply
- metaData

```java
@CommandHandler(aggregateRootId = "accountCode")
public ActReturn act(AccountCreateCmd createCmd) {

   String message = String.format("初始化账户代码<%s>, 初始化余额<%s>. ", createCmd.getAccountCode(),
         createCmd.getBalanceAmt());

   return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage(message)
         .event(new AccountCreateEvent(createCmd.getAccountCode(), createCmd.getBalanceAmt())).build();
}
```

#### @QueryHandler

添加 `@QueryHandler` 注解的 **act** 方法主要用来处理 Query 消息，它的主要职责包括

- 查询聚合内存状态
- 对聚合内数据进行封装
- 返回ActReturn

```java
@QueryHandler(aggregateRootId = "accountCode")
public ActReturn act(AccountQueryCmd cmd) {

   return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage("查询成功").event(
         new AccountQueryEvent(account, balanceAmt, successTransferOut, failTransferOut, successTransferIn))
         .build();
}
```

### 事件处理

实体聚合根中提供 **on**  方法来处理 **act** 方法处理 Command 消息所返回的事件，该方法的职责如下：

- 对相关数据进行封装

- 更新聚合根内存状态

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount")
@Getter
@Setter
@Slf4j
public class BankAccountAggregate implements Serializable {

   private static final String MONITORY_TIME_OUT_ACCOUNT = "monitor_retry";

   private static final long serialVersionUID = 6073238164083701075L;

   /** 账户代码 */
   private String account;

   /** 账户余额 */
   private double balanceAmt;

   /** 失败转出次数 */
   private int failTransferOut;

   /** 成功转出次数 */
   private int successTransferOut;
   
   /** 成功转入次数 */
   private int successTransferIn;

   /**
    * 处理账户划拨命令
    * @param cmd
    * @return
    */
   @CommandHandler(aggregateRootId = "accountCode")
   public ActReturn act(AccountAllocateCmd cmd) {
      if (balanceAmt + cmd.getAmt() < 0) {
         String retMessage = String.format("账户划拨失败,账户余额不足: 账户余额:%f, 划拨金额：%f", balanceAmt, cmd.getAmt());
         return ActReturn.builder().retCode(RetCode.FAIL).retMessage(retMessage)
               .event(new AccountAllocateFailEvent(cmd.getAccountCode(), cmd.getAmt(), retMessage)).build();
      }
      else {
         String retMessage = String.format("账户划拨成功：划拨金额：%.2f，账户余额：%.2f", cmd.getAmt(), balanceAmt + cmd.getAmt());
         return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage(retMessage)
               .event(new AccountAllocateOkEvent(cmd.getAccountCode(), cmd.getAmt())).build();
      }
   }

   /**
    * 处理账户划拨成功事件
    * @param event
    */
   public void on(AccountAllocateOkEvent event) {
      balanceAmt += event.getAmt();
   }

   /**
    * 处理账户划拨失败事件
    * @param event
    */
   public void on(AccountAllocateFailEvent event) {
      failTransferOut++;
   }

}
```

### 集合根释放

Phoenix针对聚合根提供了一种淘汰机制，对于长时间不活跃的聚合根（聚合根长时间不处理消息），在指定时间之后进行淘汰。

不活跃时间可进行配置，配置如下：

```yaml
// 聚合根淘汰策略-不活跃时间(毫秒)   默认值：86400000 (1天)
quantex.phoenix.server.performance.actor-survive-time  
```

### 消息幂等

#### 幂等概念

**幂等：**同一操作请求，任意多次执行所产生的影响均与一次执行的影响相同

#### 幂等场景

1. 在phoenix中，采用MQ通讯，我们假设MQ消息通讯不可靠（丢失、乱序、重发）,上游系统也可能会有重试策略，因此phoenix服务可能会收到重复消息。
2. 由于双活场景的存在， 如何保证两个节点收到同一个Cmd的时候， 产生的Event的消息ID是唯一的？

针对场景一，Phoenix的解决方案如下：每个 Command 消息有唯一一个CmdId， Command消息经过聚合根处理会得到一个Event， 因此可以在聚合根中维护一个 CmdId → Event 的集合来实现幂等 （支持可配单个聚合根在内存中Cmdld-EventMsg的缓存数量（加速，空间换时间））

针对场景二，Phoenix的解决方案如下：在产生事务的第一Cmd的时候， 会产生一个事务ID，这个Cmd的消息ID为： 事务ID+0。 那么Cmd产生的Event的消息ID为：事务ID+1，依次类推。这样可以确保多个节点产生的消息ID是一样的。

### 快照配置

详细配置请参考：[配置详情](/)

### Spring 配置

详细配置请参考：[配置详情](/)

### 待确认

- 依赖版本待确定

- 命令处理、查询处理、事件处理... 这些名词要和Phoenix Core中在介绍这部分功能时所用名词要统一

- on方法书写规则？

- 聚合根淘汰，是直接将不活跃的聚合根从内存中清理掉吗？

  







