import { PartialType } from '@nestjs/swagger';
import { CreateFuckDto } from './create-fuck.dto';

export class UpdateFuckDto extends PartialType(CreateFuckDto) {}
