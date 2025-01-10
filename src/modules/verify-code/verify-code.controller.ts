import { Body, Controller, Post } from '@nestjs/common';
import { VerifyCodeCreateDto, VerifyCodeValidDto } from './dto/verify-code.dto';
import { VerifyCodeService } from './verify-code.service';
@Controller('verify-code')
export class VerifyCodeController {
  constructor(private readonly verifyCodeService: VerifyCodeService) {}

  @Post('send')
  async sendCode(@Body() createDto: VerifyCodeCreateDto) {
    return await this.verifyCodeService.create(createDto);
  }
  @Post('verify')
  async verifyCode(@Body() verifyDto: VerifyCodeValidDto) {
    return await this.verifyCodeService.verify(verifyDto);
  }
}
