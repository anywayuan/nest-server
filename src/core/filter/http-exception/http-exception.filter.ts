import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse<Response>(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息
    const msg = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    if (msg === 'Bad Request Exception') {
      const exceptionResponse = exception.getResponse();
      let message = (exceptionResponse as any).message;
      if (
        Array.isArray(message) &&
        message.length > 0 &&
        message[0].constraints
      ) {
        message = Object.values(message[0].constraints)[0] as string;
      }
      response
        .status(status)
        .header('Content-Type', 'application/json; charset=utf-8')
        .json({
          data: {},
          message: message[0],
          code: -1,
        });
      return;
    }

    const errorResponse = {
      data: {},
      message: msg,
      code: -1,
    };

    response
      .status(status)
      .header('Content-Type', 'application/json; charset=utf-8')
      .json(errorResponse);
  }
}
