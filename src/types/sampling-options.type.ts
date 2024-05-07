export type HttpRequestSamplerOptions = {
    ignoreRoutes?: string[];
};

export type RmqRequestSamplerOptions = {
    ignoreRoutes?: string[];
};

export type FsSamplerOptions = {
    availableMethods?: string[];
    availablePaths?: string[];
    ignoreMethods?: string[];
    ignorePaths?: string[];
};

export type TSamplingOptions = {
    http?: HttpRequestSamplerOptions;
    rmq?: RmqRequestSamplerOptions;
    fs?: FsSamplerOptions;
};
