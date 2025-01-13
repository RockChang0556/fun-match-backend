import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@/entities/user.entity';
import { AuthDisableException, AuthValidFailException } from '@/exception/custom-exception';
import { UserService } from '@/modules/user/user.service';
import { EVerifyCodeType } from '@/modules/verify-code/verify-code.enum';
import { VerifyCodeService } from '@/modules/verify-code/verify-code.service';
import { AuthUserDto } from './dto/auth.dto';
import { WechatAuthService } from './wechat-auth/wechat-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private verifyCodeService: VerifyCodeService,
    private wechatAuthService: WechatAuthService,
  ) {}

  /**
   * 账号密码登录
   * @param {AuthUserDto} dto 登录信息，包含用户名和密码
   * @return 登录结果
   */
  async loginByPassword(dto: AuthUserDto) {
    const { username, password } = dto;

    // 获取登录用户的信息
    const res = await this.userService.find({ username });

    // 判断用户是否存在
    if (!res) {
      // 用户不存在
      throw new ForbiddenException('用户不存在，请注册');
    }

    /**
     * 校验 - 使用异步方法
     * bcrypt.compare(data, encrypted)
     *    - data        要比较的数据, 使用登录时传递过来的密码
     *    - encrypted   要比较的数据, 使用从数据库中查询出来的加密过的密码
     */
    const isPasswordValid = await bcrypt.compare(password, res.password);
    // 判断用户密码是否正确
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    // 判断用户是否处于禁用状态
    if (!this.userService.IsEnable(res)) {
      throw new UnauthorizedException('您的账户已被禁用，暂时无法登录');
    }

    return await this.formatUser(res);
  }

  /**
   *  手机验证码登录
   * @param phone 手机号
   * @param code  验证码
   * @param registerWhenNotExist 是否在用户不存在时注册
   * @returns 登录结果
   */
  async loginByPhone(phone: string, code: string, registerWhenNotExist: boolean = true) {
    const valid = await this.verifyCodeService.verify({
      phone,
      type: EVerifyCodeType.LOGIN,
      code,
    });
    if (valid) {
      const user = await this.userService.findOneByPhone(phone);
      if (user) {
        // 检查用户状态
        if (this.userService.IsEnable(user)) {
          return await this.formatUser(user);
        } else {
          throw new AuthDisableException();
        }
      } else if (registerWhenNotExist) {
        const regUser = await this.userService.createUserByPhone(phone);
        return await this.formatUser(regUser);
      } else {
        throw new AuthValidFailException();
      }
    }
    throw new AuthValidFailException('验证码错误');
  }

  /**
   *  微信登录
   * @param {string} code
   * @param {boolean} registerWhenNotExist 是否在用户不存在时注册
   */
  async loginByWechat(code: string, registerWhenNotExist: boolean = true) {
    const result = await this.wechatAuthService.getWechatOAuth(code);
    // const result = {
    //   openid: Math.random().toString().slice(2, 10),
    //   unionid: Math.random().toString().slice(2, 10),
    //   session_key: '1',
    //   errcode: 0,
    //   errmsg: '',
    // };
    console.log('[ rock-result ]', result);
    const { openid, unionid } = result;
    const user = await this.userService.findOneByWechat({ openid, unionid });
    console.log('[ rock-user ]', user);
    if (user) {
      if (this.userService.IsEnable(user)) {
        return await this.formatUser(user);
      } else {
        throw new AuthDisableException();
      }
    } else if (registerWhenNotExist) {
      const regUser = await this.userService.createUserByWechat(result);
      return await this.formatUser(regUser);
    } else {
      throw new AuthValidFailException();
    }
  }

  /**
   * @description: 用户注册
   * @param {AuthUserDto} dto 注册信息，包含用户名和密码
   * @return 注册结果
   */
  async signup(dto: AuthUserDto) {
    const { username, password } = dto;
    const user = await this.userService.find({ username });

    // 判断用户名是否已经存在
    if (user) {
      throw new ForbiddenException('用户已存在');
    }

    const res = await this.userService.create({ username, password });
    return res;
  }

  /**
   * 添加token,格式化登陆成功返回的数据
   * @param user 用户信息
   * @returns
   */
  async formatUser(user: User) {
    const userData: User = { ...user, password: '' };
    const token = await this.jwtService.signAsync(userData);
    return {
      user: userData,
      token,
    };
  }
}
