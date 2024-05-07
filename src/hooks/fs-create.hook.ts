import { FMember, FPMember, CreateHook } from '@opentelemetry/instrumentation-fs';
import { FsSamplerOptions } from '../types';
import { isValidPath } from '../utils';

const DEFAULT_IGNORE_PATH = ['/node_modules', '/dist', 'node:'];

// By default, @opentelemetry/instrumentation-fs logs all node:fs lib calls, including reading files from directories node_modules, dist, ...
export const fsCreateHook = (options?: FsSamplerOptions): CreateHook => (
    functionName: FMember | FPMember,
    info: { args: ArrayLike<unknown> },
) => {
    if (!options) {
        return true;
    }

    const { availablePaths, availableMethods, ignorePaths, ignoreMethods } = options;
    const path: unknown | undefined = info.args[0];

    if (!path || typeof path !== 'string' || !isValidPath(path)) {
        return true;
    }

    // check available paths
    if (availableMethods && !availableMethods.includes(functionName)) {
        return false;
    }
    if (availablePaths) {
        return availablePaths.some(availablePath => new RegExp(availablePath).test(path));
    }

    // check ignore paths
    if (ignoreMethods && ignoreMethods.includes(functionName)) {
        return false;
    }
    return ![...DEFAULT_IGNORE_PATH, ...(ignorePaths || [])].some(availablePath => new RegExp(availablePath).test(path));
};
