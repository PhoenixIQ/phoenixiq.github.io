---
id: phoenix-lite-http-api-2x
title: HTTP API
---

## 条件查询

```
接口描述: 根据指定聚合ID查询聚合根对象 

请求类型: GET

请求Url : /root/{aggregateId}/aggregate
```

**请求参数列表**

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| aggregateId | String |  聚合Id |

**响应参数列表**

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| code | Number |  状态码 |
| data | Object |  需要返回的数据 |
| msg | String |  描述信息 |

**example out**

```json
{     
    code:  200,     
    msg:     
    data: {           
       aggregateId:           
       bizAggregateType:           
       version:           
       ...
    }
}
```
---

```
接口描述: 根据 aggregateRootType 分页查询聚合ID列表  

请求类型: GET

请求Url : /root/aggregate_id_list_by_aggregateRootType/{aggregateRootType}/{pageSize}/{pageIndex}
```

**请求参数列表**

| 字段              | 类型   |  描述            |
| :---------------- | :----- |  :-------------- |
| aggregateRootType | String |  聚合根类型      |
| pageSize          | String |  分页查询 页大小 |
| pageIndex         | String |  分页查询 页下标 |

**响应参数列表**

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| code | Number |  状态码 |
| data | Object |  需要返回的数据 |
| msg | String |  描述信息 |

**example out**

```json
{     
    code:  200,     
    msg:     
    data: {           
       list:[               
           "aggId1",               
           "aggId2",           
       ]           
       totalRecord: 100     
    }
}
```
---

## 模糊查询

```
接口描述: 根据聚合ID关键字模糊分页查询聚合ID列表 

请求类型: GET

请求Url : /root/aggregate_id_list/{key}/{pageSize}/{pageIndex}
```

请求参数列表

| 字段      | 类型   |  描述            |
| :-------- | :----- |  :-------------- |
| key       | String |  聚合Id 关键字   |
| pageSize  | String |  分页查询 页大小 |
| pageIndex | String |  分页查询 页下标 |

响应参数列表

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| code | Number |  状态码 |
| data | Object |  需要返回的数据 |
| msg | String |  描述信息 |

**example out**

```json
{     
    code:  200,     
    msg:     
    data: {           
       list:[               
           "aggId1",               
           "aggId2",           
       ]           
       totalRecord: 100     
    }
}
```