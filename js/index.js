import {
  randomIndex,
  showMess,
  cellsAction,
  getCurrCoords,
  isGameOver,
  isBottomRow,
  showScore,
  debounce,
  changeLevel,
} from "./services.js";
import {
  FIGURES,
  ROW,
  KEY_LIST,
  $FIELD,
  $START,
  $SCORE,
  $NOTE,
  $COLOR,
  $RESET,
  SPEED_LIST,
} from "./consts.js";

// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ:
let currFieldPosition = 4,
  intervalId,
  figureRotation = 0,
  figure = FIGURES[randomIndex(FIGURES)],
  score = 0,
  level = 0,
  speed = SPEED_LIST[level].value,
  gameOver = true,
  figureColor = "var(--app-danger-color)",
  $CELLS;

// Отрисовываем поле 1 раз:
(() => {
  $FIELD.insertAdjacentHTML(
    "beforeend",
    new Array(210)
      .fill("")
      .map(
        (_, i) => `
            <div class="${
              i > 199 ? "field__cell bottom transparent" : "field__cell"
            }"></div>   
        `
      )
      .join("")
  );
  $CELLS = [...$FIELD.querySelectorAll(".field__cell")];
})();

document.querySelector(".controls").insertAdjacentHTML(
  "beforeend",
  `<select class="controls__speed" id="$SPEED_SELECT">
  ${SPEED_LIST.map(
    ({ text, value }) => `<option value="${value}"> ${text} </option>`
  ).join("")}
</select>`
);

// Показываем начальный счет
showScore($SCORE, score);

// Устанавливаем цвет заливки фигур по-умолчанию
$COLOR.setAttribute("value", "#a41f1f");

// Создаем новую функцию из декотора
const debouncedColor = debounce((color) => (figureColor = color), 500);

// Отрисовка фигуры
const draw = (coords) =>
  coords.forEach(
    (coord) => ($CELLS[coord].style.backgroundColor = figureColor)
  );

// Удаление фигуры
const unDraw = (coords) =>
  coords.forEach((coord) => $CELLS[coord].removeAttribute("style"));

function prepareForNextStep() {
  clearInterval(intervalId);
  intervalId = null;
  currFieldPosition = 4;
  // выбор произвольной фигуры -----
  figure = FIGURES[randomIndex(FIGURES)];
  figureRotation = 0;
}

function updateSomeStates() {
  // обновляем некоторые состояния ----
  prepareForNextStep();
  changeScore();

  // проверки
  level = changeLevel(score);
  console.log(" new Level: " + level);

  if (level === SPEED_LIST.length) {
    gameOver = true;
    cellsAction($CELLS.slice(0, 200), (cell) =>
      cell.classList.remove("bottom")
    );
    $CELLS.forEach(($cell, i) => {
      setTimeout(() => $cell.removeAttribute("style"), i * 10);
    });
    showMess("CONGRATULATION, YOU ARE WINNER...", $NOTE);
    return;
  }
  speed = SPEED_LIST[level].value;
  $SPEED_SELECT.value = speed;

  start(speed);
}

function reset() {
  prepareForNextStep();
  gameOver = true;
  score = 0;
  cellsAction($CELLS.slice(0, 200), (cell) => cell.classList.remove("bottom"));
  showMess("YOU LOSS", $NOTE);
  $CELLS.forEach(($cell, i) => {
    setTimeout(() => $cell.removeAttribute("style"), i * 10);
  });
}

function changeScore() {
  let spliceCount = 0;

  for (let i = 0; i < 199; i += ROW) {
    const rowBeingChecked = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ].map((i) => $CELLS[i]);

    if (rowBeingChecked.every(($cell) => $cell.className.includes("bottom"))) {
      score += 10;
      showScore($SCORE, score);
      rowBeingChecked.forEach(($cell) => {
        $cell.classList.remove("bottom");
        $cell.removeAttribute("style");
      });
      let splicedRow = $CELLS.splice(i, ROW);
      $CELLS = splicedRow.concat($CELLS);
      spliceCount++;
    }
  }

  if (!spliceCount) return;

  $FIELD.innerHTML = "";
  $FIELD.append(...$CELLS);

  $CELLS = [...$FIELD.querySelectorAll(".field__cell")];
}

function start(speed) {
  draw(getCurrCoords(figure, figureRotation, currFieldPosition));
  // Проверка на GameOver --------------
  if (
    isGameOver(
      getCurrCoords(figure, figureRotation, currFieldPosition),
      $CELLS,
      ROW,
      reset
    )
  )
    return;

  intervalId = setInterval(() => {
    // Удаляем фигуру на текущих координатах
    unDraw(getCurrCoords(figure, figureRotation, currFieldPosition));

    currFieldPosition += ROW;

    let currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

    // Отрисовываем фигуру на текущих координатах:
    draw(currCoords);

    // Проверка условий остановки фигуры
    isBottomRow(currCoords, $CELLS, ROW, updateSomeStates);
  }, speed);
}

// КОНТРОЛЛЕР КЛАВИАТУРЫ *******************************************
function handler(e) {
  e.preventDefault();
  // проверки нажатой клавиши и флага gameOver
  if (KEY_LIST.indexOf(e.key) < 0) return;
  if (gameOver) return;

  let currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

  // Проверки достижения левой / правой границы поля
  if (currCoords.some((coord) => coord % 10 === 0) && e.key === "ArrowLeft")
    return;
  if (
    currCoords.some((coord) => (coord + 1) % 10 === 0) &&
    e.key === "ArrowRight"
  )
    return;

  unDraw(currCoords);

  switch (e.key) {
    case "ArrowUp":
      figureRotation++;
      break;
    case "ArrowDown":
      currFieldPosition += ROW;
      break;
    case "ArrowRight":
      currFieldPosition++;
      break;
    default:
      currFieldPosition--;
      break;
  }
  // Реализация бесконечного вращения....
  if (figureRotation >= figure.length) figureRotation = 0;
  if (figureRotation < 0) figureRotation = figure.length - 1;

  currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

  draw(currCoords);

  isBottomRow(currCoords, $CELLS, ROW, updateSomeStates);
}

// СЛУШАТЕЛИ **************************************************************

$START.addEventListener("click", function () {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  } else {
    gameOver = false;
    start(speed);
    showMess("GAME STARTED!", $NOTE);
  }
});

// $PAUSE.addEventListener("click", pause);

$RESET.addEventListener("click", () => {
  reset();
  showMess("PRESS START TO BEGIN...", $NOTE);
});

$COLOR.addEventListener("input", function (e) {
  debouncedColor(this.value);
});

$SPEED_SELECT.addEventListener("change", function () {
  console.log(this.value);

  speed = +this.value;
});

document.body.addEventListener("keydown", handler);
