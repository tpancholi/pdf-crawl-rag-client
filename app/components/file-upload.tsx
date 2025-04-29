'use client';

import * as React from 'react';
import { FileUp } from 'lucide-react';

const FileUploadComponent: React.FC = () => {
  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');
    el.addEventListener('change', ev => {
      if (el.files && el.files.length > 0) {
        console.log('File uploaded', el.files[0].name);
        const file = el.files.item(0);
      }
    });
    el.click();
  };
  return (
    <div className="flex w-full items-center justify-center rounded-lg border-2 border-white bg-slate-600 p-4 text-white shadow-2xl">
      <div onClick={handleFileUploadButtonClick} className="flex flex-col items-center justify-center">
        <h3>Upload PDF File</h3>
        <FileUp />
      </div>
    </div>
  );
};
export default FileUploadComponent;
