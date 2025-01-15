import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@/decorators/noAuth.decorator';
import { User } from '@/entities/user.entity';
import { AuthPhoneUserDto, AuthUserDto, AuthWechatUserDto, RLoginUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('登录注册模块')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户登录-账号密码' })
  signin(@Body() dto: AuthUserDto): Promise<RLoginUserDto> {
    return this.authService.loginByPassword(dto);
  }

  @Post('/login-phone')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户登录-手机验证码' })
  loginByPhone(@Body() dto: AuthPhoneUserDto): Promise<RLoginUserDto> {
    return this.authService.loginByPhone(dto.phone, dto.code);
  }

  @Post('/login-wechat')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户登录-微信登录' })
  loginByWechat(@Body() dto: AuthWechatUserDto): Promise<RLoginUserDto> {
    return this.authService.loginByWechat(dto.code);
  }

  @Post('/signup')
  @NoAuth('ALL')
  @ApiOperation({ summary: '用户注册' })
  signup(@Body() dto: AuthUserDto): Promise<User> {
    return this.authService.signup(dto);
  }
}
