FROM hub.iquantex.com/base/nginx:1.18-alpine
LABEL maintained="jackshen"

COPY build/ /opt/deployments/build/
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

WORKDIR /

RUN nginx
