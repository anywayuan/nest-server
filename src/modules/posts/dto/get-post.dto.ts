import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostResDto } from './create-post.dto';
import { BaseResDto } from '../../../base/dto/base.dto';

class ListData {
  @ApiProperty({ description: '文章列表', type: [CreatePostResDto] })
  readonly list: CreatePostResDto[];

  @ApiProperty({ description: '总数' })
  readonly count: number;
}

export class FindAllPostReqDto {
  @ApiPropertyOptional({ description: '页码', example: 1 })
  readonly pageNum: number;

  @ApiPropertyOptional({ description: '每页数量', example: 10 })
  readonly pageSize: number;
}

export class FindAllPostResDto extends BaseResDto {
  @ApiProperty({ description: 'list', type: ListData })
  readonly data: ListData;
}

export class FindPostByIdResDto extends BaseResDto {
  @ApiProperty({ description: '文章详情', type: CreatePostResDto })
  readonly data: CreatePostResDto;
}
