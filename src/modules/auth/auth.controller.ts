import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { AuthReqDto, AuthResDto } from './dto/auth.dto';
import { Public } from '../global/decorator/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(AuthGuard('local')) // 使用本地验证策略 派发 jwt
  @ApiOperation({ summary: '账密登录', description: '账号密码登录' })
  @ApiResponse({ status: 200, description: 'success', type: AuthResDto })
  // 写了 body 不使用报 eslint 错误, 不写 body swagger文档不显示入参, 只好禁了
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Req() req: Request, @Body() body: AuthReqDto) {
    return this.authService.login(req.user);
  }
}
