---
id: phoenix-version-2x
title: ReleaseNote
---

> 维护phoenix具体版本内容，包括release node，以及和各个组件匹配的版本信息。下面每个标题内的表格代表了版本匹配关系。

## 2.1.5(2020-05-29)

### 版本下载列表
| 项目名              | 发版时间      | 版本号         |
| ------------------ | --------     | ------        |
| phoenix            |  2020/05/29  | 2.1.5 |
| phoenix-admin      |  2020/05/29  | 2.1.5|
| phoenix-website    |  2020/05/29  | 2.1.18|

### Release Note

#### phoenix(2.1.5)

##### Enhancement
- 幂等集合和快照间隔在注解头上 #465
- phoenix支持多数据源订阅 #436 #500 #505 
- phoenix支持非回复开关 #275
- 支持集成化使用event-publish #453 #492 #454
- phoenix支持业务幂等 #466
- 自动化测试方案设计&初步实现 #444 #471 
- 事务支持延后指定补偿请求 #512

##### Test
- phoenix-event-publish严格测试 #487 
- samples支持主动订阅topic案例 #505 
- samples支持业务幂等案例测试 #509
- samples支持非回复开关案例 #506
- 2.1.5发版前功能测试&回归测试 #508

##### BugFixes
- Phoenix解决打印N次ON日志 #459 
- mysql在append版本冲突的情况返回了幂等Id冲突 #484
- phoenix默认不能非本地ip组集群 #496
- producer发送失败的问题 #456
- ActReturn不填retMessage报错NPE #469
- phoenix-client会出现很多个消费group #481 
- phoenix-admin的ActorTree信息的获取支持重试 #518
- eventsouring重复递增进行 #519
- phoenix-event-publish从event-store中读取的batch中有乱序 #515
- event-publish开关有问题 #513
##### Other
- 富国tsp二期部署admin2.x #497
- Phoenix对比Axon梳理 #468
- 富国TSP二期交付Phoenix2.1.4版本 #464



#### phoenix-admin(2.1.5)
- Phoenix-Admin架构重新设计 #364
- Phoenix-admin集成Phoenix-persist #462 #472
- phoenix-admin支持docker-compose交付 #482
- phoenix-admin支持加载api #502 #501


#### phoenix-website(2.1.18)
- phoenix-admin文档完善 #510 
- EventPublish客户端如何消费文档说明 #454 
- 2.1.5文档相关完善 #489
- event-publish集成文档配置 #511 
- github快速入门调整&官网文档调整 #520 
- 幂等相关文档博客编写 #489





## 2.1.3(2020-04-17)

### 版本下载列表
| 项目名              | 发版时间      | 版本号         |
| ------------------ | --------     | ------        |
| phoenix            |  2020/04/17  | 2.1.3 |
| phoenix-admin      |  2020/04/17  | 2.1.3|
| phoenix-website    |  2020/04/17  | 2.1.17|

### Release Note

#### phoenix(2.1.3)

**Enhancement**
- Q端服务支持查询命令 #283
- 聚合根实例被spring管理 #355
- EventStore领域事件发布组件 #356
- `CommandHandler`增加是否自动创建聚合根的判断 #374 #410
- phoenix支持提供自动回收聚合根的策略 #396 #449
- Phoenix相关应用的日志接入ELK #397
- 银行转账使用queryCmd获取数据 #402
- RpcResult.getData支持泛型 #429
- 支持CMD中多个字段作为聚合跟ID #393
- Phoenix对用户的INFO日志调整 #404
- phoenix默认提供license降低使用门槛 #406

**Test**
- Phoenix在千万级消息量下的稳定性 #378
- Phoenix模板适配新版本 #431
- Phoenix整体回归测试(2.1.3版本) #432
- 事件发布功能炒股大赛引入测试 #433 
- GitHub上案例测试 #435 

**BugFixes**
- CmdMsgExtractor未能catch异常 #401
- 修改SpringBeanUtil命名，避免和用户冲突 #437
- 账户管理查询账户会有null的账户列表 #448
- 所有子事务无ci的情况下ti失败，导致事务异常 #322
- 打印两次on的日志问题 #392

**Other**
- 估值现在数据的维护改造demo开发 #417
- 昆仑整合Showcase-Phoenxi相关开发 #418
- GitHub phoenix-samples工程phoenix版本升级为dev-SNAPSHOT #425
- GitHub phoenix-sample-risk工程phoenix版本升级为dev-SNAPSHOT #428
- 公开helloworld，账户管理，事中风控案例到github #415

#### phoenix-website(2.1.17)
- Phoenix开发者社区建立 #361 
- license的配置文档位置不对 #377
- Phoenix快速入门重写 #379
- Phoenix官网社区链接调整 #380
- 编写phoenix gitlab issue使用教程文档 #420
- Phoenix官网首页重新设计 #383
- Phoenix开发者官网review所有 #430 

#### phoenix-admin(2.1.3)
- 写死phoenix-admin展示的用户名 #394
- Phoenix-admin支持接入带有servlet-path的Phoenix应用 #400
- phoenix-admin内存查询报错 #399



## 2.1.2(2020-03-13)

### 版本下载列表
| 项目名              | 发版时间      | 版本号         |
| ------------------ | --------     | ------        |
| phoenix            |  2020/03/13  | 2.1.2 |
| phoenix-admin      |  2020/03/13  | 2.1.2|
| phoenix-website    |  2020/03/13  | 2.1.15|

### release notes

#### phoenix(2.1.2)

**Enhancement**
- phoenix包里面嵌入license功能 #349
- phoenix做简单的代码混淆 #328
- 解决编译过程的Warning问题,引入mvnw #343
- 研究Snonar的其他指标用于增加代码质量 #342
- 事中风控视频教程录制 #347

**Test**
- 测试昆仑外仓使用&梳理交付方式 #348
- 服务实例JVM OOM下服务高可用验证 #310
- 统一Phoenix对外发布项目的编程风格&完善注释 #351
- 调整sonar执行的位置 #352
- 2.1.2发版回归测试 #372 

**BugFixes**
- eventstore建立连接失败的情况下无法打印server端配置 #345
- 实体聚合根没有实现Serializable导致不断重试的问题 #337
- AggregateRootIdAnnotation中聚合根ID填写错误客户端rpc调用超时 #339
- phoenix官网下载中helm-chart的链接放到官网里面 #346
- Saga服务扫描EntityAggregate导致的bug #366
- demo环境下单eventStore报错 #371

**Other**
- phoenix-license需兼容只校验过期时间 #358

#### phoenix-website(2.1.9)
- 更新官网文档的配图 #354
- Phoenix 官网首页开发 #350

#### phoenix-admin(2.1.2)
- 测试昆仑外仓使用&梳理交付方式 #348



## 2.1.1(2020-02-28)

### 版本下载列表
| 项目名              | 发版时间      | 版本号         | 
| ------------------ | --------     | ------        | 
| phoenix            |  2020/02/28  | 2.1.1 |
| phoenix-admin      |  2020/02/28  | 2.1.1|
| phoenix-website    |  2020/02/28  | 2.1.1|

### release notes

#### phoenix(2.1.1)

**Enhancement**
- 银行转账页面增加清理数据按钮 #225
- 聚合根分隔符进行调整 #316
- phoenix-server端kafka接口重构 #230
- 添加接口获取服务的路由表 #248
- 提高测试覆盖率80%&覆盖率加入CI #286
- 维护phoenix开发模板 #288
- 业务代码单元测试支持 #287,#293
- phoenix服务启动的时候支持在日志中输出phoenix配置信息 #335
- 全环境回归测试 #331 
- 按照新的项目结构重构bank-account项目 #323
- 事中风控培训demo开发教程制作 #284,#305

**BugFixes**
- 客户端和服务端写在一块会出现rpc失败 #278
- Client模块代码Sonar扫描覆盖率为0 #285
- akka配置默认不设置应该能跑起来 #289
- 账户总览查询接口报ArrayIndexOutOfBoundsException #317
- 整体review问题解决 #327 

#### phoenix-admin(2.1.1)
- 增加可以查看phoenix的扇子功能 #264
- phoenix-admin调用grafana datasource api失败 #332
- 完善phoenix-admin服务详情前端页面 #299
- phoenix grafna dashboard添加filter功能 #314
- 整体review问题解决 #327 

#### phoenix-website(2.1.1)
- 测试文档: 对比1.6升级报告 #300
- 伸缩性测试需要完善证明动态伸缩 #302 
- 文档: 单聚合根处理的性能测试 #303
- Phoenix官网快速入门重写 #319
- Phoenix官网配置详情内容更新 #320
- 使用文档：整理phoenix的依赖列表(服务,核心jar包,版本) #301
- 整体review问题解决 #327 



## 2.1.0-beta(2020-01-22)

### 版本下载列表
| 项目名              | 发版时间      | 版本号         | 
| ------------------ | --------     | ------        | 
| phoenix            |  2020/01/21  | 2.1.0-beta    |
| phoenix-admin      |  2020/01/21  | 2.0.7-alpha   | 
| phoenix-website    |  2020/01/21  | 2.1.0-alpha   |

### release notes
#### phoenix(2.1.0-beta)
- 整体单元测试覆盖 #222,#269
- EntityAggregate支持批量处理 #241
- 优化Message类使用方式 #259,#265
- 代码细节持续调优 #260,#258,#256,#261,#247,#253,#252
- 快照代码细节完善 #251
- phoenix性能测试报告&调优(不带事务) #229
- phoenix白皮书编写 #238 
- phoenix功能性测试报告 #267
- phoenix非功能测试报告 #239 
- phoenix官网升级&细节优化 #273 

#### phoenix-admin(2.0.7-alpha)
- phoenix-admin集成grafana #188
- phoenix-admin完善服务详情后端接口&文档 #263

#### phoenix-website(2.1.0-alpha)
- phoenix官网升级&细节优化 #273 
- phoenix性能测试报告(不带事务) #229
- phoenix白皮书编写 #238 
- phoenix功能性测试报告 #267
- phoenix非功能测试报告 #239 
- phoenix-admin完善介绍文档 #263



