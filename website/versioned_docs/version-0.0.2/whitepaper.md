---
id: version-0.0.2-whitepaper
title: phoenix 白皮书
sidebar_label: Example Page
original_id: whitepaper
---

# 背景

随着中国社会财富的迅速膨胀和资管新规的推出，资产管理行业出现了新的发展趋势。首先是一系列监管规则推出，推动资产管理回归本源，对于资产管理人的资产主动管理能力提升产生了强烈诉求。再者，客户特别是机构客户的认知和能力的提升，倒逼资产管理机构要提供更加专业的服务能力。第三，市场越来越充分的竞争，使得所有的资产管理机构都要往精细化管理方向转型。最后，以专户管理为标志的客户个性化、专业化服务的诉求使得管理人也面临创新压力。这些发展趋势，使得整个行业对新型的、高效的、更智能的资产管理系统平台的需求变得越来越迫切。

众所周知，资管系统所承载的业务复杂度极高，涉及到的模块广：组合、交易、头寸、风控、估值、归因、风险等等，覆盖的业务种类多：固收、权益、期货、衍生品、非标等等。这样的业务复杂性，需要系统做到模块化及模块间松耦合，保障模块彼此间不会有“腐败传导”，并且可进行独立升级、优化，通过重新排定组件来应对业务流程的快速改变需求。
当前的资管业务的发展趋势是往数量化、模型驱动型投资管理模式方向发展，要求业务系统在保持很好的操作型能力的同时，还要进行大量的分析计算，这就要求资管系统逐步转型为以分析管理型能力为主的系统。而且，交互型系统需要更加好地符合业务快速响应的能力，强调用户体验和交互的逻辑性，部署和迭代更新足够快，要求这类型系统能够尽可能多地围绕客户体验和场景来打造。

以上这些资管行业的发展与新一代资管系统的发展特点，都要求配套的技术体系建设从设计思想、架构设计、实现技术等方面都要有新的突破，尤其是系统架构和底层基础平台方面，需要做重新的设计。本发明是一种高性能应用开发框架，正是基于此产生。

目前，行业普遍使用基于数据库和存储过程等技术来开发资管系统，支持业务的发展。这些系统其特点是偏操作型，注重流程的处理，所采用的单体化架构，技术相对老旧，功能模块采用紧耦合，导致其开发模式很重，变更交付周期长，无法适应现代资管行业的各种业务创新多、客户需求响应快、分析计算量大等需求，后期架构虽然有所优化，但是没有发生根本性的变化，依然存在有一些缺点，比如在扩展性、可用性、性能瓶颈的解决方案上，都有明显的弱点。

所以，以新架构、新技术、新模式打造新一代资管系统，变得极其迫切。同时，行业机构都开始大力发展金融科技能力，自主研发成为IT战略的核心建设内容之一。如何利用成熟技术解决自主研发能力和有限资源的问题，也是一个亟待解决的新课题。

# 介绍

Phoenix是宽拓自主研发的一款事件驱动型的高性能Java开发框架，专注于降低金融行业中业务复杂性高、性能要求高的应用系统的开发难度，助力研发团队打造专业、高效的微服务化的金融应用系统。Phoenix框架封装了复杂的底层技术，提供强大的内存保护机制，为应用提供极高的稳定性、基于内存的高性能的计算能力和动态伸缩扩展的能力，匹配当前和未来金融领域海量数据实时分析的强烈算力需求。同时，针对行业技术架构往微服务迁移的发展趋势，针对微服务架构使用的核心挑战，框架提供了分布式事务处理引擎，满足金融领域微服务应用间的业务完整性、数据一致性的要求。Phoenix还提供了强大的实时监控和在线管理功能，为系统高效智能运维提供了基础。配套的事件管理工具，大大方便了应用开发人员开发事件驱动型的微服务，提高业务处理流程的灵活度。搭配DevOps工具，提升了研发的持续集成和交付能力。

# 特点

**高性能**
 - 无锁
 - 事件驱动
 - 高并发
 - In-Memory（EventSourcing/快照）
 - 读写分离（CQRS)
 - 多活、支持动态横向扩展

**运维管理**
 - 提供运维管理平台
 - 实时的性能监控（插件）
 - 实时的业务指标监控（插件）

**微服务**

**分布式事务支持（SAGA)**

# 整体结构

 - 基于事件驱动架构，客户端和业务服务之间、以及业务服务之间采用MQ进行通讯，如下图橙色MQ部分
 - 客户端跟服务端调用， 框架封装支持同步调用和异步调用方式
 - 每个Phoenix服务定为为微服务，支持独立存储（事件存储），如下图青色部分所示
 - Phoenix提供可选的插件服务，支持无入侵性动态添加，如图紫色部分所示
   - phoenix-persist插件服务，负责上报事件到EleasticSearch，结合grafna做实时监控
   - phoenix-monitor插件服务，支持基准性能测试功能及实时性能指标统计
 - 基于MQ，支持用户开发自定义的插件服务
 - phoenix-admin是phoenix服务的统一运维管理平台
 - phoenix-admin通过每个应用内的注册中心，发现应用内的每个服务，进行管理
 
![](./../../img/whitepage/1.png)

# 编程模式

## 概念介绍

基于CQRS、SAGA理论指导，自研了一套编程模式。 首先介绍下概念：
 - Command：由Phoenix服务方定义，表示请求的入参
 - Event：由Phoenix服务定义，表示服务内已发生的事实
 - Phoenix服务：采用Phoenix框架开发。 支持定义聚合根对象，处理业务逻辑。支持定义Saga协调者对象，协调多个服务共同完成一个事务；采用EventSouring来恢复内存状态
 - 	Aggregate：聚合根对象， DDD中聚合概念，收Command请求，产生Event对象，Event驱动内存状态发生变化； Phoenix中调度和并发的最小单位
 - 	Saga：负责分布式事务协调，接收Event，产生Command，协调多个聚合对象一起完成一个事务。Phoenix中调度和并发的最小单位

## 案例列举

以简单的转账业务为例子

### 业务场景

实际银行业务还是比较复杂的，为方便理解，我们简化业务场景如下（无跨银行转账业务、只描述单个银行内部账户转账业务、转入账户一定成功的场景）

 - 每个账户初始化1000元
 - 支持账户A转账户B指定金额
 - 支持查看系统内所有账户的金额汇总
  
基于上述功能描述，不管系统运行多久，运行多少转账记录，一个永恒正确的公式： sum(账户余额) = 账户数量 * 1000

### 统一语言

基于上述业务场景的不断讨论，最终在本案例里面，我们得出如下统一术语

 - 银行账户：此案例里面提到的具有转入或转出金额的账户， 下文中可简称账户
 - 账户余额：账面上的钱
 - 银行总账：银行里面所有账户的总额

### 业务逻辑

针对案例的核心转账功能，基于Saga模式事务设计
转账成功场景分为两个小事务，先后顺序如下：

 1. 对转出账户，判断账户可用=账户余额-转出金额大于等于0，减少账户余额
 2. 对转入账户，增加账户余额（转入操作框架幂等，事务管理器不断重试保证一定成功）

转账失败场景比较简单：判断，账户可用=账户余额-转出金额大于等于0，返回可用不足，转账失败。

### 聚合根定义

(此处容易理解，省略推导过程)

 - BankAcountAggregate（银行账户聚合根）：负责单个账户的账户余额数值计算
 - BankTransferSaga（银行转账事务）：负责定义银行转账事务

### 消息定义

BankAcountAggregate消息定义如下：

 - TransferOutCmd：账户转出命令
 - TransferOutOkEvent：账户转出成功事件
 - TransferOutFailEvent：账户转出失败事件
 - TransferInCmd：账户转入命令
 - TransferInOkEvent：账户转入成功事件

转账事务编排如下

![](./../../img/whitepage/2.png)
 
消息流转示意图

![](./../../img/whitepage/3.png)

### 架构设计

#### UI

 - 查询单个账户余额、账户冻结、账户可用
 - 可以查询银行总账
 - 发起转账

#### 银行账户服务

 - 提供单个账户余额、账户冻结金额接口
 - 提供银行间总账查询接口
 - 提供发起转账接口

#### DB

 - 事件存储
 - 事务上下文存储

#### MQ

 - 消息通讯

![](./../../img/whitepage/4.png)

### 核心代码

BankAccountAggreate类：

```java
@AggregateClsDefinition
@Getter
@Setter
public class BankAccountAggregate implements Serializable {
    // 核心业务数据j
    private String account;           // 账户代码
    private double balanceAmt;        // 账户余额

    // 辅助统计数据
    private int sucessTransferOut;    // 成功转出次数
    private int failTransferOut;      // 失败转出次数
    private int sucessTransferIn;     // 成功转入次数

    public BankAccountAggregate() {
        this.balanceAmt = 1000;
    }

    /**
     * inAccountCode收到转入一笔钱, 增加账户余额
     */
    @AggregateDefinition(aggregateId = "inAccountCode")
    public Object act(TransferInCmd cmd) {
        return new TransferInOkEvent(
                cmd.getOutAccountCode(),
                cmd.getInAccountCode(),
                cmd.getAmt()
        );
    }
    public void on(TransferInOkEvent event) {
        account = event.getInAccountCode();
        balanceAmt += event.getAmt();
        sucessTransferIn++;
    }

    /**
     * outAccountCode收到转出钱请求（inAccountCode已收到钱）
     * 扣减账户冻结且扣减账户余额
     */
    @AggregateDefinition(aggregateId = "outAccountCode")
    public Object act(TransferOutCmd cmd) {
        if (lt(balanceAmt, cmd.getAmt())) {
            return new TransferOutFailEvent(
                    cmd.getOutAccountCode(),
                    cmd.getInAccountCode(),
                    cmd.getAmt(),
                    String.format("扣减账户且扣减账户余额出现异常无法, 账户余额:%f, 当前金额：%f",
                            balanceAmt, cmd.getAmt())
            );
        } else {
            return new TransferOutOkEvent(
                    cmd.getOutAccountCode(),
                    cmd.getInAccountCode(),
                    cmd.getAmt()
            );
        }
    }
    public void on(TransferOutOkEvent event) {
        balanceAmt -= event.getAmt();
        sucessTransferOut++;
    }
    public void on(TransferOutFailEvent event) {
        failTransferOut++;
    }

    private boolean lt(double a, double b) {
        return  a - b < 0;
    }
}
```

BankTransferSaga类：

```java
@SagaAggregateDefinition(
        rootCmdClass = TransferOutCmd.class,
        endEventClasses = {TransferInOkEvent.class, TransferOutFailEvent.class}
)
public class BankTransferSaga implements Serializable {
    private int retCode;            // 事务返回结果值
    private String result = "";     // 事务返回内容

    /**
     * outAccountCode转出成功,发起转入
     */
    public Object on(TransferOutOkEvent event) {
        retCode = 0;
        return new TransferInCmd(
                event.getOutAccountCode(),
                event.getInAccountCode(),
                event.getAmt()
        );
    }

    /**
     * outAccountCode转出失败,返回null,返回结果
     */
    public Object on(TransferOutFailEvent event) {
        retCode = 1;
        result = event.getResult();
        return null;
    }

    public String onFinished() {
        return JSONObject.toJSONString(new SagaResult(retCode, result));
    }
}
```

### 运行时分析

Phoenix服务属于有状态服务，所以理解数据是怎么分布的，对理解程序运行很有帮助， 如下图，举例说明了运行时数据的分布：

![](./../../img/whitepage/5.png)

以账户1 转 账户2 50元为例子，看整个调用过程，如下：
其中，转账协调者服务到银行账户服务间通过内部通讯层MQ，下图中采用简化画法示意

![](./../../img/whitepage/6.png)

# 高性能

## In-Memory

对比基于数据库实现， 服务收到Command请求后， 数据都在内存里，计算逻辑基于内存，仅存在一次Append Event到EventStore的的IO操作。

## 聚合对象间并发

引入DDD设计聚合对象，聚合对象间无依赖，各自可独立并发运行

## 单线程

单个聚合对象采用单线程无锁处理，有效的避免了多线程中锁的问题。

## 消息通讯

基于Actor模型，采用消息通讯， 异步无阻塞

# 高可用

服务支持多实例部署，属于多活模式
当其中一个实例crash后， 在该实例中的聚合对象的Command请求会路由到其他存活的实例。 然后通过EventSourcing机制，可以快速恢复该聚合对象，继续处理请求。

# 伸缩性

系统的伸缩性，一般分为横向和纵向， 横向可以伸缩性可以通过添加更多的服务器实现， 纵向通过升级单机核心处理器数量或核心处理器性能。

对于横向伸缩，一般需要在软件层次支持，phoenix中得益于聚合根位置透明性设计，开发无须关于聚合根运行在哪台机器节点，运行中支持动态伸缩节点， 框架会自动重新调度聚合根分布。

如下图示意，两个节点运行时：

![](./../../img/whitepage/7.png)
    
动态扩展到三个节点，shard3和shard6会在框架的负载均衡调度算法上，调度到新的节点Node3。

![](./../../img/whitepage/8.png)
 

# 存储扩展

支持mysql、oracle、TiDB
mysql、oracle类的支持分库模式扩展存储性能
TiDB，本身支持动态添加节点扩展存储性能

# 易用性

## 编程模型

借助DDD的理念和实践，phoenix采用统一聚合根的模型，系统更具有一致性。

基于聚合根的概念，可以非常自然地直接对应到业务实体。某聚合根的一个实例可以是一个人，一个物品、异步设备，等等。这些聚合根通过接受命令，来驱动完成一次状态的变化。

单个聚合根内单线程处理，聚合根之间并行计算，这种思想大大简化了并行程序的开发工作，使得业务开发人员无须考虑多线程下的各种复杂技术问题（死锁、互斥、不确定行为等），大幅度提高业务代码的安全性和速度。

采用聚合根，可以很好的解耦应用程序内部的耦合性，从而可以更好的应对需求的变化。

模型及架构与领域的自然对应大大降低了系统进化和维护的成本。

phoenix封装并解决了高可用、EventSourcing、持久化等技术上的复杂度，让业务开发人员更聚焦业务本身。

# 管理平台
支持管理多个应用

![](./../../img/whitepage/9.png)

服务监控，直观查看服务整体健康状态

![](./../../img/whitepage/10.png)
 
内存查看/修改，针对Phoenix In-memory特性，提供内存直接查看和修改功能

![](./../../img/whitepage/11.png)
 
# 实时监控
自定义可配业务指标监控

![](./../../img/whitepage/12.png)

性能调优监控

![](./../../img/whitepage/13.png)
 




