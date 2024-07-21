import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthHeaderInterceptor implements NestInterceptor {
    intercept(context:ExecutionContext, next:CallHandler): Observable<any> {

        return next.handle().pipe(
            map((data:{access_token:string}) => {
              const response = context.switchToHttp().getResponse();
              if (data && data.access_token) {
                response.setHeader('Authorization', `Bearer ${data.access_token}`);
                response.status(HttpStatus.CREATED)
              }
              
              return data;
            }),
          );
    }
}