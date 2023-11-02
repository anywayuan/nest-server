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
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResDto } from './dto/create-user.dto';
import {
  FindAllUserReqDto,
  FindAllUserResDto,
  FindOneUserResDto,
} from './dto/get-use.dto';
import { UpdateUserDto, UpdateUserResDto } from './dto/update-user.dto';
import { Public } from '../global/decorator/public.decorator';
// import { Public } from '../global/decorator/public.decorator';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @UseInterceptors(ClassSerializerInterceptor) // 使用拦截器，排除使用 @Exclude() 装饰器的字段
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 200, description: 'success', type: CreateUserResDto })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // @UseGuards(AuthGuard('jwt')) // 标记该接口需要验证 jwt
  // @Public() // 使用自定义的 Public 装饰器，可以将该接口设置为公开 不需要验证 jwt
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '用户列表' })
  @ApiResponse({ status: 200, description: 'success', type: FindAllUserResDto })
  findAll(@Query() query: FindAllUserReqDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '用户详情' })
  @ApiResponse({ status: 200, description: 'success', type: FindOneUserResDto })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: 'success', type: UpdateUserResDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: 'success', type: UpdateUserResDto })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
