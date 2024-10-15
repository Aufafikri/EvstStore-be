import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GetAddressByUserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const currentTime = new Date().toISOString().slice(0, 10)

        if(!data || (Array.isArray(data) && data.length === 0)) {
            throw new HttpException({
                status: 'error',
                message: 'Address user not found. Please check or ensure the USERID is correct.'
            }, HttpStatus.NOT_FOUND)
        }

        return {
          status: 'success!',
          message: "success get address by user id!",
          time: currentTime,
          data: data
        }
      })
    );
  }
}
