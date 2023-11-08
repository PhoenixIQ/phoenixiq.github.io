---
id: phoenix-distributed-data
title: 分布式数据
---

## 功能介绍

当需要在 Phoenix 集群中的多个节点间使用共享数据时，可以使用 Phoenix 提供的分布式数据功能。

![](../../assets/phoenix2.x/phoenix-core/01.png)

* 该功能提供了一类特殊的聚合根用来专门维护所有的分布式数据, 默认以具体的分布式数据的 className 作为区分, 每类分布式数据单独一个聚合根进行维护
* 该功能提供了一系列的 API 供 Phoenix 服务对分布式数据进行 新增/更新/查询/订阅/取消订阅 等操作
* 该功能提供默认的 Event-Publish 任务ddata-task （该任务默认开启, 可通过 quantex.phoenix.event-publish.enable-ddata-task=false 进行关闭）, 当更新分布式数据时, ddata-task 会将分布式数据更新事件转换为分布式数据变更命令, 同时根据该分布式数据与业务聚合根之间的订阅关系, 将分布式数据变更命令进行多播。

## API 介绍

根据上面的功能介绍，分布式数据大体上可以分为两部分, 共客户端使用的 API 以及服务端根据Event-Publish功能提供的更新的功能。

只要引入了分布式DGC的依赖, 就可以使用客户端API。

### 客户端 API

分布式数据提供两种分布式数据类型：DDataMap和DistributedDataRemote

- DistributedDataRemote: 与分布式数据服务端通信的工具,可以利用该API方便的进行分布式数据的维护.该对象不支持序列化.
- DDataMap: 屏蔽与通信细节,提供一个Map结构的使用方式,支持序列化,可以再聚合根当中当做普通对象使用.


```java
public interface DistributeDataManager {

    String NAME = "distributeDataManager";

    /**
     * 获取分布式远程通信工具
     *
     * @return
     */
    DistributedDataRemote getDistributedDataRemote();

    /**
     * 创建一个map结构的分布式数据
     *
     * @param cls
     * @param targetTopic
     * @param selfTopic
     * @param <VALUE>
     * @return
     */
    <VALUE> DDataMap<VALUE> create(Class<VALUE> cls, String targetTopic, String selfTopic);
}

```

### 更新分布式数据

服务端的更新功能，可以通过参数控制。

```yaml
quantex:
  phoenix:
    event-publish:
      enable-ddata-task: true
```

## 使用说明

1. 引用依赖

```xml
<dependency>
  <groupId>com.iquantex</groupId>
  <artifactId>phoenix-distributed-data-starter</artifactId>
  <version>2.4.0</version>
</dependency>
```

2. 使用案例1: DistributedDataRemote
```java
@Autowired private DistributeDataManager distributeDataManager;
        
// 1. 添加分布式数据
distributeDataManager
        .getDistributedDataRemote()
        .addDData(MarketInfo.class, secCode, market1, SysConfig.getInstance().targetTopic);
// 2. 移除分布式数据
distributeDataManager.getDistributedDataRemote()
        .remove(MarketInfo.class,secuCode,SysConfig.getInstance().targetTopic,
        SysConfig.getInstance().selfTopic);
//3. 查询分布式数据
manager.queryDData(cls, ddataCode, targetTopic);
// 4. 获取并订阅分布式数据
manager.getDData(cls, ddataCode, targetTopic, selfTopic)
```


3. 使用案例2: DDataMap

```java
@Getter private DDataMap<MarketInfo> marketInfoDDataMap;
@Autowired private DistributeDataManager distributeDataManager;

distributeDataManager.create(
        MarketInfo.class,
        SysConfig.getInstance().targetTopic,
        SysConfig.getInstance().selfTopic);

// 1. 查询分布式数据（不建立订阅关系）
marketInfoDData.query(market.getSecuCode());
// 2. 查询分布式数据（建立订阅关系）
marketInfoDData.get(market.getSecuCode());
// 3. 移除本地缓存 & 移除订阅关系
marketInfoDData.remove(market.getSecuCode());
// 4. 更新本地缓存的值
marketInfoDData.remove(newMarket.getSecuCode(), newMarket);
```

3. 更新分布式数据

在使用分布式数据API时,如果聚合根订阅了分布式数据,在数据变更时则会以命令的方式推送到聚合根.用户需要接收该命令,灵活选择是否需要更新本地缓存.使用方式如下:

```java
@EntityAggregateAnnotation(aggregateRootType = "Demo")
public class DemoAggregate implements Serializable {
    private static final long serialVersionUID = -2549468778385293048L;

    @Getter private DistributedData.DDataMap<String, MarketInfo> marketInfoDDataMap;

    @InnerCommandHandler
    public ActReturn act(DdataChangeCmd cmd) {

        marketInfoDDataMap.updateLocal(cmd.getDdataCode(), (MarketInfo) cmd.getDdata());

        return ActReturn.builder()
                .retCode(RetCode.SUCCESS)
                .retMessage("ok")
                .event(new DdataChangeEvent())
                .build();
    }
}
```