import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@/decorators/noAuth.decorator';
import { AuthPhoneUserDto, AuthUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('登录注册模块')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户登录-账号密码' })
  async signin(@Body() dto: AuthUserDto) {
    const userInfo = await this.authService.loginByPassword(dto);
    return userInfo;
  }

  @Post('/login-phone')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户登录-手机验证码' })
  async loginByPhone(@Body() dto: AuthPhoneUserDto) {
    return await this.authService.loginByPhone(dto.phone, dto.code);
  }

  @Post('/signup')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户注册' })
  signup(@Body() dto: AuthUserDto) {
    return this.authService.signup(dto);
  }
}
