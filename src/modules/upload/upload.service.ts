import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Express } from 'express';
import { value2Enum } from '@/utils';
import { FileUploadDto } from './dto/upload.dto';
// import { resizeImage } from './handler/image.handler';
import { OssService, OssUploadResult } from './oss/oss.service';
import { acceptTypes, EFolder, EOssType } from './upload.type';

@Injectable()
export class UploadService {
  constructor(private ossService: OssService) {}

  async upload(
    file: Express.Multer.File,
    option: FileUploadDto = { quality: 80 },
  ): Promise<OssUploadResult> {
    const fileBuff: Buffer = file.buffer;
    // 检测文件类型
    if (!acceptTypes.includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型');
    }
    // 检测上传文件夹，强制限制只能将文件存放在限制的文件夹内
    const folder = value2Enum(EFolder, option.folder);
    if (!folder) {
      throw new NotFoundException('文件夹路径错误');
    }
    // 压缩图片
    // if (file.mimetype.startsWith('image/') && option && (option.resize || option.quality)) {
    //   fileBuff = await resizeImage(fileBuff, option.resize, option.quality);
    // }

    // 处理文件名
    const sourceFileName = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
    const sourceFileExt = file.originalname.slice(file.originalname.lastIndexOf('.'));
    const filename = `${
      option.fileName ||
      (option.noRandomFileName ? sourceFileName : Math.random().toString(36).slice(2))
    }${sourceFileExt}`;

    // 无需关心具体的Oss，直接从ossServicehandler处理，根据请求配置
    const ossService = this.ossService.handler(option.oss || EOssType.QINIU);
    if (!ossService) {
      throw new NotFoundException('未找到OSS服务');
    }
    const uploadResult = await ossService.upload(fileBuff, {
      fileName: filename,
      folder: option.folder,
    });

    // await this.materialService.create({
    //   ossType: option.oss || EOssType.QINIU,
    //   folder,
    //   name: filename || sourceFileName,
    //   path: uploadResult.path,
    //   type: this.materialService.getTypeByMime(file.mimetype),
    // });
    return uploadResult;
  }

  async uploadBatch(
    files: Express.Multer.File[],
    option: FileUploadDto = null,
  ): Promise<OssUploadResult[]> {
    const asyncQueue = [];
    for await (const file of files) {
      asyncQueue.push(this.upload(file, option));
    }
    return Promise.all(asyncQueue).then(urls => urls);
  }
}
