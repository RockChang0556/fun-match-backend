import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';

export default {
  install: (app: NestExpressApplication) => {
    // 全局验证管道
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, //如果设置为 true，验证程序将除去未使用任何装饰器的属性的已验证对象
        disableErrorMessages: process.env.NODE_ENV === 'production',
      }),
    );
  },
};
