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
export const isTimeToStop = (
  currCoords,
  currFieldPosition,
  $cells,
  row,
  reset,
  updateSomeStates  
) => {
  if (
    currCoords.some((coord) =>
      $cells[coord + row].className.includes("bottom")
    ) &&
    currFieldPosition < row
  ) {
    reset();
    return true;
  }
  // Проверяем - дошла ли фигура до Row с элементами, имеющими класс 'bottom'
  if (isBottomRow(currCoords, $cells, row, updateSomeStates)) return true

  return false;
};

export function isBottomRow(currCoords, $cells, row, updateSomeStates) {
  if (
    currCoords.some((coord) => $cells[coord + row].className.includes("bottom"))
  ) {
    currCoords.forEach((coord) => $cells[coord].classList.add("bottom"));
    updateSomeStates();
    return true;
  }
  return false
}
