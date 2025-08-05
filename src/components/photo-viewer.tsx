"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalBody 
} from '@/components/ui';
import { Button } from '@/components/ui';

interface PhotoViewerProps {
  photos: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset to initial index when photos change
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, photos]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
          setIsZoomed(false);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
          setIsZoomed(false);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsZoomed(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length, onClose]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
    setIsZoomed(false);
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  }, [photos.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  const downloadPhoto = useCallback(async () => {
    const photoUrl = photos[currentIndex];
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download photo:', error);
    }
  }, [photos, currentIndex]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      size="fullScreen"
      closeOnEscape={true}
      closeOnOverlayClick={true}
    >
      <ModalHeader onClose={onClose}>
        <ModalTitle>
          Photo {currentIndex + 1} of {photos.length}
        </ModalTitle>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="secondary"
            size="small"
            onClick={toggleZoom}
            title={isZoomed ? 'Fit to screen' : 'Actual size'}
          >
            {isZoomed ? '🔍-' : '🔍+'}
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={downloadPhoto}
            title="Download photo"
          >
            📥
          </Button>
        </div>
      </ModalHeader>
      
      <ModalBody>
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* Navigation arrows */}
          {photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                onClick={goToPrevious}
                title="Previous photo (←)"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M15 18L9 12L15 6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                onClick={goToNext}
                title="Next photo (→)"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M9 18L15 12L9 6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Photo display */}
          <div 
            className={`relative transition-all duration-300 ${
              isZoomed 
                ? 'cursor-zoom-out overflow-auto max-w-none max-h-none' 
                : 'cursor-zoom-in max-w-full max-h-full'
            }`}
            onClick={toggleZoom}
          >
            <Image
              src={currentPhoto}
              alt={`Photo ${currentIndex + 1}`}
              width={isZoomed ? 0 : 1200}
              height={isZoomed ? 0 : 800}
              className={`${
                isZoomed 
                  ? 'w-auto h-auto max-w-none' 
                  : 'w-auto h-auto max-w-full max-h-[80vh] object-contain'
              }`}
              unoptimized={isZoomed}
              priority
            />
          </div>

          {/* Photo thumbnails/indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg p-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsZoomed(false);
                  }}
                  title={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};