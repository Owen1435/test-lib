"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaPublishHook = void 0;
const kafkaPublishHook = (span, topic) => {
    span.updateName(`Kafka publish ${topic}`);
};
exports.kafkaPublishHook = kafkaPublishHook;
//# sourceMappingURL=kafka-publish.hook.js.map