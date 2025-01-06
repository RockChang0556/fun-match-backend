<h1 align="center">
  fun-match-nestjs
</h1>
<h4 align="center">使用 Nest+TS 构建的 CMS 开发框架</h4>

<!-- <p align="center">
  <img src="https://img.shields.io/github/license/RockChang0556/fun-match-nestjs" alt="license" />
  <img src="https://img.shields.io/github/package-json/v/RockChang0556/fun-match-nestjs" alt="version" />
  <img src="https://img.shields.io/github/languages/top/RockChang0556/fun-match-nestjs" alt="languages" />
</p> -->

---

## 简介

<!-- 基于: https://github.com/sankeyangshu/nest-template-cms -->

🚀🚀🚀 **nest-template-cms** 一个基于 nestjs 框架的后台管理系统的基础模块的应用，使用了`NestJs`、`MySQL2`、`TypeORM`、`Docker`、`Redis`、`Typescript`等主流技术开发，集成了 jwt 认证模块、rbac 权限模块、cms 模块、swagger 模块、日志模块等诸多模块，集成了代码规范检查工具`Eslint`、`Prettier`。你可以在此之上直接开发你的业务代码！希望你能喜欢。👋👋👋

## ✨ 项目功能

- 🚀 采用最新技术栈开发：NestJs、MySQL2、TypeORM、Docker、Redis、TypeScript
- 🚀 整个项目集成了 TypeScript
- 🚀 使用 Prettier 统一格式化代码，集成 Eslint 代码校验规范（项目规范配置）
- 🚀 使用 husky、lint-staged、commitlint 规范提交信息（项目规范配置）

## 基础知识

提前了解和学习这些知识会对使用本项目有很大的帮助。

- [NestJs](https://docs.nestjs.com/) - 熟悉 `NestJs` 基础语法
- [TypeORM](https://typeorm.io/) - 熟悉 `TypeORM`基本使用
- [TypeScript](https://www.typescriptlang.org/) - 熟悉 `TypeScript` 基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 `ES6` 基本语法

## 环境准备

本地环境需要安装 [pnpm7.x](https://www.pnpm.cn/)、[Node.js](http://nodejs.org/) 和 [Git](https://git-scm.com/)

- 必须使用[pnpm7.x](https://www.pnpm.cn/)，否则依赖可能安装不上。
- [Node.js](http://nodejs.org/) 版本要求`12.x`以上，这里推荐 `16.x` 及以上。

## Vscode 配套插件

如果你使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

- [Vscode NestJs Snippets](https://marketplace.visualstudio.com/items?itemName=ashinzekene.nestjs) - NestJs 开发必备
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) - Docker 插件
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 脚本代码检查
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化

## 安装和使用

```bash
# 克隆项目
git clone git@github.com:RockChang0556/fun-match-nestjs.git

# 进入项目目录
cd nest-template-cms

# 安装依赖 - 推荐使用pnpm
pnpm install

# 启动服务 development 模式
pnpm start:dev

# 启动服务 production 模式
pnpm start:prod

# 打包发布
pnpm build
```

## 许可证

[MIT License](https://github.com/RockChang0556/fun-match-nestjs/blob/master/LICENSE)
