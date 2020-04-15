---
id: event-publish-use-2x
title: 使用说明
---

# Phoenix Event Publish 使用说明

## 启动运行

### 本地启动

1. 为方便本地测试运行，service-store配置可直接使用H2
2. 配置好event-store数据源（目前仅支持MYSQL），可选已部署好的数据源
3. mq地址（目前仅支持kafka）
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

### Docker运行

配置好event-store数据源后使用使用以下docker命令可以容器方式启动服务。

```shell
docker run --name event-publish \
-e quantex.phoenix.event-publish.event-store.data-sources.0.url={datasource.url} \
-e quantex.phoenix.event-publish.event-store.data-sources.0.username={username} \
-e quantex.phoenix.event-publish.event-store.data-sources.0.password={password} \
-e quantex.phoenix.event-publish.event-store.driver-class-name={driver} \
harbor.iquantex.com/phoenix/phoenix-event-publish:{tag}
```

## 服务配置

| **配置名** | **描述** | **类型** | **可选值** | **默认值** |  
|:----------|:---------|:--------|:----------|:----------|
| quantex.phoenix.event-publish.event-store.driver-class-name | EventStore数据库JDBC Driver类名 | String | "com.mysql.jdbc.Driver" / "oracle.jdbc.driver.OracleDriver" | 无 |
| quantex.phoenix.event-publish.event-store.data-sources[].url | EventStore数据库连接URL | String | / | 无 |
| quantex.phoenix.event-publish.event-store.data-sources[].username | EventStore数据库用户名 | String | / | 无 |
| quantex.phoenix.event-publish.event-store.data-sources[].password | EventStore数据库密码 | String | / | 无 |
| quantex.phoenix.event-publish.mq.address | 消息队列服务地址 | String | / | 无 |
| quantex.phoenix.event-publish.read-batch-size | 事件发布任务每次读取消息最大数量 | Int | [1, 1024] | 64 |
| quantex.phoenix.event-publish.service-store.driver-class-name | 服务状态存储数据库JDBC Driver类名 | String | "com.mysql.jdbc.Driver" / "oracle.jdbc.driver.OracleDriver" | 无 |
| quantex.phoenix.event-publish.service-store.username | 服务状态存储数据库 连接URL | String | / | 无 |
| quantex.phoenix.event-publish.service-store.username | 服务状态存储数据库 用户名 | String | / | 无 |
| quantex.phoenix.event-publish.service-store.password | 服务状态存储数据库 密码 | String | / | 无 |

## HTTP APIs

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

* taskName: 新建的事件发布任务名称
* publishTopic: 新建的事件发布任务的目标队列topic名称
* subscription: 新建的事件发布任务的聚合根订阅列表，列表中元素为领域聚合跟名称
* autoStart: 是否自动开启事件发布任务
* fromBegin: 是否从最早时间戳开始读取事件

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

## 设计文档

[设计文档](./doc/Event Publish设计文档.md)