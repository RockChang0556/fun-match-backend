import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Logs {
  /** 日志id */
  @PrimaryGeneratedColumn({ comment: '日志id' })
  id: number;

  /** 请求路径 */
  @Column({ comment: '请求路径' })
  path: string;

  /** 请求方法 */
  @Column({ comment: '请求方法' })
  method: string;

  /** 请求数据 */
  @Column({ comment: '请求数据' })
  data: string;

  /** 请求结果 */
  @Column({ comment: '请求结果' })
  result: string;

  /** 创建时间 */
  @CreateDateColumn({ comment: '创建时间' })
  createtime: string;

  /** 用户 */
  @ManyToOne(() => User, user => user.logs)
  @JoinColumn({ name: 'users_logs' })
  user: User;
}
