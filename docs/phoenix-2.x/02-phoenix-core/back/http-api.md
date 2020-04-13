---
id: phoenix-lite-http-api-2x
title: HTTP API
---



## 聚合根ID列表查询

```
接口描述: 查询聚合根ID列表 

请求类型: GET

请求Url: /phoenix/aggregate_root/{key}/{pageSize}/{pageIndex}

备注: 当路径参数中的'key'为'all'的时候，为查询全部，否则是按关键字查询
```

**请求参数列表**

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| key | String | 查询关键字 |
| pageSize | Number | 分页查询 页大小 |
| pageIndex | Number | 分页查询 页下标 |

**响应参数列表**

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| code | Number |  状态码 |
| data | Object |  需要返回的数据 |
| msg | String |  描述信息 |

**example out**

```GET /phoenix/aggregate_root/all/20/1```
```json
{
    "code": 200,
    "codeDetail": null,
    "data": {
        "list": [
            "EA/BankAccount/A00000000",
            "EA/BankAccount/A00000001",
            "EA/BankAccount/A00000002",
            "EA/BankAccount/A00000003",
            "EA/BankAccount/A00000004",
            "EA/BankAccount/A00000005",
            "EA/BankAccount/A00000006",
            "EA/BankAccount/A00000007",
            "EA/BankAccount/A00000008",
            "EA/BankAccount/A00000009",
            "EA/BankAccount/baozi",
            "EA/BankAccount/sun"
        ],
        "totalRecord": 12
    }
}
```

## 快照版本列表查询

```
接口描述: 根据指定aggregateId分页查询该聚合根的快照版本列表 

请求类型: GET

请求Url: /phoenix/snapshot/{aggregateId}/{pageSize}/{pageIndex}
```

**请求参数列表**

| 字段        | 类型   | 描述            |
| :---------- | :----- | :-------------- |
| aggregateId | String | 聚合根类型      |
| pageSize    | String | 分页查询 页大小 |
| pageIndex   | String | 分页查询 页下标 |

**响应参数列表**

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| code | Number |  状态码 |
| data | Object |  需要返回的数据 |
| msg | String |  描述信息 |

**example out**

```GET /phoenix/snapshot/EA@BankAccount@ACC1/2/1```
```json
{     
    code:  200,     
    msg:     
    data: {           
       list:[               
           0,               
           2,           
       ]           
       totalRecord: 100
    }
}
```
---



## 打快照

```
接口描述: 给指定聚合根打最新的快照

请求类型: POST

请求Url: /phoenix/snapshot/{aggregateId}
```

请求参数列表

| 字段        | 类型   | 描述     |
| :---------- | :----- | :------- |
| aggregateId | String | 聚合根ID |

响应参数列表

| 变量名        | 类型   |   描述   |
| :---------- | :----- |  :----- |
| code | Number |  状态码 |
| data | Object |  需要返回的数据 |
| msg | String |  描述信息 |

**example out**

```POST /phoenix/snapshot/EA@BankAccount@ACC1```
```json
{     
    code:  200,     
    msg:     
    data:
}
```

## 删除快照

```
接口描述: 删除指定聚合根指定版本的快照

请求类型: DELETE

请求Url: /phoenix/snapshot/{aggregateId}/{version}
```

请求参数列表

| 字段        | 类型   | 描述     |
| :---------- | :----- | :------- |
| aggregateId | String | 聚合根ID |
| version     |        | 版本     |

响应参数列表

| 变量名 | 类型   | 描述           |
| :----- | :----- | :------------- |
| code   | Number | 状态码         |
| data   | Object | 需要返回的数据 |
| msg    | String | 描述信息       |

**example out**

```DELETE /phoenix/snapshot/EA@BankAccount@ACC1/12```
```json
{     
    code:  200,     
    msg:     
    data:
}
```

## 查看内存数据

```
接口描述: 查看指定聚合根的内存数据

请求类型: GET

请求Url: /phoenix/data/{aggregateId}/{version}

备注: 可以查看历史版本的内存数据。当version为-1的时候,查看当前内存数据 当version不为-1的时候，先load历史版本快照，再查看内存数据
```

请求参数列表

| 字段        | 类型   | 描述     |
| :---------- | :----- | :------- |
| aggregateId | String | 聚合根ID |
| version     | Number | 版本     |

响应参数列表

| 变量名 | 类型   | 描述           |
| :----- | :----- | :------------- |
| code   | Number | 状态码         |
| data   | Object | 需要返回的数据 |
| msg    | String | 描述信息       |

**example out**

```GET /phoenix/data/EA@BankAccount@sun/2```
```json
{
    "code"
    "codeDetail": null,
    "data": {
        "aggregateId": "EA/BankAccount/sun",
        "aggregateRoot": {
            "balanceAmt": 1369,
            "failTransferOut": 0,
            "successTransferIn": 3,
            "successTransferOut": 0
        },
        "aggregateRootType": "BankAccount",
        "version": 2
    }
 }
```

## 查看实例信息

```
接口描述: 获取实例的相关运行信息(补充中...)

请求类型: GET

请求Url: /phoenix/instance_info
```

响应参数列表

| 变量名 | 类型   | 描述           |
| :----- | :----- | :------------- |
| code   | Number | 状态码         |
| data   | Object | 需要返回的数据 |
| msg    | String | 描述信息       |

**example out**

```GET /phoenix/instance/info```
```json
{
    "msg": "",
    "code": 200,
    "data": {
        "healthState": 1,
        "runTime": 16
    }
}
```