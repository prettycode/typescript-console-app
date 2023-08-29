/**
 * Convert an array of objects to a CSV string. For example:
 *
 * const people = [{ ...male, name: 'Chris' }, { ...female, name: 'Kayti' }];
 * const peopleCsv = csv(people); // "gender","name"\n"male","Chris"\n"female","Kayti"
 */

export const csv = (array: Array<Record<string, string | number | boolean | undefined | object>>): string =>
    !array.length
        ? ''
        : [
              `"${Object.keys(array[0] || {}).join('","')}"`,
              ...array.map(
                  (item) =>
                      `"${Object.values(item)
                          .map((item) => item?.toString().replace(/"/g, '""'))
                          .join('","')}"`
              )
          ].join('\n');
