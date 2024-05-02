import { Span } from '@opentelemetry/api';
import { KafkaProducerCustomAttributeFunction } from 'opentelemetry-instrumentation-kafkajs';

export const kafkaPublishHook: KafkaProducerCustomAttributeFunction = (span: Span, topic: string) => {
    span.updateName(`Kafka publish ${topic}`);
};
