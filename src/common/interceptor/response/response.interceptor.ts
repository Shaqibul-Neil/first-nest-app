import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../../decorators/response-message/response-message.decorator';
import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    // console.log('==============================');
    // console.log('🔥 INTERCEPTOR STARTED');
    // console.log('==============================');

    // console.log('1️⃣ ExecutionContext', context);
    //console.log('2️⃣ Next:', next);
    //Asking execution context to switch to http context
    const http = context.switchToHttp();
    //console.log('HTTP context:', http);

    //Get the request and response
    //const request = http.getRequest<Request>();
    // console.log('🌐 REQUEST:', request);
    // console.log('➡️ METHOD:', request.method);
    // console.log('➡️ URL:', request.url);
    // console.log('➡️ PARAMS:', request.params);
    // console.log('➡️ QUERY:', request.query);
    // console.log('➡️ BODY:', request.body);

    const response = http.getResponse<Response>();
    // console.log('📤 RESPONSE:', response);
    // console.log('📤 STATUS CODE:', response.statusCode);

    const handler = context.getHandler();
    //console.log('context.getHandler(): ', handler.name);
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, handler) ??
      'Request successful';

    return next.handle().pipe(
      map((data: T) => {
        //console.log('📦 CONTROLLER DATA:', data);
        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
