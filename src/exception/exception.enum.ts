export enum EErrorCode {
  // 客户端来源错误 1000+
  CLIENT_ERROR = 1001,
  // 服务器错误 2000+
  SERVER_ERROR = 2001,
  // token相关错误 3000+
  AUTH_ERROR = 3001,
  AUTH_LOGIN_FAIL = 3002,
  AUTH_LOGIN_DISABLE = 3003,
  // 微信的错 4000+
  WECHAT_AUTH_FAILURE = 4001,
}

/** 微信接口错误码 */
export const WechatExceptionMap = {
  40029: 'wx: code 无效',
  45011: 'wx: API 调用太频繁，请稍候再试',
  40226: 'wx: 高风险等级用户，小程序登录拦截',
};
