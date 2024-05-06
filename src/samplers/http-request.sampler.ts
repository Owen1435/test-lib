import { Sampler, SamplingDecision, SamplingResult } from '@opentelemetry/sdk-trace-base';
import { Attributes, Context, Link, SpanKind, TraceFlags, trace } from '@opentelemetry/api';
import { HttpRequestSamplerOptions } from '../types';
import { SEMATTRS_HTTP_TARGET } from '@opentelemetry/semantic-conventions';

export class HttpRequestSampler implements Sampler {
    constructor(private readonly options?: HttpRequestSamplerOptions) {}

    shouldSample(
        context: Context,
        traceId: string,
        spanName: string,
        spanKind: SpanKind,
        attributes: Attributes,
        links: Link[],
    ): SamplingResult {
        const parentContext = trace.getSpanContext(context);
        const route: string | undefined = attributes[SEMATTRS_HTTP_TARGET] as string;

        if (!parentContext && route && this.options?.ignoreRoutes?.some(ignoreRoute => new RegExp(ignoreRoute).test(route))) {
            return {
                decision: SamplingDecision.NOT_RECORD,
            };
        }

        if (parentContext && parentContext.traceFlags !== TraceFlags.SAMPLED) {
            return {
                decision: SamplingDecision.NOT_RECORD,
            };
        }

        return {
            decision: SamplingDecision.RECORD_AND_SAMPLED,
        };
    }
}
