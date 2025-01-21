import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { ossConfig } from '@/config';
import { CustomException } from '@/exception/custom-exception';
import { IOssService, OssUploadOption, OssUploadResult } from './oss.service';

@Injectable()
export class QiNiuOssService implements IOssService {
  private accessKey: string;
  private secretKey: string;
  private bucket: string;
  private domain: string;
  public OSSNAME = 'QINIU';

  constructor() {
    this.accessKey = ossConfig[`OSS_${this.OSSNAME}_AK`];
    this.secretKey = ossConfig[`OSS_${this.OSSNAME}_SK`];
    this.bucket = ossConfig[`OSS_${this.OSSNAME}_BUCKET`];
    this.domain = ossConfig[`OSS_${this.OSSNAME}_DOMAIN`];
  }

  async upload(file: Buffer, uploadOption: OssUploadOption): Promise<OssUploadResult> {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const options = {
      scope: this.bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();

    // // 根据你存储空间所在的区域选择合适的 Zone
    config.regionsProvider = qiniu.httpc.Region.fromRegionId('z1');
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    const { fileName, folder } = uploadOption;
    const filename = `${folder || ''}${folder && !folder.endsWith('/') ? '/' : ''}${fileName}`;

    const { data, resp } = await formUploader.put(uploadToken, filename, file, putExtra);
    if (resp.statusCode === 200) {
      return {
        pathPrefix: this.domain,
        path: data.key,
      };
    } else {
      throw new CustomException({ message: '上传失败', data });
    }
  }
}
