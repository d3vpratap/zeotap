export interface Cell {
  value: string;
  formula: string;
  isBold: boolean;
  isItalic: boolean;
  align: 'left' | 'center' | 'right';
}

export type SpreadsheetData = Cell[][];