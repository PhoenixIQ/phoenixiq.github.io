---
title: Phoenix2.0 EventStore设计
author: wenchang.lan
authorImageURL: https://gitlab.iquantex.com/uploads/-/system/user/avatar/2/avatar.png
---

## 设计目标

*   保证事件有序
*   保证消息幂等处理

<!--truncate-->

## EventStore 设计

聚合根数据结构

<table><colgroup><col><col><col><col></colgroup><tbody><tr><th><p><strong>成员</strong></p></th><th><p><strong>注释</strong></p></th><th><p><strong>类型</strong></p></th><th><p><strong>备注</strong></p></th></tr><tr><td><p>aggregateId</p></td><td><p>聚合根 ID</p></td><td><p>String</p></td><td></td></tr><tr><td><p>version</p></td><td><p>版本</p></td><td><p>long</p></td><td><p>初始值为 - 1，表示一个新聚合根对象</p></td></tr><tr><td><p>aggregateRoot</p></td><td><p>业务聚合根对象</p></td><td><p>Object</p></td><td></td></tr><tr><td><p>idempotentEventMsgs</p></td><td><p>消息幂等集合</p></td><td><p>Map&lt;String,Message&gt;</p></td><td><p>存储 cmdId 到 msgs 的映射</p></td></tr></tbody></table>

事件表设计

*   存储聚合根事件
    *    确保 Event 有序不丢，用于 EventSoucing
    *    采用聚合根 ID + 事件版本作为唯一键
    *    支持按聚合根 ID 查找所有事件，并按事件版本进行排序
    *    存储事件内容：Event 对应的二进制数据， 注意这里需要存储整个 Message 定义，因为幂等需要返回一样的 Message 消息到上游调用系统
    *    存储事件版本：每个聚合根都有版本属性，假设当前版本为 N，在此状态下处理 Cmd，产生的 Event 的版本为 N+1，伪代码表示：
         *   Event{version:N+1} = Aggregate{version:N}.handle(cmd)
         *   Aggregate{version:N+1} = Aggregate{version:N}.apply(event{version:N+1})
*   Cmd 消息幂等处理
    *   同一个 Cmd 只只处理一次
    *   采用聚合根 ID+cmdId 作为唯一索引，确保同一个 Cmd 不会被聚合根处理两遍
    *   支持采用聚合根 ID+cmdID 查询指定 Event 消息，用于 Cmd 幂等处理，返回已处理的 Event 消息

表名：EVENT_STORE

<table><colgroup><col><col><col><col><col></colgroup><tbody><tr><th><p><strong>字段名称</strong></p></th><th><p><strong>字段描述</strong></p></th><th><p><strong>字段类型</strong></p></th><th><p><strong>字段形式</strong></p></th><th><p><strong>备注</strong></p></th></tr><tr><td><p>AGGREGATE_TYPE</p></td><td><p>聚合根类别</p></td><td><p>VARCHAR2(255)</p></td><td><p>java 的聚合根类名</p></td><td></td></tr><tr><td><p>AGGREGATE_ID</p></td><td><p>聚合根 ID</p></td><td><p>VARCHAR2(255)</p></td><td></td><td></td></tr><tr><td><p>VERSION</p></td><td><p>事件版本</p></td><td><p>NUMBER(19)</p></td><td><p>数值递增</p></td><td></td></tr><tr><td><p>CMD_ID</p></td><td><p>命令 ID</p></td><td><p>CHAR(32)</p></td><td><p>UUID</p></td><td></td></tr><tr><td><p>EVENT_TYPE</p></td><td><p>事件类型</p></td><td><p>VARCHAR2(255)</p></td><td><p>java 的事件类名</p></td><td></td></tr><tr><td><p>EVENT_CONTENT</p></td><td><p>事件内容</p></td><td><p>BLOB</p></td><td><p>二进制内容</p></td><td></td></tr><tr><td><p>CREATE_TIME</p></td><td><p>创建时间</p></td><td><p>DATE</p></td><td><p>日期时分秒</p></td><td></td></tr></tbody></table>
<table><colgroup><col><col><col></colgroup><tbody><tr><th><p><strong>类别</strong></p></th><th><p><strong>变量名</strong></p></th><th><p><strong>字段</strong></p></th></tr><tr><td><p>主键</p></td><td><p>EVENT_STORE_PK</p></td><td><p>AGGREGATE_ID、VERSION</p></td></tr><tr><td><p>唯一索引</p></td><td><p>EVENT_STORE_CMD_ID_IDX</p></td><td><p>AGGREAGTE_ID、CMD_ID</p></td></tr></tbody></table>

```
 interface EventStore {
 
        /**
        * 持久化Event消息
        * @return 0: 成功;  1: 主键冲突;  2：aggregateId+cmdID唯一索引冲突; 3：持久化失败
        */
        int appendEvent(Message eventMsg);
 
 
    	/**
        *   读取指定聚合根指定起始版本之后的事件
        */
        List<Message> readEvents(String aggregateId, long startVersion);
 
 
   		/**
        *   读取指定聚合根ID + cmdId Event消息
        */
        Message readEvent(String aggregateId, String cmdId);
}

```

快照表设计

*   用途：加速 EventSourcing 过程
*   快照版本：对应快照聚合根的版本
*   快照内容：聚合根的二进制数据

表名：SNAPSHOT

<table><colgroup><col><col><col><col><col></colgroup><tbody><tr><th><p><strong>字段名称</strong></p></th><th><p><strong>字段描述</strong></p></th><th><p><strong>字段类型</strong></p></th><th><p><strong>字段形式</strong></p></th><th><p><strong>备注</strong></p></th></tr><tr><td><p>AGGREGATE_TYPE</p></td><td><p>聚合根类别</p></td><td><p>VARCHAR2(255)</p></td><td><p>java 的聚合根类名</p></td><td></td></tr><tr><td><p>AGGREGATE_ID</p></td><td><p>聚合根 ID</p></td><td><p>VARCHAR2(255)</p></td><td></td><td></td></tr><tr><td><p>VERSION</p></td><td><p>版本</p></td><td><p>NUMBER(19)</p></td><td></td><td></td></tr><tr><td><p>SNAPSHOT</p></td><td><p>快照内容</p></td><td><p>BLOB</p></td><td><p>二进制内容</p></td><td></td></tr><tr><td><p>CREATE_TIME</p></td><td><p>创建时间</p></td><td><p>DATE</p></td><td><p>日期时分秒</p></td><td></td></tr></tbody></table>
<table><colgroup><col><col><col></colgroup><tbody><tr><th><p><strong>类别</strong></p></th><th><p><strong>变量名</strong></p></th><th><p><strong>字段</strong></p></th></tr><tr><td><p>主键</p></td><td><p>SNAPSHOT_PK</p></td><td><p>AGGREGATE_ID、VERSION</p></td></tr><tr><td><p>普通索引（可选）</p></td><td><p>SNAPSHOT_AGGREGATE_TYPE_IDX</p></td><td><p>AGGREGATE_TYPE</p></td></tr></tbody></table>

快照处理逻辑

*   由于快照是用于加速 EventSourcing，不属于正常业务处理一部分，因此设计上将采用异步线程来处理打快照
*   采用 EventSourcing 恢复一个新的聚合根来进行快照处理，避免阻塞业务处理线程
*   快照触发机制
    *   支持聚合根每产生 N 个事件进行一次快照，N 值可配，默认值：100。
    *   直接 http 调用触发指定聚合根打快照

![](https://portal.iquantex.com/confluence/download/attachments/39747663/image2019-11-19_21-10-0.png?version=1&modificationDate=1574169499000&api=v2)  
接口设计

```
 interface EventStore{
 
        /**
        * 持久化聚合根快照
        * @return 0: 成功;  1：失败
        */
        int storeSnapshot(Aggregate aggreate);
 
 
    /**
        *   读取最新聚合根快照
        */
        Aggregate readNewestSnapshot(String aggregateId);
}

```