---
id: phoenix-glossary
title: Phoenix概念
---



### *<font color="#444">Command / Cmd / 命令</font>* \{#command\}
Command 是所有向聚合根发送指令，请求执行方法的事件的统称，用以代替进程内的方法调用。Command 是请求，因此可能会失败。Command 可以来自服务内部，也可以来自外部系统。

### *<font color="#444">Event</font>* \{#event\}
Event 表示聚合根状态发生改变的不可变事实。当聚合根接受 Command 在处理完成生成 Event。Event 只能由聚合根生成，并被附加存储 EventStore。

### *<font color="#444">Aggregate / 聚合</font>* \{#aggregate\}

聚合就是一组相关对象的集合，把聚合作为数据修改的单元。外部对象只能引用聚合根中的一个成员，我们将其称为聚合根(AggregateRoot)。

### *<font color="#444">State / 状态</font>* \{#state\}
状态就是存储当前聚合根实例中一系列值的对象。聚合根对象通常将状态保存在内存中。

### *<font color="#444">Snapshot / 快照</font>* \{#snapshot\}

快照记录了聚合根实体的当前状态，Phoenix 会定期保留聚合根状态的快照。当聚合根从事件日志中重新加载时，使用快照可以加速溯源，只需溯源快照之后发生的事件。

### *<font color="#444">Event Store</font>* \{#event-store\}

Event Store 是事件的持久化存储，部分文档中会使用事件日志来表示 Event Store，它们是同一概念。

### *<font color="#444">Replay / 回溯 / 重播</font>* \{#replay\}

聚合根对象重新加载 EventStore 中存储该聚合根发生的所有事件，以实现聚合根状态的恢复。

### *<font color="#444">Transaction / 事务</font>* \{#transaction\}
在计算机中，事务指的是单个不可分割的操作。每个事务都必须作为一个完整的单元以成功或失败结束，事务永远不可能部分完成。

### *<font color="#444">Cluster / 集群</font>* \{#cluster\}

集群是一组松散或紧密连接在一起工作的计算机。由于这些计算机协同工作，在许多方面它们可以被视为单个系统。集群将每个节点设置为执行相同的任务，由软件控制和调度。

### *<font color="#444">Distributed / 分布式</font>* \{#distributed\}

分布式是一组电脑，透过网络相互连接传递消息与通信后并协调它们的行为，组件之间彼此进行交互以实现一个共同的目标。例如：把需要进行大量计算的工程数据分割成小块，由多台计算机分别计算，再上传运算结果后，将结果统一合并得出数据结论的科学。

### *<font color="#444">DDD / 领域驱动设计</font>* \{#ddd\}

领域驱动设计是一种软件设计哲学，侧重于倾听领域专家的意见并将软件构建为其领域的模型。

### *<font color="#444">Saga</font>* \{#saga\}

Saga 也称 Long-running Transaction（长时事务），它避免锁定非本地资源，通过补偿来处理失败，潜在地聚合较小的 ACID 事务，通常使用协调器来完成或者中止事务。与 ACID 事务中的回滚相反，补偿会恢复原始状态或者等效状态，并且特定于业务。 Saga 是实现分布式事务的一种设计模式。

### *<font color="#444">Append</font>* \{#append\}

Append 指的是附加，在文档中常常与 append-only、append store、附加存储等形式存储。在 Phoenix 中，Append 指的是只进行插入形式的持久化。


