---
id: phoenix-upgrade-2-2-1
title: 2.1.8升级2.2.1指南
---

## 配置变更

### 移除`routers`配置

2.2.1支持自动扫面服务的cmd作为路由信息，不需要再进行手动配置

需要注意:

*一个服务服务里面`@CommandHandler`+`@TransactionStart`中的的消息名字必须在***服务内唯一**（注意Sigma项目中存在不唯一的情况）

### `server`订阅配置变更

2.2.1 配置示例如下：

```yaml
quantex:
  phoenix:
    server:
      name: ${spring.application.name}
      mq:
        type: kafka
        address: embedded
        subscribe-topic: account-server
```

在**application**中删除订阅多个topic的配置，多topic源的配置支持`bean`注入方式进行订阅。通过实现Subscribe接口订阅的消息默认发送到本集群，可以通过设置`DeserializationReturn`的`src`属性来配置消息处理完成后回复的topic

注意点：

- 需要实现`com.iquantex.phoenix.server.mq.subscribe.Subscribe` 接口
- 反序列化类支持使用`@Autowired`进行注入
- 增加Consumer Offset的配置
 - **earliest**： 自动将偏移量重置为最早的偏移量
 - **latest**：自动将偏移量重置为最新的偏移量
 - **none**：如果未找到消费者组的先前偏移量，则向消费者抛出异常


示例代码如下：

```java
@Slf4j
@Component("WebEventTopicSubscribe")
public class WebEventTopicSubscribe implements Subscribe {

    @Value("${other-subscribe.mqAddress}")
    private String mqAddress;

    @Value("${other-subscribe.topic}")
    private String topic;

    @Override
    public SubscribeMqInfo getSubscribeMqInfo() {
        return new SubscribeMqInfo(mqAddress, topic, AutoOffsetReset.earliest);
    }

    @Override
    public List<DeserializationReturn> deserialize(String className, byte[] bytes) {
        List<DeserializationReturn> deserializationReturns = new ArrayList<>();
        // 反序列化逻辑...
        return deserializationReturns;
    }
}
```

### event Publish 配置变动

2.2.1 配置变动：

- 移除对db配置的依赖，默认使用`phoenix-server`的db配置
- phoenix目前只支持`kafka`，所以这里移除`mq-type`的配置
- 移除多个tasks配置，默认值提供`event-task`和`monitor-task`

```yaml
quantex:
  phoenix:
    event-publish:
      enabled: true
      batch-size: 64
      buffer-queue-size: 64
      from-begin: true
      event-task:
        enabled: true
        topic: bank-account-event-pub
      monitor-task:
        enabled: true
        broker-server: 127.0.0.1:9092
        topic: bank-account-monitor
```

接收`eventPublish`发送的消息代码示例：

```java
@Slf4j
public class BankAccountEventListener implements BatchAcknowledgingMessageListener<String, byte[]> {

    @Override
    @SneakyThrows
    @KafkaListener(topics = "${iquantex.phoenix.event-publish.event-task.topic:bank-account-event-pub}")
    public void onMessage(List<ConsumerRecord<String, byte[]>> data, Acknowledgment acknowledgment) {
        for (ConsumerRecord<String, byte[]> record : data) {
            // 反序列化
            Message eventMsg = new Message(record.value());
            // 业务逻辑...
        }
    }

}
```

如果想模拟创建一个phoenix消息用来测试，可以通过以下方法进行构建：

```java
Phoenix.Message build = Phoenix.Message.newBuilder().setPayloadClassName().setPayload().build();
build.toByteArray();
```

## 使用`client`发送消息

```
修改前：
Future<RpcResult> future = client.send(valPollingCheckCmd, requestId);

修改后，增加发送目标的topic名字
Future<RpcResult> future = client.send(valPollingCheckCmd, "targetTopic", requestId);
```

### 事务中`SagaAction`和`TccAction API`变更

如果cmd需要发送到其他服务，则需要设置`targetTopic`为目标服务`topic`名称，如果目标服务为本集群则不需要指定。**SagaAction**的变更如下：

```java
@Getter
public class SagaAction extends TransactionAction {

    private final Object tiCmd;

    private final Object ciCmd;

    private final String subTransId;

    // Builder注解加到私有构造函数上,可以识别到父类定义的字段
    @Builder
    private SagaAction(String targetTopic, Object tiCmd, Object ciCmd, String subTransId) {
        this.targetTopic = targetTopic;
        this.tiCmd = tiCmd;
        this.ciCmd = ciCmd;
        this.subTransId = subTransId;
    }
}
```

`SagaAction`和`TccAction`只能通过build的方式进行构建，举栗：

```java
SagaAction.builder().targetTopic("account-server").tiCmd(new AccountAllocateCmd(request.getOutAccountCode(), -request.getAmt())).build()
```



## 项目接入admin监控

### docker-compose变更

1. 引入Prometheus配置镜像
2. 拷贝镜像中的配置文件的到`/prometheus-agent`目录
3. 在启动服务时需要添加以下指令

`-javaagent:/prometheus-agent/jmx_prometheus_javaagent.jar=8888:/prometheus-agent/config.yml`

接入示例：

```dockerfile
#增加Prometheus配置镜像,起一个别名为agent
FROM harbor.iquantex.com/phoenix/prometheus-agent:1.0.0 as agent
FROM harbor.iquantex.com/base_images/openjdk:8u212-jre-with-tool

MAINTAINER "lan"

VOLUME /tmp

#拷贝镜像中的配置文件到指定目录
COPY --from=agent /prometheus-agent/ /prometheus-agent
ADD app.jar app.jar

#增加-javaagent:/prometheus-agent/jmx_prometheus_javaagent.jar=8888:/prometheus-agent/config.yml
ENTRYPOINT java -jar -javaagent:/prometheus-agent/jmx_prometheus_javaagent.jar=8888:/prometheus-agent/config.yml ${JAVA_OPTS} -XX:+UseConcMarkSweepGC -XX:+UseContainerSupport -XX:InitialRAMPercentage=75.0 -XX:MinRAMPercentage=75.0 -XX:MaxRAMPercentage=75.0  -XshowSettings:vm /app.jar
```

暴露`jmx`采集数据的端口，helm-chart文件如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    prometheus.io/path: /metrics
    prometheus.io/port: "8888"
    prometheus.io/scheme: http
    prometheus.io/phoenix_scrape: "true"
  name: phoenix-metric
spec:
  ports:
  - name: default
    port: 80
    protocol: TCP
    targetPort: 8888
  selector:
    apptype: phoenix
  type: ClusterIP
status:
  loadBalancer: {}
```

同时要在服务的helm chart中增加一个标签

```yaml
spec:
  template:
    metadata:
      labels:
        apptype: phoenix
```

#### 使用rancher操作

rancher => 服务发现 => 添加DNS记录

 ![image-20200814105314991](../../assets/phoenix2.x/upgrade/1.png)

![image-20200814105332438](../../assets/phoenix2.x/upgrade/2.png)

被监控的服务增加以下标签

![image-20200814105750492](../../assets/phoenix2.x/upgrade/3.png)

### 检查服务是否被监控

- 通过访问本地端口来查看是否暴露监控数据

进入容器访问8888端口，查看是否有暴露`com_iquantex_Phoenix`打头的监控信息

```bash
bash-5.0# curl localhost:8888
...
# HELP com_iquantex_Phoenix_ReceiverActor_NoHandlerMessageTotal Attribute exposed for management (com.iquantex.Phoenix<type=ReceiverActor,  aggregateRootId=kafka-9092-account-web-event-0><>NoHandlerMessageTotal)
# TYPE com_iquantex_Phoenix_ReceiverActor_NoHandlerMessageTotal untyped
com_iquantex_Phoenix_ReceiverActor_NoHandlerMessageTotal{_aggregateRootId="kafka-9092-account-web-event-0",} 0.0
com_iquantex_Phoenix_ReceiverActor_NoHandlerMessageTotal{_aggregateRootId="kafka-9092-account-server-2",} 0.0
com_iquantex_Phoenix_ReceiverActor_NoHandlerMessageTotal{_aggregateRootId="kafka-9092-account-web-event-2",} 0.0
com_iquantex_Phoenix_ReceiverActor_NoHandlerMessageTotal{_aggregateRootId="kafka-9092-account-server-0",} 0.0
...
```

- 通过Prometheus查看监控信息

通过Prometheus服务的targets页面查看是否有被监控的服务

![image-20200814104432533](../../assets/phoenix2.x/upgrade/4.png)

## 测试工具类`EntityAggregateFixture`包路径变更

变更后路径为：`com.iquantex.phoenix.server.test.EntityAggregateFixture`

