import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { value2Enum } from '@/utils';
import { FileUploadDto } from './dto/upload.dto';
import { UploadService } from './upload.service';
import { EFolder, EOssType } from './upload.type';

@ApiTags('文件模块')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @ApiOperation({ summary: '上传文件-单个' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() formData: FileUploadDto, @UploadedFile() file: Express.Multer.File) {
    // 进行文件保存等操作
    const result = await this.uploadService.upload(file, await this.generateOption(formData));
    return { url: `${result.pathPrefix}/${result.path}` };
  }

  @Post('files')
  @ApiOperation({ summary: '上传文件-多个' })
  // @Roles(EUserRole.SuperAdmin)
  async uploadFiles(@Body() formData: FileUploadDto) {
    const files = Object.values(formData).filter(item => item.type === 'file');
    // 进行文件保存等操作
    const results = await this.uploadService.uploadBatch(
      files,
      await this.generateOption(formData),
    );
    return results.map(result => ({
      url: `${result.pathPrefix}/${result.path}`,
    }));
  }

  @Post('avatar')
  @ApiOperation({ summary: '上传头像' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Body() body: FileUploadDto, @UploadedFile() file: Express.Multer.File) {
    // const file = body['file'];
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

  private async generateOption(body: FileUploadDto): Promise<FileUploadDto> {
    const option: FileUploadDto = {
      noRandomFileName: true,
    };
    if (body['noRandomFileName']) {
      option.noRandomFileName = !!body['noRandomFileName'];
    }
    if (body['folder']) {
      option.folder = body['folder'] || null;
    }
    if (body['width'] || body['height']) {
      option.resize = {};
      if (body['width']) {
        option.resize.width = Math.max(Math.min(parseInt(body['width']), 1920), 100);
      }
      if (body['height']) {
        option.resize.height = Math.max(Math.min(parseInt(body['height']), 1080), 100);
      }
    }
    // quality 只允许30-100 。默认80
    if (body['quality']) {
      option.quality = Math.max(Math.min(parseInt(body['quality'] + ''), 30), 100) || 80;
    }
    //  允许上传时根据请求配置上传到不同的oss
    if (body['oss']) {
      option.oss = value2Enum(EOssType, body['oss']);
    }
    return option;
  }
}
