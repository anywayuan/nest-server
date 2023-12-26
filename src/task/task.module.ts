import { Module } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { HttpModule } from '@nestjs/axios';
import { TaskController } from './task.controller';

@Module({
  imports: [HttpModule],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [TaskController],
})
export class TaskModule {}
