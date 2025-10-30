# 1Panel 部署指南

## 概述

本指南专门针对使用 1Panel 管理面板的服务器环境，提供了优化的部署方案和管理工具。

## 1Panel 优势

- 🎛️ **可视化界面**: 通过 Web 界面管理容器和镜像
- 📊 **资源监控**: 实时监控容器资源使用情况
- 🔧 **便捷操作**: 一键启动、停止、重启容器
- 📝 **日志查看**: 图形化日志查看和管理
- 🌐 **网络管理**: 可视化网络配置和管理

## 环境准备

### 1. 1Panel 安装

确保服务器已安装 1Panel，如果未安装，请参考 [1Panel 官方文档](https://1panel.cn/docs/) 进行安装。

### 2. Docker 配置

在 1Panel 中确保 Docker 服务正常运行：

- 进入 1Panel 控制台
- 检查 Docker 服务状态
- 确保 Docker 网络配置正确

### 3. GitHub Secrets 配置

在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中配置：

```
HUB_GITHUB_TOKEN     # GitHub Personal Access Token
SERVER_HOST          # 服务器 IP 地址
SERVER_USERNAME      # 服务器用户名
SERVER_PWD           # 服务器密码
SERVER_PORT          # SSH 端口 (默认 22)
```

## 部署方式

### 方式一：自动部署（推荐）

#### 1. 推送到主分支

```bash
git push origin main
```

GitHub Actions 将自动：

- 构建 Docker 镜像
- 推送到 GitHub Container Registry
- 部署到 1Panel 服务器

#### 2. 在 1Panel 中查看

- 登录 1Panel 控制台
- 进入 "容器" 页面
- 查看 `nestjs-backend` 容器状态

### 方式二：手动部署

#### 1. 上传文件到服务器

```bash
# 将以下文件上传到服务器
scp deploy-1panel.sh docker-compose-1panel.yml nginx.conf user@server:/home/user/nestjs-backend/
```

#### 2. 执行部署

```bash
# SSH 登录服务器
ssh user@server

# 进入部署目录
cd /home/user/nestjs-backend/

# 设置执行权限
chmod +x deploy-1panel.sh

# 登录容器注册表
docker login ghcr.io -u your-username

# 执行部署
./deploy-1panel.sh production latest
```

## 1Panel 管理操作

### 1. 容器管理

#### 在 1Panel 界面中：

- **启动容器**: 点击容器名称 → 启动
- **停止容器**: 点击容器名称 → 停止
- **重启容器**: 点击容器名称 → 重启
- **删除容器**: 点击容器名称 → 删除

#### 使用命令行：

```bash
# 快速操作
./quick-actions.sh start    # 启动
./quick-actions.sh stop     # 停止
./quick-actions.sh restart  # 重启
./quick-actions.sh logs     # 查看日志
./quick-actions.sh status   # 查看状态
./quick-actions.sh shell    # 进入容器
./quick-actions.sh update   # 更新
```

### 2. 资源监控

#### 在 1Panel 中监控：

- 进入 "容器" 页面
- 查看 CPU、内存使用情况
- 监控网络 I/O 和磁盘 I/O

#### 使用监控脚本：

```bash
# 查看详细状态
./monitor.sh
```

### 3. 日志管理

#### 在 1Panel 中查看：

- 进入 "容器" 页面
- 点击容器名称
- 选择 "日志" 标签页

#### 使用命令行：

```bash
# 实时查看日志
docker logs -f nestjs-backend

# 查看最近日志
docker logs --tail 100 nestjs-backend

# 查看特定时间日志
docker logs --since "2024-01-01T00:00:00" nestjs-backend
```

## 配置说明

### 1. 容器配置

#### 资源限制

```yaml
deploy:
  resources:
    limits:
      memory: 512M # 最大内存
      cpus: '0.5' # 最大 CPU
    reservations:
      memory: 256M # 预留内存
      cpus: '0.25' # 预留 CPU
```

#### 健康检查

```yaml
healthcheck:
  test:
    [
      'CMD',
      'node',
      '-e',
      "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })",
    ]
  interval: 30s # 检查间隔
  timeout: 10s # 超时时间
  retries: 3 # 重试次数
  start_period: 40s # 启动等待时间
```

### 2. 网络配置

#### 1Panel 网络

```yaml
networks:
  1panel-network:
    driver: bridge
    labels:
      - '1panel.network.name=1panel-network'
```

#### 端口映射

```yaml
ports:
  - '11000:3000' # 主机端口:容器端口
```

### 3. 存储配置

#### 数据卷

```yaml
volumes:
  - ./logs:/app/logs # 日志目录
  - ./config:/app/config:ro # 配置文件（只读）
  - ./data:/app/data # 数据目录
```

## 故障排除

### 1. 常见问题

#### 容器启动失败

**问题**: 容器无法启动
**解决**:

1. 在 1Panel 中查看容器日志
2. 检查端口是否被占用
3. 验证镜像是否正确拉取
4. 检查资源限制是否合理

#### 健康检查失败

**问题**: 健康检查不通过
**解决**:

1. 检查应用是否正常启动
2. 验证健康检查端点 `/health`
3. 查看应用日志
4. 检查网络连接

#### 资源不足

**问题**: 容器因资源不足被杀死
**解决**:

1. 在 1Panel 中调整资源限制
2. 检查服务器可用资源
3. 优化应用配置

### 2. 日志分析

#### 应用日志

```bash
# 查看应用日志
tail -f logs/2024-01-01_info.log

# 查看错误日志
tail -f logs/2024-01-01_error.log
```

#### 容器日志

```bash
# 查看容器启动日志
docker logs nestjs-backend

# 查看实时日志
docker logs -f nestjs-backend
```

### 3. 性能优化

#### 资源调优

1. **内存优化**: 根据实际使用情况调整内存限制
2. **CPU 优化**: 合理分配 CPU 资源
3. **网络优化**: 使用 1Panel 网络管理功能

#### 应用优化

1. **日志轮转**: 配置日志自动轮转
2. **缓存策略**: 启用应用缓存
3. **数据库连接**: 优化数据库连接池

## 监控和维护

### 1. 1Panel 监控

#### 容器监控

- CPU 使用率
- 内存使用率
- 网络 I/O
- 磁盘 I/O

#### 系统监控

- 服务器资源使用情况
- 磁盘空间
- 网络状态

### 2. 告警配置

#### 在 1Panel 中设置：

1. 进入 "监控" 页面
2. 配置资源使用告警
3. 设置容器状态告警

#### 自定义监控：

```bash
# 创建监控脚本
cat > /etc/cron.d/nestjs-monitor << EOF
# 每5分钟检查一次容器状态
*/5 * * * * root /home/user/nestjs-backend/monitor.sh >> /var/log/nestjs-monitor.log 2>&1
EOF
```

### 3. 备份策略

#### 容器备份

```bash
# 手动备份容器
docker commit nestjs-backend nestjs-backup-$(date +%Y%m%d)

# 导出容器
docker export nestjs-backend > nestjs-backup.tar
```

#### 数据备份

```bash
# 备份数据目录
tar -czf data-backup-$(date +%Y%m%d).tar.gz ./data

# 备份配置
tar -czf config-backup-$(date +%Y%m%d).tar.gz ./config
```

## 高级功能

### 1. 多环境部署

#### 开发环境

```bash
./deploy-1panel.sh development dev-latest
```

#### 生产环境

```bash
./deploy-1panel.sh production latest
```

### 2. 滚动更新

#### 零停机更新

```bash
# 使用 Docker Compose 进行滚动更新
docker-compose -f docker-compose-1panel.yml up -d --no-deps nestjs-backend
```

### 3. 负载均衡

#### 多实例部署

```yaml
# 在 docker-compose-1panel.yml 中配置多个实例
services:
  nestjs-backend-1:
    # ... 配置
  nestjs-backend-2:
    # ... 配置
  nginx:
    # 配置负载均衡
```

## 最佳实践

### 1. 安全建议

- 定期更新镜像
- 使用非 root 用户运行容器
- 配置防火墙规则
- 定期备份数据

### 2. 性能建议

- 合理设置资源限制
- 使用 SSD 存储
- 配置日志轮转
- 启用应用缓存

### 3. 维护建议

- 定期检查容器状态
- 监控资源使用情况
- 及时更新依赖
- 保持文档更新

## 联系支持

如果遇到问题，请：

1. 查看 1Panel 容器日志
2. 检查 GitHub Actions 日志
3. 参考本文档的故障排除部分
4. 提交 Issue 到项目仓库

---

**注意**: 本指南基于 1Panel 最新版本编写，如遇到版本兼容性问题，请参考 1Panel 官方文档。
