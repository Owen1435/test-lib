"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConsumeHook = void 0;
const kafkaConsumeHook = (span, topic) => {
    span.updateName(`Kafka consume ${topic}`);
};
exports.kafkaConsumeHook = kafkaConsumeHook;
//# sourceMappingURL=kafka-consume.hook.js.map