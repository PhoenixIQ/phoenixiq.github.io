---
id: aggregate-segment
title: 聚合根片段代码
description: 支持将聚合根代码拆分到多个类的能力
---

## 介绍 \{#introduce\}

聚合根很好地组织关联的实体和值对象，形成一个相对独立的业务领域，让用户写出来的代码相对内聚。

但随着业务不断深入以及随着时间的推移，业务规模和复杂度也可能增长，所以越来越多的实体和值对象需要和聚合关联，并在最终导致聚合根的代码体积越来越庞大。

在不拆分聚合的情况下，阅读一个聚合根的业务逻辑十分复杂。因此 Phoenix 提供了能够拆分聚合根代码并同时保持内聚的特性：**聚合根片段代码特性**

:::info[注意]

需要注意的是，Phoenix 只支持一个命令只能被一个聚合根处理, 如果某个 SubAggregate 想要被多个不同类型聚合根共享，请使用对象组合 + 委派模式（Delegation Pattern）而不是本文的特性。

:::

聚合根片段代码能够保持聚合根原有业务逻辑不变，并且在代码的组成方式上，支持将*命令处理器*的方法写到关联的类中（成员、父类、接口）：

1. 配置 `quantex.phoenix.server.method-lookup-strategy-class-name` 也就是聚合根扫描策略为 `com.iquantex.phoenix.server.aggregate.cls.SegmentAggregateRelatedStrategy`（默认已配置此实现） 或其他自定义实现
2. 在聚合根中，按 1 提供的策略类支持的方式组合一个聚合根类（默认情况下，支持成员、父类、接口）
3. 在片段代码的类头部增加 `@AggregateSegment` 注解
4. （可选）在需要被递归扫描的成员上使用 `@Inject` 注解标识

:::tip[提示]
如果用户觉得 @Inject 的方式太过于繁琐, 也可以在 `quantex.phoenix.server.method-lookup-strategy-class-name` 实现自己的片段代码扫描特性, 只需要实现 `com.iquantex.phoenix.server.aggregate.cls.AggregateRelatedStrategy` 并返回需要扫描的类即可, Phoenix 会检索并过滤不包含 `@AggregateSegment` 的类.
:::

:::warning

注意，事务聚合根处理时会使用序列化深拷贝一个副本用于 "try" 执行用户代码，因此当使用业务对象组合、片段代码等特性时，需要特别注意一些对象的序列化。

:::

## Spring 支持 \{#spring\}

使用片段代码特性的聚合根片段支持 Spring 的依赖注入，并且在聚合根单元测试中也支持了 Mock 一个 Bean 的能力。

:::info[提示]

目前 Phoenix 的依赖注入需要使用注解 @Inject 标识成员，并且支持多层嵌套. 如:

```java
public class Parent {
    @Inject private ChildrenSegment businessObj;
}
public class ChildrenSegment {
    @Inject private GrandChildSegment businessObj;
}
public class GrandChildSegment {
    @Autowired private MockService service;
}

```
:::

:::danger[性能提示]

除了初始化的依赖注入外，片段代码还需要在每次执行时找到正确的对象来执行方法。（用户需注意到这可能 是一个隐含的性能风险，并避免使用太深层级的片段代码对象）

:::

下面是聚合根依赖注入的正确示例：

```java
@EntityAggregateAnnotation(aggregateRootType = "test")
public class Parent implements Serializable {

    /** 这里不序列化该类, 转而使用 Phoenix 的自选快照存储数据, 实际使用时按需实现 */
    @Inject private transient ChildrenSegment businessObj;
}


@AggregateSegment
public class ChildrenSegment {

    /** Bean 和 配置都支持注入 */
    @Autowired private MockService mockService;

    @Value("${some.spring.properties}")
    private String propertiesValue;

    @CommandHandler(aggregateRootId = "id")
    public ActReturn act(Boolean cmd) {
        return ActReturn.builder().build();
    }
}
```


## 使用说明 \{#usage\}

:::info[提示]

SegmentAggregateRelatedStrategy 不会重复扫描同一个类, 且不会扫描成员的接口, 只有被 `@Inject` 的成员及其也被 `@Inject` 的成员才会被扫描, 未被 `@Inject` 标识的成员并不会被扫描.

:::

下面的代码中 `Parent` 聚合根同时拥有 `ImplementationSegmentA`,`ImplementationSegmentB`,`InheritanceSegment`,`CompositionSubOneSegment`,`CompositionSubTwoSegment`,`CompositionSubTwoSubSegment` 的 act()、on() 方法, 示例代码如下：


```java
import java.io.Serializable;

@EntityAggregateAnnotation(aggregateRootType = "test")
public static class Parent extends InheritanceSegment
        implements ImplementationSegmentA, ImplementationSegmentB {

    @Inject private CompositionSubOneSegment subOneAggregate;
    @Inject private CompositionSubTwoSegment subTwoAggregate;
    // 不会被扫描, 该类不是片段代码.
    @Inject private CompositionSubThreeSegment subThreeAggregate;
    private String notnull;
}

// ========= 接口
@AggregateSegment
public interface ImplementationSegmentA {

    @CommandHandler(aggregateRootId = "id")
    default ActReturn act(Boolean cmd) {
        return ActReturn.builder().build();
    }
}

@AggregateSegment
public interface ImplementationSegmentB {

    @CommandHandler(aggregateRootId = "id")
    default ActReturn act(Short cmd) {
        return ActReturn.builder().build();
    }
}


// ========== 继承
@AggregateSegment
public static class InheritanceSegment {

    @CommandHandler(aggregateRootId = "id")
    public ActReturn act(String cmd) {
        return ActReturn.builder().build();
    }
}

// ========= 下级（成员）聚合根, Three 不会被扫描.
@AggregateSegment
public static class CompositionSubOneSegment {

    // 该类不会被扫描.
    private CompositionSubOneSubSegment subOneSubAggregate;

    @QueryHandler(aggregateRootId = "id")
    public ActReturn act(Integer cmd) {
        return ActReturn.builder().build();
    }
}

@AggregateSegment
public static class CompositionSubTwoSegment {

    @Inject private CompositionSubTwoSubSegment subTwoSubAggregate;

    @QueryHandler(aggregateRootId = "id")
    public ActReturn act(Long cmd) {
        return ActReturn.builder().build();
    }
}

public static class CompositionSubThreeSegment {

    @QueryHandler(aggregateRootId = "id")
    public ActReturn act(Character cmd) {
        return ActReturn.builder().build();
    }
}

// ========= 下级的下级(只有 Two 会被扫描）
@AggregateSegment
public static class CompositionSubOneSubSegment {

    @QueryHandler(aggregateRootId = "id")
    public ActReturn act(Byte cmd) {
        return ActReturn.builder().build();
    }
}

@AggregateSegment
public static class CompositionSubTwoSubSegment {

    @QueryHandler(aggregateRootId = "id")
    public ActReturn act(BigInteger cmd) {
        return ActReturn.builder().build();
    }
}
```
