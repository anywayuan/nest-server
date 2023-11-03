import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { getInfoFromReq } from 'src/global/helper/getInfoFromReq';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    return next.handle().pipe(
      map((data) => {
        this.logger.info('res', {
          responseData: data,
          req: getInfoFromReq(context.switchToHttp().getRequest()),
        });
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
