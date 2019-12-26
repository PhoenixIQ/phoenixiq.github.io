---
id: phoenix-lite-api-2x
title: API
---

## 消息定义

**server 端 act 方法返回值** `ActReturn`

```java
@Getter
public class ActReturn {

	private final RetCode retCode;    // 处理结果

	private final Object event;       // 返回的事件

	private final Object reply;       // 回复（可选项）

	private final Map<String, Object> metaData;  // （可选项）

    ...

}

/**
 * 处理结果
 */
public enum RetCode {

	NONE(-1), 
    SUCCESS(0), 
    FAIL(1), 
    EXCEPTION(2);
	
    int value;

}
```


**Client端 rpc 调用返回值** `RpcResult`

```java
@Setter
@ToString
public class RpcResult {

	private final RpcResultCode rpcResultCode;   // Rpc 调用返回值
 
	private final Object payload;                // 可选项

	private final String message;               // 提示信息

}

public enum RpcResultCode {

	NONE(-1), // 未定义

	SUCCESS(0), // 调用成功

	FAIL(1), // 服务端返回：调用失败

	SERVER_ERROR(2), // 服务端返回：调用出错

	TIMEOUT(3), // 客户端返回：等待调用结果超时

	CLIENT_ERROR(4); // 客户端返回：客户端处理出错

	int code;

}
```


## 客户端 API

```
/**  
 * 发送消息  
 */ 
 Future send(Object msg, String requestId)
```

| 字段        | 类型   | 是否必填 | 描述                |
| :---------- | :----- | :------- | :------------------ |
| msg         | Object | 必填     | 待发送的消息        |
| requestId | string | 必填     |  请求ID （预留字段） |


```
/**  
 * rpc 发送  
 */ 
 RpcResult rpc(Object msg, String requestId, long timeoutMs)
```

| 字段        | 类型   | 是否必填 | 描述                |
| :---------- | :----- | :------- | :------------------ |
| msg         | Object | 必填     | 待发送的消息        |
| requestId | string | 必填     |  请求ID  （预留字段） |
| timeoutMs   | long   | 必填     | 超时时间            |


## 服务端 API

### 注解

#### @EntityAggregateAnnotation

这个注释是为了找到聚合根类，为spring ioc注入存储库。 使用 `aggregateRootType` 标识该聚合根的类型

```java
@Getter
@Setter
@EntityAggregateAnnotation(aggregateRootType = "BankAccount")
public class BankAccountAggregate implements Serializable {

	// 核心业务数据
	...

	@AggregateIdAnnotation(aggregateId = "accountCode")
	public ActReturn act(MockCmd cmd) {}

	public void on(MockEvent event) {}

}
```

#### @AggregateIdAnnotation

该注解一般用于 `act` 方法，aggregateId用于标识事件中的属性，该属性将提供查找Saga实例的值。通常，此值是特定saga监视的聚合的聚合标识符。  


```java
@AggregateIdAnnotation(aggregateId = "accountCode")
public ActReturn act(MockCmd cmd) {

	...

}
```



