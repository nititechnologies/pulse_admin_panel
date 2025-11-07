'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your article content here...", 
  className = "" 
}: RichTextEditorProps) {
  const editorRef = useRef<{ getContent: () => string; setContent: (content: string) => void } | null>(null);

  return (
    <div className={`rich-text-editor ${className}`}>
      <Editor
        apiKey="drzkdb44jbaxc6lz5h2edvqk4uzh2i2gkssmoxogq9ip67tf"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | link image',
          content_style: 'body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; }',
          placeholder: placeholder,
          branding: false,
          promotion: false,
          resize: true,
          statusbar: false,
          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote',
          setup: (editor: { getContent: () => string; setContent: (content: string) => void; on: (event: string, callback: () => void) => void }) => {
            editor.on('init', () => {
              if (!value) {
                editor.setContent('');
              }
            });
          }
        }}
      />
    </div>
  );
}
