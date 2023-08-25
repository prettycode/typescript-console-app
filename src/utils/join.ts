/**
 * Same as `Array.prototype.join(undefined)`, but adds a space character after the commas.
 */
export const join = (array: Array<string | number>): string => array.join(', ');
