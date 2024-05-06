import { Sampler, SamplingDecision, SamplingResult } from '@opentelemetry/sdk-trace-base';
import { Attributes, Context, SpanKind, TraceFlags, trace } from '@opentelemetry/api';
import { SEMATTRS_HTTP_TARGET } from '@opentelemetry/semantic-conventions';
import { HttpRequestSamplerOptions } from '../types';

/** HttpRequestSampler sample http request (head sampling)
 * @link https://opentelemetry.io/docs/concepts/sampling/
 */
export class HttpRequestSampler implements Sampler {
    constructor(private readonly options?: HttpRequestSamplerOptions) {}

    shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: Attributes): SamplingResult {
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
