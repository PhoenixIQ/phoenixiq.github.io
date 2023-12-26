---
id: phoenix-core-entity-aggregate
title: 实体聚合根
description: 构建服务端的最小执行单元
---

在使用 Phoenix 框架开发项目时，通常需要借助领域驱动设计(DDD)，提取领域实体，其中一个特殊的实体为聚合根(
领域外对领域内其他实体的访问都需要通过该聚合根)，而Phoenix中的实体聚合根概念就对应DDD中的聚合根。

实体聚合根利用 `EventSourcing` 思想把状态直接存在对象当中，参考[Event Souring](./phoenix-core-event-souring)
。在Phoenix当中，单个实体聚合根(同一个聚合根ID)处理请求是单线程的，所以不用担心线程安全问题。当然，如果你希望你的应用是可以横向扩容的，就需要设计好聚合根。

## Maven 依赖 \{#dependency\}

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-server-starter</artifactId>
    <version>2.6.1</version>
</dependency>
```

## 定义实体聚合根 \{#entity-aggregate\}

:::tip[提示]

聚合根类成员变量支持 `WildcardType`,`TypeVariable`,`GenericArrayType`, 在聚合根类合法性校验中,
会跳过这些类型的校验。但开发者必须实现这些类型的序列化接口.

如对于 `WildcardType` 设置类型的上限的约束: `Map<String, ? extends String>`

:::

实体聚合根使用注解`@EntityAggregateAnnotation`来定义，服务启动后 Phoenix 会扫描和校验符合规范的实体聚合根对象，并在接收命令时创建实体聚合根类对象。实体聚合根类需要遵循如下规范:

1. 聚合根类需要使用 `@EntityAggregateAnnotation` 注解进行标记。
2. 聚合根类以及聚合根类中的成员均需实现 `Serializable` 接口，并定义 `serialVersionUID`。
3. 聚合根类需要提供无参构造函数。

:::info[注意]

在聚合根上添加 `@EntityAggregateAnnotation` 注解时，需要通过 `aggregateRootType` 指定一个聚合根的类别。用来区分不同的聚合根类，该聚合根类别是全局唯一的。

:::

#### 示例代码 \{#aggregate-example\}

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount", idempotentSize = 100, bloomSize = 1000000, snapshotInterval = 100000)
public class BankAccountAggregate implements Serializable {
    private static final long serialVersionUID = 6073238164083701075L;
    // ... act and on method
}
```

#### 注解配置 \{#aggregate-config\}

| 配置项                     | 描述                                            | 类型      | 默认值                      |
|:------------------------|:----------------------------------------------|:--------|:-------------------------|
| aggregateRootType       | 聚合根类型                                         | String  | 必填项                      |
| surviveTime             | 聚合根生存时间，超过该时间聚合根将被从JVM中淘汰，下一次使用时再重建，减少内存使用    | long    | Long.MAX_VALUE           |
| snapshotMode            | 快照模式，可用于关闭快照或使用 Lazy 的快照模式                    | enum    | EAGER, 可选: DISABLE, LAZY |
| snapshotInterval        | 快照间隔，每隔snapshotInterval条消息打印一次快照，加速聚合根重建      | long    | 1000                     |
| numberOfRetainSnapshots | 需要保留的快照数量, Long.MAX_VALUE 为关闭                 | long    | Long.MAX_VALUE           |
| idempotentSize          | 聚合根幂等集合大小，取值应大于零，否则可能会导致启动失败                  | long    | 1000                     |
| bloomSize               | 布隆过滤器大小，内存中识别幂等，减少读库判断                        | long    | 100000L                  |
| dispatcher              | 选择聚合根的调度者，缓解阻塞问题，支持自定义线程池                     | String  | "phoenix-dispatcher"     |
| runningMode             | 聚合根的运行模式, 支持同步和异步两种                           | enum    | SYNC                     |
| allowPassivation        | 允许聚合根钝化（仅从内存上清除聚合根，仍会在 EventStore 中保留聚合根历史状态） | boolean | true                     |
| batchWeight             | 聚合根最大攒批大小 (尽力而为的攒批模式, 当下游可用时总是会优先交付)          | int     | 200                      |
| bufferSize              | 异步模式下，持久化时允许缓存的消息批次（package)数量                | Int     | 100                      |

## 命令处理 \{#command-handler\}

在 EventSouring 中，聚合根的生命周期是：`接收命令 -> 处理 -> 产生事件 -> 更改状态`，因此本小节的内容是说明 Phoenix 如何定义一个聚合根命令处理的声明：

实体聚合根中定义处理命令的方法是：提供返回值是 ActReturn 的 **act()** 方法，签名是：`public ActReturn act(Command cmd)`，并使用注解 `@CommandHandler` 声明其配置。

命令处理会产生该领域接收命令后产生的事件，然后通过事件来修改聚合根状态，也可以直接修改(使用`CommandSouring`模式, 避免在 EventSouring 模式下在 act 方法中修改状态，这样会污染内存状态)。

对于Command命令和Event事件，Phoenix支持三种协议，详情请参见`序列化`。

- protobuf
- protostuff
- Java serializable：默认，但并不推荐，Java 序列化的性能和安全性都偏差

#### 示例代码 \{#command-handler-example\}

```java
@CommandHandler(aggregateRootId = "accountCode", isCommandSourcing = true)
public ActReturn act(AccountCreateCmd createCmd) {
    this.account = createCmd.getAccountCode();
    this.balanceAmt = createCmd.getBalanceAmt();
    String message = String.format("初始化账户代码<%s>, 初始化余额<%s>. ", createCmd.getAccountCode(),createCmd.getBalanceAmt());
    return ActReturn.builder()
        .retCode(RetCode.SUCCESS)
        .retMessage(message)
        .event(new AccountCreateEvent(createCmd.getAccountCode(),createCmd.getBalanceAmt()))
        .build();
}
```

:::info[注意]

聚合根 ID `aggregateRootId` 是该聚合根的唯一标识, 其大小限制随着 Event-Store 中的 aggregateRootIdSize 配置改变, 但不能超过 256 的字节长度, 因为过长的聚合根 ID 会导致索引性能下降. 
如果您的聚合根 ID 长度需要转义成更长的字符串，请自行转换成更精简的表达.

:::

#### 注解配置 \{#handler-config\}

| 配置项                   | 描述                                                                         | 类型       | 默认值              |
|:----------------------|:---------------------------------------------------------------------------|:---------|:-----------------|
| aggregateRootId       | 聚合根id,允许多字段组成并且成员嵌套字段访问`aggregateRootId = {event.accountCode, event.name}` | String[] | 必填项              |
| enableCreateAggregate | 是否允许自动创建聚合根                                                                | boolean  | true             |
| idempotentIds         | 幂等id(参考`幂等操作`段落详解)                                                         | String[] | 采用phoenix默认的幂等id |
| isCommandSourcing     | 是否是command sourcing，默认是event sourcing                                      | boolean  | false            |

> 聚合根 ID 支持同时使用组合和嵌套的使用方式

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
    /* 
    business logic
    */
}
```

#### ActReturn \{#return\}

:::warning[注意]

Reply 可用于返回 RPC 结果，快速发送到指定 Topic（参考 Phoenix Client API）来缩短 EventPublish 路径，当需要特别注意的是，Reply 的交付语义是至多一次的。
也就是说 Reply 仅会事件处理结果后发送一次（一次性）。在幂等时、主键冲突等情况下，Reply 不会再次交付，而是返回 Event。

:::

ActReturn 定义了命令处理的结果，包含处理状态、事件等，其 Java 定义如下：

```java
public class ActReturn {
    // 处理状态码，必填参数
    private final RetCode retCode;
    // 返回消息，必填参数
    private final String retMessage = "";
    // 持久化事件，必填参数
    private final Object event;
    // 回复事件，可选参数，至多一次交付语义
    private final Object reply;
    // 元数据注册
    private final List<RegistryCollectData> registryCollectDataList;
}
```

## 事件处理 \{#event-handler\}

在 EventSouring 中，聚合根的生命周期是：`接收命令 -> 处理 -> 产生事件 -> 更改状态`，因此本小节的内容是说明 Phoenix 如何定义一个聚合根事件处理的声明：

实体聚合根中定义处理命令的方法是：提供没有返回值的 **on()** 方法，签名是：`public void on(Event cmd)`。

实体聚合根接收会接收 `act()` 方法产生的事件，并调用自身的命令处理逻辑来修改状态。事件仅会在持久化成功之后才会发送到聚合根，因此用户可以认为在 `on()`方法中
修改的状态总是可靠的，而 `act()` 方法修改的状态总是不可靠的。用户在这个语义下可以在 `act()` 中执行外部交互方法（如 IO），并将结果存入事件，这样每当聚合根溯源时，
不会重复于外部交互。

事件会进行持久化处理(EventStore)，当需要重建聚合根内存状态时，通过 EventSourcing 进行状态重塑。

在重塑时可以通过快照进行加速。快照相关配置请参考:[配置详情](./phoenix-core-config)

**on()** 方法需要遵循如下规范:

- on() 方法中不能有IO操作，例如:调用DB操作，调用外部接口
- on() 方法中不能有随机函数，例如:获取系统当前时间，获取随机数

#### 示例代码 \{#event-handler-example\}

```java
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

## 查询操作 \{#query-handler\}

Phoenix提供了查询聚合根状态的能力。通过在**act()**方法上添加 `@QueryHandler` 注解用来标志该**act()**方法将会执行一个查询操作。

在该**act()**方法中将需要查询的数据封装进Event事件中，通过ActReturn进行返回。

因查询操作不涉及内存状态的修改，只是对数据进行查询，所以查询操作所产生的的Event事件不会进行持久化操作。

#### 示例代码 \{#query-handler-example\}

```java
 @QueryHandler(aggregateRootId = "accountCode")
 public ActReturn act(AccountQueryCmd cmd) {
     // business logic
     return ActReturn.builder()
        .retCode(RetCode.SUCCESS)
        .retMessage("查询成功")
        .event(new AccountQueryEvent(account, balanceAmt, successTransferOut, failTransferOut, successTransferIn))
        .build();
 }
```

:::tip[小提示]

实体聚合根处理扫描支持对象关系. 如支持在父类中定义 `act`, `on` 方法来帮助整理一个聚合根类的代码，但暂不支持用泛型的方式复用这些方法.

:::

## 幂等操作 \{#idempotent\}

> 设计参见[Phoenix是如何实现幂等的](/blog/idempotent)

Phoenix是消息驱动的框架，消息在传输过程中会存在消息重发的情况，同时上游系统也可能有重试策略(两笔消息，但是业务含义一样)

Phoenix会默认对同一笔消息进行幂等处理，同时也支持用户自定义幂等主键来实现业务幂等，可以利用`CommandHandler`注解中的`idempotentIds`声明幂等主键。

幂等ID定义数组的首个元素作为幂等类型固定前缀，从第二个字段开始作为幂等ID

```java 
@CommandHandler(aggregateRootId = "accountCode", idempotentIds = {"account","num"})
public ActReturn act(AccountCreateCmd createCmd){
    return return ActReturn.builder().build();    
}
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

| 布隆过滤器Size | 占用内存       |
|-----------|------------|
| 10000     | 17.982KB   |
| 100000    | 179.982KB  |
| 1000000   | 1797.982KB |

:::tip[提示]

布隆过滤器只是为了减少判断幂等时的查库频率，一般推荐设置10000即可，实际测试size=10000即可比较准确的判断最近10W个左右的命令。

:::

## 聚合根淘汰及钝化 \{#passivation\}

Phoenix 针对每个聚合根类型提供了一种淘汰机制，对于长时间不活跃的聚合根(聚合根长时间不处理消息)，在指定时间之后进行淘汰，被淘汰的聚合根会在内存中释放。

可以在每个聚合根的 `@EntityAggregateAnnotation`中增加`surviveTime`不活跃时间可进行配置，配置如下:

```java
  // surviveTime 聚合根淘汰策略-不活跃时间(毫秒)   默认值:Long.MAX_VALUE
  @EntityAggregateAnnotation(aggregateRootType = "BankAccount", surviveTime = 1000 * 60)
  public class BankAccountAggregate implements Serializable {
  }
```

除此之外，对于被淘汰（释放）但仍需要持久化以便将来使用的聚合根，Phoenix 提供了一种钝化机制：聚合根淘汰时仅会在内存中释放掉聚合根，当未来从订阅接收到属于该聚合根的命令时，
Phoenix 会再次将该聚合根唤醒并且回溯到淘汰前状态（通过 EventSourcing 机制）

默认情况下，聚合根总是会开启钝化，也就是每个聚合根都是永久存在于 EventStore 中，通过淘汰机制能够让不活跃的聚合根释放内存资源。

:::tip[提示]
聚合根可以通过关闭注解上的钝化配置（`allowPassivation`），让聚合根在淘汰之后同时释放到内存 & EventStore 的资源
:::

### 运行模式 \{#run-mode\}

:::tip[自定义运行模式配置]
聚合根运行模式可以通过在聚合根注解`@EntityAggregateAnnotation`的属性 `runningMode` 中指定. 在 Spring
环境下也可以使用环境变量`quantex.phoenix.server.entityAggregate.{aggregateRootType}.runningMode=ASYNC`来指定.
:::

在 2.6.0 之后，Phoenix 为聚合根引入了新的运行模式`异步`, 在异步模式下，线程的利用率将进一步提高：

> 受益于 Actor 模型的隔离性，使得框架可以冻结（freezing）某些聚合根的运行状态，尤其是当聚合根发生持久化这类 IO 行为时。

隔离了阻塞的聚合根后，Phoenix 聚合根执行在持久化（IO）层面能够实现类似于纤程的效果。

### 自定义线程池 \{#dispatcher\}

:::tip[自定义线程池配置]
自定义线程池可以通过在聚合根注解`@EntityAggregateAnnotation`的属性 `dispatcher` 中指定. 在 Spring
环境下也可以使用环境变量`quantex.phoenix.server.entityAggregate.{aggregateRootType}.dispatcher=aggregate-dispatcher`
来指定.
:::

当业务足够复杂时，聚合根类型绝不仅仅只有一种，其性能特点也大不相同（如：存在延迟要求高的聚合根，也存在吞吐量要求高的聚合根）

不同性能特点的聚合根运行在同一线程池时，会造成其他类型聚合根受其影响，因此用户可通过自定义线程池的方式隔离不同性能特点的聚合根。

如 Phoenix 为默认的用户聚合根提供了 `aggregate-dispatcher` 这一线程池（最大线程数=核心数 *
3），而分布式数据聚合根所使用的线程池，则是 `ddata-dispatcher`。

这是因为用户聚合根内可能会 RPC 请求分布式数据聚合根，当用户聚合根耗尽线程池时，分布式数据聚合根无法获取线程资源，也就无法消除用户聚合根的阻塞，最终形成死锁。

Phoenix 内部提供了如下线程池：

```php
# 独占线程（使用该线程池的聚合根会独占一条线程）
receiver-dispatcher {
  executor = "thread-pool-executor"
  type = PinnedDispatcher
  thread-pool-executor {
    # 没有超时控制
    allow-core-timeout = off
  }
}

# DData 聚合根线程池.
ddata-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  thread-pool-executor {
    / ... /
    core-pool-size-factor = 2.0
    max-pool-size-factor  = 2.0
  }
  # 吞吐率，聚合根一次处理的消息数量
  throughput = 20
}

# 默认聚合根线程池.
aggregate-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  thread-pool-executor {
    / ... /
    core-pool-size-factor = 3.0
    max-pool-size-factor  = 3.0
  }
  # 吞吐率，聚合根一次处理的消息数量
  throughput = 1
  # 聚合根一次能处理的时间最大不超过 60s
  throughput-deadline-time = 60000ms
}

# IO 阻塞型线程池
phoenix-blocking-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  thread-pool-executor {
    fixed-pool-size = 16
  }
  throughput = 1
}
```

## 自选快照存储数据 \{#snapshot\}

Phoenix提供给用户`SelectiveSnapshot`接口，实现该接口可以自定义快照中存储的数据。

快照中存储的数据应该是聚合根中重要的信息，而不是存储整个聚合根对象，这样做可以避免一些问题（如：聚合根中存在无法序列化的数据或虚拟数据）。

#### 示例代码 \{#snapshot-config\}

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

## 自选聚合根展示数据 \{#console-html\}
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

## 序列化 \{#serializer\}

:::tip[建议]

Phoenix 目前默认消息（命令、事件）持久化策略是 Java 序列化，对于有性能、安全要求的用户，则建议修改成 JSON、PROTOBUF 等方法。

:::

Phoenix传输的Message目前支持Java原生，Protocol Buffer，protostuff, JSON 协议。用户可以根据自己的需要配置使用协议，并且 Phoenix 支持两种配置模式：

### 1. 全局配置

```yaml
quantex:
  phoenix:
    server:
      default-serializer: proto_stuff
```

### 2. 单独配置

通过注解 `@CustomSerializer` 可以为单个类单独配置序列化.

```java
// 替换命令为 JSON 序列化 
@CustomSerializer(serializerType = Serializers.Type.JSON)
public class AccountCreateCmd implements Serializable {
    
    /** 划拨账户 */
    private String accountCode;

    /** 账户余额 */
    private double balanceAmt;
}
```

### 3. 性能对比

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

## 异常状态码 \{#error-code\}

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

| 异常状态码 | 状态码说明         | 异常说明                                |
|-------|---------------|-------------------------------------|
| 1000  | 无             | 无                                   |
| 1001  | 业务代码异常        | 用户代码向框架抛出一个异常，框架会捕获并且封装为此状态码        |
| 1002  | 聚合根校验失败       | 框架启动时，会校验聚合根配置的合法性，如果不合法，则会抛出此异常    |
| 1003  | 聚合根类型不存在      | 在框架运行时，如果处理事件的聚合根不存在，则会抛出此异常        |
| 1004  | 业务代码响应的事件集为空  | 当业务代码处理完后，响应给框架的事件集如果为空，则会抛出此异常     |
| 1005  | 业务代码异常        | 用户代码向框架抛出一个异常，框架会捕获并且封装为此状态码        |
| 1006  | 获取幂等id失败      | 根据配置的参数，如果框架获取命令的幂等id失败，则会抛出此异常     |
| 1007  | 未定义处理该命令的业务代码 | 框架收到一个无法处理的命令，则会抛出此异常               |
| 1008  | 创建聚合根失败       | 在运行时，创建聚合根失败，则会抛出此异常                |
| 1009  | 未找到聚合根        | 在运行时，处理命令的聚合根不存在，并且配置不可自动创建，则会抛出此异常 |
| 1010  | 获取聚合根id失败     | 根据配置的参数，如果框架获取命令的聚合根id失败，则会抛出此异常    |
| 1011  | 重复定义了聚合根类型    | 在框架中定义了重复的聚合根类型，则会抛出此异常             |
| 1012  | 定义了相同的业务代码    | 在框架中定义了处理相同的命令的业务代码，则会抛出此异常         |
| 1013  | 反序列化失败        | 框架在收到MQ的消息后，反序列化失败，则会抛出此异常          |
| 1014  | 框架的配置参数有误     | 框架的配置参数校验不通过，则会抛出此异常                |
| 1015  | 框架执行数据库操作异常   | 框架执行事件持久化操作失败，则会抛出此异常               |

## Spring 支持 \{#spring\}

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

## 保护随机/IO行为 \{#entity-context\}

聚合根目前和 EventSourcing 存在强绑定关系, 前者利用后者的能力来实现状态的持久化，而 EventSourcing 有个缺陷是当聚合根处理代码中带有随机行为时，用户有两种方案避免事件溯源时，状态与上次运行不一致的问题：

1. 使用 EventSourcing + 用事件传递 IO 的结果.(也就是将 IO 的结果放在 Event 中，溯源通过 EventSourcing)
2. CommandSouring 下，用 `EntityAggregateContext.invoke()` 封装 IO 行为

如: 下面的代码使用了第二种方式，其中事件并不会用于改变自身状态（而是 Command），在这个代码中用到了随机行为（获取当前系统事件作为状态），示例代码如下：

```java
@CommandHandler(aggregateRootId = "accountCode", isCommandSourcing = true)
public ActReturn act(AccountCreateCmd createCmd) {
  this.account = createCmd.getAccountCode();
  this.balanceAmt = createCmd.getBalanceAmt();
  this.createTime = 
          EntityAggregateContext.invoke("getSystemTime", System::currentTimeMillis);

  return ActReturn.builder()
          .retCode(RetCode.SUCCESS)
          .retMessage(message)
          .event(
                  new AccountCreateEvent(
                          createCmd.getAccountCode(), createCmd.getBalanceAmt()))
          .build();
}
```

当然，上面的代码也可以用另一个方案解决：

```java
@CommandHandler(aggregateRootId = "accountCode")
public ActReturn act(AccountCreateCmd createCmd) {
  long createTime = System.currentTimeMillis();
          EntityAggregateContext.invoke("getSystemTime", System::currentTimeMillis);
  
  return ActReturn.builder()
          .retCode(RetCode.SUCCESS)
          .retMessage(message)
          .event(
                  new AccountCreateEvent(
                          createCmd.getAccountCode(), createCmd.getBalanceAmt(), createTime))
          .build();
}

public void on(AccountCreateEvent event){
     this.account = event.getAccountCode();
     this.balanceAmt = event.getBalanceAmt();
     this.createTime = event.getCrateTime();

}
```

## 处理优先级 \{#priority\}

Phoenix 支持自定义消息处理的优先级，高优先级的消息将会在 Mailbox 中被积极获取然后处理，低优先级的消息将会延迟处理。

开启此功能需要通过如下参数配置：

```yaml
quantex:
  phoenix:
    akka:
      enable-priority: true # 开启优先级处理
```

也可以在 akka 配置中，为部分 Dispatcher（线程池、调度器）指定优先级 Mailbox

```conf
aggregate-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  # 自定义聚合根 Mailbox 为优先级 Mailbox
  mailbox-type = com.iquantex.phoenix.server.akka.mailbox.PhoenixPriorityMailbox
  thread-pool-executor {
    # ....  
  }
}
```

但因为 PhoenixPriorityMailbox 仅作用于 Phoenix 内部 protobuffer 消息，以及 Phoenix 在聚合根 Actor 层次上设计了父子两个层级，因此实际上，Spring 配置修改的是如下配置：

```conf
parent-dispatcher {
  type = Dispatcher
  executor = "thread-pool-executor"
  # 自定义聚合根 Mailbox 为优先级 Mailbox
  mailbox-type = com.iquantex.phoenix.server.akka.mailbox.PhoenixPriorityMailbox
}
```

最后，支持优先级 Mailbox 的消息需要显式指定消息的优先级，参考 [Client 文档](/docs/phoenix-core/phoenix-core-client#priority)