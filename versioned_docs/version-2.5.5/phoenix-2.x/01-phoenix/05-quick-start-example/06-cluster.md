---
id: cluster
title: 6. 集群示例
---

# 集群示例

本章介绍本地搭建`配置集群模式`的 Phoenix 集群，如果您想了解更多集群模式请参考：[集群配置](../../02-phoenix-core/08-cluster.md)。

## 配置
本地配置 Phoenix 集群时，需要连接到共享的事件存储以及消息中间件. 以及配置集群配置文件.

在快速入门的示例代码中提供了基于 Docker 启动共享资源的[示例配置](https://github.com/PhoenixIQ/hotel-booking/blob/main/docker-compose.yml). 

除此之外还要有一些集群的配置, 详细请[参考链接](https://phoenix.iquantex.com/docs/phoenix-2.x/phoenix-core/phoenix-cluster-manager#%E9%9B%86%E7%BE%A4%E9%85%8D%E7%BD%AE)

以快速入门为例, 需要的配置的参数如下(案例中已配置好)：

```yaml
# Web 服务端口必须不同.
server: 
  port: 
    8080

quantex:
  phoenix:
    akka:
      arteryCanonicalHostname: 127.0.0.1   # 配置绑定的 host
      artery-canonical-port: 2551          # 配置不唯一的节点的远程端口
      management-http-port: 8558           # 配置不唯一的集群管理端口
    client:
      mq:
        address: 127.0.0.1:9092            # 共享的 MQ 地址            
    server:
      name: ${spring.application.name}     # 集群服务名唯一
      mq:
        address: 127.0.0.1:9092            # 共享的 MQ 地址       
      event-store:
         data-sources:                     # 共享的事件存储数据库
          - url: jdbc:postgresql://127.0.0.1:5432/postgres?useUnicode=true&characterEncoding=utf-8&verifyServerCertificate=false&useSSL=false&requireSSL=false
            username: pg12                  # 数据库账户
            password: pg12                  # 数据库密码
    cluster:       
      discovery-method: config              # 配置集群服务发现模式为：静态 
      config:                               # 配置集群的种子节点
        seed-node: akka://hotel-bookings@127.0.0.1:2551
```

## 启动

1. 通过 docker 启动共享资源

```shell
docker-compose up -d
```

2. 通过脚本启动种子节点
```shell
# 参数为服务名/Web端口/种子节点远程端口/自身远程端口/自身集群管理端口
sh bootCluster.sh hotel-server 8080 2551 2551 8558
```

3. 通过脚本启动其他节点

```shell
# 种子节点端口不变(单种子节点示例)
sh bootCluster.sh hotel-server 8081 2551 2552 8559
sh bootCluster.sh hotel-server 8082 2551 2553 8560
```

4. 验证

观察控制台：打印`Node [akka://hotel-bookings@127.0.0.1:2552] is JOINING` 说明组集群成功；或者进入`phoenix-console`页面查看服务状态。

