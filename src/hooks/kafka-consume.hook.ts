import { Span } from '@opentelemetry/api';
import { KafkaConsumerCustomAttributeFunction } from 'opentelemetry-instrumentation-kafkajs';
import {kafkaTopicConsumeCountMetric, kafkaTopicProduceCountMetric} from '../metrics';

export const kafkaConsumeHook: KafkaConsumerCustomAttributeFunction = (span: Span, topic: string) => {
    console.log('kafkaConsumeHook', topic)
    console.log(kafkaTopicConsumeCountMetric)
    kafkaTopicConsumeCountMetric.add(1, { topic });
    span.updateName(`Kafka consume ${topic}`);
};
