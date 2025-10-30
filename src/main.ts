import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@/app.module';
import { serverConfig } from '@/config';
import { ResponseInterceptor } from '@/interceptors/response.interceptor';
import plugins from '@/plugins';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    cors: true, // 允许跨域
  });

  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api');

  // 设置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 添加健康检查端点
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  await plugins.install(app);

  const port = process.env.PORT || serverConfig.port;

  await app.listen(port, () => {
    console.log('server run at');
    console.log(`   - Local: http://${serverConfig.origin}:${port}`);
  });
}

bootstrap();
