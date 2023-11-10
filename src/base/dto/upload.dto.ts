import { ApiProperty } from '@nestjs/swagger';
import { BaseResDto } from './base.dto';
import { Express } from 'express';

export class UploadedFileDTO {
  @ApiProperty({ description: '文件名称', example: 'avatar.png' })
  filename: string;

  @ApiProperty({ description: '文件大小', example: '1024' })
  size: number;

  @ApiProperty({ description: '文件类型', example: 'image/png' })
  type: string;

  @ApiProperty({ description: '上传时间', example: '2021-01-01 00:00:00' })
  date: Date;

  @ApiProperty({
    description: '文件地址',
    example: 'https://cdn.yuanki.cn/ablum/avatar.png',
  })
  url: string;
}

export class UploadResDto extends BaseResDto {
  @ApiProperty({ description: '上传文件', type: UploadedFileDTO })
  data: UploadedFileDTO;
}

export class UploadedMultipleFileDTO {
  @ApiProperty({ description: '文件' })
  file: Express.Multer.File;
}
