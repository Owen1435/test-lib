import { DeepPartial, TTelemetryConfig } from '../types';

export const defaultTelemetryConfig: DeepPartial<TTelemetryConfig> = {
    traces: {
        scheduledDelayMillis: 5000,
    },
    metrics: {
        exportIntervalMillis: 30000,
        hostMetricsEnabled: false,
        apiMetricsEnabled: false,
        apiMetricsIgnoreUndefinedRoutes: false,
        apiMetricsIgnoreRoutes: [],
    },
};
