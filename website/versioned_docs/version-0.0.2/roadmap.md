---
id: version-0.0.2-roadmap
title: Roadmap
sidebar_label: Example Page
original_id: roadmap
---

![roadmap](../../img/roadmap/roadmap.png)

原文件：[Phoenix Roadmap.pptx](https://portal.iquantex.com/confluence/download/attachments/23265576/Phoenix%20Roadmap.pptx?version=1&modificationDate=1562722615000&api=v2)

<table><colgroup><col><col><col><col><col></colgroup><tbody><tr><td>特性</td><td>Phoenix - 体验版</td><td>Phoenix - 基础版</td><td>Phoenix - 高阶版</td><td>Phoenix - 旗舰版</td></tr><tr><td colspan="1">开发状态</td><td colspan="1">等待开发</td><td colspan="1">V1.5.9</td><td colspan="1">V1.6.2</td><td colspan="1">V2.0.0</td></tr><tr><td colspan="1"><br></td><td colspan="1"><br></td><td colspan="1"><br></td><td colspan="1"><br></td><td colspan="1"><br></td></tr><tr><td>高性能处理引擎</td><td>有</td><td>有</td><td>有</td><td>有</td></tr><tr><td>事件驱动</td><td>有</td><td>有</td><td>有</td><td>有</td></tr><tr><td>内存计算</td><td>有</td><td>有</td><td>有</td><td>有</td></tr><tr><td>事务处理</td><td><br></td><td>有</td><td>有</td><td>有</td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>高可用 - 冷备</td><td><br></td><td>有</td><td>有</td><td>有</td></tr><tr><td>高可用 - 热备</td><td><br></td><td><br></td><td>有</td><td>有</td></tr><tr><td>高可用 - 多活</td><td><br></td><td><br></td><td><br></td><td>有</td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>拓展性 - 垂直扩展</td><td><br></td><td>有</td><td>有</td><td>有</td></tr><tr><td>拓展性 - 水平扩展 - 静态扩展</td><td><br></td><td><br></td><td>有</td><td>有</td></tr><tr><td>拓展性 - 水平扩展 - 动态扩展</td><td><br></td><td><br></td><td><br></td><td>有</td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>性能监测</td><td>有</td><td>有</td><td>有</td><td>有</td></tr><tr><td>事件监测</td><td><br></td><td>有</td><td>有</td><td>有</td></tr><tr><td>错误检测</td><td><br></td><td><br></td><td>有</td><td>有</td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>自动纠错</td><td><br></td><td><br></td><td><br></td><td>有</td></tr><tr><td>计算自动平衡</td><td><br></td><td><br></td><td><br></td><td>有</td></tr><tr><td>脑裂检测纠错</td><td><br></td><td><br></td><td><br></td><td>有</td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td>开发培训（2 天）</td><td><br></td><td>有</td><td>有</td><td>有</td></tr><tr><td>原理讲解（3 天）</td><td><br></td><td><br></td><td>有</td><td>有</td></tr><tr><td>联合开发（1 月）</td><td><br></td><td><br></td><td><br></td><td>有</td></tr></tbody></table>

2019-07-12  Release 1.6.0-beta1
-------------------------------

*   核心模型优化重构
*   多聚合跟支持
*   单元测试覆盖率 30%

2019-06-28 Release 1.6.0-alpha
------------------------------

*   phoenix 支持主备切换，基于 ZK
*   phoenix-amdin，全新的管理界面，支持主备特性

2019-06-13  Release 1.5.9.1
---------------------------

*   支持 Kafka kerberos 认证

2019-05-24  Release 1.5.9
-------------------------

*   消息中间件支持 Kafka

2019-03-08  Release 1.5.6
-------------------------

*   消息中间件支持 rocketmq

2019-07-X
---------

*   phoenix 支持 datasharding 能力

待规划

*   phoenix 1.7.0 （前期方案和关键技术已验证， 待领导明确目标，性能指标，时间规划等）
    *   支持基于 oracle 的 eventstore 机制