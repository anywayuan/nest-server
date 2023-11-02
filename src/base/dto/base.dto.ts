import { ApiProperty } from '@nestjs/swagger';

export class BaseResDto {
  @ApiProperty({ description: 'code', example: 200 })
  code: number;

  @ApiProperty({ description: 'message', example: 'success' })
  message: string;
}
