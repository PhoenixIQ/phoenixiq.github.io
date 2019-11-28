---
title: Phoenix2.0 分布式事务设计
author: wenchang.lan
authorImageURL: https://gitlab.iquantex.com/uploads/-/system/user/avatar/2/avatar.png
---

## 支持并发事务


当前的事务设计上，只支持串行处理，不支持同时对下游多个服务发起调用，存在一定效率问题。

## 支持异常 Event 处理


当前事务设计上，当下游服务抛了一个异常事件的时候，事务就会变成未完成事务，只能人工介入处理。 实际上有些场景事务是可以自动向后恢复的， 例如：如果发起两个 saga 子事务，一个成功，一个异常，那么框架是可以自动补偿掉成功的子事务。

<!--truncate-->

## 补偿写法不够友好

当前事务设计上，对于补偿也需要人工编排和编写对应代码。 还是上面那个例子， 如果发起两个 saga 子事务，一个成功，一个异常，框架是可以自动识别事务需要进入补偿，调用成功子事务的补偿操作。用户只需要告诉框架正常子事务请求和对应的补偿请求的参数， 无需关心补偿的发起，大大提升开发效率。

## TCC 支持


当前事务采用的是 Saga 分布式，存在一起一致性要求更高的场景，可能会用到 TCC。 场景待补充：

## 事务超时机制 & 人工操作恢复策略


当下游服务调用没有结果反馈，事务会进行重试，那么不可能一直重试，于是需要添加一个超时退出机制。 事务退出后，人工接入判断， 提供向前恢复或向后恢复的能力，具体能使用哪种恢复，需要根据场景判断，比如有些是不能向后恢复的（无补偿操作）。

## 事务数据结构设计

*   一个事务包含多个子事务
*   子事务支持 Saga 模式和 TCC 模式
*   Saga 子事务含两个操作：TiCmd 和 CiCmd（正常请求和补偿请求）
*   Tcc 子事务含三个操作：TryCmd，ConfirmCmd，CancelCmd
*   对应子事务的每个请求，服务方需要在返回 Event 中告知结果是属于成功、失败、异常； 其中成功的操作在事务向后恢复的时候，需要进行补偿或取消。(在 Message 中添加 retCode 定义）

          ![](https://portal.iquantex.com/confluence/download/attachments/39288861/image2019-11-18_12-16-18.png?version=1&modificationDate=1574050599000&api=v2)

状态设计
----

*   状态管理分为两层， 第一层层是事务状态， 第二层是子事务状态。所有的子事务状态决定事务状态

### 第一层事务状态设计

![](https://portal.iquantex.com/confluence/download/attachments/39288861/image2019-11-18_12-16-42.png?version=1&modificationDate=1574050624000&api=v2)

### 第二层 Saga 子事务状态设计

![](https://portal.iquantex.com/confluence/download/attachments/39288861/image2019-11-18_12-17-25.png?version=1&modificationDate=1574050666000&api=v2)

### 第二层 Tcc 子事务状态设计

![](https://portal.iquantex.com/confluence/download/attachments/39288861/image2019-11-18_12-17-53.png?version=1&modificationDate=1574050695000&api=v2)

*   事务拥有状态，本质上也是一个聚合根，定义为事务聚合根
*   事务聚合根采用 EventStore 机制进行存储， 恢复采用 EventSourcing
*   事务的聚合根 ID 为事务 ID：transId， 状态数据包含： 用户定义的事务类， 子事务操作，事务状态，子事务状态
*   事务的 Event 设计，根据状态推演，我们需要存储的事件应该包含内容： 收到的 request、event、产生的 Cmd.

举例说明事务的 EventStore 和事务状态之间关系

![](https://portal.iquantex.com/confluence/download/attachments/39288861/image2019-11-18_13-20-19.png?version=1&modificationDate=1574054441000&api=v2)

Saga 类事务

```
@TransactionClsAggregateDefinition(rootCmdClass = Request.class)
public class TransactionClass implements Serializable {
    public Object on(Request request) {
        return Arrays.asList(
                new SagaAction(
                        new TiCmd1(),
                        new CiCmd1()
                ),
                new SagaAction(
                        new TiCmd2(),
                        new CiCmd2()
                )
        );
    }

    public void on(TiFailEvent1 event) {
        remark = remark + event.getRemark() + ";";
    }

    public void on(TiFailEvent2 event) {
        remark = remark + event.getRemark() + ";";
    }

    public void on(ExceptionEvent event) {
        remark = remark + event.getErrMsg() + ";";
    }

    String remark = "";
    public Object onFinish() {
        return new Response(remark);
    }
}

```

TCC 类事务

```
@TransactionClsAggregateDefinition(rootCmdClass = Request.class)
public class TransactionClass implements Serializable {
    public Object on(Request request) {
        return Arrays.asList(
                new TccAction(
                        new TryCmd1(),
                        new ConfirmCmd1(),
						new ConcelCmd1(),
                )
        );
    }

    public void on(TryFailEvent1 event) {
        remark = remark + event.getRemark() + ";";
    }      

    public void on(TryFailEvent2 event) {
        remark = remark + event.getRemark() + ";";
    }

    public void on(ExceptionEvent event) {
        remark = remark + event.getErrMsg() + ";";
    }

    String remark = "";
    public Object onFinish() {
        return new Response(remark);
    }
}

```

Tcc 和 Saga 混合事务

```
@TransactionClsAggregateDefinition(rootCmdClass = Request.class)
public class TransactionClass implements Serializable {
    public Object on(Request request) {
        return Arrays.asList(
                new TccAction(
                        new TryCmd(),
                        new ConfirmCmd(),
						new ConcelCmd(),
                )
        );
    }

	public void on(TryOkEvent event) {
		return Arrays.asList(
				new SagaAction(
                        new TiCmd(),
                        new CiCmd()
                )
        );
    }          

    public void on(TryFailEvent event) {
        remark = remark + event.getRemark() + ";";
    }

    public void on(TiFailEvent event) {
        remark = remark + event.getRemark() + ";";
    }

    public void on(ExceptionEvent event) {
        remark = remark + event.getErrMsg() + ";";
    }

    String remark = "";
    public Object onFinish() {
        return new Response(remark);
    }
}

```