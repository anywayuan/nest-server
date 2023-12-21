import { Module } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class TaskModule {}
