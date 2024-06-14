import { Span } from '@opentelemetry/api';
import { AmqplibConsumeCustomAttributeFunction, ConsumeInfo } from '@opentelemetry/instrumentation-amqplib';
import {rmqQueueProduceCountMetric} from "../metrics";

export const amqpConsumeHook: AmqplibConsumeCustomAttributeFunction = (span: Span, info: ConsumeInfo) => {
    if (info.msg.fields.routingKey.includes('amq.rabbitmq.reply-to')) {
        span.updateName(`AMQP consume reply message`);
        return;
    }

    rmqQueueProduceCountMetric.add(1, {exchange: info.msg.fields.exchange, routingKey: info.msg.fields.routingKey});
    span.updateName(`AMQP consume ${info.msg.fields.exchange}->${info.msg.fields.routingKey}`);
};
