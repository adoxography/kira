import type State from './state';

class Move {
  cell: number;

  state: State;

  constructor(cell: number, state: State) {
    this.cell = cell;
    this.state = state;
  }
}

export default Move;
