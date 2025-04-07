import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';
import { transports, format } from 'winston';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import handlebarsLayouts = require('handlebars-layouts');
import handlebars from 'handlebars';

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
import { EmailModule } from './email/email.module';

import { read } from './utils';

const hbsInstance = handlebarsLayouts.register(handlebars);
handlebars.registerPartial({
  layout: read('main.hbs'),
});

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('QQ_EMAIL_HOST'),
          port: configService.get('QQ_EMAIL_PORT'),
          secure: true, // 使用 SSL
          auth: {
            user: configService.get('QQ_EMAIL_SENDER'),
            pass: configService.get('QQ_EMAIL_AUTH_CODE'),
          },
        },
        defaults: {
          from: `"梁予安" <${configService.get('QQ_EMAIL_SENDER')}>`,
        },
        template: {
          dir: join(process.cwd(), 'src/templates/partials'),
          adapter: new HandlebarsAdapter({ extend: hbsInstance.extend }),
          options: { extname: '.hbs', partials: true },
        },
      }),
    }),
    UserModule,
    AuthModule,
    RedisModule,
    FuckModule,
    OssModule,
    TaskModule,
    WxmpModule,
    EmailModule,
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

  constructor() {}
}
