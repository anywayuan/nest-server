import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        return {
          data,
          code: statusCode,
          message: 'success',
        };
      }),
    );
  }
}
