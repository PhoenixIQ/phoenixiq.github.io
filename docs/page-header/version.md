---
id: phoenix-version-2x
title: ReleaseNote
---

> 维护phoenix具体版本内容，包括release node，以及和各个组件匹配的版本信息。下面每个标题内的表格代表了版本匹配关系。

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



