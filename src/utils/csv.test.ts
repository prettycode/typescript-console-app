import { csv } from './csv';

describe('csv', () => {
    it('should return a correctly ordered and formatted CSV string', () => {
        const testData = [
            { name: 'Alice', age: 30, isEmployed: true },
            { name: 'Bob', age: 40, isEmployed: false },
            { name: 'Charlie', age: 50, isEmployed: true }
        ];

        const result = csv(testData);
        const expected = '"name","age","isEmployed"\n"Alice","30","true"\n"Bob","40","false"\n"Charlie","50","true"';

        expect(result).toBe(expected);
    });

    it('should escape quote characters in cell values by replacing them with two quote characters', () => {
        const testData = [
            { name: 'Alice', note: 'He said "hello".' },
            { name: 'Bob', note: 'She said "goodbye".' }
        ];

        const result = csv(testData);
        const expected = '"name","note"\n"Alice","He said ""hello""."\n"Bob","She said ""goodbye""."';

        expect(result).toBe(expected);
    });

    it('should return an empty string if the array is empty', () => {
        const testData: Array<Record<string, string | number | boolean | undefined | object>> = [];
        const result = csv(testData);
        const expected = '';

        expect(result).toBe(expected);
    });
});
