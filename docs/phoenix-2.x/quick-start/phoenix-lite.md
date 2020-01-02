---
id: phoenix-lite-2x 
title: phoenix lite 银行账户划拨
---

[Demo 下载](https://gitlab.iquantex.com/phoenix-public/bank-account.git)

## 银行账户划拨案例介绍

本文将展示如何使用 `Phoenix` 构建一个银行账户划拨的应用程序。

### 业务场景

业务场景如下:

- 每个账户初始化1000元
- 支持账户转入或转出指定金额
- 支持查看系统内所有账户的金额

### 统一语言

基于上述业务场景，在本案例里面，我们得出如下统一术语

- **银行账户：**此案例里面提到的具有转入或转出金额的账户， 下文中可简称账户
- **账户余额：**账面上的钱
- **银行总账：**银行里面所有账户的总额汇总

### 业务逻辑

资金划入：划拨金额大于0

资金划出：划拨金额小于0

如果账户余额 + 划拨金额 小于0，返回账户划拨失败，账户余额不足。

### 聚合定义

- **BankAccountAggregate（银行账户聚合）**：负责单个账户的账户余额数值计算


---

## 具体实现

针对以上案例下面展示具体的代码实现。

### 依赖 & 配置

引入 phoenix 的 maven 依赖

```xml        
<dependencies>
	<!-- phoenix服务端自动配置依赖包 -->
	<dependency>
		<groupId>com.iquantex</groupId>
		<artifactId>phoenix-server-starter</artifactId>
	</dependency>
</dependencies>
```

Phoenix  采用全 Spring 配置方式，透明化接入应用，对应用没有任何 API 侵入，只需用 Spring 加载 Phoenix 的配置即可。

```yaml
# app info config
spring:
  application:
    name: account-server

# web config
server:
  port: 8080

quantex:
  phoenix:
    akka:
      akka-conf: application.conf      # 这里指定akka的配置文件
      akka-parallelism-min: 1
      akka-parallelism-factor: 3
      akka-parallelism-max: 128
      service-name: ${spring.application.name}
      discovery-method: config
      cinnamon-application: ${spring.application.name}
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
        group: ${spring.application.name}
        subscribe-topic: ${spring.application.name}
      driver-class-name: org.h2.Driver
      event-stores:
        - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
          username: sa
          password:
    client:
      name: ${spring.application.name}-client
      mq:
        type: kafka
        group: ${spring.application.name}-client
        address: embedded
        subscribe-topic: ${spring.application.name}-client
```

### API 定义

phoenix 的API定义支持 `google protocol-buffers` 和 `java bean` ， 这里为了快速实现选用 `java bean` 来定义

类定义必须支持Serializable， 因为消息在通讯传输和存储的时候， 都需要支持序列化和反序列化

```java
// 账户划拨命令
@Data
@NoArgsConstructor
@AllArgsConstructor  
public class AccountAllocateCmd implements Serializable {
  private String accountCode; // 划拨账户
  private double amt; // 划拨金额,允许正负
}

// 账户划拨失败事件
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountAllocateFailEvent implements Serializable {
  private String accountCode; // 划拨账户
  private double amt; // 划拨金额
  private String result; // 失败原因
}

// 账户划拨成功事
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountAllocateOkEvent implements Serializable {
  private String accountCode; // 划拨账户
  private double amt; // 划拨金额
}

```

### 业务代码编写

**账户聚合根类**

编程有如下约定：

- 类需要添加 EntityAggregateAnnotation 注解并添加aggregateRootType（聚合根类别）， 标明这是一个聚合根类，用于框架扫描发现
- 聚合根类需要继承Serializable并给成员变量添加Get、Set方法（对象转JSON用）
- 对于Command消息，约定用act方法进行处理，且act方法中不进行任何聚合根内状态数据的修改，只负责逻辑处理，并产生Event
- act函数需要添加的注解 AggregateIdAnnotation， 并且注解中的变量值含义为：Command入参中属于聚合根ID的字段名
- act返回的Event对象，会先进行持久化到事件库后， 然后由框架自动回调对应的on方法
- on方法里完成聚合根状态数据的变更， 这里必须是pure function操作。 例如：IO调用，随机行为是不允许的
- 聚合根在做状态恢复的时候，即EventSourcing，就会获取到历史的Event，按原来的event处理顺序，调用on函数，进行内存数据恢复

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
			String retMessage = String.format("账户划拨失败,账户余额不足: 账户余额:%f, 划拨金额：%f", balanceAmt, cmd.getAmt());
			return ActReturn.builder(RetCode.FAIL, retMessage,
					new AccountAllocateFailEvent(cmd.getAccountCode(), cmd.getAmt(), retMessage)).build();
		}
		else {
			String retMessage = String.format("账户划拨成功：划拨金额：%.2f，账户余额：%.2f", cmd.getAmt(), balanceAmt + cmd.getAmt());
			return ActReturn.builder(RetCode.SUCCESS, retMessage,
					new AccountAllocateOkEvent(cmd.getAccountCode(), cmd.getAmt())).build();
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

**runner类**

```java
@Slf4j
@Component
public class Runner implements ApplicationRunner {

	@Autowired
	ServerWorker serverWorker;

	@Override
	public void run(ApplicationArguments args) {
		serverWorker.startup();
		log.info("app started");
	}
}
```

**启动类， SpringBoot启动方式**

```java
@EnableSwagger2
@EnableScheduling
@ServletComponentScan
@SpringBootApplication
public class BankAccountApplication {

	public static void main(String[] args) {
		try {
			SpringApplication.run(BankAccountApplication.class, args);
		}
		catch (Exception e) {
			e.printStackTrace();
			System.exit(1);
		}
	}
}
```

### 运行

程序运行之后，可访问 [http://localhost:8080/](http://localhost:8080/) 进行下单测试。

![Colin](assets/phoenix2.x/phoenix-lite/show.png)

phoenix-lite 提供两种下单方式

 - 随机划拨：指定划拨总数、 每秒划拨的次数、账户总数，账户之间可进行随机的划拨
 - 定向划拨：可以向指定账户划拨指定的金额

下面我们分别使用上面的两种下单方式进行测试：

1. 模拟10个账户之间随机划拨100次，每秒划拨10笔

![Colin](assets/phoenix2.x/phoenix-lite/show2.png)

2. 向账户 `Colin` 转入 100 元

![Colin](assets/phoenix2.x/phoenix-lite/show1.png)