#!/bin/bash

# 1Panel 环境快速配置脚本
# 使用方法: ./setup-1panel.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 1Panel 是否安装
check_1panel() {
    log_info "检查 1Panel 安装状态..."

    if command -v 1pctl >/dev/null 2>&1; then
        log_success "1Panel 已安装"
        return 0
    else
        log_warning "1Panel 未安装，请先安装 1Panel"
        echo "安装命令: curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh"
        return 1
    fi
}

# 检查 Docker 状态
check_docker() {
    log_info "检查 Docker 状态..."

    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行，请通过 1Panel 启动 Docker 服务"
        return 1
    fi

    log_success "Docker 运行正常"
}

# 创建项目目录
create_project_dir() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_info "创建项目目录: $project_dir"

    mkdir -p "$project_dir"/{logs,config,data,ssl}

    # 设置权限
    chmod 755 "$project_dir"
    chmod 755 "$project_dir"/{logs,config,data,ssl}

    log_success "项目目录创建完成"
}

# 创建 1Panel 网络
create_network() {
    log_info "创建 1Panel 网络..."

    if ! docker network ls --format "{{.Name}}" | grep -q "^1panel-network$"; then
        docker network create 1panel-network --driver bridge
        log_success "1Panel 网络创建完成"
    else
        log_info "1Panel 网络已存在"
    fi
}

# 创建环境配置文件
create_env_file() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_info "创建环境配置文件..."

    cat > "$project_dir/.env" << 'EOF'
# 应用配置
NODE_ENV=production
TZ=Asia/Shanghai
PORT=3000

# 数据库配置（根据实际情况修改）
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nestjs_backend

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# 其他配置
LOG_LEVEL=info
CORS_ORIGIN=*
EOF

    log_success "环境配置文件创建完成"
}

# 创建 Nginx 配置
create_nginx_config() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_info "创建 Nginx 配置..."

    cat > "$project_dir/nginx.conf" << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server nestjs-backend:3000;
    }

    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    server {
        listen 80;
        server_name localhost;

        location /health {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        location /api-docs {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
EOF

    log_success "Nginx 配置创建完成"
}

# 创建 Docker Compose 配置
create_docker_compose() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_info "创建 Docker Compose 配置..."

    cat > "$project_dir/docker-compose-1panel.yml" << 'EOF'
version: '3.8'

services:
  nestjs-backend:
    image: ghcr.io/rockchang0556/fun-match-backend:latest
    container_name: nestjs-backend
    restart: unless-stopped
    ports:
      - '11000:3000'
    environment:
      - NODE_ENV=production
      - TZ=Asia/Shanghai
    volumes:
      - ./logs:/app/logs
      - ./config:/app/config:ro
      - ./data:/app/data
    networks:
      - 1panel-network
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
    healthcheck:
      test:
        [
          'CMD',
          'node',
          '-e',
          "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
    labels:
      - '1panel.app.name=nestjs-backend'
      - '1panel.app.description=NestJS Backend API'
      - '1panel.app.version=latest'

  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - nestjs-backend
    networks:
      - 1panel-network
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'
    labels:
      - '1panel.app.name=nginx-proxy'
      - '1panel.app.description=Nginx Reverse Proxy'

networks:
  1panel-network:
    driver: bridge
    labels:
      - '1panel.network.name=1panel-network'

volumes:
  logs:
    driver: local
    labels:
      - '1panel.volume.name=logs'
  data:
    driver: local
    labels:
      - '1panel.volume.name=data'
EOF

    log_success "Docker Compose 配置创建完成"
}

# 创建管理脚本
create_management_scripts() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_info "创建管理脚本..."

    # 创建快速操作脚本
    cat > "$project_dir/quick-actions.sh" << 'EOF'
#!/bin/bash

CONTAINER_NAME="nestjs-backend"

case "$1" in
    "start")
        echo "启动容器..."
        docker start ${CONTAINER_NAME}
        ;;
    "stop")
        echo "停止容器..."
        docker stop ${CONTAINER_NAME}
        ;;
    "restart")
        echo "重启容器..."
        docker restart ${CONTAINER_NAME}
        ;;
    "logs")
        echo "查看日志..."
        docker logs -f ${CONTAINER_NAME}
        ;;
    "status")
        echo "容器状态..."
        docker ps --filter "name=${CONTAINER_NAME}"
        ;;
    "shell")
        echo "进入容器..."
        docker exec -it ${CONTAINER_NAME} /bin/sh
        ;;
    "update")
        echo "更新容器..."
        ./deploy-1panel.sh production latest
        ;;
    *)
        echo "使用方法: $0 {start|stop|restart|logs|status|shell|update}"
        exit 1
        ;;
esac
EOF

    # 创建监控脚本
    cat > "$project_dir/monitor.sh" << 'EOF'
#!/bin/bash

CONTAINER_NAME="nestjs-backend"

echo "=== 容器状态 ==="
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n=== 资源使用 ==="
docker stats ${CONTAINER_NAME} --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

echo -e "\n=== 健康检查 ==="
if docker exec ${CONTAINER_NAME} node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" 2>/dev/null; then
    echo "✅ 健康检查通过"
else
    echo "❌ 健康检查失败"
fi

echo -e "\n=== 最近日志 ==="
docker logs ${CONTAINER_NAME} --tail 10
EOF

    # 设置执行权限
    chmod +x "$project_dir/quick-actions.sh"
    chmod +x "$project_dir/monitor.sh"

    log_success "管理脚本创建完成"
}

# 创建系统服务
create_systemd_service() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_info "创建系统服务..."

    cat > /tmp/nestjs-backend.service << EOF
[Unit]
Description=NestJS Backend Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$project_dir
ExecStart=/usr/bin/docker-compose -f docker-compose-1panel.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose-1panel.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo mv /tmp/nestjs-backend.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable nestjs-backend.service

    log_success "系统服务创建完成"
}

# 显示配置信息
show_config_info() {
    local project_dir="/home/$(whoami)/nestjs-backend"

    log_success "1Panel 环境配置完成！"
    echo ""
    echo "📁 项目目录: $project_dir"
    echo "🐳 容器名称: nestjs-backend"
    echo "🌐 访问端口: http://localhost:11000"
    echo "📊 健康检查: http://localhost:11000/health"
    echo ""
    echo "🔧 可用命令:"
    echo "  cd $project_dir"
    echo "  ./quick-actions.sh start    # 启动容器"
    echo "  ./quick-actions.sh stop     # 停止容器"
    echo "  ./quick-actions.sh restart  # 重启容器"
    echo "  ./quick-actions.sh logs     # 查看日志"
    echo "  ./quick-actions.sh status   # 查看状态"
    echo "  ./monitor.sh                # 监控状态"
    echo ""
    echo "📋 下一步操作:"
    echo "1. 修改 $project_dir/.env 文件中的配置"
    echo "2. 在 1Panel 中查看容器状态"
    echo "3. 使用 ./deploy-1panel.sh 进行部署"
    echo ""
    echo "📖 详细文档: 查看 1PANEL-DEPLOYMENT.md"
}

# 主函数
main() {
    log_info "开始配置 1Panel 环境..."

    # 检查环境
    if ! check_1panel; then
        exit 1
    fi

    if ! check_docker; then
        exit 1
    fi

    # 创建配置
    create_project_dir
    create_network
    create_env_file
    create_nginx_config
    create_docker_compose
    create_management_scripts
    create_systemd_service

    # 显示信息
    show_config_info
}

# 执行主函数
main "$@"
