---
id: admin-build-2x
title: 服务搭建
---

#### 架构图

![image-20200115105007488](assets/phoenix2.x/phoenix-admin/image-20200115105007488.png)



#### helm部署命令

```
helm upgrade --kubeconfig devops/.kube/config-demo ${name} --install --namespace=phoenix-admin-demo  --set phoenix_admin.version=$CI_COMMIT_REF_NAME  devops/helm/phoenix-admin/
```