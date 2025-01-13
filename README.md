<h1 align="center">
  fun-match-backend
</h1>
<h4 align="center">畅搭配的后台项目</h4>

<p align="center">
  <img src="https://img.shields.io/github/license/RockChang0556/fun-match-backend" alt="license" />
  <img src="https://img.shields.io/github/package-json/v/RockChang0556/fun-match-backend" alt="version" />
  <img src="https://img.shields.io/github/languages/top/RockChang0556/fun-match-backend" alt="languages" />
</p>

---

## 简介

🚀🚀🚀 一个基于 nestjs 框架的后台管理系统的基础模块的应用，使用了`NestJs`、`MySQL2`、`TypeORM`、`Docker`、`Redis`、`Typescript`等主流技术开发，集成了 jwt 认证模块、rbac 权限模块、cms 模块、swagger 模块、日志模块等诸多模块，集成了代码规范检查工具`Eslint`、`Prettier`。👋👋👋

## 🔗 功能

- 基础能力
  - 敏感词过滤 (sensitive-word-tool)
  - 安全
    - helemt
    - xss
      - dompurify (html文本内容过滤)
      - csp使用helmet
    - csrf
      - @fastify/csrf-protection
      - @fastify/cookie
    - cors
  - 全局异常处理
    - 自定义异常
    - 拦截及异常捕获处理
    - 特定异常处理转换
  - 统一输出格式
    - 使用 ResponseInterceptor + Filter 实现
  - 日志
    - Winston
  - Crypto加密及解密
    - 密码加密及校验
    - 手机号脱敏及加密
  - 定时器
    - 过期验证码定时清理
- 实体基类
  - 基类定义
    - 普通基类
    - 树形基类（使用物化路径实现）
  - 基类仓储服务
    - 分页
    - where
    - 树节点创建
    - 树子类查询
    - 树根查询
    - 树排序
- 基础功能
  - 登录授权(JWT)
    - 微信
    - 用户名和密码
    - 手机+验证码 （此处未对接短信运营商，如需使用自行处理）
  - 角色鉴权守卫
    - 超管
    - 普通角色
  - 文件上传
    - 可扩展的OSS服务
      - 已实现对接七牛云OSS (七牛云有10G免费，所以做了对接)
    - 图片压缩
      - Sharp
- 基础业务
  - 树形结构分类(Category)
  - 富文本文章(Article)
  - 草稿箱(Draft)
  - 素材管理(Material)
  - 评论模块(Comment)
    - 评论为树形结构(继承自树形基类)
  - 点赞模块(Like)
- 插件/配置
  - 默认启动swagger文档(仅开发环境)
  - 全局验证器(ValidationPipe)
  - FormData处理(fastifyMultipart)

## ⚙️ 文件结构

在变量以及文件夹命名上，其实挺头疼的，我尽量做到`代码即注释`，从最开始写到现在我的项目结构和文件命名已经完全不同，继续加油吧

```
|config # 配置
|const # 常量
|decorators # 装饰器 （参数封装，Dto装饰器）
|entities # 数据模型
|exception # 统一错误处理
|filters # 过滤器 全局异常处理
|guards # 守卫 认证,角色，csrf
|interceptors # 拦截器 处理request及response，csrf
|modules # 业务模块
|plugins  # 插件 日志,swagger,校验等
|utils # 工具方法
|main.ts # 入口
|app.module.ts # 根module
```

## 👾 接口文档及调测

- swagger:
  - 开发启动在 {local-service}/api
  - api-json在 {local-service}/api-json
- ApiFox : https://fun-match.apifox.cn/

## 🚥 TODO

- 底层能力
  - 对接`Sentry`完成监控模块，将后端日志从winston本地迁移到sentry
  - 构建`Docker`部署File，达到一键部署
- 基础业务支持
  - 短信平台对接
  - 用户+角色+权限 完整设计
- 开发体验
  - 全面使用`TypeScript`对项目进行优化
  - 接入文档整理

## 许可证

[MIT License](https://github.com/RockChang0556/fun-match-backend/blob/master/LICENSE)
