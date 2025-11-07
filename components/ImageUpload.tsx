'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete?: (urls: {
    original: string;
    large: string;
    medium: string;
    thumbnail: string;
  }) => void;
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Only JPG and PNG files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadedUrls(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setUploadedUrls(data.urls);
      if (onUploadComplete) {
        onUploadComplete(data.urls);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setUploadedUrls(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!preview ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Select Image
            </label>
            <p className="mt-2 text-sm text-gray-500">
              JPG or PNG, max 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-600">{selectedFile?.name}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {uploadedUrls && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <p className="font-medium">Upload successful!</p>
          <p className="text-sm mt-1">Image uploaded and optimized</p>
        </div>
      )}

      <div className="flex gap-2">
        {selectedFile && !uploading && !uploadedUrls && (
          <button
            onClick={handleUpload}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload
          </button>
        )}
        {(selectedFile || uploadedUrls) && (
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            {uploadedUrls ? 'Upload Another' : 'Cancel'}
          </button>
        )}
      </div>

      {uploadedUrls && (
        <div className="text-xs space-y-1 bg-gray-50 p-3 rounded">
          <p className="font-medium text-gray-700">Generated URLs:</p>
          <p className="text-gray-600 break-all">
            <span className="font-medium">Thumbnail:</span> {uploadedUrls.thumbnail}
          </p>
          <p className="text-gray-600 break-all">
            <span className="font-medium">Medium:</span> {uploadedUrls.medium}
          </p>
          <p className="text-gray-600 break-all">
            <span className="font-medium">Large:</span> {uploadedUrls.large}
          </p>
        </div>
      )}
    </div>
  );
}
