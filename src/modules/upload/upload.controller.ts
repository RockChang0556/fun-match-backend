import { Controller, Post, Req, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { value2Enum } from '@/utils';
import { UploadOption, UploadService } from './upload.service';
import { EFolder, EOssType } from './upload.type';

@ApiTags('文件模块')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @ApiOperation({ summary: '上传文件-单个' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    // 进行文件保存等操作
    const result = await this.uploadService.upload(file, await this.generateOption(req));
    return { url: `${result.pathPrefix}/${result.path}` };
  }

  @Post('files')
  @ApiOperation({ summary: '上传文件-多个' })
  // @Roles(EUserRole.SuperAdmin)
  async uploadFiles(@Req() req: Request) {
    const files = Object.values(req.body).filter(item => item.type === 'file');
    // 进行文件保存等操作
    const results = await this.uploadService.uploadBatch(files, await this.generateOption(req));
    return results.map(result => ({
      url: `${result.pathPrefix}/${result.path}`,
    }));
  }

  @Post('avatar')
  @ApiOperation({ summary: '上传头像' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    // const file = req.body['file'];
    // 进行文件保存等操作
    const result = await this.uploadService.upload(file, {
      folder: EFolder.AVATAR,
      resize: {
        width: 400,
        height: 400,
        fit: 'cover',
        position: 'center',
      },
      quality: 80,
    });
    return { url: `${result.pathPrefix}/${result.path}` };
  }

  private async generateOption(req: Request): Promise<UploadOption> {
    const option: UploadOption = {
      noRandomFileName: true,
    };
    if (req.body['noRandomFileName']) {
      option.noRandomFileName = !!req.body['noRandomFileName'];
    }
    if (req.body['folder']) {
      option.folder = req.body['folder'] || null;
    }
    if (req.body['width'] || req.body['height']) {
      option.resize = {};
      if (req.body['width']) {
        option.resize.width = Math.max(Math.min(parseInt(req.body['width']), 1920), 100);
      }
      if (req.body['height']) {
        option.resize.height = Math.max(Math.min(parseInt(req.body['height']), 1080), 100);
      }
    }
    // quality 只允许30-100 。默认80
    if (req.body['quality']) {
      option.quality = Math.max(Math.min(parseInt(req.body['quality']), 30), 100) || 80;
    }
    //  允许上传时根据请求配置上传到不同的oss
    if (req.body['oss']) {
      option.oss = value2Enum(EOssType, req.body['oss']);
    }
    return option;
  }
}
