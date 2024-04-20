import { ApiProperty } from '@nestjs/swagger';
import { BaseResDto } from 'src/base/dto/base.dto';
import { Photos } from './photos.dto';

class ListData {
  @ApiProperty({ description: '图片资源列表', type: [Photos] })
  readonly list: Photos[];

  @ApiProperty({ description: '总数' })
  readonly count: number;
}

export class GetPhotosResDto extends BaseResDto {
  @ApiProperty({ description: 'list', type: ListData })
  readonly data: ListData;
}

export class GetPhotosReqDto {
  @ApiProperty({ description: 'page', example: 1 })
  readonly page: number;

  @ApiProperty({ description: 'page_size', example: 10 })
  readonly page_size: number;

  @ApiProperty({ description: '分类id', example: 1 })
  readonly pid?: number;
}
