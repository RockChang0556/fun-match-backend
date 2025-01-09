import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { timestampFormat } from '@/utils/format';

// 日志级别
const winstonLevel = {
  error: 0,
  warn: 1,
  debug: 2,
  info: 3,
  verbose: 4,
  silly: 5,
};

// 格式化为字符串
const myFormat = winston.format.printf(({ result }) => result);

// 日志格式化
const logFormat = winston.format((opt, bool) => {
  const { level, message, timestamp } = opt;
  const str = `${timestamp} ${level}: ${(message as any).stack || message}`;
  opt.result = bool ? addColors[level](str) : str;
  return opt;
});

// 添加日志在终端输出的颜色
const addColors = {
  debug: (str: string) => `\x1B[34m${str}\x1B[0m`,
  error: (str: string) => `\x1B[31m${str}\x1B[0m`,
  info: (str: string) => `\x1B[32m${str}\x1B[0m`,
  warn: (str: string) => `\x1B[33m${str}\x1B[0m`,
  verbose: (str: string) => `\x1B[30m${str}\x1B[0m`,
  silly: (str: string) => `\x1B[30m${str}\x1B[0m`,
};

export const winstonConfig: WinstonModuleOptions = {
  levels: winstonLevel, // 日志优先级的级别
  transports: [
    new winston.transports.Console({
      level: 'warn', // 控制台只输出warn级别以上的日志
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        logFormat(true),
        myFormat,
      ),
    }),

    // 以下为日志文件配置
    // error日志
    new DailyRotateFile({
      filename: './logs/%DATE%_error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 是否压缩旧文件
      maxSize: '20m',
      maxFiles: '14d', // 保留最近14天的日志
      level: 'error', // 记录小于或等于当前等级的日志信息
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        logFormat(false),
        myFormat,
      ),
    }),
    // info日志
    new DailyRotateFile({
      filename: './logs/%DATE%_info.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 是否压缩旧文件
      maxSize: '20m',
      maxFiles: '14d', // 保留最近14天的日志
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        logFormat(false),
        myFormat,
      ),
    }),
  ],
};
