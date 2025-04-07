import { Module } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { HttpModule } from '@nestjs/axios';
import { TaskController } from './task.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [HttpModule, EmailModule],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [TaskController],
})
export class TaskModule {}
