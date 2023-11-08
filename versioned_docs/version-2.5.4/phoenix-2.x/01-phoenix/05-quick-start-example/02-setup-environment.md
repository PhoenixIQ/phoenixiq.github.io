---
id: setup-environment
title: 2. 开发环境搭建
---

# 开发环境搭建

要遵循教程步骤，您需要有：
- 最喜欢的文本编辑器或 IDEA
- JDK 1.8
- 构建工具Maven(3.2+)
- 创建一个空的Spring Boot项目(2.0版本)
- 正常运行的Kafka，如果没有合适的Kafka，可以使用内存版Kafka，参见：[KafkaEmbeddedConfig](https://github.com/PhoenixIQ/phoenix-samples/blob/master/shopping/application/src/main/java/com/iquantex/samples/shopping/config/KafkaEmbeddedConfiguration.java)

本教程使用 h2 数据库和内存版 Kafka。您可以在开发期间运行本地安装的数据库和 kafka，但我们建议使用 Docker 来运行这两个服务。

以下部分提供了下载和安装的链接：
- [Source downloads](./setup-environment#source-downloads)

- [IntelliJ IDEA](./setup-environment#intellij-idea)

- [Build tool](./setup-environment#build-tool)

- [Download template](./setup-environment#download-template)

- [Project depend](./setup-environment#project-depend)

- [Application Configuration](./setup-environment#application-configuration)

## Source downloads

我们将示例源码分成了四个分支，您能够前往仓库构建并运行当前功能：[开发环境搭建](https://github.com/PhoenixIQ/hotel-booking/tree/part-0)

## IntelliJ IDEA

> Download and install [IntelliJ](https://www.jetbrains.com/idea/download/).

## Build tool

> 我们使用maven作为案例构建工具。下载参见：[Install Maven](https://maven.apache.org/install.html)

## Download template

> 我们为您提供了合适的空项目模板，点击[下载项目模板](https://github.com/PhoenixIQ/hotel-booking/raw/main/hotel-booking-template.zip)。

## Project depend
本教程中我们会使用 Phoenix 提供的三个依赖包`phoenix-server-starter`、`phoenix-client-starter`和`phoenix-event-publish-starter`，分别能够提供服务端、客户端和发布订阅的功能。

**maven依赖**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>2.0.1.RELEASE</version>
    </parent>

    <groupId>com.iquantex.phoenix</groupId>
    <artifactId>hotel-booking</artifactId>
    <packaging>pom</packaging>
    <version>${revision}</version>

    <modules>
        <module>hotel-server</module>
        <module>order-service</module>
    </modules>

    <properties>
        <revision>1.0-SNAPSHOT</revision>
        <phoenix.version>2.5.4</phoenix.version>
        <lombook.version>1.16.20</lombook.version>
        <proto.version>3.4.0</proto.version>
    </properties>

    <build>
        <plugins>
            <!--编译插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>
            <!--代码格式化插件-->
            <plugin>
                <groupId>io.spring.javaformat</groupId>
                <artifactId>spring-javaformat-maven-plugin</artifactId>
                <version>0.0.15</version>
                <executions>
                    <execution>
                        <phase>validate</phase>
                        <inherited>true</inherited>
                        <goals>
                            <goal>validate</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```
## Application Configuration
使用 SpringBoot 和 Phoenix 需要一些必要的配置：
```yaml
spring:
  application:
    name: hotel-bookings # 自定义服务名称

quantex:
  phoenix:
    client:
      name: ${spring.application.name}-client   # 服务名称
      mq:
        type: kafka                             # mq类型
        address: 127.0.0.1:9092                 # mq地址
    server:
      name: ${spring.application.name}    # 服务名称
      package-name: com.iquantex.samples.bookings.domain   # 聚合根包所在路径
      default-serializer: proto_stuff     #序列化模式
      mq:
        type: kafka                       # mq类型
        address: 127.0.0.1:9092           # mq服务地址
        subscribe:
          - topic: hotel-bookings
      event-store:
        driver-class-name: org.h2.Driver  # 数据库驱动
        data-sources:
          - url: jdbc:h2:file:./data/test;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS PUBLIC # 数据库链接url
            username: sa                  # 数据库账户
            password:                     # 数据库密码
```