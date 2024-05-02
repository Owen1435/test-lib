import { Span } from '@opentelemetry/api';
import { AmqplibConsumeCustomAttributeFunction, ConsumeInfo } from '@opentelemetry/instrumentation-amqplib';

export const amqpConsumeHook: AmqplibConsumeCustomAttributeFunction = (span: Span, info: ConsumeInfo) => {
    span.updateName(`AMQP consume ${info.msg.fields.exchange}->${info.msg.fields.routingKey}`);
};
