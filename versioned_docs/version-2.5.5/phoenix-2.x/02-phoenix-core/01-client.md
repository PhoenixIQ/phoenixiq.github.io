---
id: phoenix-core-client
title: 客户端介绍
---

**PhoenixClient**主要用于向**PhoenixServer**发送**Command**和接收**PhoenixServer**返回的**Event**

## maven依赖

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-client-starter</artifactId>
    <version>2.5.5</version>
</dependency>
```

## 接口说明

`PhoenixClient`提供两种接口,需要回复以及不需要回复。

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
void sendNoReply(Object msg, String targetTopic, String requestId);
```

## 使用样例

启动**Phoenix**项目后，**Phoenix**会自动创建**PhoenixClient Bean**,可以通过`@Autowired`进行依赖注入

### 同步调用

通过调用 **send()** 方法返回的 **Future** 对象的 **get()** 方法，同步接收请求结果。

```java
@Autowired
private PhoenixClient client;

public void send() {
    Future<RpcResult> future = client.send(new Command(), "target_topic", UUID.randomUUID());
    RpcResult rpcResult = future.get();
}
```

### 异步调用

```java
@Autowired
private PhoenixClient client;

public void send() {
    client.sendNoReply(new Command(), "target_topic", UUID.randomUUID());
}
```

## 客户端配置

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
```

相关配置介绍 请参见: [配置详情](./phoenix-core-config)

## 其他特性

### 试算接口

Phoenix 客户端提供试算接口供用户端使用，当用户有如下需求时，可以考虑使用试算接口：

- 查询历史状态
- 按指定版本/时间戳查询历史状态
- 试算场景（修改了某个值之后，查看其他值的变化。但是当前操作又不希望修改状态，只去计算当下的结果就行。）
- 按指定版本/时间戳进行试算

:::info 提示

Phoenix 所提供的试算功能，是通过克隆副本聚合根来进行时试算，对原聚合根不会造成任何影响。且针对同一个聚合根的多个试算请求可以做到并发处理。

:::

```java
    /**
     * 试算 - 根据最新状态进行试算
     *
     * @param msg msg
     * @param targetTopic 目标topic
     * @param requestId 请求id
     * @param timeout 等待的最长时间
     * @param unit 超时参数的时间单位
     * @return 可返回rpc调用结果
     */
    public RpcResult trial(
            Object msg, String targetTopic, String requestId, long timeout, TimeUnit unit)
            throws ExecutionException, InterruptedException, TimeoutException {
        return trialByVersion(msg, targetTopic, requestId, -1L, timeout, unit);
    }

    /**
     * 试算 - 根据历史版本恢复历史状态，并完成试算
     *
     * @param msg msg
     * @param targetTopic 目标topic
     * @param requestId 请求id
     * @param version 历史版本号
     * @param timeout 等待的最长时间
     * @param unit 超时参数的时间单位
     * @return 可返回rpc调用结果
     */
    public RpcResult trialByVersion(
            Object msg,
            String targetTopic,
            String requestId,
            Long version,
            long timeout,
            TimeUnit unit)
            throws ExecutionException, InterruptedException, TimeoutException {
        HashMap<String, String> map = new HashMap<>(1);
        map.put(MetaDataKey.TRIAL_BY_VERSION, String.valueOf(version));
        return send(msg, targetTopic, requestId, map).get(timeout, unit);
    }

    /**
     * 试算 - 根据历史时间戳恢复历史状态，并完成试算
     *
     * @param msg rpc调用消息
     * @param requestId 请求ID
     * @param timestamp 历史时间戳,单位毫秒
     * @param timeout 等待的最长时间
     * @param unit 超时参数的时间单位
     * @return 返回rpc调用结果
     */
    public RpcResult trialByTimestamp(
            Object msg,
            String targetTopic,
            String requestId,
            Long timestamp,
            long timeout,
            TimeUnit unit)
            throws ExecutionException, InterruptedException, TimeoutException {
        HashMap<String, String> map = new HashMap<>(1);
        map.put(MetaDataKey.TRIAL_BY_TIMESTAMP, String.valueOf(timestamp));
        return send(msg, targetTopic, requestId, map).get(timeout, unit);
    }
```

### 自定义 EventPublish 投递 Key

对于 EventPublish 中[<u>自定义投递 Key</u>](../04-phoenix-event-publish/03-integration.md#自定义投递-key) 的需求, PhoenixClient 支持如下 API 自定义 EventPublish 投递 Key:

```java
/**
 * Client端发送接口
 *
 * @param msg rpc调用消息
 * @param targetTopic 投递 Topic
 * @param requestId 请求ID
 * @param eventPublishKey EventPublish 投递 Event 时发送的 Key
 * @return Future，可返回rpc调用结果
 */
public Future<RpcResult> sendWithEventPublishKey(Object msg, String targetTopic, String requestId, String eventPublishKey);

/**
 * Client 端异步发送接口.
 *
 * @param msg
 * @param targetTopic 接收命令的服务 Topic
 * @param requestId
 * @param eventPublishKey 自定义EventPublish Key
 */
public void sendNoReplyWithEventPublishKey(Object msg, String targetTopic, String requestId, String eventPublishKey);
```