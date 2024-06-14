import { Span } from '@opentelemetry/api';
import { AmqplibPublishCustomAttributeFunction, PublishInfo } from '@opentelemetry/instrumentation-amqplib';
import {rmqQueueProduceCountMetric} from "../metrics";

export const amqpPublishHook: AmqplibPublishCustomAttributeFunction = (span: Span, info: PublishInfo) => {
    if (info.routingKey.includes('amq.rabbitmq.reply-to')) {
        span.updateName(`AMQP publish reply message`);
        return;
    }

    const producerService: string = span['resource']['_syncAttributes']['service.name'];
    rmqQueueProduceCountMetric.add(1, { exchange: info.exchange, routingKey: info.routingKey, producer_service: producerService });
    span.updateName(`AMQP publish ${info.exchange}->${info.routingKey}`);
};
