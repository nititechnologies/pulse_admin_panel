'use client';

import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your article content here...", className = "" }: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        style={{
          fontSize: 14,
          lineHeight: 1.6,
        }}
      />
      <div className="mt-2 text-sm text-gray-500">
        💡 Tip: Use markdown syntax for formatting. Example: **bold**, *italic*, # heading, - list item
      </div>
    </div>
  );
}
