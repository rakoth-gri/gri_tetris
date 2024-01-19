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
  return false;
};

export function isBottomRow(currCoords, $cells, row, updateSomeStates) {
  if (
    currCoords.some((coord) => $cells[coord + row].className.includes("bottom"))
  ) {
    currCoords.forEach((coord) => $cells[coord].classList.add("bottom"));
    updateSomeStates();
  }
}

export const showScore = ($score, score) => {
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

export const changeLevel = (score) => {
  switch (true) {
    case score < 100:
      return 0;
    case score < 200:
      return 1;
    case score < 300:
      return 2;
    case score < 400:
      return 3;
    case score < 500:
      return 4;
    case score < 600:
      return 5;
    case score < 700:
      return 6;
    case score < 800:
      return 7;
    case score < 900:
      return 8;
    case score < 1000:
      return 9;
    default:
      return 10;
  }
};
