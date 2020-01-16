---
id: phoenix-lite-config-2x
title: 配置
---

## Phoenix 配置列表

| 配置项                                        | 描述                                                       | 类型    | 默认值 | 
| :-------------------------------------------- | :--------------------------------------------------------- | :------ | :----- | 
| Akka相关配置                                  |                                                            |         |        | 
| quantex.phoenix.akka.akka-conf                | actorSystem的配置文件路径                                  | String  | application.conf      | 
| quantex.phoenix.akka.parallelism-min          | actorSystem的线程池配置最小并发数                          | Int     | 1      | 
| quantex.phoenix.akka.parallelism-factor       | actorSystem的线程池配置线程比，即一个核配多少个线程；      | Double  | 3      | 
| quantex.phoenix.akka.parallelism-max          | actorSystem的线程池配置最大并发数                          | Int     | 128    | 
| quantex.phoenix.akka.service-name             | 服务名                                                     | String  | 服务名 | 
| quantex.phoenix.akka.discovery-method         | 集群发现的方式                                             | String  | config | 
| quantex.phoenix.akka.cinnamon-application     |                                                            | String  | 服务名 | 
|      |       |       |        | 
| 路由表（routers）配置                         |                                                            |         |        | 
| quantex.phoenix.routers.message               | msgName                                                    | String  | 无     | 
| quantex.phoenix.routers.dst                   | 目标地址   地址定义： 服务名/聚合类别/聚合根类别           | String  | 无     | 
|      |       |       |        | 
| ServerWorker配置                              |                                                            |         |        | 
| quantex.phoenix.server.name                   | Server端服务名                                             | String  | 无     | 
| quantex.phoenix.server.mq.type                | MQ 类型                                                    | String  | kafka     | 
| quantex.phoenix.server.mq.group               | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String  | 无     | 
| quantex.phoenix.server.mq.address             | MQ 服务端地址                                              | String  | 无     | 
| quantex.phoenix.server.mq.subscribe-topic     | Server端订阅的 topic                                       | String  | 无     | 
| quantex.phoenix.server.use-kerberos           | 是否开启 kerberos 认证                                     | Boolean | false  | 
| quantex.phoenix.server.jaas-conf-path         | jaas配置文件路径                                           | String  | 无     | 
| quantex.phoenix.server.krb5-conf-path         | krb5配置文件路径                                           | String  | 无     | 
| quantex.phoenix.server.krb-service-name       | krb服务名                                                  | String  | 无     | 
| quantex.phoenix.server..driver-class-name     | 数据库驱动                                                 | String  | 无     | 
| quantex.phoenix.server.event-stores.url       | 数据库 连接url                                             | String  | 无     | 
| quantex.phoenix.server..event-stores.username | 数据库账户                                                 | String  | 无     | 
| quantex.phoenix.server.event-stores.password  | 数据库密码                                                 | String  | 无     | 
| quantex.phoenix.performance.batch-process     | EntityAggregateActor 批量向子Actor发送消息进行处理               | Int | 100  |
| quantex.phoenix.performance.idempotent-size   | EntityAggregate 幂等集合大小                                     | Int | 1000 |
| quantex.phoenix.performance.recv-by-nofinished| AtLeastOneDeliveryActor 根据未完成事务个数判断是否继续接收消息   | Int | 5000 |
| quantex.phoenix.performance.batch-finished    | AtLeastOneDeliveryActor 批量处理结束的事务                       | Int | 1000 |
| quantex.phoenix.performance.retry-by-nofinished | AtLeastOneDeliveryAggregate 根据未完成事务个数判断是否继续重试 | Int | 10000|
| quantex.phoenix.performance.batch-retry       | AtLeastOneDeliveryAggregate 批量持久化                           | Int | 1000 |
| quantex.phoenix.performance.batch-persist     | event-store 批量持久化 批次大小                                  | Int | 200  |
|      |       |       |        | 
| client相关配置                                |                                                            |         |        | 
| quantex.phoenix.client.name                   | Client 端服务名                                            | String  | 无     | 
| quantex.phoenix.client.mq.type                | MQ 类型                                                    | String  | kafka     | 
| quantex.phoenix.client.mq.group               | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String  | 无     | 
| quantex.phoenix.client.mq.address             | MQ 服务端地址                                              | String  | 无     | 
| quantex.phoenix.client.mq.subscribe-topic     | Server端订阅的 topic                                       | String  | 无     | 
| quantex.phoenix.client.use-kerberos           | 是否开启 kerberos 认证                                     | Boolean | false  | 
| quantex.phoenix.client.jaas-conf-path         | jaas配置文件路径                                           | String  | 无     | 
| quantex.phoenix.client.krb5-conf-path         | krb5配置文件路径                                           | String  | 无     | 
| quantex.phoenix.client.krb-service-name       | krb服务名                                                  | String  | 无     | 
|      |       |       |        | 



## Phoenix 配置样例

```yaml
quantex:
  phoenix:
    performance:
      batch-process: 100
      idempotent-size: 1000
      recv-by-nofinished: 5000
      batch-finished: 1000
      retry-by-nofinished: 10000
      batch-retry: 1000
      batch-persist: 200
    akka:
      akka-conf: application.conf                     # 这里指定akka的配置文件
      akka-parallelism-min: 1
      akka-parallelism-factor: 3
      akka-parallelism-max: 128
      service-name: ${spring.application.name}
      discovery-method: config
      cinnamon-application: ${spring.application.name}
    routers:
      - message: com.iquantex.phoenix.bankaccount.api.AccountAllocateCmd
        dst: account-server/EA/BankAccount
      - message: com.iquantex.phoenix.bankaccount.api.AccountTransferReq
        dst: account-tn/TA/BankTransferSaga
    server:
      name: ${spring.application.name}
      mq:
        type: kafka
        address: embedded
        group: ${spring.application.name}
        subscribe-topic: ${spring.application.name}
      snapshot-enabled: true
      driver-class-name: org.h2.Driver
      event-stores:
        - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
          username: sa
          password:
    client:
      name: ${spring.application.name}-client
      mq:
        type: kafka
        group: ${spring.application.name}-client
        address: embedded
        subscribe-topic: ${spring.application.name}-client

```

