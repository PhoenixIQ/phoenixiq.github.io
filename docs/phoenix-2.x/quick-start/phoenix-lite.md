---
id: phoenix-lite-2x 
title: phoenix lite 银行账户划拨
---

# 银行账户划拨案例介绍

本文将展示如何使用 `Phoenix` 构建一个银行账户划拨的应用程序。

## 业务场景

实际银行业务还是比较复杂的，为方便理解，我们简化业务场景如下（无跨银行转账业务、只描述单个银行内部账户的转入或转出业务、转入账户一定成功的场景）

- 每个账户初始化1000元
- 支持账户转入或转出指定金额
- 支持查看系统内所有账户的金额汇总

基于上述功能描述，不管系统运行多久，运行多少转账记录，一个永恒正确的公式： `sum(账户余额) = 账户数量 * 1000`

## 统一语言

基于上述业务场景，在本案例里面，我们得出如下统一术语

- **银行账户：**此案例里面提到的具有转入或转出金额的账户， 下文中可简称账户
- **账户余额：**账面上的钱
- **银行总账：**银行里面所有账户的总额

## 业务逻辑

转入金额：划拨金额大于0

转出金额：划拨金额小于0

账户余额 + 划拨金额 小于0，返回账户划拨失败,账户余额不足

## 聚合定义

- **BankAccountAggregate（银行账户聚合）**：负责单个账户的账户余额数值计算

---

# 具体实现

针对以上案例下面展示具体的代码实现

## 依赖 & 配置

引入 phoenix 的 maven 依赖

```xml        
<dependencies>
	<!-- phoenix服务端自动配置依赖包 -->
	<dependency>
		<groupId>com.iquantex</groupId>
		<artifactId>phoenix-server-starter</artifactId>
	</dependency>

	<!-- phoenix服务端依赖包 -->
	<dependency>
		<groupId>com.iquantex</groupId>
		<artifactId>phoenix-server</artifactId>
	</dependency>
</dependencies>
```

Phoenix  采用全 Spring 配置方式，透明化接入应用，对应用没有任何 API 侵入，只需用 Spring 加载 Phoenix 的配置即可。

```yaml
# app info config
spring:
  application:
    name: demo

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
      discovery-method: kubernetes-api
      cinnamon-application: ${spring.application.name}
    routers:
      - message: com.iquantex.phoenix.bankaccount.api.AccountAllocateCmd    # mock 数据
        dst: demo/EA/BankAccount                             # mock 数据
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
      name: demo-web
      mq:
        type: kafka
        group: demo-web
        address: embedded
        subscribe-topic: demo-web
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

// 账户划拨成功事件
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountAllocateOkEvent implements Serializable {
	private String accountCode; // 划拨账户
	private double amt; // 划拨金额
}
```

## 业务代码编写

**账户聚合根类**

编程有如下约定：

- 类需要添加 EntityAggregateAnnotation 注解并添加aggregateRootType（聚合根类别）， 标明这是一个聚合根类，用于框架扫描发现
- 聚合根类需要继承Serializable
- 需要给成员变量添加Get、Set方法（对象转JSON用）
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

**http接口及内存数据查询接口**

```java
@Slf4j
@RestController
@RequestMapping("/accounts")
public class BankAccountController extends AggregateController {

	@Autowired
	private PhoenixClient client;

	/**
	 * 账户总览
	 * @return
	 */
	@GetMapping("")
	public String accounts() {
		int pageIndex = 1;
		int pageSize = 1000;
		List<BankAccountAggregate> aggList = new ArrayList<>();
		while (true) {
			List<String> tmpList = AggregateRepository.getInstance()
					.getAggregateIdListByAggregateRootType("BankAccount", pageIndex, pageSize);
			log.info("select all aggregate:{}", tmpList);
			if (tmpList.isEmpty()) {
				break;
			}
			for (String aggId : tmpList) {
				BankAccountAggregate aggregate = (BankAccountAggregate) AggregateRepository.getInstance().load(aggId)
						.getAggregateRoot();
				aggregate.setAccount(aggId);
				aggList.add(aggregate);
			}
			pageIndex++;
		}
		return showAsHTML(aggList);
	}

	/**
	 * 定向划拨
	 * @param account  账户
	 * @param amt      划拨金额（默认：大于0为转入，小于0为转出）
	 * @return
	 */
	@PutMapping("/transfers/{account}/{amt}")
	public String transfer(@PathVariable String account, @PathVariable double amt) {
		AccountAllocateCmd cmd = new AccountAllocateCmd(account, amt);
		RpcResult result = client.rpc(cmd, "", 1000);
		return result.getMessage();
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

## 运行

下面我们模拟给账户 `Colin` 转入 `100` 元

运行程序之后 在Terminal中键入 `curl -X PUT http://localhost:8080/accounts/transfers/Colin/100`

然后我们可以调用内存查询接口 `http://localhost:8080/accounts/`，来验证是否转账成功。出现如下图片则转账成功。

![Colin](assets/phoenix2.x/phoenix-lite/Colin.png)