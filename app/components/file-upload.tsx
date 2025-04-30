'use client';

import * as React from 'react';
import { useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

interface UploadResponse {
  message: string;
  s3_key: string;
  file_name: string;
}

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [uploadResponse, setUploadResponse] = React.useState<UploadResponse | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      // validate file type
      if (selectedFile.type !== 'application/pdf') {
        setErrorMessage('Only PDF files are allowed');
        return;
      }

      // validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5MB limit');
        return;
      }

      setFile(selectedFile);
      setErrorMessage('');
      setUploadStatus('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const uploadFile = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post<UploadResponse>('http://localhost:8000/upload-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      setUploadStatus('success');
      setUploadResponse(response.data);
      setUploadProgress(100);
    } catch (error) {
      setUploadStatus('error');
      setUploadProgress(0);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.detail || 'Upload failed');
      } else {
        setErrorMessage('Upload failed');
      }
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadResponse(null);
    setErrorMessage('');
  };
  return (
    <div className="w-full max-w-md">
      <h2 className="mb-4 text-center text-xl font-semibold">PDF Upload</h2>
      {uploadStatus === 'idle' && (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-sm">Drop the PDF file here ... </p>
          ) : (
            <>
              <p className="mb-2 text-sm">Drag & drop a PDF file here</p>
              <p className="text-xs text-gray-500">or click to browse files</p>
            </>
          )}
        </div>
      )}
      {file && uploadStatus === 'idle' && (
        <div className="mt-4 w-full">
          <p className="mb-2">Selected file: {file.name}</p>
          <div className="flex space-x-2">
            <button onClick={uploadFile} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Upload PDF
            </button>
            <button onClick={resetUpload} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}
      {uploadStatus === 'uploading' && (
        <div className="mt-4 w-full">
          <p>Uploading: {file?.name}</p>
          <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
            <div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="mt-1 text-sm text-gray-600">{uploadProgress}% completed</p>
        </div>
      )}

      {uploadStatus === 'success' && uploadResponse && (
        <div className="mt-4 rounded-lg bg-green-50 p-4">
          <p className="text-green-700">✅ Upload successful!</p>
          <p className="mt-2">Original filename: {uploadResponse.file_name}</p>
          <p>S3 Key: {uploadResponse.s3_key}</p>
          <button onClick={resetUpload} className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Upload another file
          </button>
        </div>
      )}

      {(uploadStatus === 'error' || errorMessage) && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <p className="text-red-700">❌ {errorMessage || 'Upload failed'}</p>
          {file && (
            <button onClick={resetUpload} className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
