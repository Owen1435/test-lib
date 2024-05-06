export type HttpRequestSamplerOptions = {
    ignoreRoutes?: string[];
};

export type RmqRequestSamplerOptions = {
    ignoreRoutes?: string[];
};

export type TSamplingOptions = {
    http?: HttpRequestSamplerOptions;
    rmq?: RmqRequestSamplerOptions;
};
