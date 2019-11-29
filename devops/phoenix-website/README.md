
## 几个疑问

1. override-demo.yaml 是否可以去掉，因为这里只是一个镜像不依赖其他东西
2. requirements.lock 和 requirements.yaml 直接删掉或者全部注释会不会有影响
3. image: "{{ .Values.phoenix-website.image.repository }}:{{ include "phoenix.tag" . }}"   这个phoenix.tag 需要换成 phoenix-website.tag 吗
4. 

