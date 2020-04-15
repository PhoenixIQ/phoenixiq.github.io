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
    <version>2.1.3</version>
</dependency>
```

## 客户端配置

在**spring boot**配置文件中添加**phoenix**配置信息

```yaml
quantex:
  phoenix:
    routers:                                    # 路由配置
      - message: com.iquantex.samples.account.coreapi.Hello$HelloCmd  # 消息类名称
        dst: bank-account/EA/Hello              # 目标地址
      - message: com.iquantex.samples.account.coreapi.AccountAllocateCmd  # 消息类名称
        dst: bank-account/EA/BankAccount        # 目标地址
    client:                                     # client端配置
      name: ${spring.application.name}-client   # 服务名称
      mq:
        type: kafka                             # mq类型
        address: embedded                       # mq服务地址 embedded为内存kafka地址
```

相关配置介绍 请参见: [配置详情](./05-config.md)

## 消息发送

启动**phoenix**项目后，**Phoenix**会自动创建**PhoenixClient** **bean**,可以通过`@Autowired`进行依赖注入

```java
@Autowired
private PhoenixClient client;

public void send() {
    client.send(new Command(), UUID.randomUUID());
}
```

通过调用**send**返回**Future**对象的**get**方法阻塞获取返回值

```java
@Autowired
private PhoenixClient client;

public void send() {
    Future<RpcResult> future = client.send(new Command(), UUID.randomUUID());
    RpcResult rpcResult = future.get();
}
```