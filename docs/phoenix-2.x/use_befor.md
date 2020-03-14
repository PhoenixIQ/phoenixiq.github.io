---
id: use-befor
title: 用户使用前说明
---

## 设置maven仓库

在用户目录下`.m2`设置`settings.xml`文件，内容如下:

```shell
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <mirrors>
        <mirror>
            <id>public</id>
            <name>public</name>
            <url>https://artifact.iquantex.com/repository/public</url>
            <mirrorOf>*</mirrorOf>
        </mirror>
    </mirrors>

    <servers>
        <server>
            <id>public</id>
            <username>deployment</username>
            <password>deployment123</password>
        </server>
    </servers>

    <profiles>
        <profile>
            <id>kunlun</id>
            <repositories>
                <repository>
                    <id>public</id>
                    <url>https://artifact.iquantex.com/repository/public</url>
                    <releases> <enabled>true</enabled><updatePolicy>always</updatePolicy></releases> 
                    <snapshots> <enabled>true</enabled><updatePolicy>always</updatePolicy></snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>kunlun</activeProfile>
    </activeProfiles>

</settings>


```


## 登录docker仓库

```shell
 docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD}  harbor.iquantex.com
// todo 待声泉给出用户和密码
```

