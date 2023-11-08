---
id: phoenix-core-event-souring
title: 事件溯源
description: 聚合根的持久化方式
---

事件溯源(EventSourcing) 技术使用只可追加的存储来记录对数据所进行的所有操作，而不是存储领域数据的当前状态。该存储作为记录系统可用于实现领域对象。通过避免数据模型与业务领域之间的同步，该模式简化了复杂领域下的工作，同时改善了性能、可扩展性和响应能力。还能够提供事务数据一致性，并维护了全部的审计记录与历史，可用于修正操作。

有了Phoenix框架，您可以用最少的代码实现事件溯源，让您不费吹灰之力就能获得事件溯源的好处。

## 背景问题 \{#background\}

大部分应用都需要和数据打交道，典型的方法是由应用维护数据的当前状态，在用户使用时对数据进行更新。例如，在传统的增删改查（CRUD）模型下，典型的数据处理过程是，从数据库中读取该数据，做一些修改后再用新值去更新数据的当前状态——通常会使用带锁的事务。

CRUD 方法的一些局限性：

* CRUD 系统在数据库上直接执行更新操作，由于需要开销，会降低系统的性能与响应能力，限制了可扩展性。
* 在一个由多个用户并发操作的领域中，数据更新更有可能会起冲突，因为更新操作发生在同一条单独的数据项上。
* 除非在某个单独的日志中存在额外的审计机制来记录每个操作的细节，否则历史记录会丢失。

## 解决方案 \{#solution\}
事件溯源模式定义对一系列事件驱动（每个事件记录追加存储）的数据进行处理操作的方法。 应用程序代码以命令(Command)描述每个数据操作的一系列事件发送到事件存储，这些事件在其中是持久化的。 每个事件表示对数据所作的一系列更改（例如 AddedItemToOrder）。

事件在事件存储中持久化，事件存储充当数据当前状态的记录系统（权威数据源）。 事件存储通常会发布这些事件，使用者可收到通知并在需要时对其进行处理。 例如，使用者可启动将事件中的操作应用到其他系统的任务，或者执行完成此操作所需的任何关联操作。 请注意，生成事件的应用程序代码从订阅到事件的系统中分离。

事件存储发布的典型用途是在应用程序中的操作更改实体时保持实体的具体化视图以及用于与外部系统集成。 例如，系统可保持用于填充 UI 各部分的所有客户订单的具体化视图。 应用程序添加新的订单、添加或删除订单中的项和添加发货信息时，可处理描述这些更改的事件以及使用这些事件来更新具体化视图。

此外，应用程序可随时读取事件历史记录，并通过播放和使用所有与实体相关的事件，使用事件历史记录来具体化实体的当前状态。 可根据需要，在处理请求时或通过计划任务具体化域对象，将实体状态保存为具体化视图以支持演示层。

事件溯源模式具有以下优点:

1. 方便进行溯源与历史重现: 我们通过对保存的事件进行分析，知道现在系统的状态，是如何一步一步转变的，这在一个大型的业务复杂的应用系统里尤为有用。 此外，还可以根据历史事件，重新构建业务状态。甚至可以指定要构建到的某一具体时刻。
2. 方便Bug的修复: 当发现一个Bug后，我们可以在修复完后，直接重新聚合修复业务数据。如果使用传统的设计方法，就需要通过SQL或脚本去手动修改数据库。
3. 提供很好的性能: EventSourcing模式下，事件的保存是一个新增的写表操作，没有更新。这可以提供一个非常好的写性能。
4. 方便使用数据分析等系统: 使用了EventSourcing模式，数据就是事件，只需要在现有的事件上加上需要处理的方法，来做分析；或者直接将事件发送到某个分析系统

当然，它也有一些缺点：

1. 开发思维的转变: 最大的难点，就是对开发人员的思维方式的转变。使用EventSourcing，需要我们从设计的角度，使用一定的领域驱动设计的方法，从开发角度，我们需要基于事件的响应式编程思维
2. 事件的结构的改变: 由于业务的变化，我们设计的事件，在结构上可能也会有变化，可能需要添加一些数据，或者删除一些数据。那么这个时候进行重建状态就会有问题。这是需要通过某种方式提供兼容。
3. 从领域模型上设计系统，而不是以数据库表为基础设计


## 使用场景 \{#scene\}
使用EventSourcing有它的优点也有缺点，那么什么时候使用EventSourcing呢？

1. 首先是系统类型，如果系统中有大量的增删改查类型的业务，那么就不适合使用EventSourcing模式。EventSourcing模式比较适用于有复杂业务的应用系统。
2. 如果团队里面有领域驱动设计相关的人员，那么应该优先考虑使用EventSourcing。
3. 如果业务数据产生的过程比结果更重要，或者说更有意义，那就应该使用EventSourcing。你可以使用EventSourcing的事件数据来分析数据产生的过程，解决Bug，也可以用来分析用户的行为。
4. 如果需要系统提供业务状态的历史版本，例如一个内容管理系统，如果想针对内容实现版本管理，版本回退等操作，那就应该使用EventSourcing。
## 代码示例 \{#example\}
phoenix当中可以很方便的使用事件溯源模式，设置@CommandHandler中的isCommandSourcing为false（默认false），在act方法中返回事件，并在on方法中更改状态。

```java

@CommandHandler(aggregateRootId = "accountCode", isCommandSourcing = false)
public ActReturn act(AccountCreateCmd createCmd) {
    return ActReturn.builder().retCode(RetCode.SUCCESS).retMessage(message)
            .event(new AccountCreateEvent(createCmd.getAccountCode(), createCmd.getBalanceAmt())).build();
}

public void on(AccountCreateEvent event) {
    this.account = event.getAccountCode();
    this.balanceAmt = event.getBalanceAmt();
}


```


## 命令溯源 \{#command-sourcing\}

命令溯源(CommandSourcing)对比事件溯源(EventSourcing)最大的不同的是一个是事件驱动状态变化，而另一个是命令驱动状态的变化。 事件是系统发生的事实，而命令是向系统发出的请求。

命令溯源依赖确定性来保证状态的正确性，CommandSourcing的正确性条件是函数`State->Command->Event`的确定性。这就是CommandSourcing和EventSourcing的区别之一，程序可以控制输出，但是不能控制输入。由于不能控制输入，即命令，无法使上述函数具有确定性。这样做的结果是，不能在任意时间构建记录的命令流，并且希望得到与立即处理命令相同的输出。另外一个区别是，ES函数用于重构构建状态，而CommandSourcing函数用于对传入的命令做出反应。

### 使用场景 \{#command-sourcing-useage\}

#### 外部系统 \{#extenal\}

因为CommandSourcing会重新响应命令，所以会对外部系统产生副作用，编码中需要考虑这种情况。而ES重建状态的方法仅适用于内部状态，不会产生外部副作用。

#### 纠正逻辑错误 \{#fix\}

对于ES来说，事件已经发生，并且无法返回更改它。但是这点对于CommandSourcing来说恰好被解决了，CommandSourcing会对命令重新响应，能够对逻辑错误的代码重新计算，得出正确的状态与事件。

#### 代码变更 \{#diff\}

当业务代码会受到外部因素影响时，比如当前时间，当前税率等，CommandSourcing就无法构建出当时的状态，因为当前的外部因素发生了改变。所以当需要使用CommandSourcing时，但是业务受到外部因素的影响时，可以使用`EntityAggregateContext`保存当前上下文。

### 代码示例 \{#command-sourcing-example\}

修改 `@CommandHandler` 中的 `isCommandSourcing` 为true（默认false），并且在act中修改状态。

```java
@CommandHandler(aggregateRootId = "accountCode", isCommandSourcing = true)
public ActReturn act(AccountCreateCmd createCmd) {
    this.account = createCmd.getAccountCode();
    this.balanceAmt = createCmd.getBalanceAmt();
    // 如果event需要持久化，那么这里的event还是要定义的。如果不需要持久化，那么event需要随便设置一个值
    return ActReturn.builder().retCode(RetCode.SUCCESS).event("event").build();
}
```

针对环境因素问题，Phoenix框架提供了EntityAggregateContext。当CommandSourcing重建状态时，可以通过EntityAggregateContext获取到当时的上下文状态。当是ES时，EntityAggregateContext即使设置了也不生效。

```java
Map<String, Object> context = EntityAggregateContext.getContext();
```

## 参考 \{#reference\}
- [事件溯源模式](https://iambowen.gitbooks.io/cloud-design-pattern/content/patterns/event-sourcing.html)