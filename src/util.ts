import { Player } from './constants';

/**
 * Generates all columns from a 2D array
 *
 * @param {Player[][]} arr The array to generate from
 * @returns {Player[][]} The columns of the array
 */
export const getColumns = (arr: Player[][]): Player[][] => {
  const width = arr[0].length;

  const cols = new Array(width).fill(0).map((_, i) => arr.map(row => row[i]));

  return cols;
};

/**
 * Generates diagonals from a 2D array
 *
 * @param {Player[][]} arr The array to generate from
 * @param {boolean} bottomToTop If true, generates diagonals bottom to top. If
 *                              false, generates diagonals top to bottom.
 * @returns {Player[][]} The diagonals from the array
 */
export const getDiagonals = (arr: Player[][], bottomToTop = false): Player[][] => {
  const height = arr.length;
  const width = arr[0].length;
  const maxSize = Math.max(width, height);
  const output = [];

  for (let k = 0; k <= 2 * (maxSize - 1); k += 1) {
    const temp = [];
    for (let y = height - 1; y >= 0; y -= 1) {
      const x = k - (bottomToTop ? height - y : y);
      if (x >= 0 && x < width) {
        temp.push(arr[y][x]);
      }
    }
    if (temp.length > 0) {
      output.push(temp);
    }
  }

  return output;
};

/**
 * Generates all lines in a 2D array
 *
 * @param {Player[][]} arr The array to generate from
 * @returns {Player[][]} The lines in the array
 */
export const getLines = (arr: Player[][]): Player[][] => [
  ...arr,
  ...getColumns(arr),
  ...getDiagonals(arr),
  ...getDiagonals(arr, true)
];
