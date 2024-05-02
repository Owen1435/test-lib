import { DynamicModule } from '@nestjs/common';
import { TTelemetryConfig } from './types';
export declare class TelemetryModule {
    static forRoot(config: TTelemetryConfig): DynamicModule;
}
