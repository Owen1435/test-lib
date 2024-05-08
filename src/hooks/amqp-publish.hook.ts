import { Span } from '@opentelemetry/api';
import { AmqplibPublishCustomAttributeFunction, PublishInfo } from '@opentelemetry/instrumentation-amqplib';

export const amqpPublishHook: AmqplibPublishCustomAttributeFunction = (span: Span, info: PublishInfo) => {
    console.log('amqpPublishHook', info);
    span.updateName(`AMQP publish ${info.exchange}->${info.routingKey}`);
};
