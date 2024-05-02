"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TelemetryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryModule = void 0;
const nestjs_otel_1 = require("nestjs-otel");
const common_1 = require("@nestjs/common");
const default_telemetry_config_1 = require("./configs/default-telemetry.config");
let TelemetryModule = TelemetryModule_1 = class TelemetryModule {
    static forRoot(config) {
        var _a, _b, _c, _d;
        return {
            module: TelemetryModule_1,
            imports: [
                nestjs_otel_1.OpenTelemetryModule.forRoot({
                    metrics: {
                        hostMetrics: config.metrics.hostMetricsEnabled || ((_a = default_telemetry_config_1.defaultTelemetryConfig.metrics) === null || _a === void 0 ? void 0 : _a.hostMetricsEnabled),
                        apiMetrics: {
                            enable: config.metrics.apiMetricsEnabled || ((_b = default_telemetry_config_1.defaultTelemetryConfig.metrics) === null || _b === void 0 ? void 0 : _b.apiMetricsEnabled),
                            ignoreUndefinedRoutes: (_c = default_telemetry_config_1.defaultTelemetryConfig.metrics) === null || _c === void 0 ? void 0 : _c.apiMetricsIgnoreUndefinedRoutes,
                            ignoreRoutes: (_d = default_telemetry_config_1.defaultTelemetryConfig.metrics) === null || _d === void 0 ? void 0 : _d.apiMetricsIgnoreRoutes,
                        },
                    },
                }),
            ],
            exports: [nestjs_otel_1.OpenTelemetryModule],
        };
    }
};
TelemetryModule = TelemetryModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], TelemetryModule);
exports.TelemetryModule = TelemetryModule;
//# sourceMappingURL=telemetry.module.js.map