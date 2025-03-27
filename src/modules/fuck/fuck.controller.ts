import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { FuckService } from './fuck.service';
import { CreateFuckDto } from './dto/create-fuck.dto';
import { UpdateFuckDto } from './dto/update-fuck.dto';
import { Public } from 'src/global/decorator/public.decorator';

@Controller('fuck')
export class FuckController {
  constructor(private readonly fuckService: FuckService) {}

  @Post('/add')
  create(@Body() createFuck: CreateFuckDto) {
    return this.fuckService.create(createFuck);
  }

  @Post()
  @Public()
  findOne(@Body() params: { ids: number[] }) {
    return this.fuckService.findRandomOne(params);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuckDto: UpdateFuckDto) {
    return this.fuckService.update(+id, updateFuckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuckService.remove(+id);
  }

  @Get()
  findAll(@Param() params: { page: number; page_size: number }) {
    return this.fuckService.findAll(params);
  }
}
