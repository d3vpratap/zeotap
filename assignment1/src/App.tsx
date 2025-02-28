import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Save, Upload, Plus, Trash2, ChevronRight } from 'lucide-react';
import Spreadsheet from './components/Spreadsheet';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import { Cell, SpreadsheetData } from './types';
import { generateEmptySheet } from './utils/spreadsheetUtils';

function App() {
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [data, setData] = useState<SpreadsheetData>(generateEmptySheet(100, 26));
  const [formulaValue, setFormulaValue] = useState('');
  const [selectedRange, setSelectedRange] = useState<{ startRow: number; startCol: number; endRow: number; endCol: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetName, setSheetName] = useState('Untitled spreadsheet');
  const [isEditingSheetName, setIsEditingSheetName] = useState(false);

  // Update formula bar when active cell changes
  useEffect(() => {
    if (activeCell) {
      const { row, col } = activeCell;
      setFormulaValue(data[row][col].formula || data[row][col].value || '');
    } else {
      setFormulaValue('');
    }
  }, [activeCell, data]);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...data];
    
    // Check if it's a formula
    if (value.startsWith('=')) {
      newData[row][col] = {
        ...newData[row][col],
        formula: value,
        value: evaluateFormula(value, newData)
      };
    } else {
      newData[row][col] = {
        ...newData[row][col],
        value: value,
        formula: ''
      };
    }
    
    setData(newData);
    updateDependentCells(newData);
  };

  const updateDependentCells = (data: SpreadsheetData) => {
    // In a real implementation, we would track cell dependencies and update them
    // For now, we'll just re-evaluate all formulas
    const newData = [...data];
    
    for (let row = 0; row < newData.length; row++) {
      for (let col = 0; col < newData[row].length; col++) {
        if (newData[row][col].formula) {
          newData[row][col].value = evaluateFormula(newData[row][col].formula, newData);
        }
      }
    }
    
    setData(newData);
  };

  const evaluateFormula = (formula: string, data: SpreadsheetData): string => {
    try {
      // Remove the equals sign
      const expression = formula.substring(1).trim().toUpperCase();
      
      // Handle SUM function
      if (expression.startsWith('SUM(') && expression.endsWith(')')) {
        return handleSumFunction(expression, data);
      }
      
      // Handle AVERAGE function
      if (expression.startsWith('AVERAGE(') && expression.endsWith(')')) {
        return handleAverageFunction(expression, data);
      }
      
      // Handle MAX function
      if (expression.startsWith('MAX(') && expression.endsWith(')')) {
        return handleMaxFunction(expression, data);
      }
      
      // Handle MIN function
      if (expression.startsWith('MIN(') && expression.endsWith(')')) {
        return handleMinFunction(expression, data);
      }
      
      // Handle COUNT function
      if (expression.startsWith('COUNT(') && expression.endsWith(')')) {
        return handleCountFunction(expression, data);
      }
      
      // Handle TRIM function
      if (expression.startsWith('TRIM(') && expression.endsWith(')')) {
        return handleTrimFunction(expression, data);
      }
      
      // Handle UPPER function
      if (expression.startsWith('UPPER(') && expression.endsWith(')')) {
        return handleUpperFunction(expression, data);
      }
      
      // Handle LOWER function
      if (expression.startsWith('LOWER(') && expression.endsWith(')')) {
        return handleLowerFunction(expression, data);
      }
      
      // Handle cell references like A1, B2, etc.
      if (/^[A-Z]+[0-9]+$/.test(expression)) {
        return handleCellReference(expression, data);
      }
      
      // For simple arithmetic expressions
      return eval(expression).toString();
    } catch (error) {
      return '#ERROR!';
    }
  };

  const handleSumFunction = (expression: string, data: SpreadsheetData): string => {
    const range = expression.substring(4, expression.length - 1);
    const cells = getCellsFromRange(range, data);
    
    let sum = 0;
    for (const cell of cells) {
      const value = parseFloat(cell.value);
      if (!isNaN(value)) {
        sum += value;
      }
    }
    
    return sum.toString();
  };

  const handleAverageFunction = (expression: string, data: SpreadsheetData): string => {
    const range = expression.substring(8, expression.length - 1);
    const cells = getCellsFromRange(range, data);
    
    let sum = 0;
    let count = 0;
    
    for (const cell of cells) {
      const value = parseFloat(cell.value);
      if (!isNaN(value)) {
        sum += value;
        count++;
      }
    }
    
    return count > 0 ? (sum / count).toString() : '#DIV/0!';
  };

  const handleMaxFunction = (expression: string, data: SpreadsheetData): string => {
    const range = expression.substring(4, expression.length - 1);
    const cells = getCellsFromRange(range, data);
    
    let max = Number.NEGATIVE_INFINITY;
    let hasValue = false;
    
    for (const cell of cells) {
      const value = parseFloat(cell.value);
      if (!isNaN(value)) {
        max = Math.max(max, value);
        hasValue = true;
      }
    }
    
    return hasValue ? max.toString() : '#N/A';
  };

  const handleMinFunction = (expression: string, data: SpreadsheetData): string => {
    const range = expression.substring(4, expression.length - 1);
    const cells = getCellsFromRange(range, data);
    
    let min = Number.POSITIVE_INFINITY;
    let hasValue = false;
    
    for (const cell of cells) {
      const value = parseFloat(cell.value);
      if (!isNaN(value)) {
        min = Math.min(min, value);
        hasValue = true;
      }
    }
    
    return hasValue ? min.toString() : '#N/A';
  };

  const handleCountFunction = (expression: string, data: SpreadsheetData): string => {
    const range = expression.substring(6, expression.length - 1);
    const cells = getCellsFromRange(range, data);
    
    let count = 0;
    
    for (const cell of cells) {
      const value = parseFloat(cell.value);
      if (!isNaN(value)) {
        count++;
      }
    }
    
    return count.toString();
  };

  const handleTrimFunction = (expression: string, data: SpreadsheetData): string => {
    const cellRef = expression.substring(5, expression.length - 1);
    const cell = getCellFromReference(cellRef, data);
    
    return cell ? cell.value.trim() : '#REF!';
  };

  const handleUpperFunction = (expression: string, data: SpreadsheetData): string => {
    const cellRef = expression.substring(6, expression.length - 1);
    const cell = getCellFromReference(cellRef, data);
    
    return cell ? cell.value.toUpperCase() : '#REF!';
  };

  const handleLowerFunction = (expression: string, data: SpreadsheetData): string => {
    const cellRef = expression.substring(6, expression.length - 1);
    const cell = getCellFromReference(cellRef, data);
    
    return cell ? cell.value.toLowerCase() : '#REF!';
  };

  const handleCellReference = (reference: string, data: SpreadsheetData): string => {
    const cell = getCellFromReference(reference, data);
    return cell ? cell.value : '#REF!';
  };

  const getCellFromReference = (reference: string, data: SpreadsheetData): Cell | null => {
    const colMatch = reference.match(/[A-Z]+/);
    const rowMatch = reference.match(/[0-9]+/);
    
    if (!colMatch || !rowMatch) return null;
    
    const colStr = colMatch[0];
    const rowStr = rowMatch[0];
    
    // Convert column letter to index (A=0, B=1, etc.)
    let colIndex = 0;
    for (let i = 0; i < colStr.length; i++) {
      colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 'A'.charCodeAt(0));
    }
    
    const rowIndex = parseInt(rowStr) - 1;
    
    if (rowIndex < 0 || rowIndex >= data.length || colIndex < 0 || colIndex >= data[0].length) {
      return null;
    }
    
    return data[rowIndex][colIndex];
  };

  const getCellsFromRange = (range: string, data: SpreadsheetData): Cell[] => {
    const cells: Cell[] = [];
    
    // Handle single cell
    if (/^[A-Z]+[0-9]+$/.test(range)) {
      const cell = getCellFromReference(range, data);
      if (cell) cells.push(cell);
      return cells;
    }
    
    // Handle range like A1:B3
    const parts = range.split(':');
    if (parts.length !== 2) return cells;
    
    const startCell = parts[0];
    const endCell = parts[1];
    
    const startColMatch = startCell.match(/[A-Z]+/);
    const startRowMatch = startCell.match(/[0-9]+/);
    const endColMatch = endCell.match(/[A-Z]+/);
    const endRowMatch = endCell.match(/[0-9]+/);
    
    if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) return cells;
    
    const startColStr = startColMatch[0];
    const startRowStr = startRowMatch[0];
    const endColStr = endColMatch[0];
    const endRowStr = endRowMatch[0];
    
    // Convert column letters to indices
    let startColIndex = 0;
    for (let i = 0; i < startColStr.length; i++) {
      startColIndex = startColIndex * 26 + (startColStr.charCodeAt(i) - 'A'.charCodeAt(0));
    }
    
    let endColIndex = 0;
    for (let i = 0; i < endColStr.length; i++) {
      endColIndex = endColIndex * 26 + (endColStr.charCodeAt(i) - 'A'.charCodeAt(0));
    }
    
    const startRowIndex = parseInt(startRowStr) - 1;
    const endRowIndex = parseInt(endRowStr) - 1;
    
    // Collect all cells in the range
    for (let row = startRowIndex; row <= endRowIndex; row++) {
      for (let col = startColIndex; col <= endColIndex; col++) {
        if (row >= 0 && row < data.length && col >= 0 && col < data[0].length) {
          cells.push(data[row][col]);
        }
      }
    }
    
    return cells;
  };

  const handleFormulaChange = (value: string) => {
    setFormulaValue(value);
    if (activeCell) {
      handleCellChange(activeCell.row, activeCell.col, value);
    }
  };

  const handleCellFormat = (format: string) => {
    if (!activeCell) return;
    
    const { row, col } = activeCell;
    const newData = [...data];
    
    switch (format) {
      case 'bold':
        newData[row][col].isBold = !newData[row][col].isBold;
        break;
      case 'italic':
        newData[row][col].isItalic = !newData[row][col].isItalic;
        break;
      case 'alignLeft':
        newData[row][col].align = 'left';
        break;
      case 'alignCenter':
        newData[row][col].align = 'center';
        break;
      case 'alignRight':
        newData[row][col].align = 'right';
        break;
    }
    
    setData(newData);
  };

  const handleAddRow = () => {
    if (!activeCell) return;
    
    const { row } = activeCell;
    const newData = [...data];
    const newRow = Array(data[0].length).fill(null).map(() => ({ value: '', formula: '', isBold: false, isItalic: false, align: 'left' }));
    
    newData.splice(row + 1, 0, newRow);
    setData(newData);
  };

  const handleAddColumn = () => {
    if (!activeCell) return;
    
    const { col } = activeCell;
    const newData = data.map(row => {
      const newRow = [...row];
      newRow.splice(col + 1, 0, { value: '', formula: '', isBold: false, isItalic: false, align: 'left' });
      return newRow;
    });
    
    setData(newData);
  };

  const handleDeleteRow = () => {
    if (!activeCell || data.length <= 1) return;
    
    const { row } = activeCell;
    const newData = [...data];
    newData.splice(row, 1);
    setData(newData);
    
    // Update active cell if needed
    if (row >= newData.length) {
      setActiveCell({ row: newData.length - 1, col: activeCell.col });
    }
  };

  const handleDeleteColumn = () => {
    if (!activeCell || data[0].length <= 1) return;
    
    const { col } = activeCell;
    const newData = data.map(row => {
      const newRow = [...row];
      newRow.splice(col, 1);
      return newRow;
    });
    
    setData(newData);
    
    // Update active cell if needed
    if (col >= newData[0].length) {
      setActiveCell({ row: activeCell.row, col: newData[0].length - 1 });
    }
  };

  const handleFindAndReplace = () => {
    const findText = prompt('Find:');
    if (findText === null) return;
    
    const replaceText = prompt('Replace with:');
    if (replaceText === null) return;
    
    const newData = data.map(row => 
      row.map(cell => {
        if (cell.value.includes(findText)) {
          const newValue = cell.value.replaceAll(findText, replaceText);
          return { ...cell, value: newValue };
        }
        return cell;
      })
    );
    
    setData(newData);
  };

  const handleRemoveDuplicates = () => {
    if (!selectedRange) {
      alert('Please select a range first');
      return;
    }
    
    const { startRow, startCol, endRow, endCol } = selectedRange;
    
    // Get all rows in the selected range
    const selectedRows = [];
    for (let row = startRow; row <= endRow; row++) {
      const rowData = [];
      for (let col = startCol; col <= endCol; col++) {
        rowData.push(data[row][col].value);
      }
      selectedRows.push({ row, values: rowData.join('|') });
    }
    
    // Find duplicates
    const uniqueValues = new Set();
    const duplicateRows = [];
    
    for (const rowData of selectedRows) {
      if (uniqueValues.has(rowData.values)) {
        duplicateRows.push(rowData.row);
      } else {
        uniqueValues.add(rowData.values);
      }
    }
    
    // Remove duplicates (from bottom to top to avoid index shifting)
    const newData = [...data];
    duplicateRows.sort((a, b) => b - a);
    
    for (const rowIndex of duplicateRows) {
      newData.splice(rowIndex, 1);
    }
    
    setData(newData);
    setSelectedRange(null);
  };

  const handleSaveSpreadsheet = () => {
    const spreadsheetData = {
      name: sheetName,
      data: data
    };
    
    const blob = new Blob([JSON.stringify(spreadsheetData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheetName}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const handleLoadSpreadsheet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const spreadsheetData = JSON.parse(content);
        
        setSheetName(spreadsheetData.name || 'Untitled spreadsheet');
        setData(spreadsheetData.data);
      } catch (error) {
        alert('Error loading spreadsheet');
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-2 border-b">
        <Menu className="w-5 h-5 mr-4 text-gray-600" />
        <div className="flex items-center">
          {isEditingSheetName ? (
            <input
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              onBlur={() => setIsEditingSheetName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingSheetName(false)}
              autoFocus
              className="border-b border-blue-500 outline-none px-1"
            />
          ) : (
            <h1 
              className="text-lg font-medium cursor-pointer" 
              onClick={() => setIsEditingSheetName(true)}
            >
              {sheetName}
            </h1>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button 
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={handleSaveSpreadsheet}
          >
            <Save className="w-5 h-5 text-gray-600" />
          </button>
          <label className="p-1.5 rounded hover:bg-gray-100 cursor-pointer">
            <Upload className="w-5 h-5 text-gray-600" />
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleLoadSpreadsheet}
            />
          </label>
        </div>
      </div>
      
      {/* Toolbar */}
      <Toolbar 
        onFormat={handleCellFormat}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onDeleteRow={handleDeleteRow}
        onDeleteColumn={handleDeleteColumn}
        onFindAndReplace={handleFindAndReplace}
        onRemoveDuplicates={handleRemoveDuplicates}
      />
      
      {/* Formula Bar */}
      <FormulaBar 
        value={formulaValue} 
        onChange={handleFormulaChange}
        activeCell={activeCell ? `${String.fromCharCode(65 + activeCell.col)}${activeCell.row + 1}` : ''}
      />
      
      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <Spreadsheet 
          data={data}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
          onCellChange={handleCellChange}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center p-1 border-t text-xs text-gray-600">
        <div className="flex items-center">
          <span className="mr-4">Sheet1</span>
          <ChevronRight className="w-4 h-4" />
        </div>
        <div className="ml-auto">
          {selectedRange ? 
            `${selectedRange.endRow - selectedRange.startRow + 1}R × ${selectedRange.endCol - selectedRange.startCol + 1}C` : 
            activeCell ? `${String.fromCharCode(65 + activeCell.col)}${activeCell.row + 1}` : ''
          }
        </div>
      </div>
    </div>
  );
}

export default App;