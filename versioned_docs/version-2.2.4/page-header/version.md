---
id: phoenix-version-2x
title: ReleaseNote
---

> 维护 phoenix 具体版本内容，包括 release node，以及和各个组件匹配的版本信息。下面每个标题内的表格代表了版本匹配关系。

## 2.4.0-beta.1(2021-07-02)

### 版本下载列表

| 项目名          | 发版时间   | 版本号       |
| --------------- | ---------- | ------------ |
| phoenix         | 2021-07-02 | 2.4.0-beta.1 |
| phoenix-admin   | 2021-07-02 | 2.4.0-beta.1 |
| phoenix-website | 2021-07-02 | 2.4.0-beta.1 |

### Release Note

#### Feature

- phoenix 增加混沌测试并修复若干问题&升级 akka 版本为 2.14 &65
- dgc 性能调优&清楚定位&更新 DGC 文档 &64
- phoenix 支持调用阻塞 api 落地 #1108

#### Refactor

- 优化启动时有没有表的校验 sql #1128
- kafka 消费额外配置支持用户可配 #1124
- openchaos 的 bank 模型完善 phoenix 网络分区测试 openchaos#4
- 测试 IBOR #1122
- 完善 DGC 实现 #1120
- DGC 缓存优化 #1103
- DGC 开关优化 #1100

#### BugFix

- DgcKey hashCode 计算问题 #1118
- 消除 phoenix 当中所有中文日志及异常信息 #1133
- 聚合根查询遇到抛异常无法查看错误堆栈 #1134
- phoenix 扫包时可能会出现冲突异常 #1129

## 2.4.0-beta.0(2021-05-28)

### 版本下载列表

| 项目名          | 发版时间   | 版本号       |
| --------------- | ---------- | ------------ |
| phoenix         | 2021/05/28 | 2.4.0-beta.0 |
| phoenix-admin   | 2021/05/28 | 2.4.0-beta.0 |
| phoenix-website | 2021/05/28 | 2.4.0-beta.0 |

### Release Note

#### Feature

- phoenix-dgc 纳入 phoenix &58
- phoenix 实体聚合根支持历史查询 &62 (closed)
- phoenix 抛出异常事件时支持状态码 #1066 (closed)

#### Refactor

- phoenix 的 serverWorker 采用建造者模式声明 #1048 (closed)
- 对字段的 setter(writerMethod)/getter(readerWriter)做统一管理 #1083 (closed)
- phoenix 统一完善注释,去除代码破窗 #1045 (closed)
- phoenix 仓库纳入 phoenix-website #1057 (closed)
- 去掉 phoenix 中多余的迭代 #1079 (closed)
- 事务集群和事务集群可能存在死锁阻塞的问题 #1014(closed)
- ReceiverActor 的 actorId 变更 #1000(closed)

#### BugFix

- phoenix-admin 查询事务调用链报错 #1050 (closed) phoenix-admin#52 (closed)
- PhoenixClient 启动时，execute 给线程池的 thread，设置的名称不会生效 #1078 (closed)
- kafka 未连接，却报错：Phoenix client not started #1082 (closed)
- protostuff 报错 #1054 (closed)

## 2.3.0(2021-03-31)

> 上个版本为 2.2.7,从 2.1.5~2.2.7 为内部迭代版本

### 版本下载列表

| 项目名          | 发版时间   | 版本号 |
| --------------- | ---------- | ------ |
| phoenix         | 2021/03/31 | 2.3.0  |
| phoenix-admin   | 2021/03/31 | 2.3.0  |
| phoenix-website | 2021/03/31 | 2.3.0  |

### Release Note

#### phoenix 稳定性&文档升级

- 获取聚合根 ID 增强 #493
- 修复 admin 页面的展示问题 phoenix-admin#42 phoenix-admin#43 #46
- protobuf 性能测试 #950
- phoenix 最大节点数测试 #954
- 梳理并更新官方文档 phoenix-website#4 phoenix-website#5 phoenix-website#7 phoenix-website#11 phoenix-website#6 phoenix-website#10 phoenix-website#8 phoenix-website#9 #12
- 聚合根增加构造函数校验 #975
- 单元测试稳定向 #977
- 对响应体集合支持可变参数 #979
- phoenix 代码规范定义 #983
- 优化日志输出 #1003

#### phoenix 发布分布式事务功能

- phoenix 对事务超时时的框架支持 #116
- TransactionAggregateActor 在处理事务完成会被幂等掉的问题 #221
- 启动时检查事务聚合根规范 #490
- samples/github 增加事务模型 #554 #555
- 事务快速入门文档 #984
- 事务使用文档介绍 #557
- 事务模式介绍文档 #558
- 事务主键冲突场景 bug #612
- 事务聚合根查询命令幂等不住问题 #717
- 测试报告：带事务的性能测试 #902 #982
- 分布式事务支持空补偿和防悬挂 #957
- 丰富分布式事务超时以及其他 TCC/SAGA 测试案例 #971
- 事务模块测试覆盖率达到 80% #962 #969 #967 #965 #961 #960 #968 #966 #972 #980
- 用户自定义配置超时策略参数 #973
- 子事务状态枚举类升级 #978
- 事务聚合根心跳逻辑优化 #992
- 关于探索查询与默认没有 ci 时的异常问题 #990
- 事务异常状态监控方案梳理&落地 #981 #99 #999

#### phoenix 发布 CommandSouring

- CommandSouring 可行性验证&代码开发 #307
- CommandSouring 单元测试覆盖 #576
- CS Samples 案例补充 #577
- CS 官方文档补充 #578

## 2.1.5(2020-05-29)

### 版本下载列表

| 项目名          | 发版时间   | 版本号 |
| --------------- | ---------- | ------ |
| phoenix         | 2020/05/29 | 2.1.5  |
| phoenix-admin   | 2020/05/29 | 2.1.5  |
| phoenix-website | 2020/05/29 | 2.1.18 |

### Release Note

#### phoenix(2.1.5)

##### Enhancement

- 幂等集合和快照间隔在注解头上 #465
- phoenix 支持多数据源订阅 #436 #500 #505
- phoenix 支持非回复开关 #275
- 支持集成化使用 event-publish #453 #492 #454
- phoenix 支持业务幂等 #466
- 自动化测试方案设计&初步实现 #444 #471
- 事务支持延后指定补偿请求 #512

##### Test

- phoenix-event-publish 严格测试 #487
- samples 支持主动订阅 topic 案例 #505
- samples 支持业务幂等案例测试 #509
- samples 支持非回复开关案例 #506
- 2.1.5 发版前功能测试&回归测试 #508

##### BugFixes

- Phoenix 解决打印 N 次 ON 日志 #459
- mysql 在 append 版本冲突的情况返回了幂等 Id 冲突 #484
- phoenix 默认不能非本地 ip 组集群 #496
- producer 发送失败的问题 #456
- ActReturn 不填 retMessage 报错 NPE #469
- phoenix-client 会出现很多个消费 group #481
- phoenix-admin 的 ActorTree 信息的获取支持重试 #518
- eventsouring 重复递增进行 #519
- phoenix-event-publish 从 event-store 中读取的 batch 中有乱序 #515
- event-publish 开关有问题 #513

##### Other

- 富国 tsp 二期部署 admin2.x #497
- Phoenix 对比 Axon 梳理 #468
- 富国 TSP 二期交付 Phoenix2.1.4 版本 #464

#### phoenix-admin(2.1.5)

- Phoenix-Admin 架构重新设计 #364
- Phoenix-admin 集成 Phoenix-persist #462 #472
- phoenix-admin 支持 docker-compose 交付 #482
- phoenix-admin 支持加载 api #502 #501

#### phoenix-website(2.1.18)

- phoenix-admin 文档完善 #510
- EventPublish 客户端如何消费文档说明 #454
- 2.1.5 文档相关完善 #489
- event-publish 集成文档配置 #511
- github 快速入门调整&官网文档调整 #520
- 幂等相关文档博客编写 #489

## 2.1.3(2020-04-17)

### 版本下载列表

| 项目名          | 发版时间   | 版本号 |
| --------------- | ---------- | ------ |
| phoenix         | 2020/04/17 | 2.1.3  |
| phoenix-admin   | 2020/04/17 | 2.1.3  |
| phoenix-website | 2020/04/17 | 2.1.17 |

### Release Note

#### phoenix(2.1.3)

**Enhancement**

- Q 端服务支持查询命令 #283
- 聚合根实例被 spring 管理 #355
- EventStore 领域事件发布组件 #356
- `CommandHandler`增加是否自动创建聚合根的判断 #374 #410
- phoenix 支持提供自动回收聚合根的策略 #396 #449
- Phoenix 相关应用的日志接入 ELK #397
- 银行转账使用 queryCmd 获取数据 #402
- RpcResult.getData 支持泛型 #429
- 支持 CMD 中多个字段作为聚合跟 ID #393
- Phoenix 对用户的 INFO 日志调整 #404
- phoenix 默认提供 license 降低使用门槛 #406

**Test**

- Phoenix 在千万级消息量下的稳定性 #378
- Phoenix 模板适配新版本 #431
- Phoenix 整体回归测试(2.1.3 版本) #432
- 事件发布功能炒股大赛引入测试 #433
- GitHub 上案例测试 #435

**BugFixes**

- CmdMsgExtractor 未能 catch 异常 #401
- 修改 SpringBeanUtil 命名，避免和用户冲突 #437
- 账户管理查询账户会有 null 的账户列表 #448
- 所有子事务无 ci 的情况下 ti 失败，导致事务异常 #322
- 打印两次 on 的日志问题 #392

**Other**

- 估值现在数据的维护改造 demo 开发 #417
- 昆仑整合 Showcase-Phoenxi 相关开发 #418
- GitHub phoenix-samples 工程 phoenix 版本升级为 dev-SNAPSHOT #425
- GitHub phoenix-sample-risk 工程 phoenix 版本升级为 dev-SNAPSHOT #428
- 公开 helloworld，账户管理，事中风控案例到 github #415

#### phoenix-website(2.1.17)

- Phoenix 开发者社区建立 #361
- license 的配置文档位置不对 #377
- Phoenix 快速入门重写 #379
- Phoenix 官网社区链接调整 #380
- 编写 phoenix gitlab issue 使用教程文档 #420
- Phoenix 官网首页重新设计 #383
- Phoenix 开发者官网 review 所有 #430

#### phoenix-admin(2.1.3)

- 写死 phoenix-admin 展示的用户名 #394
- Phoenix-admin 支持接入带有 servlet-path 的 Phoenix 应用 #400
- phoenix-admin 内存查询报错 #399

## 2.1.2(2020-03-13)

### 版本下载列表

| 项目名          | 发版时间   | 版本号 |
| --------------- | ---------- | ------ |
| phoenix         | 2020/03/13 | 2.1.2  |
| phoenix-admin   | 2020/03/13 | 2.1.2  |
| phoenix-website | 2020/03/13 | 2.1.15 |

### release notes

#### phoenix(2.1.2)

**Enhancement**

- phoenix 包里面嵌入 license 功能 #349
- phoenix 做简单的代码混淆 #328
- 解决编译过程的 Warning 问题,引入 mvnw #343
- 研究 Snonar 的其他指标用于增加代码质量 #342
- 事中风控视频教程录制 #347

**Test**

- 测试昆仑外仓使用&梳理交付方式 #348
- 服务实例 JVM OOM 下服务高可用验证 #310
- 统一 Phoenix 对外发布项目的编程风格&完善注释 #351
- 调整 sonar 执行的位置 #352
- 2.1.2 发版回归测试 #372

**BugFixes**

- eventstore 建立连接失败的情况下无法打印 server 端配置 #345
- 实体聚合根没有实现 Serializable 导致不断重试的问题 #337
- AggregateRootIdAnnotation 中聚合根 ID 填写错误客户端 rpc 调用超时 #339
- phoenix 官网下载中 helm-chart 的链接放到官网里面 #346
- Saga 服务扫描 EntityAggregate 导致的 bug #366
- demo 环境下单 eventStore 报错 #371

**Other**

- phoenix-license 需兼容只校验过期时间 #358

#### phoenix-website(2.1.9)

- 更新官网文档的配图 #354
- Phoenix 官网首页开发 #350

#### phoenix-admin(2.1.2)

- 测试昆仑外仓使用&梳理交付方式 #348

## 2.1.1(2020-02-28)

### 版本下载列表

| 项目名          | 发版时间   | 版本号 |
| --------------- | ---------- | ------ |
| phoenix         | 2020/02/28 | 2.1.1  |
| phoenix-admin   | 2020/02/28 | 2.1.1  |
| phoenix-website | 2020/02/28 | 2.1.1  |

### release notes

#### phoenix(2.1.1)

**Enhancement**

- 银行转账页面增加清理数据按钮 #225
- 聚合根分隔符进行调整 #316
- phoenix-server 端 kafka 接口重构 #230
- 添加接口获取服务的路由表 #248
- 提高测试覆盖率 80%&覆盖率加入 CI #286
- 维护 phoenix 开发模板 #288
- 业务代码单元测试支持 #287,#293
- phoenix 服务启动的时候支持在日志中输出 phoenix 配置信息 #335
- 全环境回归测试 #331
- 按照新的项目结构重构 bank-account 项目 #323
- 事中风控培训 demo 开发教程制作 #284,#305

**BugFixes**

- 客户端和服务端写在一块会出现 rpc 失败 #278
- Client 模块代码 Sonar 扫描覆盖率为 0 #285
- akka 配置默认不设置应该能跑起来 #289
- 账户总览查询接口报 ArrayIndexOutOfBoundsException #317
- 整体 review 问题解决 #327

#### phoenix-admin(2.1.1)

- 增加可以查看 phoenix 的扇子功能 #264
- phoenix-admin 调用 grafana datasource api 失败 #332
- 完善 phoenix-admin 服务详情前端页面 #299
- phoenix grafna dashboard 添加 filter 功能 #314
- 整体 review 问题解决 #327

#### phoenix-website(2.1.1)

- 测试文档: 对比 1.6 升级报告 #300
- 伸缩性测试需要完善证明动态伸缩 #302
- 文档: 单聚合根处理的性能测试 #303
- Phoenix 官网快速入门重写 #319
- Phoenix 官网配置详情内容更新 #320
- 使用文档：整理 phoenix 的依赖列表(服务,核心 jar 包,版本) #301
- 整体 review 问题解决 #327

## 2.1.0-beta(2020-01-22)

### 版本下载列表

| 项目名          | 发版时间   | 版本号      |
| --------------- | ---------- | ----------- |
| phoenix         | 2020/01/21 | 2.1.0-beta  |
| phoenix-admin   | 2020/01/21 | 2.0.7-alpha |
| phoenix-website | 2020/01/21 | 2.1.0-alpha |

### release notes

#### phoenix(2.1.0-beta)

- 整体单元测试覆盖 #222,#269
- EntityAggregate 支持批量处理 #241
- 优化 Message 类使用方式 #259,#265
- 代码细节持续调优 #260,#258,#256,#261,#247,#253,#252
- 快照代码细节完善 #251
- phoenix 性能测试报告&调优(不带事务) #229
- phoenix 白皮书编写 #238
- phoenix 功能性测试报告 #267
- phoenix 非功能测试报告 #239
- phoenix 官网升级&细节优化 #273

#### phoenix-admin(2.0.7-alpha)

- phoenix-admin 集成 grafana #188
- phoenix-admin 完善服务详情后端接口&文档 #263

#### phoenix-website(2.1.0-alpha)

- phoenix 官网升级&细节优化 #273
- phoenix 性能测试报告(不带事务) #229
- phoenix 白皮书编写 #238
- phoenix 功能性测试报告 #267
- phoenix 非功能测试报告 #239
- phoenix-admin 完善介绍文档 #263
