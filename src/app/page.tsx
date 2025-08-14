"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to components page
    router.replace('/components');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
        <p className="text-sm text-gray-700">Redirecting to components...</p>
      </div>
    </div>
  );
}