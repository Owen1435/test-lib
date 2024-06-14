import {Counter, metrics, ValueType} from '@opentelemetry/api';

export const APPLICATION_METRIC_PREFIX = 'app';

export type TKafkaTopicProduceCountMetricAttributes = {
    topic: string;
};

/** The number of produce messages count to kafka */
export let kafkaTopicProduceCountMetric: Counter<TKafkaTopicProduceCountMetricAttributes>

export type TKafkaTopicConsumeCountMetricAttributes = {
    topic: string;
};

/** The number of consume messages count to kafka */
export let kafkaTopicConsumeCountMetric: Counter<TKafkaTopicConsumeCountMetricAttributes>

export type TRmqQueueProduceCountMetricAttributes = {
    exchange: string;
    routingKey: string;
};

/** The number of produce messages count to rabbit queue */
export let rmqQueueProduceCountMetric: Counter<TRmqQueueProduceCountMetricAttributes>


export type TRmqQueueConsumeCountMetricAttributes = {
    exchange: string;
    routingKey: string;
};

/** The number of consume messages count to rabbit queue */
export let rmqQueueConsumeCountMetric: Counter<TRmqQueueConsumeCountMetricAttributes>

export const initMetrics = () => {
    const meter = metrics.getMeterProvider().getMeter(`${APPLICATION_METRIC_PREFIX}_opentelemetry`);

    kafkaTopicProduceCountMetric = meter.createCounter<TKafkaTopicProduceCountMetricAttributes>('kafka_topic_produce_count', {
        description: 'The number of produce messages count to kafka',
        valueType: ValueType.INT,
    });
    kafkaTopicConsumeCountMetric = meter.createCounter<TKafkaTopicConsumeCountMetricAttributes>('kafka_topic_consume_count', {
        description: 'The number of consume messages count to kafka',
        valueType: ValueType.INT,
    });
    rmqQueueProduceCountMetric = meter.createCounter<TRmqQueueProduceCountMetricAttributes>('rmq_queue_produce_count', {
        description: 'The number of produce messages count to rabbit queue',
        valueType: ValueType.INT,
    });
    rmqQueueConsumeCountMetric = meter.createCounter<TRmqQueueConsumeCountMetricAttributes>('rmq_queue_consume_count', {
        description: 'The number of consume messages count to rabbit queue',
        valueType: ValueType.INT,
    });
}
