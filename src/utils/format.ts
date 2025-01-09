const timeZone = 'Asia/Shanghai';
// 自定义时间格式化函数
export const timestampFormat = () => {
  return new Date().toLocaleString('zh-CN', { timeZone });
};
