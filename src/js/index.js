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
} from "./services.min.js";
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
  $CONTROLS,
} from "./consts.min.js";

// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ:
let currFieldPos_g = 4,
  intervalId_g,
  figRot_g = 0,
  fig_g = FIGURES[randomIndex(FIGURES)],
  score_g = 0,
  level_g = 0,
  speed_g = SPEED_LIST[level_g].value,
  gameOver_g = true,
  figCol_g = "var(--app-danger-color)",
  $CELLS_g;

// НАЧАЛЬНАЯ ОТРИСОВКА ПОЛЯ ----:
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
  $CELLS_g = [...$FIELD.querySelectorAll(".field__cell")];
})();

// ПАНЕЛЬ ОТОБРАЖЕНИЯ УРОВНЯ ------
$CONTROLS.insertAdjacentHTML(
  "beforeend",
  `<select class="controls__speed" id="$LEVEL_PANEL">
  ${SPEED_LIST.map(
    ({ text, value }) => `<option value="${value}" disabled> ${text} </option>`
  ).join("")}
</select>`
);

// ОСНОВНЫЕ ФУНКЦИИ ----------------------------------
// ***************************************************

// ОЧИСТКА ИГРОВОГО ПОЛЯ
function clearField(msg) {
  gameOver_g = true;
  cellsAction($CELLS_g.slice(0, 200), (cell) =>
    cell.classList.remove("bottom")
  );
  $CELLS_g.forEach(($cell, i) => {
    setTimeout(() => $cell.removeAttribute("style"), i * 10);
  });
  showMess(msg, $NOTE);
}

// ОТОБРАЖЕНИЕ СЧЕТА
showScore($SCORE, score_g);

// УСТАНОВКА ФОНА ФИГУР
$COLOR.setAttribute("value", "#a41f1f");

// ОПТИМИЗАЦИЯ
const debouncedColor = debounce((color) => (figCol_g = color), 500);

// ОТРИСОВКА ФИГУРЫ
const draw = (coords) =>
  coords.forEach((coord) => ($CELLS_g[coord].style.backgroundColor = figCol_g));

// УДАЛЕНИЕ ФИГУРЫ
const unDraw = (coords) =>
  coords.forEach((coord) => $CELLS_g[coord].removeAttribute("style"));

// ОБНОВЛЕНИЕ ГЛОБАЛЬНЫХ СОСТОЯНИЙ  -----
function updateGlobalVars() {
  clearInterval(intervalId_g);
  intervalId_g = null;
  currFieldPos_g = 4;
  // произвольная фигура -----
  fig_g = FIGURES[randomIndex(FIGURES)];
  figRot_g = 0;
}

// ОБНУЛЕНИ УРОВНЯ ИГРЫ

function zeroedLevel() {
  speed_g = SPEED_LIST[level_g].value;
  $LEVEL_PANEL.value = speed_g;
}

// ПОДГОТОВКА СОСТОЯНИЙ К ПОЯВЛЕНИЮ НОВОЙ ФИГУРЫ ----
function prepareForNextFigure() {
  updateGlobalVars();
  changeScore();
  level_g = changeLevel(score_g);

  if (level_g === SPEED_LIST.length) {
    reset("CONGRATULATION, YOU ARE WINNER...");
    return;
  }
  zeroedLevel();
  start(speed_g);
}

// СБРОС ТЕКУЩЕЙ ИГРЫ
function reset(msg) {
  updateGlobalVars();
  (level_g = 0), (score_g = 0);
  zeroedLevel();
  showScore($SCORE, score_g);
  clearField(msg);
}

// АЛГОРИТМ ИЗМЕНЕНИЯ СЧЕТА И УДАЛЕНИЯ РЯДОВ ИГРОВОГО ПОЛЯ
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
    ].map((i) => $CELLS_g[i]);

    if (rowBeingChecked.every(($cell) => $cell.className.includes("bottom"))) {
      score_g += 10;
      showScore($SCORE, score_g);
      rowBeingChecked.forEach(($cell) => {
        $cell.classList.remove("bottom");
        $cell.removeAttribute("style");
      });
      let splicedRow = $CELLS_g.splice(i, ROW);
      $CELLS_g = splicedRow.concat($CELLS_g);
      spliceCount++;
    }
  }

  if (!spliceCount) return;

  $FIELD.innerHTML = "";
  $FIELD.append(...$CELLS_g);

  $CELLS_g = [...$FIELD.querySelectorAll(".field__cell")];
}

// ЗАПУСК ГЛАВНОЙ ФУНКЦИИ ДВИЖЕНИЯ ФИГУР
function start(speed) {
  draw(getCurrCoords(fig_g, figRot_g, currFieldPos_g));
  // Проверка на GameOver --------------
  if (
    isGameOver(
      getCurrCoords(fig_g, figRot_g, currFieldPos_g),
      $CELLS_g,
      ROW,
      reset
    )
  ) {
    reset("SORRY, YOU'VE LOST...");
    return;
  }

  intervalId_g = setInterval(() => {
    unDraw(getCurrCoords(fig_g, figRot_g, currFieldPos_g));

    currFieldPos_g += ROW;

    let currCoords = getCurrCoords(fig_g, figRot_g, currFieldPos_g);

    draw(currCoords);

    // Проверка условий остановки фигуры
    isBottomRow(currCoords, $CELLS_g, ROW, prepareForNextFigure);
  }, speed);
}

// КОНТРОЛЛЕР КЛАВИАТУРЫ -------------------------
function keyboardController(e) {
  e.preventDefault();
  // проверки
  if (KEY_LIST.indexOf(e.key) < 0) return;
  if (gameOver_g) return;

  let currCoords = getCurrCoords(fig_g, figRot_g, currFieldPos_g);

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
      figRot_g++;
      break;
    case "ArrowDown":
      currFieldPos_g += ROW;
      break;
    case "ArrowRight":
      currFieldPos_g++;
      break;
    default:
      currFieldPos_g--;
      break;
  }
  // проверки вращения фигур...
  if (figRot_g >= fig_g.length) figRot_g = 0;
  if (figRot_g < 0) figRot_g = fig_g.length - 1;

  currCoords = getCurrCoords(fig_g, figRot_g, currFieldPos_g);

  draw(currCoords);

  isBottomRow(currCoords, $CELLS_g, ROW, prepareForNextFigure);
}

// СЛУШАТЕЛИ **************************************************************

$START.addEventListener("click", function () {
  if (intervalId_g) {
    clearInterval(intervalId_g);
    intervalId_g = null;
  } else {
    gameOver_g = false;
    start(speed_g);
    showMess("GAME STARTED!", $NOTE);
  }
});

$RESET.addEventListener("click", () => reset("PRESS START TO BEGIN..."));

$COLOR.addEventListener("input", function (e) {
  debouncedColor(this.value);
});

document.body.addEventListener("keydown", keyboardController);

// $LEVEL_PANEL.addEventListener("change", function () {
//   speed_g = +this.value;
// });
