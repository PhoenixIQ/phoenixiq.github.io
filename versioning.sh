#!/bin/bash

# 判断当前目录同时是否存在 docs 和 versioned_docs
if [ ! -d "docs" ] || [ ! -d "versioned_docs" ]; then
  echo "Check if your directory is in the root directory of the project."
  exit
fi

OLD_VERSION=$1
NEW_VERSION=$2

# 判断 OLD_VERSION 和 NEW_VERSION 变量不为空
if [ -z "$OLD_VERSION" ] || [ -z "$NEW_VERSION" ]; then
    echo "old version=$OLD_VERSION"
    echo "new version=$NEW_VERSION"
    echo "Please specify the old version and new version like this: version.sh 2.5.5 2.6.0"
    exit
fi

# 生成日期字符串，改变 package.json 版本
DATE_STR=$(date +%Y-%m-%d)
# 归档老版本
eval 'npm install & npm run docs'
# 更新 Package 里面的版本和日期
sed -ie "s/\"version\":.*$/\"version\": \"$NEW_VERSION\",/g" package.json
sed -ie "s/\"date\":.*$/\"date\": \"$DATE_STR\",/g" package.json
# 切换到 docs 目录下
cd docs/
# 将最新版本改为新版本
eval "grep -n -r 'version>$OLD_VERSION' . | awk -F ':' '{print \$1}' | uniq | xargs -I {} sed -i '' 's/version>$OLD_VERSION/version>$NEW_VERSION/g' {}"
