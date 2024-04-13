import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { Public } from '../global/decorator/public.decorator';

@ApiTags('task测试')
@Controller('task')
export class TaskController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @Public()
  taskTest() {
    this.scheduleService.handleCron();
    return '123';
  }
}
