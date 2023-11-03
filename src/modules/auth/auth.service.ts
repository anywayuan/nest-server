import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../db/redis/redis.service';

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

    // 将token存入redis
    await this.redisService.set(
      `token_${user.id}`,
      access_token,
      this.configService.get<number>('JWT_EXPIRES_IN'),
    );

    return {
      access_token,
      type: 'Bearer',
    };
  }

  async logout(user: Partial<User>) {
    await this.redisService.del(`token_${user.id}`);
  }
}
