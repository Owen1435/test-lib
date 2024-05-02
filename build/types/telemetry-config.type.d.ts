import { BufferConfig } from '@opentelemetry/sdk-trace-base';
import { PeriodicExportingMetricReaderOptions } from '@opentelemetry/sdk-metrics';
import { EInstrumentationName } from '../enums';
export type TTelemetryConfig = {
    serviceName: string;
    version: string;
    enabled: boolean;
    instrumentations?: EInstrumentationName[];
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
