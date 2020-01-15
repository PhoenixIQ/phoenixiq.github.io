---
id: admin-function-2x
title: 功能介绍
---

​	phoniex-admin是配合phoenix框架使用的服务监控平台，主要有如下监控功能：

- 服务监控大屏  （缺前端）

  - 运行总览

    - 服务个数/健康度
    - 实例个数/健康度

  - 运行详情

    - 实例健康状态
    - url
    - 运行时间
    - 补充ing...

  - 实例内存管理

    - 聚合根列表查询
    - 聚合根ID历史快照版本查询
    - 打快照
    - 删除快照
    - 聚合根内存查询

    

- grafana监控

  - 默认dashboard

    * 筛选栏：可选定正规系统中，不同的服务集群，和服务集群下面不同的节点的数据

      ![image-20200115111102393](assets/phoenix2.x/phoenix-admin/image-20200115111102393.png)

    * 消息个数统计面板：统计系统内各个消息的个数

      ![image-20200115111030625](assets/phoenix2.x/phoenix-admin/image-20200115111030625.png)

    * 指标个数统计面板：统计系统内具体埋点的数量

      ![image-20200115110949004](assets/phoenix2.x/phoenix-admin/image-20200115110949004.png)

    * 耗时统计面板：统计系统内各种耗时

      ![image-20200115111135147](assets/phoenix2.x/phoenix-admin/image-20200115111135147.png)

    * 速率统计面板：统计系统内各种速率

      ![image-20200115111155570](assets/phoenix2.x/phoenix-admin/image-20200115111155570.png)

    * 数据总览面板：展示数据的详细信息

      ![image-20200115111217069](assets/phoenix2.x/phoenix-admin/image-20200115111217069.png)

  - 自定义dashboard

    提供用户配置自定义的dashboard。