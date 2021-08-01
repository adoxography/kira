import State from '../src/state';
import findMove from '../src/ai';
import { Player } from '../src/constants';

test('it finds the winning move', async () => {
  // _ O _
  // X X _
  // _ O _

  const state = new State({
    board: [
      [Player.EMPTY, Player.P2, Player.EMPTY],
      [Player.P1, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY]
    ],
    kToWin: 3,
    turn: Player.P1
  });

  expect(await findMove(state)).toBe(5);
});

test('it blocks winning moves', async () => {
  // X O _
  // X _ _
  // O _ X

  const state = new State({
    board: [
      [Player.P1, Player.P2, Player.EMPTY],
      [Player.P1, Player.EMPTY, Player.EMPTY],
      [Player.P2, Player.EMPTY, Player.P1]
    ],
    kToWin: 3,
    turn: Player.P2
  });

  expect(await findMove(state)).toBe(4);
});

test('it finds the only move', async () => {
  // X O _
  // X O O
  // O X X

  const state = new State({
    board: [
      [Player.P1, Player.P2, Player.EMPTY],
      [Player.P1, Player.P2, Player.P2],
      [Player.P2, Player.P1, Player.P1]
    ],
    kToWin: 3,
    turn: Player.P1
  });

  expect(await findMove(state)).toBe(2);
});

test('it finds the winning move in advance', async () => {
  // O _ _
  // _ X O
  // _ _ X

  const state = new State({
    board: [
      [Player.P2, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.P2],
      [Player.EMPTY, Player.EMPTY, Player.P1]
    ],
    kToWin: 3,
    turn: Player.P1
  });

  expect(await findMove(state)).toBe(6);
});

test('it times out gracefully', async () => {
  const state = new State({
    board: [
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY]
    ],
    kToWin: 4,
    turn: Player.P1
  });

  const startTime = Date.now();

  const move = await findMove(state, 3000);

  expect(Date.now()).toBeLessThan(startTime + 3000);
  expect(move).toBe(0);
});
