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
