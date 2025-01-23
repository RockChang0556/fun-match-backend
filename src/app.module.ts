import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/config/winston.config';
import { ConfigEnum } from '@/constants/enum/config.enum';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AuthModule } from './modules/auth/auth.module';
import { LoggersModule } from './modules/loggers/loggers.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { RolesModule } from './modules/roles/roles.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import AppConfig from './config';

@Module({
  imports: [
    // 日志模块
    WinstonModule.forRoot(winstonConfig),
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: AppConfig,
    }),
    // 数据库模块
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get(ConfigEnum.DB_CONFIG),
    }),

    UserModule,
    AuthModule,
    UploadModule,

    RolesModule,
    ResourcesModule,
    LoggersModule,
    PermissionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
