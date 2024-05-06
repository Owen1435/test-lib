import { Sampler, SamplingDecision, SamplingResult } from '@opentelemetry/sdk-trace-base';
import { Attributes, Context, Link, SpanKind } from '@opentelemetry/api';
import { HttpRequestSampler } from './http-request.sampler';
import { TSamplingOptions } from '../types';
import { RmqRequestSampler } from './rmq-request.sampler';

export class CommonSampler implements Sampler {
    private readonly samplers: Sampler[] = [];

    constructor(private readonly options?: TSamplingOptions) {
        this.samplers = [new HttpRequestSampler(options?.http), new RmqRequestSampler(options?.rmq)];
    }

    shouldSample(
        context: Context,
        traceId: string,
        spanName: string,
        spanKind: SpanKind,
        attributes: Attributes,
        links: Link[],
    ): SamplingResult {
        if (!this.options) {
            return {
                decision: SamplingDecision.RECORD_AND_SAMPLED,
            };
        }

        const samplingResults: SamplingResult[] = [];
        this.samplers.forEach(sampler => {
            samplingResults.push(sampler.shouldSample(context, traceId, spanName, spanKind, attributes, links));
        });

        return {
            decision: samplingResults.some(samplingResult => samplingResult.decision === SamplingDecision.NOT_RECORD)
                ? SamplingDecision.NOT_RECORD
                : SamplingDecision.RECORD_AND_SAMPLED,
        };
    }
}
