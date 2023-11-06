import { ApiProperty } from '@nestjs/swagger';
import { FuckDto } from './create-fuck.dto';
import { BaseResDto } from 'src/base/dto/base.dto';

export class GetFuckResDto extends BaseResDto {
  @ApiProperty({ description: 'data', type: FuckDto })
  readonly data: FuckDto;
}
