---
id: phoenix-upgrade-2-2-2
title: 2.2.1升级2.2.2指南
---

## 背景

2.2.2版本对比2.2.1版本有些小变更，下面详细介绍

## Kafka内存版本支持方式变更

2.2.2版本默认不再集成内存版本kafka,如果需要本地测试则需要在应用中手动引入内存版kafka的依赖,由于和phoenix的包有些冲突
请按照下面来引入,并需要手动开启内存版本kafaka

### 1. pom文件依赖
```xml
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka_2.12</artifactId>
            <version>1.0.0</version>
            <exclusions>
                <exclusion>
                    <artifactId>slf4j-log4j12</artifactId>
                    <groupId>org.slf4j</groupId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka_2.12</artifactId>
            <version>1.0.0</version>
            <classifier>test</classifier>
            <scope>compile</scope>
            <exclusions>
                <exclusion>
                    <artifactId>slf4j-log4j12</artifactId>
                    <groupId>org.slf4j</groupId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka-test</artifactId>
            <exclusions>
                <exclusion>
                    <artifactId>kafka_2.11</artifactId>
                    <groupId>org.apache.kafka</groupId>
                </exclusion>
            </exclusions>
        </dependency>


```

### 2. 配置内存版本kafka启动
```java
@Configuration
@ConditionalOnProperty(value = "embedded-kafka", havingValue = "true", matchIfMissing = true)
public class KafkaEmbeddedConfiguration {

    /**
     * 开启一个内存kafka，端口随机
     * @return
     */
    @Bean
    public KafkaEmbedded kafkaEmbedded() {
        int brokerServerCnt = 1; // broker的数量，由于是本地环境，设置为1就可以
        Map<String, String> brokerProp = new HashMap<>();
        brokerProp.put("auto.create.topics.enable", "true"); // 自动创建topic
        brokerProp.put("num.partitions", "4"); // 默认给每个topic创建4个partition
        KafkaEmbedded kafkaEmbedded = new KafkaEmbedded(brokerServerCnt).brokerProperties(brokerProp);
        kafkaEmbedded.setKafkaPorts(9092);
        return kafkaEmbedded;
    }
}
```

### 3. phoenix使用

在应用开启内存版本kafka之后,其实是可以用127.0.0.1:9092去连接的

```yaml
# 启动内存kafka,线上环境改为false
embedded-kafka: true

quantex:
  phoenix:
    server:
      name: ${spring.application.name}
      package-name: com.iquantex.phoenix.samples.account
      mq:
        type: kafka
        address: 127.0.0.1:9092
        subscribe-topic: account

```

## 使用EventStore方式变更

对比2.2.1版本,2.2.2版本如果需要使用jdbc-eventstore,需要单独引用包

```xml
        <dependency>
            <groupId>com.iquantex</groupId>
            <artifactId>phoenix-eventstore-jdbc</artifactId>
            <version>2.2.4</version>
        </dependency>
```

同时在性能测试时为了资源隔离,可以让Phoenix中默认使用eventstore的数据源和业务数据源分开(只需要增加一个配置即可),当然没有性能测试需求则忽略

```yaml
quantex:
  phoenix:
      event-store:
        driver-class-name: org.h2.Driver
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
          - url: jdbc:h2:file:./data2/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC
            username: sa
            password:
            label: reliablity   # 配置Label让资源隔离(性能测试用)
```

## 不需要在写runner了

phoenix2.2.2版本不需要用户手动写runner来启动phoenix了，phoenix根据开关来决定是否要启动相关的模块.


### 启动PhoenixClient
```yaml
quantex.phoenix.client:
  enabled: true # 默认值为true,如果没有不启动的需求,则不配置即可
```

### 启动PhoenixServer
当下面两个条件都为false时则会不启动.
```yaml
quantex:
  phoenix:
    server:
      entity-aggregate-enabled: true # 默认值为true,如果没有不启动的需求,则不配置即可
      transaction-aggregate-enabled: true # 默认值为true,如果没有不启动的需求,则不配置即可
```

### 启动EventPublish
当下面两个条件都为false时则会不启动.
```yaml
quantex:
  phoenix:
    event-publish:
      event-task:
        enabled: true  # 默认值为true,如果没有不启动的需求,则不配置即可
      monitor-task:
        enabled: true  # 默认值为true,如果没有不启动的需求,则不配置即可
```


### 如何实现在phoenix启动前后做一些处理

有一些场景,需要在phoenix启动前做一下数据初始化,启动后做一些事情, phoenix-spring-boot-starter这边的runnner的优先级为1,所以之前之后只需要让自己定义的runnner是大于1或者小于1即可

phoenix启动前runner样例
```java
@Slf4j
@Order(0)
@Component
public class PhoenixBeforeRunner implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {
        log.info("phoenix starting...");
    }

}
```


phoenix启动后runner样例
```java
@Slf4j
@Order(2)
@Component
public class PhoenixAfterRunner implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {
        log.info("phoenix started");
    }

}

```


## 服务的Helm-Chart要加上`app.name`标签

要在服务的helm chart中增加标签

​```yaml
spec:
  template:
    metadata:
      labels:
        app.name: bank-account
        apptype: phoenix
​```

## 建议手动配置聚合根包路径

phoenix在不配置包路径时会扫描全部类文件，这样会导致应用启动比较久，建议用户手动配置好扫包路径

```yaml
quantex:
  phoenix:
    server:
      package-name: com.iquantex.phoenix.samples.account.domain
```