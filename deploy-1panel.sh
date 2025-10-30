#!/bin/bash

# 1Panel 专用部署脚本
# 使用方法: ./deploy-1panel.sh [环境] [镜像标签]
# 例如: ./deploy-1panel.sh production latest

set -e

# 配置变量
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
REGISTRY="ghcr.io"
IMAGE_NAME="rockchang0556/fun-match-backend"
CONTAINER_NAME="nestjs-backend"
PORT="11000"
NETWORK_NAME="1panel-network"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
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

# 检查 1Panel 环境
check_1panel() {
    log_info "检查 1Panel 环境..."

    # 检查 Docker 是否运行
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行，请通过 1Panel 启动 Docker 服务"
        exit 1
    fi

    # 检查 1Panel 网络
    if ! docker network ls --format "{{.Name}}" | grep -q "^${NETWORK_NAME}$"; then
        log_info "创建 1Panel 网络..."
        docker network create ${NETWORK_NAME} --driver bridge
    fi

    log_success "1Panel 环境检查完成"
}

# 备份当前容器
backup_container() {
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_info "备份当前容器..."
        local backup_name="${CONTAINER_NAME}-backup-$(date +%Y%m%d-%H%M%S)"
        docker commit ${CONTAINER_NAME} ${backup_name} || true
        log_success "容器备份完成: ${backup_name}"
    fi
}

# 停止并删除现有容器
stop_container() {
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_info "停止现有容器..."
        docker stop ${CONTAINER_NAME} || true
        docker rm ${CONTAINER_NAME} || true
        log_success "容器已停止并删除"
    fi
}

# 拉取最新镜像
pull_image() {
    log_info "拉取最新镜像: ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    docker pull ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
    log_success "镜像拉取完成"
}

# 创建必要的目录
create_directories() {
    log_info "创建必要的目录..."
    mkdir -p ./logs
    mkdir -p ./config
    mkdir -p ./data
    log_success "目录创建完成"
}

# 使用 1Panel 优化配置部署
deploy_with_1panel() {
    log_info "使用 1Panel 优化配置部署..."

    # 创建环境变量文件
    cat > .env << EOF
NODE_ENV=${ENVIRONMENT}
TZ=Asia/Shanghai
PORT=3000
EOF

    # 启动容器，使用 1Panel 推荐配置
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart=unless-stopped \
        --network ${NETWORK_NAME} \
        -p ${PORT}:3000 \
        -e NODE_ENV=${ENVIRONMENT} \
        -e TZ=Asia/Shanghai \
        -v $(pwd)/logs:/app/logs \
        -v $(pwd)/config:/app/config:ro \
        -v $(pwd)/data:/app/data \
        --memory="512m" \
        --cpus="0.5" \
        --health-cmd="node -e \"require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })\"" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        --health-start-period=40s \
        ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}

    log_success "容器启动完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."

    # 等待容器启动
    sleep 15

    # 检查容器是否运行
    if ! docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_error "容器未运行"
        return 1
    fi

    # 检查健康检查端点
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker exec ${CONTAINER_NAME} node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" 2>/dev/null; then
            log_success "健康检查通过！"
            return 0
        fi

        log_info "健康检查尝试 $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done

    log_error "健康检查失败"
    return 1
}

# 清理旧镜像
cleanup_images() {
    log_info "清理未使用的镜像..."
    docker image prune -f
    log_success "镜像清理完成"
}

# 显示部署状态
show_status() {
    log_info "部署状态："
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Size}}"

    if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_info "容器资源使用情况："
        docker stats ${CONTAINER_NAME} --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

        log_info "容器日志（最后20行）："
        docker logs ${CONTAINER_NAME} --tail 20
    fi
}

# 生成 1Panel 监控脚本
generate_monitoring_script() {
    log_info "生成 1Panel 监控脚本..."

    cat > monitor.sh << 'EOF'
#!/bin/bash

# 1Panel 监控脚本
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

    chmod +x monitor.sh
    log_success "监控脚本已生成: monitor.sh"
}

# 回滚函数
rollback() {
    log_warning "开始回滚..."

    # 停止当前容器
    stop_container

    # 查找最新的备份镜像
    local backup_image=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "${CONTAINER_NAME}-backup" | head -1)

    if [ -n "$backup_image" ]; then
        log_info "回滚到备份镜像: $backup_image"
        docker run -d \
            --name ${CONTAINER_NAME} \
            --restart=unless-stopped \
            --network ${NETWORK_NAME} \
            -p ${PORT}:3000 \
            -e NODE_ENV=${ENVIRONMENT} \
            -e TZ=Asia/Shanghai \
            -v $(pwd)/logs:/app/logs \
            -v $(pwd)/config:/app/config:ro \
            -v $(pwd)/data:/app/data \
            --memory="512m" \
            --cpus="0.5" \
            ${backup_image}

        if health_check; then
            log_success "回滚成功！"
        else
            log_error "回滚失败！"
            exit 1
        fi
    else
        log_error "未找到备份镜像，无法回滚"
        exit 1
    fi
}

# 生成 1Panel 快速操作脚本
generate_quick_actions() {
    log_info "生成 1Panel 快速操作脚本..."

    cat > quick-actions.sh << 'EOF'
#!/bin/bash

# 1Panel 快速操作脚本
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

    chmod +x quick-actions.sh
    log_success "快速操作脚本已生成: quick-actions.sh"
}

# 主函数
main() {
    log_info "开始 1Panel 部署 ${IMAGE_NAME}:${IMAGE_TAG} 到 ${ENVIRONMENT} 环境"

    # 检查参数
    if [ "$1" = "rollback" ]; then
        rollback
        exit 0
    fi

    # 执行部署流程
    check_1panel
    backup_container
    stop_container
    pull_image
    create_directories
    deploy_with_1panel
    cleanup_images
    generate_monitoring_script
    generate_quick_actions

    # 健康检查
    if health_check; then
        log_success "1Panel 部署成功完成！"
        show_status
        echo ""
        log_info "可用命令："
        echo "  ./monitor.sh          # 查看容器状态"
        echo "  ./quick-actions.sh    # 快速操作"
        echo "  ./deploy-1panel.sh rollback  # 回滚"
    else
        log_error "部署失败，开始回滚..."
        rollback
    fi
}

# 执行主函数
main "$@"
