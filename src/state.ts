import Move from './move';
import {
  P1,
  P2,
  EMPTY,
  TIE
} from './constants';
import { getLines } from './util';

interface StateConstructor {
  kToWin: number;
  turn: number;
  board: Array<Array<number | null>>;
}

interface StateInitializer {
  kToWin: number;
  turn: number;
  cells: Array<number | null>;
  width: number;
  height: number;
}

class State {
  kToWin: number;

  turn: number;

  board: Array<Array<number | null>>;

  constructor({ kToWin, turn, board }: StateConstructor) {
    this.kToWin = kToWin;
    this.turn = turn;
    this.board = board;
  }

  static fromParams({
    kToWin,
    turn,
    cells,
    width,
    height
  }: StateInitializer): State {
    const board = new Array(height)
      .fill(0)
      .map(
        (_row, y) => new Array(width).fill(0).map((_cell, x) => cells[y * width + x])
      );

    return new State({ kToWin, turn, board });
  }

  get width(): number {
    return this.board[0].length;
  }

  get height(): number {
    return this.board.length;
  }

  get children(): Array<Move> {
    const output: Array<Move> = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === EMPTY) {
          const clone = this.clone();
          clone.advanceTurn();
          clone.board[i][j] = this.turn;

          const newCell = i * this.width + j;

          output.push(new Move(newCell, clone));
        }
      });
    });

    return output;
  }

  get value(): number {
    let value = 0;

    for (const line of getLines(this.board)) {
      for (let i = 0; i < line.length - this.kToWin + 1; i += 1) {
        const segment = line.slice(i, i + this.kToWin);
        const values = new Set(segment);

        if (values.size === 1) {
          if (values.has(P1)) {
            return Infinity;
          }

          if (values.has(P2)) {
            return -Infinity;
          }
        }

        if (values.size === 2 && values.has(EMPTY)) {
          const count = segment.reduce(
            (m: number, v: number | null) => m + (v !== EMPTY ? 1 : 0),
            0
          );

          if (values.has(P1)) {
            value += 10 ** (count - 4);
          }

          if (values.has(P2)) {
            value -= 10 ** (count - 4);
          }
        }
      }
    }

    return value;
  }

  get winner(): number | null {
    if (!this.board.some(row => row.some(cell => cell === EMPTY))) {
      return TIE;
    }

    if (this.value === Infinity) {
      return P1;
    }

    if (this.value === -Infinity) {
      return P2;
    }

    return null;
  }

  advanceTurn(): void {
    this.turn = (this.turn + 1) % 2;
  }

  clone(): State {
    return new State({
      kToWin: this.kToWin,
      turn: this.turn,
      board: JSON.parse(JSON.stringify(this.board))
    });
  }
}

export default State;
