import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseResDto } from 'src/base/dto/base.dto';

export class FuckDto {
  @ApiProperty({ description: 'id', example: 1 })
  readonly id: number;

  @ApiProperty({ description: '内容', example: '这是内容！！！！' })
  readonly text: string;

  @ApiProperty({ description: '创建时间', example: '2022-05-31T11:22:00.000Z' })
  readonly creation_time: Date;
}
export class CreateFuckDto {
  @ApiProperty({ description: '内容', example: '这是内容！！！！' })
  @IsNotEmpty({ message: 'text is required!' })
  readonly text: string;
}

export class CreateFuckResDto extends BaseResDto {
  @ApiProperty({ description: 'data', type: FuckDto })
  readonly data: FuckDto;
}
