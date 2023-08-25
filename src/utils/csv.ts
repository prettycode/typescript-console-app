export const csv = (array: Array<Record<string, string | number | boolean | undefined | object>>): string =>
    [
        Object.keys(array[0] || {}),
        ...array.map(
            (item) =>
                '"' +
                Object.values(item)
                    .map((item) => item?.toString().replace(/"/g, "'"))
                    .join('","') +
                '"'
        )
    ].join('\n');
