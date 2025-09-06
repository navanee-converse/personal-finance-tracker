import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception?.response) {
      const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return response
        .json({
          success: false,
          statusCode: status,
          message: exception.response?.message ?? 'Internal server error',
        })
        .status(status);
    }
    return response
      .json({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message ?? 'Internal server error',
      })
      .status(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
