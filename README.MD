# Info

PPM platform opentelemetry module.

# Install

`npm i @ppm/ppm-platform-opentelemetry`

# Workflows
 * main.yml is used to publish packages to release registry. In can be triggered only from master branch

# Usage

> For using nestjs-otel lib decorators and services you should import them from this packages

## Integration to service

### Init opentelemetry
1. Add the configuration file to the service 
2. Add this code to the top of the main.ts, use eslint-disable when necessary 
```typescript
/* eslint-disable import/order */
// This code must be exactly here
import { initOtelSDK } from '@ppm/ppm-platform-opentelemetry';
import { telemetryConfig } from './configs/telemetry.config';
initOtelSDK(telemetryConfig);
```

### Prisma integration
For enable tracing and metrics with Prisma:
1. Enable Prisma instrumentation in telemetry config
```typescript
export const telemetryConfig: TTelemetryConfig = {
    //...
    instrumentations: [
        EInstrumentationName.Prisma,
    ],
};
```
2. Add this code to shema.prisma
```text
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["tracing", "metrics"]
}
```
3. Add setting prisma client instance into PrismaService constructor
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        //...
        setPrismaClient(this)
    }
}
```

### RabbitMq integration
For enable tracing and metrics with RabbitMq:
1. Enable Amqp instrumentation in telemetry config
```typescript
export const telemetryConfig: TTelemetryConfig = {
    //...
    instrumentations: [
        EInstrumentationName.Amqp,
    ],
};
```
2. Add RMQTraceIntercepter to RMQConfig for proper trace error handling via amqp
```typescript
export const getRMQConfig = (configService: ConfigService<Env, true>, traceService: TraceService): IRMQServiceOptions => {
    return {
        //...
        intercepters: [RMQTraceIntercepterFactory(traceService)],
    };
};
```
