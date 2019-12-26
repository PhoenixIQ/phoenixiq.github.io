---
id: phoenix-cloud-2x
title: phoenix cloud 银行账户转账
---

# 银行账户转账

在 [银行账户划拨案例](./phoenix-lite-2x) 中介绍了一个简单的案例：单个账户的划拨操作。 该案例展示了 phoenix 框架在不涉及事务的案例中的具体实现。在 phoenix-cloud 中我们将展示如何利用 phoenix 框架处理有事务存在的案例。

## 业务场景

实际银行业务还是比较复杂的，为方便理解，我们简化业务场景如下（无跨银行转账业务、只描述单个银行内部账户转账业务、转入账户一定成功的场景）

- 每个账户初始化1000元
- 支持账户A转账户B指定金额
- 支持查看系统内所有账户的金额汇总

基于上述功能描述，不管系统运行多久，运行多少转账记录，一个永恒正确的公式： sum(账户余额) = 账户数量 * 1000

## 统一语言

基于上述业务场景，在本案例里面，我们得出如下统一术语

- **银行账户：**此案例里面提到的具有转入或转出金额的账户， 下文中可简称账户
- **账户余额：**账面上的钱
- **银行总账：**银行里面所有账户的总额

## 业务逻辑

针对案例的核心转账功能，基于Saga模式事务设计

转账成功场景分为两个小事务，先后顺序如下：

1. 对转出账户，判断账户可用=账户余额-转出金额大于等于0，减少账户余额
2. 对转入账户，增加账户余额（转入操作框架幂等，事务管理器不断重试保证一定成功）

转账失败场景比较简单：判断，账户可用=账户余额-转出金额大于等于0，返回可用不足，转账失败。

**转账事务编排如下：**

![](assets/phoenix2.x/phoenix-lite/trans-bianpai.png)

## 聚合定义

- **BankAcountAggregate（银行账户聚合）**：负责单个账户的账户余额数值计算
- **BankTransferSaga（银行转账事务**）：负责定义银行转账事务

---

# 具体实现

针对以上案例下面展示具体的代码实现

## 依赖 & 配置

引入 phoenix 的 maven 依赖

```xml
<dependencies>
	<dependency>
		<groupId>com.iquantex</groupId>
		<artifactId>phoenix-server-starter</artifactId>
	</dependency>

	<!-- phoenix 事务依赖包 -->
	<dependency>
		<groupId>com.iquantex</groupId>
		<artifactId>phoenix-transaction</artifactId>
	</dependency>
</dependencies>
```

phoenix 相关配置

```yaml
# app info config
spring:
  application:
    name: demo-tn
    
quantex:
  phoenix:
    akka:
      akka-conf: application.conf                     # 这里指定akka的配置文件
      akka-parallelism-min: 1
      akka-parallelism-factor: 3
      akka-parallelism-max: 128
      service-name: ${spring.application.name}
      discovery-method: config
      cinnamon-application: ${spring.application.name}
    routers:
      - message: com.iquantex.phoenix.bankaccount.api.AccountAllocateCmd
        dst: demo/EA/BankAccount
      - message: com.iquantex.phoenix.bankaccount.api.AccountTransferReq
        dst: demo-tn/TA/BankTransferSaga
    server:
      name: ${spring.application.name}
      mq:
        type: kafka
        address: embedded
        group: ${spring.application.name}
        subscribe-topic: ${spring.application.name}
      driver-class-name: org.h2.Driver
      event-stores:
        - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
          username: sa
          password:

```

## API 定义

phoenix 支持的API定义支持 `google protocol-buffers` 和 `java bean` ， 这里为了快速实现选用 `java bean` 来定义

类定义必须支持Serializable， 因为消息在通讯传输和存储的时候， 都需要支持序列化和反序列化

```java
// 账户划拨命令
@Data
@NoArgsConstructor
@AllArgsConstructor  
public class AccountAllocateCmd implements Serializable {
  private String accountCode; *// 划拨账户*
  private double amt; *// 划拨金额,允许正负*
}

// 账户划拨失败事件
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountAllocateFailEvent implements Serializable {
  private String accountCode; *// 划拨账户*
  private double amt; *// 划拨金额*
  private String result; *// 失败原因*
}

// 账户划拨成功事
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountAllocateOkEvent implements Serializable {
  private String accountCode; *// 划拨账户*
  private double amt; *// 划拨金额*
}

// 账户转账请求
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountTransferReq implements Serializable {
	private String inAccountCode; // 转入账户
	private String outAccountCode; // 转出账户
	private double amt; // 转入金额(正)
}
```

## 业务代码编写

**BankAccountAggregate代码实现：**

```java
@EntityAggregateAnnotation(aggregateRootType = "BankAccount")
@Getter
@Setter
public class BankAccountAggregate implements Serializable {

	// 核心业务数据
	private String account; // 账户代码

	private double balanceAmt; // 账户余额

	// 辅助统计数据
	private int successTransferOut; // 成功转出次数

	private int failTransferOut; // 失败转出次数

	private int successTransferIn; // 成功转入次数

	public BankAccountAggregate() {
		this.balanceAmt = 1000;
	}

	/**
	 * 处理账户划拨命令
	 * @param cmd
	 * @return
	 */
	@AggregateIdAnnotation(aggregateId = "accountCode")
	public ActReturn act(AccountAllocateCmd cmd) {
		if (balanceAmt + cmd.getAmt() < 0) {
			return ActReturn
					.builder(RetCode.FAIL,
							new AccountAllocateFailEvent(cmd.getAccountCode(), cmd.getAmt(),
									String.format("账户划拨失败,账户余额不足: 账户余额:%f, 划拨金额：%f", balanceAmt, cmd.getAmt())))
					.build();
		}
		else {
			return ActReturn.builder(RetCode.SUCCESS, new AccountAllocateOkEvent(cmd.getAccountCode(), cmd.getAmt()))
					.build();
		}
	}

	/**
	 * 处理账户划拨成功事件
	 * @param event
	 */
	public void on(AccountAllocateOkEvent event) {
		balanceAmt += event.getAmt();
		if (event.getAmt() < 0) {
			successTransferOut++;
		}
		else {
			successTransferIn++;
		}
	}

	/**
	 * 处理账户划拨失败事件
	 * @param event
	 */
	public void on(AccountAllocateFailEvent event) {
		failTransferOut++;
	}
}
```

**BankTransferSaga代码实现：**

```java
@TransactionAggregateAnnotation(aggregateRootType = "BankTransferSaga")
public class BankTransferSaga implements Serializable {

	private int retCode = 0; // 事务返回结果值

	private String result = ""; // 事务返回内容

	private AccountTransferReq request;

	/**
	 * 处理转账请求,先发起转出
	 * @param request
	 * @return
	 */
	public TransactionReturn on(AccountTransferReq request) {
		this.request = request;
		return TransactionReturn.builder().addAction(
				// saga事务
				new SagaAction(
						// 转出账户扣钱
						new AccountAllocateCmd(request.getOutAccountCode(), -request.getAmt()),
						// 转出账户失败回滚(加钱)
						null))
				.build();
	}

	/**
	 * 账户划拨正常
	 * @param event
	 * @return
	 */
	public TransactionReturn on(AccountAllocateOkEvent event) {
		// 转出正常,请求转入
		if (event.getAmt() < 0) {
			return TransactionReturn.builder()
					.addAction(
							new SagaAction(new AccountAllocateCmd(request.getInAccountCode(), request.getAmt()), null))
					.build();
		}
		// 转入正常,不做处理
		else {
			return null;
		}
	}

	/**
	 * 账户划拨失败
	 * @param event
	 * @return
	 */
	public TransactionReturn on(AccountAllocateFailEvent event) {
		retCode = 1;
		result = event.getResult();
		return null;
	}

	public Object onFinish() {
		return result;
	}

}
```

