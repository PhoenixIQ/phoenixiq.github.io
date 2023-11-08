---
id: phoenix-core-config-2x
title: 配置详情
---

## Phoenix 配置列表

### phoenix-akka配置 

| 配置项                                               | 描述                                                      | 类型    | 默认值                         |
| :---------------------------------------------------| :---------------------------------------------------------| :------ | :--------                     |
| quantex.phoenix.akka.akka-conf                      | actorSystem的配置文件路径                                   | String  | 无                              |
| quantex.phoenix.akka.akka-parallelism-min           | actorSystem的线程池配置最小并发数                            | Int     | 1                                 |
| quantex.phoenix.akka.akka-parallelism-factor        | actorSystem的线程池配置线程比，即一个核配多少个线程；           | Double  | 3                                |
| quantex.phoenix.akka.akka-parallelism-max           | actorSystem的线程池配置最大并发数                            | Int     | 128                           |
| quantex.phoenix.akka.service-name                   | 服务名                                                     | String  | 服务名                         |
| quantex.phoenix.akka.discovery-method               | 集群发现的方式                                              | String  | config <br /> 可选值：config /  kubernetes-api    |
| quantex.phoenix.akka.cinnamon-application           | 服务名                                                     | String  | 服务名    |
| quantex.phoenix.akka.provider                       | 运行模式                                                   | String  | cluster <br /> 可选值：local / cluster / remote   |
| quantex.phoenix.akka.artery-enable                  | remote.artery 开关                                        | String  | on <br />可选值：on / off        |
| quantex.phoenix.akka.artery-transport               | 传输方式                                                   | String  | tcp <br /> 可选值：tcp / tls-tcp /  aeron-udp       |
| quantex.phoenix.akka.artery-canonical-port          | 远程服务器端口                                              | Int     | 2551      |
| quantex.phoenix.akka.artery-canonical-hostname      | 远程服务器地址                                              | String  | 127.0.0.1 |
| quantex.phoenix.akka.artery-bind-hostname           | 可绑定的ip地址                                              | String  | 0.0.0.0 |
| quantex.phoenix.akka.seed-node                      | 集群的初始接触点                                            | List    | akka:// + 服务名 + @127.0.0.1:2551 |
| quantex.phoenix.akka.method                         | 服务发现的方式                                              | String  | akka-dns  |
| quantex.phoenix.akka.pod-label-selector             | 服务发现的pod标签                                           | String  | app=%s    |
| quantex.phoenix.akka.management-http-port           | 用于集群管理的端口                                           | Int     | 8558      |
| quantex.phoenix.akka.management-http-bind-hostname  | 绑定内部（0.0.0.0:8558）                                    | String  | 0.0.0.0   |
| quantex.phoenix.akka.executor                       | 线程池类型                                                   | akka executor  | thread-pool-executor   |
| quantex.phoenix.akka.fixedPoolSize                  | 固定线程池中线程数量  默认值设为 500                           |int  |500   |
| quantex.phoenix.akka.k8sPodDomain                  | k8s服务发现默认集群域名后缀                           |String  |cluster.local   |


### Phoenix-server配置  

| 配置项                                                         | 描述                                                       | 类型    | 默认值 |
| :-------------------------------------------------------------                        | :--------------------------------------------------------- | :------ | :----- |
| quantex.phoenix.server.name                                                           | Server端服务名                                             | String  | 无     |
| quantex.phoenix.server.packageName                                                    | 聚合根包所在路径                                             | String  | 无     |
| quantex.phoenix.server.mq.type                                                        | MQ 类型                                                    | String  | kafka     |
| quantex.phoenix.server.mq.address                                                     | MQ 服务端地址                                              | String  | 无     |
| quantex.phoenix.server.mq.group                                                       | Server端服务消费组名，对应kafka和rocketmq中的consumergroup | String   | Server端服务名 |
| quantex.phoenix.server.mq.subscribes-topic                                            | Server端订阅的 topic                                       | String  | 无 |
| quantex.phoenix.server.mq.use-kerberos                                                | 是否开启 kerberos 认证                                     | Boolean | false  |
| quantex.phoenix.server.mq.jaas-conf-path                                              | jaas配置文件路径                                           | String  | 无     |
| quantex.phoenix.server.mq.krb5-conf-path                                              | krb5配置文件路径                                           | String  | 无     |
| quantex.phoenix.server.mq.krb-service-name                                            | krb服务名                                                  | String  | 无     |
| quantex.phoenix.server.event-store.driver-class-name                                  | 数据库驱动                                                 | String  | 可选值：<br /> org.h2.Driver <br /> com.mysql.jdbc.Driver <br /> oracle.jdbc.OracleDriver <br />   |
| quantex.phoenix.server.event-store.initial-size                                       | 初始连接池大小                                              | int  | 2     |
| quantex.phoenix.server.event-store.min-idle                                           | 最小连接池大小                                              | int  | 2     |
| quantex.phoenix.server.event-store.max-active                                         | 最大连接池大小                                              | int  | 8     |
| quantex.phoenix.server.event-store.data-sources[].url                                 | 数据库 连接url                                             | String  | 无     |
| quantex.phoenix.server.event-store.data-sources[].username                            | 数据库账户                                                 | String  | 无     |
| quantex.phoenix.server.event-store.data-sources[].password                            | 数据库密码                                                 | String  | 无     |
| quantex.phoenix.server.license                                                        | 认证license，需要向Phoenix官方申请                          | String  | 无     |
| quantex.phoenix.server.performance.transaction-reliability-maxAge                     | 全局SimpleLeastOneDeliveryStrategy 在途事务最大年龄          | int | 5  |
| quantex.phoenix.server.performance.transaction-reliability-retry-time-interval-ms     | 全局SimpleLeastOneDeliveryStrategy 消息重试投递等待间隔基数    | int | 5000  |
| quantex.phoenix.server.performance.transaction-reliability-batch-retry                | 全局SimpleLeastOneDeliveryStrategy批量重试大小 批量重试批次大小 | Int | 100   |
| quantex.phoenix.server.performance.limit-max-live-things                              | 全局CountLimitHandler 最大存活事情                           | Int | 5000    |
| quantex.phoenix.server.performance.limit-max-remove-timeout-ms                        | 全局CountLimitHandler 最大移除超时时间                        | Int | 100000 |
| quantex.phoenix.server.performance.batch-process                                      | EntityAggregateActor 批量向子Actor发送消息进行处理            |  Int | 100   |
| quantex.phoenix.server.performance.batch-persist                                      | 消息持久化 批次大小                                          | Int | 200    |
| quantex.phoenix.server.performance.event-sourcing-read-batch-size                     | Event Sourcing 事件读取的分页大小                            | Int | 1000   |


### Phoenix-client配置

| 配置项                                        | 描述                                                       | 类型    | 默认值 |
| :--------------------------------------------     | :--------------------------------------------------------- | :------ | :----- |
| quantex.phoenix.client.name                       | Client 端服务名                                             | String  | 无     |
| quantex.phoenix.client.maxRetryNum                | 最大重试次数（默认重试3次），如果设置为MAX_VALUE则表示关闭重试逻辑 | int  | 2     |
| quantex.phoenix.client.retryInterval              | 重试间隔（单位毫秒,默认10s）                                  | long  | 1000000000     |
| quantex.phoenix.client.mq.type                    | MQ 类型                                                    | String  | kafka     |
| quantex.phoenix.client.mq.group                   | client端服务消费组名，对应kafka和rocketmq中的consumergroup    | String  | Client端服务名     |
| quantex.phoenix.client.mq.address                 | MQ 服务端地址                                               | String  | 无     |
| quantex.phoenix.client.mq.subscribe-topic         | Server端订阅的 topic                                        | String  | Client端服务名    |
| quantex.phoenix.client.mq.use-kerberos            | 是否开启 kerberos 认证                                      | Boolean | false  |
| quantex.phoenix.client.mq.jaas-conf-path          | jaas配置文件路径                                            | String  | 无     |
| quantex.phoenix.client.mq.krb5-conf-path          | krb5配置文件路径                                            | String  | 无     |
| quantex.phoenix.client.mq.krb-service-name        | krb服务名                                               | String  | 无     |

### Phoenix-admin配置

**该配置表示Phoenix应用接入Phoenix-admin所需要的配置**

| 配置项                                      | 描述                        | 类型    | 默认值  |
| :------------------------------------------ | :-------------------------- | :------ | :------ |
| eureka.client.enabled                       | 是否启用eureka客户端        | Boolean | true    |
| eureka.client.serviceUrl.defaultZone        | eureka server地址           | String  | 无      |
| eureka.client.fetch-registry                | 从eureka server同步注册信息 | Boolean | true    |
| eureka.client.register-with-eureka          | 注册自身信息到eureka server | Boolean | true    |
| eureka.instance.prefer-ip-address           | 是否优先使用ip注册          | Boolean | false   |
| eureka.instance.appname                     | 注册的服务名                | String  | UNKNOWN |
| eureka.instance.metadata-map.phoenixEnabled | 是否接入Phoenix-admin监控   | String  | 无      |
| eureka.instance.metadata-map.servletPath    | 服务的http请求路径          | String  | 无      |

### 配置样例

```yaml
quantex:
  phoenix:
    server:
      name: ${spring.application.name}
      mq:
        type: kafka
        address: embedded
        subscribe-topic: account-server
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

# eureka  config
service-center:
  url: localhost:7070
eureka:
  client:
    enabled: false
    serviceUrl:
      defaultZone: http://${service-center.url}/eureka/
    fetch-registry: true
    register-with-eureka: true
  instance:
    prefer-ip-address: true
    appname: ${spring.application.name}
    metadata-map:
      phoenixEnabled: true

```

## 环境配置参考

phoenix服务在不同的环境中运行需要对akka进行相应的配置。下面分别介绍下phoenix服务在本地环境和K8s环境运行时 akka的配置项需要如何配置。

### 本地单点运行

直接启动即可，不用在 `application.yaml` 或者 `application.properties` 中显式配置akka相关配置。

### 本地集群运行

添加或修改以下几项配置，保证多个实例的端口不能冲突。

```yaml
server:
  port: 8080

quantex:
  phoenix:
    akka:
      artery-canonical-port: 2552  # 集群端口
      management-http-port: 8559 # 集群管理的http端口 
      artery-canonical-hostname: 192.168.1.9   # 节点的ip地址
      seed-node: akka://account-server@192.168.1.9:2551,akka://account-server@192.168.1.9:2552  # 集群中seed-node的节点地址,一般会把所有节点都设置, 另外`account-server`要和应用${spring.application.name}的名字相同
```

### k8s集群运行

在 k8s 环境上运行需要对以下配置进行修改

```yaml
quantex:
  phoenix:
    akka:
      discovery-method: kubernetes-api
      artery-enable: off
```


### 自定义akka配置

如果想要深入自定义akka相关配置，可在项目classpath目录下创建akka.conf文件进行配置。然后修改一下配置。

```yaml
quantex:
  phoenix:
    akka:
      akka-conf: akka.conf

```