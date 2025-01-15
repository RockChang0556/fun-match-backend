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
export class Permission {
  /** 权限id */
  @PrimaryGeneratedColumn({ comment: '权限id' })
  id: number;

  /** 权限名称 */
  @Column({ comment: '权限名称', length: 50 })
  permName: string;

  /** 权限描述 */
  @Column({ comment: '权限描述', length: 100, nullable: true })
  description: string;

  /** 创建时间 */
  @CreateDateColumn({ comment: '创建时间' })
  createtime: Date;

  /** 更新时间 */
  @UpdateDateColumn({ comment: '更新时间' })
  updatetime: Date;

  /** 角色 */
  @ManyToMany(() => Roles, roles => roles.permissions)
  roles: Roles[];
}
