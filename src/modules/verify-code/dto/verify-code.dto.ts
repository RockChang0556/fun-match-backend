import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { RegPhone } from '@/constants/const';
import { EVerifyCodeType } from '../verify-code.enum';

export class VerifyCodeCreateDto {
  @ApiProperty({ description: '手机号', required: true })
  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(RegPhone.match, { message: RegPhone.message })
  phone: string;

  @ApiProperty({ description: '验证码类型', required: true })
  @IsString()
  @IsEnum(EVerifyCodeType, { message: '类型错误' })
  type: EVerifyCodeType;
}

export class VerifyCodeValidDto extends VerifyCodeCreateDto {
  @Length(6)
  @IsString()
  code: string;
}
