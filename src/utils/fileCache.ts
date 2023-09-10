import path from 'path';
import { hashCode } from './hash';
import { safeFilename } from './safeFilename';
import { jsonDeserialize, jsonSerialize } from './json';
import { dirExists, fileExists, getFileText, makeDir, putFileText } from './fs';

/**
 * Directory to put cache files in.
 */
let cachePathRoot = './.cache';

/**
 * Intermediary cache layer to reduce IO for `get` calls.
 */
const memoryCache: Record<string, string> = {};

/**
 * Get the filepath that a cache entry should be written to. Make sure to includ a hash of `key` since
 * `safeFilename(key)` can return the same value if two different keys are sanitized to the same value.
 */
const safeFilenameCacheKey = (key: string): string =>
    path.join(cachePathRoot, `${safeFilename(key)}.${hashCode(key)}.json`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (skipLogInfo: boolean, ...args: Array<any>): void => {
    if (skipLogInfo) {
        return;
    }

    console.info(...args);
};

/**
 * Make sure we can read from/write to the cache directory before we actually try to. The function is invoked upon
 * module import, but can be invoked again later to change the cache directory. Note that if/when the cache path is
 * changed, the existing cached files are not moved to the new path.
 */
export const setFileCachePath = async (cachePath?: string): Promise<void> => {
    if (cachePath) {
        cachePathRoot = cachePath;
    }

    if (!(await dirExists(cachePathRoot))) {
        await makeDir(cachePathRoot);
    }
};

export const fileCacheGet = async <TReturn>(key: string, skipLogInfo: boolean = true): Promise<TReturn | undefined> => {
    const cacheKey = safeFilenameCacheKey(key);
    let memoryCacheEntry: string | undefined = memoryCache[cacheKey];

    if (!memoryCacheEntry) {
        log(skipLogInfo, `${fileCacheGet.name}: Not in memory cache: '${key}'`);

        const diskCacheEntryExists = await fileExists(cacheKey);

        if (!diskCacheEntryExists) {
            log(skipLogInfo, `${fileCacheGet.name}: Not in disk cache: '${key}'`);
            return undefined;
        }

        log(skipLogInfo, `${fileCacheGet.name}: Found in disk cache: '${key}'\nPutting in memory cache: '${key}'`);
        memoryCache[cacheKey] = memoryCacheEntry = await getFileText(cacheKey);
    } else {
        log(skipLogInfo, `${fileCacheGet.name}: Found in disk memory cache: '${key}'`);
    }

    return jsonDeserialize(memoryCacheEntry);
};

export const fileCachePut = async <T>(key: string, value: T, skipLogInfo: boolean = true): Promise<void> => {
    const cacheKey = safeFilenameCacheKey(key);
    const cacheContents = jsonSerialize(value);

    log(skipLogInfo, `${fileCachePut.name}: Writing to memory and disk caches: '${key}'`);
    memoryCache[cacheKey] = cacheContents;
    await putFileText(cacheKey, cacheContents);
};

setFileCachePath();
