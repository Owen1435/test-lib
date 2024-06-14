import { Span } from '@opentelemetry/api';
import { KafkaConsumerCustomAttributeFunction } from 'opentelemetry-instrumentation-kafkajs';
// import {kafkaTopicConsumeCountMetric} from '../metrics';

export const kafkaConsumeHook: KafkaConsumerCustomAttributeFunction = (span: Span, topic: string) => {
    // console.log('kafkaConsumeHook', topic)
    // console.log(JSON.stringify(kafkaTopicConsumeCountMetric));
    // kafkaTopicConsumeCountMetric.add(1, { topic });
    span.updateName(`Kafka consume ${topic}`);
};
