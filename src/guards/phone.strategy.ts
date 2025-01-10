import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthValidFailException } from '@/exception/custom-exception';
import { AuthService } from '@/modules/auth/auth.service';
@Injectable()
export class PhoneStrategy extends PassportStrategy(Strategy, 'phone') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const { phone, code } = req.query;
    const user = await this.authService.loginByPhone(phone, code);
    if (!user) {
      throw new AuthValidFailException();
    }
    return user;
  }
}
