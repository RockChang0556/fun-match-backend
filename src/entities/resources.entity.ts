import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './roles.entity';

@Entity()
export class Resources {
  /** 资源id */
  @PrimaryGeneratedColumn({ comment: '资源id' })
  id: number;

  /** 资源名称 */
  @Column({ comment: '资源名称', length: 50 })
  title: string;

  /** 资源唯一标记 */
  @Column({ comment: '资源唯一标记', unique: true })
  signName: string;

  /** 资源地址 */
  @Column({ type: 'varchar', comment: '资源地址', length: 1024 })
  url: string;

  /** 图标 */
  @Column({ type: 'varchar', length: 200, default: '', comment: '图标' })
  icon: string;

  /** 资源类型：1是菜单(与前端关联),2是api接口(与后端关联),3是权限字段 */
  @Column({
    type: 'tinyint',
    unique: false,
    default: 1,
    comment: '资源类型：1是菜单(与前端关联),2是api接口(与后端关联),3是权限字段',
  })
  authType: number;

  /** 上级id */
  @Column({ type: 'int', comment: '上级id', nullable: true, unsigned: true })
  pid: number;

  /** 资源状态 */
  @Column({ type: 'boolean', default: true, unique: false, comment: '资源状态' })
  status: boolean;

  /** 排序 */
  @Column({ type: 'int', default: 10, unique: false, unsigned: true, comment: '排序' })
  sort: number;

  /** 创建时间 */
  @CreateDateColumn({ comment: '创建时间' })
  createtime: string;

  /** 更新时间 */
  @UpdateDateColumn({ comment: '更新时间' }) //自动生成并自动更新列
  updatetime: string;

  /** 角色 */
  @ManyToMany(() => Roles, roles => roles.resources, { cascade: true })
  roles: Roles[];
}
