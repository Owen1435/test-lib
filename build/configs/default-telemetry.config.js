"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTelemetryConfig = void 0;
exports.defaultTelemetryConfig = {
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
//# sourceMappingURL=default-telemetry.config.js.map