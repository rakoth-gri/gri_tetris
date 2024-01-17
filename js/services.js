// получение индекса фигуры
export const randomIndex = (figures) =>
  Math.floor(Math.random() * figures.length);

// вывод сообщения
export const showMess = (mess, $el) => ($el.textContent = mess);

// действия с клетками рабочего поля
export const cellsAction = ($list, cb) => $list.forEach(cb);

export const getCurrCoords = (figure, figureRotation, currFieldPosition) =>
  figure[figureRotation].map((coord) => coord + currFieldPosition);

// Проверка момента остановки текущей фигуры:
export const isGameOver = (currCoords, $cells, row, reset) => {
  if (
    currCoords.some((coord) => $cells[coord + row].className.includes("bottom"))
  ) {
    reset();
    return true;
  }
  return false
};

export function isBottomRow(currCoords, $cells, row, prepareForNextStep) {
  if (
    currCoords.some((coord) => $cells[coord + row].className.includes("bottom"))
  ) {
    currCoords.forEach((coord) => $cells[coord].classList.add("bottom"));
    prepareForNextStep();
  }
}

export const updateScore = ($score, score) => {
  $score.value = score;
};

export const debounce = (cb, ms) => {
  let intervalId;
  return (...args) => {
    clearTimeout(intervalId);
    intervalId = setTimeout(() => {
      cb(...args);
    }, ms);
  };
};
