import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WechatAuthController } from './wechat-auth.controller';
import { WechatAuthService } from './wechat-auth.service';

@Module({
  imports: [HttpModule],
  controllers: [WechatAuthController],
  providers: [WechatAuthService],
  exports: [WechatAuthService],
})
export class WechatAuthModule {}
