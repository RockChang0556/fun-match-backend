export interface IWechatOAuthSuccess {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  openid: string;
  scope?: string;
  is_snapshotuser?: number;
  unionid: string;
}

export interface IWechatOAuthFailure {
  errcode: number;
  errmsg?: string;
}

export interface IWechatUserBaseAuthInfo {
  openid: string;
  unionid: string;
}

export interface IWxJscode2session {
  /** 用户唯一标识 */
  openid: string;
  /** 会话密钥 */
  session_key: string;
  /** 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回，详见 UnionID 机制说明。 */
  unionid?: string;
  errcode: number;
  errmsg?: string;
}

export interface IRGetWxInfo {
  openid: string;
  nickname: string;
  sex: 1 | 2;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}
