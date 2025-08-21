"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, Card, CardContent } from '@/components/ui';
// import { PhotoViewer } from '@/components/photo-viewer';

interface PhotoUploadProps {
  onPhotosChange?: (photoUrls: string[]) => void;
  maxPhotos?: number;
  existingPhotos?: string[];
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  onPhotosChange, 
  maxPhotos = 10,
  existingPhotos = []
}) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: boolean}>({});

  // Sync with existingPhotos prop changes (important for page refresh)
  useEffect(() => {
    setUploadedPhotos(existingPhotos);
  }, [existingPhotos]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (uploadedPhotos.length + validFiles.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    const newUploadedPhotos = [...uploadedPhotos];

    try {
      for (const file of validFiles) {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: true }));

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        newUploadedPhotos.push(result.url);
        
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }

      setUploadedPhotos(newUploadedPhotos);
      onPhotosChange?.(newUploadedPhotos);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload one or more photos. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
      // Clear the input
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newUploadedPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(newUploadedPhotos);
    onPhotosChange?.(newUploadedPhotos);
  };

  const openViewer = () => {
    // Photo viewer functionality temporarily disabled
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Photos</h3>
            <span className="text-sm text-gray-500">
              {uploadedPhotos.length}/{maxPhotos}
            </span>
          </div>

          {/* Upload Area */}
          <div className={`border-2 border-dashed border-gray-200 rounded-lg p-6 text-center ${uploading ? 'opacity-50' : ''}`}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
              disabled={uploading}
            />
            <label htmlFor="photo-upload" className={`cursor-pointer ${uploading ? 'cursor-not-allowed' : ''}`}>
              <div className="space-y-2">
                <div className="text-4xl">{uploading ? '⏳' : '📷'}</div>
                <p className="text-sm text-gray-600">
                  {uploading ? 'Uploading photos...' : 'Click to upload photos or drag and drop'}
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 10MB each
                </p>
                {Object.keys(uploadProgress).length > 0 && (
                  <p className="text-xs text-blue-600">
                    Uploading {Object.keys(uploadProgress).length} photo(s)...
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Photo Previews */}
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedPhotos.map((photoUrl, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={photoUrl}
                    alt={`Photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openViewer()}
                  />
                  <Button
                    variant="destructive"
                    size="small"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* <PhotoViewer
        photos={uploadedPhotos}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      /> */}
    </Card>
  );
};