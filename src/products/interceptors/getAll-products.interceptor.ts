import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable()
export class GetAllProductsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
          map((data) => {
            const currentTime = new Date().toISOString().slice(0, 10)
            return {
                status: 'success',
                message: 'get all products success!',
                time: currentTime,
                data: data
            }
        })
    )
  }
}