import { Resource, detectResourcesSync } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_NAMESPACE, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Logger } from '@nestjs/common';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import { FsInstrumentation } from '@opentelemetry/instrumentation-fs';
import { TTelemetryConfig } from './types';
import { amqpConsumeHook, amqpPublishHook, fsCreateHook, kafkaConsumeHook, kafkaPublishHook } from './hooks';
import { defaultTelemetryConfig } from './configs/default-telemetry.config';
import { EInstrumentationName } from './enums';
import { PrismaMetricProducer } from './metric-producers';
import { CommonSampler } from './samplers';

export const initOtelSDK = (config: TTelemetryConfig) => {
    if (!config.enabled) {
        Logger.log('Telemetry disabled');
        return;
    }

    const resource = detectResourcesSync({
        detectors: [containerDetector],
    }).merge(
        new Resource({
            [SEMRESATTRS_SERVICE_NAME]: `ppmru:${config.serviceName}`,
            [SEMRESATTRS_SERVICE_VERSION]: config.version,
            [SEMRESATTRS_SERVICE_NAMESPACE]: config.env,
        }),
    );

    const metricExporter = new OTLPMetricExporter({
        url: config.metrics.collectorUrl,
    });

    const metricReader = new PeriodicExportingMetricReader({
        ...config.metrics,
        exporter: metricExporter,
        metricProducers: [new PrismaMetricProducer()],
    });

    const traceExporter = new OTLPTraceExporter({
        url: config.traces.collectorUrl,
    });

    const spanProcessors = [new BatchSpanProcessor(traceExporter, config.traces)];

    const instrumentations = [
        new HttpInstrumentation(),
        new PgInstrumentation(),
        new NestInstrumentation(),
        new PinoInstrumentation({
            logKeys: {
                traceId: 'traceId',
                spanId: 'spanId',
                traceFlags: 'traceFlags',
            },
        }),
        new ExpressInstrumentation(),
        new AmqplibInstrumentation({
            consumeHook: amqpConsumeHook,
            publishHook: amqpPublishHook,
        }),
        new PrismaInstrumentation({ middleware: true }),
        new KafkaJsInstrumentation({
            consumerHook: kafkaConsumeHook,
            producerHook: kafkaPublishHook,
        }),
        new RedisInstrumentation(),
        new FsInstrumentation({
            createHook: fsCreateHook(config.sampling?.fs),
            requireParentSpan: true,
        }),
    ];

    const enabledInstrumentations = config.instrumentations || defaultTelemetryConfig.instrumentations;
    if (enabledInstrumentations) {
        for (const instrumentation of instrumentations) {
            if (!enabledInstrumentations.includes(instrumentation.instrumentationName as EInstrumentationName)) {
                instrumentation.disable();
            }
        }
    }

    const sdk = new NodeSDK({
        autoDetectResources: true,
        sampler: new CommonSampler(config.sampling),
        resource,
        spanProcessors,
        metricReader,
        instrumentations,
    });

    sdk.start();
    Logger.log(`Telemetry init with config: ${JSON.stringify(config)}`);

    const signalHandler = () => {
        sdk.shutdown().finally(() => process.exit(0));
    };

    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
    process.on('SIGQUIT', signalHandler);
};
