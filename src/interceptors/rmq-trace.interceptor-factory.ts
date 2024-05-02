import { Message, RMQIntercepterClass } from 'nestjs-rmq';
import { TraceService } from 'nestjs-otel';
import { SpanStatusCode } from '@opentelemetry/api';

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
