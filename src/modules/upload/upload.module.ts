import { Module } from '@nestjs/common';
import { OssService } from './oss/oss.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService, OssService],
  exports: [UploadService, OssService],
  controllers: [UploadController],
})
export class UploadModule {}
