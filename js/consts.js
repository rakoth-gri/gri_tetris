const $FIELD = document.querySelector(".field"),
  $START = document.querySelector(".controls__start"),
  $PAUSE = document.querySelector(".controls__pause"),
  $RESET = document.querySelector(".controls__reset"),
  $SCORE = document.querySelector(".controls__score"),
  $NOTE = document.querySelector(".note"),
  // длина ряда в клетках!
  ROW = 10,
  KEY_LIST = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"], 
  // Все фигуры будут принимать 4 положения вращения по часовой!
  I_SHAPE = [
    [2, 2 + ROW, 2 + 2 * ROW, 2 + 3 * ROW],
    [0, 1, 2, 3],
    [2, 2 + ROW, 2 + 2 * ROW, 2 + 3 * ROW],
    [0, 1, 2, 3],
  ],
  J_SHAPE = [
    [2, 2 + ROW, 2 + 2 * ROW, 1 + 2 * ROW],
    [0 + ROW, 0 + 2 * ROW, 1 + 2 * ROW, 2 + 2 * ROW],
    [0 + 2 * ROW, 0 + ROW, 0, 1],
    [0, 1, 2, 2 + ROW],
  ],
  L_SHAPE = [
    [0, 0 + ROW, 0 + 2 * ROW, 1 + 2 * ROW],
    [0 + ROW, 0, 1, 2],
    [1, 2, 2 + ROW, 2 + 2 * ROW],
    [2 + ROW, 2 + 2 * ROW, 1 + 2 * ROW, 0 + 2 * ROW],
  ],
  O_SHAPE = [
    [0, 1, 0 + ROW, 1 + ROW],
    [0, 1, 0 + ROW, 1 + ROW],
    [0, 1, 0 + ROW, 1 + ROW],
    [0, 1, 0 + ROW, 1 + ROW],
  ],
  T_SHAPE = [
    [0 + ROW, 1, 1 + ROW, 2 + ROW],
    [0, 0 + ROW, 0 + 2 * ROW, 1 + ROW],
    [0, 1, 2, 1 + ROW],
    [2, 2 + ROW, 2 + 2 * ROW, 1 + ROW],
  ],
  Z_SHAPE = [
    [0, 1, 1 + ROW, 2 + ROW],
    [1, 1 + ROW, 0 + ROW, 0 + 2 * ROW],
    [0, 1, 1 + ROW, 2 + ROW],
    [1, 1 + ROW, 0 + ROW, 0 + 2 * ROW],
  ],
  S_SHAPE = [
    [0 + ROW, 1, 1 + ROW, 2],
    [0, 0 + ROW, 1 + ROW, 1 + 2 * ROW],
    [0 + ROW, 1, 1 + ROW, 2],
    [0, 0 + ROW, 1 + ROW, 1 + 2 * ROW],
  ],
  FIGURES = [S_SHAPE, Z_SHAPE, T_SHAPE, O_SHAPE, L_SHAPE, J_SHAPE, I_SHAPE];

export {  
  ROW,
  KEY_LIST,
  $FIELD,
  $START,
  $PAUSE,
  $RESET,
  FIGURES,
  $SCORE,
  $NOTE,  
};
