import { hashCode } from '../utils/hash';
import fs from 'fs';

const CACHE_PATH = './.cache';

const memoryCache: Record<string, string> = {};
const filenameAndCacheKey = (urlPath: string): string =>
    `./${CACHE_PATH}/${safeFilename(urlPath)}.${hashCode(urlPath)}.json`;

if (!fs.existsSync(CACHE_PATH)) {
    fs.mkdirSync(CACHE_PATH);
}

export class FileCache {
    public static async get<TReturn>(key: string): Promise<TReturn | undefined> {
        const cacheKey = filenameAndCacheKey(key);
        let cacheContents: string | undefined = memoryCache[cacheKey];

        if (!cacheContents) {
            const cacheEntryExists = fs.existsSync(cacheKey);

            if (!cacheEntryExists) {
                return undefined;
            }

            memoryCache[cacheKey] = cacheContents = await fs.promises.readFile(cacheKey, 'utf-8');
        }

        return JSON.parse(cacheContents) as TReturn;
    }

    public static async set<T>(key: string, value: T): Promise<void> {
        const cacheKey = filenameAndCacheKey(key);
        const cacheContents = JSON.stringify(value, null, '    ');

        await fs.promises.writeFile(cacheKey, cacheContents, 'utf-8');
    }
}
