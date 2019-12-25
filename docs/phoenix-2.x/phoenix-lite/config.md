---
id: phoenix-lite-config-2x
title: 配置
---

# Phoenix服务配置

| 配置项                                        | 描述                                                       | 类型    | 默认值 | 是否必填 | 重要等级 | 备注 | 有效值                                 |
| :-------------------------------------------- | :--------------------------------------------------------- | :------ | :----- | :------- | :------- | :--- | :------------------------------------- |
| Akka相关配置                                  |                                                            |         |        |          |          |      |                                        |
| quantex.phoenix.akka.akka-conf                | actorSystem的配置文件路径                                  | String  |        | 必填     | 高       |      | application.conf，application-k8s.conf |
| quantex.phoenix.akka.parallelism-min          | actorSystem的线程池配置最小并发数                          | Int     | 1      | 非必填   | 高       |      |                                        |
| quantex.phoenix.akka.parallelism-factor       | actorSystem的线程池配置线程比，即一个核配多少个线程；      | Double  | 3      | 非必填   | 高       |      |                                        |
| quantex.phoenix.akka.parallelism-max          | actorSystem的线程池配置最大并发数                          | Int     | 128    | 非必填   | 高       |      |                                        |
| quantex.phoenix.akka.service-name             | 服务名                                                     | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.akka.discovery-method         | 集群发现的方式                                             | String  |        | 必填     | 高       |      | config，kubernetes-api                 |
| quantex.phoenix.akka.cinnamon-application     |                                                            | String  | 无     | 必填     | 高       |      |                                        |
| 路由表（routers）配置                         |                                                            |         |        |          |          |      |                                        |
| quantex.phoenix.routers.message               | msgName                                                    | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.routers.dst                   | 目标地址   地址定义： 服务名/聚合类别/聚合根类别           | String  | 无     | 必填     | 高       |      |                                        |
| ServerWorker配置                              |                                                            |         |        |          |          |      |                                        |
| quantex.phoenix.server.name                   | Server端服务名                                             | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.server.mq.type                | MQ 类型                                                    | String  | 无     | 必填     | 高       |      | kafka                                  |
| quantex.phoenix.server.mq.group               | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.server.mq.address             | MQ 服务端地址                                              | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.server.mq.subscribe-topic     | Server端订阅的 topic                                       | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.server.use-kerberos           | 是否开启 kerberos 认证                                     | Boolean | false  | 非必填   | 低       |      | Kerberos 认证相关配置                  |
| quantex.phoenix.server.jaas-conf-path         | jaas配置文件路径                                           | String  | 无     | 非必填   | 低       |      |                                        |
| quantex.phoenix.server.krb5-conf-path         | krb5配置文件路径                                           | String  | 无     | 非必填   | 低       |      |                                        |
| quantex.phoenix.server.krb-service-name       | krb服务名                                                  | String  | 无     | 非必填   | 低       |      |                                        |
| quantex.phoenix.server..driver-class-name     | 数据库驱动                                                 | String  | 无     | 必填     | 高       |      | event store 相关配置                   |
| quantex.phoenix.server.event-stores.url       | 数据库 连接url                                             | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.server..event-stores.username | 数据库账户                                                 | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.server.event-stores.password  | 数据库密码                                                 | String  | 无     | 必填     | 高       |      |                                        |
| client相关配置                                |                                                            |         |        |          |          |      |                                        |
| quantex.phoenix.client.name                   | Client 端服务名                                            | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.client.mq.type                | MQ 类型                                                    | String  | 无     | 必填     | 高       |      | kafka                                  |
| quantex.phoenix.client.mq.group               | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.client.mq.address             | MQ 服务端地址                                              | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.client.mq.subscribe-topic     | Server端订阅的 topic                                       | String  | 无     | 必填     | 高       |      |                                        |
| quantex.phoenix.client.use-kerberos           | 是否开启 kerberos 认证                                     | Boolean | false  | 非必填   | 低       |      | Kerberos 认证相关配置                  |
| quantex.phoenix.client.jaas-conf-path         | jaas配置文件路径                                           | String  | 无     | 非必填   | 低       |      |                                        |
| quantex.phoenix.client.krb5-conf-path         | krb5配置文件路径                                           | String  | 无     | 非必填   | 低       |      |                                        |
| quantex.phoenix.client.krb-service-name       | krb服务名                                                  | String  | 无     | 非必填   | 低       |      |                                        |

## 相关配置样例：

```yaml
quantex:
  phoenix:
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

