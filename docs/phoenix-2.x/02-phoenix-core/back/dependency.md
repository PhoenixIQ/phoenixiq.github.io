---
id: phoenix-lite-dependency-2x
title: 依赖介绍
---

## maven依赖

| 依赖名 | 版本 | 作用 | 是否必须 |
|-----|-----|-----|-----|
|spring-boot|2.0.1-RELEASE|web、starter、工具包|是|
|akka|2.5.23|通讯调度|是|
|druid|1.1.10|jdbc连接池|是|
|shardingjdbc|2.0.3|分库|是|
|kafka-client|1.0.0(服务端2.12)|消息通讯|是|
|protobuf|3.4.0|序列化|是|
|guava|27.1-jre|工具包|是|
|fastjson(待移除)|1.2.47|序列化|是|
|reflections|0.9.10|反射工具包|是|
|ojdbc|11.2.0.3|oracle客户端|可选|
|mysql-connector|5.1.46|mysql客户端|可选|


## 组件依赖
| 组件名 | 版本 | 作用 | 是否必须 |
|-----|-----|-----|-----|
|kafka|2.12|消息通讯服务支持|生产必须|
|phoenix-admin|兼容版本|phoenix服务监控|否、建议生产必须使用|
|eureka|2.0.0|phoenix-admin接入需要|否|
|mysql|5.7+|事件存储|否、可选|
|oracle|11+|事件存储|否、可选|
|kubernetes|1.6+|集群运行|否、可选|

