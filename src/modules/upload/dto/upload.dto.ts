// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ResizeOptions } from 'sharp';
import { EFolder, EOssType } from '../upload.type';

export class FileUploadDto {
  /** 是否修改图片尺寸 */
  resize?: null | ResizeOptions;
  /** 压缩图片的质量 */
  quality?: number;
  /** 上传到 oss */
  oss?: EOssType;
  /** 文件名称,无需后缀 */
  fileName?: string;
  /** 是否随机文件名称,在fileName不存在时生效 */
  noRandomFileName?: boolean;
  /** 文件夹路径 */
  folder?: EFolder;
  /** 上传的文件 */
  file?: string;
}
