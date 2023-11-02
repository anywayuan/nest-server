import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { BaseResDto } from 'src/base/dto/base.dto';

class ListData {
  @ApiProperty({ description: '用户列表', type: [User] })
  readonly list: User[];

  @ApiProperty({ description: '总数' })
  readonly count: number;
}

export class FindAllUserReqDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  readonly pageNum: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  readonly pageSize: number;
}

export class FindAllUserResDto extends BaseResDto {
  @ApiProperty({ description: 'list', type: ListData })
  readonly data: ListData;
}

class UserInfo {
  @ApiProperty({
    description: '用户id',
    example: '9e2d1892-e8d6-4dc8-b1a1-8b75e09ffd82',
  })
  readonly id: string;

  @ApiProperty({ description: '创建时间', example: '2023-11-02T05:59:15.000Z' })
  readonly create_time: Date;

  @ApiProperty({ description: '更新时间', example: '2023-11-02T05:59:15.000Z' })
  readonly update_time: Date;

  @ApiProperty({ description: '邮箱', example: '123@gmail.com' })
  readonly email: string;

  @ApiProperty({
    description: '头像地址',
    example: 'https://cdn.yuanki.cn/baseInfo/anyway.jpg',
  })
  readonly avatar: string;

  @ApiProperty({ description: '角色', example: 'root' })
  readonly role: string;

  @ApiProperty({ description: '状态', example: 1 })
  readonly status: number;

  @ApiProperty({ description: '用户名', example: 'anyway' })
  readonly username: string;

  @ApiProperty({ description: '昵称', example: 'anyway' })
  readonly nickname: string;

  @ApiProperty({ description: '性别', example: 1 })
  readonly sex: number;
}

export class FindOneUserResDto extends BaseResDto {
  @ApiProperty({ description: '用户信息', type: UserInfo })
  readonly data: UserInfo;
}
