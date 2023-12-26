---
id: extension
title: Phoenix 扩展
description: 用于扩展 Phoenix Framework 的能力
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 简介 \{#introduce\}

Phoenix 提供了一种"扩展"的特性，该功能一般作为 Phoenix 和 Spring 的桥梁，也可以作为类似于 Spring Runner 的方式而存在.

## 应用场景  \{#use-case\}

Phoenix 扩展的用户场景主要是在 Phoenix 和 Spring 环境下，构建一个唯一的单例对象。

其中扩展支持 SPI、Spring 两种加载模式，扩展适配器支持 Spring 读取。

- 场景一：SPI 的扩展加载，使用适配器增加 Spring 能力（此模式在 Phoenix 内部中使用）
- 场景二：Spring 的扩展加载，此时无须使用适配器（此模式大部分场景下，也可以直接使用 Spring 而无需 Phoenix 扩展
- 场景三：提供一个 Phoenix 生命周期启动钩子（该钩子能保证一定在聚合根扫描之后执行，当在集群启动之前）

## 接口定义 \{#api\}

Phoenix 扩展主要由三个接口，一个抽象类定义：

- `Extension` 接口：声明一个扩展
- `ExtensionId<T extends Extension>` 接口，声明一个扩展的 UUID，也可以用于获取一个扩展
- `ExtensionProvider<T extends Extension>` 抽象类，扩展的工厂方法，同样也需要提供 `ExtensionId`，支持 SPI、Spring 两种加载方式
- `ExtensionAdapter<T extends Extension>` 接口，扩展的适配器，可用于加载 Spring 环境


```java
// 扩展接口
public interface Extension {

}
/** Phoenix 扩展 ID 的定义, 用于表示系统内的 UUID */
public interface ExtensionId<T extends Extension> {

    /**
     * 扩展的唯一 ID
     *
     * @return
     */
    ExtensionId<T> id();
}

/** Phoenix 扩展工厂的定义 */
public abstract class ExtensionProvider<T extends Extension> implements ExtensionId<T> {

    /**
     * 创建扩展实例, 可以包含初始化
     *
     * @return
     */
    public abstract T create(PhoenixContext context);

    /**
     * 通过 PhoenixContext 获取扩展, 无须用户实现.
     *
     * @param context
     * @return
     */
    public T get(PhoenixContext context) {
        return context.registerExtension(this);
    }
}

```


除此之外还有一个适配器接口，用于在特殊用例在集成 Spring 环境:

```java

public interface ExtensionAdapter<T extends Extension> {

    /**
     * 适配器
     *
     * @param extension
     * @return
     */
    T adapt(T extension);

    /**
     * 匹配
     *
     * @param id
     * @return
     */
    boolean match(ExtensionId<T> id);
}
```


## 使用说明 \{#guide\}

以 Phoenix 的事件处理器扩展为例：

### 1. 定义扩展和 ID  \{#define-extension\}

```java
// 定义事件处理器扩展
public class EventHandlerExtension implements Extension {

    private final Set<EventMessageHandler> handlers;

    public EventHandlerExtension(Set<EventMessageHandler> handlers) {
        this.handlers = handlers;
    }
    
    // 提供注入新的处理器方法
    public void addHandler(Set<EventMessageHandler> handlers) {
        this.handlers.addAll(handlers);
    }

    // 事件回调接口
    public void handle(List<Phoenix.Message> messageList) {
        for (EventMessageHandler handler : handlers) {
            handler.handle(messageList);
        }
    }
   
    // 扩展的 UUID 定义
    public enum EventHandlerExtensionId implements ExtensionId<EventHandlerExtension> {
        INSTANCE;

        @Override
        public ExtensionId<EventHandlerExtension> id() {
            return INSTANCE;
        }
    }
}
```

### 2. 定义扩展工厂 \{#define-provider\}

这里使用 SPI，但用户也可以使用 Spring 模式，则无需适配器。

使用 SPI 的一个好处时，在一些没有 Spring 的环境中，仍然拥有一个默认实现。

```java
// 扩展工厂定义
@AutoService(ExtensionProvider.class) // 使用谷歌 AutoService 生成 SPI 信息
public class EventHandlerExtensionProvider extends ExtensionProvider<EventHandlerExtension> {

    // 用于获取 ID，也可以省略
    public static EventHandlerExtensionProvider INSTANCE = new EventHandlerExtensionProvider();

    @Override
    public EventHandlerExtension create(PhoenixContext context) {
        return new EventHandlerExtension(new HashSet<>());
    }

    @Override
    public ExtensionId<EventHandlerExtension> id() {
        return EventHandlerExtensionId.INSTANCE;
    }
}
```

### 3. 定义扩展适配器 \{#define-adapter\}

适配器用于丰富扩展的能力，这个丰富可以是 Spring 也可以是其他，在本定义中，使用了 Spring 的 IOC 能力，往扩展了注入了
在 Spring 中定义的 EventMessageHandler Bean。

```java
@Component
public class EventHandlerExtensionAdapter implements ExtensionAdapter<EventHandlerExtension> {

    private final ApplicationContext springCtx;

    public EventHandlerExtensionAdapter(ApplicationContext context) {
        this.springCtx = context;
    }

    @Override
    public EventHandlerExtension adapt(EventHandlerExtension extension) {
        Collection<EventMessageHandler> messageHandlers =
                springCtx.getBeansOfType(EventMessageHandler.class).values();
        Set<EventMessageHandler> handlerSet = messageHandlers.stream().collect(Collectors.toSet());
        extension.addHandler(handlerSet);
        return extension;
    }

    @Override
    public boolean match(ExtensionId<EventHandlerExtension> id) {
        return EventHandlerExtensionId.INSTANCE.equals(id);
    }
}
```


### 4. 获取扩展  \{#use-extension\}

```java
// 获取并注册到 PhoenixContext
EventHandlerExtension extension = EventHandlerExtensionProvider.INSTANCE.get(PhoenixContext.getInstance());
// 仅获取，如果不存在则抛出异常
EventHandlerExtension extension = PhoenixContext.getInstance().getExtension(EventHandlerExtensionId.INSTANCE);
```

## 事件处理器扩展 \{#event-handler-extension\}

Phoenix 基于扩展能力，丰富了 Phoenix 的一些功能，事件处理器扩展就是其中一个，该扩展提供了 EventStore 在持久化时的回调能力.

### 接口定义 \{#event-handler-extension-api\}

```java
public interface EventMessageHandler {

    /**
     * 批量处理
     */
    void handle(List<Message> messageList);
}
```

### 使用说明  \{#event-handler-extension-usage\}

事件处理器的定义只需要实现 `EventMessageHandler` 并注册为 Spring Bean 即可, 由扩展和适配器提供注入能力。

:::warning[注意事项]

事件处理接口目前与持久化过程包装为一个事务，因此当处理器回调执行失败时，也会导致持久化事件失败，最终导致聚合根重做（溯源 + 重新执行），这可能会导致
出现事件乱序等问题。

除此之外，事件处理器的性能也是一个需要重点考虑的点，因为处理器和持久化进程是串行化执行的，因此处理器需要尽可能少而且编写得高效。

:::

## 淘汰策略扩展 \{#expired-extension\}

Phoenix 基于扩展能力，丰富了 Phoenix 的一些功能，聚合根淘汰策略扩展就是其中一个，该扩展提供了使用 Spring Bean 来自定义聚合根扩展的能力。

### 接口定义  \{#expired-extension-api\}

```java
public interface ExpiredStrategy {

    /**
     * 作用的聚合根类型
     */
    String forType();

    /**
     * 判断聚合根是否过期.
     */
    boolean isExpired(String aggregareRootType, String aggregareRootId, long lastHandleTime);
}
```

### 使用说明  \{#expired-extension-usage\}

事件处理器的定义只需要实现 `ExpiredStrategy` 并注册为 Spring Bean 即可，对于一个聚合根是否过期的判断，Phoenix 提供了三个参数供用户判断：

- `aggregareRootType`: 聚合根类型，一般同 forType 一样
- `aggregareRootId`: 聚合根 ID，使用的是 `EA@aggregareRootType@实际 ID` 的格式
- `lastHandleTime`: 上一次聚合根接收命令的本地机器时间（`System.currentTimeMillis()`)

由于 ExpiredStrategy 支持 Spring 环境，因此用户可以在过期策略中，使用外部存储来判断是否过期。例如：使用 Redis 存储有效聚合根集合，当到达某个指定时间时，
将这些聚合根淘汰（添加步骤可以由另一个初始化策略实现，可以分离）


