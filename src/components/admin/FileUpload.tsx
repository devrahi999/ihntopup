'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import { uploadFile, BUCKETS } from '@/lib/supabase/storage';

interface FileUploadProps {
  bucket: keyof typeof BUCKETS;
  folder?: string;
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
  previewClassName?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

export default function FileUpload({
  bucket,
  folder,
  value,
  onChange,
  onError,
  className = '',
  previewClassName = 'w-full h-32 object-cover rounded-lg',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      onError?.(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (accept !== 'image/*' && !file.type.match(accept)) {
      onError?.(`File type not supported. Please upload ${accept}`);
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload file
    setUploading(true);
    try {
      const { data: uploadedUrl, error } = await uploadFile(BUCKETS[bucket], file, folder);
      
      if (error) {
        onError?.(error);
        setPreviewUrl(null);
      } else if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (error) {
      onError?.('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Clean up object URL
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle remove file
  const handleRemove = () => {
    onChange('');
    setPreviewUrl(null);
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        onError?.(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      // Validate file type
      if (accept !== 'image/*' && !file.type.match(accept)) {
        onError?.(`File type not supported. Please upload ${accept}`);
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload file
      setUploading(true);
      uploadFile(BUCKETS[bucket], file, folder)
        .then(({ data: uploadedUrl, error }) => {
          if (error) {
            onError?.(error);
            setPreviewUrl(null);
          } else if (uploadedUrl) {
            onChange(uploadedUrl);
          }
        })
        .catch((error) => {
          onError?.('Upload failed. Please try again.');
          console.error('Upload error:', error);
        })
        .finally(() => {
          setUploading(false);
          // Clean up object URL
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const displayUrl = previewUrl || value;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Area */}
      {!displayUrl && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <FaUpload className="text-3xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF up to {maxSize / (1024 * 1024)}MB
          </p>
        </div>
      )}

      {/* Preview */}
      {displayUrl && (
        <div className="relative">
          <div className="flex items-center gap-4">
            {displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={displayUrl}
                alt="Preview"
                className={previewClassName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Invalid+Image';
                }}
              />
            ) : (
              <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${previewClassName}`}>
                <FaImage className="text-3xl text-gray-400" />
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <FaUpload />
                {uploading ? 'Uploading...' : 'Change'}
              </button>
              
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaTrash />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Current URL Display (for debugging) */}
      {value && (
        <div className="text-xs text-gray-500 break-all">
          Current: {value}
        </div>
      )}
    </div>
  );
}
