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

/** 本地服务配置 */
const serverConfig: IserverConfig = config.get('server');
/** 获取wx配置 */
const wxConfig: IwxConfig = config.get('mp-wx');

export { serverConfig, wxConfig };
