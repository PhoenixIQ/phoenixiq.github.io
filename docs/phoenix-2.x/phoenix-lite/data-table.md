---
id: phoenix-lite-data-table-2x
title: 数据表
---

## EventStore 表设计

**表名：EVENT_STORE**

| **字段名称**       | **字段描述**   | **字段类型**  | **字段形式**     | **备注** |
| :----------------- | :------------- | :------------ | :--------------- | :------- |
| BIZ_AGGREGATE_TYPE | 业务聚合根类别 | VARCHAR2(255) | java的聚合根类名 |          |
| AGGREGATE_ID       | 聚合根ID       | VARCHAR2(255) |                  |          |
| VERSION            | 事件版本       | NUMBER(19)    | 数值递增         |          |
| IDEMPOTENT_ID      | 幂等ID         | VARCHAR2(64)  | UUID             |          |
| EVENT_CONTENT      | 事件内容       | BLOB          | 二进制内容       |          |
| CREATE_TIME        | 创建时间       | DATE          | 日期时分秒       |          |

**索引**

| **类别** | **变量名**             | **字段**                    |
| :------- | :--------------------- | :-------------------------- |
| 主键     | EVENT_STORE_PK         | AGGREGATE_ID、VERSION       |
| 唯一索引 | EVENT_STORE_CMD_ID_IDX | AGGREAGTE_ID、IDEMPOTENT_ID |

**事件表设计**

- 存储聚合根事件
  -  确保Event有序不丢，用于EventSoucing
  - 采用聚合根ID+事件版本作为唯一键
  - 支持按聚合根ID查找所有事件，并按事件版本进行排序
  - 存储事件内容：Event对应的二进制数据， 注意这里需要存储整个Message定义，因为幂等需要返回一样的Message消息到上游调用系统
  - 存储事件版本：每个聚合根都有版本属性，假设当前版本为N，在此状态下处理Cmd，产生的Event的版本为N+1，伪代码表示：
    - Event{version:N+1} = Aggregate{version:N}.handle(cmd)
    - Aggregate{version:N+1} = Aggregate{version:N}.apply(event{version:N+1})
- Cmd消息幂等处理
  - 同一个Cmd只只处理一次
  - 采用聚合根ID+cmdId作为唯一索引，确保同一个Cmd不会被聚合根处理两遍
  - 支持采用聚合根ID+cmdID查询指定Event消息，用于Cmd幂等处理，返回已处理的Event消息

---

## Snapshot 表设计 （待更新）

**表名：SNAPSHOT**

| **字段名称**   | **字段描述** | **字段类型**  | **字段形式**     | **备注** |
| :------------- | :----------- | :------------ | :--------------- | :------- |
| AGGREGATE_TYPE | 聚合根类别   | VARCHAR2(255) | java的聚合根类名 |          |
| AGGREGATE_ID   | 聚合根ID     | VARCHAR2(255) |                  |          |
| VERSION        | 版本         | NUMBER(19)    |                  |          |
| SNAPSHOT       | 快照内容     | BLOB          | 二进制内容       |          |
| CREATE_TIME    | 创建时间     | DATE          | 日期时分秒       |          |

**索引**

| **类别**         | **变量名**                  | **字段**              |
| :--------------- | :-------------------------- | :-------------------- |
| 主键             | SNAPSHOT_PK                 | AGGREGATE_ID、VERSION |
| 普通索引（可选） | SNAPSHOT_AGGREGATE_TYPE_IDX | AGGREGATE_TYPE        |


**快照处理逻辑**

- 由于快照是用于加速EventSourcing，不属于正常业务处理一部分，因此设计上将采用异步线程来处理打快照
- 采用EventSourcing恢复一个新的聚合根来进行快照处理，避免阻塞业务处理线程
- 快照触发机制
  - 支持聚合根每产生N个事件进行一次快照，N值可配，默认值：100。
  - 直接http调用触发指定聚合根打快照