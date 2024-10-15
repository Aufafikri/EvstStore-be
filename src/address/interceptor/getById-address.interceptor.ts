import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GetAddressByIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const currentTime = new Date().toISOString().slice(0, 10)

        if(!data) {
            throw new HttpException({
                status: 'error',
                message: 'Address not found. Please check or ensure the ID is correct.'
            }, HttpStatus.NOT_FOUND)
        }
        
        return {
          status: 'success!',
          message: "success get address by id!",
          time: currentTime,
          data: data
        }
      })
    );
  }
}
