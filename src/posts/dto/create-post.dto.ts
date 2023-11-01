import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: 'title is required' })
  readonly title: string;

  @ApiProperty({ description: '作者' })
  @IsNotEmpty({ message: 'author is required' })
  readonly author: string;

  @ApiProperty({ description: '内容' })
  @IsNotEmpty({ message: 'content is required' })
  readonly content: string;

  @ApiProperty({ description: '文章封面' })
  @IsNotEmpty({ message: 'thumb_url is required' })
  @IsString({ message: 'thumb_url 类型错误' })
  readonly thumb_url: string;

  @ApiProperty({ description: '文章类型' })
  @IsNotEmpty({ message: 'type is required' })
  @IsNumber({}, { message: 'type 类型错误' })
  readonly type: number;
}

export class CreatePostResDto extends CreatePostDto {
  @ApiProperty({ description: '文章id' })
  readonly id: number;

  @ApiProperty({ description: '创建时间' })
  readonly create_time: Date;

  @ApiProperty({ description: '更新时间' })
  readonly update_time: Date;
}

export class CreateBaseResDto {
  @ApiProperty({ description: '当前文章详情', type: CreatePostResDto })
  data: CreatePostResDto;

  @ApiProperty({ description: 'code', example: 0 })
  code: number;

  @ApiProperty({ description: 'message', example: 'success' })
  message: string;
}
