import { Span } from '@opentelemetry/api';
import { KafkaConsumerCustomAttributeFunction } from 'opentelemetry-instrumentation-kafkajs';

export const kafkaConsumeHook: KafkaConsumerCustomAttributeFunction = (span: Span, topic: string) => {
    span.updateName(`Kafka consume ${topic}`);
};
