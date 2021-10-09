import { Player } from './constants';
import AsyncQueue from './async/queue';
import State from './state';
import Move from './move';

class Timeout extends Error {}

type ABSearchResult = {
  value: number,
  winner: Player
};

/**
 * Runs minimax with alpha/beta pruning
 *
 * @param {Move} node The current node
 * @param {number} depth The depth left to search
 * @param {boolean} isMaximizing True if the current player is maximizing
 * @param {AsyncQueue} queue The async queue to throw new calls onto
 * @param {number} initialAlpha The value of alpha going into this call
 * @param {number} initialBeta The value of beta going into this call
 * @returns {ABSearchResult} The result of the search
 */
const alphabeta = async (
  node: Move,
  depth: number,
  isMaximizing: boolean,
  queue: AsyncQueue<ABSearchResult>,
  initialAlpha = -Infinity,
  initialBeta = Infinity
): Promise<ABSearchResult> => {
  if (depth === 0 || node.state.winner !== Player.EMPTY) {
    return {
      value: node.state.value * (depth + 1),
      winner: node.state.winner
    };
  }

  // eslint-disable-next-line prefer-const
  let [cmp, value] = isMaximizing ? [Math.max, -Infinity] : [Math.min, Infinity];
  let alpha = initialAlpha;
  let beta = initialBeta;

  for (const child of node.state.children) {
    const currentAlpha = alpha;
    const currentBeta = beta;

    // eslint-disable-next-line no-await-in-loop
    const { value: newValue } = await queue.push(() => alphabeta(
      child,
      depth - 1,
      !isMaximizing,
      queue,
      currentAlpha,
      currentBeta
    ));
    value = cmp(value, newValue);

    if (isMaximizing) {
      alpha = Math.max(alpha, value);
    } else {
      beta = Math.min(beta, value);
    }

    if (alpha >= beta) {
      break;
    }
  }

  return { value, winner: Player.EMPTY };
};

/**
 * Finds the best move in a given state
 *
 * @param {State} state The state to evaluate from
 * @param {number} timeLimit The time, in milliseconds, this function has to
 *                           evaluate
 * @returns {number} The index of the board to move to
 */
const findMove = async (state: State, timeLimit = 2000): Promise<number> => {
  const queue = new AsyncQueue<ABSearchResult>();
  const isMaximizing = state.turn === Player.P1;
  const cmp = isMaximizing ? Math.max : Math.min;
  let bestCell : number | null = null;
  let timeoutReached = false;

  const timeout = setTimeout(() => {
    queue.clear(new Timeout());
    timeoutReached = true;
  }, timeLimit - 100);

  for (let depth = 1; !timeoutReached; depth += 1) {
    let bestMove: Move | null = null;
    let bestValue: number | null = null;
    let childrenPossible = false;

    for (const move of state.children) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const { winner, value } = await queue.push(() => alphabeta(
          move,
          depth,
          !isMaximizing,
          queue
        ));

        if (bestValue === null || cmp(bestValue, value) !== bestValue) {
          bestMove = move;
          bestValue = value;
        }

        if (winner === Player.EMPTY) {
          childrenPossible = true;
        }
      } catch (e) {
        if (e instanceof Timeout) {
          break;
        }
      }
    }

    queue.clear();

    if (bestMove && (bestCell === null || !timeoutReached)) {
      bestCell = bestMove.cell;
    }

    if (
      !childrenPossible
      || (isMaximizing && bestValue === Infinity)
      || (!isMaximizing && bestValue === -Infinity)
    ) {
      break;
    }
  }

  clearTimeout(timeout);
  return bestCell === null ? 0 : bestCell;
};

export default findMove;
