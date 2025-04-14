import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ScheduleService } from './task.service';
import { NewAddJueJinUserDto } from './dto/juejin-user.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('sign-in')
  taskTest() {
    return this.scheduleService.AutoSignToJJ();
  }

  @Get('users')
  findAllUser() {
    return this.scheduleService.findUsers();
  }

  @Post('user')
  addUser(@Body() user: NewAddJueJinUserDto) {
    return this.scheduleService.addUser(user);
  }

  @Put('user/:id')
  updateUser(@Param('id') id: string, @Body() user: NewAddJueJinUserDto) {
    return this.scheduleService.updateUser(id, user);
  }
}
