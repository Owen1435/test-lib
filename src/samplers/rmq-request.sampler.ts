import { Sampler, SamplingDecision, SamplingResult } from '@opentelemetry/sdk-trace-base';
import { Attributes, Context, SpanKind, trace, TraceFlags } from '@opentelemetry/api';
import { SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY } from '@opentelemetry/semantic-conventions';
import { RmqRequestSamplerOptions } from '../types';

/** RmqRequestSampler sample amqp request (head sampling)
 * @link https://opentelemetry.io/docs/concepts/sampling/
 */
export class RmqRequestSampler implements Sampler {
    constructor(private readonly options?: RmqRequestSamplerOptions) {}

    shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: Attributes): SamplingResult {
        const parentContext = trace.getSpanContext(context);
        const route: string | undefined = attributes[SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY] as string;

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
