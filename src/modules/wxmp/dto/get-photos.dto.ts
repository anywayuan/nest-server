import { ApiProperty } from '@nestjs/swagger';

export class GetPhotosReqDto {
  @ApiProperty({ description: 'page', example: 1 })
  readonly page?: number;

  @ApiProperty({ description: 'page_size', example: 10 })
  readonly page_size?: number;

  @ApiProperty({ description: '分类id', example: 1 })
  readonly pid?: number | string;

  @ApiProperty({
    description: '创建时间范围',
    example: ['2021-01-01', '2021-01-02'],
  })
  readonly create_time?: string[];

  @ApiProperty({
    description: '更新时间范围',
    example: ['2021-01-01', '2021-01-02'],
  })
  readonly update_time?: string[];
}
