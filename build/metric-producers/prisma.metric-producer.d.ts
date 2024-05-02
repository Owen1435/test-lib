import { CollectionResult, MetricProducer } from '@opentelemetry/sdk-metrics';
import { PrismaClient } from '@prisma/client';
export declare const setPrismaClient: (client: PrismaClient) => void;
export declare class PrismaMetricProducer implements MetricProducer {
    private readonly startTime;
    collect(): Promise<CollectionResult>;
}
