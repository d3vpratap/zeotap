import React from 'react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, Search, List } from 'lucide-react';

interface ToolbarProps {
  onFormat: (format: string) => void;
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onFindAndReplace: () => void;
  onRemoveDuplicates: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onFormat,
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onFindAndReplace,
  onRemoveDuplicates
}) => {
  return (
    <div className="flex items-center p-1 border-b overflow-x-auto">
      <div className="flex items-center space-x-1 mr-4">
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => onFormat('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => onFormat('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-4">
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => onFormat('alignLeft')}
          title="Align left"
        >
          <AlignLeft className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => onFormat('alignCenter')}
          title="Align center"
        >
          <AlignCenter className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => onFormat('alignRight')}
          title="Align right"
        >
          <AlignRight className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      
      <div className="h-6 border-r border-gray-300 mx-2"></div>
      
      <div className="flex items-center space-x-1 mr-4">
        <button
          className="p-1.5 rounded hover:bg-gray-100 flex items-center"
          onClick={onAddRow}
          title="Insert row"
        >
          <Plus className="w-4 h-4 text-gray-700 mr-1" />
          <span className="text-xs">Row</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 flex items-center"
          onClick={onAddColumn}
          title="Insert column"
        >
          <Plus className="w-4 h-4 text-gray-700 mr-1" />
          <span className="text-xs">Column</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-4">
        <button
          className="p-1.5 rounded hover:bg-gray-100 flex items-center"
          onClick={onDeleteRow}
          title="Delete row"
        >
          <Trash2 className="w-4 h-4 text-gray-700 mr-1" />
          <span className="text-xs">Row</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 flex items-center"
          onClick={onDeleteColumn}
          title="Delete column"
        >
          <Trash2 className="w-4 h-4 text-gray-700 mr-1" />
          <span className="text-xs">Column</span>
        </button>
      </div>
      
      <div className="h-6 border-r border-gray-300 mx-2"></div>
      
      <div className="flex items-center space-x-1">
        <button
          className="p-1.5 rounded hover:bg-gray-100 flex items-center"
          onClick={onFindAndReplace}
          title="Find and replace"
        >
          <Search className="w-4 h-4 text-gray-700 mr-1" />
          <span className="text-xs">Find & Replace</span>
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 flex items-center"
          onClick={onRemoveDuplicates}
          title="Remove duplicates"
        >
          <List className="w-4 h-4 text-gray-700 mr-1" />
          <span className="text-xs">Remove Duplicates</span>
        </button>
      </div>
      
      <div className="h-6 border-r border-gray-300 mx-2"></div>
      
      <div className="flex items-center space-x-1">
        <select className="text-xs border border-gray-300 rounded p-1 bg-white">
          <option value="">Functions</option>
          <optgroup label="Mathematical">
            <option value="SUM">SUM</option>
            <option value="AVERAGE">AVERAGE</option>
            <option value="MAX">MAX</option>
            <option value="MIN">MIN</option>
            <option value="COUNT">COUNT</option>
          </optgroup>
          <optgroup label="Data Quality">
            <option value="TRIM">TRIM</option>
            <option value="UPPER">UPPER</option>
            <option value="LOWER">LOWER</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
};

export default Toolbar;