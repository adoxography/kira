import { getColumns, getDiagonals, getLines } from '../src/util';

test('getColumns', () => {
  const columns = getColumns([
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]);

  expect(columns).toEqual([
    [0, 1, 0, 1],
    [1, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [1, 0, 1, 1]
  ]);
});

test('getDiagonals top to bottom', () => {
  const diagonals = getDiagonals([
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]);

  expect(diagonals).toEqual([
    [0],
    [1, 1],
    [0, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [1, 1, 0],
    [1, 1],
    [1]
  ]);
});

test('getDiagonals bottom to top', () => {
  const diagonals = getDiagonals([
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ], true);

  expect(diagonals).toEqual([
    [1],
    [1, 0],
    [1, 0, 1],
    [1, 1, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 0],
    [0, 0],
    [1]
  ]);
});

test('getLines', () => {
  const board = [
    [0, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ];

  const target = [
    [0, 1, 0, 0, 1], // rows
    [1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1], // cols
    [1, 1, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [1, 0, 1, 1],
    [0], // diagonals L-R
    [1, 1],
    [0, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [1, 1, 0],
    [1, 1],
    [1],
    [1], // diagonals R-L
    [1, 0],
    [1, 0, 1],
    [1, 1, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 0],
    [0, 0],
    [1]
  ];

  const lines = getLines(board);

  expect(lines).toEqual(target);
});
