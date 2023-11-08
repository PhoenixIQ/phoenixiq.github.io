---
id: phoenix-core-config
title: 配置详情
---

## Phoenix 配置列表

### phoenix-akka配置 

| 配置项                                               | 描述                                                      | 类型    | 默认值                         |
| :---------------------------------------------------| :---------------------------------------------------------| :------ | :--------                     |
| quantex.phoenix.akka.akka-conf                      | actorSystem的配置文件路径                                   | String  | 无                              |
| quantex.phoenix.akka.service-name                   | 服务名                                                     | String  | 服务名                         |
| quantex.phoenix.akka.discovery-method               | 集群发现的方式                                              | Enum  | config <br /> 可选值：config/kubernetes/consul    |
| quantex.phoenix.akka.artery-canonical-port          | 远程服务器端口                                              | Int     | 2551      |
| quantex.phoenix.akka.artery-canonical-hostname      | 远程服务器地址                                              | String  | 127.0.0.1 |
| quantex.phoenix.akka.artery-bind-hostname           | 可绑定的ip地址                                              | String  | 0.0.0.0 |
| quantex.phoenix.akka.seed-node                      | 集群的初始接触点                                            | List    | akka:// + 服务名 + @127.0.0.1:2551 |
| quantex.phoenix.akka.method                         | 服务发现的方式                                              | String  | akka-dns  |
| quantex.phoenix.akka.pod-label-selector             | 服务发现的pod标签                                           | String  | app=%s    |
| quantex.phoenix.akka.management-http-port           | 用于集群管理的端口                                           | Int     | 8558      |
| quantex.phoenix.akka.management-http-bind-hostname  | 绑定内部（0.0.0.0:8558）                                    | String  | 0.0.0.0   |
| quantex.phoenix.akka.k8sPodDomain                   | k8s服务发现默认集群域名后缀                           |String  |cluster.local   |
| quantex.phoenix.akka.consul-host | Consul集群模式下,Consul的地址 | String |127.0.0.1 |
| quantex.phoenix.akka.consul-port | Consul集群模式下,Consul的端口 | Int |8500 |

### Phoenix-server配置  

| 配置项                                                         | 描述                                                       | 类型    | 默认值 |
| :-------------------------------------------------------------                        | :--------------------------------------------------------- | :------ | :----- |
| quantex.phoenix.server.name                                                           | Server端服务名                                             | String  | 无     |
| quantex.phoenix.server.packageName                                                    | 聚合根包所在路径                                             | String  | 无     |
| quantex.phoenix.server.dgc-enable                                                     | DGC 功能开关                                             | Boolean  | true     |
| quantex.phoenix.server.entity-aggregate-enable                                        | 实体聚合根开关                                             | Boolean  | true     |
| quantex.phoenix.server.transaction-aggregate-enable                                   | 事务聚合根开关                                             | Boolean  | true     |
| quantex.phoenix.server.mq.type                                                        | MQ 类型                                                    | String  | kafka     |
| quantex.phoenix.server.mq.address                                                     | MQ 服务端地址                                              | String  | 无     |
| quantex.phoenix.server.mq.properties                                                  | MQ 通用配置,比如连接认证.map结构以key,value配置                | Map  | 无     |
| quantex.phoenix.server.mq.group                                                       | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String   | Server端服务名 |
| quantex.phoenix.server.mq.subscribe[].topic                                           | 订阅的topic           | String  | 无     |
| quantex.phoenix.server.mq.subscribe[].properties                                      | 其他配置,比如ReceiverActor调优参数(#ReceiverOptimizedConfig)或者kafkaConsumer的配置map结构以key,value配置.此配置会覆盖mq.properties| Map  | null     |
| quantex.phoenix.server.event-store.driver-class-name                                  | 数据库驱动                                                 | String  | 可选值：<br /> org.h2.Driver <br /> com.mysql.jdbc.Driver <br /> oracle.jdbc.OracleDriver <br />   |
| quantex.phoenix.server.event-store.no-eventsotre                                      | 是否不需要EventStore   | Boolean  | false     |
| quantex.phoenix.server.event-store.batch-persist                                      | 批量持久化 批次大小   | int  | 200     |
| quantex.phoenix.server.event-store.batch-read                                         | 分页读取事件, 默认分页大小   | int  | 100     |
| quantex.phoenix.server.event-store.data-sources[].url                                 | 数据库 连接url                                             | String  | 无     |
| quantex.phoenix.server.event-store.data-sources[].username                            | 数据库账户                                                 | String  | 无     |
| quantex.phoenix.server.event-store.data-sources[].password                            | 数据库密码                                                 | String  | 无     |
| quantex.phoenix.server.event-store.data-sources[].label                               | 数据源label                                               | String  | 默认 default <br />  可选值：<br /> default <br /> entity <br /> reliablity <br /> transaction <br />   |
| quantex.phoenix.server.event-store.data-sources[].initial-size                        | 初始连接池大小                                              | int  | 2     |
| quantex.phoenix.server.event-store.data-sources[].min-idle                            | 最小连接池大小                                              | int  | 2     |
| quantex.phoenix.server.event-store.data-sources[].max-active                          | 最大连接池大小                                              | int  | 8     |
| quantex.phoenix.server.license                                                        | 认证license，需要向Phoenix官方申请                          | String  | 无     |
| quantex.phoenix.server.default-serializer                                             | 默认的序列化类型                          | String  | 默认 protostuff <br />  可选值：<br /> protostuff <br /> java <br />    |
| quantex.phoenix.server.performance.batch-process                                      | EntityAggregateActor 批量向子Actor发送消息进行处理            |  Int | 100   |
| quantex.phoenix.server.performance.transaction-retry-strategy                     | 重试策略(0: 重试时间会自增的策略 1: 固定重试时间的策略)                            | Int | 0   |


### Phoenix-client配置

| 配置项                                        | 描述                                                       | 类型    | 默认值 |
| :--------------------------------------------     | :--------------------------------------------------------- | :------ | :----- |
| quantex.phoenix.client.enabled                    | 是否启动                                             | Boolean | true     |
| quantex.phoenix.client.name                       | Client 端服务名                                             | String  | 无     |
| quantex.phoenix.client.mq.type                    | MQ 类型                                                    | String  | kafka     |
| quantex.phoenix.client.mq.address                 | MQ 服务端地址                                               | String  | 无     |
| quantex.phoenix.client.mq.properties              | MQ 通用配置,比如连接认证.map结构以key,value配置                | Map  | 无     |
| quantex.phoenix.client.mq.topic                   | MQ 订阅 Topic                                              | String  | 无     |

### Phoenix EventPublish 配置

| 配置项                                        | 描述                                                       | 类型    | 默认值 |  
| :--------------------------------------------     | :--------------------------------------------------------- | :------ | :----- |  
| quantex.phoenix.event-publish.batch-size                    | 批量大小                                           | Int | 128     |  
| quantex.phoenix.event-publish.buffer-queue-size             | 缓存队列大小                                        | Int  | 64     |  
| quantex.phoenix.event-publish.state-table-name              | EventPublish状态表名称                                                    | String  | event_publish_state     |  
| quantex.phoenix.event-publish.from-begin                    | 建状态或状态不存在时，是否重置读取位置到EventStore最早时间戳              | Boolean  | false     |  
| quantex.phoenix.event-publish.monitor-task.enabled          | 监控发布任务 开关                                                | Boolean  | 无     |  
| quantex.phoenix.event-publish.monitor-task.es-server        | 监控发布任务 上报ES服务地址                                               | String  | 无     |  
| quantex.phoenix.event-publish.d-data-task.broker-server     | 分布式数据多播任务 Kafka 服务地址                                                   | String  | 无     |  
| quantex.phoenix.event-publish.d-data-task.enabled           | 分布式数据多播任务 开关                                        | Boolean  | 无     |  
| quantex.phoenix.event-publish.d-data-task.properties        | 分布式数据多播任务 Kafka 自定义配置                                                 | Map  | 无     |  
| quantex.phoenix.event-publish.event-task.enabled            | 领域事件发布任务 开关                                              | Boolean  | 无     |  
| quantex.phoenix.event-publish.event-task.properties         | 领域事件发布任务 Kafka 自定义配置                                             | Map  | 无     |  
| quantex.phoenix.event-publish.event-task.topic              | 领域事件发布任务 Kafka Topic                                            | String  | 无     |  
| quantex.phoenix.event-publish.event-task.broker-server      | 领域事件发布任务 Kafka 服务地址                               | String  | 无     |  

### 配置样例

```yaml
quantex:
  phoenix:
    server:
      name: ${spring.application.name}
      package-name: com.iquantex.phoenix
      mq:
        type: kafka
        address: 127.0.0.1:9092
        properties:
          key: value
        subscribe:
          - topic: account
            properties:
              transactionReliabilityBatchRetry: 100
      event-store:
        driver-class-name: org.h2.Driver
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
            initial-size: 0
            min-idle: 0
            max-active: 8
    client:
      name: ${spring.application.name}-client
      mq:
        type: kafka
        address: 127.0.0.1:9092
        topic: account-client
        properties:
          key: value
    event-publish:
      batch-size: 64
      buffer-queue-size: 64
      from-begin: true
      event-task:
        enabled: true
        broker-server: 127.0.0.1:9092
        topic: bank-account-event-pub
        properties:
          key: value
      d-data-task:
        broker-server: 127.0.0.1:9092
        enabled: true
        properties:
          key: value
      monitor-task:
        enabled: true
        topic: bank-account-monitor
```

### 自定义Akka配置

因为 phoenix 中的部分功能依赖于 akka，所以存在一部分 akka 相关的配置。phoenix 已经抽取了一部分常用的配置集成到 phoenix-start 中，方便用户使用。 如果想要深入自定义 Akka 相关配置，可在项目Classpath目录下创建akka.conf文件进行配置。然后修改一下配置。

```yaml
quantex:
  phoenix:
    akka:
      akka-conf: akka.conf
```
