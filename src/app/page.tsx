"use client";

import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { TopBar } from '@/components/navigation/topbar';
import { useSidebar } from '@/components/navigation';

export default function Dashboard() {
  const { toggle } = useSidebar();

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle="Manage your insurance claims efficiently"
        showMenuButton={true}
        onMenuToggle={toggle}
        actions={
          <Link href="/claims/new">
            <Button>
              <span style={{ marginRight: '0.5rem' }}>+</span>
              New Claim
            </Button>
          </Link>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Total Claims</CardTitle>
              <div style={{ fontSize: '1.5rem', opacity: 0.6 }}>📋</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">
              No claims yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Claims</CardTitle>
              <div style={{ fontSize: '1.5rem', opacity: 0.6 }}>📊</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Completed</CardTitle>
              <div style={{ fontSize: '1.5rem', opacity: 0.6 }}>✅</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
            <CardDescription>
              Your latest submitted claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No claims yet. Create your first claim to get started.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/claims/new" className="block">
                <Button variant="secondary" fullWidth className="justify-start">
                  <span style={{ marginRight: '0.5rem' }}>+</span>
                  Create New Claim
                </Button>
              </Link>
              <Link href="/claims" className="block">
                <Button variant="secondary" fullWidth className="justify-start">
                  <span style={{ marginRight: '0.5rem' }}>📋</span>
                  View All Claims
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
}