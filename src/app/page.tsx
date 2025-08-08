"use client";

import { useRouter } from 'next/navigation';
import { Plus, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 mb-1">Dashboard</h1>
                  <p className="text-sm text-gray-600">Premium insurance claims platform</p>
                </div>
                <Button 
                  onClick={() => router.push('/claims/new')}
                  variant="modern"
                  size="small"
                >
                  <Plus className="h-4 w-4" />
                  New Claim
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Claims</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-600">No claims yet</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Active Claims</h3>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-600">Currently in progress</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Completed</h3>
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-600">Successfully resolved</p>
            </div>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Claims</h3>
                <p className="text-sm text-gray-600">Your latest submitted claims</p>
              </div>
              <div className="text-center py-12 text-gray-500">
                <div className="p-4 bg-gray-50 rounded-lg w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">No claims yet. Create your first claim to get started.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/claims/new')}
                  variant="modern"
                  size="small"
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4" />
                  Create New Claim
                </Button>
                <Button 
                  onClick={() => router.push('/claims')}
                  variant="secondary"
                  size="small"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4" />
                  View All Claims
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}