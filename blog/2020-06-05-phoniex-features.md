---
slug: features
title: Phoenix 特性解析
authors: baozi
tags: [phoenix, features]
---

> 本文解析phoenix的特性

{/* truncate */}

## 编程模型

### Actor模型
![rpc](images/features/actor.png)

### 实体聚合根
![rpc](images/features/entity-aggregate.png)

### 事务聚合根
![rpc](images/features/transaction-aggregate.png)

### 单元测试
``` java
/**
 * 划拨失败
 */
@Test
public void allocate_exceptFail() {
	EntityAggregateFixture fixture = new EntityAggregateFixture();
	// 向 A0 账户划拨 -1500 元，期待划拨失败
	AccountAllocateCmd cmd = new AccountAllocateCmd("A0", -1500);
	// 断言
	fixture.when(cmd).expectRetFailCode().expectMessage(AccountAllocateFailEvent.class);
}
```

## 通讯模型

### 请求-响应
![rpc](images/features/rpc.png)

### 非回复
![rpc-noreply](images/features/rpc-noreply.png)

### 主动订阅
![subscribes](images/features/subscribes.png)

## 调用其他服务
![subscribes](images/features/spring.png)

## 事件发布
![subscribes](images/features/eventpublish.png)

## 查询模型
### Query-Model
最终一致性读
基于数据库query
![subscribes](images/features/query-module.png)


### QueryCommandHandler
线性一致性读
![subscribes](images/features/query-rpc.png)

## 运行模型
- dataSharding
- 聚合根飘逸







