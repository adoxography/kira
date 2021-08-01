import State from '../src/state';
import Move from '../src/move';
import { Player, TIE } from '../src/constants';

test('state can be generated from parameters', () => {
  const state = State.fromParams({
    width: 4,
    height: 3,
    cells: [0, null, 0, 0, 1, 0, 1, null, null, 1, null, 1],
    kToWin: 3,
    turn: Player.P1
  });

  expect(state.kToWin).toBe(3);
  expect(state.turn).toBe(Player.P1);
  expect(state.board).toEqual([
    [Player.P1, Player.EMPTY, Player.P1, Player.P1],
    [Player.P2, Player.P1, Player.P2, Player.EMPTY],
    [Player.EMPTY, Player.P2, Player.EMPTY, Player.P2]
  ]);
});

test('state has a width', () => {
  const state = new State({
    turn: Player.P1,
    kToWin: 3,
    board: [
      [Player.P1, Player.EMPTY, Player.P1, Player.P1],
      [Player.P2, Player.P1, Player.P2, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY, Player.P2]
    ]
  });

  expect(state.width).toBe(4);
});

test('state has a height', () => {
  const state = new State({
    turn: Player.P1,
    kToWin: 3,
    board: [
      [Player.P1, Player.EMPTY, Player.P1, Player.P1],
      [Player.P2, Player.P1, Player.P2, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY, Player.P2]
    ]
  });

  expect(state.height).toBe(3);
});

test('state can be cloned', () => {
  const state = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P2]],
    kToWin: 3,
    turn: Player.P1
  });

  const clone = state.clone();

  expect(clone.kToWin).toBe(3);
  expect(clone.turn).toBe(Player.P1);
  expect(clone.board).toEqual([[Player.P1, Player.P2], [Player.P2, Player.P2]]);
  expect(clone).not.toBe(state);
});

test('cloning state deep clones its board', () => {
  const state = new State({
    turn: Player.P1,
    kToWin: 3,
    board: [[Player.P1, Player.P2], [Player.P2, Player.P2]]
  });

  const clone = state.clone();

  state.board[0][0] = Player.EMPTY;

  expect(clone.board[0][0]).toBe(Player.P1);
});

test('state can advance its turn from Player.P1 to Player.P2', () => {
  const state = new State({ turn: Player.P1, kToWin: 1, board: [] });

  state.advanceTurn();

  expect(state.turn).toBe(Player.P2);
});

test('state can advance its turn from Player.P2 to Player.P1', () => {
  const state = new State({ turn: Player.P2, kToWin: 1, board: [] });

  state.advanceTurn();

  expect(state.turn).toBe(Player.P1);
});

test('states can check for equality', () => {
  const state1 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 3,
    turn: Player.P2
  });

  const state2 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 3,
    turn: Player.P2
  });

  expect(state1).toEqual(state2);
});

test('states are unequal if their turns differ', () => {
  const state1 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 3,
    turn: Player.P2
  });

  const state2 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 3,
    turn: Player.P1
  });

  expect(state1).not.toEqual(state2);
});

test('states are unequal if their Ks differ', () => {
  const state1 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 3,
    turn: Player.P2
  });

  const state2 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 4,
    turn: Player.P2
  });

  expect(state1).not.toEqual(state2);
});

test('states are unequal if their boards differ', () => {
  const state1 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P2]],
    kToWin: 3,
    turn: Player.P2
  });

  const state2 = new State({
    board: [[Player.P1, Player.P2], [Player.P2, Player.P1]],
    kToWin: 3,
    turn: Player.P2
  });

  expect(state1).not.toEqual(state2);
});

test('states can generate children', () => {
  const state = new State({
    board: [
      [Player.P1, Player.EMPTY, Player.P1],
      [Player.P2, Player.P1, Player.P2],
      [Player.EMPTY, Player.P2, Player.EMPTY]
    ],
    kToWin: 3,
    turn: Player.P1
  });

  const target = [
    new Move(1, new State({
      board: [
        [Player.P1, Player.P1, Player.P1],
        [Player.P2, Player.P1, Player.P2],
        [Player.EMPTY, Player.P2, Player.EMPTY]
      ],
      kToWin: 3,
      turn: Player.P2
    })),
    new Move(6, new State({
      board: [
        [Player.P1, Player.EMPTY, Player.P1],
        [Player.P2, Player.P1, Player.P2],
        [Player.P1, Player.P2, Player.EMPTY]
      ],
      kToWin: 3,
      turn: Player.P2
    })),
    new Move(8, new State({
      board: [
        [Player.P1, Player.EMPTY, Player.P1],
        [Player.P2, Player.P1, Player.P2],
        [Player.EMPTY, Player.P2, Player.P1]
      ],
      kToWin: 3,
      turn: Player.P2
    }))
  ];

  expect(state.children).toEqual(target);
});

test.each([
  [
    new State({
      board: [
        [Player.P1, Player.P1, Player.P1],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY]
      ],
      kToWin: 3,
      turn: Player.P1
    }),
    Infinity
  ],
  [
    new State({
      board: [
        [Player.P2, Player.P2, Player.P2],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY]
      ],
      kToWin: 3,
      turn: Player.P1
    }),
    -Infinity
  ],
  [
    new State({
      board: [
        [Player.P2, Player.P2, Player.P1],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY]
      ],
      kToWin: 3,
      turn: Player.P1
    }),
    -0.001
  ],
  [
    new State({
      board: [
        [Player.P2, Player.P2, 0],
        [Player.EMPTY, Player.P1, Player.EMPTY],
        [Player.EMPTY, Player.EMPTY, Player.EMPTY]
      ],
      kToWin: 3,
      turn: Player.P1
    }),
    0.011
  ],
  [
    new State({
      board: [
        [Player.P1, Player.P1, Player.EMPTY, Player.P1],
        [Player.P2, Player.P1, Player.EMPTY, Player.EMPTY],
        [Player.P2, Player.EMPTY, Player.EMPTY, Player.EMPTY],
        [Player.EMPTY, Player.EMPTY, Player.P2, Player.EMPTY]
      ],
      kToWin: 4,
      turn: Player.P2
    }),
    0.119
  ],
  [
    new State({
      board: ([
        [Player.P1, Player.P1, Player.EMPTY, Player.P1],
        [Player.P2, Player.P1, Player.EMPTY, Player.P2],
        [Player.P2, Player.EMPTY, Player.EMPTY, Player.EMPTY]
      ]),
      kToWin: 4,
      turn: Player.P2
    }),
    0.099
  ],
  [
    new State({
      board: ([
        [Player.P1, Player.P1, Player.P2],
        [Player.P2, Player.P1, Player.P1],
        [Player.P1, Player.P2, Player.P2]
      ]),
      kToWin: 3,
      turn: Player.P1
    }),
    0
  ]
])('states have values', (state, expectedValue) => {
  expect(state.value).toBe(expectedValue);
});

test.each([
  [
    [
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.P1, Player.P1, Player.P1],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY]
    ],
    3,
    Player.P1
  ],
  [
    [
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.P2, Player.P2, Player.P2],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY]
    ],
    3,
    Player.P2
  ],
  [
    [
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.P1, Player.P1, Player.P2],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY]
    ],
    2,
    Player.P1
  ],
  [
    [
      [Player.EMPTY, Player.EMPTY, Player.EMPTY],
      [Player.P1, Player.P1, Player.P2],
      [Player.EMPTY, Player.EMPTY, Player.EMPTY]
    ],
    3,
    Player.EMPTY
  ],
  [
    [
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY]
    ],
    3,
    Player.P1
  ],
  [
    [
      [Player.EMPTY, Player.P2, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY]
    ],
    3,
    Player.P2
  ],
  [
    [
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY]
    ],
    2,
    Player.P1
  ],
  [
    [
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY]
    ],
    3,
    Player.EMPTY
  ],
  [
    [
      [Player.P1, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.P1]
    ],
    3,
    Player.P1
  ],
  [
    [
      [Player.P2, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.P2, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.P2]
    ],
    3,
    Player.P2
  ],
  [
    [
      [Player.P1, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.P2]
    ],
    2,
    Player.P1
  ],
  [
    [
      [Player.P1, Player.EMPTY, Player.EMPTY],
      [Player.EMPTY, Player.P1, Player.EMPTY],
      [Player.EMPTY, Player.EMPTY, Player.P2]
    ],
    3,
    Player.EMPTY
  ],
  [
    [
      [Player.P1, Player.P1, Player.P2],
      [Player.P2, Player.P2, Player.P1],
      [Player.P1, Player.P1, Player.P2]
    ],
    3,
    TIE
  ]
])('states find the winner', (board, kToWin, expected) => {
  const state = new State({ board, kToWin, turn: Player.P1 });
  expect(state.winner).toBe(expected);
});
