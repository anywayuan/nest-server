import { ApiProperty } from '@nestjs/swagger';
import { BaseResDto } from 'src/base/dto/base.dto';

export class AlbumDto {
  @ApiProperty({ description: 'id', example: 1 })
  readonly id: number;

  @ApiProperty({ description: '标题', example: 'Sky' })
  readonly title: string;

  @ApiProperty({ description: '中文标题', example: '光遇' })
  readonly zh_title: string;

  @ApiProperty({
    description: '相册封面',
    example:
      'https://yuanki-1256318267.cos.ap-shanghai.myqcloud.com/light_and_you/IMG_1595.JPG',
  })
  readonly cover_url: string;

  @ApiProperty({ description: '是否删除', example: 1 })
  readonly del: number;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-12T07:38:49.000Z',
  })
  readonly create_time: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-01-12T07:38:49.000Z',
  })
  readonly update_time: Date;
}

export class CreateAlbumsDto extends BaseResDto {
  @ApiProperty({ description: 'data', type: AlbumDto })
  readonly data: AlbumDto;
}
