import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Photos {
  @ApiProperty({ description: 'id', example: 1 })
  readonly id: number;

  @ApiProperty({ description: '相册id', example: 1 })
  readonly pid: number;

  @ApiProperty({
    description: '图片url',
    example:
      'https://yuanki-1256318267.cos.ap-shanghai.myqcloud.com/light_and_you/IMG_1595.JPG',
  })
  readonly url: string;

  @ApiProperty({ description: '创建时间', example: '2024-01-12T07:38:49.000Z' })
  readonly create_time: Date;
}

export class AddPhoto {
  @IsNotEmpty({ message: 'pid is required' })
  readonly pid: number;

  @IsNotEmpty({ message: 'url is required' })
  readonly url: string;

  @IsNotEmpty({ message: 'key is required' })
  readonly key: string;
}

export class DelPhoto {
  @IsNotEmpty({ message: 'id is required' })
  readonly id: number;

  @IsNotEmpty({ message: 'key is required' })
  readonly key: string;
}
