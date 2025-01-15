import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Logs } from './logs.entity';
import { Roles } from './roles.entity';

/**
 * 注释说明
 * comment 数据库中用
 * 上方注释  swagger用
 */

@Entity()
export class User {
  /** 用户id */
  @PrimaryGeneratedColumn({ comment: '用户id' })
  id: number;

  /** wx openid */
  @Column({ default: null, unique: false, comment: 'wx openid' })
  openid: string;

  /** wx unionid */
  @Column({ default: null, unique: false, comment: 'wx unionid' })
  unionid: string;

  /** 用户名 */
  @Column({ comment: '用户名', unique: true, nullable: false })
  username: string;

  /** 密码 */
  @Column({ comment: '密码', nullable: false })
  password: string;

  /** 昵称 */
  @Column({ comment: '昵称', default: null, unique: false })
  nickname: string;

  /** 头像 */
  @Column({ comment: '头像', default: null })
  avatar: string;

  /** 性别,男性为1,女性为2,未知为3 */
  @Column({ comment: '性别,男性为1,女性为2,未知为3', default: 1 })
  sex: number;

  /** 手机号 */
  @Column({ comment: '手机号', length: 45, default: null, unique: false })
  phone: string;

  /** 邮箱 */
  @Column({ comment: '邮箱', length: 45, default: null, unique: false })
  email: string;

  /** 用户类型：0超级管理员,1管理员,2普通用户 */
  @Column({
    comment: '用户类型：0超级管理员,1管理员,2普通用户',
    type: 'int',
    default: 2,
    unique: false,
  })
  userType: number;

  /** 用户状态是否禁用 */
  @Column({ type: 'boolean', default: true, unique: false, comment: '用户状态' })
  status: boolean;

  /** 用户描述 */
  @Column({ comment: '用户描述', nullable: true })
  description: string;

  /** 创建时间 */
  @CreateDateColumn({ comment: '创建时间' })
  createtime: string;

  /** 更新时间 */
  @UpdateDateColumn({ comment: '更新时间' }) //自动生成并自动更新列
  updatetime: string;

  /** 日志 */
  @OneToMany(() => Logs, logs => logs.user)
  logs: Logs[];

  /** 权限 */
  @ManyToMany(() => Roles, roles => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];
}
