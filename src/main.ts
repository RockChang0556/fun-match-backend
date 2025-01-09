import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as Config from 'config';
import { AppModule } from '@/app.module';
import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import plugins from '@/plugins';

// 获取本地服务配置
const config = Config.get('server');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    cors: true, // 允许跨域
  });

  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api');

  // 设置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  await plugins.install(app);

  const port = process.env.PORT || config.port;

  await app.listen(port, () => {
    console.log('server run at');
    console.log(`   - Local: http://${config.origin}:${port}`);
  });
}

bootstrap();
