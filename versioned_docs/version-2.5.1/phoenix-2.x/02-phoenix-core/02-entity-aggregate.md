---
id: phoenix-core-entity-aggregate
title: 实体聚合根
---

在使用 Phoenix 框架开发项目时，通常需要借助领域驱动设计(DDD)，提取领域实体，其中一个特殊的实体为聚合根(领域外对领域内其他实体的访问都需要通过该聚合根)，而Phoenix中的实体聚合根概念就对应DDD中的聚合根。

实体聚合根利用 `EventSouring` 思想把状态直接存在对象当中，参考[Event Souring](./phoenix-core-event-souring)。在Phoenix当中，单个实体聚合根(同一个聚合根ID)处理请求是单线程的，所以不用担心线程安全问题。当然，如果你希望你的应用是可以横向扩容的，就需要设计好聚合根。

## maven依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-server-starter</artifactId>
   <version>2.5.1</version>
</dependency>
```

## 实体聚合根

实体聚合根需要使用`@EntityAggregateAnnotation`来标记类，服务启动后phoenix会校验定义规范和创建实体聚合根类对象。实体聚合根类需要遵循如下规范:

1. 聚合根类需要使用 `@EntityAggregateAnnotation` 注解进行标记。
2. 聚合根类以及聚合根类中的实体均需实现 `Serializable` 接口，并定义serialVersionUID。
3. 聚合根类需要提供无参构造函数。

:::info[注意]

在聚合根上添加 `@EntityAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类，该聚合根类别是全局唯一的。且聚合根ID的长度要小于64个字符。

:::

 
#### 示例代码

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount", idempotentSize = 100, bloomSize = 1000000, snapshotInterval = 100000)
public class BankAccountAggregate implements Serializable {
    private static final long     serialVersionUID          = 6073238164083701075L; 
    // ... act and on method
}
```

#### 参数配置

| 配置项            | 描述                                                   | 类型      | 默认值 |
| :----------------| :----------------------------------------------------  | :------   | :----- |
|aggregateRootType | 聚合根类型                                              | String    | 必填项 |
|surviveTime       | 聚合根生存时间，超过该时间聚合根将被从JVM中淘汰，下一次使用时再重建，减少内存使用                     | long      | Long.MAX_VALUE |
|snapshotInterval  | 快照间隔，每隔snapshotInterval条消息打印一次快照，加速聚合根重建，0为关闭    | long       | 1000 |
|idempotentSize    |  聚合根幂等集合大小，取值应大于零，否则可能会导致启动失败       | long      | 1000 |
|bloomSize         |  布隆过滤器大小，内存中识别幂等，减少读库判断                  | long      | 100000L |
|dispatcher         |  选择聚合根的调度者，缓解阻塞问题，支持自定义线程池                | String      | "phoenix-dispatcher" |

## 命令处理

实体聚合根中需要提供 **act()** 方法，用来处理Command消息。一般会产生该领域将会发生的Event事件，通过Event事件修改聚合根状态，也可以直接修改(使用CommandSouring模式)。

对于Command命令和Event事件，Phoenix支持三种协议，详情请参见`序列化`。
- protobuf
- protostuff 
- java serializable

实体聚合根中的 **act()** 方法上需要添加 `@CommandHandler` 注解进行标识。


#### 示例代码

```java
    @CommandHandler(aggregateRootId = "accountCode", isCommandSourcing = true)
    public ActReturn act(AccountCreateCmd createCmd) {
        this.account = createCmd.getAccountCode();
        this.balanceAmt = createCmd.getBalanceAmt();
        String message = String.format("初始化账户代码<%s>, 初始化余额<%s>. ", createCmd.getAccountCode(),createCmd.getBalanceAmt());
        return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage(message)
        .event(new AccountCreateEvent(createCmd.getAccountCode(), createCmd.getBalanceAmt())).build();
    }
```

#### 参数配置

| 配置项                | 描述                    | 类型      | 默认值 |
| :---------------------| :----------------------| :------   | :----- |
|AggregateRootId        | 聚合根id,允许多字段组成并且成员嵌套字段访问`aggregateRootId = {event.accountCode, event.name}`               | String[] | 必填项 |
|enableCreateAggregate  | 是否允许自动创建聚合根    | boolean   | true |
|idempotentIds          | 幂等id(参考`幂等操作`段落详解)                  | String[] | 采用phoenix默认的幂等id |
|isCommandSourcing | 是否是command sourcing，默认是event sourcing | boolean | false |

> 关于支持多聚合根Id并且嵌套的使用方式
 
```java
class CommandA {
    String name;
    CommandB commandb;
}

class CommandB {
    String age;
}
@CommandHandler(aggregateRootId = {name, commandb.age})
public ActReturn act(A cmd) {
}
```


#### ActReturn

**act()** 方法在处理 Command 命令之后需要返回处理的结果以及一些必要的信息，Phoenix对**act**方法的返回值做了一层封装，统一放到了ActReturn中。 ActReturn中Event事件将会到达两个地方调用方和on方法处理逻辑当中。
```java
public class ActReturn {
    // 处理状态码
    private final RetCode             retCode;
    // 返回消息
    @Builder.Default
    private final String              retMessage = "";
    // 返回事件
    private final Object              event;
}
```

## 事件处理

在EventSouring模式下，实体聚合根中需要定义 **on()** 方法，处理 **act()** 方法中处理Command命令所产生的Event事件。同时Event事件会进行持久化处理(EventStore)，当需要重建聚合根内存状态时，通过EventSourcing进行状态重塑。在重塑时可以通过快照进行加速。快照相关配置请参考:[配置详情](./phoenix-core-config)

**on()** 方法需要遵循如下规范:

- on() 方法中不能有IO操作，例如:调用DB操作，调用外部接口
- on() 方法中不能有随机函数，例如:获取系统当前时间，获取随机数

#### 示例代码
```java
    /**
     * 处理账户划拨成功事件
     * @param event
     */
    public void on(Account.AccountAllocateOkEvent event) {
        account = event.getAccountCode();
        balanceAmt += event.getAmt();
        if (event.getAmt() < 0) {
            successTransferOut++;
        } else {
            successTransferIn++;
        }
    }
```

## 查询操作

Phoenix提供了查询聚合根状态的能力。通过在**act()**方法上添加 `@QueryHandler` 注解用来标志该**act()**方法将会执行一个查询操作。在该**act()**方法中将需要查询的数据封装进Event事件中，通过ActReturn进行返回。

因查询操作不涉及内存状态的修改，只是对数据进行查询，所以查询操作所产生的的Event事件不会进行持久化操作。

#### 示例代码
```java
	@QueryHandler(aggregateRootId = "accountCode")
	public ActReturn act(AccountQueryCmd cmd) {

		return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage("查询成功").event(
				new AccountQueryEvent(account, balanceAmt, successTransferOut, failTransferOut, successTransferIn))
				.build();
	}
```

## 幂等操作

> 设计参见[Phoenix是如何实现幂等的](/blog/idempotent)

Phoenix是消息驱动的框架，消息在传输过程中会存在消息重发的情况，同时上游系统也可能有重试策略(两笔消息，但是业务含义一样)

Phoenix会默认对同一笔消息进行幂等处理，同时也支持用户自定义幂等主键来实现业务幂等，可以利用`CommandHandler`注解中的`idempotentIds`声明幂等主键。

幂等ID定义数组的首个元素作为幂等类型固定前缀，从第二个字段开始作为幂等ID

```java 
@CommandHandler(aggregateRootId = "accountCode"， idempotentIds = {"account"， "num"} )
public ActReturn act(AccountCreateCmd createCmd) {}
```

Phoenix在处理幂等时，通过内存有限的幂等集合和EventStore中事件的唯一索引来保证。通常情况下，有限幂等集合可以保证最新处理消息的唯一性，如果是历史消息的重试会命中EventStore的唯一索引来保证。可以在`EntityAggregateAnnotation`注解上`idempotentSize`参数来调整幂等集合的大小。

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount", idempotentSize = 1000)
public class BankAccountAggregate implements Serializable {}
```

幂等集合是有限的，当消息在幂等集合判断重复为false时，Phoenix会在从数据库中查询是否处理过了这个消息。框架为了加速幂等的判断，Phoenix引入了自行淘汰的布隆过滤器，用户可以调整布隆过滤器的大小，来尽量是判重在内存中完成，而不去访问数据库。用户可以通过下面配置来调整布隆过滤器大小。

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount", bloomSize = 100000L)
public class BankAccountAggregate implements Serializable {}
```

注意：布隆过滤器不宜太大，太大会使应用占用内存。每个聚合根对象都有一个布隆过滤器，布隆过滤器数量大小和实际占用内存可以参考下面数据。

|布隆过滤器Size|占用内存|
|----|---|
|10000|17.982KB|
|100000|179.982KB|
|1000000|1797.982KB|

:::tip[提示]

布隆过滤器只是为了减少判断幂等时的查库频率，一般推荐设置10000即可，实际测试size=10000即可比较准确的判断最近10W个左右的命令。

:::


## 聚合根定时任务

Phoenix 的聚合根拥有通过 API 定时给自身发送的特性。并遵循着以下原则：

1. 定时任务的生命周期跟随与聚合根, 当 JVM 重启后, 定时任务失效;当聚合根溯源时, 定时任务重新被发布到 Phoenix 实例的 Scheduler
2. 定时任务跟随聚合根的创建, 在聚合根所在的 Phoenix 实例中创建.
3. 定时任务不具备持久化特性, 但可以借助于聚合根事件的持久化特性, 在聚合根溯源时唤醒定时任务
4. 定时任务的 API 的作用域仅作用于聚合根本身, A 聚合根不能取消 B 聚合根的定时任务.
5. 聚合根定时任务的调度是基于高吞吐率而设计的, 基于 `TimerWheel` 实现, 因此定时任务的触发时间不是精确的, 存在一定的误差.

定时任务通过`EntityAggregateContext.getTimer()`获取, 并有以下 API: 

- **startTimerAtFixedRate**: 以固定的速率/时间窗口发送命令, 当发送耗时 > 时间窗口, 则下一次时间窗口执行两次定时任务, 依次递推. 当发生 GC 时，可能出现同一时间执行多个定时任务.
- **startTimerWithFixedDelay**: 当前定时任务执行完成后, 延时一段时间执行下一次定时任务。不是定时触发，当 GC 时没有尖峰风险.
- **startSingleTimer**: 执行一次定时任务
- **isTimerActive**: 判断定时任务是否正在运行
- **cancel**: 根据 Key 取消指定定时任务
- **cancelAll**: 取消当前聚合根下的定时任务

#### 示例代码

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


## 聚合根释放

Phoenix针对每个聚合根类型提供了一种淘汰机制，对于长时间不活跃的聚合根(聚合根长时间不处理消息)，在指定时间之后进行淘汰。

可以在每个聚合根的 `@EntityAggregateAnnotation`中增加`surviveTime`不活跃时间可进行配置，配置如下:

```java
  // surviveTime 聚合根淘汰策略-不活跃时间(毫秒)   默认值:Long.MAX_VALUE
  @EntityAggregateAnnotation(aggregateRootType = "BankAccount", surviveTime = 1000 * 60)
  public class BankAccountAggregate implements Serializable {
  }
```


:::info[提示]

聚合根对象被释放不代表该聚合根就不可用,如果有命令触发该聚合根做操作,则会通过EventSouring的机制恢复。释放只是为了释放出JVM内存的占用。

:::


## Spring 支持

Phoenix可以和SpringCloud 环境相互打通，比如说聚合根在处理过程中，可以通过Feign调用SpringCloud里的服务。通过将聚合根实例纳入Spring管理，使得可以在聚合根中AutoWired其他Bean，或者在其他Bean中AutoWired聚合根实例。以便实现通过Feign接口调用SpringCloud服务。
使用方式如下:

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

## 注解配置

从phoenix-server 2.2.4开始，依赖了phoenix-stater的环境下，@EntityAggregateAnnotation支持从启动参数/环境变量/配置文件中读取参数。

配置优先级:启动参数 > 环境变量 > 配置文件 > 代码注解自定义 > 注解默认值

| 配置项                                                                           | 描述               | 类型     | 对应的注解函数           |
|:------------------------------------------------------------------------------|:-----------------|:-------|:------------------|
| ` {aggregateRootType} `                                                       | 聚合根类型，无法从配置文件中读取 | String | aggregateRootType |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.surviveTime    `  |                  | long   | surviveTime       |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.snapshotInterval` |                  | long   | snapshotInterval  |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.idempotentSize  ` |                  | long   | idempotentSize    |
| `quantex.phoenix.server.entityAggregate.{aggregateRootType}.bloomSize     `   |                  | long   | bloomSize         |

以yaml配置文件为例:

当使用了`@EntityAggregateAnnotation`，并且`aggregateRootType`为`BankAccount`。则:

```yaml
quantex:
  phoenix:
    server:
      entityAggregate:
        BankAccount:   # {aggregateRootType}
          surviveTime: 10
          snapshotInterval: 10
          idempotentSize: 10
          bloomSize: 10
```

## 自定义线程池
在`@EntityAggregateAnnotation`注解中，属性dispatcher用来指定线程池。<br/>
当聚合根中存在阻塞的线程时，可能会造成其他线程饥饿，用户通过使用其他线程池执行阻塞api来解决这个问题。<br/>
Phoenix内提供有默认的"phoenix-dispatcher"线程池和可选择使用的"phoenix-blocking-dispatcher"线程池，
另外用户可以通过自己的需求配置。
```lombok.config
phoenix-blocking-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  thread-pool-executor {
    fixed-pool-size = 16
  }
  throughput = 1
}
```

## 自选快照存储数据

Phoenix提供给用户`SelectiveSnapshot`接口，实现该接口可以自定义快照中存储的数据。

快照中存储的数据应该是聚合根中重要的信息，而不是存储整个聚合根对象，这样做可以避免一些问题（如：聚合根中存在无法序列化的数据或虚拟数据）。

#### 示例代码

使用该功能需要用户自定义一个类，这个类用于存储即将写入到快照中的数据，该类中只需要有属性和序列化接口，且每个属性必须与聚合根中存在的字段对应。

```java
@Data
@Builder
public class SnapshotData implements Serializable {
    private static final long serialVersionUID = -5908472083137878870L;
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
}
```

`SelectiveSnapshot`接口中必须要实现的两个方法配合使用，能达到自选数据写入快照中或从快照中读出自选数据的效果。

```java
@EntityAggregateAnnotation(
        aggregateRootType = "BankAccount",
        idempotentSize = 100,
        bloomSize = 1000000,
        snapshotInterval = 100000)
@Getter
@Setter
@Slf4j
public class BankAccountAggregate implements SelectiveSnapshot<SnapshotData> {

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

    @Override
    public void loadSnapshot(SnapshotData snapshotData) {
        this.setAccount(snapshotData.getAccount());
        this.setBalanceAmt(snapshotData.getBalanceAmt());
        this.setFailTransferOut(snapshotData.getFailTransferOut());
        this.setSuccessTransferIn(snapshotData.getSuccessTransferIn());
        this.setSuccessTransferOut(snapshotData.getSuccessTransferOut());
    }

    @Override
    public SnapshotData saveSnapshot() {
        return SnapshotData.builder()
                .account(getAccount())
                .balanceAmt(getBalanceAmt())
                .successTransferIn(getSuccessTransferIn())
                .failTransferOut(getFailTransferOut())
                .successTransferOut(getSuccessTransferOut())
                .build();
    }
}
```

## 自选聚合根展示数据
在 Phoenix-console 页面中，State Manager 模块提供聚合根信息的展示，为了避免聚合根内存在大数据量的属性而导致前端数据展示时延过长，Phoenix 提供自选需要展示的数据。

该功能的使用方式与[自选快照存储数据](#自选快照存储数据)类似，需要自定义一个与聚合根中存在的字段对应的数据类，并重写 SelectiveSnapshot 接口中的 getSnapshot() 方法。
```java
 @Override
public SnapshotData getSnapshot() {
    return SnapshotData.builder()
            .account(getAccount())
            .balanceAmt(getBalanceAmt())
            .successTransferIn(getSuccessTransferIn())
            .failTransferOut(getFailTransferOut())
            .successTransferOut(getSuccessTransferOut())
            .build();
}
```

## 序列化

Phoenix传输的Message目前支持Java原生，protobuf，protostuff, json协议。用户可以根据自己的需要配置使用协议，参考配置。

```yaml
quantex:
  phoenix:
    server:
      default-serializer: proto_stuff
```

下面有四种序列化测试结果对比，如果追求性能最高的话，推荐使用protobuf，如果追求开发运维便利，推荐使用json/protostuff协议。

```
简单对象测试:
--------------------------------------------------------------------------------------------
                  name    avgSer    minSer    maxSer  avgDeser  minDeser  maxDeser      size
     ProtoStuff-Simple     17046       700  91962900     21797       800 151908700       167
    ProtoBuffer-Simple      3275       500   5544700      7674       500  16391100       171
           Kryo-Simple     20857      1200 126308700     26969      1500 114516800       181
       FastJSON-Simple     16840      2600  82678900     54146      2300 169683700       254
       JackJSON-Simple     63640      2000 176485900     28913      2600 107764700       258
            Jdk-Simple     32379      3500  93950400    111837     12800 117740300       454
            XML-Simple   1491812    939400 136007600    468711    190500 323252400      1104
复杂对象测试: 
--------------------------------------------------------------------------------------------
                  name    avgSer    minSer    maxSer  avgDeser  minDeser  maxDeser      size
          Kryo-Complex     18133      4500  19233700     31186      4900  90632500      1283
    ProtoStuff-Complex    188440     55300  64674300    119845     42800  58609600     58485
   ProtoBuffer-Complex     54821     24500  10718900     97838     42600  11946800     58485
           Jdk-Complex     60064     23100  56048700    252456    108900  61574600      7146
      FastJSON-Complex    439399    235800 245405200    438605    168200 360547200     63531
      JackJSON-Complex    411030    161300 266387600    491689    168200 188725200     63531
           XML-Complex   8435807   6672800 107200800   2061636   1566100  78898400     76915

```

## 异常状态码

在框架启动或运行时，会抛出各种异常，框架收到此类异常，会将异常调用栈、异常信息和异常状态码封装为异常事件。

异常事件的结构如下：

```java

public class ExceptionEvent {
    /** 异常调用栈 */
    private String errorStack;
    /** 异常状态码 */    
    private int errorCode;
    /** 异常内容 */
    private String errorDesc;
}
```

用户可以通过定义特定的on方法，接收异常事件，并对异常事件做处理。这里以计数器聚合根为例做使用说明：

```java
@EntityAggregateAnnotation(
        aggregateRootType = "Counter",
        idempotentSize = 1000,
        snapshotInterval = 10)
public class CounterAggregate implements Serializable {
    // 别的on方法

    /** 接收异常事件，处理异常事件 */
    public void on(Phoenix.ExceptionEvent event) {
        log.error("exception event message");
    }
}
```

| 异常状态码 | 状态码说明 | 异常说明 |
| --- | --- | --- |
| 1000 | 无 | 无 |
| 1001 | 业务代码异常 | 用户代码向框架抛出一个异常，框架会捕获并且封装为此状态码 |
| 1002 | 聚合根校验失败 | 框架启动时，会校验聚合根配置的合法性，如果不合法，则会抛出此异常 |
| 1003 | 聚合根类型不存在 | 在框架运行时，如果处理事件的聚合根不存在，则会抛出此异常 |
| 1004 | 业务代码响应的事件集为空 | 当业务代码处理完后，响应给框架的事件集如果为空，则会抛出此异常 |
| 1005 | 业务代码异常 | 用户代码向框架抛出一个异常，框架会捕获并且封装为此状态码 |
| 1006 | 获取幂等id失败 | 根据配置的参数，如果框架获取命令的幂等id失败，则会抛出此异常 |
| 1007 | 未定义处理该命令的业务代码 | 框架收到一个无法处理的命令，则会抛出此异常 |
| 1008 | 创建聚合根失败 | 在运行时，创建聚合根失败，则会抛出此异常 |
| 1009 | 未找到聚合根 | 在运行时，处理命令的聚合根不存在，并且配置不可自动创建，则会抛出此异常 |
| 1010 | 获取聚合根id失败 | 根据配置的参数，如果框架获取命令的聚合根id失败，则会抛出此异常 |
| 1011 | 重复定义了聚合根类型 | 在框架中定义了重复的聚合根类型，则会抛出此异常 |
| 1012 | 定义了相同的业务代码 | 在框架中定义了处理相同的命令的业务代码，则会抛出此异常 |
| 1013 | 反序列化失败 | 框架在收到MQ的消息后，反序列化失败，则会抛出此异常 |
| 1014 | 框架的配置参数有误 | 框架的配置参数校验不通过，则会抛出此异常 |
| 1015 | 框架执行数据库操作异常 | 框架执行事件持久化操作失败，则会抛出此异常 |