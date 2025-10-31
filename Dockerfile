# 多阶段构建 - 构建阶段
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# 安装所有依赖（包括 devDependencies）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目（添加调试信息）
RUN echo "开始构建项目..." && \
    echo "检查依赖安装情况..." && \
    pnpm list --depth=0 | head -20 && \
    echo "检查 TypeScript 配置..." && \
    npx tsc --version && \
    echo "检查 NestJS CLI..." && \
    npx nest --version && \
    echo "开始构建..." && \
    (NODE_ENV=production npx nest build || \
     (echo "NestJS 构建失败，尝试直接使用 TypeScript 编译..." && \
      npx tsc -p tsconfig.build.json)) && \
    echo "构建完成" && \
    ls -la dist/ && \
    echo "检查构建产物..." && \
    find dist -name "*.js" | head -10

# 生产阶段
FROM node:22-alpine AS production

# 设置工作目录
WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# 从构建阶段复制构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 复制配置文件
COPY config ./config

# 更改文件所有者
RUN chown -R nestjs:nodejs /app
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 启动应用
CMD ["node", "dist/main"]
