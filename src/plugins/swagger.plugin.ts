/**
 * swagger配置文件
 */
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default {
  install: (app: NestExpressApplication) => {
    const options = new DocumentBuilder()
      .setTitle('畅搭配')
      .setDescription('畅搭配 接口文档 https://gitee.com/fun-match/fun-match-backend')
      .setVersion('v0.0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  },
};
