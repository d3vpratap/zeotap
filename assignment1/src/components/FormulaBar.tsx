import React from 'react';

interface FormulaBarProps {
  value: string;
  onChange: (value: string) => void;
  activeCell: string;
}

const FormulaBar: React.FC<FormulaBarProps> = ({ value, onChange, activeCell }) => {
  return (
    <div className="flex items-center p-1 border-b">
      <div className="w-10 h-8 flex items-center justify-center border-r mr-2 text-sm font-medium text-gray-600">
        fx
      </div>
      <div className="w-16 h-8 flex items-center justify-center border border-gray-300 rounded mr-2 text-sm text-gray-600">
        {activeCell}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-8 px-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Enter a value or formula"
      />
    </div>
  );
};

export default FormulaBar;