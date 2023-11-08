---
id: license-upgrade
title: License 升级
description: License 升级指南
---

## License 修改 \{#license-modify\}

Phoenix License 的修改主要更改对象 `PhoenixBootstrap` 的 `license` 属性。

当前这种方式比较原始和麻烦，所以 Phoenix 提供了 Spring 的集成，可以基于 Spring 的配置来修改 Phoenix License。

在更改Spring配置时，有多种方案可供选择，具体取决于您的应用程序和具体需求。以下是几种可能的方案，按推荐程度排序：


### 1.在Pod定义中使用环境变量 \{#environment\}

在Kubernetes环境中，可以使用多种方法来修改Java应用程序的环境变量。在Kubernetes Pod定义中，可以使用env字段来指定应用程序需要的环境变量。例如：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    - name: myapp
      image: myapp:latest
      env:
        - name: spring.xxx
          value: "value"
```

### 2. 外部化配置方案 \{#extenal\}

Spring框架提供了外部化配置的功能，可以通过不同的方式来修改应用程序的配置。以下是一些常见的方法：

#### 2.1 使用属性文件 \{#profiles\}

Spring应用程序通常可以使用属性文件来设置配置参数。在属性文件中，您可以为每个配置参数指定一个键值对。Spring应用程序可以在启动时读取这些属性文件，然后使用其中的配置参数来配置应用程序。

例如，在应用程序的`application.properties`文件中，您可以指定以下配置参数：


```properties
myapp.config.parameter=value
```

#### 2.2 使用环境变量 \{#java-environment\}

您可以使用环境变量来设置Spring应用程序的配置参数。在操作系统级别设置环境变量，然后在应用程序中读取这些环境变量的值，Spring应用程序可以使用这些值来配置应用程序。

例如，在操作系统中设置以下环境变量：

```bash
export MYAPP_CONFIG_PARAMETER=value
```


#### 2.3 使用命令行参数 \{#command-line\}

您还可以使用命令行参数来设置Spring应用程序的配置参数。在运行应用程序时，可以指定命令行参数来覆盖应用程序中的默认配置参数。

例如，在运行应用程序时，可以指定以下命令行参数：

```bash
java -jar myapp.jar --myapp.config.parameter=value
```

总之，Spring框架提供了多种方式来使用外部化配置来修改应用程序的配置。通过使用这些技术，您可以在不修改应用程序代码的情况下更改应用程序的配置参数。



### 3. 其他方案 \{#ohther\}

其他非外部化配置的方案的配置暂不提供，如用户配置了 Spring Cloud Config 这类配置中心，也可以利用上 Spring 提供的更高阶用法


## 注意事项 \{#tips\}

无论是外部化配置还是代码层次修改，License 的变动意味着 JVM 必须经历关闭-启动这一步骤。Phoenix 应用运行在分布式的集群环境下，虽然使用某些技巧下，Phoenix 能够实现灰度发布，但一般情况下，我们推荐用户停止整个 Phoenix 应用集群后，再统一修改后启动，避免部分节点在存货期间写入异常数据。

对于升级过程中存在数据库层面（EventStore）的变动，如清库重建，则更是如此，因为 Phoenix 应用的状态在存活期间使用了内存镜像的能力（memory image)，仅当发生重启，重新平衡，故障等情况下丢失了内存数据时，才会使用数据库的持久化存储重新载入状态。

因此，在做数据库层面的变动时，一定遵循：

1. 停止所有 Phoenix 应用集群
2. 修改
3. 重新启动 Phoenix 应用集群

的步骤。