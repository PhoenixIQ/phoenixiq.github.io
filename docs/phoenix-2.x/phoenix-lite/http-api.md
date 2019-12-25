---
id: phoenix-lite-http-api-2x
title: HTTP API
---


```
/**  
 * 根据指定聚合ID查询聚合根对象  
 */ 
 
 GET /root/{aggregateId}/aggregate
```

入参

| 字段        | 类型   | 是否必填 | 描述   |
| :---------- | :----- | :------- | :----- |
| aggregateId | String | 必填     | 聚合Id |



```
/**  
 * 根据聚合ID关键字模糊分页查询聚合ID列表  
 */ 
 
 GET /root/aggregate_id_list/{key}/{pageSize}/{pageIndex}
```

入参

| 字段      | 类型   | 是否必填 | 描述            |
| :-------- | :----- | :------- | :-------------- |
| key       | String | 必填     | 聚合Id 关键字   |
| pageSize  | String | 必填     | 分页查询 页大小 |
| pageIndex | String | 必填     | 分页查询 页下标 |


```
/**  
 * 根据 aggregateRootType 分页查询聚合ID列表  
 */ 
 
 GET /root/aggregate_id_list_by_aggregateRootType/{aggregateRootType}/{pageSize}/{pageIndex}
```

入参

| 字段              | 类型   | 是否必填 | 描述            |
| :---------------- | :----- | :------- | :-------------- |
| aggregateRootType | String | 必填     | 聚合根类型      |
| pageSize          | String | 必填     | 分页查询 页大小 |
| pageIndex         | String | 必填     | 分页查询 页下标 |

