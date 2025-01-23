import { HttpException, HttpStatus } from '@nestjs/common';
import { IWechatOAuthFailure } from '@/modules/auth/wechat-auth/wechat-auth.interface';
import { EErrorCode, WechatExceptionMap } from './exception.enum';
import { ICustomException } from './exception.interface';

// 自定义异常消息
export class CustomException extends HttpException {
  message: string = '系统繁忙，请稍候再试';
  data?: any;
  code: EErrorCode = EErrorCode.SERVER_ERROR;
  manual: boolean = true; // 手动抛出异常
  constructor(exception: ICustomException | string) {
    console.log('[ rock-exception ]', exception);
    // const { description, httpExceptionOptions } =
    //   HttpException.extractDescriptionAndOptionsFrom(exception);
    // 如果 message 是对象，直接传递给 super；如果是字符串，则包装为对象
    const defResponse = {
      message: '系统繁忙，请稍候再试',
      code: EErrorCode.SERVER_ERROR,
      data: null,
    };
    const response =
      typeof exception === 'string'
        ? { ...defResponse, message: exception }
        : { ...defResponse, ...exception };
    const status =
      typeof exception === 'string' ? HttpStatus.INTERNAL_SERVER_ERROR : exception.status;
    super(response, status);

    // super(
    //   exception,
    //   typeof exception === 'string' ? HttpStatus.INTERNAL_SERVER_ERROR : exception.status,
    // );
    // super(
    //   HttpException.createBody(objectOrError, description, HttpStatus.BAD_REQUEST),
    //   HttpStatus.INTERNAL_SERVER_ERROR,
    //   httpExceptionOptions,
    // );
    // if (typeof exception === 'string') {
    //   console.log('[ rock- ]');
    //   this.message = exception;
    // } else {
    //   console.log('[ rock-2 ]');
    //   this.message = exception.message || '';
    //   this.data = exception.data || null;
    //   this.code = exception.code || EErrorCode.SERVER_ERROR;
    //   this.manual = exception.manual || true;
    // }
  }
}

export class CustomManualException extends CustomException {
  constructor(exception: ICustomException) {
    const { message, data, code, status } = exception;
    super({
      message,
      data,
      code,
      status,
      manual: true,
    });
  }
}

export class WechatException extends CustomException {
  constructor(wechatError: IWechatOAuthFailure) {
    // 这里会根据微信授权失败的原因，返回适应的错误信息
    super({
      message: '微信授权失败，请检查',
      code: EErrorCode.WECHAT_AUTH_FAILURE,
      data: {
        errcode: wechatError.errcode,
        errmsg:
          wechatError.errmsg ||
          WechatExceptionMap[wechatError.errcode] ||
          'wx: 系统繁忙，请稍候再试',
      },
    });
  }
}

export class AuthException extends CustomException {
  constructor() {
    super({
      message: '未登录或登录已失效',
      code: EErrorCode.AUTH_ERROR,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class AuthValidFailException extends CustomException {
  constructor(message?: string) {
    super({
      message: message || '登录验证失败，请检查',
      code: EErrorCode.AUTH_LOGIN_FAIL,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class AuthDisableException extends CustomException {
  constructor() {
    super({
      message: '用户已被禁用',
      code: EErrorCode.AUTH_LOGIN_DISABLE,
      status: HttpStatus.FORBIDDEN,
    });
  }
}
