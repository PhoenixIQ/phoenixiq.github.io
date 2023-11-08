---
id: phoenix-core-config
title: 配置详情
description: Phoenix 框架配置
---

## Phoenix 配置列表 \{#config-list\}

### Phoenix-Akka 配置 \{#akka\}

| 配置项                                                                  | 描述                                  | 类型      | 默认值                                   |
|:---------------------------------------------------------------------|:------------------------------------|:--------|:--------------------------------------|
| quantex.phoenix.akka.akka-conf                                       | actorSystem的配置文件路径                  | String  | 无                                     |
| quantex.phoenix.akka.service-name                                    | 服务名                                 | String  | 服务名                                   |
| quantex.phoenix.akka.artery-canonical-port                           | 远程服务器端口                             | Int     | 2551                                  |
| quantex.phoenix.akka.artery-canonical-hostname                       | 远程服务器地址                             | String  | 127.0.0.1                             |
| quantex.phoenix.akka.artery-bind-hostname                            | 可绑定的ip地址                            | String  | 0.0.0.0                               |
| quantex.phoenix.akka.method                                          | 服务发现的方式                             | String  | akka-dns                              |
| quantex.phoenix.akka.management-http-port                            | 用于集群管理的端口                           | Int     | 8558                                  |
| quantex.phoenix.akka.management-http-bind-hostname                   | 绑定内部（0.0.0.0:8558）                  | String  | 0.0.0.0                               |
| quantex.phoenix.akka.required-contact-point-num                      | 要求集群最少节点数量(小于此值时无法建立集群)             | Int     | 1                                     |
| quantex.phoenix.akka.enable-priority                                 | 是否支持消息处理优先级                         | Boolean | false                                 |
| quantex.phoenix.akka.enable-remember                                 | 是否开启记住实体功能                          | Boolean | true                                  |
| quantex.phoenix.akka.starvation-detector.enabled                     | 是否开启饥饿检测器                           | Boolean | false                                 |
| quantex.phoenix.akka.starvation-detector.max-delay-warning-threshold | 线程池阻塞阈值（ms）,此默认较高,可适当降低             | Long    | true                                  |
| quantex.phoenix.akka.starvation-detector.warning-interval            | 警告输出间隔（ms）                          | Long    | true                                  |
| quantex.phoenix.akka.starvation-detector.checker-interval            | 检查执行间隔 (ms) 可适当降低,较高的间隔也许会错过部分短期的阻塞 | Long    | true                                  |
| quantex.phoenix.akka.starvation-detector.checker-initial-delay       | 初始化检测任务延迟(ms)                       | Long    | true                                  |
| quantex.phoenix.akka.pipeline.capacity                               | 集群线程池计算任务最大容量                       | int     | 1000                                  |
| quantex.phoenix.akka.pipeline.parallelism                            | 集群线程池最大并行度                          | int     | 8                                     |
| quantex.phoenix.akka.pipeline.timeout                                | 集群线程池计算任务超时时间                       | long    | 30000                                 |
| quantex.phoenix.akka.pipeline.dispatcher                             | 集群线程池调度程序（在单个节点上使用多少线程）             | String  | distributed-computing-pool-dispatcher |


### Phoenix-Cluster 配置 \{#cluster\}

| 配置项                                                          | 描述                                                              | 类型     | 默认值                                                                                     |
|:-------------------------------------------------------------|:----------------------------------------------------------------|:-------|:----------------------------------------------------------------------------------------|
| quantex.phoenix.cluster.discovery-method                     | 集群发现的方式                                                         | Enum   | config <br /> 可选值：<br />config｜kubernetes <br/>consul｜nacos ｜eureka<br/> kubernetes_dns |
| quantex.phoenix.cluster.config.seed-node                     | 集群的初始接触点                                                        | List   | akka:// + 服务名 + @127.0.0.1:2551                                                         |
| quantex.phoenix.cluster.kubernetes.pod-label-selector        | Kubernetes 集群时,服务发现的pod标签                                       | String | app=%s                                                                                  |
| quantex.phoenix.cluster.kubernetes.k8s-pod-domain            | Kubernetes 集群时,服务发现默认集群域名后缀                                     | String | cluster.local                                                                           |
| quantex.phoenix.cluster.kubernetes-dns.port-name             | Kubernetes-DNS 集群时,Akka-Management 端口在 Kubernetes 上的端口名         | String | app=%s                                                                                  |
| quantex.phoenix.cluster.kubernetes-dns.headless-service-name | Kubernetes-DNS 集群时, 上述开放 Management 端口的服务名                      | String | cluster.local                                                                           |
| quantex.phoenix.cluster.consul.consul-host                   | Consul集群模式下,Consul的地址                                           | String | 127.0.0.1                                                                               |
| quantex.phoenix.cluster.consul.consul-port                   | Consul集群模式下,Consul的端口                                           | Int    | 8500                                                                                    |
| quantex.phoenix.cluster.consul.group-name                    | Consul 集群模式下,分组的组名                                              | String | DEFAULT_GROUP                                                                           |
| quantex.phoenix.cluster.nacos.nacos-host                     | Nacos 集群模式下,Nacos 的地址                                           | String | 127.0.0.1                                                                               |
| quantex.phoenix.cluster.nacos.nacos-port                     | Nacos 集群模式下,Nacos 的端口                                           | Int    | 8848                                                                                    |
| quantex.phoenix.cluster.nacos.group-name                     | Nacos 集群模式下,分组的组名                                               | String | DEFAULT_GROUP                                                                           |
| quantex.phoenix.cluster.eureka.eureka-host                   | Eureka 集群模式下,Eureka 的地址                                         | String | 127.0.0.1                                                                               |
| quantex.phoenix.cluster.eureka.eureka-port                   | Eureka 集群模式下,Eureka 的端口                                         | Int    | 8761                                                                                    |
| quantex.phoenix.cluster.eureka.eureka-path                   | Eureka 集群模式下,Eureka 的资源路径                                       | String | eureka                                                                                  |
| quantex.phoenix.cluster.eureka.group-name                    | Eureka 集群模式下,分组的组名                                              | String | DEFAULT_GROUP                                                                           |
| quantex.phoenix.cluster.eureka.register-host-name            | Eureka 集群模式下,自定义注册到 Eureka 上的 InstanceID, 默认使用本地 DNS 的 Hostname | String |                                                                                         |
| quantex.phoenix.cluster.eureka.renew-interval                | 可选参数,Eureka 集群模式下, 续租间隔                                         | Long   | 30000                                                                                   |

### Phoenix-Server 配置 \{#server\}

| 配置项                                                            | 描述                                                                                                        | 类型             | 默认值                                                                                                                                              |
|:---------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------|:---------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| quantex.phoenix.server.name                                    | Server端服务名                                                                                                | String         | 无                                                                                                                                                |
| quantex.phoenix.server.packageName                             | 聚合根包所在路径                                                                                                  | String         | 无                                                                                                                                                |
| quantex.phoenix.server.dgc-enable                              | DGC 功能开关                                                                                                  | Boolean        | true                                                                                                                                             |
| quantex.phoenix.server.entity-aggregate-enable                 | 实体聚合根开关                                                                                                   | Boolean        | true                                                                                                                                             |
| quantex.phoenix.server.transaction-aggregate-enable            | 事务聚合根开关                                                                                                   | Boolean        | true                                                                                                                                             |
| quantex.phoenix.server.mq.consumer-type                        | MQ 消费者模式                                                                                                  | Enum           | poll  <br />   可选值：<br />   push, poll                                                                                                           |
| quantex.phoenix.server.mq.address                              | MQ 服务端地址                                                                                                  | String         | 无                                                                                                                                                |
| quantex.phoenix.server.mq.partition-selector-class-name        | 自定义分区选择器实现类全路径名(FQCN)                                                                                     | String         | 无                                                                                                                                                |
| quantex.phoenix.server.mq.properties                           | MQ 通用配置,比如连接认证.map结构以key,value配置                                                                          | Map            | 无                                                                                                                                                |
| quantex.phoenix.server.mq.group                                | Server端服务消费组名,对应kafka和rocketmq中的consumergroup                                                             | String         | Server端服务名                                                                                                                                       |
| quantex.phoenix.server.mq.subscribe[].topic                    | 订阅的topic                                                                                                  | String         | 无                                                                                                                                                |
| quantex.phoenix.server.mq.subscribe[].properties               | 其他配置,比如ReceiverActor调优参数(#ReceiverOptimizedConfig)或者kafkaConsumer的配置map结构以key,value配置.此配置会覆盖mq.properties | Map            | null                                                                                                                                             |
| quantex.phoenix.server.event-store.type                        | 选择数据库类型                                                                                                   | Enum           | jdbc  <br />   可选值：<br />   jdbc, none, memory, async,详细区别请参考事件管理章节                                                                              |
| quantex.phoenix.server.overflow-strategy                       | 缓存区溢出策略                                                                                                   | Enum           | FAIL  <br />   可选值：<br />   FAIL, BACKPRESSURE, BACKOFF, DROP,详细区别请参考事件管理章节                                                                      |
| quantex.phoenix.server.event-store.delay                       | 背压溢出策略下, 等待缓冲区空闲的睡眠时间(ms)                                                                                 | long           | 50                                                                                                                                               |
| quantex.phoenix.server.event-store.max-delay                   | Backoff 溢出策略下, 重试的最大次数，超出退避为 FAIL                                                                         | int            | 40                                                                                                                                               |
| quantex.phoenix.server.event-store.driver-class-name           | 数据库驱动                                                                                                     | String         | 可选值：<br /> org.h2.Driver <br /> com.mysql.jdbc.Driver <br /> oracle.jdbc.OracleDriver <br /> org.postgresql.Driver<br/> com.mysql.cj.jdbc.Driver |
| quantex.phoenix.server.event-store.batch-persist               | 批量持久化 批次大小                                                                                                | int            | 200                                                                                                                                              |
| quantex.phoenix.server.event-store.buffer-size                 | 持久化缓冲区大小                                                                                                  | int            | 500                                                                                                                                              |
| quantex.phoenix.server.event-store.batch-read                  | 分页读取事件, 默认分页大小                                                                                            | int            | 100                                                                                                                                              |
| quantex.phoenix.server.event-store.parallelism                 | 数据库插入线程池,保持和连接池数量一致, 避免资源浪费、不足）                                                                           | int            | 8                                                                                                                                                |
| quantex.phoenix.server.event-store.event-table-name            | 事件存储表名                                                                                                    | String         | event_store                                                                                                                                      |
| quantex.phoenix.server.event-store.snapshot-table-name         | 快照存储表名                                                                                                    | String         | snapshot_store                                                                                                                                   |
| quantex.phoenix.server.event-store.event-query-type            | 事件查询类型(!!!注意此参数会改变数据库表结构, 当切换时应清理并删除原有数据库表)                                                               | EventQueryType | 默认： time <br />  可选值：<br /> time <br /> slice                                                                                                    |
| quantex.phoenix.server.event-store.aggregate-id-size           | 表字段聚合根 Id 和 Type 的大小, 默认字符长度                                                                              | int            | 255                                                                                                                                              |
| quantex.phoenix.server.event-store.data-sources[].url          | 数据库 连接url                                                                                                 | String         | 无                                                                                                                                                |
| quantex.phoenix.server.event-store.data-sources[].username     | 数据库账户                                                                                                     | String         | 无                                                                                                                                                |
| quantex.phoenix.server.event-store.data-sources[].password     | 数据库密码                                                                                                     | String         | 无                                                                                                                                                |
| quantex.phoenix.server.event-store.data-sources[].label        | 数据源label                                                                                                  | String         | 默认 default <br />  可选值：<br /> default <br /> reliability <br />                                                                                  |
| quantex.phoenix.server.event-store.data-sources[].initial-size | 初始连接池大小                                                                                                   | int            | 2                                                                                                                                                |
| quantex.phoenix.server.event-store.data-sources[].min-idle     | 最小连接池大小                                                                                                   | int            | 2                                                                                                                                                |
| quantex.phoenix.server.event-store.data-sources[].max-active   | 最大连接池大小                                                                                                   | int            | 8                                                                                                                                                |
| quantex.phoenix.server.license                                 | 认证license,需要向Phoenix官方申请                                                                                  | String         | 无                                                                                                                                                |
| quantex.phoenix.server.default-serializer                      | 默认的序列化类型                                                                                                  | String         | 默认 protostuff <br />  可选值：<br /> protostuff <br /> java <br /> protobuf <br /> json <br />                                                       |
| quantex.phoenix.server.performance.batch-process               | EntityAggregateActor 批量向子Actor发送消息进行处理                                                                    | Int            | 100                                                                                                                                              |
| quantex.phoenix.server.performance.transaction-retry-strategy  | 重试策略(0: 重试时间会自增的策略 1: 固定重试时间的策略)                                                                          | Int            | 0                                                                                                                                                |
| quantex.phoenix.server.ddata-utc-clock                         | 是否使用UTC时区的系统时钟                                                                                            | Boolean        | true                                                                                                                                             |
| quantex.phoenix.server.console.enabled                         | 是否开启 Phoenix 运维工具                                                                                         | Boolean        | false                                                                                                                                            |
| quantex.phoenix.server.console.exception-max-size              | Phoenix 运维工具异常事件最大保存数量(每个节点)                                                                              | Int            | 20                                                                                                                                               |

### Phoenix-Client 配置 \{#client\}

| 配置项                                                     | 描述                                      | 类型      | 默认值                 |
|:--------------------------------------------------------|:----------------------------------------|:--------|:--------------------|
| quantex.phoenix.client.enabled                          | 是否启动                                    | Boolean | true                |
| quantex.phoenix.client.name                             | Client 端服务名                             | String  | 无                   |
| quantex.phoenix.client.mq.address                       | MQ 服务端地址                                | String  | 无                   |
| quantex.phoenix.client.mq.properties                    | MQ 通用配置,比如连接认证.map结构以key,value配置        | Map     | 无                   |
| quantex.phoenix.client.mq.topic                         | MQ 订阅 Topic                             | String  | 无                   |
| quantex.phoenix.client.mq.group                         | Client 实现 RPC 所需 Consumer 的消费者组         | String  | phoenix@group@topic |
| quantex.phoenix.client.mq.partition-selector-class-name | 自定义分区选择器实现类全路径名(FQCN)                   | String  | 无                   |
| quantex.phoenix.client.matching.timeout-mills           | RPC 匹配超时配置,超出该时间则移除(不匹配并抛出异常). 默认 10 分钟 | Long    | 600_000             |
| quantex.phoenix.client.matching.maximum-size            | 最大容量. 默认为无界                             | Int     | Long.MAX_VALUE      |

### Phoenix-EventPublish 配置 \{#event-publish\}

| 配置项                                                                     | 描述                                     | 类型      | 默认值                 |  
|:------------------------------------------------------------------------|:---------------------------------------|:--------|:--------------------|
| quantex.phoenix.event-publish.batch-size                                | 批量大小                                   | Int     | 128                 |  
| quantex.phoenix.event-publish.buffer-queue-size                         | 缓存队列大小                                 | Int     | 64                  |  
| quantex.phoenix.event-publish.state-table-name                          | EventPublish状态表名称                      | String  | event_publish_state |  
| quantex.phoenix.event-publish.from-begin                                | 建状态或状态不存在时,是否重置读取位置到EventStore最早时间戳    | Boolean | false               |  
| quantex.phoenix.event-publish.parallelism                               | 并行度                                    | int     | 1                   |  
| quantex.phoenix.event-publish.enabled                                   | 总开关                                    | Boolean | true                |
| quantex.phoenix.event-publish.ack-timeout                               | EventPublish 批量投递到 Kafka 的超时时间,默认  10s | long    | 10,000              |
| quantex.phoenix.event-publish.monitor-task.enabled                      | 监控发布任务 开关                              | Boolean | 无                   |  
| quantex.phoenix.event-publish.monitor-task.es-server                    | 监控发布任务 上报ES服务地址                        | String  | 无                   |  
| quantex.phoenix.event-publish.d-data-task.broker-server                 | 分布式数据多播任务 Kafka 服务地址                   | String  | 无                   |  
| quantex.phoenix.event-publish.d-data-task.enabled                       | 分布式数据多播任务 开关                           | Boolean | 无                   |  
| quantex.phoenix.event-publish.d-data-task.properties                    | 分布式数据多播任务 Kafka 自定义配置                  | Map     | 无                   |  
| quantex.phoenix.event-publish.d-data-task.partition-selector-class-name | 自定义分区选择器实现类全路径名(FQCN)                  | String  | 无                   |
| quantex.phoenix.event-publish.event-task.enabled                        | 领域事件发布任务 开关                            | Boolean | 无                   |  
| quantex.phoenix.event-publish.event-task.properties                     | 领域事件发布任务 Kafka 自定义配置                   | Map     | 无                   |  
| quantex.phoenix.event-publish.event-task.topic                          | 领域事件发布任务 Kafka Topic                   | String  | 无                   |  
| quantex.phoenix.event-publish.event-task.broker-server                  | 领域事件发布任务 Kafka 服务地址                    | String  | 无                   |  
| quantex.phoenix.event-publish.event-task.partition-selector-class-name  | 自定义分区选择器实现类全路径名(FQCN)                  | String  | 无                   |

### Phoenix-Kafka-Extend 配置 \{#kafka-extend\}

| 配置项                                                         | 描述                                                                                 | 类型                 | 默认值      |  
|:------------------------------------------------------------|:-----------------------------------------------------------------------------------|:-------------------|:---------|
| quantex.phoenix.kafka.extend.enabled                        | 是否开启Kafka增强模式                                                                      | Boolean            | false    |  
| quantex.phoenix.kafka.extend.server-producer-enabled        | 是否开启 Server 的 Consumer 增强                                                          | Boolean            | false    |  
| quantex.phoenix.kafka.extend.client-consumer-enabled        | 是否开启 Client 的 Producer 增强                                                          | Boolean            | false    |  
| quantex.phoenix.kafka.extend.client-producer-enabled        | 是否开启 Server 的 Producer 增强                                                          | Boolean            | false    |  
| quantex.phoenix.kafka.extend.server-consumer-enabled        | 是否开启 Server 的 Consumer 增强                                                          | Boolean            | false    |  
| quantex.phoenix.kafka.extend.event-publish-producer-enabled | 是否开启 EventPublish 的 Producer 增强                                                    | Boolean            | false    |  
| quantex.phoenix.kafka.extend.spring-consumer-enabled        | 是否增加 Spring ConsumerFactory Bean                                                   | Boolean            | false    |  
| quantex.phoenix.kafka.extend.spring-producer-enabled        | 是否增加 Spring ProducerFactory Bean                                                   | Boolean            | false    |  
| quantex.phoenix.kafka.extend.max-message-bytes              | Spring 自定义 Kafka 配置, Consumer 和 Producer 复用                                        | `Map<String,String>` |          |
| quantex.phoenix.kafka.extend.max-message-bytes              | Producer: 普通消息的最大大小,超出则开始切分. 默认 50kb                                               | Long               | 51200    |  
| quantex.phoenix.kafka.extend.message-buffer-capacity        | Consumer: 用于缓冲不完整大消息段的内存总大小上限（默认是 30mb                                             | Long               | 32000000 |  
| quantex.phoenix.kafka.extend.message-expiration-offset-gap  | Consumer: LargeMessage 起始 Offset 和当前 Offset 最大差距值,超出则认为 Large Message 已不完整。默认 1000 | Long               | 1000     |  
| quantex.phoenix.kafka.extend.max-offset-track-pre-partition | Consumer: 每个分区要跟踪 Offset 的最大消息数,默认 500                                             | Long               | 500      |  

### Phoenix-Stream-Kafka 配置 \{#stream-kafka\}

| 配置项                                                | 描述                                                                     | 类型   | 默认值   |  
|:---------------------------------------------------|:-----------------------------------------------------------------------|:-----|:------|
| quantex.phoenix.kafka.stream.commit.timeout        | COMMIT 超时时间, 默认 30s                                                    | long | 30000 |  
| quantex.phoenix.kafka.stream.fetch.metrics.timeout | 查询 offset 进度超时时间, 默认 10s                                               | long | 10000 |  
| quantex.phoenix.kafka.stream.batch.size            | 攒批配置,最大批次                                                              | int  | 500   |  
| quantex.phoenix.kafka.stream.batch.time.window     | 最大时间窗口. 较长的时间会在频率较低的流量时获得更好的攒批效果, 以提高整体 带来的影响就是当客户端以同步的模式请求时, 延迟将会比较高. | long | 50    |  
| quantex.phoenix.kafka.stream.retry.attempts        | 最大重试次数                                                                 | int  | 10    |  
| quantex.phoenix.kafka.stream.retry.delay           | 重试间隔                                                                   | long | 200   |  
| quantex.phoenix.kafka.stream.deliver.timeout       | 交付 record 的最大超时时间                                                      | long | 1000  |  
| quantex.phoenix.kafka.stream.parallelism           | Consumer 并行度, 默认 1 降低资源消耗                                              | int  | 1     |  

### 配置样例 \{#config-example\}

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

### 自定义Akka配置 \{#custo-akka\}

因为 phoenix 中的部分功能依赖于 akka,所以存在一部分 akka 相关的配置。phoenix 已经抽取了一部分常用的配置集成到
phoenix-start 中,方便用户使用。 如果想要深入自定义 Akka
相关配置,可在项目Classpath目录下创建akka.conf文件进行配置。然后修改一下配置。

```yaml
quantex:
  phoenix:
    akka:
      akka-conf: akka.conf
```

### Phoenix 调优参数 \{#perf-config\}

##### Kafka Consumer 调优参数 \{#consumer-perf\}

Phoenix 对消息的处理实现了背压机制, 当下游处理时延过高时会触发限流,针对业务上的不同场景,提供下列参数以供调优性能。

下列参数属于：`quantex.phoenix.server.mq.properties`
和 `quantex.phoenix.server.mq.subscribe[].properties`, 前者是全局参数；后者是特定订阅的参数,且后者的优先级高于前者。

| 配置                                        | 描述                  | 类型     | 默认值               |
|-------------------------------------------|---------------------|--------|-------------------|
| transactionReliabilityMaxAge              | 在途事务最大年龄            | String | Integer.MAX_VALUE |
| transactionReliabilityRetryTimeIntervalMs | 消息重试投递等待间隔基数        | Long   | 10000             |
| transactionReliabilityBatchRetry          | 批量重试批次大小            | Long   | 50                |
| limitMaxLiveThings                        | 在途消息最大存活数           | Long   | 1000              |
| phoenix.connection.timeout                | Consumer 连接超时时间(ms) | Long   | 10000             |
| phoenix.max.connection.times              | Consumer 重试连接次数     | Int    | 3                 |
