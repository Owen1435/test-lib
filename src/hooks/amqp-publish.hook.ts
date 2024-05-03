import { Span } from '@opentelemetry/api';
import { AmqplibPublishCustomAttributeFunction, PublishInfo } from '@opentelemetry/instrumentation-amqplib/build/src/types';

export const amqpPublishHook: AmqplibPublishCustomAttributeFunction = (span: Span, info: PublishInfo) => {
    span.updateName(`AMQP publish ${info.exchange}->${info.routingKey}`);
};
