import { Histogram, MetricOptions, metrics, ValueType } from '@opentelemetry/api';
import { copyMetadataFromFunctionToFunction } from 'nestjs-otel/lib/opentelemetry.utils';
import { decorateClassOrMethod, snakeCase } from '../utils';
import { APPLICATION_METRIC_PREFIX } from '../metrics';

export type TExecutionTimeMetricOptions = MetricOptions & {
    name?: string;
};

const executionTimeHistogram = ({
    name,
    description,
    unit = 'ms',
    valueType = ValueType.DOUBLE,
}: TExecutionTimeMetricOptions = {}): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;
        const className = target.constructor.name as string;
        const propertyName = String(propertyKey);
        const metricName = name ?? `${APPLICATION_METRIC_PREFIX}_${snakeCase(className)}_${snakeCase(propertyName)}_duration`;

        const metricDescription = description ?? `The elapsed time in ${unit} for the ${className} to ${propertyName}`;

        const histogram: Histogram = metrics
            .getMeter('app')
            .createHistogram(metricName, { description: metricDescription, unit, valueType });

        descriptor.value = function(...args: any[]) {
            const start = performance.now();
            const result = method.apply(this, args);

            void Promise.resolve(result).then(() => {
                const end = performance.now();
                histogram.record(end - start, {});
            });

            return result;
        };

        copyMetadataFromFunctionToFunction(method, descriptor.value);
    };
};

export const ExecutionTimeMetric = decorateClassOrMethod<TExecutionTimeMetricOptions>(executionTimeHistogram);
