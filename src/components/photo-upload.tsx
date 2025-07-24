"use client"

import React, { useState } from 'react';
import { Button, Card, CardContent } from '@/components/ui';

interface PhotoUploadProps {
  onPhotosChange?: (photos: File[]) => void;
  maxPhotos?: number;
  existingPhotos?: string[];
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  onPhotosChange, 
  maxPhotos = 10,
  existingPhotos = []
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingPhotos);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (photos.length + validFiles.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const newPhotos = [...photos, ...validFiles];
    setPhotos(newPhotos);

    // Create previews
    const newPreviews = [...previews];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    onPhotosChange?.(newPhotos);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosChange?.(newPhotos);
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Photos</h3>
            <span className="text-sm text-gray-500">
              {photos.length + existingPhotos.length}/{maxPhotos}
            </span>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="space-y-2">
                <div className="text-4xl">📷</div>
                <p className="text-sm text-gray-600">
                  Click to upload photos or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 10MB each
                </p>
              </div>
            </label>
          </div>

          {/* Photo Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="small"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};