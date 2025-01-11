import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EVerifyCodeType } from '@/modules/verify-code/verify-code.enum';

@Entity('verify-code')
export class VerifyCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @Column({ comment: '手机号', type: 'varchar', default: '', nullable: false })
  phone: string;

  @Column({ comment: '验证码', type: 'varchar', default: '', nullable: false })
  code: string;

  @Column({
    comment: '验证码类型',
    type: 'enum',
    enum: EVerifyCodeType,
    nullable: false,
    default: EVerifyCodeType.LOGIN,
  })
  type: EVerifyCodeType;
}
