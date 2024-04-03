import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/db/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: Partial<User>) {
    const payload = { username: user.username, id: user.id };

    const access_token = this.jwtService.sign(payload);

    const JWT_EXPIRES_IN = this.configService.get<number>('JWT_EXPIRES_IN');
    // 将token存入redis
    await this.redisService.set(
      `token_${user.id}`,
      access_token,
      JWT_EXPIRES_IN,
    );

    return {
      access_token,
      refresh_token: '',
      username: user.username,
      roles: user.role.split(','),
      type: 'Bearer',
      expires: Date.now() + Number(JWT_EXPIRES_IN),
    };
  }

  async logout(user: Partial<User>) {
    await this.redisService.del(`token_${user.id}`);
  }
}
