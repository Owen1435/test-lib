"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RMQTraceIntercepterFactory = void 0;
const nestjs_rmq_1 = require("nestjs-rmq");
const api_1 = require("@opentelemetry/api");
function RMQTraceIntercepterFactory(traceService) {
    return class RMQTraceIntercepter extends nestjs_rmq_1.RMQIntercepterClass {
        intercept(res, msg, error) {
            if (error) {
                const span = traceService.getSpan();
                span === null || span === void 0 ? void 0 : span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: error.message });
                span === null || span === void 0 ? void 0 : span.addEvent('exception', {
                    ['exception.message']: error.message,
                    ['exception.stacktrace']: error.stack,
                });
            }
            return res;
        }
    };
}
exports.RMQTraceIntercepterFactory = RMQTraceIntercepterFactory;
//# sourceMappingURL=rmq-trace.interceptor-factory.js.map