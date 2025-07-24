import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your insurance claims and inspections efficiently
          </p>
        </div>
        <Link href="/claims/new">
          <Button>
            <span style={{ marginRight: '0.5rem' }}>+</span>
            New Claim
          </Button>
        </Link>
      </div>

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
              <Link href="/inspections" className="block">
                <Button variant="secondary" fullWidth className="justify-start">
                  <span style={{ marginRight: '0.5rem' }}>🔍</span>
                  View Inspections
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}