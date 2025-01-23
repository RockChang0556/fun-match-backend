# # 基础镜像
# FROM node:22-alpine

# # 设置工作目录
# WORKDIR /app

# # 复制项目文件到工作目录
# COPY package.json  ./
# # 安装依赖
# RUN npm install

# COPY . ./app

# CMD ['ls']

# # 构建项目
# RUN npm run build

# # 将产物放在/app 目录下
# # COPY ./dist /app
# # COPY ./node_modules /app/node_modules
# # COPY ./config /app/config

# # CMD ['pwd']


# # 指定容器启动时执行的命令
# CMD ["node", "/app/dist/main"]

# 使用官方 Node.js 镜像作为基础镜像
FROM node:22-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package.json  ./

# 安装项目依赖
RUN npm install

# 复制项目源代码到工作目录
RUN rm -rf /app/node_modules
COPY . .

# 构建项目（生成 dist 文件夹）
RUN npm run build


# 使用轻量级镜像作为运行环境
FROM node:22-alpine AS production-stage

# 设置工作目录
WORKDIR /app

# 复制构建后的文件（dist 文件夹）到运行环境
COPY --from=build-stage ./app/dist ./dist

# 复制依赖文件（node_modules 文件夹）到运行环境
COPY --from=build-stage ./app/node_modules ./node_modules

# 复制环境变量文件（如果需要）
COPY ./config ./config

# 设置容器启动命令
CMD ["node", "dist/main.js"]
