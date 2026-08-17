import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    //console.log('💥 EXCEPTION:', exception);
    //console.log('💥 host:', host);

    const response = host.switchToHttp().getResponse<Response>();

    let statusCode = 500;
    let message: string | string[] = 'Internal server error';

    // Nest-er nijer exception hole (NotFoundException, BadRequestException...)
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'string'
          ? body
          : (body as { message: string | string[] }).message;
    } else {
      console.error('Unhandled exception:', exception);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
