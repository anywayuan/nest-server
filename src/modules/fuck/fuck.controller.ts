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
import { CreateFuckDto, CreateFuckResDto } from './dto/create-fuck.dto';
import { GetFuckResDto } from './dto/get-fuck.dto';
import {
  UpdateFuckDto,
  UpdateFuckResDto,
  DelFuckResDto,
} from './dto/update-fuck.dto';
import { Public } from 'src/global/decorator/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('fuck')
@Controller('fuck')
export class FuckController {
  constructor(private readonly fuckService: FuckService) {}

  @Post()
  @ApiOperation({ summary: '新增' })
  @ApiResponse({ status: 200, description: 'success', type: CreateFuckResDto })
  create(@Body() createFuck: CreateFuckDto) {
    return this.fuckService.create(createFuck);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '随机获取' })
  @ApiResponse({ status: 200, description: 'success', type: GetFuckResDto })
  findOne() {
    return this.fuckService.findRandomOne();
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新' })
  @ApiResponse({ status: 200, description: 'success', type: UpdateFuckResDto })
  update(@Param('id') id: string, @Body() updateFuckDto: UpdateFuckDto) {
    return this.fuckService.update(+id, updateFuckDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  @ApiResponse({ status: 200, description: 'success', type: DelFuckResDto })
  remove(@Param('id') id: string) {
    return this.fuckService.remove(+id);
  }
}
