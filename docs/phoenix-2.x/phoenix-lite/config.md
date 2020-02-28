---
id: phoenix-lite-config-2x
title: 配置详情
---

## Phoenix 配置列表

Akka相关配置 

| 配置项                                              | 描述                                                      | 类型    | 默认值    | 
| :---------------------------------------------------| :---------------------------------------------------------| :------ | :-------- | 
| quantex.phoenix.akka.akka-conf                      | actorSystem的配置文件路径                                 | String  | 无        | 
| quantex.phoenix.akka.akka-parallelism-min           | actorSystem的线程池配置最小并发数                         | Int     | 1         | 
| quantex.phoenix.akka.akka-parallelism-factor        | actorSystem的线程池配置线程比，即一个核配多少个线程；     | Double  | 3         | 
| quantex.phoenix.akka.akka-parallelism-max           | actorSystem的线程池配置最大并发数                         | Int     | 128       | 
| quantex.phoenix.akka.service-name                   | 服务名                                                    | String  | 服务名    | 
| quantex.phoenix.akka.discovery-method               | 集群发现的方式                                            | String  | config    | 
| quantex.phoenix.akka.cinnamon-application           | 服务名                                                    | String  | 服务名    | 
| quantex.phoenix.akka.provider                       | 运行模式                                                  | String  | cluster   |
| quantex.phoenix.akka.artery-enable                  | remote.artery 开关                                        | String  | on        |
| quantex.phoenix.akka.artery-transport               | 传输方式                                                  | String  | tcp       |
| quantex.phoenix.akka.artery-canonical-port          | 远程服务器端口                                            | Int     | 2551      |
| quantex.phoenix.akka.artery-canoniacal-hostname     | 远程服务器地址                                            | String  | 127.0.0.1 |
| quantex.phoenix.akka.seed-node                      | 集群的初始接触点                                          | List    | akka:// + 服务名 + @127.0.0.1:2551 |
| quantex.phoenix.akka.method                         | 服务发现的方式                                            | String  | akka-dns  |
| quantex.phoenix.akka.pod-label-selector             | 服务发现的pod标签                                         | String  | app=%s    |
| quantex.phoenix.akka.management-http-port           | 用于集群管理的端口                                        | Int     | 8558      |
| quantex.phoenix.akka.management-http-bind-hostname  | 绑定内部（0.0.0.0:8558）                                  | String  | 0.0.0.0   |


路由表（routers）配置 

| 配置项                                        | 描述                                                       | 类型    | 默认值 | 
| :-------------------------------------------- | :--------------------------------------------------------- | :------ | :----- | 
| quantex.phoenix.routers[].message               | msgName                                                    | String  | 无     | 
| quantex.phoenix.routers[].dst                   | 目标地址   地址定义： 服务名/聚合类别/聚合根类别           | String  | 无     | 

ServerWorker配置  

| 配置项                                                         | 描述                                                       | 类型    | 默认值 | 
| :-------------------------------------------------------------| :--------------------------------------------------------- | :------ | :----- | 
| quantex.phoenix.server.name                                   | Server端服务名                                             | String  | 无     | 
| quantex.phoenix.server.mq.type                                | MQ 类型                                                    | String  | kafka     | 
| quantex.phoenix.server.mq.group                               | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String   | Server端服务名 | 
| quantex.phoenix.server.mq.address                             | MQ 服务端地址                                              | String  | 无     | 
| quantex.phoenix.server.mq.subscribe-topic                     | Server端订阅的 topic                                       | String  | Server端服务名 | 
| quantex.phoenix.server.mq.use-kerberos                           | 是否开启 kerberos 认证                                     | Boolean | false  | 
| quantex.phoenix.server.mq.jaas-conf-path                         | jaas配置文件路径                                           | String  | 无     | 
| quantex.phoenix.server.mq.krb5-conf-path                         | krb5配置文件路径                                           | String  | 无     | 
| quantex.phoenix.server.mq.krb-service-name                       | krb服务名                                                  | String  | 无     | 
| quantex.phoenix.server.event-stores.driver-class-name         | 数据库驱动                                                 | String  | 无     | 
| quantex.phoenix.server.event-stores.data-sources[].url        | 数据库 连接url                                             | String  | 无     | 
| quantex.phoenix.server.event-stores.data-sources[].username   | 数据库账户                                                 | String  | 无     | 
| quantex.phoenix.server.event-stores.data-sources[].password   | 数据库密码                                                 | String  | 无     | 
| quantex.phoenix.server.event-stores.snapshot.enable                   | 是否开启快照                                       |Boolean  | false      |
| quantex.phoenix.server.event-stores.snapshot.entity-snapshot-interval | 聚合根快照版本间隔                                  |Long     |1000|
| quantex.phoenix.server.performance.batch-process                     | EntityAggregateActor 批量向子Actor发送消息进行处理               | Int | 100  |
| quantex.phoenix.server.performance.idempotent-size                   | EntityAggregate 幂等集合大小                                     | Int | 1000 |
| quantex.phoenix.server.performance.recv-by-nofinished                | AtLeastOneDeliveryActor 根据未完成事务个数判断是否继续接收消息   | Int | 5000 |
| quantex.phoenix.server.performance.batch-finished                    | AtLeastOneDeliveryActor 批量处理结束的事务                       | Int | 1000 |
| quantex.phoenix.server.performance.retry-by-nofinished               | AtLeastOneDeliveryAggregate 根据未完成事务个数判断是否继续重试 | Int | 10000|
| quantex.phoenix.server.performance.batch-retry                       | AtLeastOneDeliveryAggregate 批量持久化                           | Int | 1000 |
| quantex.phoenix.server.performance.batch-persist                     | event-store 批量持久化 批次大小                                  | Int | 200  |


client相关配置

| 配置项                                        | 描述                                                       | 类型    | 默认值 | 
| :-------------------------------------------- | :--------------------------------------------------------- | :------ | :----- | 
| quantex.phoenix.client.name                   | Client 端服务名                                            | String  | 无     | 
| quantex.phoenix.client.mq.type                | MQ 类型                                                    | String  | kafka     | 
| quantex.phoenix.client.mq.group               | client端服务消费组名，对应kafka和rocketmq中的consumergroup | String  | Client端服务名     | 
| quantex.phoenix.client.mq.address             | MQ 服务端地址                                              | String  | 无     | 
| quantex.phoenix.client.mq.subscribe-topic     | Server端订阅的 topic                                       | String  | Client端服务名    | 
| quantex.phoenix.client.use-kerberos           | 是否开启 kerberos 认证                                     | Boolean | false  | 
| quantex.phoenix.client.jaas-conf-path         | jaas配置文件路径                                           | String  | 无     | 
| quantex.phoenix.client.krb5-conf-path         | krb5配置文件路径                                           | String  | 无     | 
| quantex.phoenix.client.krb-service-name       | krb服务名                                                  | String  | 无     | 

## Phoenix 配置样例

```yaml
quantex:
  phoenix:
    routers:
      - message: com.iquantex.phoenix.bankaccount.api.AccountAllocateCmd
        dst: account-server/EA/BankAccount
      - message: com.iquantex.phoenix.bankaccount.api.AccountTransferReq
        dst: account-tn/TA/BankTransferSaga
    server:
      performance:
        batch-process: 100
        idempotent-size: 1000
        recv-by-nofinished: 5000
        batch-finished: 1000
        retry-by-nofinished: 10000
        batch-retry: 1000
        batch-persist: 200
      name: ${spring.application.name}
      mq:
        type: kafka
        address: embedded
        group: ${spring.application.name}
        subscribe-topic: ${spring.application.name}
      event-stores:
        driver-class-name: org.h2.Driver
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
        snapshot:
          enabled: true
          entity-snapshot-interval: 1000
    client:
      name: ${spring.application.name}-client
      mq:
        type: kafka
        group: ${spring.application.name}-client
        address: embedded
        subscribe-topic: ${spring.application.name}-client
```

### 环境配置参考

phoenix服务在不同的环境中运行需要对akka进行相应的配置。下面分别介绍下phoenix服务在本地环境和K8s环境运行时 akka的配置项需要如何配置。

#### 本地单点运行

不用在 `application.yaml` 或者 `application.properties` 中显示配置akka相关配置，直接启动即可。

#### 本地集群运行

添加或修改以下两项配置，保证多个实例的端口不能冲突。

```yaml
server:
  port: 8080

quantex:
  phoenix:
    akka:
      artery-canonical-port: 2551
```

### k8s集群运行

在 k8s 环境上运行需要对以下配置进行修改

```yaml
quantex:
  phoenix:
    akka:
      discovery-method: kubernetes-api
      artery-enabled: off
```


### 自定义akka配置

如果想要深入自定义akka相关配置，可在项目classpath目录下创建akka.conf文件进行配置。然后修改一下配置。

```yaml
quantex:
  phoenix:
    akka:
      akka-conf: akka.conf
```