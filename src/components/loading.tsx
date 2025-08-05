"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]} ${className}`} />
  );
};

interface LoadingCardProps {
  title?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  title = 'Loading...', 
  description,
  size = 'medium' 
}) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-900 font-medium">{title}</p>
      {description && (
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

interface LoadingPageProps {
  title?: string;
  description?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  title = 'Loading...', 
  description 
}) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="large" className="mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  </div>
);

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Loading...' 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 text-center">
        <LoadingSpinner size="large" className="mx-auto mb-4" />
        <p className="text-gray-900 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Skeleton loading components
export const SkeletonLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <Card>
    <CardContent className="space-y-4 py-6">
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="w-1/2" />
      <SkeletonLine className="w-5/6" />
      <div className="flex space-x-2">
        <SkeletonLine className="w-20 h-8" />
        <SkeletonLine className="w-16 h-8" />
      </div>
    </CardContent>
  </Card>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLine key={colIndex} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);