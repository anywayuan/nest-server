import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseResDto } from 'src/base/dto/base.dto';

class ResData {
  @ApiProperty({
    description: 'token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx',
  })
  readonly access_token: string;

  @ApiProperty({ description: '类型', example: 'Bearer' })
  readonly type: string;
}

export class AuthReqDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: 'username is required' })
  readonly username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: 'password is required' })
  readonly password: string;
}

export class AuthResDto extends BaseResDto {
  @ApiProperty({ description: 'data', type: ResData })
  readonly data: ResData;
}
