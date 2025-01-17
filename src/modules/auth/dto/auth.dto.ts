import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { RegPhone } from '@/constants/const';
import { User } from '@/entities/user.entity';

export class AuthUserDto {
  /** 用户名 */
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  /** 密码 */
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class AuthPhoneUserDto {
  @ApiProperty({ description: '手机号', required: true })
  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(RegPhone.match, { message: RegPhone.message })
  phone: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsString()
  @Length(4, 6, { message: '验证码格式错误' })
  code: string;
}

export class AuthWechatUserDto {
  @ApiProperty({ description: 'wx.login返回的code', required: true })
  @IsString()
  @IsNotEmpty({ message: 'code不能为空' })
  code: string;
}

export class RLoginUserDto {
  /** 用户信息 */
  user: User;
  /** 登录token */
  token: string;
}
