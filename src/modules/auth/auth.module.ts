import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigEnum } from '@/constants/enum/config.enum';
import { JwtStrategy } from '@/guards/jwt.strategy';
import { VerifyCodeModule } from '@/modules/verify-code/verify-code.module';
import { UserModule } from '../user/user.module';
import { WechatAuthModule } from './wechat-auth/wechat-auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    WechatAuthModule,

    VerifyCodeModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get(`${ConfigEnum.JWT_CONFIG}.secret`),
        signOptions: {
          expiresIn: config.get(`${ConfigEnum.JWT_CONFIG}.expiresIn`),
        },
      }),
    }), // 使用异步方法导入jwt模块
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
