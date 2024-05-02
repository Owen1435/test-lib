"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOtelSDK = void 0;
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const instrumentation_nestjs_core_1 = require("@opentelemetry/instrumentation-nestjs-core");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const instrumentation_amqplib_1 = require("@opentelemetry/instrumentation-amqplib");
const opentelemetry_instrumentation_kafkajs_1 = require("opentelemetry-instrumentation-kafkajs");
const instrumentation_pg_1 = require("@opentelemetry/instrumentation-pg");
const instrumentation_pino_1 = require("@opentelemetry/instrumentation-pino");
const instrumentation_1 = require("@prisma/instrumentation");
const instrumentation_redis_1 = require("@opentelemetry/instrumentation-redis");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const common_1 = require("@nestjs/common");
const hooks_1 = require("./hooks");
const default_telemetry_config_1 = require("./configs/default-telemetry.config");
const metric_producers_1 = require("./metric-producers");
const initOtelSDK = (config) => {
    if (!config.enabled) {
        common_1.Logger.log('Telemetry disabled');
        return;
    }
    const resource = new resources_1.Resource({
        [semantic_conventions_1.SEMRESATTRS_SERVICE_NAME]: config.serviceName,
        [semantic_conventions_1.SEMRESATTRS_SERVICE_VERSION]: config.version,
    });
    const metricExporter = new exporter_metrics_otlp_http_1.OTLPMetricExporter({
        url: config.metrics.collectorUrl,
    });
    const metricReader = new sdk_metrics_1.PeriodicExportingMetricReader(Object.assign(Object.assign({}, config.metrics), { exporter: metricExporter, metricProducers: [new metric_producers_1.PrismaMetricProducer()] }));
    const traceExporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({
        url: config.traces.collectorUrl,
    });
    const spanProcessors = [new sdk_trace_base_1.BatchSpanProcessor(traceExporter, config.traces)];
    const instrumentations = [
        new instrumentation_http_1.HttpInstrumentation(),
        new instrumentation_pg_1.PgInstrumentation(),
        new instrumentation_nestjs_core_1.NestInstrumentation(),
        new instrumentation_pino_1.PinoInstrumentation({
            logKeys: {
                traceId: 'traceId',
                spanId: 'spanId',
                traceFlags: 'traceFlags',
            },
        }),
        new instrumentation_express_1.ExpressInstrumentation(),
        new instrumentation_amqplib_1.AmqplibInstrumentation({
            consumeHook: hooks_1.amqpConsumeHook,
            publishHook: hooks_1.amqpPublishHook,
        }),
        new instrumentation_1.PrismaInstrumentation({ middleware: true }),
        new opentelemetry_instrumentation_kafkajs_1.KafkaJsInstrumentation({
            consumerHook: hooks_1.kafkaConsumeHook,
            producerHook: hooks_1.kafkaPublishHook,
        }),
        new instrumentation_redis_1.RedisInstrumentation(),
    ];
    const enabledInstrumentations = config.instrumentations || default_telemetry_config_1.defaultTelemetryConfig.instrumentations;
    if (enabledInstrumentations) {
        for (const instrumentation of instrumentations) {
            if (!enabledInstrumentations.includes(instrumentation.instrumentationName)) {
                instrumentation.disable();
            }
        }
    }
    const sdk = new sdk_node_1.NodeSDK({
        autoDetectResources: true,
        resource,
        spanProcessors,
        metricReader,
        instrumentations,
    });
    sdk.start();
    common_1.Logger.log(`Telemetry init with config: ${JSON.stringify(config)}`);
    const signalHandler = () => {
        sdk.shutdown().finally(() => process.exit(0));
    };
    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
    process.on('SIGQUIT', signalHandler);
};
exports.initOtelSDK = initOtelSDK;
//# sourceMappingURL=otel-sdk.js.map