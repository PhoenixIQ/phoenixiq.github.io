---
id: phoenix-core-client
title: 客户端
description: 用于和 PhoenixServer 交互的客户端
---

**PhoenixClient**主要用于向**PhoenixServer**发送**Command**和接收**PhoenixServer**返回的**Event**

## maven依赖 \{#dependency\}

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-client-starter</artifactId>
    <version>2.6.1</version>
</dependency>
```

## 接口说明 \{#api\}

`PhoenixClient`提供两种接口,需要回复以及不需要回复，在无需回复的 `sendNoReply` 中将会返回消息回显元数据信息.

```java
/**
  * 发送接口
  *
  * @param msg               rpc调用消息
  * @param targetTopic       消息目标服务的Topic
  * @param requestId         请求ID
  * @return                  RPC返回结果
  */
Future<RpcResult> send(Object msg, String targetTopic, String requestId);

/**
  * 发送接口，不需要恢复消息
  *
  * @param msg               rpc调用消息
  * @param targetTopic       消息目标服务的Topic
  * @param requestId         请求ID
  */
MessageMetaData sendNoReply(Object msg, String targetTopic, String requestId);
```

### 消息回显元数据 \{#return\}

在同步和异步模式下，PhoenixClient 都会返回本次消息发送的元数据信息（并非 Phoenix.Message 中的消息元数据，请注意区分），元数据数据结构如下：

```java
public final class MessageMetaData {
    /** 消息 ID，消息的唯一标识 */
    private final String msgID;
    /** 事务 ID（如果是事务命令，那么此 ID 会成为事务聚合根的唯一主键） */
    private final String transID;
    /** 用于链路追踪的请求 ID */
    private final String requestID;
    /** 发送时的时间戳. */
    private final long timestamp;
}
```


## 使用样例 \{#example\}

启动**Phoenix**项目后，**Phoenix**会自动创建**PhoenixClient Bean**,可以通过`@Autowired`进行依赖注入

:::caution[注意]
默认配置下，PhoenixClient 投递到多分区的 Partition 是不保证顺序的，请参考文档按需配置消息的发送顺序规则。
:::

### 同步调用 \{#sync\}

通过调用 **send()** 方法返回的 **Future** 对象的 **get()** 方法，同步接收请求结果。

```java
@Autowired
private PhoenixClient client;

public void send() {
    Future<RpcResult> future = client.send(new Command(), "target_topic", UUID.randomUUID());
    RpcResult rpcResult = future.get();
}
```

### 同步阻塞调用 \{#blocking\}

通过调用 **sendSync()** 方法，可以直接返回 `RpcResult` 结果，这里是阻塞的, 因此需要提供超时时间.

```java
@AutoWired
private PhoenixClient client;

public void sendSync_sample(){
    RpcResult<Object> result = client.sendSync(new Command(), "target_topic", UUID.randomUUID(), Duration.ofMillis(10_000));
}

```


### 异步调用 \{#async\}

```java
@Autowired
private PhoenixClient client;

public void send() {
    client.sendNoReply(new Command(), "target_topic", UUID.randomUUID());
}
```

## 客户端配置 \{#config\}

在**Spring Boot**配置文件中添加**Phoenix**配置信息, 2.2.1版本后Phoenix-Client增加消息重试功能。

```yaml
quantex:
  phoenix:
    client:                                     # client端配置
      name: ${spring.application.name}-client   # 服务名称
      max-retry-num: 2						              # 最大重试次数
      retry-interval: 1000000000		          	# 重试间隔（单位毫秒，默认10s）
      mq:
        type: kafka                             # mq类型
        address: 127.0.0.1:9092                 # mq服务地址 
      matching:
        maximum-size: 1000 # 最大容量. 默认为无界, 不能为负数
        timeout-mills:  600000 #  RPC 匹配超时配置，超出该时间则移除(不匹配并抛出异常). 默认 10 分钟
```

相关配置介绍 请参见: [配置详情](./phoenix-core-config)

## 超时和清理 \{#timeout\}

PhoenixClient 的原理是依靠于一个发送消息的 KafkaProducer 以及接收回复的 KafkaConsumer 实现 RPC 逻辑。当用户发送消息时，在本地暂存一个 Future 对象用于等待 KafkaConsumer 直到后者匹配到 RPC 回复。

在此机制可实现重试机制, 内部的最大超时为 10m, 在此时间后该 Future 对象将会被清理，避免发生内存泄漏问题。

当消息在最大超时时间(10m)后返回时, Future 被清理, 此时 PhoenixClient 会记录 WARN 级别日志提示用户.

```java
Future<RpcResult> future = phoenixClient.send(req, accountTnTopic, UUIDUtils.genUUID());
int maxRetryTime = 5;
RpcResult rpcResult;
while (maxRetryTime <= 0) {
    try {
        rpcResult = future.get(10, TimeUnit.SECONDS);
        return rpcResult.getMessage();
    } catch (InterruptedException | ExecutionException | TimeoutException e) {
        maxRetryTime--;
    }
}
return  "rpc error with max timeout";
```



## 其他特性 \{#feature\}

### 试算接口 \{#trial\}

Phoenix 客户端提供试算接口供用户端使用，当用户有如下需求时，可以考虑使用试算接口：

- 查询历史状态
- 按指定版本/时间戳查询历史状态
- 试算场景（修改了某个值之后，查看其他值的变化。但是当前操作又不希望修改状态，只去计算当下的结果就行。）
- 按指定版本/时间戳进行试算

:::info[提示]

Phoenix 所提供的试算功能，是通过克隆副本聚合根来进行时试算，对原聚合根不会造成任何影响。且针对同一个聚合根的多个试算请求可以做到并发处理。

:::

```java
public interface TrialAware {

    /**
     * 试算 - 根据最新状态进行试算
     *
     * @param msg rpc调用消息
     * @param targetTopic 接收命令的服务 Topic
     * @param requestId 请求ID
     * @return
     */
    Future<RpcResult> trial(Object msg, String targetTopic, String requestId);

    /**
     * 试算 - 根据最新状态增量(追加)进行试算. 增量试算的聚合根的存活时间与聚合根一致.
     *
     * <pre>
     * <strong>增量试算的聚合根只会拥有一个并行度</strong>, 可以认为增量试算聚合根是实体聚合根的一个副本.
     * 增量试算为低成本溯源而设计，仅支持最新版本的试算, 并不考虑并发.
     * 如果需要提高试算的并行能力, 则需要溯源成本更高的普通试算.
     * </pre>
     *
     * @param msg rpc调用消息
     * @param targetTopic 接收命令的服务 Topic
     * @param requestId 请求ID
     * @return
     */
    Future<RpcResult> trialByAppend(Object msg, String targetTopic, String requestId);

    /**
     * 试算 - 根据历史版本恢复历史状态，并完成试算
     *
     * @param msg rpc调用消息
     * @param targetTopic 接收命令的服务 Topic
     * @param requestId 请求ID
     * @param version 历史版本号
     * @return
     */
    Future<RpcResult> trialByVersion(
            Object msg, String targetTopic, String requestId, Long version);

    /**
     * 试算 - 根据历史时间戳恢复历史状态，并完成试算
     *
     * @param msg rpc调用消息
     * @param targetTopic 接收命令的服务 Topic
     * @param requestId 请求ID
     * @param timestamp 历史时间戳,单位毫秒
     * @return
     */
    Future<RpcResult> trialByTimestamp(
            Object msg, String targetTopic, String requestId, Long timestamp);
}
```


### 自定义 Kafka Record Key \{#kafka-record-key\}

对于投递到 Phoenix Server 主订阅 Topic 的事件（命令）, PhoenixClient 支持如下 API 自定义投递到 Kafka 的 Key（ProducerRecord）

需要注意的是，该 API 指定的 KEY 在 RPC 模式下，也会被作为响应的 Key 投递到 PhoenixClient 的响应订阅 Topic 中

```java
/**
 * 异步非 RPC 发送，指定消息投递到 targetTopic 的 Key
 *
 * @param msg 调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param key key
 * @return
 */
MessageMetaData sendNoReplyWithKey(Object msg, String targetTopic, String requestId, String key);

/**
 * RPC 发送，指定消息投递到 targetTopic 的 Key
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param key key
 * @return
 */
<T> Future<RpcResult<T>> sendWithKey(
        Object msg, String targetTopic, String requestId, String key);
```



### 自定义 EventPublish 投递 Key \{#event-publish-key\}

对于 EventPublish 中[<u>自定义投递 Key</u>](/docs/phoenix-event-publish/event-publish-integration#custom-key) 的需求, PhoenixClient 支持如下 API 自定义 EventPublish 投递 Key:

```java
/**
 * Client 端异步发送接口. 回复到指定 topic
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param eventPublishKey 自定义EventPublish Key
 */
MessageMetaData sendNoReplyWithEventPublishKey(Object msg, String targetTopic, String requestId, String eventPublishKey);

/**
 * Client端发送接口
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param eventPublishKey EventPublish 投递 Event 时发送的 Key
 * @return Future，可返回rpc调用结果
 */
Future<RpcResult> sendWithEventPublishKey(Object msg, String targetTopic, String requestId, String eventPublishKey);
```


### 自定义消息优先级 \{#priority\}

Phoenix 内部的线程模型使用了 Actor 模型，聚合根的命令都是在 Actor 模式下运行。

在券商的部分场景下，指令、委托等事件的优先级高于行情，需要优先处理，否则大量的行情数据让指令、委托等交易事件阻塞，然后延迟处理，因此 Phoenix 支持定义消息处理的优先级。

高优先级的消息将会在 Mailbox 中被积极获取然后处理，低优先级的消息将会延迟处理。

```java
/**
 * 指定消息优先级
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param priority 优先级
 * @return
 */
MessageMetaData sendNoReplyWithPriority(
        Object msg, String targetTopic, String requestId, MessagePriority priority);

/**
 * RPC 方法，指定消息优先级.
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param priority 优先级
 * @return
 */
<T> Future<RpcResult<T>> sendWithPriority(
        Object msg, String targetTopic, String requestId, MessagePriority priority);
```

:::tip[提示]
除了在 PhoenixClient 中用 API 指定消息优先级外，也可以在 SourceCollect 中是用 MessageFactory 构建 Phoenix 的 ProtoBuffer 消息，然后使用 `withPriority()` 方法指定消息优先级
:::


### 自定义 MetaData \{#metadata\}

上述的试算, EventPublish 都是基于 MetaData 实现的, 对于其他特性（如消息优先级）可以直接通过 MetaData API 来实现

```java
/**
 * 基于元数据的同步请求.
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param metaData 需要附加的元数据
 * @return
 */
MessageMetaData sendNoReplyWithMetaData(
        Object msg, String targetTopic, String requestId, Map<MetaDataKey, String> metaData);

/**
 * 基于元数据的同步请求.
 *
 * @param msg rpc调用消息
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId 请求ID
 * @param metaData 需要附加的元数据
 * @return
 */
Future<RpcResult> sendWithMetaData(Object msg, String targetTopic, String requestId, Map<MetaDataKey, String> metaData);
```

目前支持的元数据类型如下：

- **TRIAL_BY_VERSION**：按指定版本溯源聚合根并发起试算，Value = 版本
- **TRIAL_BY_TIMESTAMP**：按时间戳溯源聚合根并发起试算，Value = 时间戳
- **EVENT_PUBLISH_KEY**：自定义 EventPublish 时投递到 Kafka 的 Key
- **MESSAGE_PRIORITY**：消息优先级，Value = MessagePriority（0=高,1=默认,2=低) 
- **KEY**：自定义 PhoenixClient 投递到 Kafka 的 Key

使用说明：

```java
// EventPublish
Map<MetaDataKey, String> metaDataKeyMap = Collections.singletonMap(MetaDataKey.EVENT_PUBLISH_KEY, "key");
phoenixClient.sendWithMetaData(msg, serverTopic, "reuqestId",metaDataKeyMap);
// 消息优先级
Map<MetaDataKey, String> metaDataKeyMap = Collections.singletonMap(MetaDataKey.MESSAGE_PRIORITY, MessagePriority.HIGH_PRIORITY.getStringValue());
phoenixClient.sendWithMetaData(msg, serverTopic, "reuqestId",metaDataKeyMap);
```


## FAQ \{#faq\}

### 1. 消息处理优先级 \{#handle-priority\}

上面提到了： **高优先级的消息将会在 Mailbox 中被积极获取然后处理，低优先级的消息将会延迟处理。**

实际上，消息处理的优先级只会在单个聚合根内优先，对于整体而言（线程池）则不会有优先级。

如：当前线程池（16 线程）正在被 16 个处理大量行情事件的聚合根占据，并且下一个时间片也是仅有行情数据的聚合根拿到线程资源，那么此时需要处理交易事件的聚合根也只能等待线程池资源释放。


### 2. 消息发送顺序 \{#send-priority\}

PhoenixClient 在默认情况下，面对 Kafka 多分区的投递时不保证消息的发送顺序，换而言之多分区下 PhoenixClient 投递消息可能乱序。

这是因为默认情况下，PhoenixClient 投递到 Kafka 的 Key 决定了该消息被投递到哪个分区。

因此，当用户希望 PhoenixClient 发送的一组消息能保持发送顺序时，则需要保证该组消息都能被投递到相同的分区。

Phoenix 提供了两种方式扩展 PhoenixClient 投递消息到 Kafka 的分区选择：

- 使用 PhoenixClient 的 `sendWithKey` / `sendNoReplyWithKey` API 直接指定消息投递到 Kafka 的 Key，相同的 Key 会被路由到同一分区
- 自定义 PhoenixClient 的分区选择器：[自定义分区选择器文档](/docs/phoenix-advanced/phoenix-kafka-extend#partition-selector)

Phoenix 投递到 Kafka 的 Key 选择优先级如下：

> 自定义 Key > RequestID > MsgID