export const csv = (array: Array<Record<string, string | number | boolean | undefined | object>>): string =>
    [
        Object.keys(array[0] || {}),
        ...array.map(
            (item) =>
                '"' +
                Object.values(item)
                    // '\x27' is the hex code for the single quote character
                    .map((item) => item?.toString().replace(/"/g, '\x27'))
                    .join('","') +
                '"'
        )
    ].join('\n');
