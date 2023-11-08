---
id: phoenix-core-client-2x
title: 客户端介绍
---

**PhoenixClient**主要用于向**PhoenixServer**发送**cmd**和接收**PhoenixServer**返回的**event**

## maven依赖

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-client-starter</artifactId>
    <version>2.2.4</version>
</dependency>
```

## 客户端配置

在**spring boot**配置文件中添加**phoenix**配置信息, 2.2.1版本后phoenix-client增加消息重试功能。

```yaml
quantex:
  phoenix:
    client:                                     # client端配置
      name: ${spring.application.name}-client   # 服务名称
      max-retry-num: 2						    # 最大重试次数
      retry-interval: 1000000000			    # 重试间隔（单位毫秒，默认10s）
      mq:
        type: kafka                             # mq类型
        address: 127.0.0.1:9092                 # mq服务地址 
```

相关配置介绍 请参见: [配置详情](./05-config.md)

## 接口说明

`PhoenixClient`提供两种接口,需要回复以及不需要回复的。

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
     * 发送接口
     *
     * @param msg               rpc调用消息
     * @param targetTopic       消息目标服务的Topic
     * @param requestId         请求ID
     */
    void sendNoReply(Object msg, String targetTopic, String requestId);
```

## 使用样例

启动**phoenix**项目后，**Phoenix**会自动创建**PhoenixClient** **bean**,可以通过`@Autowired`进行依赖注入

### 同步调用


通过调用**send**返回**Future**对象的**get**方法同步接收请求结果

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
