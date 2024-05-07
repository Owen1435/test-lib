# Info

PPM platform opentelemetry module.

# Install

`npm i @ppm/ppm-platform-opentelemetry`

# Workflows
 * main.yml is used to publish packages to release registry. In can be triggered only from master branch

# Usage

In OpenTelemetry for Node.js, auto-instrumentation is based on the mechanism of function hooking. This allows for the automatic integration of libraries without requiring modifications to their source code.

> (IMPORTNANT) 
> The instrumentation setup and configuration must be run before your application code. 
> Before any other module in your application is loaded, you must initialize the SDK. 
> If you fail to initialize the SDK or initialize it too late, no-op implementations will be provided to any library.
> https://opentelemetry.io/docs/languages/js/instrumentation/

> For using nestjs-otel lib decorators and services you should import them from this packages

## Integration to service

### Init opentelemetry
1. Add the configuration file to the service
```typescript
/** The imports here should look exactly like this. 
 * The OpenTelemetry SDK is not initialized yet. Importing from the index file, which re-exports all modules of the library, violates the rule that "OpenTelemetry must be initialized before loading other modules of the application". Some instrumentations will not work correctly. 
 * @link: https://github.lmru.tech/adeo/lmru--ppm--platform--opentelemetry
 * @link: https://opentelemetry.io/docs/languages/js/instrumentation/
 */
import { TTelemetryConfig } from '@ppm/ppm-platform-opentelemetry/build/types';
import { EInstrumentationName } from '@ppm/ppm-platform-opentelemetry/build/enums';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const telemetryConfig: TTelemetryConfig = {
    serviceName: packageInfo.name,
    version: packageInfo.version,
    enabled: process.env.OTEL_ENABLED === 'true',
    //...
};
```
2. Add this code to the top of the main.ts, use eslint-disable when necessary 
```typescript
/* eslint-disable import/order */
/** This code must be exactly here.
 * In OpenTelemetry for Node.js, instrumentation is based on the mechanism of function hooking. Before any other module in your application is loaded, you must initialize the SDK. If you fail to initialize the SDK or initialize it too late, no-op implementations will be provided to any library.
 * @link: https://github.lmru.tech/adeo/lmru--ppm--platform--opentelemetry
 * @link: https://opentelemetry.io/docs/languages/js/instrumentation/
 */
import { initOtelSDK } from '@ppm/ppm-platform-opentelemetry/build/otel-sdk';
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
