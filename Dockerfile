# 基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
# COPY package*.json ./
# COPY . .

# # 安装依赖
# RUN npm install

# # 构建项目
# RUN npm run build

# 将产物放在/usr/share/backend 目录下
ADD ./dist /usr/share/backend

CMD ['pwd']

# CMD ['ls']

# 指定容器启动时执行的命令
# CMD ["node", "/usr/share/backend/dist/main"]
