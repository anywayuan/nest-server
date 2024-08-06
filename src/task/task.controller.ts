import { Controller, Get } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { Public } from '../global/decorator/public.decorator';

@Controller('task')
export class TaskController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @Public()
  taskTest() {
    return this.scheduleService.handleCron();
  }
}
