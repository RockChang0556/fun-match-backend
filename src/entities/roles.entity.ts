import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Resources } from './resources.entity';
import { User } from './user.entity';

@Entity()
export class Roles {
  /** 角色id */
  @PrimaryGeneratedColumn({ comment: '角色id' })
  id: number;

  /** 角色名称 */
  @Column({ comment: '角色名称' })
  roleName: string;

  /** 角色描述 */
  @Column({ comment: '角色描述', nullable: true })
  description: string;

  /** 角色唯一标记 */
  @Column({ comment: '角色唯一标记', unique: true, nullable: false })
  roleType: string;

  /** 角色状态 */
  @Column({ type: 'boolean', default: true, unique: false, comment: '角色状态' })
  status: boolean;

  /** 排序 */
  @Column({ type: 'int', default: 10, unique: false, comment: '排序' })
  sort: number;

  /** 创建时间 */
  @CreateDateColumn({ comment: '创建时间' })
  createtime: string;

  /** 更新时间 */
  @UpdateDateColumn({ comment: '更新时间' }) // 自动生成并自动更新列
  updatetime: string;

  /** 用户 */
  @ManyToMany(() => User, user => user.roles)
  users: User;

  /** 权限 */
  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable({
    name: 'roles_permission',
  })
  permissions: Permission[];

  /** 资源 */
  @ManyToMany(() => Resources, resources => resources.roles)
  @JoinTable({
    name: 'roles_resources',
  })
  resources: Resources[];
}
