import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  @IsString({ message: '文章标题必须是字符串' })
  readonly title: string;

  @ApiProperty({ description: '作者' })
  @IsNotEmpty({ message: '缺少作者信息' })
  readonly author: string;

  @ApiProperty({ description: '内容' })
  @IsNotEmpty({ message: '文章内容必填' })
  readonly content: string;

  @ApiProperty({ description: '文章封面' })
  @IsNotEmpty({ message: '文章封面必填' })
  readonly cover_url: string;

  @ApiProperty({ description: '文章类型' })
  @IsNotEmpty({ message: '文章类型必填' })
  @IsNumber({}, { message: 'type 类型错误' })
  readonly type: number;
}
