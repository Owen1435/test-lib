import { Span, trace } from '@opentelemetry/api';
import { AmqplibConsumeCustomAttributeFunction, ConsumeInfo } from '@opentelemetry/instrumentation-amqplib';

export const amqpConsumeHook: AmqplibConsumeCustomAttributeFunction = (span: Span, info: ConsumeInfo) => {
    console.log('amqpConsumeHook_', info, trace.getActiveSpan());
    console.log(trace.getTracer('default'));
    if (info.msg.fields.routingKey.includes('amq.rabbitmq.reply-to')) {
        span.updateName(`AMQP consume reply message`);
        return;
    }

    span.updateName(`AMQP consume ${info.msg.fields.exchange}->${info.msg.fields.routingKey}`);
};
