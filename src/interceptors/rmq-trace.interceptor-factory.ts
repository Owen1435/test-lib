import { Message, RMQIntercepterClass } from 'nestjs-rmq';
import { TraceService } from 'nestjs-otel';
import { SpanStatusCode, trace } from '@opentelemetry/api';

/** RMQTraceIntercepter factory for proper trace error handling via amqp */
export function RMQTraceIntercepterFactory(traceService: TraceService): any {
    return class RMQTraceIntercepter extends RMQIntercepterClass {
        public intercept(res: any, msg: Message, error?: Error) {
            if (error) {
                const span = traceService.getSpan();
                span?.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span?.addEvent('exception', {
                    ['exception.message']: error.message,
                    ['exception.stacktrace']: error.stack,
                });
            }
            return res;
        }
    };
}

export class LogErrorInterceptor extends RMQIntercepterClass {
    public intercept(res: any, msg: Message, error?: Error): Promise<any> {
        if (error) {
            this.logger.error(`Request to topic "${msg.fields.routingKey}" failed.\n${error.stack}`);
            error.message = `Topic ${msg.fields.routingKey} error: ${error.message}`;
            throw error;
        }
        return res;
    }
}

export class RMQTraceIntercepter extends RMQIntercepterClass {
    public intercept(res: any, msg: Message, error?: Error): Promise<any> {
        if (error) {
            const span = trace.getActiveSpan()
            span?.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span?.addEvent('exception', {
                ['exception.message']: error.message,
                ['exception.stacktrace']: error.stack,
            });
        }
        return res;
    }
}
