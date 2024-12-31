import { Controller, Post, UseGuards, Req, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { Public } from 'src/global/decorator/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(AuthGuard('local')) // 使用本地验证策略 派发 jwt
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Delete('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }
}
