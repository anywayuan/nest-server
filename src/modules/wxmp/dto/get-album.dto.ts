import { ApiProperty } from '@nestjs/swagger';
import { BaseResDto } from 'src/base/dto/base.dto';
import { AlbumDto } from './album.dto';

class ListData {
  @ApiProperty({ description: '相册列表', type: [AlbumDto] })
  readonly list: AlbumDto[];

  @ApiProperty({ description: '总数' })
  readonly count: number;
}

export class GetAllAlbumResDto extends BaseResDto {
  @ApiProperty({ description: 'list', type: ListData })
  readonly data: ListData;
}

export class QueryAllAlbum {
  @ApiProperty({ description: '页码' })
  page?: number;

  @ApiProperty({ description: '每页数量' })
  page_size?: number;

  @ApiProperty({ description: '标题' })
  title?: string;

  @ApiProperty({ description: '显示状态: 1 显示 0 隐藏' })
  del?: number;
}
