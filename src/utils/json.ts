export const serialize = <T>(data: T): string => JSON.stringify(data, null, 4);
export const deserialize = <T>(data: string): T => JSON.parse(data);
