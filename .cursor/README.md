# Cursor 配置目录

这个目录包含了 Cursor AI 编辑器的配置文件。

## 文件结构

```
.cursor/
├── rules/
│   └── .cursorrules    # Cursor AI 规则配置文件
└── README.md           # 本说明文件
```

## 规则文件说明

`.cursorrules` 文件包含了项目的编码规范和 AI 助手行为规则，包括：

- **项目概述**：技术栈和架构说明
- **代码规范**：文件命名、目录结构、模块组织等
- **开发约定**：导入顺序、注释规范、错误处理等
- **性能优化建议**：数据库查询、API 响应优化等
- **测试和部署规范**：单元测试、集成测试、Docker 化等

## 规则生效位置

Cursor 会在以下位置查找规则文件：

1. 项目根目录的 `.cursorrules`
2. `.cursor/rules/` 目录下的任何文件
3. `.cursor/rules/` 目录下的 `.cursorrules` 文件 ✅

当前规则文件位于：`.cursor/rules/.cursorrules`

## 更新规则

如需更新规则，请编辑 `.cursor/rules/.cursorrules` 文件。修改后，Cursor 会自动重新加载规则。

## 注意事项

- 规则文件使用 Markdown 格式
- 支持中文注释和说明
- 规则会影响 Cursor AI 的代码生成和建议行为
- 建议团队成员都了解并遵循这些规则
