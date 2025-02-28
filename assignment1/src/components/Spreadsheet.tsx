import React, { useState, useRef, useEffect } from "react";
import { Cell, SpreadsheetData } from "../types";
import { columnIndexToLetter } from "../utils/spreadsheetUtils";
import classNames from "classnames";

interface SpreadsheetProps {
  data: SpreadsheetData;
  activeCell: { row: number; col: number } | null;
  setActiveCell: (cell: { row: number; col: number } | null) => void;
  onCellChange: (row: number, col: number, value: string) => void;
  selectedRange: {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null;
  setSelectedRange: (
    range: {
      startRow: number;
      startCol: number;
      endRow: number;
      endCol: number;
    } | null
  ) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({
  data,
  activeCell,
  setActiveCell,
  onCellChange,
  selectedRange,
  setSelectedRange,
  isDragging,
  setIsDragging,
}) => {
  const [editValue, setEditValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [colWidths, setColWidths] = useState<number[]>(
    data[0]?.length ? Array(data[0].length).fill(100) : []
  );
  const [rowHeights, setRowHeights] = useState<number[]>(
    data.length ? Array(data.length).fill(24) : []
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleCellClick = (row: number, col: number) => {
    if (!data[row] || !data[row][col]) return;
    if (activeCell?.row === row && activeCell?.col === col) {
      startEditing(row, col);
    } else {
      setActiveCell({ row, col });
      setSelectedRange(null);
    }
  };

  const startEditing = (row: number, col: number) => {
    setEditValue(data[row][col]?.formula || data[row][col]?.value || "");
    setIsEditing(true);
  };

  const stopEditing = () => {
    if (isEditing && activeCell) {
      onCellChange(activeCell.row, activeCell.col, editValue);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative overflow-auto" tabIndex={0} ref={tableRef}>
      <div className="sticky top-0 left-0 z-20 bg-gray-100 w-[40px] h-[24px] border-b border-r border-gray-300"></div>

      {/* Column Headers */}
      <div className="sticky top-0 z-10 flex">
        <div className="sticky left-0 z-20 w-[40px] bg-gray-100"></div>
        {data[0]?.map((_, colIndex) => (
          <div
            key={colIndex}
            className="flex-shrink-0 bg-gray-100 border-b border-r border-gray-300 relative"
            style={{ width: `${colWidths[colIndex]}px` }}
          >
            <div className="h-[24px] flex items-center justify-center text-xs text-gray-700 font-medium">
              {columnIndexToLetter(colIndex)}
            </div>
          </div>
        ))}
      </div>

      {/* Row Headers and Cells */}
      <div>
        {data.map(
          (row, rowIndex) =>
            row.length > 0 && (
              <div key={rowIndex} className="flex">
                <div
                  className="sticky left-0 z-10 w-[40px] bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-xs text-gray-700 font-medium"
                  style={{ height: `${rowHeights[rowIndex]}px` }}
                >
                  {rowIndex + 1}
                </div>
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={classNames(
                      "border-b border-r border-gray-300 relative",
                      {
                        "bg-blue-100":
                          activeCell?.row === rowIndex &&
                          activeCell?.col === colIndex,
                        "bg-blue-50":
                          selectedRange &&
                          selectedRange.startRow <= rowIndex &&
                          selectedRange.endRow >= rowIndex &&
                          selectedRange.startCol <= colIndex &&
                          selectedRange.endCol >= colIndex,
                      }
                    )}
                    style={{
                      width: `${colWidths[colIndex]}px`,
                      height: `${rowHeights[rowIndex]}px`,
                    }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {isEditing &&
                    activeCell?.row === rowIndex &&
                    activeCell?.col === colIndex ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={stopEditing}
                        className="absolute inset-0 w-full h-full border-none outline-none px-2"
                      />
                    ) : (
                      <div className="w-full h-full px-2 overflow-hidden flex items-center">
                        {cell?.value || ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Spreadsheet;
