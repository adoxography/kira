import State from '../src/state';
import Move from '../src/move';
import {
  P1,
  P2,
  EMPTY,
  TIE
} from '../src/constants';

test('state can be generated from parameters', () => {
  const state = State.fromParams({
    width: 4,
    height: 3,
    cells: [P1, EMPTY, P1, P1, P2, P1, P2, EMPTY, EMPTY, P2, EMPTY, P2],
    kToWin: 3,
    turn: P1
  });

  expect(state.kToWin).toBe(3);
  expect(state.turn).toBe(P1);
  expect(state.board).toEqual([
    [P1, EMPTY, P1, P1],
    [P2, P1, P2, EMPTY],
    [EMPTY, P2, EMPTY, P2]
  ]);
});

test('state has a width', () => {
  const state = new State({
    turn: P1,
    kToWin: 3,
    board: [
      [P1, EMPTY, P1, P1],
      [P2, P1, P2, EMPTY],
      [EMPTY, P2, EMPTY, P2]
    ]
  });

  expect(state.width).toBe(4);
});

test('state has a height', () => {
  const state = new State({
    turn: P1,
    kToWin: 3,
    board: [
      [P1, EMPTY, P1, P1],
      [P2, P1, P2, EMPTY],
      [EMPTY, P2, EMPTY, P2]
    ]
  });

  expect(state.height).toBe(3);
});

test('state can be cloned', () => {
  const state = new State({
    board: [[P1, P2], [P2, P2]],
    kToWin: 3,
    turn: P1
  });

  const clone = state.clone();

  expect(clone.kToWin).toBe(3);
  expect(clone.turn).toBe(P1);
  expect(clone.board).toEqual([[P1, P2], [P2, P2]]);
  expect(clone).not.toBe(state);
});

test('cloning state deep clones its board', () => {
  const state = new State({
    turn: P1,
    kToWin: 3,
    board: [[P1, P2], [P2, P2]]
  });

  const clone = state.clone();

  state.board[0][0] = EMPTY;

  expect(clone.board[0][0]).toBe(P1);
});

test('state can advance its turn from P1 to P2', () => {
  const state = new State({ turn: P1, kToWin: 1, board: [] });

  state.advanceTurn();

  expect(state.turn).toBe(P2);
});

test('state can advance its turn from P2 to P1', () => {
  const state = new State({ turn: P2, kToWin: 1, board: [] });

  state.advanceTurn();

  expect(state.turn).toBe(P1);
});

test('states can check for equality', () => {
  const state1 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 3,
    turn: P2
  });

  const state2 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 3,
    turn: P2
  });

  expect(state1).toEqual(state2);
});

test('states are unequal if their turns differ', () => {
  const state1 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 3,
    turn: P2
  });

  const state2 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 3,
    turn: P1
  });

  expect(state1).not.toEqual(state2);
});

test('states are unequal if their Ks differ', () => {
  const state1 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 3,
    turn: P2
  });

  const state2 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 4,
    turn: P2
  });

  expect(state1).not.toEqual(state2);
});

test('states are unequal if their boards differ', () => {
  const state1 = new State({
    board: [[P1, P2], [P2, P2]],
    kToWin: 3,
    turn: P2
  });

  const state2 = new State({
    board: [[P1, P2], [P2, P1]],
    kToWin: 3,
    turn: P2
  });

  expect(state1).not.toEqual(state2);
});

test('states can generate children', () => {
  const state = new State({
    board: [[P1, EMPTY, P1], [P2, P1, P2], [EMPTY, P2, EMPTY]],
    kToWin: 3,
    turn: P1
  });

  const target = [
    new Move(1, new State({
      board: [
        [P1, P1, P1], [P2, P1, P2], [EMPTY, P2, EMPTY]
      ],
      kToWin: 3,
      turn: P2
    })),
    new Move(6, new State({
      board: [
        [P1, EMPTY, P1], [P2, P1, P2], [P1, P2, EMPTY]
      ],
      kToWin: 3,
      turn: P2
    })),
    new Move(8, new State({
      board: [
        [P1, EMPTY, P1], [P2, P1, P2], [EMPTY, P2, P1]
      ],
      kToWin: 3,
      turn: P2
    }))
  ];

  expect(state.children).toEqual(target);
});

test.each([
  [
    new State({
      board: [[P1, P1, P1], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]],
      kToWin: 3,
      turn: P1
    }),
    Infinity
  ],
  [
    new State({
      board: [[P2, P2, P2], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]],
      kToWin: 3,
      turn: P1
    }),
    -Infinity
  ],
  [
    new State({
      board: [[P2, P2, P1], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]],
      kToWin: 3,
      turn: P1
    }),
    -0.001
  ],
  [
    new State({
      board: [[P2, P2, 0], [EMPTY, P1, EMPTY], [EMPTY, EMPTY, EMPTY]],
      kToWin: 3,
      turn: P1
    }),
    0.011
  ],
  [
    new State({
      board: [
        [P1, P1, EMPTY, P1],
        [P2, P1, EMPTY, EMPTY],
        [P2, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, P2, EMPTY]
      ],
      kToWin: 4,
      turn: P2
    }),
    0.119
  ],
  [
    new State({
      board: ([
        [P1, P1, EMPTY, P1],
        [P2, P1, EMPTY, P2],
        [P2, EMPTY, EMPTY, EMPTY]
      ]),
      kToWin: 4,
      turn: P2
    }),
    0.099
  ],
  [
    new State({
      board: ([[P1, P1, P2], [P2, P1, P1], [P1, P2, P2]]),
      kToWin: 3,
      turn: P1
    }),
    0
  ]
])('states have values', (state, expectedValue) => {
  expect(state.value).toBe(expectedValue);
});

test.each([
  [
    [[EMPTY, EMPTY, EMPTY], [P1, P1, P1], [EMPTY, EMPTY, EMPTY]],
    3,
    P1
  ],
  [
    [[EMPTY, EMPTY, EMPTY], [P2, P2, P2], [EMPTY, EMPTY, EMPTY]],
    3,
    P2
  ],
  [
    [[EMPTY, EMPTY, EMPTY], [P1, P1, P2], [EMPTY, EMPTY, EMPTY]],
    2,
    P1
  ],
  [
    [[EMPTY, EMPTY, EMPTY], [P1, P1, P2], [EMPTY, EMPTY, EMPTY]],
    3,
    null
  ],
  [
    [[EMPTY, P1, EMPTY], [EMPTY, P1, EMPTY], [EMPTY, P1, EMPTY]],
    3,
    P1
  ],
  [
    [[EMPTY, P2, EMPTY], [EMPTY, P2, EMPTY], [EMPTY, P2, EMPTY]],
    3,
    P2
  ],
  [
    [[EMPTY, P1, EMPTY], [EMPTY, P1, EMPTY], [EMPTY, P2, EMPTY]],
    2,
    P1
  ],
  [
    [[EMPTY, P1, EMPTY], [EMPTY, P1, EMPTY], [EMPTY, P2, EMPTY]],
    3,
    null
  ],
  [
    [[P1, EMPTY, EMPTY], [EMPTY, P1, EMPTY], [EMPTY, EMPTY, P1]],
    3,
    P1
  ],
  [
    [[P2, EMPTY, EMPTY], [EMPTY, P2, EMPTY], [EMPTY, EMPTY, P2]],
    3,
    P2
  ],
  [
    [[P1, EMPTY, EMPTY], [EMPTY, P1, EMPTY], [EMPTY, EMPTY, P2]],
    2,
    P1
  ],
  [
    [[P1, EMPTY, EMPTY], [EMPTY, P1, EMPTY], [EMPTY, EMPTY, P2]],
    3,
    EMPTY
  ],
  [
    [[P1, P1, P2], [P2, P2, P1], [P1, P1, P2]],
    3,
    TIE
  ]
])('states find the winner', (board, kToWin, expected) => {
  const state = new State({ board, kToWin, turn: P1 });
  expect(state.winner).toBe(expected);
});
