import {
  randomIndex,
  showMess,
  cellsAction,
  getCurrCoords,
  isTimeToStopFigure,
  isBottomRow,
  updateScore,
  debounce,
} from "./services.js";
import {
  FIGURES,
  ROW,
  KEY_LIST,
  $FIELD,
  $START,
  $PAUSE,
  $SCORE,
  $NOTE,
  $COLOR,
  SPEED_LIST
} from "./consts.js";


// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ:
let currFieldPosition = 4,
  intervalId,
  figureRotation = 0,
  figure = FIGURES[randomIndex(FIGURES)],
  score = 150,
  isPaused = false,
  speed = SPEED_LIST[0].value,
  isGameOver = true,  
  figureColor = "var(--app-danger-color)",
  $CELLS;

// Отрисовываем поле 1 раз IIFE!
(() => {
  $FIELD.insertAdjacentHTML(
    "beforeend",
    new Array(210)
      .fill("")
      .map(
        (_, i) => `
            <div id="${i}" class="${
          i > 199 ? "field__cell bottom transparent" : "field__cell"
        }"> </div>   
        `
      )
      .join("")
  );
  $CELLS = [...$FIELD.querySelectorAll(".field__cell")];
})();

document.querySelector(".controls").insertAdjacentHTML("beforeend", `
<select class="controls__speed" id="speedChoice">
  ${
    SPEED_LIST.map(({text, value}) => `<option value="${value}"> ${text} </option>`).join("")
  }
</select>
`)

// Показываем начальный счет
updateScore($SCORE, score);

// Устанавливаем цвет заливки фигур по-умолчанию
$COLOR.setAttribute("value", '#a41f1f');

// Создаем новую функцию из декотора 
const debouncedColor = debounce((color) => figureColor = color, 500)

// Отрисовка фигуры
const draw = (coords) =>
  coords.forEach((coord) => $CELLS[coord].style.backgroundColor = figureColor);

// Стирание фигуры
function unDraw(coords) {
  if (coords.some((coord) => coord < 0)) return;
  coords.forEach((coord) => $CELLS[coord].removeAttribute("style"));
}

function prepareForNextStep() {
  clearInterval(intervalId);
  currFieldPosition = 4;
  // выбор произвольной фигуры -----
  figure = FIGURES[randomIndex(FIGURES)];
  figureRotation = 0;
}

function updateSomeStates() {
  // обновляем некоторые состояния ----
  prepareForNextStep();
  start(speed);
}

function start(speed) {
  isPaused = false;
  intervalId = setInterval(() => {
    // Текущие координаты фигуры:
    let currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

    // Удаляем отрисованную фигуру на предыдущих координатах  
    unDraw(currCoords.map((coord) => coord - ROW));

    // Отрисовываем фигуру на текущих координатах:
    draw(currCoords);

    // Проверка условий остановки движения фигуры
    if (
      isTimeToStopFigure(
        currCoords,
        currFieldPosition,
        $CELLS,
        ROW,
        reset,
        updateSomeStates
      )
    )
      return;

    currFieldPosition += ROW;
  }, speed);
}

function pause() {
  clearInterval(intervalId);
  isPaused = true;
  $START.disabled = false;
}

function reset() {
  prepareForNextStep();
  isGameOver = true;
  cellsAction($CELLS.slice(0, 200), (cell) => cell.classList.remove("bottom"));
  $START.disabled = false;
  showMess("YOU LOSS", $NOTE);
}

// КОНТРОЛЛЕР КЛАВИАТУРЫ *******************************************
function handler(e) {
  e.preventDefault();
  // проверка нажатой клавиши...
  if (KEY_LIST.indexOf(e.key) < 0) return;

  if (isGameOver) return;

  // Реверс по координатам, чтобы остаться на ряде, отрисованном ранее в start(speed)
  let currCoords = getCurrCoords(
    figure,
    figureRotation,
    currFieldPosition - ROW
  );

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
  if (figureRotation >= figure.length) figureRotation = 0;
  if (figureRotation < 0) figureRotation = figure.length - 1;

  // Реверс по координатам, чтобы не опуститься сразу на 2 ряда вниз
  currCoords = getCurrCoords(figure, figureRotation, currFieldPosition - ROW);

  draw(currCoords);

  isBottomRow(currCoords, $CELLS, ROW, updateSomeStates);
}

// СЛУШАТЕЛИ **************************************************************

$START.addEventListener("click", function () {
  this.disabled = true;
  isGameOver = false;
  score = 0;
  updateScore($SCORE, score);
  isPaused ||
    cellsAction($CELLS.slice(0, 200), (cell) =>
      cell.removeAttribute("style")
    );
  start(speed);
  showMess("GAME STARTED!", $NOTE);
});

$PAUSE.addEventListener("click", pause);

$COLOR.addEventListener("input", function (e) {
  debouncedColor(this.value)
});

document.body.addEventListener("keydown", handler);


function speedChoiceHandler() {
  speed = +this.value 
}

speedChoice.addEventListener("change", speedChoiceHandler)