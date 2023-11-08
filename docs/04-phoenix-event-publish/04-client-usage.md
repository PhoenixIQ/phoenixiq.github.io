---
id: event-publish-client-usage
title: 订阅事件
---

## 使用Spring Kafka实现事件订阅客户端 \{#listener\}

领域事件发布服务可由独立部署的Event-Publish服务提供，也可由集成的Phoenix-Event-Publish事件发布模块提供，事件发布任务定义后，由这些服务从event-store中按照一定顺序读取，并发送到指定的MQ topic中。

当某个服务需要订阅这些事件时，需要实现相应的MQ消费模块，通过消费Topic消息的形式取得事件，并进行后续处理。当前Event-Publish模块开发中，尚未对Client端的事件消费和处理模型进行严格定义，形成抽象，所以需要客户端服务暂时自行实现这部分逻辑，在目前阶段保留较大的灵活度。

以下说明提供一个使用Spring Kafka Listener封装实现MQ消息订阅的示例。

### Listener写法 \{#listener-example\}

Spring Kafka提供注解`@KafkaListener`，标注在消息订阅处理的方法上，即我们需要实现的事件订阅处理逻辑。以银行转账的事件订阅为例，如下所示：

```java

public class BankAccountEventListener {

    // 使用提供的默认反序列化器，反序列化MQ中的字节数组，得到以Message封装的领域事件
    private EventDeserializer<byte[], Message> deserializer = new DefaultMessageDeserializer();

    // 使用注解标注事件处理的方法，在注解中声明订阅消息的topic和该listener的goupId
    @KafkaListener(topics = "bank-account-event-pub", groupId = "bank-account-event-sub")
    public void receive(byte[] eventBytes) {
        try {
            Message eventMsg = deserializer.deserialize(eventBytes);
            if (eventMsg.getPayload() instanceof AccountCreateEvent) {
                String accountCode = ((AccountCreateEvent) eventMsg.getPayload()).getAccountCode();
            }
        } catch (Exception e) {
            log.error("handle event error", e);
        }
    }
}

```

### Listener实例化和依赖组件的配置 \{#listener-property\}

以上仅为Listener的声明定义，想要在服务中启动以上Listener，需要创建相应的实例，这依赖相应的`ConsumerFactory`和`KafkaListenerContainerFactory`，我们通过声明Bean Configuration的方式让Spring管理这些实例的创建和依赖管理。以银行转账的事件订阅为例，如下所示：

```java

@EnableKafka
@Configuration
@ConditionalOnProperty(value = "event.listener.enabled", havingValue = "true")
public class KafkaConsumerConfiguration {

    @Value("${spring.kafka.bootstrap-servers}")
    private String mqAddress;

    /**
     * 创建一个kafka的Consumer工厂
     */
    @Bean
    public ConsumerFactory<String, byte[]> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, mqAddress);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "bank-account-event-listener");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ByteArrayDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }

    /**
     * 创建一个Kafka的listener
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, byte[]> kafkaListenerContainerFactory(ConsumerFactory<String, byte[]> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, byte[]> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }

    /**
     * 创建账户事件的listener
     */
    @Bean
    public BankAccountEventListener bankAccountListener() {
        return new BankAccountEventListener();
    }
}
```

使用配置`spring.kafka.bootstrap-servers`设置事件订阅的Kafka地址。

### 提供手动Consumer Ack机制的批量消费Listener \{#example\}

以上Listener实现使用自动提交机制的Consumer，消息在被Consumer接收后，即向Kafka Broker提交消费进度，下次相同的Consumer Group将不再消费此消息；同时该Listener提供的是单个消息处理接口。

Spring Kafka提供了`BatchAcknowledgingMessageListener`，该Listener实现提供批量消息消费和处理接口，同时提供手动Consumer Ack机制，可实现消息被Listener成功处理后再向Kafka Broker提交该消费进度，保证应用在故障恢复后，可以再次消费未成功处理的消息。

使用示例如下：

```java

public class BankAccountEventListener implements BatchAcknowledgingMessageListener<String, byte[]> {

    @Override
    @KafkaListener(topics = "bank-account-event-pub")
    public void onMessage(List<ConsumerRecord<String, byte[]>> data, Acknowledgment acknowledgment) {
        for (ConsumerRecord<String, byte[]> record : data) {
            tryAddNewAccount(record.value());
        }
        acknowledgment.acknowledge(); // 手动提交消费进度
    }
}
```

同时注意`ConsumerFactory`和`KafkaListenerContainerFactory`需要使用特定设置。

* Consumer配置中关闭自动消费进度提交：`props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true")`
* `KafkaListenerContainerFactory`设置手动提交模式和批量消息模式：

```java
@Bean
public ConcurrentKafkaListenerContainerFactory<String, byte[]> kafkaListenerContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, byte[]> factory = new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory());
    // 开启批量消息模式
    factory.setBatchListener(true);
    // 开启手动提交模式，用于提供BatchAcknowledgingMessageListener回调中的Acknowlegment对象
    factory.getContainerProperties().setAckMode(AbstractMessageListenerContainer.AckMode.MANUAL_IMMEDIATE);
    return factory;
}
```
