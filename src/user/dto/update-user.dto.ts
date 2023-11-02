import { ApiPropertyOptional, PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { BaseResDto } from 'src/base/dto/base.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: '邮箱', example: '123@gmail.com' })
  readonly email: string;

  @ApiPropertyOptional({ description: '角色', example: 'root' })
  readonly role: string;

  @ApiPropertyOptional({ description: '状态', example: 1 })
  readonly status: number;

  @ApiPropertyOptional({
    description: '头像地址',
    example: 'https://cdn.yuanki.cn/baseInfo/anyway.jpg',
  })
  readonly avatar: string;
}

export class UpdateUserResDto extends BaseResDto {
  @ApiProperty()
  readonly data: object;
}
