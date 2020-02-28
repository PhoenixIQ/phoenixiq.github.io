---
id: phoenix-lite-data-table-2x
title: 数据表
---

## EventStore 表

**表名：EVENT_STORE**

| **字段名称**       | **字段描述**   | **字段类型**  | **字段形式**     | **备注** |
| :----------------- | :------------- | :------------ | :--------------- | :------- |
| AGGREGATE_ROOT_TYPE | 聚合根类别 | VARCHAR2(255) | java的聚合根类名 |          |
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

---

## Snapshot 表

**表名：PHOENIX_SNAPSHOT**

| **字段名称**   | **字段描述** | **字段类型**  | **字段形式**     | **备注** |
| :------------- | :----------- | :------------ | :--------------- | :------- |
| AGGREGATE_ID   | 聚合根ID     | VARCHAR2(255) |  |  |
| VERSION        | 版本         | BIGINT(19)    | 整数，由0开始递增 |  |
| SNAPSHOT_DATA       | 快照内容     | BLOB          | 二进制内容       |          |
| CREATE_TIME    | 创建时间     | DATE          | 日期时分秒       |          |

**索引**

| **类别**         | **变量名**                  | **字段**              |
| :--------------- | :-------------------------- | :-------------------- |
| 主键             | SNAPSHOT_STORE_PK                 | AGGREGATE_ID、VERSION |
