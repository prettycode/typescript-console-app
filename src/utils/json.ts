export const jsonSerialize = <T>(data: T): string => JSON.stringify(data, null, 4);
export const jsonDeserialize = <T>(data: string): T => JSON.parse(data);
