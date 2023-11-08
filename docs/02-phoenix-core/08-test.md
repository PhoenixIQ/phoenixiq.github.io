---
id: phoenix-aggregate-test
title: 单元测试
description: 聚合根的单元测试套件
---

## 简介 \{#introduce\}

Phoenix 框架提供了一个测试套件，用于简化聚合根上下文的测试。该套件允许用户在 JUnit 框架中对聚合根进行纯业务逻辑的测试，并避免持久化、Spring 交互和运行时（Actor）等复杂上下文的依赖和引入。

## 如何使用 \{#how-to-use\}

使用Phoenix框架聚合根测试套件，您需要按照以下步骤进行配置和测试：

- 配置依赖项：您需要将 `phoenix-server` （聚合根所需依赖）添加到您的测试项目依赖项中。
- 创建测试类：您需要创建一个测试类来测试聚合根。可以使用 `JUnit` 注释来定义测试方法。
- 编写测试代码：您需要编写测试代码来测试聚合根的业务逻辑。您可以使用聚合根测试套件提供的 `EntityAggregateFixture` 来模拟聚合根的运行。
- 运行测试：您可以使用JUnit框架运行测试，或使用集成开发环境（IDE）自动运行测试。

## 实体聚合根测试套件功能 \{#testkit\}

Phoenix框架聚合根测试套件提供了以下功能：

- 模拟工具：您可以使用模拟工具来模拟聚合根的处理消息过程，并返回一个可断言的结果(Event)
- 聚合根工厂：您可以使用测试模板来快速创建聚合根对象
- 聚合根上下文：测试套件支持聚合根实际运行的大多数上下文（`EntityAggregateContext` 提供的内容)，如 Timer、DGCManager、invoke
- 快照：测试套件支持模拟聚合根快照、溯源快照等过程
- Spring 集成：测试套件也支持 `@AutoWired` 等 Spring 提供依赖注入能力，但用户需要通过 `EntityAggregateFixture.mockBean()` 方法提供聚合根需要注入的 Bean 信息。

## 使用案例 \{#example\}

### 1. 基于聚合根测试套件断言命令处理结果 \{#assert\}

```java
public class UnitTests {

    @Test
    public void test() {
        // 1. 初始化测试套件
        EntityAggregateFixture testFixture = new EntityAggregateFixture(Sets.newHashSet(DistributedDataAggregate.class.getName()));

        // 2. 构建命令
        Message msg = MessageFactory.getCmdMsg("dst", "src", new DDataApi.UpdateCmd());

        // 3. 处理并断言
        testFixture = testFixture
                .when(msg) // 模拟处理
                .expectMessage(DDataApi.UpdateEvent.class) // 断言 Event
                .expectRetSuccessCode() // 断言结果是成功
                .printIdentify();  // 打印 msgID

        // 4. 同样, 测试套件提供了 API 来查询聚合根状态等信息
        // 聚合根上下文对象
        EntityAggregate lastAggregate = testFixture.getLastAggregate();

        // 用户聚合根对象
        Object aggregateRoot = lastAggregate.getAggregateRoot();

        // 聚合根扩展对象
        EntityAggregateExtend entityAggregateExtend = lastAggregate.getEntityAggregateExtend();

        // 测试套件最后一次最次的结果
        Message lastOutMsg = testFixture.getLastOutMsg();
    }
}


```

### 2. 测试套件测试 Timer \{#timer\}

每个聚合根都提供了一个 `Timer` 的能力，能够在触发时发送一些命令给自身. 

然而 Timer 强依赖于“时间”来执行，在测试过程中，如果使用现实时间，那么部分拥有 1h 后（甚至更长）的定时任务将会难以测试，因此在测试套件中，Phoenix 提供一个手动滑动的时钟。

该时钟在初始化后为 0，并在不手动拨动时永远固定，在上面的案例中，用户可以通过测试套件手动拨动该时钟 1h1s 来让 Timer 发出一个调度消息。

```java
public class UnitTests {

    @Test
    public void test() {
        // 1. 构建命令
        Message queryMsg = MessageFactory.getCmdMsg("dst", "src", new DDataApi.QueryCmd());

        // 2. 模拟处理
        testFixture =
                testFixture
                        .when(queryMsg)
                        .expectMessage(DDataApi.QueryEvent.class)
                        .expectRetSuccessCode()
                        .printIdentify();

        // 3. 获取处理结果事件
        DDataApi.QueryEvent queryEvent = testFixture.getLastOutMsg().getPayload();

        // 4. 滑动测试套件的事件
        testFixture.tickTime(1000);

        // 5. 获取聚合根内可能发生的 Timer 行为, 并进行断言
        Phoenix.Message lastScheduleMessage1 = testFixture.getLastScheduleMessage();
    }
}

```

### 3. Spring 集成 \{#spring-mock\}

部分聚合根可能依赖 Spring 来运行一些外部的交互，或只是利用 Spring 的 DI 能力。 Phoenix 的聚合根测试套件拥有和实际运行聚合根同样的 Spring 集成能力。

```java

import java.io.Serializable;


@EntityAggregateAnnotation(aggregateRootType = "test")
public class TestAggregate implements Serializable {

    private static final long serialVersionUID = -3764189599642460534L;
    
    @AutoWired
    private RestTemplate restTemplate;


    @CommandHandler(aggregateRootId = "id")
    public ActReturn act(TryUpdateRestCmd cmd) {
        // 请求外部
        ResponseEntity response = EntityAggregateContext.invoke("getOtherMicroService", ()-> restTemplate.getForEntity(...));
        Object body = response.getBody();
        this.xxx = extractStateFromBody(body);
        return ActReturn.builder()
                .retCode(RetCode.SUCCESS)
                .retMessage("success")
                .event(new UpdateSuccessEvent())
                .build();
    }

}
public class UnitTests {

    @Test
    public void test(){
        // 1. 初始化测试套件
        EntityAggregateFixture testFixture = new EntityAggregateFixture(Sets.newHashSet(TestAggregate.class.getName()));
        
        // 2. 构建命令
        Message msg = MessageFactory.getCmdMsg("dst", "src", new TryUpdateRestCmd());
        
        // 3. Mock 聚合根请求
        RestTemplate mockBean = Mockito.mock(RestTemplate.class);
        doReturn(xxx).when(mockBean).getForEntity(...);
        
        // 4. 将 mock Bean 放入聚合根测试套件
        testFixture.mockBean(mockBean);
        
        // 5. 处理并断言
        testFixture = testFixture
                .when(msg) // 模拟处理
                .expectMessage(UpdateSuccessEvent.class) // 断言 Event
                .expectRetSuccessCode() // 断言结果是成功
                .printIdentify();  // 打印 msgID
    }
}
```


## 事务聚合根测试套件 \{#transaction-testkit\}

Phoenix 框架也提供了一个事务聚合根测试套件，与实体的基本相似，因为事务聚合根本身就是一个特殊的实体聚合根（精简了大部分特性，增加了事务特性）。

该套件允许用户在 Junit 框架中对事务聚合根进行分布式事务中（如SAGA）的编排者逻辑的测试。

使用事务聚合根测试套件的步骤和实体聚合根测试套件类似：

1. 初始化测试套件
2. 构建命令
3. 让测试套件处理命令
4. 断言处理结果
5. 断言聚合根状态

> 事务聚合根测试同样支持 Spring DI，但是没有实体聚合根的上下文，如 invoke、Timer
 

### 1. 基于事务聚合根的命令协调及事务聚合根状态 \{#transaction-example\}

以下图的事务为例，该事务通过命令创建，并串行化执行两个子事务。

![testfixture.png](../assets/phoenix-core/testfixture.png)

```java
public class UnitTests {

    @Test
    public void test(){
        // 1. 构建测试套件
        TransactionAggregateFixture testFixture = new TransactionAggregateFixture("aggregate.package");
        Message reqMsg = MessageFactory.getCmdMsg("local", "client", new TransactionStartCmd());
        
        // 2. 断言事务启动后, 只有一个子事务结果
        testFixture = testFixture.when(reqMsg).expectMessageSize(1);
        
        // 3. 断言第一个子事务的命令为 FirstSagaTiCmd 
        List<Message> outMsgList = testFixture.getOutMsgList();
        boolean allIsFirstTi = outMsgList.stream().allMatch(e-> e.getPayloadClassName().equals(FirstSagaTiCmd.class.getName()));
        Assert.assertTrue(allIsFirstTi);
        
        // 4. 模拟第一个子事务的 Event
        FirstSagaSuccessEvent okEvent = new FirstSagaSuccessEvent();
        Message firstSagaSuccessMsg = MessageFactory.getEventMsg(RetCode.SUCCESS, "", okEvent, outMsgList.get(0));
        
        // 5. 断言第二个子事务的命令
        testFixture =  testFixture
                .when(firstSagaSuccessMsg)
                .expectSingleMessageClass(SecondSagaTiCmd.class);
        
        // 6. 断言事务聚合根状态 (这里目前没有 lastAggregate 方法，只能遍历目前已测试的所有事务聚合根)
        // 维护一个 testFixture 一个事务聚合根，那么直接从 Map 里取出所有 value（size=1）就是该事务聚合根.     
        HashMap<String,TransactionAggregate> aggregates = testFixture.getAggregates();
    }
}

```

上面的案例中通过人工构造命令来模拟事务聚合根接收命令后状态机内部的变化，以及每次变化驱动事务聚合根发出的新命令（下一次的协调命令）。

对于事务聚合根内需要外部依赖的情况，使用和实体聚合根相同的`mockBean()`方法来实现对事务聚合根的隔离

### 2. 验证事务聚合根下的集成测试 \{#verify-transaction\}

无论是实体聚合根还是事务聚合根的测试套件，都只能关注自身的部分逻辑，然而分布式事务是（协调者 + 被执行者）共同完成的，但作为被执行者的实体聚合根发生改变时，
也有可能会导致事务聚合根的协调能力失效（如命令消息的 Schema 发生变化，导致无法识别，或者缺少某些没有初始值的属性）。

这种升级带来的缺陷无法通过独立的聚合根单元测试来尽早的识别出来，因此基于事务聚合根和实体聚合根两者测试套件的集成测试是非常有必要的。

下面仍然以上面的事务聚合根案例来举例说明集成测试的编写：

```java
public class IntegrationTests {
    
    @Test
    public void test(){
        // 1. 构建测试套件
        TransactionAggregateFixture transactionFixture = new TransactionAggregateFixture("transaction.package");
        EntityAggregateFixture entityFixture = new EntityAggregateFixture("entity.package");
        // 2. 构造事务启动命令
        Message reqMsg = MessageFactory.getCmdMsg("local", "client", new TransactionStartCmd());
        // 3. 断言事务启动结果，并取出命令
        transactionFixture = transactionFixture.when(reqMsg).expectMessageSize(1);
        List<Message> outMsgList = testFixture.getOutMsgList();
        Message firstCmdMsg = outMsgList.get(0);
        // 4. 模拟第一个子事务的执行
        entityFixture = entityFixture
                .when(firstCmdMsg)
                .expectMessage(FirstSagaSuccessEvent.class)
                .expectRetSuccessCode()
                .printIdentify();
        // 5. 获取实体聚合根处理结果
        FirstSagaSuccessEvent firstEvent = entityFixture.getLastOutMsg().getPayload();
        Message firstEventMsg = MessageFactory.getEventMsg(RetCode.SUCCESS, "", firstEvent, firstCmdMsg);
        // 6. 断言第二个子事务的命令
        transactionFixture = transactionFixture
                .when(firstEventMsg)
                .expectSingleMessageClass(SecondSagaTiCmd.class);
       // 7...其他验证
    }
}

```

## 注意事项 \{#tips\}

在使用Phoenix框架聚合根测试套件时，请注意，测试套件可以简化聚合根上下文，但您仍然需要了解聚合根的上下文，并确保测试代码正确处理上下文。

Phoenix 及聚合根测试套件屏蔽了聚合根实际上仍运行在共享的线程池中的物理事实，当聚合根内的操作发生阻塞，从而导致线程池饥饿及死锁等问题，可能无法通过基于聚合根测试套件的测试避免。

因此，用户应理解聚合根的运行上下文，从而编写出合理、可用性高的聚合根代码。
