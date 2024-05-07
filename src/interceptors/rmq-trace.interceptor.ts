import { Message, RMQIntercepterClass } from 'nestjs-rmq';
import { SpanStatusCode, trace } from '@opentelemetry/api';

/** RMQTraceIntercepter for proper trace error handling via amqp */
export class RMQTraceIntercepter extends RMQIntercepterClass {
    public intercept(res: any, msg: Message, error?: Error): Promise<any> {
        if (error) {
            const span = trace.getActiveSpan();
            span?.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span?.addEvent('exception', {
                ['exception.message']: error.message,
                ['exception.stacktrace']: error.stack,
            });
        }
        return res;
    }
}
