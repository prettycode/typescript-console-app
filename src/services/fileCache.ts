import { hashCode } from '../utils/hash';
import { safeFilename } from '../utils/safeFilename';
import { deserialize as jsonDeserialize, serialize as jsonSerialize } from '../utils/json';
import { dirExists, fileExists, getFileText as getFileText, makeDir, putFileText } from '../utils/fs';

/**
 * Directory to put cache files in.
 */
let cachePathRoot = './.cache';

/**
 * Intermediary cache layer to reduce IO for `get` calls.
 */
const memoryCache: Record<string, string> = {};

/**
 * Get the filepath that a cache entry should be written to.
 */
const safeFilenameCacheKey = (key: string): string => `./${cachePathRoot}/${safeFilename(key)}.${hashCode(key)}.json`;

/**
 * Make sure we can read from/write to the cache directory before we actually try to. The function is invoked upon
 * module import, but can be invoked again later to change the cache directory.
 */
export const setCachePath = async (cachePath?: string): Promise<void> => {
    if (cachePath) {
        cachePathRoot = cachePath;
    }

    if (!(await dirExists(cachePathRoot))) {
        await makeDir(cachePathRoot);
    }
};

export const get = async <TReturn>(key: string): Promise<TReturn | undefined> => {
    const cacheKey = safeFilenameCacheKey(key);
    let cacheContents: string | undefined = memoryCache[cacheKey];

    if (!cacheContents) {
        const cacheEntryExists = await fileExists(cacheKey);

        if (!cacheEntryExists) {
            return undefined;
        }

        memoryCache[cacheKey] = cacheContents = await getFileText(cacheKey);
    }

    return jsonDeserialize(cacheContents);
};

export const put = async <T>(key: string, value: T): Promise<void> => {
    const cacheKey = safeFilenameCacheKey(key);
    const cacheContents = jsonSerialize(value);

    memoryCache[cacheKey] = cacheContents;
    await putFileText(cacheKey, cacheContents);
};

setCachePath();
