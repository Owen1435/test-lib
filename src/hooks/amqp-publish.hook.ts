import { Span, trace } from '@opentelemetry/api';
import { AmqplibPublishCustomAttributeFunction, PublishInfo } from '@opentelemetry/instrumentation-amqplib';

export const amqpPublishHook: AmqplibPublishCustomAttributeFunction = (span: Span, info: PublishInfo) => {
    console.log('amqpPublishHook_', info, trace.getActiveSpan());
    console.log(span);
    if (info.routingKey.includes('amq.rabbitmq.reply-to')) {
        span.updateName(`AMQP publish reply message`);
        console.log((trace.getActiveSpan() as any)?.resource?.attributes?.['service.name']);
        span.setAttribute('amq.app.name', (trace.getActiveSpan() as any)?.resource?.attributes?.['service.name']);
        return;
    }

    span.updateName(`AMQP publish ${info.exchange}->${info.routingKey}`);
};
