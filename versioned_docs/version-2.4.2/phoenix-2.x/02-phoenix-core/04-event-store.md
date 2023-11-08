---
id: phoenix-core-event-store
title: 事件管理
---

## 设计思想
Phoenix维护内存状态，核心能力是使用EventSouring技术，Phoenix会定时打快照用来加速EventSouring的恢复。

![show](../../assets/phoenix2.x/phoenix-lite/eventsouring.png)

## EventStore-JDBC

Phoenix 默认使用的是 JDBC 版本的 EventStore, 请按下面步骤进行配置

1. 引用 phoenix-server-starter 的依赖

```xml
<dependency>
   <groupId>com.iquantex</groupId>
   <artifactId>phoenix-server-starter</artifactId>
   <version>2.4.2</version>
</dependency>
```

2. 在`application.yaml`中增加EventStore配置

其中可以给一个`DataSources`增加`label`隔离业务使用和系统使用,一般用于性能测试

```yaml
quantex:
  phoenix:
      event-store:
        driver-class-name: org.h2.Driver
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
          - url: jdbc:h2:file:./data2/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
            label: reliablity   # 配置Label让资源隔离(性能测试用)
        initial-size: 0
        min-idle: 0
        max-active: 8
```

3. 如果在测试过程中不想使用 EventStore 功能，可以进行如下配置：

```yaml
quantex:
  phoenix:
      event-store:
        no-eventstore: true
```

## 事件归档

在选择JDBC支持的数据库时，由于有些数据库不具备动态扩容的功能，事件的存储并不能一直存储下去，需要定期归档。目前调研下来的数据库有

- 不支持动态扩容的: Mysql,Oracle
- 支持动态扩容的: TIDB

数据库归档的主要逻辑是：可以归档掉最新快照之前的事件和快照(如果没有其他事后分析需求,也可以删除)。

目前Phoenix提供归档SQL来方便用户进行数据的归档操作。

**oracle版本**

```oracle
-- 归档快照表

-- 创建快照备份表
create table snapshot_store_his as
select *
from snapshot_store
where 0 = 1;

-- 归档快照, 条件snapshot.version < max(snapshot.version)
insert into snapshot_store_his
select *
from snapshot_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) s1
             where snapshot_store.aggregate_id = s1.aggregate_id
               and snapshot_store.version < s1.max_version);

-- 删除原表中已经归档的快照
delete
from snapshot_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) s1
             where snapshot_store.aggregate_id = s1.aggregate_id
               and snapshot_store.version < s1.max_version);

-- 归档事件表
-- 创建事件备份表
create table event_store_his as
select *
from event_store
where 0 = 1;

-- 归档事件, 条件event.version < max(snapshot.version)
insert into event_store_his
select *
from event_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) s1
             where event_store.aggregate_id = s1.aggregate_id
               and event_store.version < s1.max_version);
-- 删除原表中已归档的事件
delete
from event_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) s1
             where event_store.aggregate_id = s1.aggregate_id and event_store.version < s1.max_version);
```


**mysql版本**

```mysql
-- 归档快照表
-- 创建快照备份表
create table if not exists snapshot_store_his as select * from snapshot_store where 0=1;
-- 归档快照， 条件：snapshot.version < max(snapshot.version)
insert into snapshot_store_his
select *
from snapshot_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) as s1
             where snapshot_store.aggregate_id = s1.aggregate_id and snapshot_store.version < s1.max_version);
-- 删除原表中已归档的快照
delete
from snapshot_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) as s1
             where snapshot_store.aggregate_id = s1.aggregate_id and snapshot_store.version < s1.max_version);

-- 归档事件表
-- # 创建事件备份表
create table if not exists event_store_his as select * from event_store where 0=1;
-- # 归档事件，条件：event.version < max(snapshot.version)
insert into event_store_his
select *
from event_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) as s1
             where event_store.aggregate_id = s1.aggregate_id and event_store.version < s1.max_version);
-- # 删除原表中已归档的事件
delete
from event_store
where exists(select 1
             from (select aggregate_id, max(version) as max_version from snapshot_store group by aggregate_id) as s1
             where event_store.aggregate_id = s1.aggregate_id and event_store.version < s1.max_version);
```
