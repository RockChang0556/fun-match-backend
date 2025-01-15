import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { RPageListDto } from '@/constants/types/common.dto';
import { Resources } from '@/entities/resources.entity';
import { Roles } from '@/entities/roles.entity';
import { User } from '@/entities/user.entity';

export class GetUserDto {
  @ApiProperty({ description: '分页-页码', default: 1, required: false })
  @IsNumber()
  @IsOptional()
  pageNum: number;

  @ApiProperty({ description: '分页-条数', default: 10, required: false })
  @IsNumber()
  @IsOptional()
  pageSize: number;

  @ApiProperty({ description: '用户名', required: false })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ description: '性别,男性为1,女性为2,未知为3' })
  @IsIn([1, 2, 3], { message: '性别不合法' })
  @IsNumber()
  @IsOptional()
  sex: number;
}

export class RGetUserRolesDto extends RPageListDto {
  /** 列表 */
  list: User[];
}

export class RGetAllDto {
  roles: Roles[];
  menus: Resources[];
}
