import { Module } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { HttpModule } from '@nestjs/axios';
import { TaskController } from './task.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JueJinUserEntity } from './entity/juejinUser.entity';

@Module({
  imports: [
    HttpModule,
    EmailModule,
    TypeOrmModule.forFeature([JueJinUserEntity]),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [TaskController],
})
export class TaskModule {}
