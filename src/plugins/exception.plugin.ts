import { LoggerService } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';

// 设置全局异常过滤器
export default {
  install: async (app: NestExpressApplication) => {
    // 日志模块
    const logger: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    // 全局未捕获异常处理;
    // 未捕获的异常;
    process.on('uncaughtException', error => {
      logger.error(`未捕获的异常: `, error?.message);
      // 这里可以添加你的错误处理逻辑，比如发送警报等
    });

    // 未处理的Promise拒绝
    process.on('unhandledRejection', reason => {
      logger.error('未处理的Promise拒绝:', reason as string);
      // 这里可以添加你的错误处理逻辑，比如发送警报等
    });
  },
};
