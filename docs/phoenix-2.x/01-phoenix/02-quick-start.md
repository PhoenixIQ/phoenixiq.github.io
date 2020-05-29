---
id: phoenix-quick-start-2x 
title: 快速入门
---

**Phoenix**框架提供Spring Boot Starter可以很快速帮助用户构建应用。

## 服务提供者

服务提供者案例,请参见：[PhoenixIQ/phoenix-samples/hello-world](https://github.com/PhoenixIQ/phoenix-samples/tree/master/hello-world)

### maven依赖

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-server-starter</artifactId>
    <version>2.1.5</version>
</dependency>
```

### 消息定义

聚合根接收**cmd**产生**event**

#### command定义

*Phoenix支持`protobuf`协议和`javaBean`协议进行序列化,这里使用`javaBean`协议进行示范*

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelloCmd implements Serializable {
	/** hello 指令id */
    private String helloId;
}
```

#### event定义

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelloEvent implements Serializable {
	/** hello 指令id */
    private String helloId;
}
```

### 定义聚合根

**聚合根类定义规则：**

1. 聚合根类需要使用`@EntityAggregateAnnotation`进行标记
1. 聚合根类需要实现`Serializable`接口
1. 接收**command**方法只能包含一个**cmd**参数且方法名必须为`act`返回值为`ActReturn`
1. `act`方法前需要增加`@CommandHandler`或`@QueryHandler`,其中`aggregateRootId`为聚合根id
1. 接收**event**方法只能包含一个**event**参数,方法名称必须为`on`返回值为`void`

```java
/**
 * hello 聚合根
 */
@Slf4j
@Data
@EntityAggregateAnnotation(aggregateRootType = "Hello")
public class HelloAggregate implements Serializable {

	private static final long serialVersionUID = -1L;

	/** 状态: 计数器 */
	private long num;

	/**
	 * 处理hello指令,产生HelloEvent
	 * @param cmd hello 指令
	 * @return 处理结果
	 */
	@CommandHandler(aggregateRootId = "helloId")
	public ActReturn act(Hello.HelloCmd cmd) {
		return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage("Hello World Phoenix...")
				.event(Hello.HelloEvent.newBuilder().setHelloId(cmd.getHelloId()).build()).build();
	}

	/**
	 * 处理helloEvent
	 * @param event hello事件
	 */
	public void on(Hello.HelloEvent event) {
		num++;
		log.info("Phoenix State: {}", num);
	}
}
```

### 配置文件

在**springboot**配置文件中增加**phoenix**的相关配置

```yaml
quantex:
  phoenix:
    routers:                              # 路由表配置
      - message: com.iquantex.samples.helloworld.coreapi.Hello$HelloCmd # 消息类名称
        dst: helloworld/EA/Hello          # 目标地址
    server:
      name: ${spring.application.name}    # 服务名称
      mq:
        type: kafka                       # mq类型
        address: embedded                 # mq服务地址 embedded为内存kafka
        subscribes:
          - topic: helloworld
      event-store:
        driver-class-name: org.h2.Driver  # 数据库驱动
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC # 数据库链接url
            username: sa                  # 数据库账户
            password:                     # 数据库密码
```

## 服务调用者

### Maven依赖

```xml
<dependency>
    <groupId>com.iquantex</groupId>
    <artifactId>phoenix-client-starter</artifactId>
    <version>2.1.5</version>
</dependency>
```

### 调用服务

增加`phoenix-client-starter`依赖启动服务后**phoenix**会自动注入**PhoenixClient**，可以通过调用**PhoenixClient**的**send**方法调用**phoenix**服务

```java
@Autowired
private PhoenixClient client;

public String send(tring helloId) {
    Hello.HelloCmd helloCmd = Hello.HelloCmd.newBuilder().setHelloId(helloId).build();
    client.send(helloCmd, "");
}
```

### 配置文件

```yaml
quantex:
  phoenix:
    routers:                                    # 路由表配置
      - message: com.iquantex.samples.helloworld.coreapi.Hello$HelloCmd # 消息类名称
        dst: helloworld/EA/Hello	            # 目标地址
    client:
      name: ${spring.application.name}-client	# 服务名称
      mq:
        type: kafka	                            # mq类型
        address: embedded                       # mq地址：embedded表示使用内存kafka
```

## 相关链接

[服务提供者详情](../02-phoenix-core/00-phoenix-core.md)

[服务调用者详情](../02-phoenix-core/01-client.md)

[配置文件详情](../02-phoenix-core/05-config.md)

