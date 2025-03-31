import { Controller, Get } from '@nestjs/common';
import { ScheduleService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  taskTest() {
    return this.scheduleService.handleCron();
  }
}
