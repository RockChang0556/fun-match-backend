import type { NestExpressApplication } from '@nestjs/platform-express';
import * as Config from 'config';
// import autoMapper from './auto-mapper';
import exceptionPlugin from './exception.plugin';
import loggerPlugin from './logger.plugin';
import swaggerPlugin from './swagger.plugin';
// import multipartPlugin from './multipart.plugin';
// import securityPlugin from './security.plugin';
import validatePlugin from './validate.plugin';
export default {
  install: async (app: NestExpressApplication) => {
    // 日志模块
    loggerPlugin.install(app);
    // 错误模块
    exceptionPlugin.install(app);

    // // formData处理 - 文件上传
    // multipartPlugin.install(app);

    // // security 安全模块
    // await securityPlugin.install(app);

    // valid 全局验证模块
    validatePlugin.install(app);
    // autoMapper.install();

    // 设置swagger文档
    if (Config.get('swagger').enable) {
      swaggerPlugin.install(app);
    }
  },
};
