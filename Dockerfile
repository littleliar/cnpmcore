# 阶段一: 构建编译 - 安装所有依赖
FROM node:22.11.0-alpine3.20 AS builder

# 指定工作目录
WORKDIR /usr/src/cnpmcore

# 复制内容到工作目录下
COPY . .

# 安装依赖
RUN npm install -g npminstall --registry=https://registry.npmmirror.com && \
npminstall -c && \
npm run tsc:prod -- --declaration false && \
cp ./app/port/*.html ./dist/app/port/ && \
cp ./app/port/*.json ./dist/app/port/ && \
cp ./package*.json ./dist/

# 阶段二: 生产运行 - 仅安装运行依赖
FROM node:18.20.4-alpine3.20

# 指定工作目录
WORKDIR /usr/src/cnpmcore

# 复制编译后的文件
COPY --from=builder /usr/src/cnpmcore/dist ./

# 安装依赖
RUN npm install -g npminstall --registry=https://registry.npmmirror.com && \
npminstall --production -c

# 添加环境变量
ENV NODE_ENV=production \
EGG_SERVER_ENV=prod

EXPOSE 7001
CMD ["npm", "run", "start:foreground"]
