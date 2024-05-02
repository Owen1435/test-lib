"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amqpPublishHook = void 0;
const amqpPublishHook = (span, info) => {
    span.updateName(`AMQP publish ${info.exchange}->${info.routingKey}`);
};
exports.amqpPublishHook = amqpPublishHook;
//# sourceMappingURL=amqp-publish.hook.js.map