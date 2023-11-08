---
id: event-publish-integration
title: 使用说明
---

Phoenix中提供了可集成于Phoenix Server服务中的EventPublish功能模块，启用该模块可直接在Phoenix服务中运行Event Publish任务，服务部署时可通过配置定义Event Publish任务。

## 引用依赖

```xml
<dependency>
  <groupId>com.iquantex</groupId>
  <artifactId>phoenix-event-publish-starter</artifactId>
  <version>2.4.1</version>
</dependency>
```

## 功能说明

* 可在Phoenix服务中开启Event-Publish能力，扫描event-store中的领域事件，发布到特定的Kafka Topic。
* 可在Phoenix服务配置中定义Event-Publish模块的运行参数和定义event-task与monitor-task,event-task用于将Phoenix处理事件转发至指定的Topic，monitor-task可以采集Phoenix处理的消息信息，推送到Elasticsearch，通过Grafana进行监控。
* Event-Publish任务保证读取的Event-Store领域事件完整性，不出现事件遗漏、丢失。
* Event-Publish任务保证相同的聚合根ID的领域事件按照Version严格递增的顺序投递到Kafka。
* Event-Publish任务支持多节点负载均衡和高可用，需要依赖Phoenix服务本身的Akka集群能力。

## 使用说明

Phoenix-Event-Publish功能模块对Phoenix服务本身没有代码入侵，要打开Event-Publish功能模块，仅需要使用`quantex.phoenix.event-publish`配置。

要开启Event-Publish功能模块，需要将Phoenix服务的`quantex.phoenix.event-publsh.enabled`配置置为`true`。

#### 配置详情

Event-Publish模块完全使用配置定义和声明服务中需要运行的Event-Publish任务，完全配置参见:

| 配置项                                                   | 描述                                                         | 类型    | 默认值              |
| -------------------------------------------------------- | ------------------------------------------------------------ | ------- | ------------------- |
| quantex.phoenix.event-publish.batch-size                 | 批量大小                                                     | int     | 128                 |
| quantex.phoenix.event-publish.buffer-queue-size          | 缓存队列大小                                                 | int     | 64                  |
| quantex.phoenix.event-publish.state-table-name           | EventPublish状态表名称                                       | String  | event_publish_state |
| quantex.phoenix.event-publish.from-begin                  | 新建状态或状态不存在时，是否重置读取位置到EventStore最早时间戳 | boolean | false               |
| quantex.phoenix.event-publish.event-task.enabled         | 是否开启领域事件发布                                         | boolean | true                |
| quantex.phoenix.event-publish.event-task.topic           | 领域事件发布的目标topic                                      | String  | 无                  |
| quantex.phoenix.event-publish.monitor-task.enabled| 开关
| quantex.phoenix.event-publish.monitor-task.es-server | 消息监控上报的elasticsearch服务地址                                  | String  | 无                  |

以上配置为Event-Publish功能模块的通用配置，应用于服务内所有Event-Publish任务。

使用示例：

```yaml
quantex:
  phoenix:
    event-publish:
      batch-size: 64
      buffer-queue-size: 64
      from-begin: true
      state-table-name: event_publish_state
      event-task:
        enabled: true
        topic: bank-account-event-pub
      monitor-task:
        es-server: 127.0.0.1:9200
```
#### 事件过滤器

从数据库中读取到的事件会放到阻塞队列中，由事件处理线程读取并发送到Kafka中，当业务系统依赖了phoenix-stater时，可以通过依赖注入的方式自定义Event Handler做事件拦截。

Event Handler提供了getOrder()接口，定义了处理器的执行顺序(Integer.MIN_VALUE > Integer.MAX_VALUE)。当handleBatch()接口返回null，则不继续执行下面的处理器。

```java

public class MarketChangePublishHandler implements EventHandler<Phoenix.Message, Phoenix.Message> {
    @Override
    public CommittableEventBatchWrapper<Phoenix.Message> handleBatch(CommittableEventBatchWrapper<Phoenix.Message> batchWrapper) {
        List<EventStoreRecord<Phoenix.Message>> events = batchWrapper.getEvents();

        Iterator<EventStoreRecord<Phoenix.Message>> iterator = events.iterator();
        // 只发布行情变更事件
        while (iterator.hasNext()) {
            EventStoreRecord<Phoenix.Message> event = iterator.next();
            Phoenix.Message content = event.getContent();
            String payloadClassName = content.getPayloadClassName();
            if (!payloadClassName.equals(MarketChangeEvent.class.getName())) {
                iterator.remove();
            }
        }
        return batchWrapper;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}


```

