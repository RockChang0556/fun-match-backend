import { Injectable } from '@nestjs/common';
import { ossConfig } from '@/config';
import { EOssType } from '../upload.type';
import { QiNiuOssService } from './qiniu.oss.service';

export interface OssUploadOption {
  fileName: string;
  folder: string;
}

export interface OssUploadResult {
  pathPrefix: string;
  path: string;
}

export interface IOssService {
  upload(file: Buffer, uploadOption: OssUploadOption): Promise<OssUploadResult>;
}

@Injectable()
export class OssService {
  private instances: Map<EOssType, IOssService>;
  constructor() {
    // 在这里配置各个oss服务
    this.instances = new Map([[EOssType.QINIU, new QiNiuOssService()]]);
  }

  handler(type: EOssType): IOssService | undefined {
    return this.instances.get(type);
  }
  getDomain(type: EOssType) {
    return ossConfig[`OSS_${type.toUpperCase()}_DOMAIN`];
  }
}
