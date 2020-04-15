---
id: phoenix-core-client-2x
title: 客户端调用
---

> **PhoenixClient**主要用于向**PhoenixServer**发送**cmd**和接收**PhoenixServer**返回的**event**

## client端配置依赖

配置文件位置：`application/application.yaml`

### PhoenixClient配置


```yaml
quantex:
  phoenix:
    client:
      name: ${spring.application.name}-client
      mq:
        type: kafka
        address: embedded
```
|名称        |内容|
|: ---      |: --- |
|name       | 服务名称|
|mq.type    | mq类型，例如：kafka|
|mq.address | mq地址，可以设置为embedded内存版kafka|


### 路由表配置

- **message**: 消息指令的classname
- **dst**: 服务名/聚合类别(**EA**/**TA**)/聚合根类型(对应`@EntityAggregateAnnotation`中的`aggregateRootType`值)

```yaml
quantex:
  phoenix:
    routers:
      - message: com.iquantex.samples.account.coreapi.Hello$HelloCmd
        dst: bank-account/EA/Hello
      - message: com.iquantex.samples.account.coreapi.AccountAllocateCmd
        dst: bank-account/EA/BankAccount
```
|名称             |内容|
|: ---              |: --- |
|routers.message    | 消息指令的classname|
|routers.dst        | 服务名/聚合类别(**EA**/**TA**)/聚合根类型(对应`@EntityAggregateAnnotation`中的`aggregateRootType`值) |

### 依赖

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-client-starter</artifactId>
</dependency>
```

## 自动注入

启动phoenix项目后，Phoenix会自动创建`PhoenixClient` bean,可以通过`@Autowired`进行依赖注入

```java
	/** phoenix 客户端 */
	@Autowired
	private PhoenixClient client;
```

## 异步发送消息
```java
/**
 * Client端发送接口
 * @param msg rpc调用消息
 * @param requestId 请求ID
 * @return Future，可返回rpc调用结果
 */
Future<RpcResult> send(Object msg, String requestId)
```

## 同步发送消息

同步发送与异步发送使用同一个`send`方法，不同之处在于同步发送需要调用返回对象**Future**的`get`方法

PhoenixClient.java
```java
/**
 * Client端发送接口
 * @param msg rpc调用消息
 * @param requestId 请求ID
 * @return Future，可返回rpc调用结果
 */
Future<RpcResult> send(Object msg, String requestId)
```

Future.java
```java

/**
 * 获取指令请求结果,此方法会一直等待直到收到返回结果为止
 */
RpcResult get()

/**
 * 获取指令请求结果
 * @param timeout 要等待的最长时间
 * @param unit 参数的时间单位
 * @return 指令请求结果
 */
RpcResult get(long timeout, TimeUnit unit)
```
