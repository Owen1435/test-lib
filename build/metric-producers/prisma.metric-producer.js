"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMetricProducer = exports.setPrismaClient = void 0;
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const resources_1 = require("@opentelemetry/resources");
let prismaClient = null;
const setPrismaClient = (client) => {
    prismaClient = client;
};
exports.setPrismaClient = setPrismaClient;
class PrismaMetricProducer {
    constructor() {
        this.startTime = (0, core_1.hrTime)();
    }
    async collect() {
        const result = {
            resourceMetrics: {
                resource: resources_1.Resource.EMPTY,
                scopeMetrics: [],
            },
            errors: [],
        };
        if (!prismaClient) {
            return result;
        }
        const endTime = (0, core_1.hrTime)();
        const metrics = await prismaClient.$metrics.json();
        const scopeMetrics = {
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
                    type: sdk_metrics_1.InstrumentType.COUNTER,
                    valueType: api_1.ValueType.INT,
                },
                dataPointType: sdk_metrics_1.DataPointType.SUM,
                aggregationTemporality: sdk_metrics_1.AggregationTemporality.CUMULATIVE,
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
                    type: sdk_metrics_1.InstrumentType.UP_DOWN_COUNTER,
                    valueType: api_1.ValueType.INT,
                },
                dataPointType: sdk_metrics_1.DataPointType.GAUGE,
                aggregationTemporality: sdk_metrics_1.AggregationTemporality.CUMULATIVE,
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
            const boundaries = [];
            const counts = [];
            for (const [boundary, count] of histogram.value.buckets) {
                boundaries.push(boundary);
                counts.push(count);
            }
            scopeMetrics.metrics.push({
                descriptor: {
                    name: histogram.key,
                    description: histogram.description,
                    unit: 'ms',
                    type: sdk_metrics_1.InstrumentType.HISTOGRAM,
                    valueType: api_1.ValueType.DOUBLE,
                },
                dataPointType: sdk_metrics_1.DataPointType.HISTOGRAM,
                aggregationTemporality: sdk_metrics_1.AggregationTemporality.CUMULATIVE,
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
exports.PrismaMetricProducer = PrismaMetricProducer;
//# sourceMappingURL=prisma.metric-producer.js.map