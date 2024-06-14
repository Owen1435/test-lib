import { ValueType } from '@opentelemetry/api';
import { meter } from "./otel-sdk";

export const APPLICATION_METRIC_PREFIX = 'app';

export type TKafkaTopicProduceCountMetricAttributes = {
    topic: string;
};

/** The number of produce message count to kafka */
export const kafkaTopicProduceCountMetric = meter.createCounter<TKafkaTopicProduceCountMetricAttributes>('kafka_topic_produce_count', {
    description: 'The number of produce message count to kafka',
    valueType: ValueType.INT,
});

export type TKafkaTopicConsumeCountMetricAttributes = {
    topic: string;
};

/** The number of consume message count to kafka */
export const kafkaTopicConsumeCountMetric = meter.createCounter<TKafkaTopicConsumeCountMetricAttributes>('kafka_topic_consume_count', {
    description: 'The number of consume message count to kafka',
    valueType: ValueType.INT,
});
