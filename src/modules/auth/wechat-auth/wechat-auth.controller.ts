import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@/decorators/noAuth.decorator';
import { CustomException } from '@/exception/custom-exception';
import { EErrorCode } from '@/exception/exception.enum';
import { WechatAuthService } from './wechat-auth.service';

@Controller('wechat-auth')
@ApiTags('登录注册模块')
export class WechatAuthController {
  constructor(private readonly wechatAuthService: WechatAuthService) {}

  @Get('getAuthUrl')
  @NoAuth('ALL')
  @ApiOperation({ summary: '获取微信登录 url' })
  getAuthUrl(
    @Query('scope') scope,
    @Query('redirectUrl') redirectUrl,
    @Query('state') state,
  ): string {
    if (redirectUrl) {
      const wxAuthUrl = this.wechatAuthService.getAuthUrl(redirectUrl, state, scope);

      return wxAuthUrl;
    } else {
      throw new CustomException({
        message: '需要传入redirectUrl',
        code: EErrorCode.CLIENT_ERROR,
        manual: true, // 手动抛出错误
      });
    }
  }
}
