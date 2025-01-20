import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from "express";

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const callTimestamp = new Date();
    const className = context.getClass().name;
    const methodKey = context.getHandler().name;
    const requestMethod = request.method;

    const logger = new Logger(className);
    const loggingPrefix = `[${requestMethod}][${methodKey}]`;

    switch (requestMethod) {
      case 'GET': {
        logger.log(`[${callTimestamp.toUTCString()}]${loggingPrefix} Called with payload: ${JSON.stringify(request.params)}`);
        break;
      }

      case 'PUT':
      case 'PATCH':
      case 'DELETE':
      case 'POST': {
        logger.log(`${loggingPrefix} Called with payload: ${JSON.stringify(request.body)}`);
        break;
      }
    }

    return next
      .handle()
      .pipe(
        tap(() => {
          const handledTimestamp = new Date();
          const elapsedTime = handledTimestamp.getTime() - callTimestamp.getTime();
          const response = ctx.getResponse<Response>();

          if (response.statusCode >= 200 && response.statusCode < 300) {
            logger.log(`${loggingPrefix} Handled (${elapsedTime} ms). Response status: ${JSON.stringify(response.statusCode)}`)
          } else {
            logger.warn(`${loggingPrefix} Handled (${elapsedTime} ms). Response status: ${JSON.stringify(response.statusCode)}`)
          }
        }),
      );
  }
}