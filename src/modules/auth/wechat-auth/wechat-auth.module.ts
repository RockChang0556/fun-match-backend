import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WechatAuthService } from './wechat-auth.service';

@Module({
  imports: [HttpModule],
  providers: [WechatAuthService],
  exports: [WechatAuthService],
})
export class WechatAuthModule {}
