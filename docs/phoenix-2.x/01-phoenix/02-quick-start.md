---
id: phoenix-quick-start-2x 
title: 快速入门
---

**Phoenix**集成了**spring boot**，在开发过程中可以很方便的使用**phoenix**框架来构建应用

## 快速入门

Phoenix提供了完善的sample工程,请参见：[PhoenixIQ/phoenix-samples](https://github.com/PhoenixIQ/phoenix-samples)

### 消息定义

Phoenix是一个消息驱动框架，聚合根接收cmd产生event

#### command定义

coreapi/helloCmd.java

*Phoenix支持`protobuf`协议和`javaBean`协议进行序列化，这里使用`javaBean`进行示范*

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

coreapi/helloEvent.java

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

domain/HelloAggregate.java

**聚合根类定义规则：**

1. 聚合根类需要使用`@EntityAggregateAnnotation`进行标记
1. 聚合根类需要实现序列化类`Serializable`
1. 接收**command**方法只能包含一个**cmd**参数且方法名必须为`act`返回值为`ActReturn`
1. `act`方法前需要增加`@CommandHandler`或`@QueryHandler`,其中`aggregateRootId`为聚合根id
1. 接收**event**方法只能包含一个**event**参数，方法名称必须为`on`返回值为`void`

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
	 * 处理hello指令，产生HelloEvent
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

### 发布接口

接口的发布,可以直接发布消息，在这里包装为http请求发布。

application/HelloController.java

```java
@Slf4j
@RestController
@RequestMapping("/hello")
public class HelloController {

	/** phoenix 客户端 */
	@Autowired
	private PhoenixClient client;

	/**
	 * 处理 hello Http请求
	 * @return 指令返回结果
	 */
	@PutMapping("/{helloId}")
	public String allocate(@PathVariable String helloId) {
		Hello.HelloCmd helloCmd = Hello.HelloCmd.newBuilder().setHelloId(helloId).build();
		// 发送指令信息
		Future<RpcResult> future = client.send(helloCmd, "");
		try {
			// 接收指令返回结果
			RpcResult result = future.get(10, TimeUnit.SECONDS);
			return result.getMessage();
		}
		catch (InterruptedException | ExecutionException | TimeoutException e) {
			return "rpc error: " + e.getMessage();
		}
	}
}
```

### Phoenix配置

application/application.yaml

```yaml
quantex:
  phoenix:
    routers:
      - message: com.iquantex.samples.helloworld.coreapi.Hello$HelloCmd
        dst: helloworld/EA/Hello
    server:
      name: ${spring.application.name}
      mq:
        type: kafka
        address: embedded
      event-store:
        driver-class-name: org.h2.Driver
        snapshot:
          enabled: true
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
    client:
      name: ${spring.application.name}-client
      mq:
        type: kafka
        address: embedded
```
