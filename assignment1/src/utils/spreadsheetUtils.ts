import { Cell, SpreadsheetData } from '../types';

export const generateEmptySheet = (rows: number, cols: number): SpreadsheetData => {
  const data: SpreadsheetData = [];
  
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        value: '',
        formula: '',
        isBold: false,
        isItalic: false,
        align: 'left'
      });
    }
    data.push(row);
  }
  
  return data;
};

export const columnIndexToLetter = (index: number): string => {
  let result = '';
  let temp = index;
  
  while (temp >= 0) {
    result = String.fromCharCode(65 + (temp % 26)) + result;
    temp = Math.floor(temp / 26) - 1;
  }
  
  return result;
};

export const letterToColumnIndex = (letter: string): number => {
  let result = 0;
  
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  
  return result - 1;
};