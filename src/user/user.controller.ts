import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Public } from '../global/decorator/public.decorator';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor) // 使用拦截器，排除使用 @Exclude() 装饰器的字段
  @Post()
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // @UseGuards(AuthGuard('jwt')) // 标记该接口需要验证 jwt
  // @Public() // 使用自定义的 Public 装饰器，将该接口设置为公开 不需要验证 jwt
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
