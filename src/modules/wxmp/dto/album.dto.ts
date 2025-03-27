import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class AlbumDto {
  @ApiProperty({ description: 'id', example: 1 })
  readonly id: number;

  @ApiProperty({ description: '标题', example: 'Sky' })
  @IsNotEmpty({ message: 'title is required' })
  readonly title: string;

  @ApiProperty({ description: '中文标题', example: '光遇' })
  @IsNotEmpty({ message: 'zh_title is required' })
  readonly zh_title: string;

  @ApiProperty({
    description: '相册封面',
    example: 'https://cdn.yuanki.cn/light_and_you/IMG_1595.JPG',
  })
  @IsNotEmpty({ message: 'cover_url is required' })
  readonly cover_url: string;

  @ApiProperty({
    description: '封面Key值（用于删除oss资源）',
    example: 'IMG_1595.JPG',
  })
  @IsNotEmpty({ message: 'img_key in required' })
  readonly img_key: string;

  @ApiProperty({ description: '是否删除', example: 1 })
  @IsNotEmpty({ message: 'del is required' })
  @IsInt({ message: 'del must be an integer 0 or 1' })
  readonly del: number;

  @IsInt({ message: 'isLock must be an integer 0 or 1' })
  readonly is_lock: number;

  readonly password: string;

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
