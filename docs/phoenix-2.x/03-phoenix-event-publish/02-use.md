---
id: event-publish-use-2x
title: 使用说明
---

## 启动运行

### 本地启动

1. 为方便本地测试运行，service-store配置可直接使用H2（默认使用H2）。
2. 配置好event-store数据源（支持MYSQL/H2/ORACLE），可选已部署好的event-store数据源。
3. 消息队列MQ地址（目前仅支持kafka）。
4. 默认的akka配置可直接启动单个节点运行，如需启动多个节点模拟akka集群则需要注意：
    * 修改akka.remote.artery.canonical.port使用不同端口
    * 修改server.port使用不同端口

启动后效果：

```log
...
2020-04-08 15:55:38.302  INFO 28564 --- [t-dispatcher-13] c.i.p.e.mq.KafkaPublishProducer          : init kafka producer nameSrvAddr<10.16.18.206:9092>
2020-04-08 15:55:38.412  INFO 28564 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2020-04-08 15:55:38.573  INFO 28564 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2020-04-08 15:55:38.576  INFO 28564 --- [           main] c.i.p.e.PhoenixEventPublishApplication   : Started PhoenixEventPublishApplication in 5.569 seconds (JVM running for 6.37)
2020-04-08 15:55:38.577  INFO 28564 --- [           main] c.i.p.eventpublish.runner.ServiceRunner  : |||||||||||||||||| PHOENIX EVENT PUBLISH APPLICATION STARTED ||||||||||||||||||
2020-04-08 15:55:43.372  INFO 28564 --- [t-dispatcher-13] c.i.p.e.c.TaskManagerSingletonActor      : started task number<0>
...
```

### Docker快速运行

配置好event-store数据源后使用使用以下docker命令可以容器方式启动服务，以使用oracle数据源为例：

```shell
docker run --name event-publish \
-e quantex.phoenix.event-publish.event-store.data-sources.0.url=jdbc:oracle:thin:@127.0.0.1:1521/PDB \
-e quantex.phoenix.event-publish.event-store.data-sources.0.username=test \
-e quantex.phoenix.event-publish.event-store.data-sources.0.password=test \
-e quantex.phoenix.event-publish.event-store.driver-class-name=oracle.jdbc.OracleDriver \
harbor.iquantex.com/kunlun/phoenix-event-publish:1.0.0
```

### Kubernetes部署

可使用镜像 harbor.iquantex.com/phoenix/phoenix-event-publish:1.0.0 在Kubernetes集群中部署Event Publish服务，按照以下说明配置服务。

## 服务配置

| **配置名** | **描述** | **类型** | **可选值** | **默认值** |  
|:----------|:---------|:--------|:----------|:----------|
| quantex.phoenix.event-publish.event-store.driver-class-name | EventStore数据库JDBC Driver类名 | String | "com.mysql.jdbc.Driver" / "oracle.jdbc.driver.OracleDriver" / "org.h2.Driver" | 无 |
| quantex.phoenix.event-publish.event-store.data-sources[].url | EventStore数据库连接URL | String | / | 无 |
| quantex.phoenix.event-publish.event-store.data-sources[].username | EventStore数据库用户名 | String | / | 无 |
| quantex.phoenix.event-publish.event-store.data-sources[].password | EventStore数据库密码 | String | / | 无 |
| quantex.phoenix.event-publish.mq.address | 消息队列服务地址 | String | / | 无 |
| quantex.phoenix.event-publish.read-batch-size | 事件发布任务每次读取消息最大数量 | Int | [1, 1024] | 64 |
| quantex.phoenix.event-publish.service-store.driver-class-name | 服务状态存储数据库JDBC Driver类名 | String | "com.mysql.jdbc.Driver" / "oracle.jdbc.driver.OracleDriver" / "org.h2.Driver" | 无 |
| quantex.phoenix.event-publish.service-store.username | 服务状态存储数据库 连接URL | String | / | 无 |
| quantex.phoenix.event-publish.service-store.username | 服务状态存储数据库 用户名 | String | / | 无 |
| quantex.phoenix.event-publish.service-store.password | 服务状态存储数据库 密码 | String | / | 无 |

## HTTP APIs

服务部署成功后，如需要开启领域事件发布任务，则需要使用以下HTTP API来新增和管理任务。

### 新增事件发布任务

`POST /phoenix/event_publish/new_task`

RequestBody: json

```json
{
  "taskName": "task-test",
  "publishTopic": "test-topic",
  "subscription": ["TestAggregateA", "TestAggregateB"],
  "autoStart": 1,
  "fromBegin": 1
}
```

RequestBody参数

* taskName: 新建的事件发布任务名称（不同任务不可使用同一个taskName）
* publishTopic: 新建的事件发布任务的目标队列topic名称
* subscription: 新建的事件发布任务的聚合根订阅列表，列表中元素为领域聚合跟名称
* autoStart: 是否自动开启事件发布任务
* fromBegin: 是否从最早时间戳开始读取事件（默认最早时间为"2020-01-01 00:00:00.000"）

ResponseBody: json

```json
{
    "msg": "subscription added for task<task-test>: <[TestAggregateA, TestAggregateB]>",
    "code": 200
}
```

### 启动指定事件发布任务

`POST /phoenix/event_publish/start/{taskName}`

URL路径参数：

* taskName: 需要启动的事件发布任务名称

ResponseBody

```json
{
    "msg": "start task ok: taskName<task-test>, beginTimestamp<2000-01-01 00:00:00.0>",
    "code": 200
}
```

### 查询所有事件发布任务详情

`GET /phoenix/event_publish/all_task_list`

ResponseBody: json

```json
{
    "total": 2,
    "code": 200,
    "data": [
        {
            "createTime": 0,
            "lastTimestamp": 0,
            "publishTopic": "test-1",
            "running": true,
            "subscription": [
                "BankAccount"
            ],
            "taskName": "test-1"
        },
        {
            "createTime": 0,
            "lastTimestamp": 0,
            "publishTopic": "test-2",
            "running": true,
            "subscription": [
                "BankAccount"
            ],
            "taskName": "test-2"
        }
    ]
}
```

## 客户端使用

> 模块化的客户端领域事件接收封装目前仍未完成开发，以下说明如何基于Kafka消息消费来实现对领域事件的订阅。

### 从Kafka消费领域事件消息

PhoenixEventPublish将订阅的领域事件以`Phoenix.Message`的字节流发往Kafka指定的topic中，为确保消息的顺序，默认仅发送到partition-0中。需要接收这些消息的客户端服务可以实现Kafka Consumer，订阅该topic-partition。

### 解析消息包

领域事件消息以字节数组形式`byte[]`存储在KafkaRecord的value中，在接收消息时，使用Kafka的`ByteArrayDeserializer`反序列化得到KafkaRecord的value，即可得到`Phoenix.Message`对应的字节数组：

```java

// kafka consumer value deserializer config
consumerConfigs.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ByteArrayDeserializer.class.getName());

// ...

// 获取KafkaRecord.value
ConsumerRecord<String, byte[]> record = ...;
byte[] bytes = record.value();

```

随后使用Phoenix提供的`Message`封装即可直接反序列化得到`Message`对象，该对象中存储了具体的领域事件对象和相关信息。

```java
// 反序列化字节数组得到Phoenix.Message
Message eventMsg = new Message(bytes);

// 取得业务事件对象
Object event = eventMsg.getPayload();

// 取得业务事件类名
String className = eventMsg.getPayloadClassName();

```

## 支持

当前PhoenixEventPublish组件仍在开发和试用阶段，如有任何问题和需求欢迎提出[Issue](https://gitlab.iquantex.com/phoenix/phoenix-event-publish/-/issues)。
