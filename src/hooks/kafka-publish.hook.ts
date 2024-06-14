import { Span } from '@opentelemetry/api';
import { KafkaProducerCustomAttributeFunction } from 'opentelemetry-instrumentation-kafkajs';
import { kafkaTopicProduceCountMetric } from '../metrics';

export const kafkaPublishHook: KafkaProducerCustomAttributeFunction = (span: Span, topic: string) => {
    console.log('kafkaPublishHook', topic)
    console.log(kafkaTopicProduceCountMetric)
    kafkaTopicProduceCountMetric.add(1, { topic });
    span.updateName(`Kafka publish ${topic}`);
};
