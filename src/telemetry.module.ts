import { OpenTelemetryModule } from 'nestjs-otel';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { TTelemetryConfig } from './types';
import { defaultTelemetryConfig } from './configs/default-telemetry.config';

@Global()
@Module({})
export class TelemetryModule {
    public static forRoot(config: TTelemetryConfig): DynamicModule {
        return {
            module: TelemetryModule,
            imports: [
                OpenTelemetryModule.forRoot({
                    metrics: {
                        hostMetrics: config.metrics.hostMetricsEnabled || defaultTelemetryConfig.metrics?.hostMetricsEnabled,
                        apiMetrics: {
                            enable: config.metrics.apiMetricsEnabled || defaultTelemetryConfig.metrics?.apiMetricsEnabled,
                            ignoreUndefinedRoutes: defaultTelemetryConfig.metrics?.apiMetricsIgnoreUndefinedRoutes,
                            ignoreRoutes: defaultTelemetryConfig.metrics?.apiMetricsIgnoreRoutes,
                        },
                    },
                }),
            ],
            exports: [OpenTelemetryModule],
        };
    }
}
