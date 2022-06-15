# 从相对的whiteboard-bridge目录中build出来，并且复制

BUILD_DIR=''
PROJECT_DIR=$(pwd)
BRIDGE_DIR='../Whiteboard-bridge'

cd $BRIDGE_DIR
BUILD_DIR=$(pwd)/build
yarn 
yarn build
cd $PROJECT_DIR

rm ./ios/Resource/*
cp $BUILD_DIR/* ./ios/Resource/
rm ./android/src/main/assets/Resource/*
cp $BUILD_DIR/* ./android/src/main/assets/Resource/

yarn