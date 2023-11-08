#!/bin/bash

set -e

APP_PATH=$(cd `dirname $0`; pwd)
echo $APP_PATH
cd $APP_PATH

# 依赖安装
npm config set registry https://nexus.iquantex.com/repository/npm-proxy/
npm install

if [ $? != 0  ]
then
  echo 安装依赖失败
  exit 1
fi

# clear
rm -rf build
rm -rf docker/build

# 项目打包
npm run build
mv build docker/
