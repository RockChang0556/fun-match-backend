import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { CustomException, WechatException } from '@/exception/custom-exception';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class WechatStrategy extends PassportStrategy(Strategy, 'wechat') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    console.log('[ rock-req ]', req);
    const { code } = req.body;
    if (code) {
      const user = await this.authService.loginByWechat(code);
      if (!user) {
        throw new WechatException({ errcode: 401, errmsg: '验证code时失败' });
      }
      return user;
    }
    throw new CustomException({ message: '缺少code' });
  }
}
