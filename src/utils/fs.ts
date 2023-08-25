// TODO: why aren't we just using something like this instead?
// import fs from 'node:fs/promises'
// Also, what's the difference between that and:
// import fs from 'fs/promises';

import fs from 'fs';

export const dirExists = async (path: fs.PathLike): Promise<boolean> => {
    try {
        await fs.promises.access(path, fs.constants.F_OK);
    } catch (err) {
        return false;
    }

    const stats = await fs.promises.stat(path);

    return stats.isDirectory();
};

export const makeDir = async (path: fs.PathLike): Promise<void> => {
    await fs.promises.mkdir(path, { recursive: true });
};

export const fileExists = async (path: fs.PathLike): Promise<boolean> => {
    try {
        await fs.promises.access(path, fs.constants.F_OK);
    } catch (err) {
        return false;
    }

    return true;
};

export const getFileText = async (path: fs.PathLike): Promise<string> => {
    return fs.promises.readFile(path, 'utf-8');
};

export const putFileText = async (file: fs.PathLike, contents: string): Promise<void> => {
    return fs.promises.writeFile(contents, contents, 'utf-8');
};
