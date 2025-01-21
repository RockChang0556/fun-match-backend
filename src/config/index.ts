import * as config from 'config';
import JwtConfig from './jwt.config';
import TypeormConfig from './typeorm.config';

const AppConfig = [JwtConfig, TypeormConfig];
export default AppConfig;

interface IserverConfig {
  port: number;
  origin: string;
}
interface IwxConfig {
  appid: string;
  secret: string;
}
interface IossConfig {
  OSS_QINIU_AK: string;
  OSS_QINIU_SK: string;
  OSS_QINIU_BUCKET: string;
  OSS_QINIU_DOMAIN: string;
}

/** 本地服务配置 */
const serverConfig: IserverConfig = config.get('server');
/** 获取wx配置 */
const wxConfig: IwxConfig = config.get('mp-wx');
/** 获取oss-七牛配置 */
const ossConfig: IossConfig = config.get('oss-qiniu');

export { ossConfig, serverConfig, wxConfig };
