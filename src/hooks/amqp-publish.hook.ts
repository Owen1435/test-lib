import { Span } from '@opentelemetry/api';
import { AmqplibPublishCustomAttributeFunction, PublishInfo } from '@opentelemetry/instrumentation-amqplib';

export const amqpPublishHook: AmqplibPublishCustomAttributeFunction = (span: Span, info: PublishInfo) => {
    if (info.routingKey.includes('amq.rabbitmq.reply-to')) {
        span.updateName(`AMQP publish reply message`);
        return;
    }

    span.updateName(`AMQP publish ${info.exchange}->${info.routingKey}`);
};
