import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { wxConfig } from '@/config';
import { WechatException } from '@/exception/custom-exception';
import { IRGetWxInfo, IWechatOAuthFailure, IWxJscode2session } from './wechat-auth.interface';

export function isWechatOAuthFailure(response: any): response is IWechatOAuthFailure {
  return (response as IWechatOAuthFailure).errcode !== undefined;
}

@Injectable()
export class WechatAuthService {
  constructor(private readonly httpService: HttpService) {}

  /** 获取微信 token */
  async getAccessToken(): Promise<{ access_token: string; expires_in: number }> {
    const { data } = await lastValueFrom(
      this.httpService.get<IWxJscode2session>('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          appid: wxConfig.appid,
          secret: wxConfig.secret,
          grant_type: 'client_credential',
        },
      }),
    );
    if (isWechatOAuthFailure(data)) {
      throw new WechatException({ errcode: data.errcode });
    }
    return data;
  }

  /**
   *  获取appid
   * @param js_code
   * @return
   * - 参考：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html
   * - 参考：https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
   */
  async getWechatOAuth(js_code: string): Promise<IWxJscode2session> {
    const { data } = await lastValueFrom(
      this.httpService.get<IWxJscode2session>('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: wxConfig.appid,
          secret: wxConfig.secret,
          js_code,
          grant_type: 'authorization_code',
        },
      }),
    );

    if (isWechatOAuthFailure(data)) {
      throw new WechatException({ errcode: data.errcode });
    }
    return data;
  }

  /**
   * 获取微信用户手机号, 需企业小程序, 个人小程序不支持
   * @param code getPhoneNumber返回的 code
   * @returns
   * - https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
   */
  async getWxPhone(code: string): Promise<IRGetWxInfo> {
    const access_token = (await this.getAccessToken()).access_token;
    const { data } = await lastValueFrom(
      this.httpService.post<IRGetWxInfo>(
        `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`,
        { data: { code } },
      ),
    );
    if (isWechatOAuthFailure(data)) {
      throw new WechatException({ errcode: data.errcode });
    }
    return data;
  }

  /**
   * 获取微信用户信息
   * @param openid
   * @returns
   */
  // async getWxInfo(openid: string): Promise<IRGetWxInfo> {
  //   const { data } = await lastValueFrom(
  //     this.httpService.get<IRGetWxInfo>('https://api.weixin.qq.com/sns/userinfo', {
  //       params: {
  //         access_token: (await this.getAccessToken()).access_token,
  //         openai: openid,
  //       },
  //     }),
  //   );

  //   console.log('[ rock-getWxInfo ]', data);
  //   if (isWechatOAuthFailure(data)) {
  //     throw new WechatException({ errcode: data.errcode });
  //   }
  //   return data;
  // }
}
