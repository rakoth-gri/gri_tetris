const $FIELD = document.querySelector(".field"),
  $START = document.querySelector(".controls__start"),
  $PAUSE = document.querySelector(".controls__pause"),
  $RESET = document.querySelector(".controls__reset"),
  $SCORE = document.querySelector(".controls__score"),
  $COLOR = document.querySelector(".controls__color"),
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
  FIGURES = [S_SHAPE, Z_SHAPE, T_SHAPE, O_SHAPE, L_SHAPE, J_SHAPE, I_SHAPE],
  SPEED_LIST = [
    {
      text: "LEVEL1",
      value: 1000,
    },
    {
      text: "LEVEL2",
      value: 900,
    },
    {
      text: "LEVEL3",
      value: 800,
    },
    {
      text: "LEVEL4",
      value: 700,
    },
    {
      text: "LEVEL5",
      value: 600,
    },
    {
      text: "LEVEL6",
      value: 500,
    },
    {
      text: "LEVEL7",
      value: 400,
    },
    {
      text: "LEVEL8",
      value: 300,
    },
    {
      text: "LEVEL9",
      value: 200,
    },
    {
      text: "LEVEL10",
      value: 100,
    },
  ];

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
  $COLOR,
  SPEED_LIST
};
