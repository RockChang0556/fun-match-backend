import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyCodeEntity } from '@/entities/verify-code.entity';
import { VerifyCodeController } from './verify-code.controller';
import { VerifyCodeService } from './verify-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerifyCodeEntity])],
  controllers: [VerifyCodeController],
  providers: [VerifyCodeService],
  exports: [VerifyCodeService, TypeOrmModule],
})
export class VerifyCodeModule {}
