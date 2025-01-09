import { LoggerService } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export default {
  install: (app: NestExpressApplication) => {
    // 日志模块
    const logger: LoggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(logger);
  },
};
