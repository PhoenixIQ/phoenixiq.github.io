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
    <version>2.4.2</version>
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

## 历史查询接口

> Phoenix 从2.4.0版本开始支持对聚合根历史状态查询的功能

如果想要查询聚合根历史状态,需要使用Phoenix Client特定的send方法发送历史查询指令,可以按照Version或者事件处理时间来指定的历史状态,然后执行查询指令.

**需要注意:** 历史查询会重新走一遍EventSourcing恢复历史聚合根状态然后执行查询指令,目前Phoenix未对历史状态进行缓存,所以历史状态查询对性能消耗较大,还请酌情使用.如有大量重复查询历史状态的需求,请及时联系Phoenix组!

### 根据Version查询历史状态

查询指定Version的历史状态,如果当前聚合根Version小于要查询的Version,则会查询最新状态

```java
/**
 * client端发送接口,用于根据版本查询历史状态,msg做用与QueryHandle标记的方法,及查询指令
 *
 * @param msg msg
 * @param targetTopic 目标topic
 * @param requestId 请求id
 * @param version 历史版本号
 * @return 可返回rpc调用结果
 */
public RpcResult sendHistoryQueryCmdByVersion(Object msg, String targetTopic, String requestId, Long version) throws ExecutionException, InterruptedException;

/**
 * client端发送接口,用于根据版本查询历史状态,msg做用与QueryHandle标记的方法,及查询指令
 *
 * @param msg msg
 * @param targetTopic 目标topic
 * @param requestId 请求id
 * @param version 历史版本号
 * @param timeout 等待的最长时间
 * @param unit 超时参数的时间单位
 * @return 可返回rpc调用结果
 */
public RpcResult sendHistoryQueryCmdByVersion(Object msg, String targetTopic, String requestId, Long version, long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;
```

### 根据事件处理时间查询历史状态

查询指定时间聚合根的状态,如果当前聚合根时间小于要查询的时间,则会查询最新状态

```java
/**
 * Client端发送接口,用户根据历史时间戳查询历史状态,msg做用与QueryHandle标记的方法
 *
 * @param msg rpc调用消息
 * @param requestId 请求ID
 * @param timestamp 历史时间戳,单位毫秒
 * @return 返回rpc调用结果
 */
public RpcResult sendHistoryQueryCmdByTimestamp(Object msg, String targetTopic, String requestId, Long timestamp) throws ExecutionException, InterruptedException;

/**
 * Client端发送接口,用户根据历史时间戳查询历史状态,msg做用与QueryHandle标记的方法
 *
 * @param msg rpc调用消息
 * @param requestId 请求ID
 * @param timestamp 历史时间戳,单位毫秒
 * @param timeout 等待的最长时间
 * @param unit 超时参数的时间单位
 * @return 返回rpc调用结果
 */
public RpcResult sendHistoryQueryCmdByTimestamp(Object msg, String targetTopic, String requestId, Long timestamp, long timeout, TimeUnit unit) throws ExecutionException, InterruptedException, TimeoutException;
```

相关配置介绍 请参见: [配置详情](./phoenix-core-config)
