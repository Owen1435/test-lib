import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TraceService } from 'nestjs-otel';

@Injectable()
export class ResponseTraceIdMiddleware implements NestMiddleware {
    constructor(private readonly traceService: TraceService) {}

    public use(req: Request, res: Response, next: NextFunction) {
        const traceId = this.traceService.getSpan()?.spanContext().traceId;
        console.log('ResponseTraceIdMiddleware', traceId);
        if (traceId) {
            res.set('X-Trace-Id', traceId);
        }

        next();
    }
}
