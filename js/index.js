import {
  randomIndex,
  showMess,
  cellsAction,
  getCurrCoords,
  isTimeToStop,
  isBottomRow,
} from "./services.js";
import {
  FIGURES,
  ROW,
  KEY_LIST,
  $FIELD,
  $START,
  $PAUSE,
  $RESET,
  $SCORE,
  $NOTE,
} from "./consts.js";


// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ:
let currFieldPosition = 4,
  intervalId, 
  figureRotation = 0,  
  figure = FIGURES[randomIndex(FIGURES)],  
  score = 0,
  isPaused = false,
  delay = 500,
  isGameOver = true,
  $CELLS;

$SCORE.value = score;

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

const draw = (coords) =>
  coords.forEach((coord) => $CELLS[coord].classList.add("active"));

function unDraw(coords) {
  if (coords.some((coord) => coord < 0)) return;
  coords.forEach((coord) => $CELLS[coord].classList.remove("active"));
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
  start(delay);
}

function start(delay) {
  isPaused = false;
  intervalId = setInterval(() => {    
    // Удаляем отрисованную фигуру на предыдущем шаге (ряде)

    // Текущие координаты фигуры:
    let currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

    // Удаляем отрисованную фигуру на предыдущем шаге
    unDraw(currCoords.map((coord) => coord - ROW));

    // Отрисовываем фигуру на текущих координатах:
    draw(currCoords);

    // Проверка условий остановки движения фигуры
    if (
      isTimeToStop(
        currCoords,
        currFieldPosition,
        $CELLS,
        ROW,
        reset,
        updateSomeStates,        
      )
    )
      return;

    currFieldPosition += ROW;
  }, delay);
}

function pause() {
  clearInterval(intervalId);
  isPaused = true;
  $START.disabled = false;
}

function reset() {
  prepareForNextStep();
  score = 0;
  $SCORE.value = score;  
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

  if (isGameOver) return  

  let currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

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

  currCoords = getCurrCoords(figure, figureRotation, currFieldPosition);

  draw(currCoords);

  isBottomRow(currCoords, $CELLS, ROW, updateSomeStates)  
}

// СЛУШАТЕЛИ **************************************************************

$START.addEventListener("click", function () {
  this.disabled = true;
  isGameOver = false;
  isPaused ||
    cellsAction($CELLS.slice(0, 200), (cell) =>
      cell.classList.remove("active")
    );
  start(delay);
  showMess("GAME STARTED!", $NOTE);
});

$PAUSE.addEventListener("click", pause);

document.body.addEventListener("keydown", handler);
