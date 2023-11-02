import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseResDto } from 'src/base/dto/base.dto';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'anyway' })
  @IsNotEmpty({ message: 'username is required' })
  @IsString({ message: 'username must be string type' })
  readonly username: string;

  @ApiProperty({ description: '昵称', example: 'anyway' })
  @IsNotEmpty({ message: 'nickname is required' })
  @IsString({ message: 'nickname must be string type' })
  readonly nickname: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: 'password is required' })
  readonly password: string;

  @ApiProperty({ description: '性别', example: '1' })
  @IsNotEmpty({ message: 'sex is required' })
  @IsNumber({}, { message: 'sex must be number type' })
  readonly sex: number;
}

class UserBaseInfo extends CreateUserDto {
  @ApiProperty({
    description: '用户id',
    example: '9e2d1892-e8d6-4dc8-b1a1-8b75e09ffd82',
  })
  readonly id: string;

  @ApiProperty({ description: '创建时间', example: '2023-11-02T05:59:15.000Z' })
  readonly create_time: Date;

  @ApiProperty({ description: '更新时间', example: '2023-11-02T05:59:15.000Z' })
  readonly update_time: Date;
}

export class CreateUserResDto extends BaseResDto {
  @ApiProperty({ description: '用户信息', type: UserBaseInfo })
  readonly data: UserBaseInfo;
}
