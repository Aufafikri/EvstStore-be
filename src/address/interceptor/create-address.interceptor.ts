import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class CreateAddressInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const currentTime = new Date().toISOString().slice(0, 10)
        return {
          status: 'success!',
          message: "success create new address!",
          time: currentTime,
          data: data
        }
      })
    );
  }
}
