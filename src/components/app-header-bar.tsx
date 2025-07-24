"use client"

import { Button } from '@/components/ui';

export const AppHeaderBar: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Welcome to Claims App</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" size="small">
          👤 Profile
        </Button>
      </div>
    </header>
  );
};