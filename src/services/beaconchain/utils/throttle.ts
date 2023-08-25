import { sleep } from '../../../utils/sleep';

export async function throttle<T>({ ms, sec }: { ms?: number; sec?: number }, promise: Promise<T>): Promise<T> {
    await sleep({ ms, sec });
    return promise;
}
