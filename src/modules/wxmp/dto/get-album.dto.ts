import { ApiProperty } from '@nestjs/swagger';

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
