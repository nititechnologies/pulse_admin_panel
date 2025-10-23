'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your article content here...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!editorRef.current) return;
    // Only set innerHTML if external value changes and differs from current
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    setIsEmpty(!value || value === '<p><br></p>' || value.trim() === '');
  }, [value]);

  const exec = (command: string, valueArg?: string) => {
    document.execCommand(command, false, valueArg);
    // Trigger onChange with updated HTML
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      setIsEmpty(editorRef.current.innerText.trim() === '');
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      setIsEmpty(editorRef.current.innerText.trim() === '');
    }
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="flex items-center gap-1 p-2 border border-b-0 border-gray-200 rounded-t-lg bg-gray-50">
        <ToolbarButton label="B" onClick={() => exec('bold')} />
        <ToolbarButton label="I" onClick={() => exec('italic')} />
        <ToolbarButton label="U" onClick={() => exec('underline')} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton label="H1" onClick={() => exec('formatBlock', 'H1')} />
        <ToolbarButton label="H2" onClick={() => exec('formatBlock', 'H2')} />
        <ToolbarButton label="Quote" onClick={() => exec('formatBlock', 'BLOCKQUOTE')} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton label="• List" onClick={() => exec('insertUnorderedList')} />
        <ToolbarButton label="1. List" onClick={() => exec('insertOrderedList')} />
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton label="Link" onClick={() => {
          const url = prompt('Enter URL');
          if (url) exec('createLink', url);
        }} />
        <ToolbarButton label="Clear" onClick={() => exec('removeFormat')} />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="w-full h-96 px-4 py-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white prose max-w-none overflow-auto"
        style={{ fontSize: 14, lineHeight: 1.6 }}
      />

      {isEmpty && (
        <div className="-mt-96 pointer-events-none select-none">
          <div className="px-4 py-3 text-gray-400" style={{ fontSize: 14 }}>
            {placeholder}
          </div>
        </div>
      )}
    </div>
  );
}
