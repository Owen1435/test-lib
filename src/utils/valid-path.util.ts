import * as path from 'path';

export const isValidPath = (filePath: string): boolean => {
    const relativePath = new RegExp(/^[./\\]/);
    const nodePath = new RegExp(/node:/);
    return path.isAbsolute(filePath) || relativePath.test(filePath) || nodePath.test(filePath);
};
