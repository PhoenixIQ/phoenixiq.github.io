VERSION=$1
echo 'build image '$VERSION' ...'
eval 'docker build --platform linux/amd64  -f ./base_dockerfile -t harbor.iquantex.com/phoenix/phoenix-website-base:$VERSION .'
echo 'push image...'
eval 'docker push harbor.iquantex.com/phoenix/phoenix-website-base:$VERSION'