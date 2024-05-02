"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amqpConsumeHook = void 0;
const amqpConsumeHook = (span, info) => {
    span.updateName(`AMQP consume ${info.msg.fields.exchange}->${info.msg.fields.routingKey}`);
};
exports.amqpConsumeHook = amqpConsumeHook;
//# sourceMappingURL=amqp-consume.hook.js.map