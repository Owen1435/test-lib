import {Counter, metrics, ValueType} from '@opentelemetry/api';

export const APPLICATION_METRIC_PREFIX = 'app';

export type TKafkaTopicProduceCountMetricAttributes = {
    topic: string;
};

/** The number of produce message count to kafka */
export let kafkaTopicProduceCountMetric: Counter<TKafkaTopicProduceCountMetricAttributes>

export type TKafkaTopicConsumeCountMetricAttributes = {
    topic: string;
};

/** The number of consume message count to kafka */
export let kafkaTopicConsumeCountMetric: Counter<TKafkaTopicConsumeCountMetricAttributes>

export const initMetrics = () => {
    const meter = metrics.getMeterProvider().getMeter('app');
    console.log(meter)

    kafkaTopicProduceCountMetric = meter.createCounter<TKafkaTopicProduceCountMetricAttributes>('kafka_topic_produce_count', {
        description: 'The number of produce message count to kafka',
        valueType: ValueType.INT,
    });

    kafkaTopicConsumeCountMetric = meter.createCounter<TKafkaTopicConsumeCountMetricAttributes>('kafka_topic_consume_count', {
        description: 'The number of consume message count to kafka',
        valueType: ValueType.INT,
    });
}
