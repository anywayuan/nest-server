import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostResDto } from './create-post.dto';

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

export class FindAllPostResDto {
  @ApiProperty({ description: 'list', type: ListData })
  readonly data: ListData;

  @ApiProperty({ description: 'code', example: 0 })
  readonly code: number;

  @ApiProperty({ description: 'message', example: 'success' })
  readonly message: string;
}

export class FindPostByIdResDto {
  @ApiProperty({ description: '文章详情', type: CreatePostResDto })
  readonly data: CreatePostResDto;

  @ApiProperty({ description: 'code', example: 0 })
  readonly code: number;

  @ApiProperty({ description: 'message', example: 'success' })
  readonly message: string;
}
