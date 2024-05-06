import { BufferConfig } from '@opentelemetry/sdk-trace-base';
import { PeriodicExportingMetricReaderOptions } from '@opentelemetry/sdk-metrics';
import { EInstrumentationName } from '../enums';
import { TSamplingOptions } from './sampling-options.type';

export type TTelemetryConfig = {
    serviceName: string;
    version: string;
    env: string;
    enabled: boolean;
    /** Undefined = all instrumentations will be enabled */
    instrumentations?: EInstrumentationName[];
    sampling?: TSamplingOptions;
    traces: BufferConfig & {
        collectorUrl: string;
    };
    metrics: Pick<PeriodicExportingMetricReaderOptions, 'exportIntervalMillis' | 'exportTimeoutMillis'> & {
        collectorUrl: string;
        hostMetricsEnabled: boolean;
        apiMetricsEnabled: boolean;
        apiMetricsIgnoreRoutes: string[];
        apiMetricsIgnoreUndefinedRoutes?: boolean;
    };
};
