import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFuckDto } from './create-fuck.dto';
import { BaseResDto } from 'src/base/dto/base.dto';
import { FuckDto } from './create-fuck.dto';

export class UpdateFuckDto extends PartialType(CreateFuckDto) {}

export class UpdateFuckResDto extends BaseResDto {
  @ApiProperty({ description: 'data', type: FuckDto })
  readonly data: FuckDto;
}

export class DelFuckResDto extends BaseResDto {
  @ApiProperty({ description: 'data', type: Object })
  readonly data: object;
}
