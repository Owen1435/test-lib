import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
// import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
// import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
// import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
// import { PrismaInstrumentation } from '@prisma/instrumentation';
// import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { Logger } from '@nestjs/common';
import { TTelemetryConfig } from './types';
// import { amqpConsumeHook, amqpPublishHook, kafkaConsumeHook, kafkaPublishHook } from './hooks';
import { defaultTelemetryConfig } from './configs/default-telemetry.config';
import { EInstrumentationName } from './enums';
// import { PrismaMetricProducer } from './metric-producers';


export const initOtelSDK = (config: TTelemetryConfig) => {
    if (!config.enabled) {
        // Logger.log('Telemetry disabled');
        console.log('Telemetry disabled')
        return;
    }

    const resource = new Resource({
        [SEMRESATTRS_SERVICE_NAME]: config.serviceName,
        [SEMRESATTRS_SERVICE_VERSION]: config.version,
    });

    const metricExporter = new OTLPMetricExporter({
        url: config.metrics.collectorUrl,
    });

    const metricReader = new PeriodicExportingMetricReader({
        ...config.metrics,
        exporter: metricExporter,
        // metricProducers: [new PrismaMetricProducer()],
    });

    const traceExporter = new OTLPTraceExporter({
        url: config.traces.collectorUrl,
    });

    const spanProcessors = [new BatchSpanProcessor(traceExporter, config.traces)];

    // const instrumentations = [
    //     new NestInstrumentation(),
    //     new HttpInstrumentation(),
    //     new ExpressInstrumentation(),
    //     // new PinoInstrumentation({
    //     //     logKeys: {
    //     //         traceId: 'traceId',
    //     //         spanId: 'spanId',
    //     //         traceFlags: 'traceFlags',
    //     //     },
    //     // }),
    //     // new AmqplibInstrumentation({
    //     //     consumeHook: amqpConsumeHook,
    //     //     publishHook: amqpPublishHook,
    //     // }),
    //     // new PrismaInstrumentation({ middleware: true }),
    //     // new KafkaJsInstrumentation({
    //     //     consumerHook: kafkaConsumeHook,
    //     //     producerHook: kafkaPublishHook,
    //     // }),
    //     // new RedisInstrumentation(),
    // ];
    //
    // const enabledInstrumentations = config.instrumentations || defaultTelemetryConfig.instrumentations;
    // if (enabledInstrumentations) {
    //     for (const instrumentation of instrumentations) {
    //         if (!enabledInstrumentations.includes(instrumentation.instrumentationName as EInstrumentationName)) {
    //             instrumentation.disable();
    //         }
    //     }
    // }

    const sdk = new NodeSDK({
        autoDetectResources: true,
        resource,
        spanProcessors,
        metricReader,
        instrumentations: [
            new NestInstrumentation(),
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
        ],
    });

    sdk.start();
    // Logger.log(`Telemetry init with config: ${JSON.stringify(config)}`);
    console.log(`Telemetry init with config: ${JSON.stringify(config)}`);

    const signalHandler = () => {
        sdk.shutdown().then(() => console.log('shutdown')).finally(() => process.exit(0));
    };

    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
    process.on('SIGQUIT', signalHandler);
};
