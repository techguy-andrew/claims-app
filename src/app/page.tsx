"use client";

import { useRouter } from 'next/navigation';
import { TopBar, TopbarAction } from '@/components/navigation/topbar';
import { useSidebar } from '@/components/navigation';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { toggle } = useSidebar();

  return (
    <div>
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <TopBar
        title="Dashboard"
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <TopbarAction
            icon={Plus}
            label="New Claim"
            variant="primary"
            onClick={() => router.push('/claims/new')}
          />
        }
      />
      <div className="p-4 sm:p-6 space-y-8">
        {/* Premium Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div style={{ animation: 'slideUp 0.6s ease-out 100ms both' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Claims</h3>
                <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  📋
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-600">No claims yet</p>
            </div>
          </div>

          <div style={{ animation: 'slideUp 0.6s ease-out 200ms both' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Claims</h3>
                <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                  📊
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-600">Currently in progress</p>
            </div>
          </div>

          <div style={{ animation: 'slideUp 0.6s ease-out 300ms both' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Completed</h3>
                <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  ✅
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-600">Successfully resolved</p>
            </div>
          </div>
        </div>

        {/* Premium Secondary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={{ animation: 'slideUp 0.6s ease-out 400ms both' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Claims</h3>
                <p className="text-sm text-gray-600">Your latest submitted claims</p>
              </div>
              <div className="text-center py-12 text-gray-500">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl w-fit mx-auto mb-4">
                  📋
                </div>
                <p>No claims yet. Create your first claim to get started.</p>
              </div>
            </div>
          </div>

          <div style={{ animation: 'slideUp 0.6s ease-out 500ms both' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h3>
                <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/claims/new')}
                  className="w-full flex items-center justify-start gap-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 text-gray-700"
                >
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    +
                  </div>
                  Create New Claim
                </button>
                <button 
                  onClick={() => router.push('/claims')}
                  className="w-full flex items-center justify-start gap-3 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 text-gray-700"
                >
                  <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    📋
                  </div>
                  View All Claims
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}