import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FuckService } from './fuck.service';
import { CreateFuckDto } from './dto/create-fuck.dto';
import { UpdateFuckDto } from './dto/update-fuck.dto';

@Controller('fuck')
export class FuckController {
  constructor(private readonly fuckService: FuckService) {}

  @Post()
  create(@Body() createFuckDto: CreateFuckDto) {
    return this.fuckService.create(createFuckDto);
  }

  @Get()
  findOne() {
    return this.fuckService.findOne;
  }

  @Get()
  findAll() {
    return this.fuckService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuckDto: UpdateFuckDto) {
    return this.fuckService.update(+id, updateFuckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuckService.remove(+id);
  }
}
