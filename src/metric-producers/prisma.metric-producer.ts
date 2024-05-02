import {
    AggregationTemporality,
    CollectionResult,
    DataPointType,
    InstrumentType,
    MetricProducer,
    ScopeMetrics,
} from '@opentelemetry/sdk-metrics';
import { HrTime, ValueType } from '@opentelemetry/api';
import { hrTime } from '@opentelemetry/core';
import { Resource } from '@opentelemetry/resources';
import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;

/** Set prisma client instance for collecting metrics */
export const setPrismaClient = (client: PrismaClient) => {
    prismaClient = client;
};

export class PrismaMetricProducer implements MetricProducer {
    private readonly startTime: HrTime = hrTime();

    async collect(): Promise<CollectionResult> {
        const result: CollectionResult = {
            resourceMetrics: {
                resource: Resource.EMPTY,
                scopeMetrics: [],
            },
            errors: [],
        };

        if (!prismaClient) {
            return result;
        }

        const endTime = hrTime();
        const metrics = await prismaClient.$metrics.json();
        const scopeMetrics: ScopeMetrics = {
            scope: {
                name: '',
            },
            metrics: [],
        };

        for (const counter of metrics.counters) {
            scopeMetrics.metrics.push({
                descriptor: {
                    name: counter.key,
                    description: counter.description,
                    unit: '1',
                    type: InstrumentType.COUNTER,
                    valueType: ValueType.INT,
                },
                dataPointType: DataPointType.SUM,
                aggregationTemporality: AggregationTemporality.CUMULATIVE,
                dataPoints: [
                    {
                        startTime: this.startTime,
                        endTime: endTime,
                        value: counter.value,
                        attributes: counter.labels,
                    },
                ],
                isMonotonic: true,
            });
        }

        for (const gauge of metrics.gauges) {
            scopeMetrics.metrics.push({
                descriptor: {
                    name: gauge.key,
                    description: gauge.description,
                    unit: '1',
                    type: InstrumentType.UP_DOWN_COUNTER,
                    valueType: ValueType.INT,
                },
                dataPointType: DataPointType.GAUGE,
                aggregationTemporality: AggregationTemporality.CUMULATIVE,
                dataPoints: [
                    {
                        startTime: this.startTime,
                        endTime: endTime,
                        value: gauge.value,
                        attributes: gauge.labels,
                    },
                ],
            });
        }

        for (const histogram of metrics.histograms) {
            const boundaries: any[] = [];
            const counts: any[] = [];
            for (const [boundary, count] of histogram.value.buckets) {
                boundaries.push(boundary);
                counts.push(count);
            }
            scopeMetrics.metrics.push({
                descriptor: {
                    name: histogram.key,
                    description: histogram.description,
                    unit: 'ms',
                    type: InstrumentType.HISTOGRAM,
                    valueType: ValueType.DOUBLE,
                },
                dataPointType: DataPointType.HISTOGRAM,
                aggregationTemporality: AggregationTemporality.CUMULATIVE,
                dataPoints: [
                    {
                        startTime: this.startTime,
                        endTime: endTime,
                        value: {
                            buckets: {
                                boundaries,
                                counts,
                            },
                            count: histogram.value.count,
                            sum: histogram.value.sum,
                        },
                        attributes: histogram.labels,
                    },
                ],
            });
        }

        result.resourceMetrics.scopeMetrics.push(scopeMetrics);

        return result;
    }
}
