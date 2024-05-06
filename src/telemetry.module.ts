import { OpenTelemetryModule } from 'nestjs-otel';
import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TTelemetryConfig } from './types';
import { defaultTelemetryConfig } from './configs/default-telemetry.config';
import { ResponseTraceIdMiddleware } from './middlewares';

@Global()
@Module({})
export class TelemetryModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(ResponseTraceIdMiddleware).forRoutes('*');
    }

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
