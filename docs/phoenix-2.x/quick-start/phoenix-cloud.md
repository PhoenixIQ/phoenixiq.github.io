---
id: phoenix-cloud-2x
title: phoenix cloud 银行账户转账
---

[Demo 下载](https://gitlab.iquantex.com/phoenix-public/bank-account.git)

## 银行账户转账

在 [银行账户划拨案例](./phoenix-lite-2x) 中介绍了一个简单的案例：单个账户的划拨操作。 下面我们在[Phoenix-lite](./phoenix-lite-2x)的基础上实现多个账户之间的划拨操作。多个账户之间的划拨操作涉及分布式事务问题，Phoenix 引入了事务协调器的概念来解决分布式事务问题。

### 业务场景

实际银行业务还是比较复杂的，为方便理解，我们简化业务场景如下（无跨银行转账业务、只描述单个银行内部账户转账业务、转入账户一定成功的场景）
- 每个账户初始化1000元
- 支持账户A转账户B指定金额
- 支持查看系统内所有账户的金额汇总

基于上述功能描述，不管系统运行多久，运行多少转账记录，一个永恒正确的公式： sum(账户余额) = 账户数量 * 1000

### 统一语言

基于上述业务场景，在本案例里面，我们得出如下统一术语
- **银行账户：**此案例里面提到的具有转入或转出金额的账户， 下文中可简称账户
- **账户余额：**账面上的钱
- **银行总账：**银行里面所有账户的总额

### 业务逻辑

针对案例的核心转账功能，基于Saga模式事务设计
转账成功场景分为两个小事务，先后顺序如下：
1. 对转出账户，判断账户可用=账户余额-转出金额大于等于0，减少账户余额
2. 对转入账户，增加账户余额（转入操作框架幂等，事务管理器不断重试保证一定成功）

转账失败场景比较简单：判断，账户可用=账户余额-转出金额大于等于0，返回可用不足，转账失败。

**转账事务编排如下：**

![](../../assets/phoenix2.x/phoenix-lite/trans-bianpai.png)

**消息流转图**

![](../../assets/phoenix2.x/phoenix-lite/trans.png)

### 聚合定义

- **BankAcountAggregate（银行账户聚合）**：负责单个账户的账户余额数值计算
- **BankTransferSaga（银行转账事务**）：负责定义银行转账事务

## 具体实现

针对以上案例下面展示具体的代码实现

### 依赖 & 配置

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
    name: account-tn

server:
  port: 8082

quantex:
  phoenix:
    routers:
      - message: com.iquantex.phoenix.bankaccount.api.AccountAllocateCmd
        dst: account-server/EA/BankAccount
      - message: com.iquantex.phoenix.bankaccount.api.AccountTransferReq
        dst: account-tn/TA/BankTransferSaga
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
```

### API 定义

phoenix 支持的API定义支持 `google protocol-buffers` 和 `java bean` ， 这里为了快速实现选用 `java bean` 来定义
类定义必须支持Serializable， 因为消息在通讯传输和存储的时候， 都需要支持序列化和反序列化



### 业务代码编写

**BankAcountAggregate（银行账户聚合）**

这部分代码在[Phoenix-lite](./phoenix-lite-2x)

**BankTransferSaga代码实现：**

Phoneix 引入了Saga的概念来解决分布式事务问题。

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
    @TransactionStart
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



### 事务单元测试

Phoenix为事务聚合根的单元测试也提供了工具类，极大地降低了编写事务单元测试的难度。

**测试工具类AggregateFixture简介**

`AggregateFixture`类可以为我们模拟聚合根处理消息和返回的完整流程，并提供了一系列的断言方法，方便我们进行结果断言。我们重点关注以下几个方法。

- `when(Object msg)`：给定工具类一个入参请求，模拟真实环境下，我们的完整事务的处理场景。

- `expectMessage(Class respons)`：判断使用when()接收请求并处理事务后，返回对象的类型是否符合预期。
- `expectRetCode(RetCode retCode)`：判断使用when()接收请求并处理事务后的返回码是否符合预期。
- `expectRetSuccessCode()`：判断使用when()接收请求并处理事务的过程是否成功。
- `expectRetFailCode()`：判断使用when()接收并请求并处理事务的过程是否失败。

**业务单元测试代码**

```java
public class BankTransferSagaTest {

   private final static String inAccountCode = "test_in";

   private final static String outAccountCode = "test_out";

   private AggregateFixture testFixture;

   @Before
   public void init() {
      testFixture = new AggregateFixture();
   }

   /**
    * 转账成功
    */
   @Test
   public void test_trans_ok() {
      AccountTransferReq req = new AccountTransferReq(inAccountCode, outAccountCode, 100);
      testFixture.when(req).expectRetCode(RetCode.SUCCESS);
   }


   /**
    * 转账失败
    * 说明：在事务聚合根内，Saga事务的ci操作为null，因为ti是扣减金额，假如不成功，不会有后续操作，因此也不需要ci。
    *        但是在框架层面判断了没有ci会视为异常，这里我们assert exception，实际上是一个失败的事务，而不是异常事务。
    */
   @Test
   public void test_trans_fail() {
      AccountTransferReq req = new AccountTransferReq(inAccountCode, outAccountCode, 1100);
      testFixture.when(req).expectRetCode(RetCode.EXCEPTION);
   }
}
```

**说明**

在使用`AggregateFixture`的时候，我们需要在事务聚合根类的事务起始方法上，加上`    @TransactionStart`注解。拿该工程举例，就是`BankTransferSaga`类下面的方法。

```java
/**
	 * 处理转账请求,先发起转出
	 * @param request
	 * @return
	 */
    @TransactionStart
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
```



