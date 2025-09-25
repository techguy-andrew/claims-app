import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/active-components/card'
import { MetricCard } from '@/components/custom/MetricCard'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Claims App - Dashboard',
  description: 'Dashboard overview and analytics',
}

export default async function DashboardPage() {
  // Fetch status metrics from database
  const statusMetrics = await prisma.claim.groupBy({
    by: ['status'],
    _count: {
      id: true
    }
  })

  // Get total count
  const totalClaims = await prisma.claim.count()

  // Transform data for easier usage
  const metrics = {
    PENDING: statusMetrics.find(m => m.status === 'PENDING')?._count.id ?? 0,
    UNDER_REVIEW: statusMetrics.find(m => m.status === 'UNDER_REVIEW')?._count.id ?? 0,
    APPROVED: statusMetrics.find(m => m.status === 'APPROVED')?._count.id ?? 0,
    REJECTED: statusMetrics.find(m => m.status === 'REJECTED')?._count.id ?? 0,
    CLOSED: statusMetrics.find(m => m.status === 'CLOSED')?._count.id ?? 0,
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Overview and analytics for your claims management.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Pending Claims"
              value={metrics.PENDING}
              total={totalClaims}
              variant="pending"
            />
            <MetricCard
              title="Under Review"
              value={metrics.UNDER_REVIEW}
              total={totalClaims}
              variant="under-review"
            />
            <MetricCard
              title="Approved Claims"
              value={metrics.APPROVED}
              total={totalClaims}
              variant="approved"
            />
            <MetricCard
              title="Rejected Claims"
              value={metrics.REJECTED}
              total={totalClaims}
              variant="rejected"
            />
            <MetricCard
              title="Closed Claims"
              value={metrics.CLOSED}
              total={totalClaims}
              variant="closed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}