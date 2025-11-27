#!/bin/bash

echo "开始部署到GitHub Pages..."

# 构建项目
echo "构建WebGL版本..."
./build_webgl.sh

# 检查构建是否成功
if [ ! -d "Build/WebGL" ]; then
    echo "错误: 构建失败，Build/WebGL目录不存在"
    exit 1
fi

# 创建临时目录
TEMP_DIR="gh-pages-temp"
rm -rf $TEMP_DIR
mkdir $TEMP_DIR

# 复制构建文件
cp -r Build/WebGL/* $TEMP_DIR/

# 如果有CNAME文件，也复制它
if [ -f "CNAME" ]; then
    cp CNAME $TEMP_DIR/
fi

# 保存当前分支
CURRENT_BRANCH=$(git branch --show-current)

# 切换到gh-pages分支
if git show-ref --verify --quiet refs/heads/gh-pages; then
    # gh-pages分支已存在
    git branch -D gh-pages
fi

# 创建gh-pages分支
git checkout --orphan gh-pages

# 删除所有文件
git rm -rf .

# 复制构建文件
cp -r $TEMP_DIR/* .

# 提交更改
git add .
git commit -m "Deploy to GitHub Pages"

# 推送到远程gh-pages分支
echo "正在推送到远程gh-pages分支..."
git push -f origin gh-pages

# 切换回原始分支
git checkout $CURRENT_BRANCH

# 清理临时目录
rm -rf $TEMP_DIR

echo "部署完成！"
echo "您的网站将在 https://$(git remote get-url origin | sed 's/.*\///' | sed 's/\.git$//').github.io 访问"