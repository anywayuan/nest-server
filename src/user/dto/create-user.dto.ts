import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
