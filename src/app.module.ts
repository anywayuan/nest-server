import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import { transports, format } from 'winston';
import { ScheduleModule } from '@nestjs/schedule';

import envConfig from '../config/env';

import { JwtAuthGuard } from './global/guard/jwt-auth.guard';
import { LoggerMiddleware } from './global/middleware/logger/logger.middleware';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { RedisModule } from './db/redis/redis.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FuckModule } from './modules/fuck/fuck.module';
import { OssModule } from './oss/oss.module';
import { TaskModule } from './task/task.module';
import { Wxmp as WxmpModule } from './modules/wxmp/wxmp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        autoLoadEntities: true, // 自动加载实体
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        timezone: '+08:00', // 服务器上配置的时区
        synchronize: false, // 根据实体自动创建数据库表，DDD思想领域驱动设计。如已经设计好数据库，生产环境建议关闭。
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new transports.DailyRotateFile({
          dirname: `logs`,
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.printf(
              (info) =>
                `${info.timestamp} [${info.level}] : ${info.message} ${
                  Object.keys(info).length ? JSON.stringify(info, null, 2) : ''
                }`,
            ),
          ),
        }),
      ],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    RedisModule,
    FuckModule,
    OssModule,
    TaskModule,
    WxmpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
