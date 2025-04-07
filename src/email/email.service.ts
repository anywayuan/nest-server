import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as dayjs from 'dayjs';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendExecutionResult(
    result: any,
    options: {
      to: string | string[];
      isError?: boolean;
      metadata?: Record<string, any>;
    },
  ): Promise<any> {
    try {
      return await this.mailerService.sendMail({
        to: options.to,
        subject: `系统通知 - 签到任务${options.isError ? '失败' : '完成'}`,
        template: 'main',
        context: {
          appName: '今日定时任务签到结果',
          logoUrl: 'https://yuanki.cn/usr/uploads/email/unnamed.jpg',
          companyName: '梁予安',
          dashboardUrl: 'https://yuanki.cn',
          ...options.metadata,
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          status: options.isError ? '执行失败' : '执行成功',
          result: result,
          isError: options.isError,
          currentYear: dayjs().year(),
        },
      });
    } catch (error) {
      console.error('邮件发送失败:', error);
      throw new InternalServerErrorException('邮件发送失败');
    }
  }
}
