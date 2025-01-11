import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@/decorators/noAuth.decorator';
import { VerifyCodeCreateDto, VerifyCodeValidDto } from './dto/verify-code.dto';
import { VerifyCodeService } from './verify-code.service';

@Controller('verify-code')
@ApiTags('手机验证码模块')
export class VerifyCodeController {
  constructor(private readonly verifyCodeService: VerifyCodeService) {}

  @Post('send')
  @ApiOperation({ summary: '发送验证码' })
  @NoAuth('ALL')
  async sendCode(@Body() createDto: VerifyCodeCreateDto) {
    return await this.verifyCodeService.create(createDto);
  }
  @Post('verify')
  @ApiOperation({ summary: '校验验证码' })
  @NoAuth('ALL')
  async verifyCode(@Body() verifyDto: VerifyCodeValidDto) {
    return await this.verifyCodeService.verify(verifyDto);
  }
}
