import { Span } from '@opentelemetry/api';
import { KafkaProducerCustomAttributeFunction } from 'opentelemetry-instrumentation-kafkajs';
import { kafkaTopicProduceCountMetric } from '../metrics';

export const kafkaPublishHook: KafkaProducerCustomAttributeFunction = (span: Span, topic: string) => {
    kafkaTopicProduceCountMetric.add(1, { topic });
    span.updateName(`Kafka publish ${topic}`);
};
