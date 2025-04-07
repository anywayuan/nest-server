import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/global/decorator/public.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  @Public()
  async emailTest() {
    return await this.emailService.sendExecutionResult(
      JSON.stringify(
        {
          name: '星星',
          data: {
            err_no: 0,
            err_msg: 'success',
            incr_point: 350,
            sum_point: 11606,
          },
          signInTime: '2025-03-29 07:00:33',
        },
        null,
        2,
      ),
      {
        to: '916476834@qq.com',
        isError: false,
      },
    );
  }
}
