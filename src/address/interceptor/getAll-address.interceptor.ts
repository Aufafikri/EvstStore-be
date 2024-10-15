import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GetAllAddressInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const currentTime = new Date().toISOString().slice(0, 10)
        return {
          status: 'success!',
          message: "success get all address!",
          time: currentTime,
          data: data
        }
      })
    );
  }
}
